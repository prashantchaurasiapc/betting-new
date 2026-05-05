import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { BOX_SCORE_DATA, BIG_MOVERS, PLAYER_PROPS, GAMES } from '../lib/data'
import {
  ChevronLeft,
  Target,
  Zap,
  ChevronDown,
  ScanLine,
  Activity
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import SnapshotUploader from '../components/picks/SnapshotUploader'

export default function Lineup() {
  const navigate = useNavigate()
  const { activeGame, setGameFromSelector } = useGame()
  const { theme } = useTheme()
  const [showUploader, setShowUploader] = useState(false)
  const [showGameSelector, setShowGameSelector] = useState(false)

  // Dynamic Game Data
  const awayCode = activeGame?.awayTeam?.code || 'PHX'
  const homeCode = activeGame?.homeTeam?.code || 'OKC'
  const awayName = activeGame?.awayTeam?.name || 'Suns'
  const homeName = activeGame?.homeTeam?.name || 'Thunder'
  const awayScore = activeGame?.awayTeam?.score || 84
  const homeScore = activeGame?.homeTeam?.score || 119

  const [activeTab, setActiveTab] = useState('Feed')

  const data = BOX_SCORE_DATA
  const getTeamData = (code) => data.teams[code] || data.teams['POR']

  const handleGameSelect = (away, home, label) => {
    setGameFromSelector(
      { away: { code: away, name: away }, home: { code: home, name: home }, id: 'manual' },
      { label: label, id: 'm1' }
    )
    setShowGameSelector(false)
    setActiveTab('Feed')
  }

  // --- RENDERING HELPERS ---

  const renderFeed = () => (
    <div className="feed-grid" style={{ display: 'grid', gap: 10 }}>
      {BIG_MOVERS.slice(0, 15).map((item, i) => (
        <div key={i} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-alpha-05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={14} color="var(--blue)" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 900 }}>{item.player} · {item.market}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700 }}>{item.line} → {item.newLine} ({item.move})</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: item.move < 0 ? 'var(--error)' : 'var(--green)' }}>{item.type.toUpperCase()}</div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderMarkets = () => (
    <div className="markets-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
      {PLAYER_PROPS.slice(0, 15).map((prop, i) => (
        <div key={i} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 900 }}>{prop.player}</span>
            <span style={{ fontSize: 9, fontWeight: 800, color: 'var(--blue)' }}>{prop.side} {prop.market}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 12, fontWeight: 950 }}>{prop.line} / <span style={{ color: 'var(--blue)' }}>{prop.projection}</span></div>
            <div style={{ fontSize: 12, fontWeight: 950, color: 'var(--green)' }}>{prop.edge}%</div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderGame = () => {
    const gameData = GAMES[0]
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
          <h3 style={{ fontSize: 12, fontWeight: 950, marginBottom: 12 }}>WIN PROBABILITY</h3>
          <div style={{ display: 'flex', gap: 2, height: 6, background: 'var(--bg-alpha-05)', borderRadius: 3, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ flex: gameData.vegasHomeWin, background: 'var(--blue)' }} />
            <div style={{ flex: 100 - gameData.vegasHomeWin, background: 'var(--error)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 900 }}>
            <span>{gameData.homeCode} {gameData.vegasHomeWin}%</span>
            <span>{gameData.awayCode} {100 - gameData.vegasHomeWin}%</span>
          </div>
        </div>
      </div>
    )
  }

  const [expandedPlayer, setExpandedPlayer] = useState(null)

  return (
    <div className="lineup-standard-scroll" style={{ background: 'var(--bg-primary)', position: 'relative' }}>

      {/* 1. STICKY HEADER - HIGH Z-INDEX & NO TOP OFFSET GAP */}
      <div className="sticky-nav-header" style={{
        position: 'sticky',
        top: 0,
        zIndex: 99999,
        background: theme === 'dark' ? '#0D0F12' : '#FFFFFF', // Force solid hex
        borderBottom: '2px solid var(--border)',
        width: '100%',
        boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
        isolation: 'isolate'
      }}>
        {/* Selector Bar */}
        <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowGameSelector(!showGameSelector)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: 8, color: 'var(--text-primary)', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}
            >
              <Activity size={14} color="var(--blue)" />
              <span>{activeGame ? `${awayCode} @ ${homeCode}` : 'Select Matchup'}</span>
              <ChevronDown size={14} />
            </button>
            {showGameSelector && (
              <div style={{ position: 'absolute', top: '100%', left: 0, width: 220, background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, marginTop: 8, boxShadow: 'var(--shadow-lg)', zIndex: 10001 }}>
                {[
                  { a: 'POR', h: 'SAS', l: 'Live Match' },
                  { a: 'DET', h: 'ORL', l: 'Game 7' },
                  { a: 'NYK', h: 'ATL', l: 'Game 1' },
                  { a: 'PHI', h: 'BOS', l: 'Game 1' },
                  { a: 'OKC', h: 'PHX', l: 'Game 1' },
                ].map((g, i) => (
                  <div key={i} onClick={() => handleGameSelect(g.a, g.h, g.l)} style={{ padding: '10px 16px', cursor: 'pointer', borderBottom: '1px solid var(--border-soft)' }} className="hover-item">
                    <div style={{ fontSize: 12, fontWeight: 800 }}>{g.a} @ {g.h}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{g.l}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setShowUploader(true)} className="scan-btn-small" style={{ background: 'var(--blue)', color: '#000', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 10, fontWeight: 950, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <ScanLine size={14} /> SCAN
          </button>
        </div>

        {/* Score Header */}
        <div style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}><ChevronLeft size={18} /></button>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 950, margin: 0 }}>{awayCode} @ {homeCode}</h1>
              <span style={{ fontSize: 8, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Live Unit Feed</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 18, fontWeight: 950 }}>{awayScore} - {homeScore}</div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="tabs-bar-sticky-v5" style={{ display: 'flex', background: 'var(--bg-secondary)', overflowX: 'auto', borderTop: '1px solid var(--border-soft)' }}>
          {['Feed', 'Markets', 'Game', awayCode, homeCode].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 18px', background: 'none', border: 'none',
                color: activeTab === tab ? 'var(--blue)' : 'var(--text-muted)',
                fontSize: 10, fontWeight: 900, cursor: 'pointer',
                borderBottom: activeTab === tab ? '2px solid var(--blue)' : '2px solid transparent',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* 2. DATA CONTENT AREA */}
      <div className="scrolling-content-area" style={{ padding: '12px 16px 60px' }}>
        {activeTab === 'Feed' && renderFeed()}
        {activeTab === 'Markets' && renderMarkets()}
        {activeTab === 'Game' && renderGame()}
        {(activeTab === awayCode || activeTab === homeCode) && (
          <div className="players-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
            {getTeamData(activeTab)?.players?.map((p, i) => (
              <div 
                key={i} 
                onClick={() => setExpandedPlayer(expandedPlayer === p.name ? null : p.name)}
                style={{ 
                  background: 'var(--bg-secondary)', 
                  border: '1px solid var(--border)', 
                  borderRadius: 10, 
                  padding: 10,
                  cursor: 'pointer',
                  transition: '0.3s all ease'
                }}
              >
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`} style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--bg-elevated)' }} alt="" />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                       <div style={{ fontSize: 12, fontWeight: 800 }}>{p.name}</div>
                       <ChevronDown size={12} style={{ transform: expandedPlayer === p.name ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                    </div>
                    <div style={{ fontSize: 8, color: 'var(--text-muted)' }}>{p.pos} · {p.min} MIN</div>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 950, color: p.plusMinus > 0 ? 'var(--green)' : 'var(--error)' }}>{p.plusMinus > 0 ? '+' : ''}{p.plusMinus}</div>
                </div>
                
                <div style={{ display: 'flex', gap: 5 }}>
                  {[
                    { l: 'PTS', v: p.pts }, { l: 'REB', v: p.reb }, { l: 'AST', v: p.ast }
                  ].map(s => (
                    <div key={s.l} style={{ flex: 1, background: 'var(--bg-alpha-05)', padding: '3px', borderRadius: 5, textAlign: 'center' }}>
                      <div style={{ fontSize: 11, fontWeight: 950 }}>{s.v}</div>
                      <div style={{ fontSize: 7, fontWeight: 800, color: 'var(--text-muted)' }}>{s.l}</div>
                    </div>
                  ))}
                </div>

                {expandedPlayer === p.name && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-soft)', animation: 'fadeIn 0.3s' }}>
                    <div style={{ fontSize: 8, fontWeight: 900, color: 'var(--blue)', marginBottom: 8, textTransform: 'uppercase' }}>Season Analytics</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                       <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 10, fontWeight: 900 }}>{p.fg || '46%'}</div>
                          <div style={{ fontSize: 6, color: 'var(--text-muted)' }}>FG%</div>
                       </div>
                       <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 10, fontWeight: 900 }}>{p.tfg || '38%'}</div>
                          <div style={{ fontSize: 6, color: 'var(--text-muted)' }}>3P%</div>
                       </div>
                       <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 10, fontWeight: 900 }}>{p.ft || '84%'}</div>
                          <div style={{ fontSize: 6, color: 'var(--text-muted)' }}>FT%</div>
                       </div>
                    </div>
                    <div style={{ marginTop: 10, background: 'var(--bg-alpha-05)', padding: '6px', borderRadius: 4 }}>
                       <div style={{ fontSize: 7, color: 'var(--text-muted)', marginBottom: 2 }}>MATCHUP SCORE</div>
                       <div style={{ height: 3, background: 'var(--bg-elevated)', borderRadius: 2 }}>
                          <div style={{ width: '74%', height: '100%', background: 'var(--green)', borderRadius: 2 }} />
                       </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showUploader && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 20000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 500 }}>
            <SnapshotUploader onClose={() => setShowUploader(false)} onSuccess={() => setShowUploader(false)} />
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .hover-item:hover { background: var(--bg-alpha-05) !important; }
        .tabs-bar-sticky-v5::-webkit-scrollbar { display: none; }
        @media (max-width: 600px) {
          .scan-btn-small span { display: none; }
        }
      `}} />
    </div>
  )
}
