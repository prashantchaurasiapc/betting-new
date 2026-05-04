export const NAV_ITEMS = [
  { label: 'Slate', path: '/', icon: 'Layout' },
  { label: 'Top Picks', path: '/picks', icon: 'Target' },
  { label: 'Lineup', path: '/lineup', icon: 'Shield' },
  { label: 'Performance', path: '/performance', icon: 'BarChart2' },
  { label: 'Ledger', path: '/ledger', icon: 'BookOpen' },
  { label: 'Engine', path: '/engine', icon: 'Zap' },
  { label: 'Series', path: '/series', icon: 'TrendingUp' },
  { label: 'Policies', path: '/policies', icon: 'Lock' },
  { label: 'Pipeline', path: '/pipeline', icon: 'GitPullRequest' },
]

export const SLATE_STATS = {
  date: 'April 25, 2026',
  totalGames: 4,
  bestEdge: '+14.8',
  topPick: 'SGA — PTS Under',
  injuryAlerts: 6,
  lastUpdated: '3:05 PM ET',
}

export const GAMES = [
  {
    id: 1,
    homeTeam: 'OKC Thunder', awayTeam: 'PHX Suns',
    homeCode: 'OKC', awayCode: 'PHX',
    time: '7:30 PM ET',
    vegasHomeWin: 68, modelHomeWin: 72,
    vegasTotal: 224.5, modelTotal: 219.2,
    spread: -8.5, blowoutRisk: 38,
    paceRating: 'Fast', paceValue: 112,
    injuryImpact: 4.2, bestBet: 'OKC -8.5',
    homePicks: 21, awayPicks: 18,
    injuries: {
      home: [{ player: 'Chet Holmgren', status: 'OUT', impact: 'High' }],
      away: [{ player: 'Kevin Durant', status: 'Q', impact: 'High' }, { player: 'Bradley Beal', status: 'D', impact: 'Med' }],
    },
    atsRecord: { home: '28-18', away: '22-24' },
    last10: '7-3 OKC', restAdvantage: 'OKC +1 day',
    offRtg: { home: 118.4, away: 112.1 },
    defRtg: { home: 108.2, away: 115.6 },
  },
  {
    id: 2,
    homeTeam: 'NYK Knicks', awayTeam: 'ATL Hawks',
    homeCode: 'NYK', awayCode: 'ATL',
    time: '7:30 PM ET',
    vegasHomeWin: 62, modelHomeWin: 58,
    vegasTotal: 218.0, modelTotal: 221.4,
    spread: -5.5, blowoutRisk: 22,
    paceRating: 'Average', paceValue: 99,
    injuryImpact: 2.8, bestBet: 'Over 218.0',
    homePicks: 26, awayPicks: 22,
    injuries: {
      home: [{ player: 'OG Anunoby', status: 'Q', impact: 'Med' }],
      away: [{ player: "Trae Young", status: 'OUT', impact: 'High' }],
    },
    atsRecord: { home: '25-21', away: '19-27' },
    last10: '6-4 NYK', restAdvantage: 'Even',
    offRtg: { home: 115.2, away: 110.8 },
    defRtg: { home: 111.4, away: 118.2 },
  },
  {
    id: 3,
    homeTeam: 'DET Pistons', awayTeam: 'ORL Magic',
    homeCode: 'DET', awayCode: 'ORL',
    time: '8:30 PM ET',
    vegasHomeWin: 44, modelHomeWin: 47,
    vegasTotal: 212.5, modelTotal: 210.8,
    spread: 2.5, blowoutRisk: 15,
    paceRating: 'Slow', paceValue: 94,
    injuryImpact: 1.5, bestBet: 'DET +2.5',
    homePicks: 19, awayPicks: 24,
    injuries: {
      home: [],
      away: [{ player: 'Paolo Banchero', status: 'Q', impact: 'High' }],
    },
    atsRecord: { home: '22-24', away: '26-20' },
    last10: '5-5', restAdvantage: 'ORL +1 day',
    offRtg: { home: 109.5, away: 113.2 },
    defRtg: { home: 113.8, away: 107.4 },
  },
  {
    id: 4,
    homeTeam: 'MIN Timberwolves', awayTeam: 'DEN Nuggets',
    homeCode: 'MIN', awayCode: 'DEN',
    time: '9:00 PM ET',
    vegasHomeWin: 55, modelHomeWin: 60,
    vegasTotal: 220.5, modelTotal: 224.1,
    spread: -3.0, blowoutRisk: 19,
    paceRating: 'Fast', paceValue: 108,
    injuryImpact: 3.1, bestBet: 'MIN -3.0',
    homePicks: 28, awayPicks: 20,
    injuries: {
      home: [],
      away: [{ player: 'Nikola Jokic', status: 'Q', impact: 'High' }, { player: 'Jamal Murray', status: 'OUT', impact: 'High' }],
    },
    atsRecord: { home: '30-16', away: '24-22' },
    last10: '8-2 MIN', restAdvantage: 'MIN +2 days',
    offRtg: { home: 117.8, away: 119.1 },
    defRtg: { home: 107.6, away: 110.2 },
  },
]

