# Data Sources

This document catalogs every external data source GeniePicks ingests, the endpoints used, cadence, cost, contractual constraints, and the tables each source writes to.

## Summary table

| Source | Data categories | Cost/month | Freshness | Contract type |
|---|---|---|---|---|
| NBA Stats API (stats.nba.com) | Player/team stats, advanced stats, play-by-play | Free | T+1 day | Unofficial, no TOS for programmatic use (caution advised) |
| The Odds API | Prop lines, game lines | $50–200 | Poll every 5–15 min | Self-serve subscription |
| PBP Stats | Possession-level data, lineups | $0 free / $8 paid | T+1 day | Developer-friendly |
| Injury feed (Option A) | Real-time injury status, lineups | $500–2000 | Real-time | B2B agreement |
| Injury feed (Option B) | Official injury reports, scraped sources | $0–100 | 30 min – 4 hr | Public data |
| Historical backfill | 8–10 seasons of above | $200–500 one-time | Static | One-time purchase |

## NBA Stats API

**Base URL:** `https://stats.nba.com/stats/`

**Status:** Free, no API key required, but undocumented and rate-limited. The NBA has not published formal terms for programmatic access; many analytics platforms use it under fair-use assumptions.

**Library:** `nba_api` Python package (`pip install nba_api`). Handles rate limiting, retries, and endpoint quirks.

### Endpoints used

| Endpoint | Purpose | Frequency | Writes to |
|---|---|---|---|
| `playergamelog` | Individual player game logs | Daily, T+1 | `fact_player_game_log` |
| `leaguedashplayerstats` | League-wide player stats | Weekly | `feat_player_season_stats` |
| `boxscoreadvancedv2` | Per-game advanced stats | Daily, T+1 | `fact_player_advanced` |
| `boxscoreusagev2` | Per-game usage stats | Daily, T+1 | `fact_player_advanced` |
| `playbyplayv2` | Possession events | Daily, T+1 | `fact_play_by_play` |
| `leaguedashteamstats` | Team-level stats | Daily | `fact_team_advanced` |
| `teamgamelog` | Team game logs | Daily, T+1 | `fact_team_game_log` |
| `commonplayerinfo` | Player biographical | On change | `dim_players` |

### Rate limits

- Unofficial but enforced: ~1 request per 1.5 seconds per IP
- Retries with exponential backoff recommended
- Keep-alive connections preferred
- Set `Referer` and `User-Agent` headers (the `nba_api` library handles this)

### Historical availability

Game logs and box scores: reliably available from 1996–97 onward. Play-by-play: 2000–01 onward with full coverage. Advanced stats: 2013–14 onward with full coverage.

### Known gotchas

- Playoff games use different `game_id` prefixes
- Some games have incomplete advanced stats until a day after final
- G-League players appear sporadically; filter on NBA-only via `league_id`
- Two-way players' data sometimes lives in separate G-League endpoints

## The Odds API

**Base URL:** `https://api.the-odds-api.com/v4/`

**Status:** Self-serve developer API with tiered pricing.

**Pricing tiers:**
- Free: 500 requests/month (insufficient for production)
- Starter: $35/month, 20K requests, closing lines only
- **Current GeniePicks tier** (assumed Developer): ~$50/month
- **Recommended upgrade** (v2 spec): Pro or higher, $100–200/month for line history and more books

### Endpoints used

| Endpoint | Purpose | Frequency | Writes to |
|---|---|---|---|
| `/sports/basketball_nba/events` | Today's NBA games | Every 30 min during slate | `fact_games` |
| `/sports/basketball_nba/events/{id}/odds` | Per-event prop lines | Every 5–15 min | `fact_prop_lines`, `fact_props_odds` |
| `/sports/basketball_nba/odds` | Game lines (spread/total) | Hourly | `fact_games` |

### Markets subscribed

`player_points, player_rebounds, player_assists, player_threes, player_blocks, player_steals, player_points_rebounds_assists, totals, spreads, h2h`

### Credit consumption

The Odds API charges per request and per market. A full slate refresh costs:
- ~12 games × 8 markets × 1 credit = ~96 credits per refresh
- At 4 refreshes/day: ~384 credits/day, ~11,500 credits/month
- This is why the Starter tier (20K credits) is typically insufficient

### Tier upgrade benefits (v2 spec recommendation)

Pro tier adds:
- Line movement history (open → current)
- More sportsbooks (ability to compute consensus line across 8+ books)
- Higher refresh frequency allowed

### Fields captured

```
event_id, commence_time, home_team, away_team,
bookmaker, market, outcome_name (player), outcome_price,
outcome_point (line), last_update
```

