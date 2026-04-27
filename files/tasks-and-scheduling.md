# Tasks and Scheduling

Every Celery task in the GeniePicks pipeline with its inputs, outputs, schedule, and dependencies.

## Task inventory summary

| Task | Schedule | Phase | Purpose |
|---|---|---|---|
| `ingest_prop_lines` | Every 15 min, slate hours | Existing | Fetch prop lines from Odds API |
| `ingest_player_game_log` | Nightly 2 AM ET | Existing | Player box scores from NBA Stats |
| `build_team_factors` | Hourly during slate hours | Existing | Team-level rolling features |
| `build_feat_player_rolling` | Nightly 3 AM ET | Existing (extended) | Player rolling features |
| `build_feat_matchup_context` | Nightly 3 AM ET | Existing (extended) | Opponent/matchup features |
| `run_model` | Per-market, slate day | Existing (extended) | Generate predictions |
| `resolve_prop_results` | Nightly after games | Existing | Grade resolved picks |
| **`ingest_player_advanced_stats`** | **Nightly 3 AM ET** | **M2 new** | NBA Stats API advanced box scores |
| **`ingest_team_advanced_stats`** | **Nightly 3 AM ET** | **M2 new** | Team advanced stats |
| **`ingest_play_by_play`** | **Nightly 3 AM ET** | **M2 new (optional)** | Raw play-by-play events |
| **`build_feat_player_advanced_rolling`** | **Nightly 4 AM ET** | **M3 new** | Rolling advanced stats |
| **`build_feat_possessions_filtered`** | **Nightly 4 AM ET** | **M3 new** | Garbage-time filtering |
| **`ingest_injury_events`** | **Every 15 min, slate day** | **M2-M3 optional** | Injury feed polling |
| **`fit_calibration_models`** | **Nightly 4 AM ET** | **M1 new** | Per-market isotonic calibration |
| **`train_minutes_model`** | **Weekly** | **M4 new** | Retrain minutes model |
| **`train_stage_models`** | **Weekly** | **M5 new** | Retrain hierarchical stages |

## Task execution environment

All tasks run in `celery-worker` container. Long-running tasks (training, backfills) should use longer soft/hard time limits than default. Configure per-task via Celery task decorators:

```python
@celery_app.task(
    bind=True,
    soft_time_limit=3600,   # 1 hour
    time_limit=3660,
    autoretry_for=(requests.RequestException,),
    retry_backoff=True,
    retry_backoff_max=600,
    max_retries=5
)
def ingest_player_advanced_stats(self, date=None, backfill_mode=False):
    ...
```

Celery Beat schedule lives in `workers/celery_app.py`:
```python
app.conf.beat_schedule = {
    'ingest-prop-lines': {
        'task': 'workers.tasks.ingest_prop_lines.ingest_prop_lines',
        'schedule': crontab(minute='*/15', hour='10-23'),
    },
    'ingest-player-advanced-stats': {
        'task': 'workers.tasks.ingest_player_advanced_stats.ingest_player_advanced_stats',
        'schedule': crontab(minute=0, hour=3),
    },
    'fit-calibration-models': {
        'task': 'workers.tasks.fit_calibration_models.fit_calibration_models',
        'schedule': crontab(minute=0, hour=4),
    },
    # etc.
}
```

## Task dependency graph

```
ingest_prop_lines ────────┐
ingest_player_game_log ───┼───► build_feat_player_rolling ──┐
ingest_player_advanced ───┤     build_feat_player_adv_rolling│
ingest_play_by_play ──────┘     build_feat_possessions_filt ─┤
                                                              ▼
                                build_team_factors ───► build_feat_matchup_context
                                                                      │
                                                                      ▼
                                                                run_model
                                                                      │
                                                                      ▼
                                                            [persist to fact_picks_daily]
                                                                      │
                                                                      ▼
                                                              resolve_prop_results
                                                                      │
                                                                      ▼
                                                              fit_calibration_models
```

Celery handles dependencies via task chaining or by scheduling tasks at offsets that ensure upstream data is fresh.

## Detailed task specifications

### `ingest_player_advanced_stats`

**New in M2.**

**Purpose:** Ingest per-game advanced box scores from NBA Stats API `boxscoreadvancedv2` and `boxscoreusagev2` endpoints.

**Inputs:**
- `date` (optional) — defaults to yesterday
- `backfill_mode` (bool) — if true, pulls all games in date range

**Outputs:** Rows in `fact_player_advanced`.

**Schedule:** Nightly at 3 AM ET.

**Dependencies:** Requires `fact_games` to have the target date's games first (ensured by scheduling offset).

**Rate limiting:** 1 request per 1.5 seconds. Retry with exponential backoff on 429 responses.

