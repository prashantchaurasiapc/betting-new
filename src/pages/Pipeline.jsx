import React, { useState } from 'react'
import { Play, RotateCcw, ShieldCheck, Database, Zap, Cpu } from 'lucide-react'

const SECTIONS = [
  {
    title: 'Re-seed Prop Lines',
    icon: <Database size={16} />,
    color: 'var(--blue)',
    desc: 'Fetches the latest odds from The Odds API and seeds any missing games + prop lines into the database.',
    action: 'Run Seed Ingest',
  },
  {
    title: 'Ingest box scores',
    icon: <Database size={16} />,
    color: 'var(--green)',
    desc: 'Fetches completed-game player box stats from BDL for the given calendar date and upserts fact_player_game_log.',
    action: 'Injest Raw Data',
  },
  {
    title: 'Build team profiles',
    icon: <Cpu size={16} />,
    color: 'var(--gold)',
    desc: 'Computes pace, ratings, and style fields into dim_team_profile_daily for the as-of date.',
    action: 'Process Profiles',
  },
  {
    title: 'Generate game context',
    icon: <Cpu size={16} />,
    color: 'var(--blue)',
    desc: "Builds per-game win probability, projected pace/scores, and blowout risk for Today's Slate.",
    action: 'Sync Context',
  },
  {
    title: 'Rebuild Projections',
    icon: <Zap size={16} />,
    color: 'var(--green)',
    desc: 'Re-scores all 7 prop markets (PTS · REB · AST · 3PM · PRA · BLK · STL) using the active ML model.',
    action: 'Trigger Model',
  },
]

const INIT_FLAGS = [
  { key: 'ENABLE_AVAILABILITY_FACTOR', enabled: true, desc: 'Injury risk (questionable/out) weights player projections', day: 'Day 1' },
  { key: 'ENABLE_DEFENSE_GRADE_CONTEXT', enabled: false, desc: 'Perimeter & rim defensive grades from team profiles', day: 'Day 2' },
  { key: 'ENABLE_STYLE_SIGNATURE_CONTEXT', enabled: false, desc: 'Pace / style matchup context from team style signatures', day: 'Day 3' },
]

function Toggle({ on, onToggle }) {
  return (
    <button onClick={onToggle} className={`toggle-track ${on ? 'toggle-on' : 'toggle-off'}`}>
      <div className={`toggle-thumb ${on ? 'toggle-thumb-on' : 'toggle-thumb-off'}`} />
    </button>
  )
}

export default function Pipeline() {
  const [flags, setFlags] = useState(INIT_FLAGS)
  const [running, setRunning] = useState(null)
  
  const toggleFlag = i => setFlags(f => f.map((ff, ii) => ii === i ? { ...ff, enabled: !ff.enabled } : ff))
  
  const triggerAction = (idx) => {
    setRunning(idx)
    setTimeout(() => setRunning(null), 2000)
  }

  return (
    <div className="anim-fade" style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="page-title">Pipeline Control</h1>
          <p className="page-sub">System-level data orchestration and ML model execution center.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-ghost" style={{ fontSize: 11, padding: '8px 16px' }}><RotateCcw size={12}/> Reset Workers</button>
          <button className="btn-primary" style={{ fontSize: 11, padding: '8px 16px' }}>Master Sync</button>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 24, alignItems: 'start' }}>
        {/* Left Column: Tasks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h2 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Automated Tasks</h2>
          {SECTIONS.map((s, i) => (
            <div key={i} className="card" style={{ padding: 20, borderLeft: `4px solid ${s.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ color: s.color }}>{s.icon}</span>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{s.title}</h3>
                {running === i && <span className="live-dot" style={{ marginLeft: 'auto' }} />}
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>{s.desc}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input type="date" className="input-field" style={{ fontSize: 11, background: 'var(--bg-primary)' }} defaultValue="2026-04-25" />
                <button 
                  onClick={() => triggerAction(i)}
                  className="btn-ghost" 
                  style={{ 
                    fontSize: 11, 
                    fontWeight: 700, 
                    color: running === i ? 'var(--text-muted)' : 'var(--text-primary)',
                    flex: 1,
                    justifyContent: 'center'
                  }}
                  disabled={running !== null}
                >
                  <Play size={10} fill="currentColor"/> {running === i ? 'Running...' : s.action}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Flags & Config */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Feature Flags */}
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14 }}>Feature Matrix</h2>
            <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {flags.map((f, i) => (
                <div key={f.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '12px 0', borderBottom: i < flags.length - 1 ? '1px solid var(--border-soft)' : 'none' }}>
                  <Toggle on={f.enabled} onToggle={() => toggleFlag(i)} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <p style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)' }}>{f.key}</p>
                      <span className="badge" style={{ background: 'var(--blue-dim)', color: 'var(--blue)', fontSize: 9 }}>{f.day}</span>
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14 }}>System Health</h2>
            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Database Connection', status: 'Optimal', color: 'var(--green)' },
                  { label: 'Celery Workers', status: '8 Active', color: 'var(--green)' },
                  { label: 'Model Prediction API', status: 'Online', color: 'var(--green)' },
                  { label: 'Odds API Quota', status: '48% Used', color: 'var(--gold)' },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: item.color }}>{item.status}</span>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-soft)' }}>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <ShieldCheck size={14}/> Run System Diagnostic
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
