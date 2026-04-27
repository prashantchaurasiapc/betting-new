import React from 'react'
import { createPortal } from 'react-dom'
import { X, TrendingDown, TrendingUp, AlertCircle, ShieldCheck, Zap, Trash2 } from 'lucide-react'

function ConfBadge({ conf }) {
  const isStrong = conf === 'Strong Lean'
  const cls = isStrong ? 'badge-strong' : conf === 'Lean' ? 'badge-lean' : conf === 'Marginal' ? 'badge-marginal' : 'badge-pass'
  const icon = isStrong ? '🔥' : conf === 'Lean' ? '✅' : conf === 'Marginal' ? '⚠' : '⛔'
  
  return (
    <span className={`badge ${cls} ${isStrong ? 'animate-pulse-glow' : ''}`} style={{
      animation: isStrong ? 'pulse-glow 2s infinite' : 'none'
    }}>
      {icon} {conf}
    </span>
  )
}

export default function PickDetailDrawer({ pick, onClose, onToggleSlip, isInSlip }) {
  if (!pick) return null;

  const isUnder = pick.side === 'UNDER';
  const last5 = pick.trend || [];
  const avgL5 = (last5.reduce((a, b) => a + b, 0) / last5.length).toFixed(1);
  const hitsUnder = last5.filter(v => v < pick.line).length;
  const hitsOver = last5.filter(v => v > pick.line).length;

  const drawerContent = (
    <>
      <div 
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', 
          backdropFilter: 'blur(10px)', zIndex: 999998,
          opacity: 1, transition: 'opacity 0.3s'
        }}
      />
      
      <aside style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(480px, 100%)', background: '#0D0F12',
        borderLeft: '1px solid var(--border)', zIndex: 999999,
        boxShadow: '-20px 0 60px rgba(0,0,0,0.9)',
        display: 'flex', flexDirection: 'column',
        animation: 'slide-in-right 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <style>{`
          @keyframes slide-in-right {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          .glass-card-premium {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
          }
          .glass-card-premium:hover {
            border-color: rgba(255, 255, 255, 0.15);
            transform: translateY(-2px);
          }
          .mono-text { font-family: 'JetBrains Mono', monospace; }
          .animate-pop { animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
          @keyframes pop-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>

        {/* Header */}
        <div style={{ 
          padding: '40px 20px 16px', 
          borderBottom: '1px solid var(--border-soft)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: 'rgba(22, 26, 32, 0.98)',
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: 0,
          zIndex: 20
        }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 2 }}>{pick.player}</h2>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 0.5 }}>{pick.matchup} • {pick.market}</p>
          </div>
          <button onClick={onClose} style={{ 
            background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)', width: 40, height: 40, borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24, scrollbarWidth: 'none' }}>
          
          <div className="glass-card-premium animate-pop" style={{ padding: 24, borderRadius: 20, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 4, background: isUnder ? 'linear-gradient(90deg, transparent, var(--error), transparent)' : 'linear-gradient(90deg, transparent, var(--green), transparent)' }} />
            <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Model Selection</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
              <span className="mono-text" style={{ fontSize: 48, fontWeight: 900, color: isUnder ? 'var(--error)' : 'var(--green)', textShadow: isUnder ? '0 0 20px rgba(255,77,79,0.3)' : '0 0 20px rgba(0,255,136,0.3)' }}>{pick.side}</span>
              <span className="mono-text" style={{ fontSize: 48, fontWeight: 200, color: 'rgba(255,255,255,0.1)' }}>{pick.line}</span>
            </div>
            <div style={{ marginTop: 16 }}>
              <ConfBadge conf={pick.confidence} />
            </div>
          </div>

          <div className="animate-pop" style={{ animationDelay: '0.1s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: 0.5 }}>PROJECTION ANALYSIS</h3>
              <div style={{ display:'flex', alignItems: 'center', gap: 6 }}>
                <Zap size={12} style={{ color: 'var(--blue)' }} />
                <span className="mono-text" style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue)' }}>EDGE {pick.edge.toFixed(1)}%</span>
              </div>
            </div>
            <div className="glass-card-premium" style={{ padding: 20, borderRadius: 16 }}>
              <div style={{ position: 'relative', height: 48, display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, position: 'relative' }}>
                   <div style={{ position:'absolute', left: '45%', right: '30%', height:'100%', background: 'rgba(0, 207, 255, 0.1)', borderRadius: 4 }} />
                </div>
                <div style={{ position: 'absolute', left: '70%', height: 28, width: 2, background: 'rgba(255,255,255,0.3)', borderRadius: 1 }} />
                <span className="mono-text" style={{ position: 'absolute', left: '70%', top: -20, transform: 'translateX(-50%)', fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>LINE: {pick.line}</span>
                <div style={{ position: 'absolute', left: '45%', display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'translateX(-50%)' }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--blue)', boxShadow: '0 0 15px var(--blue)', border: '4px solid #0D0F12', marginBottom: 4 }} />
                  <span className="mono-text" style={{ fontSize: 14, fontWeight: 800, color: 'var(--blue)' }}>{pick.projection}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="animate-pop" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, animationDelay: '0.2s' }}>
            <div className="glass-card-premium" style={{ padding: 16, borderRadius: 16 }}>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>L5 AVERAGE</p>
              <p className="mono-text" style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{avgL5}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: parseFloat(avgL5) < pick.line ? 'var(--green)' : 'var(--error)' }}>
                {parseFloat(avgL5) < pick.line ? <TrendingDown size={12}/> : <TrendingUp size={12}/>}
                <span className="mono-text" style={{fontWeight: 700}}>{Math.abs(pick.line - avgL5).toFixed(1)}</span>
              </div>
            </div>
            <div className="glass-card-premium" style={{ padding: 16, borderRadius: 16 }}>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>HIT RATE</p>
              <p className="mono-text" style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{isUnder ? hitsUnder : hitsOver}/5</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--blue)' }}>
                <ShieldCheck size={12} />
                <span style={{fontWeight: 600}}>HITS {pick.side}</span>
              </div>
            </div>
          </div>

          {/* Sentiment with premium styling */}
          <div className="glass-card-premium animate-pop" style={{ padding: 20, borderRadius: 16, animationDelay: '0.3s' }}>
            <h3 style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: 1.5, marginBottom: 16, textTransform: 'uppercase' }}>Market & Odds</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Best Odds</span>
                <span className="mono-text" style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>-110 (Prizepicks)</span>
              </div>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Sharp Consensus</span>
                <span style={{ fontSize: 11, fontWeight: 900, padding: '4px 12px', borderRadius: 6, background: pick.sharp === 'Sharp' ? 'rgba(212,175,55,0.1)' : 'rgba(0,207,255,0.1)', color: pick.sharp === 'Sharp' ? 'var(--gold)' : 'var(--blue)' }}>
                  {pick.sharp.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Rollin / Consistency Section */}
          <div className="glass-card-premium animate-pop" style={{ padding: 20, borderRadius: 16, animationDelay: '0.4s' }}>
            <div style={{ display:'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
               <TrendingUp size={16} style={{ color: 'var(--accent-gold)' }} />
               <h3 style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', letterSpacing: 1.5, textTransform: 'uppercase' }}>Rollin' Consistency</h3>
            </div>
            <div style={{ display: 'flex', gap: 4, height: 40, alignItems: 'flex-end', marginBottom: 12 }}>
               {last5.map((v, i) => {
                 const hit = isUnder ? v < pick.line : v > pick.line;
                 return (
                   <div key={i} style={{ flex: 1, height: `${(v/Math.max(...last5, pick.line))*100}%`, background: hit ? 'var(--green)' : 'rgba(255,255,255,0.1)', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                      <span style={{ position:'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: 'var(--text-muted)' }}>{v}</span>
                   </div>
                 )
               })}
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Player is performing <strong style={{ color: 'var(--green)' }}>12% above</strong> season average in last 3 games.
            </p>
          </div>

          {/* Narrative Section */}
          <div className="animate-pop" style={{ animationDelay: '0.5s' }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>PICK STRATEGY</h3>
            <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: 16, borderRadius: 16 }}>
               <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                 Model detects a <strong>heavy mismatch</strong> in the paint. Opponent ranks 28th in defending {pick.market}. Expect high volume and efficiency.
               </p>
            </div>
          </div>

          <div style={{ background: 'rgba(255,176,32,0.05)', border: '1px solid rgba(255,176,32,0.2)', padding: 16, borderRadius: 12, display: 'flex', gap: 12, marginBottom: 40 }}>
            <AlertCircle size={20} style={{ color: 'var(--warning)', flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--warning)', marginBottom: 4 }}>Contextual Alert</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {pick.player} has high blowout risk. Minutes might be restricted if lead exceeds 20 pts.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '20px 24px 34px', background: 'var(--bg-elevated)', borderTop: '1px solid var(--border-soft)' }}>
          <button 
            onClick={() => {
              onToggleSlip(pick)
              if (!isInSlip) onClose() // Optional: close on add
            }}
            style={{ 
              width: '100%', 
              background: isInSlip ? 'var(--bg-secondary)' : 'linear-gradient(135deg, var(--green), var(--blue))', 
              border: isInSlip ? '1px solid var(--error)' : 'none', 
              borderRadius: 14, padding: '16px', 
              color: isInSlip ? 'var(--error)' : '#000', 
              fontWeight: 800, fontSize: 15, cursor: 'pointer', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, 
              boxShadow: isInSlip ? 'none' : '0 4px 20px rgba(0,212,161,0.3)',
              transition: 'all 0.2s'
            }}
          >
            {isInSlip ? (
              <><Trash2 size={20} /> REMOVE FROM SLIP</>
            ) : (
              <><ShieldCheck size={20} /> ADD TO PP SLIP</>
            )}
          </button>
        </div>
      </aside>
    </>
  )

  return createPortal(drawerContent, document.body)
}
