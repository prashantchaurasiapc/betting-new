# Feature Reference

This document catalogs every feature used in the GeniePicks modeling core. Each feature entry includes its name, data type, source, computation, expected range, stage(s) that consume it, and rationale for inclusion.

**Feature count:** ~250–350 across all stages. Exact count depends on which markets are active and whether optional features (injury feed data) are available.

## How to read this document

Each feature is documented as:

```
feature_name
  Type: int | float | string | bool | timestamp
  Source: table or external source
  Stages: which model stages consume it
  Range: expected value range
  Null policy: how to handle missing values
  Rationale: why this feature matters
```

Features are organized by semantic group, then alphabetically within group.

## 1. Identity features

These identify the player, game, and market but are generally not passed to the model as features — they are keys. Included for completeness.

### `player_id`
- **Type:** bigint
- **Source:** `dim_players.player_id`
- **Stages:** all (as key)
- **Range:** stable NBA player ID (e.g., 38017683)
- **Null policy:** required, never null
- **Rationale:** Primary identifier. Used as categorical feature in some models via embedding or target encoding.

### `game_id`
- **Type:** bigint
- **Source:** `fact_games.game_id`
- **Stages:** all (as key)
- **Range:** stable NBA game ID
- **Null policy:** required, never null

### `market`
- **Type:** string
- **Source:** `fact_prop_lines.market`
- **Stages:** all (as key)
- **Range:** one of `PTS`, `REB`, `AST`, `3PM`, `PRA`, `STL`, `BLK`
- **Null policy:** required, never null
- **Rationale:** Determines which model artifact is loaded. Each market has separate models.

### `side`
- **Type:** string
- **Source:** `fact_prop_lines.side`
- **Stages:** output labeling, edge sign
- **Range:** `OVER` or `UNDER`
- **Null policy:** required

### `line`
- **Type:** float
- **Source:** `fact_prop_lines.line`
- **Stages:** Stage 5 (totals), edge computation
- **Range:** 0.5 to ~60 depending on market
- **Null policy:** required
- **Rationale:** The prop value to predict over/under against.

## 2. Game context features

### `vegas_total`
- **Type:** float
- **Source:** `fact_games.vegas_total`
- **Stages:** Stage 2 (minutes), Stage 3 (usage), Stage 5 (totals)
- **Range:** 190–250 typical, 180–260 extremes
- **Null policy:** impute with league-average (around 225 in 2026); flag imputation
- **Rationale:** Market's expected game pace and point volume. High-signal feature because it summarizes expected possession count and scoring environment. One of the highest-ROI additions vs current model.

### `vegas_spread`
- **Type:** float
- **Source:** `fact_games.vegas_spread` (signed — negative = home favored)
- **Stages:** Stage 2 (blowout probability), Stage 5
- **Range:** -25 to +25 typical
- **Null policy:** impute with 0
- **Rationale:** Large spreads predict blowouts, which compress starter minutes in Q4.

### `implied_team_total`
- **Type:** float
- **Source:** computed as `(vegas_total - abs(vegas_spread)) / 2` for underdog, `(vegas_total + abs(vegas_spread)) / 2` for favorite
- **Stages:** Stage 5 (totals)
- **Range:** 95–135 typical
- **Null policy:** NULL if any input NULL
- **Rationale:** Player's team's expected scoring, which caps individual scoring.

### `pace_differential`
- **Type:** float
- **Source:** computed as `team_pace_l10 - opp_pace_l10`
- **Stages:** Stage 3, Stage 5
- **Range:** -5 to +5 typical
- **Null policy:** 0 if either side NULL
- **Rationale:** Faster games mean more possessions, more opportunity for counting stats.

### `blowout_probability`
- **Type:** float
- **Source:** computed from vegas_total and vegas_spread via logistic model
- **Stages:** Stage 2 (minutes), Stage 5
- **Range:** [0, 1]
- **Null policy:** impute with 0.25 (league average)
- **Rationale:** High blowout probability → starters rest in Q4 → minutes and counting stats lower.

## 3. Schedule features

### `rest_days`
- **Type:** int
- **Source:** computed from `fact_games` as days since player's team's last game
- **Stages:** Stage 1, Stage 2
- **Range:** 0–7 typical
- **Null policy:** default 3 (season average)
- **Rationale:** 0 days rest (back-to-back) correlates with reduced minutes and efficiency.