**Implementation sketch:**
```python
def ingest_player_advanced_stats(date=None, backfill_mode=False):
    if date is None:
        date = (datetime.utcnow() - timedelta(days=1)).date()
    
    games = db.query(
        "SELECT game_id FROM fact_games WHERE game_date = %s",
        [date]
    ).fetchall()
    
    for game_id in games:
        try:
            adv = boxscoreadvancedv2.BoxScoreAdvancedV2(game_id=game_id)
            usage = boxscoreusagev2.BoxScoreUsageV2(game_id=game_id)
            rows = transform_to_fact_player_advanced(adv, usage, game_id, date)
            upsert_rows(rows, 'fact_player_advanced')
            time.sleep(1.5)
        except Exception as e:
            logger.error(f"Failed game_id={game_id}: {e}")
            raise
```

---

### `build_feat_player_advanced_rolling`

**New in M3.**

**Purpose:** Compute rolling advanced stats features (L5, L10, L20) and garbage-time-filtered variants.

**Schedule:** Nightly at 4 AM ET, after ingest tasks complete.

**Dependencies:** `fact_player_advanced` (for normal rolling), `fact_possessions` with `is_garbage_time` flag (for filtered).

**Outputs:** Rows in `feat_player_advanced_rolling` for each (player, as_of_date).

**Implementation approach:**
- For each active player, query last 20 games of advanced stats
- Compute rolling averages, standard deviations, EWMA variants
- Compute filtered versions using only non-garbage-time possessions
- Upsert to feature table

---

### `ingest_injury_events`

**New in M2-M3 (depends on injury feed decision).**

**Purpose:** Poll injury feed (RotoWire, official NBA, or free alternative) for status changes.

**Schedule:** Every 15 minutes during slate days; less frequent off-days.

**Inputs:** None (polls external feed).

**Outputs:** New rows in `fact_injury_events` for any observed status changes.

**Deduplication:** Use `source_id` to avoid duplicate ingestion of same news item.

**Special handling:** On observed status downgrade for a player in today's slate, trigger downstream `run_model` re-run for affected players.

---

### `fit_calibration_models`

**New in M1.**

**Purpose:** Fit per-market isotonic regression calibration models nightly.

**Schedule:** 4 AM ET.

**Dependencies:** `fact_picks_daily`, `fact_prop_results` (graded outcomes must be fresh).

**Outputs:** Pickle files in `/models/calibration/`, rows in `calibration_artifacts`.

**Full spec:** See `calibration.md`.

---

### `train_minutes_model`

**New in M4.**

**Purpose:** Retrain Stage 2 minutes projection model.

**Schedule:** Weekly, Sunday 5 AM ET.

**Dependencies:** `fact_player_game_log` for targets, feature tables for inputs.

**Outputs:** Pickle in `/models/stage_2/minutes/`, row in `ml_model_meta`.

**Process:**
1. Build training dataset: all player-games from last 3 seasons with non-zero minutes
2. Build feature matrix from snapshot of feature tables as-of each game date
3. Train XGBoost with quantile regression
4. Validate on held-out 10% time-based split (not random split — avoid leakage)
5. If new model `val_rmse` within 10% of current active model: activate
6. Else: alert and leave current active

---

### `train_stage_models`

**New in M5.**

**Purpose:** Retrain hierarchical stage models (usage, efficiency).

**Schedule:** Weekly.

**Dependencies:** Stage 2 output (minutes_projection needs to be a feature in Stage 3).

**Outputs:** Per-market pickles for Stages 3 and 4, plus ensemble weights.

---

### `resolve_prop_results` (existing)

**Already shipped in Phase 1 infrastructure.**

**Purpose:** Grade resolved picks by joining `fact_picks_daily` to `fact_player_game_log` results.

**Schedule:** Nightly after games complete.

**Outputs:** Rows in `fact_prop_results` with `hit`, `voided`, `actual_value`.

**Dependencies for v2:** No changes needed.

---

## Monitoring

Every task writes a row to `task_runs`:
```python
@before_task_publish.connect
def log_task_start(...):
    db.insert('task_runs', {
        'task_name': task.name,
        'task_id': task.request.id,
        'started_at': datetime.utcnow(),
        'status': 'started',
        'task_kwargs': json.dumps(kwargs)
    })

@task_success.connect
def log_task_success(...):
    db.update('task_runs', ...)
```

Dashboard queries on `task_runs`:
- Task failure rate by day
- Average task duration
- Stale-data detection (task hasn't run in expected window)
- Rows written per ingestion task (detect silent partial failures)

## Backfill handling

One-time historical backfills (for M2 deliverables) run as parameterized versions of the same tasks:

```bash
# Backfill 2016-17 season advanced stats
docker compose exec celery-worker celery -A workers.celery_app call \
  workers.tasks.ingest_player_advanced_stats \
  --kwargs='{"date": "2016-10-25", "backfill_mode": true, "date_range_end": "2017-06-20"}'
```

Backfills should:
- Rate-limit more aggressively than real-time ingestion (1 req per 2 seconds)
- Write progress to logs regularly
- Support resumption from last completed date on failure
- Avoid running during live slate hours to prevent rate-limit conflicts
