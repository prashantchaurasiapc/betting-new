import React from 'react'
import { POLICIES } from '../lib/data.js'

export default function Policies() {
  const [isClearing, setIsClearing] = React.useState(false)
  const [lastUpdate, setLastUpdate] = React.useState('4/25/2026, 3:26:15 PM')
  const [toast, setToast] = React.useState(null)

  const invalidateCache = () => {
    setIsClearing(true)
    setTimeout(() => {
      setIsClearing(false)
      setLastUpdate(new Date().toLocaleString())
      setToast('System Cache Invalidated Successfully')
      setTimeout(() => setToast(null), 3000)
    }, 1500)
  }

  return (
    <div className="anim-fade" style={{display:'flex',flexDirection:'column',gap:20}}>
      
      {toast && (
        <div style={{ 
          position:'fixed', top: 100, right: 30, zIndex: 10000000, 
          background: '#0F172A', border: '1px solid var(--blue)', 
          color: 'var(--blue)', padding: '16px 24px', borderRadius: 16, 
          display: 'flex', alignItems: 'center', gap: 12, 
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)', 
          animation: 'slide-in-right 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
        }}>
          <span style={{ fontSize: 14, fontWeight: 800 }}>{toast}</span>
        </div>
      )}

      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
        <div>
          <h1 className="page-title">Pick Policies</h1>
          <p className="page-sub">As of {lastUpdate} · 8 active policies</p>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <label style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'var(--text-secondary)',cursor:'pointer'}}>
            <input type="checkbox" style={{accentColor:'var(--accent-blue)'}} defaultChecked />
            Auto-refresh (30s)
          </label>
          <button 
            onClick={invalidateCache}
            disabled={isClearing}
            className="btn-primary" 
            style={{fontSize:12,padding:'10px 16px', borderRadius: 10, background: isClearing ? 'var(--bg-secondary)' : 'var(--blue)', color: isClearing ? 'var(--blue)' : '#000'}}
          >
            {isClearing ? 'Clearing Cache...' : 'Invalidate cache'}
          </button>
        </div>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        {POLICIES.map((p,idx)=>(
          <div key={idx} className="card" style={{padding:18}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16,flexWrap:'wrap'}}>
              <h2 style={{fontSize:14,fontWeight:700,color:'var(--text-primary)'}}>{p.name}</h2>
              <span className="badge badge-lean">{p.market}</span>
              <span className="chip chip-market">{p.status}</span>
              <span style={{fontSize:11,color:'var(--text-muted)'}}>topN: —</span>
            </div>
            <div className="grid-2" style={{gap:24}}>
              <div>
                <p style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'.07em',color:'var(--text-muted)',marginBottom:8}}>Weights</p>
                <table className="dt">
                  <thead><tr><th>Signal</th><th style={{textAlign:'right'}}>Weight</th></tr></thead>
                  <tbody>
                    {p.weights.map(w=>(
                      <tr key={w.signal}>
                        <td style={{color:w.w>0?'var(--accent-blue)':'var(--text-muted)'}}>{w.signal}</td>
                        <td style={{textAlign:'right',color:w.w>0?'var(--text-primary)':'var(--text-muted)',fontWeight:w.w>0?700:400}}>
                          {w.w.toFixed(3)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <p style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'.07em',color:'var(--text-muted)',marginBottom:8}}>Thresholds</p>
                <table className="dt">
                  <thead><tr><th>Setting</th><th style={{textAlign:'right'}}>Value</th></tr></thead>
                  <tbody>
                    {p.thresholds.map(t=>(
                      <tr key={t.setting}>
                        <td style={{color:'var(--text-secondary)'}}>{t.setting}</td>
                        <td style={{textAlign:'right',fontWeight:700,color:t.value===0?'var(--text-muted)':'var(--text-primary)'}}>
                          {t.value===0?'0 (disabled)':t.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
