# 🚀 DETAILED PRODUCT REQUIREMENTS DOCUMENT (PRD)
**Project:** Premium Sports Analytics Dashboard (GeniePicks)
**Version:** 1.0.0
**Date:** April 27, 2026

---

## 1. 🧠 SYSTEM OVERVIEW
GeniePicks is a high-density, data-driven sports analytics dashboard designed for professional bettors and data enthusiasts. The system processes real-time market data (Vegas Lines) and compares it with internal ML Model projections to find "Edge" (discrepancies).

### Technology Stack:
*   **Frontend:** React (Vite)
*   **Styling:** Vanilla CSS with a centralized Variable Design System (Light/Dark Mode).
*   **Icons:** Lucide-React
*   **Data Management:** Centralized `lib/data.js` (Simulating a real-time API).

---

## 2. 🗺️ NAVIGATION & MENU STRUCTURE (9 MODULES)

### 2.1 🏠 TODAY'S SLATE (`/`)
**Purpose:** High-level summary of the day's games and immediate betting opportunities.
*   **Data Points:** Total Games, Best Edge, Injury Count, Last Update Timestamp.
*   **Game Cards:**
    *   Team Matchups (Logo, Code, Record).
    *   Vegas Win Probability vs. Model Win Probability.
    *   Over/Under comparison (Market vs. Model).
    *   **Blowout Risk Meter:** Categorized as Low, Moderate, or High.
    *   **Injury Impact:** Numerical score reflecting how much missing players affect the line.
*   **Expandable Analysis:** Deep dive into ATS (Against the Spread) records, Last 10 history, and Pace ratings.

### 2.2 🎯 TOP PICKS (`/picks`)
**Purpose:** The core marketplace for player projections.
*   **Dual View System:** 
    *   **Card View:** High-impact visual cards for rapid scanning.
    *   **Table View:** High-density data grid for deep analysis.
*   **Data Columns:**
    *   **Edge:** The percentage difference between the Market Line and Model Projection.
    *   **Confidence:** (Strong Lean, Lean, Marginal, Pass) based on backtested performance.
    *   **Sharp Move:** Detection of "Sharp" market movement vs. "Drift".
    *   **Difficulty:** Hostile, Tough, or Favorable matchups based on defensive grades.

### 2.3 🏆 LINEUP ANALYZER (`/lineup`)
**Purpose:** Build and analyze multi-pick betting entries.
*   **Slip Builder:** Users can add/remove picks from their current entry.
*   **Entry Summary:**
    *   Cumulative Edge.
    *   **Probability Calculator:** Estimates the % chance of hitting a specific number of legs.
    *   **Consensus Sharp Score:** Aggregated market sentiment for the whole slip.

### 2.4 📈 PERFORMANCE (`/performance`)
**Purpose:** Transparency and track record verification.
*   **Hit Rate Table:** Shows win % broken down by Confidence Band (e.g., Strong Lean hits 69%).
*   **P/L Curve:** Chart showing profit/loss trend over time.
*   **Stats Summary:** Total ROI, Net Profit (Units), and Win/Loss distribution.

### 2.5 📒 LEDGER (`/ledger`)
**Purpose:** A searchable audit trail of all historical projections.
*   **Filters:** Filter by Date, Result (W/L/P), and Confidence.
*   **Details:** Tracks the closing line, final result, and specific unit profit per pick.

### 2.6 🧠 ENGINE (`/engine`)
**Purpose:** Advanced insights and system-wide snapshots.
*   **Hero Highlight:** The highest-confidence play of the day with detailed reasoning.
*   **Probability Engine:** Visual distribution of market lines vs. model results.
*   **System Health:** Real-time status of Database, API Quotas, and Model API.

### 2.7 📊 SERIES (`/series`)
**Purpose:** Team-specific analytics and season-long performance.
*   **Ratings Grid:** Offensive Rating, Defensive Rating, Net Rating, and Pace.
*   **Consistency Score:** How reliably a team hits their projected totals.

### 2.8 🔐 POLICIES (`/policies`)
**Purpose:** Admin-only view for adjusting model weightings.
*   **Signal Weighting:** Control how much `Edge`, `Movement`, or `Sharp Sentiment` influences the final score.
*   **Thresholds:** Set minimum edge requirements for "Strong Lean" categorization.

### 2.9 ⚙️ PIPELINE (`/pipeline`)
**Purpose:** Data orchestration control center.
*   **Workers:** Manual triggers for Re-seeding Prop Lines, Ingesting Box Scores, and Rebuilding Projections.
*   **Master Sync:** One-click synchronization of the entire data pipeline.

---

## 3. 💾 DATA SCHEMA (lib/data.js)

### 3.1 `GAMES` Object
| Field | Type | Description |
| :--- | :--- | :--- |
| `vegasHomeWin` | Number | Betting market implied win probability. |
| `modelHomeWin` | Number | Internal ML model projected win probability. |
| `blowoutRisk` | Number | % chance the game is not competitive. |
| `injuryImpact` | Number | Weighted score of missing roster value. |

### 3.2 `PLAYER_PROPS` Object
| Field | Type | Description |
| :--- | :--- | :--- |
| `edge` | Number | % difference: `(Projection - Line) / Line`. |
| `confidence` | String | Backtested reliability bucket. |
| `sharp` | String | Identifies "Sharp" (Smart Money) movement. |
| `difficulty` | String | Defensive matchup context (RIM PROTECTOR, HOSTILE, etc.). |

---

## 4. 🎨 DESIGN SYSTEM & THEME
The application uses a **Premium Financial Terminal** aesthetic.

### Theme Variables:
*   **Backgrounds:** `var(--bg-primary)` for main surfaces, `var(--bg-card)` for components.
*   **Accents:**
    *   **Neon Green (`#00FF88`):** Profits, Wins, "Over" picks.
    *   **Electric Blue (`#00CFFF`):** Analytics, Information, Brand.
    *   **Gold (`#D4AF37`):** Premium features, High-EV targets.
*   **Theming:** Fully functional **Light Mode** and **Night Mode** (System default).

---

## 5. 🛠️ FUNCTIONAL REQUIREMENTS
1.  **Theme Persistence:** Theme selection must be saved in `localStorage`.
2.  **State Management:** The `SlipContext` must persist user-selected picks across all pages.
3.  **Responsiveness:** All tables must be scrollable on mobile; cards must stack vertically.
4.  **Animations:** Use `anim-fade` and `anim-slide` for all page transitions and modal entries.
