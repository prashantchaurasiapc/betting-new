# Architecture

## Purpose

GeniePicks predicts NBA player prop outcomes (PTS, REB, AST, etc.) for daily slates. For each player–market–side combination, it produces a projection, a probability, an edge, and a strength band, then writes those to a database that feeds a web UI and API.

## Component diagram

```
EXTERNAL SOURCES                INGESTION              FEATURE LAYER
────────────────                ───────────            ─────────────
NBA Stats API        ─────┐                          ┌─ feat_player_rolling
The Odds API         ─────┼─►  Celery workers  ────► ├─ feat_player_advanced
PBP Stats            ─────┤    (Python)              ├─ feat_matchup_context
Injury feed          ─────┤                          ├─ feat_team_factors
Historical data      ─────┘                          └─ feat_prop_lines
                                                            │
                                                            ▼
                                                     MODEL PIPELINE
                                                     ──────────────
                                                     Stage 1: p_active
                                                          │
                                                          ▼
                                                     Stage 2: minutes
                                                          │
                                                          ▼
                                                     Stage 3: usage
                                                          │
                                                          ▼
                                                     Stage 4: efficiency
                                                          │
                                                          ▼
                                                     Stage 5: totals
                                                          │
                                                          ▼
                                                     CALIBRATION
                                                          │
                                                          ▼
                                                     RISK LAYER (Phase 1)
                                                     ────────────────────
                                                     coherence_score
                                                     display_strength_band
                                                          │
                                                          ▼
                                                     PERSISTENCE
                                                     ───────────
                                                     fact_picks_daily
                                                          │
                                                          ▼
                                                     API  ─►  UI
                                                     (.NET)    (SvelteKit)
```

## Responsibilities per layer

### Ingestion

Celery tasks pull from external sources on schedules. Each task:
- Writes to a raw fact table (e.g., `fact_player_game_log`, `fact_prop_lines`)
- Logs a freshness timestamp
- Retries on rate-limit errors with exponential backoff
- Emits a task-level success log used by monitoring

No transformation happens here beyond normalization (e.g., NBA Stats API responses mapped to our schema).

### Feature engineering

Separate Celery tasks read fact tables and compute features into `feat_*` tables. Features are:
- Rolling aggregates (L3, L5, L10, L20)
- EWMA variants at multiple half-lives
- Matchup-derived (opponent defense by position, pace differential)
- Schedule-derived (rest days, back-to-backs, season progression)

Features do not encode model logic. They are pre-computed values any model can read.

### Model pipeline

`run_model.py` orchestrates inference for each slate. It:
1. Loads per-market pickled models from disk
2. For each (player, market, side) on the slate, assembles a feature row from `feat_*` tables
3. Runs the feature row through the 5-stage hierarchical pipeline
4. Produces projection, probability, and metadata
5. Hands the result to `FactWriter` for persistence

Details in [`model-pipeline.md`](./model-pipeline.md).

### Calibration

Between raw model probability and final probability, an isotonic calibrator maps `p_raw → p_cal` per market. Calibrators are fit nightly from resolved picks and loaded at inference time.

Details in [`calibration.md`](./calibration.md).

### Risk layer (Phase 1, shipped)

After the engine produces `strength_band`, coherence scoring evaluates whether rolling-form signals agree with the engine's direction. If coherence is low, `display_strength_band` is demoted one or two tiers. This is the layer that just shipped and is currently in a 14-day / 300-pick evaluation window.

Details in `docs/Other/Data Foundation/risk-model-spec.md`.

### Persistence

`FactWriter.upsert_picks` writes one row per (pick_date, model_id, game_id, player_id, market, side) to `fact_picks_daily`. The write is idempotent — subsequent runs for the same slate update rather than insert. This is pure persistence; no compute happens in the writer.

### API

A .NET API reads from `fact_picks_daily` and serves pick cards, matchup analysis, and pick lists to the SvelteKit frontend. No inference happens in the API layer; it only serves pre-computed predictions.

## Orchestration

All compute tasks run under Celery:
- **`celery-worker`** — executes tasks
- **`celery-beat`** — schedules periodic tasks (hourly ingestion, nightly calibration, slate-based scoring)
- **Broker:** Redis
- **Results backend:** Redis

Docker Compose orchestrates the containers on a single host. No Kubernetes, no Spark, no distributed compute. The problem size (hundreds of thousands of training rows, thousands of daily inferences) fits on one machine comfortably.

## Storage

- **PostgreSQL with TimescaleDB extension** — primary database. Every table above lives here.
- **Redis** — Celery broker and inference-time cache for frequently-read features.
- **Local disk** (`/models/`) — pickled model artifacts and calibration bundles, mounted as a Docker volume.

Details in [`database-schema.md`](./database-schema.md).

## Request lifecycle — a concrete example

User loads Top Picks page → .NET API issues query against `fact_picks_daily` → picks render on the Svelte card.

That sequence reads from data written hours earlier by this pipeline:

1. Overnight: `ingest_player_advanced_stats` updates `fact_player_advanced` with last night's games
2. Early morning: `build_feat_player_rolling` recomputes rolling averages
3. Morning: `ingest_prop_lines` fetches today's betting lines from The Odds API
4. Morning: `run_model` scores today's slate — for each prop, assembles a feature vector, runs the 5-stage pipeline, applies calibration, applies risk layer, writes to `fact_picks_daily`
5. Afternoon: re-run on line movements or injury updates if significant
6. User request at any time: API reads latest rows and returns to UI

## What's new in v2

- Hierarchical 5-stage pipeline (previously: single model per market)
- Calibration activated (previously: off, `p_cal` == `p_raw`)
- ~300 features (previously: 15)
- New data sources: NBA Stats API advanced stats, The Odds API tier upgrade, optional injury feed
- Minutes model as first-class component

Details and deliverables in [`implementation-phases.md`](./implementation-phases.md).
