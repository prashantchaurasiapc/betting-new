# Calibration

## Purpose

Transform raw model probabilities (`p_raw`) into empirically accurate probabilities (`p_cal`) via per-market isotonic regression fit on historical pick outcomes. Calibration answers: "when my model says 85% confidence, does it hit 85% of the time?"

## Current state

Infrastructure exists in `run_model.py` (lines 1383–1390):
```python
use_cal = calib_bundle is not None and bands_doc is not None and math.isfinite(p_raw)
if use_cal:
    p_cal = apply_calibration(z_dir, p_raw, calib_bundle)
    p_cal = min(1.0, max(0.0, float(p_cal)))
```

Status: **OFF**. Log line confirms: `run_model: calibration OFF (norm_edge strength bands)`.

Phase M1 activates this infrastructure with properly-fit per-market isotonic models.

## Why calibration matters

A model can have good discrimination (correctly rank-orders picks by probability) but poor calibration (stated probabilities don't match empirical hit rates). Sports prediction models frequently produce overconfident probabilities because:

- Training target is binary (hit/miss) but underlying reality is probabilistic
- Model is trained to minimize log-loss, which doesn't enforce calibration
- Real-world probabilities have heavy tails (garbage time, injury surprises) that Gaussian assumptions miss

Post-calibration, stated probabilities should match empirical hit rates across probability buckets.

## Approach: isotonic regression

Isotonic regression fits a non-decreasing step function mapping `p_raw → p_cal`. It preserves the rank ordering of predictions (so the model's discrimination is unchanged) while adjusting probabilities to match empirical outcomes.

Advantages over Platt scaling:
- Non-parametric (no sigmoid assumption)
- Handles any monotonic transformation
- Robust to heavy-tailed probability distributions

Disadvantages:
- Can overfit with small samples
- Requires more data than Platt scaling to be reliable

For GeniePicks' scale (thousands of resolved picks per market after first full season), isotonic is appropriate.

## Training

### When it runs

Nightly Celery Beat task `fit_calibration_models`, scheduled at 4:00 AM ET after the previous night's games have been graded and `fact_prop_results` is updated.

### What it does

For each market (PTS, REB, AST, 3PM, PRA, STL, BLK):

1. Query all resolved picks from the last 90 days:
   ```sql
   SELECT f.p_raw, r.hit
   FROM fact_picks_daily f
   JOIN fact_prop_results r ON
       r.game_id = f.game_id AND
       r.player_id = f.player_id AND
       r.market = f.market AND
       r.side = f.side AND
       r.line_at_prediction = f.line
   WHERE f.market = %s
     AND f.pick_date >= current_date - interval '90 days'
     AND r.voided = false
     AND r.hit IS NOT NULL
     AND f.p_raw IS NOT NULL;
   ```

2. Check sample gating:
   - If `count(*) < 500`, skip this market — not enough data for reliable calibration
   - Log `calibration_gated_market_{market}: insufficient samples (<500)`

3. Fit `sklearn.isotonic.IsotonicRegression`:
   ```python
   from sklearn.isotonic import IsotonicRegression
   iso = IsotonicRegression(out_of_bounds='clip')
   iso.fit(p_raw_values, hit_outcomes)
   ```

4. Evaluate calibration quality:
   - Brier score on held-out 10% of samples
   - Expected calibration error (ECE) across 10 probability buckets
   - Log metrics alongside artifact

5. Persist artifact:
   - File: `/models/calibration/{market}/iso_{market}_{YYYYMMDD}_{HHMMSS}.pkl`
   - Registry: insert row in `calibration_artifacts` with `is_active = false` initially

6. Activation gating:
   - If new artifact's Brier score is worse than previous by >10%: leave `is_active = false`, alert
   - Otherwise: mark new artifact `is_active = true`, previous `is_active = false`

### Output to `calibration_artifacts`

```sql
INSERT INTO calibration_artifacts (
    market, stage, fit_timestamp, artifact_path,
    training_sample_count, brier_score, log_loss, ece,
    is_active
) VALUES (...);
```

## Inference

### At `run_model` task start

Load the latest `is_active = true` calibration artifact per market:

```python
calibration_models = {}
for market in ('PTS', 'REB', 'AST', '3PM', 'PRA', 'STL', 'BLK'):
    artifact_row = db.query(
        "SELECT artifact_path FROM calibration_artifacts "
        "WHERE market = %s AND is_active = true "
        "ORDER BY fit_timestamp DESC LIMIT 1",
        [market]
    ).fetchone()
    if artifact_row:
        with open(artifact_row['artifact_path'], 'rb') as f:
            calibration_models[market] = pickle.load(f)
```

### Per prediction

Between `p_raw` computation and `strength_band` assignment:

```python
p_raw = compute_gaussian_probability(projection, sigma, line, side)

if calibration_models.get(market) is not None:
    p_cal = float(calibration_models[market].transform([p_raw])[0])
    p_cal = max(0.0, min(1.0, p_cal))  # Clip to valid range
else:
    p_cal = p_raw  # Fallback when no calibration available

# Clip edge cases
if not math.isfinite(p_cal):
    p_cal = p_raw
```

### Store both values

`stats_snapshot.calibration`:
```json
{
    "p_model": 0.455,
    "p_cal": 0.478,
    "calibration_delta": 0.023,
    "calibration_model_id": "iso_pts_20260501_040000"
}
```

Retain both values for audit, backtesting, and ability to compare pre/post calibration performance.

## Gating criteria

### Minimum sample size per market
- **500 resolved picks** required before a market's calibration ships
- Before threshold: use `p_raw` directly
- After threshold: use `p_cal` from latest artifact

Why 500: empirical rule of thumb for isotonic regression stability. Below this, the fitted function is noisy and can worsen calibration.

### Recalibration cadence
- Daily fit (nightly task) but only ship if significantly better
- Ship criteria: new Brier score ≤ previous Brier × 1.05 (new model not much worse than old)
- If new model much worse: alert and investigate (possible data quality issue, training bug, or regime change)

### Health monitoring
Daily log per market:
- Number of samples used
- Brier score on held-out set
- ECE on held-out set
- Max probability shift (how much does the calibrator change probabilities at the extremes?)
- Flag if any bucket has drift > 10% from prior day

## Distribution-aware calibration (future)

The simple isotonic approach treats calibration as a probability-to-probability mapping. A more sophisticated approach calibrates the underlying stat distribution (not just the probability of hitting a line):

- For each market, fit a per-percentile-bin calibration: "when model predicts 20 pts, what is the actual distribution?"
- Use this to produce calibrated predictive distributions, not just calibrated probabilities
- Applied at Stage 5 of the hierarchical pipeline, before probability computation

This is out of scope for M1 but considered for future iterations.

## Backtest integration

The existing coherence backtest SQL (`scripts/risk/coherence_backtest.sql`) uses `p_cal` for cohort selection. Once calibration activates:
- `p_cal` values will differ from `p_raw` for many picks
- Strength band boundaries tied to `p_cal` will shift (e.g., what was a "Lean" at `p_raw = 0.55` may become "Marginal" at `p_cal = 0.52`)
- **Existing backtest cohort will need one-time re-evaluation** against the new `p_cal` values

Plan: after M1 ships, rerun backtest on historical data using newly-calibrated `p_cal`, confirm cohort definitions still make sense, adjust thresholds if needed.

## Troubleshooting

### Symptom: `p_cal` shifts dramatically from `p_raw`
- **Possible cause:** raw model is significantly miscalibrated
- **Investigation:** examine the isotonic function shape. Large shifts (>0.1) at common probability values suggest systematic model miscalibration.
- **Action:** consider whether to ship calibration at all, or fix the raw model first

### Symptom: new calibration model has much worse Brier
- **Possible cause:** data regime change (new season, rule change, model drift)
- **Action:** don't auto-activate; alert and investigate

### Symptom: calibration helps some markets, hurts others
- **Possible cause:** some markets have insufficient samples for isotonic fit
- **Action:** increase sample threshold for affected markets, or use shrinkage toward identity function

### Symptom: `p_cal` sometimes NaN or Inf
- **Possible cause:** model extrapolation beyond training range
- **Action:** ensure `out_of_bounds='clip'` in IsotonicRegression, check raw model for NaN outputs first

## Code locations

After M1 implementation:
- `workers/tasks/fit_calibration_models.py` — nightly training
- `workers/ml/calibration.py` — shared calibration functions
- `run_model.py` — inference integration (existing, activate logic)
- `db/migrations/030_calibration_artifacts.sql` — schema
- `tests/test_calibration.py` — unit and integration tests
