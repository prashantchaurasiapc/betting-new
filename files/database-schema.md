# Database Schema

GeniePicks uses PostgreSQL with the TimescaleDB extension. All tables live in a single database. This document catalogs the schema as it should exist after the v2 modeling core migrations are applied.

## Schema naming conventions

- `dim_*` — dimension tables (entities that don't change frequently)
- `fact_*` — event and observation tables (time-series, high-volume)
- `feat_*` — computed feature tables (derived from facts)
- `ml_*` — machine learning metadata and artifacts
- `task_*` — task orchestration metadata (Celery, scheduling)

## Existing tables (Phase 1 shipped)

### `dim_players`
Player dimension table.

| Column | Type | Notes |
|---|---|---|
| `player_id` | bigint PK | NBA stable player ID |
| `full_name` | text | Player's full name |
| `position` | text | Primary position (PG, SG, SF, PF, C) |
| `team_id` | bigint FK | Current team |
| `height_cm` | int | |
| `weight_kg` | int | |
| `draft_year` | int | |
| `experience_years` | int | Computed as current_season - draft_year |
| `active` | boolean | Is currently on an NBA roster |
| `updated_at` | timestamptz | Last update |

### `dim_teams`
Team dimension table.

| Column | Type | Notes |
|---|---|---|
| `team_id` | bigint PK | NBA stable team ID |
| `abbrev` | text | 3-letter abbreviation (ATL, BOS, etc.) |
| `full_name` | text | |
| `conference` | text | East/West |
| `division` | text | |

### `fact_games`
One row per game.

| Column | Type | Notes |
|---|---|---|
| `game_id` | bigint PK | NBA stable game ID |
| `game_date` | date | |
| `game_datetime_utc` | timestamptz | |
| `home_team_id` | bigint FK | |
| `away_team_id` | bigint FK | |
| `season_type` | text | Regular Season, Playoffs, Preseason |
| `venue` | text | |
| `vegas_total` | numeric | Game total |
| `vegas_spread` | numeric | Signed spread (negative = home favored) |
| `vegas_moneyline_home` | int | |
| `vegas_moneyline_away` | int | |
| `closing_total` | numeric | Set post-game for backtesting |
| `final_score_home` | int | |
| `final_score_away` | int | |
| `created_at` | timestamptz | |

### `fact_player_game_log`
One row per player per game they appeared in.

| Column | Type | Notes |
|---|---|---|
| `player_id` | bigint FK | |
| `game_id` | bigint FK | |
| `team_id` | bigint FK | Team they played for this game |
| `game_date` | date | |
| `minutes_played` | numeric | |
| `pts` | int | |
| `reb` | int | |
| `ast` | int | |
| `stl` | int | |
| `blk` | int | |
| `tov` | int | |
| `fg3m` | int | Three-pointers made |
| `fga` | int | Field goal attempts |
| `fta` | int | Free throw attempts |
| `fgm` | int | |
| `ftm` | int | |
| `is_starter` | boolean | |
| `plus_minus` | int | |
| `created_at` | timestamptz | |

Primary key: `(player_id, game_id)`.

### `fact_prop_lines`
Prop line observations over time.

| Column | Type | Notes |
|---|---|---|
| `id` | bigserial PK | |
| `game_id` | bigint FK | |
| `player_id` | bigint FK | |
| `market` | text | PTS, REB, AST, etc. |
| `side` | text | OVER or UNDER |
| `line` | numeric | |
| `price_american` | int | |
| `book_name` | text | |
| `observed_at` | timestamptz | When the line was captured |

Index on `(game_id, player_id, market, observed_at DESC)`.

### `fact_props_odds` (stores latest snapshot per prop)
Latest-line-per-prop for fast UI queries.

| Column | Type | Notes |
|---|---|---|
| `game_id` | bigint FK | |
| `player_id` | bigint FK | |
| `market` | text | |
| `line` | numeric | |
| `over_price` | int | |
| `under_price` | int | |
| `book_name` | text | Primary book |
| `opening_line` | numeric | First line captured — **NEW with tier upgrade** |
| `closing_line` | numeric | Line at tip-off |
| `consensus_line` | numeric | Median across books — **NEW with tier upgrade** |
| `line_update_count` | int | |
| `updated_at` | timestamptz | |

Primary key: `(game_id, player_id, market)`.

### `fact_pp_lines`
PrizePicks-specific lines (separate from sportsbook lines).

| Column | Type | Notes |
|---|---|---|
| `player_id` | bigint FK | |
| `game_date` | date | |
| `market` | text | |
| `line` | numeric | |
| `updated_at` | timestamptz | |

### `fact_picks_daily`
The core pick writing target. One row per (date, model, game, player, market, side).

| Column | Type | Notes |
|---|---|---|
| `pick_date` | date | |
| `model_id` | text | e.g., `xgb-pts-20260420-060022` |
| `game_id` | bigint FK | |
| `player_id` | bigint FK | |
| `market` | text | |
| `side` | text | |
| `projection` | numeric | Model point estimate |
| `line` | numeric | Prop line at write time |
| `edge` | numeric | `projection - line` |
| `norm_edge` | numeric | `edge / sigma` |
| `strength_band` | text | Strong Lean, Lean, Marginal, Pass |
| `reasons` | jsonb | Model-provided reasons array |
| `stats_snapshot` | jsonb | Full feature/output snapshot for audit |
| `freshness_ts` | timestamptz | When this row was computed |
| `rank` | int | Model rank within slate |
| `sample_count` | int | Number of games used to compute |
| `p_cal` | numeric | Calibrated probability |
| **`coherence_score`** | numeric | **Phase 1 risk layer** |
| **`coherence_checks`** | jsonb | **Phase 1 risk layer** |
| **`display_strength_band`** | text | **Phase 1 risk layer** |
| **`demotion_reason`** | text | **Phase 1 risk layer** |

Primary key: `(pick_date, model_id, game_id, player_id, market, side)`.

### `fact_prop_results`
Graded outcomes for backtesting.

| Column | Type | Notes |
|---|---|---|
| `id` | bigserial PK | |
| `game_id` | bigint FK | |
| `player_id` | bigint FK | |
| `market` | text | |
| `side` | text | OVER or UNDER |
| `line_at_prediction` | numeric | |
| `actual_value` | numeric | Final stat value |
| `hit` | boolean | Null if voided |
| `voided` | boolean NOT NULL | |
| `graded_at` | timestamptz | |

### `ml_model_meta`
Registry of trained models.

| Column | Type | Notes |
|---|---|---|
| `model_id` | text PK | e.g., `xgb-pts-20260420-060022` |
| `market` | text | |
| `stage` | text | **NEW in v2** — stage_1 through stage_5 |
| `model_type` | text | xgboost, lightgbm, mlp, isotonic |
| `fit_timestamp` | timestamptz | |
| `val_rmse` | numeric | Validation RMSE |
| `val_auc` | numeric | For classification models |
| `feature_count` | int | |
| `training_sample_count` | int | |
| `is_active` | boolean | Used in current production inference |
| `artifact_path` | text | Location on disk |
| `hyperparameters` | jsonb | |

## New tables for v2 modeling core

### `fact_player_advanced`
Per-game advanced stats from NBA Stats API `boxscoreadvancedv2` + `boxscoreusagev2`.

| Column | Type | Notes |
|---|---|---|
| `player_id` | bigint FK | |
| `game_id` | bigint FK | |
| `game_date` | date | |
| `usage_rate` | numeric | USG% |
| `true_shooting_pct` | numeric | TS% |
| `effective_fg_pct` | numeric | eFG% |
| `assist_pct` | numeric | AST% |
| `tov_pct` | numeric | TOV% |
| `rebound_pct` | numeric | REB% |
| `off_rating` | numeric | ORtg |
| `def_rating` | numeric | DRtg |
| `net_rating` | numeric | NetRtg |
| `pace` | numeric | Team pace while on floor |
| `psa` | numeric | Points per shot attempt × 100 |
| `created_at` | timestamptz | |

Primary key: `(player_id, game_id)`.

### `fact_play_by_play`
Event-level play-by-play data. High volume — consider TimescaleDB hypertable.

| Column | Type | Notes |
|---|---|---|
| `game_id` | bigint | |
| `event_number` | int | |
| `period` | int | |
| `clock_seconds_remaining` | numeric | |
| `home_score` | int | |
| `away_score` | int | |
| `score_differential` | int | |
| `event_type` | text | Shot, Turnover, Rebound, etc. |
| `player_id` | bigint | Primary actor |
| `secondary_player_id` | bigint | e.g., assister on a basket |
| `event_description` | text | |
| `raw_event` | jsonb | Full event from API |

Primary key: `(game_id, event_number)`.

### `fact_possessions`
Parsed possessions from `pbpstats` library.

| Column | Type | Notes |
|---|---|---|
| `possession_id` | bigserial PK | |
| `game_id` | bigint FK | |
| `offensive_team_id` | bigint | |
| `defensive_team_id` | bigint | |
| `period` | int | |
| `start_time_seconds` | int | Seconds remaining at start |
| `end_time_seconds` | int | Seconds remaining at end |
| `duration_seconds` | numeric | Length of possession |
| `points_scored` | int | |
| `result` | text | Made shot, missed shot, turnover, etc. |
| `players_on_court` | bigint[] | Array of 10 player_ids |
| `ball_handler_id` | bigint | |
| `score_differential_at_start` | int | |
| `is_garbage_time` | boolean | Computed per garbage-time rules |
| `created_at` | timestamptz | |

Index on `(game_id, period, start_time_seconds)`.

### `fact_team_advanced`
Team-level advanced stats.

| Column | Type | Notes |
|---|---|---|
| `team_id` | bigint FK | |
| `game_id` | bigint FK | |
| `game_date` | date | |
| `off_rating` | numeric | |
| `def_rating` | numeric | |
| `net_rating` | numeric | |
| `pace` | numeric | |
| `effective_fg_pct` | numeric | |
| `three_point_attempt_rate` | numeric | |
| `rebound_pct` | numeric | |
| `tov_pct` | numeric | |
| `created_at` | timestamptz | |

Primary key: `(team_id, game_id)`.

### `fact_injury_events`
Injury status observations with timestamps.

| Column | Type | Notes |
|---|---|---|
| `id` | bigserial PK | |
| `player_id` | bigint FK | |
| `team_id` | bigint FK | |
| `status` | text | Active, Questionable, Doubtful, Out, Game-Time Decision |
| `reason_category` | text | Rest, Soft Tissue, Bone, Illness, Personal, Unknown |
| `reason_raw` | text | Original reason text |
| `game_id` | bigint FK | Game this status applies to |
| `observed_at` | timestamptz | When this observation was recorded |
| `source` | text | rotowire, nba_official, twitter, etc. |
| `source_id` | text | Source's unique identifier for this news item |
| `raw_text` | text | Original news text |

Index on `(player_id, observed_at DESC)`.

### `feat_player_rolling`
Pre-computed rolling features. One row per player per as-of-date.

| Column | Type | Notes |
|---|---|---|
| `player_id` | bigint FK | |
| `as_of_date` | date | |
| `as_of_ts` | timestamptz | Exact timestamp (for intraday refresh) |
| `pts_l3`, `pts_l5`, `pts_l10`, `pts_l20` | numeric | |
| `pts_std_l10` | numeric | |
| `pts_ewma_halflife_3`, `_7`, `_15` | numeric | |
| `pts_trend_slope_l10` | numeric | |
| `pts_hit_rate_l10` | numeric | |
| (repeat for reb, ast, stl, blk, tov, 3pm, minutes) | | |
| `games_played` | int | Total games in source data |
| `l10_games_count` | int | Used for sample gating |
| `created_at` | timestamptz | |

Primary key: `(player_id, as_of_date)`.

### `feat_player_advanced_rolling`
Rolling versions of advanced stats.

| Column | Type | Notes |
|---|---|---|
| `player_id` | bigint FK | |
| `as_of_date` | date | |
| `usage_rate_l5`, `usage_rate_l10`, `usage_rate_l20` | numeric | |
| `psa_l5`, `psa_l10`, `psa_l20` | numeric | |
| `true_shooting_pct_l5`, `_l10` | numeric | |
| `ast_pct_l5`, `_l10` | numeric | |
| `tov_pct_l5`, `_l10` | numeric | |
| `off_rating_l10` | numeric | |
| `def_rating_l10` | numeric | |
| `usage_rate_l10_filtered` | numeric | Non-garbage-time version |
| `psa_l10_filtered` | numeric | |
| (parallel `_filtered` columns for other stats) | | |
| `created_at` | timestamptz | |

Primary key: `(player_id, as_of_date)`.

### `feat_matchup_context`
Pre-computed opponent/matchup features. Already exists — extended with position-specific columns.

| Column | Type | Notes |
|---|---|---|
| `game_id` | bigint FK | |
| `player_id` | bigint FK | |
| `as_of_date` | date | |
| `opp_team_id` | bigint FK | |
| `opp_pts_pg` | numeric | Total allowed |
| `opp_pts_allowed_vs_position` | numeric | **NEW in v2** |
| `opp_reb_allowed_vs_position` | numeric | **NEW in v2** |
| `opp_ast_allowed_vs_position` | numeric | **NEW in v2** |
| `opp_3pm_allowed_vs_position` | numeric | **NEW in v2** |
| `opp_def_rating` | numeric | |
| `opp_pace` | numeric | |
| `opp_block_rate` | numeric | |
| `opp_steal_rate` | numeric | |
| `opp_three_point_defense` | numeric | |
| `defensive_factor` | numeric | |
| `matchup_tag` | text | HOSTILE, NEUTRAL, FAVORABLE, ELITE_SPOT |
| `created_at` | timestamptz | |

Primary key: `(game_id, player_id)`.

### `feat_team_factors`
Already exists. No changes for v2.

### `calibration_artifacts`
Calibration model registry.

| Column | Type | Notes |
|---|---|---|
| `id` | bigserial PK | |
| `market` | text | |
| `stage` | text | Usually stage_5 (final probability) |
| `fit_timestamp` | timestamptz | |
| `artifact_path` | text | Pickle on disk |
| `training_sample_count` | int | |
| `brier_score` | numeric | |
| `log_loss` | numeric | |
| `is_active` | boolean | |

### `task_runs`
Task orchestration audit trail.

| Column | Type | Notes |
|---|---|---|
| `id` | bigserial PK | |
| `task_name` | text | |
| `task_id` | text | Celery task UUID |
| `started_at` | timestamptz | |
| `completed_at` | timestamptz | |
| `status` | text | success, failure, retrying |
| `rows_written` | int | Task-specific metric |
| `error_message` | text | |
| `task_kwargs` | jsonb | |

## Indexes and constraints

Critical indexes for production query performance:

```sql
-- Slate-level picks query (most frequent UI query)
CREATE INDEX idx_picks_daily_slate ON fact_picks_daily (pick_date, market, strength_band);

-- Player history lookup
CREATE INDEX idx_player_gamelog_player_date ON fact_player_game_log (player_id, game_date DESC);

-- Latest line per prop
CREATE INDEX idx_prop_lines_latest ON fact_prop_lines (game_id, player_id, market, observed_at DESC);

-- Backtest cohort query
CREATE INDEX idx_picks_backtest ON fact_picks_daily (pick_date, strength_band, market) 
    WHERE coherence_score IS NOT NULL;

-- Injury lookup
CREATE INDEX idx_injury_player_time ON fact_injury_events (player_id, observed_at DESC);

-- Feature freshness checks
CREATE INDEX idx_player_rolling_latest ON feat_player_rolling (player_id, as_of_date DESC);

-- Play-by-play (TimescaleDB hypertable recommended)
SELECT create_hypertable('fact_play_by_play', 'game_date', chunk_time_interval => INTERVAL '1 month');
```

## Migration strategy

Follow existing numbered migration pattern in `db/migrations/`:
- `026_*.sql` — new v2 tables (fact_player_advanced, fact_possessions, fact_injury_events)
- `027_*.sql` — feat_player_rolling extensions (EWMA columns, trend_slope)
- `028_*.sql` — feat_player_advanced_rolling (new table)
- `029_*.sql` — feat_matchup_context position-specific columns
- `030_*.sql` — calibration_artifacts table
- `031_*.sql` — ml_model_meta stage column addition
- `032_*.sql` — task_runs table

All migrations should be:
- **Idempotent** — safe to re-run
- **Additive** — no drops or renames in initial v2 rollout
- **Nullable** — new columns default NULL so existing inference path isn't broken
- **Validated** — staging test query confirms new columns exist before code deploys

Rollback: drop the new columns/tables (no data loss on existing tables since additions are nullable).

## Storage estimates

Rough size estimates for 10 seasons of data post-backfill:

| Table | Rows | Size |
|---|---|---|
| `fact_player_game_log` | ~400K | ~80 MB |
| `fact_player_advanced` | ~400K | ~120 MB |
| `fact_play_by_play` | ~5M | ~2 GB |
| `fact_possessions` | ~2M | ~800 MB |
| `fact_prop_lines` | ~50M (with history) | ~5 GB |
| `fact_picks_daily` | ~500K | ~250 MB |
| `feat_player_rolling` | ~500K | ~200 MB |
| `feat_player_advanced_rolling` | ~500K | ~150 MB |

Total: ~10 GB for core tables. Well within single-machine Postgres territory.

## Schema versioning

Record the active schema version:

```sql
CREATE TABLE IF NOT EXISTS schema_version (
    version text PRIMARY KEY,
    applied_at timestamptz NOT NULL DEFAULT now(),
    description text
);
```

Every migration inserts a row. Version format: semver (e.g., `2.0.0`). Code references the minimum compatible schema version.