export const PLAYER_PROPS = [
  {
    id: 1, player: 'Shai Gilgeous-Alexander', team: 'OKC', matchup: 'OKC vs PHX', market: 'PTS', line: 27.5, projection: 21.8, edge: -14.0, score: 17.181, confidence: 'Strong Lean', side: 'UNDER',
    trend: [28, 31, 24, 29, 26, 22, 33, 25, 30, 28], trendL3: 28.0, trendL5: 27.6, trendL10: 27.6,
    opponentHistory: [
      { date: '2026-02-12', opponent: 'PHX', home: true, result: 24 },
      { date: '2025-12-05', opponent: 'PHX', home: false, result: 31 },
      { date: '2025-11-14', opponent: 'PHX', home: true, result: 26 }
    ],
    difficulty: 'HOSTILE', move: '-0.98 / 1.00', sharp: 'Sharp', align: 'WITH',
    defensiveRank: 4, volatility: 2.1, adjProjection: 22.4, isCorrelated: true, minutes: 36.2, usage: 31.4
  },
  {
    id: 2, player: 'Cade Cunningham', team: 'DET', matchup: 'DET vs ORL', market: 'PTS', line: 25.5, projection: 19.2, edge: -13.9, score: 14.993, confidence: 'Strong Lean', side: 'UNDER',
    trend: [27, 24, 22, 28, 25, 23, 26, 21, 29, 24], trendL3: 24.3, trendL5: 25.2, trendL10: 24.9,
    opponentHistory: [
      { date: '2026-03-01', opponent: 'ORL', home: false, result: 22 },
      { date: '2026-01-15', opponent: 'ORL', home: true, result: 28 },
      { date: '2025-12-20', opponent: 'ORL', home: false, result: 25 }
    ],
    difficulty: 'HOSTILE', move: '-0.98 / 1.00', sharp: 'Sharp', align: 'AGAINST',
    defensiveRank: 2, volatility: 1.8, adjProjection: 19.8
  },
  {
    id: 3, player: 'Anthony Edwards', team: 'MIN', matchup: 'MIN vs DEN', market: 'PTS', line: 26.5, projection: 20.1, edge: -12.7, score: 14.847, confidence: 'Strong Lean', side: 'UNDER',
    trend: [30, 25, 22, 27, 28, 24, 31, 26, 29, 25], trendL3: 25.7, trendL5: 26.4, trendL10: 26.7,
    opponentHistory: [
      { date: '2026-04-10', opponent: 'DEN', home: true, result: 22 },
      { date: '2026-02-28', opponent: 'DEN', home: false, result: 34 },
      { date: '2025-12-15', opponent: 'DEN', home: true, result: 25 }
    ],
    difficulty: 'HOSTILE', move: '1.97 / 4.00', sharp: 'Sharp', align: 'AGAINST',
    defensiveRank: 6, volatility: 2.5, adjProjection: 21.2
  },
  {
    id: 4, player: 'Julius Randle', team: 'MIN', matchup: 'MIN vs DEN', market: 'PTS', line: 18.5, projection: 14.2, edge: -11.2, score: 12.555, confidence: 'Strong Lean', side: 'UNDER',
    trend: [20, 17, 15, 19, 18, 16, 21, 18, 22, 17], trendL3: 17.3, trendL5: 17.8, trendL10: 18.3,
    opponentHistory: [
      { date: '2026-04-10', opponent: 'DEN', home: true, result: 15 },
      { date: '2026-02-28', opponent: 'DEN', home: false, result: 23 }
    ],
    difficulty: 'HOSTILE', move: '0.00 / 2.00', sharp: 'Sharp', align: 'AGAINST',
    defensiveRank: 6, volatility: 3.1, adjProjection: 15.5
  },
  {
    id: 5, player: 'Jalen Brunson', team: 'NYK', matchup: 'NYK vs ATL', market: 'PTS', line: 25.5, projection: 19.8, edge: -8.9, score: 10.324, confidence: 'Strong Lean', side: 'UNDER',
    trend: [26, 24, 22, 25, 24, 28, 21, 23, 26, 25], trendL3: 24.0, trendL5: 24.2, trendL10: 24.9,
    opponentHistory: [
      { date: '2026-03-15', opponent: 'ATL', home: true, result: 21 },
      { date: '2026-01-20', opponent: 'ATL', home: false, result: 32 },
      { date: '2025-11-30', opponent: 'ATL', home: true, result: 24 }
    ],
    difficulty: 'HOSTILE', move: '0.00 / 2.00', sharp: 'Sharp', align: 'AGAINST',
    defensiveRank: 22, volatility: 1.5, adjProjection: 20.5
  },
  {
    id: 6, player: 'Jalen Duren', team: 'DET', matchup: 'DET vs ORL', market: 'PTS', line: 12.5, projection: 10.2, edge: -9.1, score: 9.890, confidence: 'Strong Lean', side: 'UNDER',
    trend: [13, 11, 10, 12, 14, 9, 15, 11, 12, 13], trendL3: 11.3, trendL5: 12.0, trendL10: 12.0,
    opponentHistory: [
      { date: '2026-03-01', opponent: 'ORL', home: false, result: 10 },
      { date: '2026-01-15', opponent: 'ORL', home: true, result: 14 }
    ],
    difficulty: 'HOSTILE', move: '0.00 / 0.00', sharp: 'Drift', align: 'NEUTRAL',
    defensiveRank: 2, volatility: 1.2, adjProjection: 10.8
  },
  {
    id: 7, player: 'Jalen Johnson', team: 'ATL', matchup: 'ATL vs NYK', market: 'PTS', line: 20.5, projection: 16.8, edge: -7.1, score: 8.933, confidence: 'Strong Lean', side: 'UNDER',
    trend: [21, 19, 18, 22, 20, 17, 23, 19, 20, 21], trendL3: 19.3, trendL5: 20.0, trendL10: 20.0,
    opponentHistory: [
      { date: '2026-03-15', opponent: 'NYK', home: false, result: 18 },
      { date: '2026-01-20', opponent: 'NYK', home: true, result: 24 }
    ],
    difficulty: 'HOSTILE', move: '0.98 / 3.00', sharp: 'Sharp', align: 'AGAINST',
    defensiveRank: 1, volatility: 1.9, adjProjection: 17.5
  },
  {
    id: 8, player: 'Karl-Anthony Towns', team: 'NYK', matchup: 'NYK vs ATL', market: 'PTS', line: 19.5, projection: 16.4, edge: -6.1, score: 7.643, confidence: 'Lean', side: 'UNDER',
    trend: [20, 18, 17, 21, 19, 16, 22, 18, 20, 19], trendL3: 18.3, trendL5: 19.0, trendL10: 19.0,
    opponentHistory: [
      { date: '2026-03-15', opponent: 'ATL', home: true, result: 17 },
      { date: '2026-01-20', opponent: 'ATL', home: false, result: 25 }
    ],
    difficulty: 'HOSTILE', move: '0.98 / 3.00', sharp: 'Sharp', align: 'AGAINST',
    defensiveRank: 22, volatility: 2.2, adjProjection: 17.2
  },
  {
    id: 9, player: 'Devin Booker', team: 'PHX', matchup: 'PHX vs OKC', market: 'PTS', line: 19.5, projection: 16.2, edge: -6.1, score: 7.591, confidence: 'Strong Lean', side: 'UNDER',
    trend: [22, 18, 19, 20, 18, 21, 17, 19, 20, 19], trendL3: 19.7, trendL5: 19.4, trendL10: 19.3,
    opponentHistory: [
      { date: '2026-02-12', opponent: 'OKC', home: false, result: 18 },
      { date: '2025-12-05', opponent: 'OKC', home: true, result: 24 }
    ],
    difficulty: 'HOSTILE', move: '-0.98 / 1.00', sharp: 'Sharp', align: 'WITH',
    defensiveRank: 3, volatility: 2.0, adjProjection: 16.8, isCorrelated: true, minutes: 38.5, usage: 29.8
  },
  {
    id: 10, player: 'Miles McBride', team: 'NYK', matchup: 'NYK vs ATL', market: 'PTS', line: 6.5, projection: 5.0, edge: -5.5, score: 6.265, confidence: 'Lean', side: 'UNDER',
    trend: [8, 6, 5, 7, 6, 4, 7, 5, 6, 6], trendL3: 6.3, trendL5: 6.4, trendL10: 6.1,
    opponentHistory: [
      { date: '2026-03-15', opponent: 'ATL', home: true, result: 5 },
      { date: '2026-01-20', opponent: 'ATL', home: false, result: 9 }
    ],
    difficulty: 'HOSTILE', move: '-0.98 / 1.00', sharp: 'Sharp', align: 'AGAINST',
    defensiveRank: 22, volatility: 1.1, adjProjection: 5.5
  },
  {
    id: 11, player: 'Anthony Edwards', team: 'MIN', matchup: 'MIN vs DEN', market: 'REB', line: 5.5, projection: 4.2, edge: -4.8, score: 5.880, confidence: 'Lean', side: 'UNDER',
    trend: [6, 5, 4, 6, 5, 3, 7, 4, 5, 5], trendL3: 5.0, trendL5: 5.2, trendL10: 5.0,
    opponentHistory: [
      { date: '2026-04-10', opponent: 'DEN', home: true, result: 4 },
      { date: '2026-02-28', opponent: 'DEN', home: false, result: 8 }
    ],
    difficulty: 'TOUGH', move: '0.50 / 1.00', sharp: 'Sharp', align: 'AGAINST',
    defensiveRank: 6, volatility: 1.4, adjProjection: 4.5
  },
  {
    id: 12, player: 'Nikola Jokic', team: 'DEN', matchup: 'DEN vs MIN', market: 'AST', line: 9.5, projection: 11.2, edge: 4.2, score: 8.140, confidence: 'Lean', side: 'OVER',
    trend: [10, 12, 11, 9, 10, 13, 8, 11, 12, 10], trendL3: 11.0, trendL5: 10.4, trendL10: 10.6,
    opponentHistory: [
      { date: '2026-04-10', opponent: 'MIN', home: false, result: 12 },
      { date: '2026-02-28', opponent: 'MIN', home: true, result: 9 }
    ],
    difficulty: 'FAVORABLE', move: '0.00 / 0.00', sharp: 'Drift', align: 'WITH',
    defensiveRank: 10, volatility: 2.8, adjProjection: 10.5
  },
]


