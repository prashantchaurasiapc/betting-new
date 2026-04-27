import React, { useState } from 'react'
import { GAMES, PLAYER_PROPS } from '../lib/data.js'
import { ChevronDown, Star, LayoutGrid, List } from 'lucide-react'

function SummaryCard({ label, value, active }) {
  return (
    <div className="card" style={{ 
      padding: '16px 20px', 
      flex: 1, 
      minWidth: 140,
      border: active ? '1px solid var(--blue)' : '1px solid var(--border)',
      background: active ? 'var(--blue-dim)' : 'var(--bg-card)',
      boxShadow: active ? 'var(--blue-glow)' : 'none'
    }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>{label}</p>
      <p style={{ fontSize: 24, fontWeight: 900, color: active ? 'var(--blue)' : 'var(--text-primary)' }}>{value}</p>
    </div>
  )
}

function CircularProgress({ value, size = 48, strokeWidth = 4, color = 'var(--blue)' }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifySelf: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <span style={{ 
        position: 'absolute', 
        width: '100%', 
        textAlign: 'center', 
        fontSize: size * 0.25, 
        fontWeight: 800,
        color: 'var(--text-primary)'
      }}>
        {value}%
      </span>
    </div>
  )
}

function HeroCard() {
  return (
    <div className="card anim-slide" style={{ 
      background: 'linear-gradient(135deg, #1a2436, #0d1117)',
      padding: '24px',
      marginTop: '20px',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid var(--border-bright)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span className="badge" style={{ background: 'var(--blue)', color: '#000', fontSize: 9 }}>HIGHEST CONFIDENCE</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>DEN @ MIN</span>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4 }}>Jamal Murray</h2>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)' }}>PTS UNDER 34.5</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <CircularProgress value={83} size={80} strokeWidth={6} />
          <div className="badge" style={{ 
            width: 32, 
            height: 32, 
            borderRadius: 6, 
            background: 'rgba(255,255,255,0.1)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 900
          }}>A</div>
        </div>
      </div>
    </div>
  )
}

function GameSection({ game }) {
  const [isOpen, setIsOpen] = useState(true)
  
  return (
    <div style={{ marginTop: 24 }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          background: 'var(--bg-secondary)', 
          padding: '12px 20px', 
          borderRadius: '10px 10px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          border: '1px solid var(--border)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800 }}>{game.awayCode} @ {game.homeCode}</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>1:00 PM EDT</span>
          <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
        </div>
      </div>
      
      {isOpen && (
        <div style={{ 
          background: 'var(--bg-card)', 
          border: '1px solid var(--border)',
          borderTop: 'none',
          padding: '12px 20px',
          display: 'flex',
          gap: 24,
          fontSize: 11,
          color: 'var(--text-muted)'
        }}>
          <span>Avg 67%</span>
          <span>O/U — (—)</span>
          <span>Pace — · —</span>
          <span>50 picks</span>
        </div>
      )}
      
      {isOpen && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 10px 10px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ 
              padding: '16px 20px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              borderBottom: i === 3 ? 'none' : '1px solid var(--border-soft)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <CircularProgress value={70 + i * 4} size={40} strokeWidth={3} color="var(--blue)" />
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700 }}>Player Name {i}</p>
                  <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} fill={s <= 4 ? "var(--gold)" : "none"} stroke="var(--gold)" />)}
                  </div>
                </div>
              </div>
              <div className="badge" style={{ background: 'var(--green-dim)', color: 'var(--green)', border: '1px solid rgba(0,255,136,0.2)' }}>A</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Engine() {
  const [view, setView] = useState('By game')

  return (
    <div className="anim-fade" style={{ maxWidth: 1000, margin: '0 auto' }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PROBABILITY ENGINE</p>
      <h1 style={{ fontSize: 32, fontWeight: 900, marginTop: 4 }}>Snapshot</h1>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>Sat, Apr 25, 2026</p>

      {/* Summary Stats */}
      <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
        <SummaryCard label="GAMES" value="5" />
        <SummaryCard label="PLAYERS" value="200" />
        <SummaryCard label="AVG CONFIDENCE" value="66%" active={true} />
        <SummaryCard label="HIGH CONF (≥80%)" value="48" />
      </div>

      <HeroCard />

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32 }}>
        <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: 20, padding: 4 }}>
          {['By game', 'Global rank'].map(v => (
            <button 
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: '6px 16px',
                borderRadius: 16,
                border: 'none',
                background: view === v ? 'var(--bg-primary)' : 'transparent',
                color: view === v ? 'var(--text-primary)' : 'var(--text-muted)',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                transition: '0.2s'
              }}
            >
              {v}
            </button>
          ))}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Market</span>
          <select className="input-field" style={{ minWidth: 100 }}>
            <option>ALL</option>
            <option>PTS</option>
            <option>REB</option>
            <option>AST</option>
          </select>
        </div>
      </div>

      {/* Game Lists */}
      <div className="anim-slide">
        {GAMES.map(game => (
          <GameSection key={game.id} game={game} />
        ))}
      </div>
    </div>
  )
}
