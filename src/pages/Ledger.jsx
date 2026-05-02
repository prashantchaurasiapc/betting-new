import React, { useState } from 'react'
import { LEDGER_PICKS } from '../lib/data.js'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function ConfBadge({ conf }) {
  const cls = conf==='Strong Lean'?'badge-strong':conf==='Lean'?'badge-lean':conf==='Marginal'?'badge-marginal':'badge-pass'
  return <span className={`badge ${cls}`}>{conf}</span>
}

export default function Ledger() {
  const [market,   setMarket]   = useState('PTS')
  const [lookback, setLookback] = useState('30')
  const [page,     setPage]     = useState(1)
  const perPage = 8
  const total   = LEDGER_PICKS.length
  const pages   = Math.ceil(total/perPage)
  const paged   = LEDGER_PICKS.slice((page-1)*perPage, page*perPage)

  return (
    <div className="anim-fade" style={{display:'flex',flexDirection:'column',gap:20}}>
      <div>
        <h1 className="page-title">Pick Ledger</h1>
        <p className="page-sub">Historical snapshots of model performance and verified results.</p>
      </div>

      {/* Accuracy Dashboard */}
      <div className="grid-3" style={{ gap: 16 }}>
        {[
          { label: 'Overall Hit Rate', val: '64.2%', sub: 'Last 500 picks', color: 'var(--accent-green)' },
          { label: 'Total ROI', val: '+12.4%', sub: 'Flat betting 1u', color: 'var(--blue)' },
          { label: 'Net Profit', val: '+31.20u', sub: 'Verified snapshots', color: 'var(--accent-gold)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: 20, textAlign: 'center' }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>{s.label}</p>
            <p style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.val}</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 20 }}>
        <p style={{ fontSize: 12, fontWeight: 800, color: 'var(--blue)', textTransform: 'uppercase', marginBottom: 16 }}>Confidence Band Accuracy</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          {[
            { band: 'Strong Lean', rate: '69.0%', count: 58 },
            { band: 'Lean', rate: '38.5%', count: 20 },
            { band: 'Marginal', rate: '45.8%', count: 144 },
            { band: 'Pass', rate: '34.2%', count: 107 },
          ].map(b => (
            <div key={b.band} style={{ padding: 12, background: 'var(--bg-secondary)', borderRadius: 10, border: '1px solid var(--border)' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)' }}>{b.band}</p>
              <p style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)' }}>{b.rate}</p>
              <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{b.count} samples</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:'flex',flexWrap:'wrap',gap:12,alignItems:'flex-end'}}>
        <div>
          <label style={{fontSize:11,color:'var(--text-muted)',display:'block',marginBottom:4}}>Market</label>
          <select className="input-field" value={market} onChange={e=>setMarket(e.target.value)}>
            {['PTS','REB','AST','3PM','PRA'].map(m=><option key={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label style={{fontSize:11,color:'var(--text-muted)',display:'block',marginBottom:4}}>Lookback (days)</label>
          <select className="input-field" value={lookback} onChange={e=>setLookback(e.target.value)}>
            {['7','14','30','60','90'].map(l=><option key={l}>{l}</option>)}
          </select>
        </div>
        <span style={{fontSize:12,color:'var(--text-muted)'}}>1513 snapshots · {total} shown</span>
      </div>

      <div className="card table-wrap">
        <table className="dt">
          <thead><tr>
            <th>Pick date</th>
            <th>Scored (UTC)</th>
            <th>Player</th>
            <th>Mkt</th>
            <th>Side</th>
            <th>Line</th>
            <th>Proj</th>
            <th>z-edge</th>
            <th>Band</th>
            <th>Model</th>
            <th>Result</th>
            <th>P&amp;L</th>
          </tr></thead>
          <tbody>
            {paged.map((p,i)=>(
              <tr key={i}>
                <td style={{fontFamily:'monospace',fontSize:11,color:'var(--text-secondary)'}}>{p.date}</td>
                <td style={{fontFamily:'monospace',fontSize:10,color:'var(--text-muted)'}}>Apr 25, 09:58 AM</td>
                <td style={{fontWeight:600,color:'var(--text-primary)'}}>{p.player}</td>
                <td><span className="chip chip-market">{p.market}</span></td>
                <td><span className={`badge ${p.side==='OVER'?'badge-over':'badge-under'}`}>{p.side}</span></td>
                <td style={{color:'var(--text-secondary)'}}>{p.line}</td>
                <td style={{color:'var(--text-secondary)'}}>{p.proj}</td>
                <td style={{fontWeight:700,color:p.edge>0?'var(--accent-green)':'var(--text-secondary)'}}>{p.edge.toFixed(2)}</td>
                <td><ConfBadge conf={p.band}/></td>
                <td style={{fontFamily:'monospace',fontSize:10,color:'var(--text-muted)'}}>xgb-pts..</td>
                <td style={{fontWeight:700,color:p.result==='W'?'var(--accent-green)':'var(--accent-red)'}}>
                  {p.result==='W'?'✓ W':'✗ L'}
                </td>
                <td style={{fontWeight:700,color:p.flatPL>0?'var(--accent-green)':'var(--accent-red)'}}>
                  {p.flatPL>0?'+':''}{p.flatPL.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <span style={{fontSize:12,color:'var(--text-muted)'}}>Page {page} / {pages}</span>
        <div style={{display:'flex',gap:8}}>
          <button className="btn-ghost" style={{padding:'6px 12px',fontSize:12}} onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>
            <ChevronLeft size={13}/> Prev
          </button>
          <button className="btn-ghost" style={{padding:'6px 12px',fontSize:12}} onClick={()=>setPage(p=>Math.min(pages,p+1))} disabled={page===pages}>
            Next <ChevronRight size={13}/>
          </button>
        </div>
      </div>
    </div>
  )
}