export const BIG_MOVERS = [
  { player: 'CJ McCollum', matchup: 'ATL vs NYK', market: 'PTS', line: 19.5, newLine: 15.5, move: -4.0, sigma: 0.70, type: 'Sharp', pick: 'UNDER', strength: 'Marginal', align: 'AGAINST' },
  { player: 'Nickeil Alexander-Walker', matchup: 'ATL vs NYK', market: 'PRA', line: 25.5, newLine: 21.5, move: -4.0, sigma: 0.62, type: 'Sharp', pick: 'UNDER', strength: 'Pass', align: 'AGAINST' },
  { player: 'Anthony Edwards', matchup: 'MIN vs DEN', market: 'PTS', line: 26.5, newLine: 22.5, move: -4.0, sigma: 0.70, type: 'Sharp', pick: 'UNDER', strength: 'Strong Lean', align: 'AGAINST' },
  { player: 'Anthony Edwards', matchup: 'MIN vs DEN', market: 'PRA', line: 37.5, newLine: 34.5, move: -3.0, sigma: 0.46, type: 'Sharp', pick: 'UNDER', strength: 'Strong Lean', align: 'AGAINST' },
  { player: 'Jonathan Kuminga', matchup: 'ATL vs NYK', market: 'PTS', line: 13.5, newLine: 10.5, move: -3.0, sigma: 0.53, type: 'Sharp', pick: 'UNDER', strength: 'Lean', align: 'AGAINST' },
  { player: 'Dyson Daniels', matchup: 'ATL vs NYK', market: 'PRA', line: 21.5, newLine: 18.5, move: -3.0, sigma: 0.46, type: 'Sharp', pick: 'UNDER', strength: 'Marginal', align: 'AGAINST' },
  { player: 'Jalen Brunson', matchup: 'NYK vs ATL', market: 'AST', line: 8.5, newLine: 6.5, move: -2.0, sigma: 0.58, type: 'Sharp', pick: 'UNDER', strength: 'Lean', align: 'WITH' },
]

