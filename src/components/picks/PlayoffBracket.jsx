import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Check, Upload, Trophy, Target, Zap, X, ChevronRight } from 'lucide-react';
import SnapshotUploader from './SnapshotUploader';
import { useGame } from '../../context/GameContext';
import { useTheme } from '../../context/ThemeContext';

const PLAYOFF_DATA = {
  'First Round': {
    Eastern: [
      {
        id: 'est-1',
        status: 'Game 7 May 3 3PM ET',
        home: { name: 'Magic', code: 'ORL', seed: 8, score: 3 },
        away: { name: 'Pistons', code: 'DET', seed: 1, score: 3 },
        games: [
          { label: 'Game 1', status: 'Final', date: 'Apr 19, 2026', awayScore: 112, homeScore: 101, winner: 'ORL', awayRec: '(1-0)', homeRec: '(0-1)' },
          { label: 'Game 2', status: 'Final', date: 'Apr 22, 2026', awayScore: 83, homeScore: 98, winner: 'DET', awayRec: '(1-1)', homeRec: '(1-1)' },
          { label: 'Game 3', status: 'Final', date: 'Apr 25, 2026', awayScore: 105, homeScore: 113, winner: 'ORL', awayRec: '(1-2)', homeRec: '(2-1)' },
          { label: 'Game 4', status: 'Final', date: 'Apr 27, 2026', awayScore: 88, homeScore: 94, winner: 'ORL', awayRec: '(1-3)', homeRec: '(3-1)' },
          { label: 'Game 5', status: 'Final', date: 'Apr 29, 2026', awayScore: 109, homeScore: 116, winner: 'DET', awayRec: '(3-2)', homeRec: '(2-3)' },
          { label: 'Game 6', status: 'Final', date: 'May 1, 2026', awayScore: 93, homeScore: 79, winner: 'DET', awayRec: '(3-3)', homeRec: '(3-3)' },
          { label: 'Game 7', status: '12:30 PM', date: 'May 3, 2026', awayScore: '-', homeScore: '-', awayRec: '(3-3)', homeRec: '(3-3)' },
        ]
      },
      {
        id: 'est-2',
        status: 'Game 7 May 3 7PM ET',
        home: { name: 'Raptors', code: 'TOR', seed: 5, score: 3 },
        away: { name: 'Cavaliers', code: 'CLE', seed: 4, score: 3 },
        games: [
          { label: 'Game 1', status: 'Final', date: 'Apr 19, 2026', awayScore: 104, homeScore: 112, winner: 'TOR', awayRec: '(0-1)', homeRec: '(1-0)' },
          { label: 'Game 2', status: 'Final', date: 'Apr 21, 2026', awayScore: 98, homeScore: 92, winner: 'CLE', awayRec: '(1-1)', homeRec: '(1-1)' },
          { label: 'Game 7', status: '7:00 PM', date: 'May 3, 2026', awayScore: '-', homeScore: '-', awayRec: '(3-3)', homeRec: '(3-3)' },
        ]
      },
      {
        id: 'est-3',
        status: 'Apr 18 - Apr 30',
        home: { name: 'Hawks', code: 'ATL', seed: 6, score: 2 },
        away: { name: 'Knicks', code: 'NYK', seed: 3, score: 4, isWinner: true },
        games: [
          { label: 'Game 1', status: 'Final', date: 'Apr 18, 2026', awayScore: 118, homeScore: 105, winner: 'NYK', awayRec: '(1-0)', homeRec: '(0-1)' },
          { label: 'Game 6', status: 'Final', date: 'Apr 30, 2026', awayScore: 102, homeScore: 98, winner: 'NYK', awayRec: '(4-2)', homeRec: '(2-4)' },
        ]
      },
      {
        id: 'est-4',
        status: 'Apr 19 - May 2',
        home: { name: '76ers', code: 'PHI', seed: 7, score: 4, isWinner: true },
        away: { name: 'Celtics', code: 'BOS', seed: 2, score: 3 },
        games: [
          { label: 'Game 1', status: 'Final', date: 'Apr 19, 2026', awayScore: 115, homeScore: 118, winner: 'PHI', awayRec: '(0-1)', homeRec: '(1-0)' },
          { label: 'Game 7', status: 'Final', date: 'May 2, 2026', awayScore: 101, homeScore: 105, winner: 'PHI', awayRec: '(3-4)', homeRec: '(4-3)' },
        ]
      }
    ],
    Western: [
      {
        id: 'wst-1',
        status: 'Apr 19 - Apr 27',
        home: { name: 'Suns', code: 'PHX', seed: 8, score: 0 },
        away: { name: 'Thunder', code: 'OKC', seed: 1, score: 4, isWinner: true },
        games: [
          { label: 'Game 1', status: 'Final', date: 'Apr 19, 2026', awayScore: 124, homeScore: 102, winner: 'OKC', awayRec: '(1-0)', homeRec: '(0-1)' },
          { label: 'Game 4', status: 'Final', date: 'Apr 27, 2026', awayScore: 118, homeScore: 101, winner: 'OKC', awayRec: '(4-0)', homeRec: '(0-4)' },
        ]
      },
      {
        id: 'wst-2',
        status: 'Apr 18 - May 1',
        home: { name: 'Rockets', code: 'HOU', seed: 5, score: 2 },
        away: { name: 'Lakers', code: 'LAL', seed: 4, score: 4, isWinner: true },
        games: [
          { label: 'Game 1', status: 'Final', date: 'Apr 18, 2026', awayScore: 108, homeScore: 105, winner: 'LAL', awayRec: '(1-0)', homeRec: '(0-1)' },
          { label: 'Game 6', status: 'Final', date: 'May 1, 2026', awayScore: 112, homeScore: 102, winner: 'LAL', awayRec: '(4-2)', homeRec: '(2-4)' },
        ]
      },
      {
        id: 'wst-3',
        status: 'Apr 18 - Apr 30',
        home: { name: 'Wolves', code: 'MIN', seed: 6, score: 4, isWinner: true },
        away: { name: 'Nuggets', code: 'DEN', seed: 3, score: 2 },
        games: [
          { label: 'Game 1', status: 'Final', date: 'Apr 18, 2026', awayScore: 110, homeScore: 114, winner: 'MIN', awayRec: '(0-1)', homeRec: '(1-0)' },
          { label: 'Game 6', status: 'Final', date: 'Apr 30, 2026', awayScore: 105, homeScore: 118, winner: 'MIN', awayRec: '(2-4)', homeRec: '(4-2)' },
        ]
      },
      {
        id: 'wst-4',
        status: 'Apr 19 - Apr 28',
        home: { name: 'Trail Blazers', code: 'POR', seed: 7, score: 1 },
        away: { name: 'Spurs', code: 'SAS', seed: 2, score: 4, isWinner: true },
        games: [
          { label: 'Game 1', status: 'Final', date: 'Apr 19, 2026', awayScore: 112, homeScore: 104, winner: 'SAS', awayRec: '(1-0)', homeRec: '(0-1)' },
          { label: 'Game 5', status: 'Final', date: 'Apr 28, 2026', awayScore: 108, homeScore: 98, winner: 'SAS', awayRec: '(4-1)', homeRec: '(1-4)' },
        ]
      }
    ]
  },
  'Conf Semis': {
    Eastern: [
      { id: 'es-1', status: 'Game 1 May 4 8PM ET', home: { name: '76ers', code: 'PHI', seed: 7, score: '' }, away: { name: 'Knicks', code: 'NYK', seed: 3, score: '' }, games: [] }
    ],
    Western: [
      { id: 'ws-1', status: 'Game 1 May 5 8PM ET', home: { name: 'Lakers', code: 'LAL', seed: 4, score: '' }, away: { name: 'Thunder', code: 'OKC', seed: 1, score: '' }, games: [] },
      { id: 'ws-2', status: 'Game 1 May 4 9PM ET', home: { name: 'Wolves', code: 'MIN', seed: 6, score: '' }, away: { name: 'Spurs', code: 'SAS', seed: 2, score: '' }, games: [] }
    ]
  },
  'Conf Finals': { Eastern: [], Western: [] },
  'Finals': { Eastern: [], Western: [] }
};