### `rest_differential`
- **Type:** int
- **Source:** `rest_days_player_team - rest_days_opponent`
- **Stages:** Stage 4, Stage 5
- **Range:** -4 to +4 typical
- **Null policy:** 0

### `is_back_to_back`
- **Type:** bool
- **Source:** `rest_days == 0`
- **Stages:** Stage 1 (active prob), Stage 2 (minutes)
- **Range:** {0, 1}
- **Rationale:** Strong predictor of reduced minutes for veterans; some teams rest stars.

### `is_third_in_four`
- **Type:** bool
- **Source:** computed from schedule — 3rd game in 4 nights
- **Stages:** Stage 2
- **Range:** {0, 1}

### `is_four_in_six`
- **Type:** bool
- **Source:** computed — 4 games in 6 nights
- **Stages:** Stage 2
- **Range:** {0, 1}

### `days_into_season`
- **Type:** int
- **Source:** computed from season start date
- **Stages:** Stage 4 (early-season regression to mean)
- **Range:** 0–200
- **Rationale:** Early-season small samples, late-season tanking patterns.

### `is_playoff`
- **Type:** bool
- **Source:** `fact_games.season_type == 'Playoffs'`
- **Stages:** all
- **Range:** {0, 1}
- **Rationale:** Playoff basketball has different rotation patterns and pace.

### `playoff_series_game_number`
- **Type:** int
- **Source:** computed for playoff games
- **Stages:** Stage 3, Stage 4
- **Range:** 1–7 for playoff games, 0 for regular season

## 4. Player rolling box-score features

For each statistical category (`pts`, `reb`, `ast`, `stl`, `blk`, `tov`, `3pm`, `min`), the following rolling features exist:

### `{stat}_l3`, `{stat}_l5`, `{stat}_l10`, `{stat}_l20`
- **Type:** float
- **Source:** `feat_player_rolling.{stat}_l{window}`
- **Stages:** Stage 4 (efficiency), Stage 5 (totals baseline)
- **Range:** varies by stat (pts: 0–40, reb: 0–20, ast: 0–15)
- **Null policy:** NULL if fewer than `window` games played; models should handle via imputation or gating
- **Rationale:** Recent performance is the strongest single signal for near-term prediction.

### `{stat}_std_l10`
- **Type:** float
- **Source:** `feat_player_rolling.{stat}_std_l10`
- **Stages:** Stage 4, variance estimation in Stage 5
- **Range:** 0–15 typical for pts
- **Null policy:** NULL if <5 games
- **Rationale:** Volatility feature. High-variance players have wider predictive distributions.

### `{stat}_ewma_halflife_{h}`
- **Type:** float
- **Source:** `feat_player_rolling.{stat}_ewma_h{h}` where h ∈ {3, 7, 15}
- **Stages:** Stage 4, Stage 5
- **Range:** same as the stat itself
- **Null policy:** NULL if <3 games
- **Rationale:** EWMA with short half-life (3 games) captures very recent form; longer half-life (15) captures season baseline. Together they provide a multi-timescale view.

### `{stat}_trend_slope_l10`
- **Type:** float
- **Source:** `feat_player_rolling.{stat}_trend_slope_l10` — linear regression slope of last 10 games
- **Stages:** Stage 4
- **Range:** -3 to +3 typical
- **Null policy:** NULL if <10 games
- **Rationale:** Is the player trending up, down, or stable? Distinct signal from rolling mean.

### `{stat}_hit_rate_l10`
- **Type:** float
- **Source:** `feat_player_rolling.{stat}_hit_rate_l10` — fraction of last 10 where stat > some reference
- **Stages:** risk layer (coherence scoring)
- **Range:** [0, 1]
- **Rationale:** Used by coherence score; side-normalized for the recommended side.

## 5. Advanced stats features (NEW in v2)

Added via NBA Stats API ingestion. Computed from `fact_player_advanced`.

### `usage_rate_l5`, `usage_rate_l10`, `usage_rate_l20`
- **Type:** float (percentage 0–50)
- **Source:** `feat_player_advanced_rolling.usage_rate_l{window}`
- **Stages:** Stage 3 (usage), Stage 5
- **Range:** 5–40 typical; >35 is elite (Jokic, Dončić, Maxey range)
- **Null policy:** impute with player's season average if rolling window insufficient
- **Rationale:** Percentage of team possessions used while on floor. Most direct feature for usage-projection. Major missing piece of current model.