export const BEST_COMBOS = [
  {
    id: 1, score: 19.6, type: 'Balanced', totalEdge: '+6.10', avgRank: '#4.0', games: 2,
    legs: [
      { player: 'Anthony Edwards', matchup: 'MIN vs DEN', market: 'PRA', dir: 'Less', line: 37.5, to: 16.8, edge: -20.7, confidence: 'Strong Lean' },
      { player: 'Jalen Brunson', matchup: 'NYK vs ATL', market: 'PRA', dir: 'Less', line: 36.5, to: 17.5, edge: -19.0, confidence: 'Strong Lean' },
    ],
  },
  {
    id: 2, score: 19.6, type: 'Balanced', totalEdge: '+6.00', avgRank: '#3.5', games: 2,
    legs: [
      { player: 'Anthony Edwards', matchup: 'MIN vs DEN', market: 'PRA', dir: 'Less', line: 37.5, to: 16.8, edge: -20.7, confidence: 'Strong Lean' },
      { player: 'Karl-Anthony Towns', matchup: 'NYK vs ATL', market: 'PRA', dir: 'Less', line: 35.5, to: 17.2, edge: -18.3, confidence: 'Strong Lean' },
    ],
  },
  {
    id: 3, score: 18.9, type: 'Aggressive', totalEdge: '+5.80', avgRank: '#3.0', games: 2,
    legs: [
      { player: 'Shai Gilgeous-Alexander', matchup: 'OKC vs PHX', market: 'PTS', dir: 'Less', line: 27.5, to: 12.8, edge: -14.7, confidence: 'Strong Lean' },
      { player: 'Cade Cunningham', matchup: 'DET vs ORL', market: 'PTS', dir: 'Less', line: 25.5, to: 11.2, edge: -14.3, confidence: 'Strong Lean' },
    ],
  },
]

