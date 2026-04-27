import React from 'react'
import { BIG_MOVERS } from '../../lib/data.js'
import { ConfBadge } from './PropsTable'

export default function BigMoversTab() {
  return (
    <div>
      <div style={{padding:'10px 14px',borderRadius:8,background:'var(--bg-secondary)',border:'1px solid var(--border)',fontSize:12,color:'var(--text-secondary)',marginBottom:14,lineHeight:1.6}}>
        <strong style={{color:'var(--text-primary)'}}>β Big Movers</strong> — informational context, not pick recommendations. Sharp ≥1 unit move. Drift ≥½ unit.
      </div>
      <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:14}}>
        {['All','PTS 21','REB 6','AST 3','PRA 19'].map((t,i)=>(
          <button key={t} className={`chip-btn${i===0?' active':''}`}>{t}</button>
        ))}
        <span style={{fontSize:11,color:'var(--text-muted)',marginLeft:'auto',alignSelf:'center'}}>As of 03:05 PM</span>
      </div>
      <div className="card table-wrap">
        <table className="dt">
          <thead><tr><th>Player</th><th>Mkt</th><th>Line → New</th><th>Move</th><th>Move(σ)</th><th>Type</th><th>Pick</th><th>Strength</th><th>Alignment</th></tr></thead>
          <tbody>
            {BIG_MOVERS.map((m,i)=>(
              <tr key={i}>
                <td>
                  <p style={{fontWeight:600,color:'var(--text-primary)'}}>{m.player}</p>
                  <p style={{fontSize:11,color:'var(--blue)'}}>{m.matchup}</p>
                </td>
                <td><span className="chip chip-market">{m.market}</span></td>
                <td style={{fontSize:12}}>
                  <span style={{color:'var(--text-secondary)'}}>{m.line}</span>
                  <span style={{color:'var(--text-muted)'}}> → </span>
                  <span style={{color:'var(--accent-green)',fontWeight:700}}>{m.newLine}</span>
                </td>
                <td style={{fontWeight:700,color:m.move<0?'var(--accent-red)':'var(--accent-green)'}}>{m.move.toFixed(1)}</td>
                <td style={{fontWeight:700,color:'var(--accent-gold)'}}>{m.sigma.toFixed(2)}σ</td>
                <td><span className={`chip ${m.type==='Sharp'?'chip-sharp':'chip-drift'}`}>{m.type}</span></td>
                <td><span className="badge badge-under">{m.pick}</span></td>
                <td><ConfBadge conf={m.strength}/></td>
                <td><span className={`chip ${m.align==='AGAINST'?'chip-against':'chip-with'}`}>{m.align}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
