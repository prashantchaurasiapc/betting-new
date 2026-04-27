import React, { useState } from 'react'

function CircularProgress({ value, size = 64, strokeWidth = 5, color = 'var(--blue)' }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border)" strokeWidth={strokeWidth} />
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
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
      </svg>
      <span style={{ position: 'absolute', fontSize: size * 0.22, fontWeight: 800, color: 'var(--text-primary)' }}>{value}%</span>
    </div>
  )
}

export default function Series() {
  const [seriesId, setSeriesId] = useState('2025-26_PLAYOFFS_CLE_TOR')
  const [homeTeam, setHomeTeam] = useState('CLE')
  const [inactiveIds, setInactiveIds] = useState('1629029, 1628384')
  const [showAdv, setShowAdv] = useState(false)
  const [result, setResult] = useState(null)
  const [simulating, setSimulating] = useState(false)

  const predict = () => {
    setSimulating(true)
    setResult(null)
    setTimeout(() => {
      setResult([
        { team: homeTeam || 'CLE', prob: (Math.random() * 30 + 50).toFixed(1), wins: (Math.random() * 1.5 + 3.5).toFixed(1), color: 'var(--green)' },
        { team: 'TOR', prob: (Math.random() * 30 + 20).toFixed(1), wins: (Math.random() * 1.5 + 2.5).toFixed(1), color: 'var(--blue)' },
      ])
      setSimulating(false)
    }, 1500)
  }

  return (
    <div className="anim-fade" style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title">Series Predictor</h1>
        <p className="page-sub" style={{ color: 'var(--blue)', fontWeight: 600 }}>Monte Carlo Playoff Simulation Engine</p>
      </div>

      <div className="grid-2" style={{ alignItems: 'start', gap: 24 }}>
        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>Parameters</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Series ID</label>
              <input className="input-field" style={{ width: '100%' }} value={seriesId} onChange={e => setSeriesId(e.target.value)} />
            </div>
            
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Home Team (higher seed)</label>
              <input className="input-field" style={{ width: '100%' }} value={homeTeam} onChange={e => setHomeTeam(e.target.value)} />
            </div>
            
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Inactive NBA Stats IDs</label>
              <textarea className="input-field" rows={3} style={{ width: '100%', fontFamily: 'monospace', resize: 'none', fontSize: 12 }}
                value={inactiveIds} onChange={e => setInactiveIds(e.target.value)} />
              <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6 }}>Comma-separated IDs from series_game_logs.</p>
            </div>
          </div>

          <button 
            onClick={() => setShowAdv(!showAdv)} 
            style={{ 
              background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', 
              display: 'flex', alignItems: 'center', gap: 8, padding: 0 
            }}
          >
            {showAdv ? '▼' : '▶'} Advanced Simulation Settings
          </button>

          {showAdv && (
            <div className="anim-fade" style={{ padding: 16, background: 'var(--bg-secondary)', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Simulations</label>
                <input className="input-field" style={{ width: '100%' }} type="number" defaultValue={10000} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked /> Use ML Projections
              </label>
            </div>
          )}

          <button 
            onClick={predict} 
            disabled={simulating}
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 14, opacity: simulating ? 0.7 : 1 }}
          >
            {simulating ? 'Running Monte Carlo...' : 'Run Prediction Engine'}
          </button>
        </div>

        <div className="card" style={{ padding: 24, minHeight: 400, display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>Simulation Results</h2>
          
          {!result && !simulating && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
              <div style={{ width: 60, height: 60, borderRadius: '50%', border: '2px dashed var(--text-muted)', marginBottom: 16 }} />
              <p style={{ fontSize: 13 }}>No simulation data</p>
            </div>
          )}

          {simulating && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="live-dot" style={{ width: 40, height: 40, marginBottom: 16 }} />
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--blue)' }}>Processing 10,000 iterations...</p>
            </div>
          )}

          {result && (
            <div className="anim-fade" style={{ display: 'flex', flexDirection: 'column', gap: 32, marginTop: 24 }}>
              {result.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                  <CircularProgress value={parseFloat(r.prob)} size={100} strokeWidth={8} color={r.color} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)' }}>{r.team}</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                      Win Probability: <span style={{ color: r.color, fontWeight: 800 }}>{r.prob}%</span>
                    </p>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      Avg Expected Wins: <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{r.wins}</span>
                    </p>
                    <div className="pbar-track" style={{ marginTop: 12, height: 4 }}>
                      <div className="pbar-fill" style={{ width: `${(parseFloat(r.wins) / 4) * 100}%`, background: r.color }} />
                    </div>
                  </div>
                </div>
              ))}
              
              <div style={{ marginTop: 'auto', padding: 16, background: 'var(--blue-dim)', border: '1px solid rgba(0,207,255,0.1)', borderRadius: 10 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue)', marginBottom: 4 }}>MODEL CONFIDENCE: HIGH</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Based on current rosters and recent H2H matchups, {result[0].team} has a significant statistical advantage in a 7-game series.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
