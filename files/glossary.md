# Glossary

Domain terms, abbreviations, and internal conventions used in GeniePicks documentation.

## Basketball stats

**PTS** — Points scored.

**REB** — Total rebounds (offensive + defensive).

**AST** — Assists.

**STL** — Steals.

**BLK** — Blocks.

**TOV** — Turnovers.

**3PM** — Three-pointers made.

**PRA** — Points + Rebounds + Assists (compound market).

**FGA** — Field goal attempts.

**FTA** — Free throw attempts.

**FGM** — Field goals made.

**FTM** — Free throws made.

**MIN** — Minutes played.

**MPG** — Minutes per game.

**DNP** — Did Not Play.

## Advanced stats

**USG% (Usage rate)** — Percentage of team possessions a player uses while on the floor. Formula: `(FGA + 0.44 × FTA + TOV) × Team MP / 5 / (MP × (Team FGA + 0.44 × Team FTA + Team TOV)) × 100`. League average ~20%. Elite creators (Jokic, Dončić) 30%+.

**TS% (True Shooting percentage)** — Shooting efficiency including free throws and three-pointers. Formula: `PTS / (2 × (FGA + 0.44 × FTA))`. League average ~0.57. Values expressed as decimal (0.65), not percent (65%).

**eFG% (Effective Field Goal percentage)** — Field goal percentage adjusted for three-pointers being worth more. Formula: `(FGM + 0.5 × 3PM) / FGA`.

**PSA (Points per Shot Attempt)** — Scoring efficiency metric used by Cleaning the Glass. Formula: `PTS / (FGA + 0.44 × FTA) × 100`. Similar to TS% but scaled differently. Elite scorers 130+.

**AST% (Assist percentage)** — Percentage of teammates' field goals a player assists while on floor.

**TOV% (Turnover percentage)** — Turnovers per 100 possessions used.

**ORtg (Offensive Rating)** — Points produced per 100 possessions.

**DRtg (Defensive Rating)** — Points allowed per 100 possessions.

**Net Rating** — ORtg minus DRtg.

**Pace** — Possessions per 48 minutes. League average ~99.

## Betting terms

**Line** — The over/under value set by a sportsbook (e.g., Banchero PTS line of 17.5).

**Edge** — Difference between model projection and line. `edge = projection - line`. Positive edge for OVER, negative for UNDER.

**norm_edge (normalized edge)** — Edge expressed in standard deviations: `edge / sigma`. Allows comparing edges across markets with different scales.

**Price (American odds)** — e.g., -115, +100. Represents the payout for a $100 bet (if negative) or profit on a $100 bet (if positive).

**Implied probability** — Probability implied by odds. `-115` implies `115/(115+100) = 53.5%`. No-vig probability subtracts the book's margin.

**Closing Line Value (CLV)** — Difference between the line you bet and the closing line. Positive CLV over time is a strong long-term edge indicator.

**Juice / Vig** — The sportsbook's margin embedded in odds. Typical prop bet juice: 4–8%.

**Consensus line** — Median line across multiple sportsbooks. More reliable than any single book.

**Sharp action** — Bets from professional or well-informed bettors. Detected via line movement patterns.

**Sharp book** — Sportsbook whose lines reflect sharp action (Pinnacle, Circa). Their lines tend to be closer to "true" probability.

## Model/ML terms

**p_raw** — Raw probability output from the model, computed via Gaussian CDF from projection and sigma.

**p_cal** — Calibrated probability, post-isotonic adjustment. `p_cal` is what drives `strength_band` assignment.

**val_rmse** — Validation-set RMSE. The primary model quality metric.

**Brier score** — Calibration quality metric. Lower is better. Sum of squared errors between stated probability and actual outcome.

**ECE (Expected Calibration Error)** — Max difference between stated probability and empirical hit rate across probability buckets.

**strength_band** — Engine's assessment of pick confidence. Values: Strong Lean, Lean, Marginal, Pass.

**display_strength_band** — Post-coherence-demotion strength_band shown to users. May be same as or lower than `strength_band`.

**L3, L5, L10, L20** — Rolling window: Last 3, 5, 10, 20 games.

**EWMA (Exponentially Weighted Moving Average)** — Rolling average with exponential decay on older values. "Half-life of 3" means a game 3 games ago has half the weight of the current game.

**Isotonic regression** — Calibration technique that fits a non-decreasing step function. Used for `p_raw → p_cal` mapping.

**p10, p90 (prediction interval bounds)** — 10th and 90th percentiles of a predictive distribution. An 80% prediction interval contains the actual outcome 80% of the time if properly calibrated.

## Internal GeniePicks terms

**Slate** — A day's NBA games and the prop picks derived from them.

**Pick** — A specific (player, market, side, line) combination that the model has scored. Example: "Paolo Banchero PTS UNDER 17.5".

