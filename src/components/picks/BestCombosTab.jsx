import React, { useState } from 'react'
import { BEST_COMBOS } from '../../lib/data.js'
import { ConfBadge } from './PropsTable'

export default function BestCombosTab() {
  const [filter, setFilter] = useState('Pick 2')
  
  const filtered = BEST_COMBOS.filter(c => {
    if (filter === 'Pick 2') return c.legs.length === 2
    if (filter === 'Pick 3') return c.legs.length === 3
    if (filter === 'Pick 4') return c.legs.length === 4
    if (filter === 'Pick 5') return c.legs.length === 5
    if (filter === 'Pick 6') return c.legs.length === 6
    if (filter === 'Auto') return true
    return true
  })

  return (
    <div>
      <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:14}}>
        {['Pick 2','Pick 3','Pick 4','Pick 5','Pick 6','Auto'].map(s=>(
          <button key={s} onClick={()=>setFilter(s)} className={`chip-btn${filter===s?' active':''}`}>{s}</button>
        ))}
      </div>
      <p style={{fontSize:12,color:'var(--text-muted)',marginBottom:12}}>{filtered.length} optimal combos generated</p>
      
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        {filtered.map(c=>(
          <div key={c.id} className="card anim-fade" style={{padding:20}}>
            <div style={{display:'flex',alignItems:'center',gap:14,flexWrap:'wrap',marginBottom:16,paddingBottom:12,borderBottom:'1px solid var(--border)'}}>
              <span style={{fontSize:24,fontWeight:900,color:'var(--green)'}}>{c.score}</span>
              <div>
                <p style={{fontSize:10,color:'var(--text-muted)',fontWeight:700,letterSpacing:1}}>COMBO SCORE</p>
                <div style={{display:'flex',gap:8,alignItems:'center'}}>
                  <span className="badge badge-lean">{c.type}</span>
                  <span style={{fontSize:11,color:'var(--text-muted)'}}>#{c.id}</span>
                </div>
              </div>
              <div style={{display:'flex',gap:20,fontSize:12,marginLeft:'auto'}}>
                <div><p style={{color:'var(--text-muted)',fontSize:10}}>EDGE</p><strong style={{color:'var(--green)'}}>{c.totalEdge}</strong></div>
                <div><p style={{color:'var(--text-muted)',fontSize:10}}>AVG RANK</p><strong>{c.avgRank}</strong></div>
              </div>
            </div>
            {c.legs.map((leg,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8,padding:'8px 0',borderBottom:i<c.legs.length-1?'1px solid var(--border)':'none'}}>
                <div>
                  <p style={{fontWeight:700,color:'var(--text-primary)'}}>{leg.player}</p>
                  <p style={{fontSize:11,color:'var(--blue)'}}>{leg.matchup}</p>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:10,fontSize:12}}>
                  <span className="chip chip-market">{leg.market}</span>
                  <span style={{color:'var(--text-secondary)'}}>{leg.dir} ↓ {leg.line} → {leg.to}</span>
                  <span style={{fontWeight:700,color:'var(--accent-red)'}}>{leg.edge}</span>
                  <ConfBadge conf={leg.confidence}/>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
