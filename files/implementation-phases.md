# Implementation Phases

This document defines the phased rollout of the v2 modeling core. Each phase has explicit deliverables, acceptance criteria, and estimated effort. Phases are ordered by ROI — highest value per unit effort first.

## Phase sequencing

```
M1 ── Calibration activation           [1 week]      highest ROI
  └── M2 ── Data source expansion      [2-3 weeks]
       └── M3 ── Feature engineering   [2 weeks]
            └── M4 ── Minutes model    [2-3 weeks]
                 └── M5 ── Hierarchical decomposition [3-4 weeks]
                      └── M6 ── Distribution modeling [1-2 weeks, optional]
```

Total critical-path effort: 11-15 weeks for a single full-time developer. Parallelization possible in M2 (multiple data sources) and M5 (parallel model training).

## Prerequisite: backtest resolution

Before any phase begins, the Phase 1 risk-layer backtest must resolve. The 14-day window ends approximately **2026-05-06** based on PROD_STABLE_AT set on 2026-04-22.

Post-backtest decision tree:
- **Separation exceeds SE of difference:** proceed with full M1-M5 plan.
- **No separation, coherence preserved and demoted hit at same rate:** the risk layer is decorative but not harmful. Modeling work can still proceed; the weak layer just won't ship as UI. Consider whether the failure modes the backtest surfaces suggest different priorities than this spec assumed.
- **Inverted separation (demoted > preserved hit rate):** coherence checks are actively wrong. Halt model pipeline work until the issue is diagnosed. Possible causes: fixture bug, feature drift, or fundamental mis-specification of coherence rules.

---

## Phase M1: Calibration activation

**Goal:** Activate the existing `apply_calibration` infrastructure with per-market isotonic regression fit from historical pick outcomes. Lowest effort, highest leverage improvement available.

### Deliverables

1. **`fit_calibration_models` Celery task**
   - Location: `workers/tasks/fit_calibration_models.py`
   - Schedule: daily at 4:00 AM ET via `celery-beat`
   - Input: join `fact_picks_daily` with `fact_prop_results` for resolved picks in last 90 days
   - Output: fitted `sklearn.isotonic.IsotonicRegression` per market, pickled to `/models/calibration/{market}/{timestamp}.pkl`
   - Registry: row in `calibration_artifacts` marking `is_active = true` for newest artifact

2. **`calibration_artifacts` table**
   - Migration: `db/migrations/030_calibration_artifacts.sql`
   - Schema per `database-schema.md`

3. **Activation in `run_model.py`**
   - Load latest `calibration_artifacts` row per market at task start
   - Apply calibration between `p_raw` computation and `strength_band` assignment
   - Store both `p_raw` and `p_cal` in `stats_snapshot.calibration` (already partially implemented)
   - Remove or flip the `calibration OFF` logic

4. **Gating logic**
   - Market with <500 resolved picks: use `p_raw` directly, log gating decision
   - Otherwise: apply calibration
   - Implementation: check `calibration_artifacts.training_sample_count >= 500` before using artifact

5. **Monitoring**
   - Daily log: per-market calibration Brier score on rolling 30-day validation
   - Alert if Brier score degrades > 20% from baseline

### Acceptance criteria

- [ ] All 7 markets (PTS, REB, AST, 3PM, PRA, STL, BLK) have calibration artifacts produced nightly
- [ ] Inference uses `p_cal` from latest artifact, not `p_raw`
- [ ] Backtest on 30 days of historical picks shows calibration error (abs diff between stated prob and empirical hit rate) ≤ 5% across probability buckets (5 buckets: 0-20, 20-40, 40-60, 60-80, 80-100)
- [ ] No regression in existing backtests — hit rate on cohort preserved or improved
- [ ] Brier score improved vs uncalibrated baseline by ≥ 3%

### Estimated effort

1 week for one developer. Most of the work is infrastructure (table, task, registry); core logic is 50 lines of sklearn.

### Risk / considerations

- If PTS has <500 resolved Strong Lean picks, calibration won't gate on for that market until the 300-pick backtest cohort resolves plus additional volume. Likely fine by end of Phase M1.
- Calibration can mask a bad underlying model — always report both `p_raw` and `p_cal` in backtests, and watch for cases where `p_cal` shifts probabilities dramatically (suggests raw is miscalibrated).

---

## Phase M2: Data source expansion

**Goal:** Ingest NBA Stats API advanced stats, upgrade The Odds API tier for line history, and optionally add PBP Stats for possession-level data.

### Deliverables

