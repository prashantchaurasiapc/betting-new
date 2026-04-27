# Model Pipeline

The modeling core is a hierarchical 5-stage pipeline. Each stage predicts a quantity that feeds the next, with uncertainty propagating honestly from bottom to top. This architecture replaces the current single-model-per-market approach.

## Why hierarchical

The current model predicts a stat directly as a function of features. That conflates several sources of uncertainty: "how long will he play," "how much will he be involved," "how efficiently will he produce." A hierarchical pipeline separates these so each can be right or wrong independently.

Example: Paolo Banchero PTS UNDER 17.5.

Current model: one XGBoost takes all features, outputs `projection = 15.6`.

Hierarchical model:
- Stage 1: `p_active = 0.95` (active based on injury status)
- Stage 2: `minutes_projection = 33.0 ± 3.2` (expected minutes)
- Stage 3: `usage_rate_projection = 27.0 ± 2.1` (expected usage)
- Stage 4: `pts_per_100_projection = 22.5 ± 2.8` (expected efficiency)
- Stage 5: composed point projection = `33.0 × (pace/48) × (27.0/100) × 22.5 ≈ 18.1`

The hierarchical version provides a full predictive distribution and attributes uncertainty to specific causes. If Banchero plays 25 minutes instead of 33, the minutes-projection residual explains the prediction error — not just "model was wrong."

## Stage 1: Active probability

### Purpose
Predict `P(player plays > 0 minutes tonight)`.

### Target variable
Binary — did the player have >0 minutes in the game.

### Training data
Every player-game pair in historical data, labeled with whether the player actually played.

### Features consumed (partial list; full in `feature-reference.md`)

Identity: `player_id`, `team_id`
Context: `is_back_to_back`, `rest_days`, `is_playoff`, `playoff_series_game_number`
Injury: `injury_status`, `injury_reason_category`, `hours_since_status_change`
Recent: `games_played_last_7_days`, `minutes_l5`, `dnp_count_l10`
Team: `teammates_out_count`, `starter_count_available`
Schedule: `days_into_season`

### Model

Logistic regression or small gradient-boosted tree. Optimize for AUC and calibration, not raw accuracy. Interpretability and speed matter more than marginal prediction quality here.

### Output

- `p_active` in [0, 1]
- Written to `stats_snapshot.stage_1.p_active`
- Consumed by: Stage 2 as gating feature, final probability as multiplier

### Acceptance criteria

- AUC ≥ 0.85 on validation set
- Calibration error ≤ 5% across probability buckets
- Latency < 50ms per prediction

## Stage 2: Minutes projection

### Purpose
Given player is active, predict expected minutes played with uncertainty interval.

### Target variable
Minutes played in the game (float, typically 0–48).

### Training data
All player-games where `minutes > 0`. Training excludes `minutes = 0` cases to avoid double-counting (Stage 1 handles the zero-minutes case).

### Features consumed

From Stage 1: `p_active`
Rolling: `minutes_l3`, `minutes_l5`, `minutes_l10`, `minutes_l20`, `minutes_std_l10`, `minutes_ewma_halflife_3`, `minutes_ewma_halflife_7`
Role: `projected_starter`, `depth_chart_rank`
Context: `is_back_to_back`, `rest_days`, `is_third_in_four`, `blowout_probability`
Team: `starter_count_available`, `teammates_out_count`, `teammates_questionable_count`
Game: `vegas_spread`, `implied_team_total`
Season: `days_into_season`, `is_playoff`
Injury: `injury_status` (even among "active" players, Questionable active players get fewer minutes)

### Model

XGBoost or LightGBM regression with quantile outputs to get prediction intervals directly. Alternative: point prediction + separate variance model.

### Output

- `minutes_projection` — point estimate
- `minutes_projection_std` — uncertainty
- `minutes_p10`, `minutes_p90` — prediction interval bounds
- Written to `stats_snapshot.stage_2`
- Consumed by: Stages 3, 4, 5

### Acceptance criteria

- RMSE ≤ 5.0 minutes on validation set
- Calibrated prediction intervals (80% coverage at the 80% interval)
- Residuals show no systematic bias across: back-to-back, rest days, starter status

### Why this is the single biggest lever

Most prop bet failures come from "the player didn't play enough to hit the line." A typical starter averaging 34 minutes will sometimes play 22 minutes for reasons partially predictable (blowout, foul trouble risk, injury management) and partially random. Explicit minutes modeling with uncertainty lets downstream stages reason about this directly.

## Stage 3: Usage rate projection

### Purpose
Given minutes, predict usage rate (percentage of team possessions used while on floor).