### `psa_l5`, `psa_l10`, `psa_l20`
- **Type:** float
- **Source:** `feat_player_advanced_rolling.psa_l{window}` — Points per Shot Attempt × 100
- **Stages:** Stage 4 (efficiency)
- **Range:** 80 (poor) to 150 (elite); league average around 100–110
- **Null policy:** NULL if <5 games
- **Rationale:** Cleaner scoring efficiency metric than FG% because it includes FTs. CTG-equivalent metric.

### `true_shooting_pct_l5`, `true_shooting_pct_l10`
- **Type:** float (decimal, not percent)
- **Source:** `feat_player_advanced_rolling.ts_pct_l{window}`
- **Stages:** Stage 4
- **Range:** 0.4–0.75; league average ~0.57
- **Null policy:** NULL if <5 games

### `ast_pct_l5`, `ast_pct_l10`
- **Type:** float (percentage)
- **Source:** `feat_player_advanced_rolling.ast_pct_l{window}`
- **Stages:** Stage 4 for AST market specifically
- **Range:** 2–45; elite playmakers >30
- **Null policy:** NULL if <5 games
- **Rationale:** Percentage of teammate field goals this player assists while on floor.

### `tov_pct_l5`
- **Type:** float (percentage)
- **Source:** `feat_player_advanced_rolling.tov_pct_l{window}`
- **Stages:** Stage 3 (usage adjustment), Stage 4
- **Range:** 5–25 typical
- **Null policy:** NULL if <5 games

### `off_rating_l10`, `def_rating_l10`
- **Type:** float
- **Source:** `feat_player_advanced_rolling.{off|def}_rating_l10`
- **Stages:** Stage 4
- **Range:** 90–130 for off, 95–125 for def
- **Null policy:** impute with 110 (league avg off), 110 (league avg def)
- **Rationale:** Points produced/allowed per 100 possessions while on floor.

### Filtered variants: `usage_rate_l10_filtered`, `psa_l10_filtered`, etc.
- **Type:** same as above
- **Source:** computed from non-garbage-time possessions only
- **Stages:** Stage 3, Stage 4
- **Range:** same as non-filtered
- **Null policy:** NULL if <200 non-garbage-time minutes
- **Rationale:** CTG-style filtering. Removes blowout noise.

## 6. Matchup / opponent features

Features that describe the defensive environment the player faces.

### `opp_def_rating`
- **Type:** float
- **Source:** `feat_matchup_context.opp_def_rating`
- **Stages:** Stage 4, Stage 5
- **Range:** 100–125
- **Null policy:** impute with 112 (league avg)
- **Rationale:** Overall defensive efficiency of opponent.

### `opp_pace`
- **Type:** float
- **Source:** `feat_matchup_context.opp_pace`
- **Stages:** Stage 3, Stage 5
- **Range:** 94–104 typical
- **Null policy:** impute with 99 (league avg)

### `opp_pts_allowed_pg`
- **Type:** float
- **Source:** `feat_matchup_context.opp_pts_allowed_pg`
- **Stages:** Stage 5 for PTS market
- **Range:** 105–125
- **Rationale:** Baseline scoring environment.

### `defensive_factor`
- **Type:** float
- **Source:** computed as `round(opp_pts_allowed_pg / league_avg_pts_allowed, 3)`
- **Stages:** Stage 5
- **Range:** 0.85–1.15
- **Null policy:** NULL if opp data missing
- **Rationale:** Matches `AdjProjection` logic in C# `PicksService.cs`. Used by coherence score.

### `opp_pts_allowed_vs_position`
- **Type:** float
- **Source:** `feat_matchup_context.opp_pts_allowed_vs_position`
- **Stages:** Stage 4, Stage 5
- **Range:** 10–30 typical per position
- **Null policy:** NULL if insufficient position-specific data (first 10 games of season)
- **Rationale:** How many points does this opponent allow to the player's position specifically? More precise than team-wide.

### `opp_reb_allowed_vs_position`, `opp_ast_allowed_vs_position`, `opp_3pm_allowed_vs_position`
- **Type:** float
- **Stages:** Stage 4 for corresponding markets

### `opp_block_rate`, `opp_steal_rate`
- **Type:** float (percentage)
- **Source:** `feat_matchup_context.opp_{blk|stl}_rate`
- **Stages:** Stage 4 for scoring efficiency (opponent rim protection)
- **Range:** blk 3–8%, stl 5–10%