1. **`ingest_player_advanced_stats` Celery task**
   - Location: `workers/tasks/ingest_player_advanced_stats.py`
   - Uses: `nba_api.stats.endpoints.boxscoreadvancedv2`, `boxscoreusagev2`
   - Schedule: daily at 3:00 AM ET after previous night's games resolve
   - Rate limiting: 1 request per 1.5 seconds
   - Writes to: `fact_player_advanced` (new table, migration `026`)
   - Backfill mode: parameterized to pull historical games

2. **`ingest_team_advanced_stats` Celery task**
   - Uses: `leaguedashteamstats`, `teamgamelog`
   - Writes to: `fact_team_advanced` (new table)

3. **`ingest_play_by_play` Celery task (optional for M2, required for later)**
   - Uses: `nba_api.stats.endpoints.playbyplayv2` + `pbpstats` library for possession parsing
   - Writes to: `fact_play_by_play` (raw events) and `fact_possessions` (parsed)
   - TimescaleDB hypertable for `fact_play_by_play`

4. **The Odds API tier upgrade**
   - Upgrade to Pro tier (or equivalent with line movement history)
   - Extend `ingest_prop_lines` task to capture and persist:
     - `opening_line` (first line observed)
     - `closing_line` (latest line before tip)
     - `consensus_line` (median across 5+ books)
     - `line_update_count`
   - Migration: extend `fact_props_odds` schema

5. **Historical backfill**
   - Pull 8-10 seasons of:
     - Player game logs
     - Advanced box scores
     - Team advanced stats
   - Execute as one-time backfill with careful rate limiting — expect 5-7 days of wall-clock time
   - Validate against known reference points (e.g., season leader in USG% matches public records)

6. **Schema migrations**
   - `026_fact_player_advanced.sql`
   - `027_fact_team_advanced.sql`
   - `028_fact_play_by_play.sql` (optional)
   - `029_fact_possessions.sql` (optional)
   - Extensions to `fact_props_odds`

### Acceptance criteria

- [ ] Daily ingestion running without manual intervention for 14 consecutive days
- [ ] Freshness check: `fact_player_advanced` has row for every (player, game) on slates from past 7 days
- [ ] Historical backfill populated back to 2016-17 season at minimum
- [ ] Spot-check on 10 games: advanced stats values match NBA.com public stats within rounding
- [ ] The Odds API Pro tier active, line movement history captured for all props in past 48 hours

### Estimated effort

2-3 weeks, parallelizable. NBA Stats API work: 1 week. The Odds API upgrade: 3 days. Historical backfill: 1 week (wall-clock; engineering time ~2 days).

### Risk / considerations

- NBA Stats API rate limits are informal and change. Monitor for 429 responses and adjust.
- Historical backfill may hit TimescaleDB chunk-size issues for `fact_play_by_play` — plan chunk interval carefully (monthly chunks recommended).
- Budget: Pro tier upgrade on Odds API is an ongoing +$50-100/month. Confirm budget approval before migration.

---

## Phase M3: Feature engineering

**Goal:** Add all new features to feature tables and retrain current XGBoost models against expanded feature set. Benchmark against pre-v2 baseline.

### Deliverables

1. **`build_feat_player_rolling` extensions**
   - Add EWMA columns for all rolling stats at 3/7/15 half-lives
   - Add trend-slope features (linear regression slope of L10)
   - Add hit-rate features for common line thresholds
   - Add level-shift indicator (change-point detection)

2. **`build_feat_player_advanced_rolling` (new task)**
   - Rolling L5, L10, L20 of advanced stats
   - Filtered variants (non-garbage-time)
   - Writes to: `feat_player_advanced_rolling` (new table)

3. **`build_feat_matchup_context` extensions**
   - Add position-specific allowed stats (opp_pts_allowed_vs_position, etc.)
   - Add opponent defensive profile features (rim protection rank, perimeter defense rank, three-point defense)

4. **Garbage-time filter implementation**
   - Rules for marking `fact_possessions.is_garbage_time = true`
   - Documented thresholds (e.g., score_diff > 25 AND clock < 5:00 in Q4)
   - Re-compute filtered advanced stats using non-garbage possessions only

5. **Vegas context features**
   - Add `vegas_total`, `vegas_spread`, `implied_team_total`, `blowout_probability` as features to model training
   - Blowout probability via simple logistic model on vegas_spread and vegas_total historical data

6. **Schedule features**
   - `rest_days`, `rest_differential`, `is_back_to_back`, `is_third_in_four`, `is_four_in_six`
   - All computable from `fact_games` — no new data needed

7. **Retrain XGBoost models with expanded features**
   - Same architecture as current (single model per market) but with ~100-150 features instead of 15
   - Benchmark against current `val_rmse = 7.79` baseline

### Acceptance criteria