**slate_live** — In backtest SQL, the set of rows representing the latest run per (pick_date, model_id, market). Excludes stale picks from earlier runs that were superseded.

**Coherence score** — Risk-layer scalar in [0, 1] measuring agreement between engine direction and rolling-form signals. Documented fully in risk-model-spec.md.

**Demotion** — When coherence score is low, `display_strength_band` is demoted from `strength_band`. Two-tier demotion possible: Strong Lean → Marginal if coherence < 0.30.

**Maxey-pattern pick** — A pick where the engine is confident (Strong Lean) but rolling form disagrees with the call direction. The canonical example case driving the risk layer design.

**Adj Proj / AdjProjection** — Matchup-adjusted projection computed as `round(L5 × DefensiveFactor, 1)`. Used for coherence scoring. Shown in UI as "ADJ PROJ".

**DefensiveFactor** — Opponent's allowed stat divided by league average. Values >1 mean opponent is worse than league average at defending that stat; <1 means better.

**Matchup tag** — Categorical label on a matchup: HOSTILE, NEUTRAL, FAVORABLE, ELITE_SPOT. Mapping to directional bias is not canonicalized (open task).

**Garbage time** — Game minutes where score differential is large enough that lineups and play style don't reflect normal basketball. GeniePicks follows approximate CTG rules: score_diff > 25 with <5 min in Q4, or >35 with <8 min.

**Hostile / Neutral / Favorable** — Matchup environment labels on pick cards. Imply matchup difficulty but canonical mapping is undocumented as of v2 spec.

**Thin** — Sample-size warning on pick cards, typically indicating <8 games of data for the player.

**Consistent** — Opposite of Thin; player has sufficient sample size and stable recent performance.

## Data and engineering

**Fact table** — Database table storing events or observations (`fact_games`, `fact_player_game_log`, etc.).

**Dimension table** — Database table storing entities that don't change frequently (`dim_players`, `dim_teams`).

**Feature table** — Database table storing computed features (`feat_player_rolling`, `feat_matchup_context`).

**Upsert** — Database operation that inserts if not exists, updates if exists. Used by `FactWriter.upsert_picks`.

**TimescaleDB** — Postgres extension optimized for time-series data. Used for high-volume tables like `fact_play_by_play`.

**Hypertable** — TimescaleDB table partitioned by time. Each partition is a "chunk."

**Celery Beat** — Celery's scheduler for periodic tasks. Separate from `celery-worker` which executes them.

**stats_snapshot** — JSONB column in `fact_picks_daily` holding the full feature/output audit for a prediction.

**Freshness timestamp** — When a data row was last updated. Used to detect stale features.

## Roles and platforms

**PrizePicks** — DFS platform focused on "pick'em" contests. Has distinct lines from traditional sportsbooks.

**DraftKings / FanDuel / BetMGM** — Traditional US sportsbooks offering prop markets.

**Pinnacle** — International sportsbook known for sharp lines. Often used as "true probability" reference.

**Underdog Fantasy** — Similar to PrizePicks; pick'em-style DFS.

**Sleeper** — Fantasy platform that also has DFS pick'em.

**Pick6 (DraftKings)** — DraftKings' pick'em product.

**DFS (Daily Fantasy Sports)** — Category of contest where users pick daily lineups for a cash prize.

**SGP (Same Game Parlay)** — Parlay bet where all legs are from the same game.

## Team and league

**NBA** — National Basketball Association. Primary focus of GeniePicks.

**G-League** — NBA's minor-league system. Some players have split NBA / G-League time.

**Playoff series** — Best-of-7 series between two teams in the NBA playoffs.

**Home court advantage** — Typical ~2-3 points worth of edge for home team in NBA.

**Back-to-back (B2B)** — Two games in consecutive nights. Correlates with reduced minutes for star players.

**Rest days** — Days between a team's previous game and current game.

## Other acronyms

**CLV** — Closing Line Value (defined above).

**CTG** — Cleaning the Glass (cleaningtheglass.com), an NBA analytics site.

**EWMA** — Exponentially Weighted Moving Average (defined above).

**PBP** — Play-by-Play.

**ETA** — Estimated Time of Arrival; common estimation shorthand.

**ETL** — Extract, Transform, Load; data ingestion/processing pipeline.

**RMSE** — Root Mean Squared Error.

**MAE** — Mean Absolute Error.

**SE** — Standard Error.

**CI** — Confidence Interval or Continuous Integration depending on context.

**SQL** — Structured Query Language.

**API** — Application Programming Interface.

**TOS** — Terms of Service.

**SLA** — Service Level Agreement.

**RMSE vs MAE** — RMSE penalizes large errors more than MAE. GeniePicks uses RMSE as primary metric because large prediction errors (bets sized on them) are disproportionately costly.
