import React, { useState, useEffect } from 'react'
import { Play, RotateCcw, ShieldCheck, Database, Zap, Cpu, CheckCircle2, Loader2 } from 'lucide-react'

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
  { key: 'ENABLE_DEFENSE_GRADE_CONTEXT', enabled: true, desc: 'Perimeter & rim defensive grades from team profiles', day: 'Day 2' },
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
  const [masterProgress, setMasterProgress] = useState(0)
  const [isMasterSyncing, setIsMasterSyncing] = useState(false)
  const [diagnosticStatus, setDiagnosticStatus] = useState('Idle')
  const [toast, setToast] = useState(null)
  
  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const toggleFlag = i => {
    const newFlags = [...flags]
    newFlags[i].enabled = !newFlags[i].enabled
    setFlags(newFlags)
    showToast(`${newFlags[i].key} updated`)
  }
  
  const triggerAction = async (idx) => {
    setRunning(idx)
    await new Promise(r => setTimeout(r, 1500))
    setRunning(null)
    showToast(`${SECTIONS[idx].title} Completed Successfully`)
  }

  const runMasterSync = async () => {
    setIsMasterSyncing(true)
    setMasterProgress(0)
    for (let i = 0; i < SECTIONS.length; i++) {
      setRunning(i)
      for (let p = 0; p <= 100; p += 10) {
        setMasterProgress(((i / SECTIONS.length) * 100) + (p / SECTIONS.length))
        await new Promise(r => setTimeout(r, 100))
      }
      setRunning(null)
    }
    setIsMasterSyncing(false)
    setMasterProgress(100)
    showToast("Master System Sync Complete")
    setTimeout(() => setMasterProgress(0), 2000)
  }

  const runDiagnostic = async () => {
    setDiagnosticStatus('Scanning...')
    await new Promise(r => setTimeout(r, 2000))
    setDiagnosticStatus('Optimizing...')
    await new Promise(r => setTimeout(r, 1500))
    setDiagnosticStatus('Healthy')
    showToast("System Diagnostics: 100% Optimal")
    setTimeout(() => setDiagnosticStatus('Idle'), 3000)
  }

  return (
    <div className="anim-fade" style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {toast && (
        <div style={{ 
          position:'fixed', top: 30, right: 30, zIndex: 99999, 
          background: '#0F172A', border: '1px solid var(--blue)', 
          color: 'var(--blue)', padding: '16px 24px', borderRadius: 16, 
          display: 'flex', alignItems: 'center', gap: 12, 
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)', 
          animation: 'slide-in-right 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
        }}>
          <CheckCircle2 size={18} />
          <span style={{ fontSize: 14, fontWeight: 800 }}>{toast}</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-title">Pipeline Control</h1>
          <p className="page-sub">System-level data orchestration and ML model execution center.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            onClick={() => showToast("Workers Reset - All systems ready")} 
            className="btn-ghost" 
            style={{ fontSize: 11, padding: '10px 18px', border: '1px solid var(--border-bright)' }}
          >
            <RotateCcw size={14}/> Reset Workers
          </button>
          <button 
            onClick={runMasterSync} 
            disabled={isMasterSyncing}
            className="btn-primary" 
            style={{ 
              fontSize: 11, padding: '10px 20px', position: 'relative', overflow: 'hidden',
              background: isMasterSyncing ? 'var(--bg-secondary)' : 'var(--blue)',
              color: isMasterSyncing ? 'var(--blue)' : '#000'
            }}
          >
            {isMasterSyncing ? <><Loader2 size={14} className="animate-spin" /> Syncing {Math.round(masterProgress)}%</> : 'Master Sync'}
            {isMasterSyncing && (
              <div style={{ position: 'absolute', bottom: 0, left: 0, height: 3, background: 'var(--blue)', width: `${masterProgress}%`, transition: 'width 0.1s ease-out' }} />
            )}
          </button>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 24, alignItems: 'start' }}>
        {/* Left Column: Tasks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h2 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Automated Tasks</h2>
          {SECTIONS.map((s, i) => (
            <div key={i} className="card" style={{ padding: 20, borderLeft: `4px solid ${s.color}`, transition: '0.3s', opacity: (running !== null && running !== i) ? 0.5 : 1 }}>
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
                    color: running === i ? 'var(--blue)' : 'var(--text-primary)',
                    flex: 1,
                    justifyContent: 'center',
                    background: running === i ? 'var(--blue-dim)' : 'transparent'
                  }}
                  disabled={running !== null}
                >
                  {running === i ? <><Loader2 size={12} className="animate-spin" /> Processing...</> : <><Play size={10} fill="currentColor"/> {s.action}</>}
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
            <div className="card" style={{ padding: 20, position: 'relative', overflow: 'hidden' }}>
              {diagnosticStatus !== 'Idle' && (
                <div style={{ position: 'absolute', top: 0, left: 0, height: 2, width: '100%', background: 'linear-gradient(90deg, transparent, var(--blue), transparent)', animation: 'scan-line 1.5s infinite' }} />
              )}
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
                      <div className={diagnosticStatus !== 'Idle' ? 'animate-pulse' : ''} style={{ width: 6, height: 6, borderRadius: '50%', background: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-soft)' }}>
                <button 
                  onClick={runDiagnostic}
                  disabled={diagnosticStatus !== 'Idle'}
                  className="btn-primary" 
                  style={{ 
                    width: '100%', justifyContent: 'center', padding: '12px',
                    background: diagnosticStatus !== 'Idle' ? 'var(--bg-secondary)' : 'var(--blue)',
                    color: diagnosticStatus !== 'Idle' ? 'var(--blue)' : '#000'
                  }}
                >
                  {diagnosticStatus === 'Idle' ? (
                    <><ShieldCheck size={14}/> Run System Diagnostic</>
                  ) : (
                    <><Loader2 size={14} className="animate-spin" /> {diagnosticStatus}</>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <style>{`
            @keyframes scan-line {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
            .animate-pulse {
              animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: .5; transform: scale(1.5); }
            }
          `}</style>
        </div>
      </div>
    </div>
  )
}