- [ ] All new features documented in `feature-reference.md`
- [ ] Feature tables populated for all active players for past 90 days
- [ ] Training pipeline retrains successfully with new feature set
- [ ] PTS `val_rmse ≤ 7.0` (from 7.79 baseline, ~10% improvement from feature work alone)
- [ ] No features have data leakage (validated via time-series cross-validation)
- [ ] Feature importance analysis shows new features contribute meaningfully (top 30 features include at least 10 v2 additions)

### Estimated effort

2 weeks for one developer.

### Risk / considerations

- Feature proliferation risks overfitting. Use regularization and monitor val/test split carefully.
- EWMA features require sufficient history — first 15 games of a player's career will have NULL EWMA values. Training must handle this.
- Leakage check: ensure `as_of_date` is strictly before `game_date` for every feature row used in training.

---

## Phase M4: Minutes model

**Goal:** Train a dedicated minutes-played model. Use its output as a feature in the existing stat models, providing the single largest improvement from architectural change.

### Deliverables

1. **Stage 2 minutes model**
   - Training script: `workers/ml/train_minutes_model.py`
   - Target: `minutes_played` from `fact_player_game_log` (excluding DNPs)
   - Features per spec (see `feature-reference.md` and `model-pipeline.md`)
   - Model class: XGBoost regression with quantile outputs, or separate variance estimator
   - Artifact: `/models/stage_2/minutes/xgb_minutes_{timestamp}.pkl`

2. **Model serving integration**
   - Extend `run_model.py` to load minutes model at task start
   - Call minutes prediction between Stage 1 (active prob) and Stage 3 (not yet built, but minutes feeds existing PTS/REB/AST models)
   - Add `minutes_projection`, `minutes_projection_std` to `stats_snapshot`

3. **Inject minutes projection into stat models**
   - Retrain stat models with `minutes_projection` as feature
   - Benchmark RMSE improvement from having explicit minutes projection

4. **Registry updates**
   - `ml_model_meta` gains row per minutes model
   - `stage = 'stage_2'`

### Acceptance criteria

- [ ] Minutes model RMSE ≤ 5.0 on held-out validation
- [ ] Prediction intervals calibrated (80% coverage at 80% interval)
- [ ] Stat model val_rmse improves with minutes feature: PTS ≤ 6.8 (from 7.0 baseline)
- [ ] No regression in existing backtests
- [ ] Feature importance in stat models: minutes_projection is top-10 feature

### Estimated effort

2-3 weeks.

### Risk / considerations

- Minutes distributions are heavy-tailed (DNPs, early hooks, garbage-time adjustments). Quantile regression handles this better than plain regression.
- Injury-status-driven minutes predictions require injury feed or equivalent fallback. If injury feed deferred, minutes model is less accurate for questionable-player picks.
- Consider separate minutes models for starters vs bench (different distributions).

---

## Phase M5: Hierarchical decomposition

**Goal:** Full 5-stage hierarchical pipeline (active → minutes → usage → efficiency → totals). Separate usage and efficiency into distinct models. Add LightGBM ensembling.

### Deliverables

1. **Stage 3: Usage model per market**
   - Training script: `train_usage_model.py`
   - Target: `usage_rate` from `fact_player_advanced`
   - Features: per spec (takes `minutes_projection` as input)
   - Artifact per market: `/models/stage_3/usage/xgb_usage_{market}_{timestamp}.pkl`

2. **Stage 4: Efficiency models per market**
   - Training script: `train_efficiency_model.py`
   - Target: `pts_per_100` (or equivalent per-possession stat for other markets)
   - Features: per spec (takes `usage_rate_projection` as input)
   - XGBoost + LightGBM ensemble
   - Artifacts: `xgb_efficiency_{market}_{timestamp}.pkl`, `lgb_efficiency_{market}_{timestamp}.pkl`

3. **Stage 5: Composition logic**
   - Implementation in `run_model.py`:
     - Compose point estimate via `expected_stat = p_active × minutes × (usage/100) × (possessions/48) × (per_100/100)`
     - Compose variance via error propagation
     - Handle skew via mixture distribution (normal + blowout components)

4. **Stage 1: Active probability model (can happen in parallel with M1-M4)**
   - Simple logistic regression or small GBT
   - Features: injury status, schedule, recent DNP patterns
   - Usually deferred until injury feed is live; pre-M5 can use heuristic: `p_active = 1.0 if not Questionable/Doubtful/Out, else predict from limited features`

5. **Ensemble implementation**
   - Per stage, train XGBoost and LightGBM
   - Average predictions with validation-set-fit weights
   - Record ensemble variance for uncertainty estimation

