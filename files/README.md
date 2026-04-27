# GeniePicks Modeling Core — Documentation

This directory contains the authoritative specification for GeniePicks' NBA prop prediction modeling core. It is the reference a developer, analyst, or future maintainer should consult before touching model code, adding features, or changing the data pipeline.

## Audience

- **Developers implementing modeling work** — read `architecture.md`, `model-pipeline.md`, and `implementation-phases.md` first, then the feature and schema references as needed.
- **Data engineers adding ingestion** — read `data-sources.md` and `tasks-and-scheduling.md`.
- **Analysts validating the model** — read `feature-reference.md` and `calibration.md`.
- **Anyone new to the project** — start with `architecture.md` and `glossary.md`.

## Document index

| File | Purpose |
|---|---|
| [`architecture.md`](./architecture.md) | System overview, component responsibilities, data flow |
| [`data-sources.md`](./data-sources.md) | External data sources with endpoints, schedules, costs |
| [`feature-reference.md`](./feature-reference.md) | Every feature with computation, source, range, rationale |
| [`model-pipeline.md`](./model-pipeline.md) | The 5-stage hierarchical architecture in depth |
| [`calibration.md`](./calibration.md) | Calibration approach, training cadence, gating criteria |
| [`database-schema.md`](./database-schema.md) | Tables with columns, types, purpose |
| [`tasks-and-scheduling.md`](./tasks-and-scheduling.md) | Celery tasks with inputs, outputs, schedule |
| [`implementation-phases.md`](./implementation-phases.md) | Phase M1–M6 deliverables and acceptance criteria |
| [`glossary.md`](./glossary.md) | Domain terms defined |
| [`examples/`](./examples/) | Sample feature rows, prediction outputs, test vectors |

## How this relates to existing docs

- **Risk layer spec** (`docs/Other/Data Foundation/risk-model-spec.md`) — the Phase 1 coherence layer that sits on top of the model pipeline. Independent, already shipped.
- **Modeling core v2 spec** (this directory) — the modeling engine that produces projections and probabilities. The risk layer consumes its outputs.

Both are versioned in this repo. If they diverge, `docs/Other/Data Foundation/risk-model-spec.md` is authoritative for risk layer behavior and the files in this directory are authoritative for model behavior.

## Status

- **Spec version:** 2.0
- **Last substantive update:** 2026-04-24
- **Current implementation state:** Phase 1 risk layer shipped; modeling core v2 spec drafted and pending backtest resolution before Phase M1 begins.

## Reading order for new developers

1. `architecture.md` — understand the system
2. `glossary.md` — learn the vocabulary
3. `database-schema.md` — understand the data layout
4. `model-pipeline.md` — understand what we're building
5. `feature-reference.md` — the feature catalog (reference, not cover-to-cover)
6. `implementation-phases.md` — know what ships when

Total reading time for the first five documents: roughly 90 minutes.

## Conventions used across these documents

- **Code identifiers** appear in `monospace`.
- **Feature names** follow snake_case with suffix indicating window (e.g., `pts_l5`, `usage_rate_l10`).
- **Table names** follow `prefix_name` convention: `fact_*` for event records, `feat_*` for computed features, `dim_*` for dimensions, `ml_*` for model metadata.
- **Time windows** are expressed in games (L3, L5, L10, L20) or days where noted.
- **Probabilities** are in `[0, 1]` unless otherwise stated.
- **Percentages** on player stats (usage, TOV%, AST%) are expressed as percents (e.g., 27.1 for 27.1%), not decimals.