export default function PlayoffBracket() {
  const [activeRound, setActiveRound] = useState('First Round');
  const [expandedSeries, setExpandedSeries] = useState([]); // Collapse by default
  const [showUploader, setShowUploader] = useState(false);
  const [activeView, setActiveView] = useState('playoffs'); // 'playoffs' | 'standings'
  const [season, setSeason] = useState('2025-26');
  const [showSeasonMenu, setShowSeasonMenu] = useState(false);

  const navigate = useNavigate();
  const { activeGame, setGameFromSelector, clearActiveGame, gameStatuses } = useGame();
  const { theme } = useTheme();

  const currentRound = PLAYOFF_DATA[activeRound];

  const handleSeriesClick = (series) => {
    setExpandedSeries(prev => {
      const current = prev || [];
      return current.includes(series.id)
        ? current.filter(id => id !== series.id)
        : [...current, series.id];
    });
  };

  const getLatestGame = (games) => {
    if (!games || games.length === 0) return null;
    const completed = games.filter(g => g.status === 'Final');
    return completed.length > 0 ? completed[completed.length - 1] : null;
  };

  // Status logic based on centralized context
  const getGameStatusInfo = (series, game) => {
    const gameId = `${series.away.code}-${series.home.code}-${game.id || 'g1'}`;
    const status = gameStatuses[gameId] || { awayLoaded: false, homeLoaded: false };

    if (status.awayLoaded && status.homeLoaded) return { color: 'var(--green)', label: 'Complete', type: 'solid' };
    if (status.awayLoaded || status.homeLoaded) return { color: '#ffc107', label: 'Partial', type: 'outline' };
    return { color: 'var(--text-muted)', label: 'Empty', type: 'solid' };
  };

  const handleGameClick = (game, series) => {
    // Sync context so other pages (like Lineup) know which game we're looking at
    setGameFromSelector(
      { home: series.home, away: series.away, id: series.id },
      { label: game.label, id: game.id || 'g1' }
    );

    const gameId = `${series.away.code}-${series.home.code}-${game.id || 'g1'}`;
    navigate(`/game/${gameId}`);
  };

  const handleShortcutAction = (e, type, game, series) => {
    e.stopPropagation();
    setGameFromSelector({ home: series.home, away: series.away, id: series.id }, { label: game.label, id: game.id || 'g1' });
    navigate(type === 'lineup' ? '/lineup' : '/');
  };

  return (
    <div className="playoff-bracket-container" style={{
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      minHeight: '100%',
      padding: '0 0 80px',
      transition: 'all 0.3s ease'
    }}>

      {/* Top Header (Responsive) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        borderBottom: '1px solid var(--border)',
        flexWrap: 'wrap',
        gap: 12,
        position: 'relative'
      }}>
        <div
          onClick={() => setShowSeasonMenu(!showSeasonMenu)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: 'var(--blue)', fontSize: 13, fontWeight: 700,
            cursor: 'pointer', padding: '4px 8px', borderRadius: 4,
            background: showSeasonMenu ? 'var(--bg-alpha-05)' : 'transparent'
          }}
        >
          {season} Season <ChevronDown size={14} />

          {showSeasonMenu && (
            <div className="anim-fade" style={{
              position: 'absolute', top: '100%', left: 20, zIndex: 1000,
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              borderRadius: 8, padding: 8, minWidth: 140, boxShadow: 'var(--shadow-lg)',
              marginTop: 4
            }}>
              {['2025-26', '2024-25', '2023-24'].map(s => (
                <div
                  key={s}
                  onClick={(e) => { e.stopPropagation(); setSeason(s); setShowSeasonMenu(false); }}
                  style={{
                    padding: '8px 12px', fontSize: 12, borderRadius: 6,
                    color: season === s ? 'var(--blue)' : 'var(--text-primary)',
                    background: season === s ? 'var(--bg-alpha-05)' : 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  {s} Season
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span
            onClick={() => setActiveView('standings')}
            style={{
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              color: activeView === 'standings' ? 'var(--blue)' : 'var(--text-muted)',
              borderBottom: activeView === 'standings' ? '2px solid var(--blue)' : 'none',
              paddingBottom: 2
            }}
          >
            Standings
          </span>
          <span
            onClick={() => setActiveView('playoffs')}
            style={{
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              color: activeView === 'playoffs' ? 'var(--blue)' : 'var(--text-muted)',
              borderBottom: activeView === 'playoffs' ? '2px solid var(--blue)' : 'none',
              paddingBottom: 2
            }}
          >
            Playoffs
          </span>
        </div>

        <button
          onClick={() => setShowUploader(!showUploader)}
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '6px 10px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
            fontWeight: 700
          }}
        >
          <Upload size={14} />
          <span className="hide-mobile">{showUploader ? 'Close' : 'Import'}</span>
        </button>
      </div>

      {/* Conditional Rendering based on activeView */}
      {activeView === 'standings' ? (
        <div style={{ padding: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 20 }}>Season Standings</h2>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'var(--bg-alpha-02)' }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: 11, color: 'var(--text-muted)' }}>TEAM</th>
                  <th style={{ textAlign: 'center', padding: '12px 20px', fontSize: 11, color: 'var(--text-muted)' }}>W</th>
                  <th style={{ textAlign: 'center', padding: '12px 20px', fontSize: 11, color: 'var(--text-muted)' }}>L</th>
                  <th style={{ textAlign: 'center', padding: '12px 20px', fontSize: 11, color: 'var(--text-muted)' }}>GB</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Oklahoma City Thunder', w: 57, l: 25, gb: '-' },
                  { name: 'Denver Nuggets', w: 57, l: 25, gb: '-' },
                  { name: 'Minnesota Timberwolves', w: 56, l: 26, gb: '1.0' },
                  { name: 'LA Clippers', w: 51, l: 31, gb: '6.0' },
                  { name: 'Dallas Mavericks', w: 50, l: 32, gb: '7.0' },
                ].map((t, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                    <td style={{ padding: '12px 20px', fontSize: 13, fontWeight: 700 }}>{i + 1}. {t.name}</td>
                    <td style={{ textAlign: 'center', padding: '12px 20px', fontSize: 13, fontWeight: 800 }}>{t.w}</td>
                    <td style={{ textAlign: 'center', padding: '12px 20px', fontSize: 13, fontWeight: 800 }}>{t.l}</td>
                    <td style={{ textAlign: 'center', padding: '12px 20px', fontSize: 13, color: 'var(--text-muted)' }}>{t.gb}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>
          {/* Round Tabs (Responsive & Scrollable) */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--border)',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            background: 'var(--bg-secondary)'
          }} className="no-scrollbar">
            {Object.keys(PLAYOFF_DATA).map(round => (
              <button
                key={round}
                onClick={() => {
                  console.log('Switching to round:', round);
                  setActiveRound(round);
                  setExpandedSeries([]);
                }}
                className="round-tab"
                style={{
                  flex: 1,
                  minWidth: 120,
                  padding: '16px 0',
                  background: 'none',
                  border: 'none',
                  color: activeRound === round ? 'var(--blue)' : 'var(--text-muted)',
                  fontSize: 12,
                  fontWeight: 800,
                  cursor: 'pointer',
                  borderBottom: activeRound === round ? '3px solid var(--blue)' : '3px solid transparent',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  zIndex: 10
                }}
              >
                {round}
              </button>
            ))}
          </div>

          {/* Uploader Modal Overlay */}
          {showUploader && (
            <div style={{ padding: '20px', maxWidth: 800, margin: '0 auto' }}>
              <SnapshotUploader onClose={() => setShowUploader(false)} onSuccess={() => setShowUploader(false)} />
            </div>
          )}

          {/* Conference Sections (Responsive Grid) */}
          <div className="bracket-content-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24,
            padding: '20px'
          }}>
            {['Eastern', 'Western'].map(conf => (
              <div key={conf}>
                <h3 style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>
                  {conf} Conference
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {currentRound[conf]?.length > 0 ? currentRound[conf].map(series => {
                    const isExpanded = expandedSeries?.includes(series.id) || false;

                    return (
                      <div key={series.id} style={{ transition: 'all 0.3s ease' }}>
                        {/* Series Card */}
                        <div
                          onClick={() => handleSeriesClick(series)}
                          className="card"
                          style={{
                            border: '1px solid var(--border)',
                            borderRadius: 12,
                            overflow: 'hidden',
                            cursor: 'pointer',
                            background: 'var(--bg-secondary)',
                            transition: 'all 0.2s ease',
                            boxShadow: isExpanded ? 'var(--shadow-md)' : 'none'
                          }}
                        >
                          <div style={{
                            display: 'flex', justifyContent: 'space-between', padding: '10px 16px',
                            borderBottom: '1px solid var(--border-soft)',
                            background: 'var(--bg-alpha-02)'
                          }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)' }}>{series.status}</span>
                            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Series</span>
                          </div>

                          {[series.away, series.home].map((team, idx) => (
                            <div key={idx} style={{ 
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              padding: '12px 16px',
                              background: team.isWinner ? 'rgba(0, 207, 255, 0.05)' : 'transparent',
                              borderBottom: idx === 0 ? '1px solid var(--border-soft)' : 'none',
                              position: 'relative'
                            }}>
                              {team.isWinner && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'var(--blue)', boxShadow: '0 0 15px var(--blue)' }} />}
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{
                                  width: 28, height: 28, borderRadius: 8,
                                  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  overflow: 'hidden'
                                }}>
                                  <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${team.code}`} style={{ width: '80%', height: '80%' }} alt="" />
                                </div>
                                <span style={{ fontSize: 15, fontWeight: 900, color: team.isWinner ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{team.name}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontSize: 24, fontWeight: 950, color: team.score >= 4 ? 'var(--yellow)' : 'var(--text-primary)' }}>{team.score}</span>
                                {team.isWinner && <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid var(--yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={10} color="var(--yellow)" strokeWidth={4} /></div>}
                              </div>
                            </div>
                          ))}

                          {/* Latest Game Result (Show when collapsed) */}
                          {!isExpanded && (
                            <div style={{
                              padding: '8px 16px',
                              background: 'var(--bg-alpha-05)',
                              borderTop: '1px solid var(--border-soft)',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}>
                              {getLatestGame(series.games) ? (
                                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)' }}>
                                  Latest: <span style={{ color: 'var(--text-secondary)' }}>{series.away.code} {getLatestGame(series.games).awayScore} – {series.home.code} {getLatestGame(series.games).homeScore}</span>
                                </div>
                              ) : (
                                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)' }}>No games played</div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Expanded Games List (Responsive Layout) */}
                        {isExpanded && series.games?.length > 0 && (
                          <div className="anim-slide-down" style={{
                            padding: '8px 0',
                            borderBottom: '1px solid var(--border)',
                            background: 'var(--bg-alpha-02)',
                            marginTop: -4,
                            borderRadius: '0 0 12px 12px'
                          }}>
                            {series.games.map((game, gIdx) => {
                              return (
                                <div
                                  key={gIdx}
                                  onClick={(e) => { e.stopPropagation(); handleGameClick(game, series); }}
                                  className="game-row"
                                  style={{
                                    display: 'grid',
                                    gridTemplateColumns: '80px 1fr 60px',
                                    alignItems: 'center',
                                    padding: '12px 16px',
                                    cursor: 'pointer',
                                    borderBottom: '1px solid var(--border-soft)',
                                    transition: 'all 0.2s ease',
                                  }}
                                >
                                  {/* Left: Game info */}
                                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)' }}>{game.label}</span>
                                    <span style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 600 }}>{game.date.split(',')[0]}</span>
                                  </div>

                                  {/* Center: Scores */}
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 15 }}>
                                    <span style={{ fontSize: 18, fontWeight: 950, color: game.winner === series.away.code ? 'var(--text-primary)' : 'var(--text-muted)', width: 40, textAlign: 'right' }}>{game.awayScore}</span>
                                    <span style={{ fontSize: 8, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>FINAL</span>
                                    <span style={{ fontSize: 18, fontWeight: 950, color: game.winner === series.home.code ? 'var(--text-primary)' : 'var(--text-muted)', width: 40, textAlign: 'left' }}>{game.homeScore}</span>
                                  </div>

                                  {/* Right: Record */}
                                  <div style={{ textAlign: 'right', fontSize: 10, fontWeight: 800, color: 'var(--text-muted)' }}>
                                    {game.awayRec?.replace('(', '').replace(')', '')}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }) : (
                    <div style={{
                      border: '1px solid var(--border)', borderRadius: 12, padding: '32px 24px',
                      color: 'var(--text-muted)', fontSize: 12, textAlign: 'center',
                      background: 'var(--bg-alpha-02)', borderStyle: 'dashed',
                      display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center'
                    }}>
                      <Trophy size={20} opacity={0.3} />
                      <span>MATCHUPS TBD</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Floating Context (Mobile Optimized) */}
      {activeGame && (
        <div className="active-context-pill anim-fade" style={{
          position: 'fixed', bottom: 30, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--bg-elevated)', border: '1px solid var(--blue)',
          borderRadius: 40, padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16,
          boxShadow: '0 10px 40px rgba(0,0,0,0.6)', zIndex: 10000,
          width: 'max-content', maxWidth: '94vw'
        }}>
          <div className="live-dot" style={{ width: 10, height: 10 }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 10, fontWeight: 900, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Active Context</span>
            <span style={{ fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap' }}>
              {activeGame.contextFilters.seriesCode} · {activeGame.gameLabel}
            </span>
          </div>
          <button
            onClick={clearActiveGame}
            style={{
              background: 'var(--bg-alpha-10)', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', display: 'flex', padding: 6, borderRadius: '50%'
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .round-tab:hover {
          color: var(--blue) !important;
          background: var(--bg-alpha-02);
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-slide-down { animation: slideDown 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards; }

        .game-row {
          transition: background 0.2s;
          border-radius: 8px;
        }
        .game-row:hover {
          background: var(--bg-alpha-05);
          transform: translateX(4px);
        }

        .action-mini-btn {
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .action-mini-btn:hover {
          transform: scale(1.15) translateY(-2px);
          filter: brightness(1.1);
        }
        .action-mini-btn:active {
          transform: scale(0.95);
        }

        @media (max-width: 768px) {
          .playoff-bracket-container {
            padding-bottom: 120px;
          }
          .bracket-content-grid { 
            grid-template-columns: 1fr !important; 
            padding: 12px !important;
            gap: 16px !important;
          }
          .game-row {
            grid-template-columns: 1fr 90px 1fr !important;
            padding: 10px 8px !important;
          }
        }

        @media (max-width: 480px) {
          .game-row {
            grid-template-columns: 1fr 80px 1fr !important;
          }
          .series-card {
            padding: 10px !important;
          }
        }
      `}} />
    </div>
  );
}