Stored in `fact_prop_lines` with timestamps so movement history is preserved even without the Pro tier.

## PBP Stats (pbpstats.com)

**Base URL:** `https://api.pbpstats.com/`

**Status:** Darryl Blackport's analytics service. Free tier for limited use, paid tier for more.

**Pricing:**
- Free tier: useful for testing and low-volume
- Paid tier: ~$8/month, higher rate limits, more features
- Python library (`pbpstats`) is open source and can be used standalone against NBA Stats API

### Use case for GeniePicks

Primary value: possession parsing. NBA Stats API provides raw play-by-play events; converting those to possessions (with correct attribution, exclusions, and lineup tracking) is complex and error-prone. The `pbpstats` library handles this correctly out of the box.

### Endpoints / library usage

```python
from pbpstats.client import Client
client = Client({'possessions': {'source': 'web', 'data_provider': 'stats_nba'}})
game = client.Game('0022500001')
possessions = game.possessions.items
# Each possession has player_on_court, events, points, ball_handler, etc.
```

### Writes to

`fact_possessions` — one row per possession, with garbage-time flag computed downstream.

## Injury feed

Two options documented. Choice deferred pending backtest resolution.

### Option A: RotoWire or FantasyLabs API (B2B)

**Status:** Commercial agreement required. Not self-serve.

**Sign-up:** Contact RotoWire Partners team or FantasyLabs sales directly. Expect 2–4 week sales cycle.

**Cost:** $500–2,000/month depending on volume and coverage.

**What you get:**
- Real-time injury status with reason codes
- Timestamped status change events (Questionable → Out at HH:MM)
- Projected starting lineups
- Depth charts
- Historical injury archive for training

**Alternative:** SportsStack (sportsstack.io) resells RotoWire access through a unified API. Potentially faster to onboard, possibly lower minimums.

### Option B: Free alternatives

**NBA official injury report:**
- Published twice daily at ~1 PM ET and ~5 PM ET on game days
- Scrapable from nba.com/official-nba-injury-report
- Cost: $0
- Freshness: 2–5 hours before tip in most cases
- Legal: public data, but scraping has grey-area ToS

**Existing GeniePicks injury data:**
- Current source unclear from audit; likely box-score-derived
- Investigate and optimize polling cadence first

**Twitter beat writer monitoring:**
- Twitter API basic tier: $100/month
- Follow Woj, Shams, and team-specific beat writers
- Requires NLP to extract structured "Player X is OUT" from prose
- Engineering-intensive

### Writes to

`fact_injury_events` — one row per observed status (player_id, status, reason, timestamp, source, raw_text).

## Historical backfill

**Purpose:** Bootstrap 8–10 seasons of training data for model development. One-time cost.

**Options:**
- Free: scrape NBA Stats API at ~1.5 sec/request — takes ~2 weeks to pull 10 seasons
- Paid: Sports Reference data dumps, Kaggle NBA datasets, commercial providers — $200–500 one-time
- Hybrid: scrape core data free, purchase advanced stats and historical injuries paid

**Backfill order of priority:**
1. Player game logs (core) — free scrape acceptable
2. Box score advanced stats — free scrape acceptable
3. Play-by-play — free scrape, slow
4. Historical injuries — paid is easier
5. Historical line data — The Odds API doesn't go back far; use alternative historical odds providers or skip

## Data source selection matrix

When deciding which sources to ingest for a given feature, use this decision tree:

```
Is the feature a box-score stat (pts, reb, ast, etc.)?
  → NBA Stats API / fact_player_game_log

Is it an advanced stat (USG%, TS%, AST%, TOV%)?
  → NBA Stats API boxscoreadvancedv2 / fact_player_advanced

Is it possession-level (lineup stats, on/off splits)?
  → PBP Stats / fact_possessions

Is it a betting line or odds?
  → The Odds API / fact_prop_lines, fact_games

Is it a live/real-time injury or lineup change?
  → Injury feed (Option A or B) / fact_injury_events

Is it schedule-derived (rest, back-to-back)?
  → Computed from fact_games, no external source

Is it Vegas-derived (implied totals, pace expectations)?
  → The Odds API totals/spreads / computed
```

## Monitoring and reliability

Every ingestion task must:
- Write a freshness timestamp to a `task_runs` table
- Emit a success/failure log
- Alert on consecutive failures (3+ fails in a row)
- Alert on data staleness (no update in expected window)

The staging-phase discovery of `feat_matchup_context.opp_*` NULL on 162K rows illustrates why: silent ingestion failures compound into model quality issues. Every source needs a heartbeat.