export const PERFORMANCE_BANDS = [
  { band: 'Strong Lean', total: 58, hits: 40, hitRate: '69.0%', flatPL: '+0.69 u' },
  { band: 'Lean', total: 20, hits: 8, hitRate: '38.5%', flatPL: '+0.80 u' },
  { band: 'Marginal', total: 144, hits: 65, hitRate: '45.8%', flatPL: '-12.00 u' },
  { band: 'Pass', total: 107, hits: 46, hitRate: '34.2%', flatPL: '-13.00 u' },
]

export const LEDGER_PICKS = [
  { date: '2026-04-26', player: 'LeBron James', market: 'PTS', side: 'UNDER', line: 23.5, proj: 18.8, edge: 1.25, band: 'Strong Lean', result: 'W', flatPL: 1.00 },
  { date: '2026-04-26', player: 'Kevin Durant', market: 'PTS', side: 'UNDER', line: 27.5, proj: 22.0, edge: 1.67, band: 'Strong Lean', result: 'W', flatPL: 1.00 },
  { date: '2026-04-26', player: 'Jayson Tatum', market: 'PTS', side: 'OVER', line: 22.5, proj: 11.0, edge: 1.03, band: 'Strong Lean', result: 'L', flatPL: -1.00 },
  { date: '2026-04-26', player: 'Donovan Mitchell', market: 'PTS', side: 'UNDER', line: 22.5, proj: 12.8, edge: 1.00, band: 'Strong Lean', result: 'W', flatPL: 1.00 },
  { date: '2026-04-26', player: 'Jaylen Brown', market: 'PTS', side: 'UNDER', line: 17.5, proj: 1.00, edge: 1.03, band: 'Strong Lean', result: 'W', flatPL: 1.00 },
  { date: '2026-04-24', player: 'Derick White', market: 'PTS', side: 'UNDER', line: 10.5, proj: 7.4, edge: 0.32, band: 'Marginal', result: 'W', flatPL: 1.00 },
  { date: '2026-04-24', player: 'Nikola Vucevic', market: 'PTS', side: 'UNDER', line: 10.5, proj: 4.9, edge: 0.50, band: 'Lean', result: 'L', flatPL: -1.00 },
  { date: '2026-04-24', player: 'Jayson Tatum', market: 'PTS', side: 'UNDER', line: 21.5, proj: 5.3, edge: 1.76, band: 'Strong Lean', result: 'W', flatPL: 1.00 },
  { date: '2026-04-24', player: 'Dominick Barlow', market: 'PTS', side: 'UNDER', line: 14.5, proj: 7.3, edge: 0.87, band: 'Strong Lean', result: 'L', flatPL: -1.00 },
  { date: '2026-04-24', player: 'Luke Kennard', market: 'PTS', side: 'UNDER', line: 16.5, proj: 9.1, edge: 0.82, band: 'Strong Lean', result: 'W', flatPL: 1.00 },
  { date: '2026-04-23', player: 'LeBron James', market: 'REB', side: 'OVER', line: 7.5, proj: 9.2, edge: 0.61, band: 'Lean', result: 'W', flatPL: 1.00 },
  { date: '2026-04-23', player: 'Stephen Curry', market: 'PTS', side: 'UNDER', line: 26.5, proj: 20.1, edge: 0.95, band: 'Strong Lean', result: 'W', flatPL: 1.00 },
  { date: '2026-04-23', player: 'Giannis Antetokounmpo', market: 'PTS', side: 'OVER', line: 28.5, proj: 32.1, edge: 0.72, band: 'Strong Lean', result: 'L', flatPL: -1.00 },
  { date: '2026-04-22', player: 'Tyrese Maxey', market: 'PTS', side: 'UNDER', line: 24.5, proj: 18.3, edge: 1.12, band: 'Strong Lean', result: 'W', flatPL: 1.00 },
  { date: '2026-04-22', player: 'Alperen Sengun', market: 'PTS', side: 'OVER', line: 14.5, proj: 17.8, edge: 0.68, band: 'Lean', result: 'W', flatPL: 1.00 },
  { date: '2026-04-21', player: 'Scottie Barnes', market: 'PTS', side: 'UNDER', line: 23.5, proj: 17.1, edge: 0.71, band: 'Lean', result: 'L', flatPL: -1.00 },
]