### `opp_three_point_defense`
- **Type:** float
- **Source:** `feat_matchup_context.opp_3p_pct_allowed`
- **Stages:** Stage 4 for 3PM market
- **Range:** 0.30–0.40
- **Rationale:** Some defenses allow more open threes; matters for 3PM props.

## 7. Availability features (NEW in v2, requires injury feed)

### `injury_status`
- **Type:** string (categorical)
- **Source:** `fact_injury_events` latest observation
- **Stages:** Stage 1 (active prob), Stage 2
- **Range:** `{Active, Questionable, Doubtful, Out, Game-Time Decision}`
- **Null policy:** default to `Active` if no injury report
- **Rationale:** Strongest single signal for player availability.

### `injury_reason_category`
- **Type:** string (categorical)
- **Source:** `fact_injury_events.reason_category`
- **Stages:** Stage 1
- **Range:** `{Rest, Soft Tissue, Bone, Illness, Personal, Unknown}`
- **Rationale:** Rest designations are coin flips; soft-tissue injuries more often become Out.

### `hours_since_status_change`
- **Type:** float
- **Source:** computed from `fact_injury_events.timestamp_observed`
- **Stages:** Stage 1
- **Range:** 0–168 (one week)
- **Null policy:** 999 if no change recorded
- **Rationale:** Recent downgrades (Q → D) more likely to become Out than stale Qs.

### `teammates_out_count`
- **Type:** int
- **Source:** derived from `fact_injury_events` for same team
- **Stages:** Stage 3 (usage inheritance)
- **Range:** 0–6 typical
- **Rationale:** More teammates out → usage redistributes to available players.

### `teammates_questionable_count`
- **Type:** int
- **Source:** same
- **Stages:** Stage 3
- **Range:** 0–5
- **Rationale:** Uncertainty about usage redistribution.

### `starter_count_available`
- **Type:** int
- **Source:** derived — how many of the usual 5 starters are active
- **Stages:** Stage 2, Stage 3
- **Range:** 2–5
- **Rationale:** Depleted starting lineups extend other players' minutes and usage.

### `usage_leader_available`
- **Type:** bool
- **Source:** computed — is the team's highest-usage player active?
- **Stages:** Stage 3
- **Range:** {0, 1}
- **Rationale:** Binary version of the above, specific to high-usage redistribution.

### `projected_starter`
- **Type:** bool
- **Source:** injury feed lineup projection or most recent starter status
- **Stages:** Stage 2
- **Range:** {0, 1}

### `projected_minutes`
- **Type:** float
- **Source:** injury feed minutes projection (when available)
- **Stages:** Stage 2 (as feature or target-adjacent)
- **Range:** 0–48
- **Null policy:** NULL if no projection; model uses only when present

### `depth_chart_rank`
- **Type:** int
- **Source:** injury feed depth chart
- **Stages:** Stage 2
- **Range:** 1–5 typical (starter through 3rd-string)
- **Null policy:** impute from position average minutes

## 8. Team context features

### `team_pts_l10`, `team_pace_l10`, `team_off_rating_l10`, `team_def_rating_l10`
- **Type:** float
- **Source:** `feat_team_factors`
- **Stages:** Stage 5
- **Range:** pts 95–125, pace 94–104, ratings 100–125
- **Null policy:** impute with league averages
- **Rationale:** Player scoring is bounded by team scoring; high-pace teams produce more counting stats.

### `over_under_record_l10`
- **Type:** float
- **Source:** `feat_team_factors.ou_record_l10` — fraction of last 10 games that went over vs Vegas total
- **Stages:** Stage 5
- **Range:** [0, 1]
- **Rationale:** Soft signal for team's recent vs-market performance.

## 9. Prop line features (NEW with Odds API tier upgrade)

### `opening_line`, `current_line`, `closing_line`
- **Type:** float
- **Source:** `fact_prop_lines` — extended with tier upgrade
- **Stages:** Stage 5 (edge computation)
- **Range:** same as `line`
- **Null policy:** NULL if tier doesn't provide; fall back to single `line`

### `line_movement`
- **Type:** float
- **Source:** `current_line - opening_line`
- **Stages:** data quality flag, Stage 5
- **Range:** -3 to +3 typical, larger moves flagged
- **Rationale:** Line movement reflects sharp action. Large move against projection direction is a warning signal.