### Target variable
`usage_rate = (FGA + 0.44 × FTA + TOV) × (Team MP / 5) / (MP × (Team FGA + 0.44 × Team FTA + Team TOV)) × 100`

### Training data
All player-games with computed `usage_rate` from advanced box scores.

### Features consumed

From Stage 2: `minutes_projection`
Advanced: `usage_rate_l5`, `usage_rate_l10`, `usage_rate_l20`, `usage_rate_l10_filtered`
Role: `starter_count_available`, `usage_leader_available`, `teammates_out_count`
Context: `vegas_spread`, `blowout_probability`, `pace_differential`
Opponent: `opp_def_rating`, `opp_def_rating_vs_position`
Season: `days_into_season`, `is_playoff`

### Model

XGBoost regression.

### Output

- `usage_rate_projection`
- `usage_rate_projection_std`
- Written to `stats_snapshot.stage_3`
- Consumed by: Stages 4, 5

### Acceptance criteria

- RMSE ≤ 3.0 percentage points on validation set
- Residual analysis shows no bias vs starter/bench split, B2B, or teammate-out context

## Stage 4: Efficiency projection

### Purpose
Given usage, predict per-possession production. Run as parallel models per stat — points efficiency, rebounds efficiency, etc.

### Target variable (for PTS market)
`pts_per_100_possessions = points × 100 / possessions_on_floor`

Similar for other markets.

### Training data
All player-games with computed per-possession stats.

### Features consumed

From Stage 3: `usage_rate_projection`
Efficiency rolling: `psa_l5`, `psa_l10`, `true_shooting_pct_l5`, `true_shooting_pct_l10`
Rolling counting stats: `{stat}_l5`, `{stat}_l10`, `{stat}_l20`
Trend: `{stat}_trend_slope_l10`, `{stat}_ewma_halflife_3`
Opponent: `opp_{stat}_allowed_vs_position`, `opp_def_rating`, `opp_def_rating_vs_position`, `opp_three_point_defense`, `opp_block_rate`
Matchup: `defensive_factor`, `opp_pace`
Context: `rest_differential`, `days_into_season`

### Model

XGBoost + LightGBM ensemble. Separate models per market.

### Output

- `pts_per_100_projection` (for PTS model)
- `pts_per_100_projection_std`
- Analogous for other markets: `reb_per_100_projection`, `ast_per_100_projection`, etc.
- Written to `stats_snapshot.stage_4`
- Consumed by: Stage 5

### Acceptance criteria

- RMSE on `pts_per_100` ≤ 6.0 on validation
- Ensemble weighting calibrated via validation set
- Feature importance analysis shows opponent features contribute ≥15% of model importance

## Stage 5: Stat totals composition

### Purpose
Compose Stage 2–4 outputs into final stat predictions with full predictive distributions.

### Composition logic

For PTS:
```
expected_pts = p_active × minutes_projection × (expected_team_pace × minutes_projection / 48)
               × (usage_rate_projection / 100) × pts_per_100_projection / 100
```

Simplified:
```
expected_pts ≈ p_active × minutes_proj × usage_proj/100 × poss_per_48 × pts_per_100/100
```

Where `poss_per_48` comes from `team_pace_l10` blended with `opp_pace`.

### Distribution

Propagate uncertainty from Stages 1–4:
- Point estimate: composed formula above
- Variance: sum of contributed variances with covariance terms (minutes and usage are correlated)
- Skew: heuristic adjustment for blowout scenarios (player sits in Q4)

Use a mixture distribution:
- Component 1: "normal game" — Gaussian around composed projection
- Component 2: "blowout" — shifted distribution with compressed minutes
- Mixture weight: `blowout_probability`

### Output

- `pts_projection` — point estimate
- `pts_projection_std` — standard deviation
- `pts_projection_skew` — skewness parameter
- `pts_projection_distribution` — parameterized distribution object (for probability calc)
- Written to `stats_snapshot.stage_5`
- Consumed by: probability calculation

### Acceptance criteria

- `val_rmse ≤ 6.5` on PTS market (vs current 7.79)
- Predictive distributions properly calibrated (80% interval contains 80% of outcomes)
- Residuals show no systematic bias across markets or player types

## Probability calculation

Given the distribution from Stage 5 and the prop line:

- `P(stat > line)` from CDF for OVER
- `P(stat < line)` from CDF for UNDER
- `P(push)` for whole-number lines

Output: `p_raw` — the uncalibrated probability of the recommended side.

Mapped to `p_cal` via the calibration layer (see `calibration.md`).

## Strength band assignment