export const POLICIES = [
  {
    name: 'balanced_v1', market: 'PTS', status: 'cold',
    weights: [{ signal: 'edge', w: 1.0 }, { signal: 'moveZ', w: 0.4 }, { signal: 'isSharp', w: 0.6 }, { signal: 'leanStrength', w: 0.8 }, { signal: 'alignWith', w: 0.5 }, { signal: 'rank', w: 0.0 }, { signal: 'pace', w: 0.0 }],
    thresholds: [{ setting: 'MinEdge', value: 0.030 }, { setting: 'MaxMoveZ', value: 2.50 }, { setting: 'MinSamples', value: 0 }],
  },
  {
    name: 'rank_forward_v1', market: 'PTS', status: 'cold',
    weights: [{ signal: 'edge', w: 1.0 }, { signal: 'moveZ', w: 0.4 }, { signal: 'isSharp', w: 0.6 }, { signal: 'leanStrength', w: 0.8 }, { signal: 'alignWith', w: 0.5 }, { signal: 'rank', w: 0.15 }, { signal: 'pace', w: 0.0 }],
    thresholds: [{ setting: 'MinEdge', value: 0.030 }, { setting: 'MaxMoveZ', value: 2.50 }, { setting: 'MinSamples', value: 0 }],
  },
  {
    name: 'aggressive_v1', market: 'PTS', status: 'cold',
    weights: [{ signal: 'edge', w: 1.2 }, { signal: 'moveZ', w: 0.6 }, { signal: 'isSharp', w: 0.8 }, { signal: 'leanStrength', w: 1.0 }, { signal: 'alignWith', w: 0.3 }, { signal: 'rank', w: 0.0 }, { signal: 'pace', w: 0.0 }],
    thresholds: [{ setting: 'MinEdge', value: 0.050 }, { setting: 'MaxMoveZ', value: 3.00 }, { setting: 'MinSamples', value: 0 }],
  },
  {
    name: 'balanced_v1', market: 'PRA', status: 'cold',
    weights: [{ signal: 'edge', w: 1.0 }, { signal: 'moveZ', w: 0.4 }, { signal: 'isSharp', w: 0.6 }, { signal: 'leanStrength', w: 0.8 }, { signal: 'alignWith', w: 0.5 }, { signal: 'rank', w: 0.0 }, { signal: 'pace', w: 0.0 }],
    thresholds: [{ setting: 'MinEdge', value: 0.030 }, { setting: 'MaxMoveZ', value: 2.50 }, { setting: 'MinSamples', value: 0 }],
  },
]