### `consensus_line`
- **Type:** float
- **Source:** median across 5+ sportsbooks
- **Stages:** Stage 5, risk layer
- **Range:** same as `line`
- **Rationale:** Single-book outliers are often stale or soft; consensus is closer to true market.

### `consensus_vs_book_delta`
- **Type:** float
- **Source:** `line - consensus_line`
- **Stages:** risk layer (outlier detection)
- **Range:** -1 to +1 typical; outside suggests book is off-market

### `price_american`
- **Type:** int
- **Source:** `fact_prop_lines.price_american`
- **Stages:** edge calculation (no-vig probability)
- **Range:** -300 to +300 typical for props
- **Rationale:** Implied probability from odds, used in Kelly sizing (Phase 3).

## 10. Model output features (produced by the pipeline)

These are not inputs; they are written alongside predictions and become inputs for downstream stages.

### `p_active` (Stage 1 output)
- **Type:** float
- **Range:** [0, 1]
- **Used by:** Stage 2 (as feature), final probability as multiplier

### `minutes_projection` (Stage 2 output)
- **Type:** float
- **Range:** 0–48
- **Used by:** Stages 3, 4, 5

### `minutes_projection_std` (Stage 2 output)
- **Type:** float
- **Range:** 0–10

### `usage_rate_projection` (Stage 3 output)
- **Type:** float
- **Range:** 5–40
- **Used by:** Stages 4, 5

### `pts_per_100_projection`, `reb_per_100_projection`, etc. (Stage 4 output)
- **Type:** float
- **Range:** varies by stat
- **Used by:** Stage 5

### `pts_projection` (Stage 5 output)
- **Type:** float
- **Range:** 0–60
- **Used by:** persistence, UI

### `pts_projection_std`, `pts_projection_skew` (Stage 5 output)
- **Type:** float
- **Used by:** probability calculation

### `p_raw` (Gaussian probability)
- **Type:** float
- **Range:** [0, 1]
- **Used by:** calibration layer

### `p_cal` (calibrated probability)
- **Type:** float
- **Range:** [0, 1]
- **Used by:** strength band assignment, Kelly sizing

### `edge`, `norm_edge`
- **Type:** float
- **Computed:** `edge = projection - line`, `norm_edge = edge / sigma`
- **Used by:** `strength_band` assignment

### `strength_band`
- **Type:** string
- **Range:** `{Strong Lean, Lean, Marginal, Pass}`
- **Used by:** UI, risk layer

### `coherence_score`, `display_strength_band`, `demotion_reason`
- **Type:** float, string, string
- **Source:** risk layer (Phase 1)
- **Used by:** UI

## Feature count summary

- Identity and keys: ~8
- Game context: ~10
- Schedule: ~10
- Rolling box-score (8 stats × 4 windows × ~5 variants): ~160
- Advanced stats (6 metrics × 3 windows × 2 filtered variants): ~36
- Matchup/opponent: ~15
- Availability: ~10 (requires injury feed)
- Team context: ~8
- Prop line: ~6
- Model outputs: ~15

**Total: ~278 features per prediction row**

Actual count varies by availability of optional features (injury feed) and market (some features apply only to certain markets). The canonical example feature row in [`examples/`](./examples/) shows a fully-populated instance.

## Feature quality rules

- **Imputation must be flagged.** When a feature is imputed (e.g., NULL vegas_total defaulted to league average), store a parallel `{feature}_imputed` boolean. Models should have access to this flag.
- **Stale features are worse than NULL.** If a feature is more than 48 hours stale relative to the prediction time, treat it as NULL and impute rather than use the stale value.
- **Training must mirror inference.** Any imputation done at training time must be done identically at inference time. Use shared feature-building code paths, not parallel implementations.
- **Category cardinality matters.** Categorical features (e.g., `injury_reason_category`) must have stable category sets between training and inference. New categories at inference time should map to `Unknown`.

## Features under evaluation (not in v2 but considered)

The following were considered for v2 but deferred:

- **Tracking data** (player speed, distance, defender distance) — requires Second Spectrum license, excessive cost
- **Referee assignments** — some value but data harder to obtain reliably
- **Revenge-game indicators** — soft signal, hard to engineer without noise
- **Social media sentiment** — noisy, engineering-intensive
- **Weather** — irrelevant for NBA

These may appear in future spec versions if predictive value is demonstrated elsewhere.