6. **Blue/green deployment**
   - Run new hierarchical pipeline in parallel with existing single-model path for 7 days
   - Write both sets of predictions to `fact_picks_daily` with different `model_id` values
   - Compare outputs, validate no regression, then cut over

### Acceptance criteria

- [ ] All 5 stages implemented, tested, and running in production
- [ ] PTS `val_rmse ≤ 6.5` (the v2 target)
- [ ] Each stage's predictions are monitored and logged separately in `stats_snapshot`
- [ ] Prediction latency end-to-end < 200ms per prop
- [ ] Full slate inference completes in < 3 minutes
- [ ] Blue/green comparison shows no regression on existing backtests
- [ ] Rollback tested: single config change reverts to previous model

### Estimated effort

3-4 weeks, with parallel training feasible.

### Risk / considerations

- Hierarchical models compound errors — Stage 2 RMSE of 5 minutes, combined with Stage 3 usage error, can produce Stage 5 errors larger than a monolithic model. This is why ensembling and careful variance tracking matter.
- If hierarchical pipeline underperforms the monolithic approach in backtest, have a rollback plan ready. The architectural change is only valuable if it delivers better predictions or better calibration.

---

## Phase M6: Distribution modeling (optional)

**Goal:** Replace Gaussian assumption with mixture distribution that properly handles skewness and blowout scenarios.

### Deliverables

1. **Mixture distribution implementation**
   - Two-component mixture: "normal game" (Gaussian) + "blowout" (compressed distribution)
   - Mixture weight: `blowout_probability` from game-context features
   - Proper CDF computation for probability calculation

2. **Skew-aware probability**
   - Replace `scipy.stats.norm.cdf` with mixture CDF
   - Verify probability values don't shift dramatically for most picks (should be similar for non-blowout games)

### Acceptance criteria

- [ ] Probability accuracy improved for high-blowout-probability picks (validated via backtest slicing)
- [ ] Overall Brier score improves
- [ ] No regression on normal picks

### Estimated effort

1-2 weeks.

### Risk / considerations

- Low expected lift — most picks aren't in blowout scenarios
- Complexity increase may not be worth it; consider only after M1-M5 are validated

---

## Aggregate success metrics

After full M1-M5 rollout:

| Metric | Baseline (pre-v2) | M1-M5 target | Notes |
|---|---|---|---|
| PTS `val_rmse` | 7.79 | ≤ 6.5 | 17%+ improvement |
| Calibration error | N/A (off) | ≤ 3% | Across all buckets |
| Feature count | 15 | 250-350 | Per prediction |
| Prediction latency | ~100ms | < 200ms | Hierarchical has overhead |
| Slate throughput | 2-3 min | < 3 min | Parallel inference helps |

### Hit rate targets (if measurable via backtest)

| Strength band | Baseline hit rate | Target |
|---|---|---|
| Strong Lean | TBD from backtest | Preserve or improve |
| Lean | TBD | Preserve or improve |
| Marginal | TBD | Preserve or improve |

These cannot be set numerically until the current backtest resolves and establishes the baseline.

## Budget summary

**Ongoing monthly (conservative, free-alternative-where-possible):**
- The Odds API Pro upgrade: +$75/month
- PBP Stats paid tier: $8/month
- (Optional) Twitter API basic for injury signals: $100/month
- **Total: ~$185/month incremental over current**

**Ongoing monthly (aggressive, full-feature):**
- Above +
- RotoWire or FantasyLabs API: $500-1,500/month
- **Total: ~$700-1,700/month incremental**

**One-time:**
- Historical data backfill: $200-500
- Developer time M1-M5: ~12 weeks @ freelance rates = $25,000-50,000 depending on developer tier

**Recommendation:** Start conservative. Upgrade to aggressive only if specific failure modes (identified via backtest) demonstrate the spend is justified.

## Failure modes and contingencies

If Phase M1 calibration shows predictions are systematically miscalibrated by a large amount:
- **Symptom:** `p_cal` values shift dramatically from `p_raw`
- **Implication:** Current model is poorly calibrated, likely due to feature issues or training/inference mismatch
- **Action:** Pause M2-M5 and investigate model quality before adding complexity

If Phase M3 feature additions do not improve `val_rmse`:
- **Symptom:** Expanded feature set trains to similar or worse validation performance
- **Implication:** Possible overfitting, data leakage, or features aren't actually informative
- **Action:** Feature-by-feature ablation, time-series cross-validation, leak detection

If Phase M5 hierarchical pipeline underperforms monolithic model:
- **Symptom:** Blue/green comparison shows worse backtest performance
- **Implication:** Error propagation from multi-stage inference outweighs decomposition benefits
- **Action:** Keep monolithic model in production, continue hierarchical work in research mode, revisit after feature/data improvements mature