Post-`p_cal`, convert probability to strength band via thresholds:

- `Strong Lean`: `p_cal ≥ 0.65`
- `Lean`: `0.55 ≤ p_cal < 0.65`
- `Marginal`: `0.48 ≤ p_cal < 0.55`
- `Pass`: `p_cal < 0.48`

Thresholds are market-specific and calibrated to historical hit rates.

## Risk layer (Phase 1, shipped)

After `strength_band` is assigned, coherence scoring evaluates agreement between the engine's call direction and rolling-form signals. Low-coherence picks get `display_strength_band` demoted.

See `docs/Other/Data Foundation/risk-model-spec.md` for full details.

## Ensembling strategy

Each of Stages 2, 3, 4 trains two model types:
- Primary: XGBoost
- Secondary: LightGBM
- Optional: small MLP (2-3 layer) on normalized features

Ensemble via weighted average, weights fit on validation set. Expected lift: 2–5% RMSE reduction from ensembling heterogeneous tabular models.

## Model artifacts

Each stage-market combination produces a pickled model artifact:

```
/models/stage_1/p_active/
  ├── xgb_active_20260501_060000.pkl
/models/stage_2/minutes/
  ├── xgb_minutes_20260501_060000.pkl
  ├── lgb_minutes_20260501_060000.pkl
/models/stage_3/usage/
  ├── xgb_usage_pts_20260501_060000.pkl
  ├── xgb_usage_reb_20260501_060000.pkl
  ...
/models/stage_4/efficiency/
  ├── xgb_efficiency_pts_20260501_060000.pkl
  ├── lgb_efficiency_pts_20260501_060000.pkl
  ...
/models/calibration/
  ├── isotonic_pts_20260501_040000.pkl
  ├── isotonic_reb_20260501_040000.pkl
```

Naming convention: `{model_type}_{target}_{YYYYMMDD}_{HHMMSS}.pkl`

Model metadata stored in `ml_model_meta` table with: `model_id`, `stage`, `market`, `model_type`, `fit_timestamp`, `val_rmse`, `feature_count`, `training_sample_count`, `is_active`.

## Serving path (in `run_model.py`)

Simplified pseudocode:

```python
def score_prediction(player_id, game_id, market, side, line):
    features = assemble_feature_row(player_id, game_id, market, side, line)
    
    # Stage 1
    p_active = stage_1_model.predict(features)
    features['p_active'] = p_active
    
    # Stage 2
    minutes_proj, minutes_std = stage_2_model.predict_with_uncertainty(features)
    features['minutes_projection'] = minutes_proj
    
    # Stage 3
    usage_proj, usage_std = stage_3_model.predict_with_uncertainty(features)
    features['usage_rate_projection'] = usage_proj
    
    # Stage 4
    eff_proj, eff_std = stage_4_model[market].predict_with_uncertainty(features)
    features[f'{market.lower()}_per_100_projection'] = eff_proj
    
    # Stage 5: composition
    projection, projection_std, skew = compose_totals(
        p_active, minutes_proj, minutes_std,
        usage_proj, usage_std, eff_proj, eff_std,
        features
    )
    
    # Probability
    p_raw = compute_probability(projection, projection_std, skew, line, side)
    
    # Calibration
    p_cal = calibrator[market].transform([p_raw])[0]
    
    # Strength band
    strength_band = assign_band(p_cal, market)
    
    # Risk layer (existing)
    coherence_score, display_band, demotion_reason = apply_coherence(
        features, side, line, strength_band
    )
    
    return PredictionResult(
        projection=projection,
        projection_std=projection_std,
        p_raw=p_raw,
        p_cal=p_cal,
        strength_band=strength_band,
        display_strength_band=display_band,
        coherence_score=coherence_score,
        demotion_reason=demotion_reason,
        stats_snapshot=build_snapshot_json(features, intermediate_outputs)
    )
```

## Latency targets

End-to-end per prediction (feature assembly + 5 stages + calibration + risk layer):
- Target: <100ms
- Acceptable: <200ms
- Full slate (~1500 predictions): 2–3 minutes end-to-end

Bottleneck is typically feature assembly (DB round-trips), not model inference. Cache feature rows aggressively.

## Rollback strategy

If a new model underperforms in production:

1. `ml_model_meta.is_active` flag enables rolling back to previous model artifact
2. Rollback command: `UPDATE ml_model_meta SET is_active = true WHERE model_id = '{previous}'` + restart workers
3. Previous pickle files retained on disk for at least 30 days

Blue/green deployment of full model stack: run new and old in parallel for one slate, compare outputs, cut over if green.
