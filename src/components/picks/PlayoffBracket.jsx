import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Zap, Target, Loader2, Trophy, ArrowRight } from 'lucide-react';

const PLAYOFF_DATA = [
  {
    id: 'west-1',
    conference: 'West',
    round: 'First Round',
    home: { name: 'OKC Thunder', code: 'OKC', seed: 1, score: 3 },
    away: { name: 'PHX Suns', code: 'PHX', seed: 8, score: 1 },
    status: 'Game 5 Tonight',
    games: [
      { id: 'g1', label: 'Game 1', status: 'Final', homeScore: 118, awayScore: 104, winner: 'OKC' },
      { id: 'g2', label: 'Game 2', status: 'Final', homeScore: 101, awayScore: 112, winner: 'PHX' },
      { id: 'g3', label: 'Game 3', status: 'Final', homeScore: 126, awayScore: 109, winner: 'OKC' },
      { id: 'g4', label: 'Game 4', status: 'Final', homeScore: 105, awayScore: 98, winner: 'OKC' },
      { id: 'g5', label: 'Game 5', status: 'Upcoming', time: '7:30 PM ET', live: true },
      { id: 'g6', label: 'Game 6', status: 'Scheduled', time: 'May 4' },
      { id: 'g7', label: 'Game 7', status: 'Scheduled', time: 'May 6' },
    ]
  },
  {
    id: 'west-2',
    conference: 'West',
    round: 'First Round',
    home: { name: 'LAC Clippers', code: 'LAC', seed: 4, score: 2 },
    away: { name: 'DAL Mavericks', code: 'DAL', seed: 5, score: 2 },
    status: 'Series Tied 2-2',
    games: [
      { id: 'g5', label: 'Game 5', status: 'Upcoming', time: '9:00 PM ET', live: true },
    ]
  },
  {
    id: 'east-1',
    conference: 'East',
    round: 'First Round',
    home: { name: 'BOS Celtics', code: 'BOS', seed: 1, score: 3 },
    away: { name: 'MIA Heat', code: 'MIA', seed: 8, score: 1 },
    status: 'BOS Leads 3-1',
    games: [
      { id: 'g5', label: 'Game 5', status: 'Upcoming', time: 'Tomorrow' },
    ]
  },
  {
    id: 'east-2',
    conference: 'East',
    round: 'First Round',
    home: { name: 'NYK Knicks', code: 'NYK', seed: 2, score: 3 },
    away: { name: 'PHI 76ers', code: 'PHI', seed: 7, score: 1 },
    status: 'NYK Leads 3-1',
    games: [
      { id: 'g5', label: 'Game 5', status: 'Upcoming', time: 'Tonight 7:00 PM', live: true },
    ]
  }
];