export const PL_CURVE = Array.from({ length: 35 }, (_, i) => ({
  day: `Apr ${i + 1}`,
  pl: parseFloat((-21 + i * 0.6 + Math.sin(i * 0.8) * 3).toFixed(2))
}))

export const BOX_SCORE_DATA = {
  id: 'por-sas-apr21',
  teams: {
    POR: {
      name: 'Trail Blazers',
      code: 'POR',
      score: 106,
      totals: {
        fg: '38/89', fgp: '42.7%',
        tfg: '13/38', tfgp: '34.2%',
        ft: '17/23', ftp: '73.9%',
        to: 15, reb: 43, ast: 20, blk: 11, dreb: 28, oreb: 15, pot: 24, pip: 40
      },
      players: [
        { name: 'S. Henderson', pos: 'G', min: 38, pts: 31, reb: 1, ast: 0, stl: 1, blk: 1, plusMinus: 9, fbp: 36.2, scp: 78.9, fg: '11/17', tfg: '5/9', ft: '4/6' },
        { name: 'R. Williams III', pos: 'C', min: 23, pts: 11, reb: 9, ast: 4, stl: 1, blk: 2, plusMinus: 13, fbp: 36.8, scp: 85.4, fg: '5/6', tfg: '1/2', ft: '0/1' },
        { name: 'J. Holiday', pos: 'G', min: 39, pts: 16, reb: 5, ast: 9, stl: 1, blk: 2, plusMinus: 12, fbp: 39.5, scp: 44.7, fg: '6/17', tfg: '2/2', ft: '2/2' },
        { name: 'D. Clingan', pos: 'C', min: 24, pts: 9, reb: 10, ast: 2, stl: 1, blk: 2, plusMinus: -14, fbp: 32, scp: 37.5, fg: '4/12', tfg: '1/6', ft: '0/0' },
        { name: 'T. Camara', pos: 'F', min: 35, pts: 10, reb: 9, ast: 1, stl: 3, blk: 1, plusMinus: 17, fbp: 34.3, scp: 63.5, fg: '3/7', tfg: '2/5', ft: '2/2' },
        { name: 'D. Avdija', pos: 'F', min: 30, pts: 14, reb: 4, ast: 3, stl: 0, blk: 1, plusMinus: -1, fbp: 22.3, scp: 46.1, fg: '5/13', tfg: '1/2', ft: '3/5' },
        { name: 'S. Sharpe', pos: 'G', min: 13, pts: 9, reb: 1, ast: 0, stl: 0, blk: 1, plusMinus: -1, fbp: 13.2, scp: 76.5, fg: '3/5', tfg: '1/3', ft: '2/2' },
        { name: 'J. Grant', pos: 'F', min: 20, pts: 5, reb: 1, ast: 0, stl: 1, blk: 0, plusMinus: 2, fbp: 9.2, scp: 26.8, fg: '1/8', tfg: '0/2', ft: '3/3' },
        { name: 'M. Thybulle', pos: 'G', min: 10, pts: 0, reb: 0, ast: 1, stl: 1, blk: 1, plusMinus: -22, fbp: 5.7, scp: 0, fg: '0/3', tfg: '0/2', ft: '0/0' }
      ]
    },
    SAS: {
      name: 'Spurs',
      code: 'SAS',
      score: 103,
      totals: {
        fg: '38/86', fgp: '44.2%',
        tfg: '7/24', tfgp: '29.2%',
        ft: '20/28', ftp: '71.4%',
        to: 16, reb: 45, ast: 19, blk: 5, dreb: 33, oreb: 12, pot: 22, pip: 38
      },
      players: [
        { name: 'S. Castle', pos: 'G', min: 38, pts: 18, reb: 7, ast: 5, stl: 2, blk: 1, plusMinus: -1, fbp: 39.9, scp: 40.5, fg: '7/20', tfg: '2/6', ft: '2/5' },
        { name: 'V. Wembanyama', pos: 'C', min: 34, pts: 16, reb: 12, ast: 2, stl: 3, blk: 1, plusMinus: -1, fbp: 44.4, scp: 11, fg: '3/7', tfg: '5/16', ft: '4/5' },
        { name: 'D. Vassell', pos: 'F', min: 28, pts: 10, reb: 9, ast: 2, stl: 2, blk: 0, plusMinus: 11, fbp: 28.8, scp: 79.1, fg: '4/5', tfg: '0/0', ft: '2/3' },
        { name: 'D. Fox', pos: 'G', min: 34, pts: 17, reb: 2, ast: 4, stl: 2, blk: 0, plusMinus: -14, fbp: 28.4, scp: 46.7, fg: '6/16', tfg: '1/3', ft: '4/5' },
        { name: 'J. Champagnie', pos: 'F', min: 27, pts: 9, reb: 4, ast: 0, stl: 1, blk: 2, plusMinus: -14, fbp: 21.8, scp: 92.2, fg: '3/4', tfg: '2/3', ft: '1/2' },
        { name: 'K. Johnson', pos: 'F', min: 18, pts: 7, reb: 4, ast: 1, stl: 2, blk: 0, plusMinus: 7, fbp: 18.3, scp: 50, fg: '3/7', tfg: '0/0', ft: '1/3' },
        { name: 'C. Bryant', pos: 'F', min: 12, pts: 7, reb: 2, ast: 2, stl: 0, blk: 0, plusMinus: -13, fbp: 11.4, scp: 70, fg: '3/5', tfg: '1/2', ft: '0/0' },
        { name: 'D. Harper', pos: 'G', min: 23, pts: 10, reb: 0, ast: 2, stl: 1, blk: 0, plusMinus: 4, fbp: 13, scp: 63.5, fg: '4/7', tfg: '0/0', ft: '2/2' },
        { name: 'V. Wembanyama', pos: 'C', min: 12, pts: 5, reb: 4, ast: 1, stl: 0, blk: 1, plusMinus: -7, fbp: 12.3, scp: 52.5, fg: '1/3', tfg: '0/1', ft: '3/4' }
      ]
    }
  }
}