export default function PlayoffBracket() {
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isRouting, setIsRouting] = useState(null); // 'lineup' or 'slate'
  const navigate = useNavigate();

  const handleRoute = (type, game) => {
    setIsRouting(type);
    // Store last selected series/game in local storage for persistence as requested
    localStorage.setItem('genie_last_series', JSON.stringify(selectedSeries));
    
    setTimeout(() => {
      const state = { series: selectedSeries, game: selectedGame };
      if (type === 'lineup') {
        navigate('/lineup', { state });
      } else {
        navigate('/', { state });
      }
      setIsRouting(null);
    }, 800);
  };

  return (
    <div className="anim-fade">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ 
          width: 40, height: 40, borderRadius: 12, 
          background: 'linear-gradient(135deg, var(--gold), var(--gold-dark))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(212,175,55,0.3)'
        }}>
          <Trophy size={20} color="#000" />
        </div>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)' }}>Postseason Navigator</h2>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Select a series to view game details and analytical flows.</p>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 24, alignItems: 'start' }}>
        {/* Series List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PLAYOFF_DATA.map(series => {
            const isActive = selectedSeries?.id === series.id;
            return (
              <div 
                key={series.id}
                className={`glass-card ${isActive ? 'active-series' : ''}`}
                style={{ 
                  padding: '16px', cursor: 'pointer', transition: 'all 0.2s ease',
                  borderLeft: isActive ? '4px solid var(--gold)' : '4px solid transparent',
                  background: isActive ? 'var(--bg-elevated)' : 'var(--glass)'
                }}
                onClick={() => {
                  setSelectedSeries(series);
                  setSelectedGame(null);
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {series.conference} · {series.round}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold)' }}>{series.status}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="mono" style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>
                        {series.away.code}
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{series.away.name}</span>
                      <span className="mono" style={{ marginLeft: 'auto', fontSize: 16, fontWeight: 900 }}>{series.away.score}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="mono" style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>
                        {series.home.code}
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 700 }}>{series.home.name}</span>
                      <span className="mono" style={{ marginLeft: 'auto', fontSize: 16, fontWeight: 900 }}>{series.home.score}</span>
                    </div>
                  </div>
                  <ChevronRight size={20} style={{ color: isActive ? 'var(--gold)' : 'var(--text-muted)', marginLeft: 16 }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Game Selection & Actions */}
        <div className="card" style={{ padding: 24, minHeight: 400, position: 'relative' }}>
          {selectedSeries ? (
            <div className="anim-fade">
              <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>{selectedSeries.away.code} vs {selectedSeries.home.code}</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Select a game to initialize workflow</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10, marginBottom: 32 }}>
                {selectedSeries.games.map(game => {
                  const isSelected = selectedGame?.id === game.id;
                  const isUpcoming = game.status === 'Upcoming';
                  const isFinal = game.status === 'Final';
                  
                  return (
                    <button
                      key={game.id}
                      onClick={() => setSelectedGame(game)}
                      className={`chip-btn ${isSelected ? 'active' : ''}`}
                      style={{ 
                        padding: '12px', height: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                        opacity: isFinal ? 0.6 : 1,
                        borderColor: isSelected ? 'var(--gold)' : isUpcoming && game.live ? 'var(--blue)' : 'var(--border)',
                        background: isSelected ? 'var(--gold-dim)' : 'var(--glass)'
                      }}
                    >
                      <span style={{ fontSize: 11, fontWeight: 800, color: isSelected ? 'var(--gold)' : 'var(--text-primary)' }}>{game.label}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                        {isFinal ? `${game.awayScore}-${game.homeScore}` : game.time}
                      </span>
                      {game.live && <span className="live-dot" style={{ width: 5, height: 5, marginTop: 4 }} />}
                    </button>
                  );
                })}
              </div>

              {selectedGame && (
                <div className="anim-slide" style={{ padding: 20, background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <Zap size={14} color="var(--gold)" />
                    <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--gold)', textTransform: 'uppercase' }}>Quick Actions: {selectedGame.label}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <button 
                      className="btn-primary" 
                      style={{ width: '100%', justifyContent: 'space-between', padding: '14px 18px', background: 'linear-gradient(135deg, var(--blue), var(--blue-hover))', color: '#000' }}
                      onClick={() => handleRoute('lineup', selectedGame)}
                      disabled={isRouting}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Target size={18} />
                        Scan Lineups
                      </span>
                      {isRouting === 'lineup' ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                    </button>

                    <button 
                      className="btn-primary" 
                      style={{ width: '100%', justifyContent: 'space-between', padding: '14px 18px', background: 'linear-gradient(135deg, var(--green), var(--green-hover))', color: '#000' }}
                      onClick={() => handleRoute('slate', selectedGame)}
                      disabled={isRouting}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Zap size={18} />
                        View Predictions
                      </span>
                      {isRouting === 'slate' ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                    </button>
                  </div>

                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 16, textAlign: 'center', fontStyle: 'italic' }}>
                    Routing will apply {selectedSeries.away.code}@{selectedSeries.home.code} context filters.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.3, textAlign: 'center' }}>
              <Trophy size={64} style={{ marginBottom: 20 }} strokeWidth={1} />
              <p style={{ fontSize: 14, fontWeight: 600 }}>Select a playoff series<br/>to begin navigation</p>
            </div>
          )}

          {isRouting && (
            <div style={{ 
              position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 14, zIndex: 10
            }}>
              <div style={{ textAlign: 'center' }}>
                <Loader2 size={40} className="animate-spin" color="var(--blue)" style={{ marginBottom: 12 }} />
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue)', letterSpacing: '2px' }}>INITIALIZING FLOW...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .active-series {
          box-shadow: 0 0 25px rgba(212,175,55,0.1);
        }
        .chip-btn.active {
          box-shadow: 0 0 15px rgba(212,175,55,0.2);
        }
      `}} />
    </div>
  );
}
