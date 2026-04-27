import React, { useState, useMemo } from 'react'
import { Search, Star, ChevronUp, ChevronDown } from 'lucide-react'

export function ConfBadge({ conf }) {
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

export function Sparkline({ data }) {
  const min = Math.min(...data), max = Math.max(...data), range = max-min||1
  const W=60, H=24
  const pts = data.map((v,i)=>`${(i/(data.length-1))*W},${H-((v-min)/range)*(H-4)-2}`).join(' ')
  const color = data[data.length-1]>=data[0]?'#00d4a1':'#ef4444'
  return (
    <svg width={W} height={H}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/>
      <circle cx={(data.length-1)/(data.length-1)*W} cy={H-((data[data.length-1]-min)/range)*(H-4)-2} r="2.5" fill={color}/>
    </svg>
  )
}

const MARKETS = ['All','PTS','REB','AST','PRA','3PM','STL','BLK']
const SIDES   = ['Both','OVER','UNDER']
const CONFS   = ['All','Strong Lean','Lean','Marginal','Pass']

export default function PropsTable({ data, onSelectPick, selectedPickId }) {
  const [market, setMarket] = useState('PTS')
  const [side, setSide]     = useState('Both')
  const [conf, setConf]     = useState('All')
  const [search, setSearch] = useState('')
  const [sortF, setSortF]   = useState('score')
  const [sortD, setSortD]   = useState('desc')
  const [hideLow, setHideLow] = useState(false)

  const filtered = useMemo(() => {
    let d = [...data]
    if (market !== 'All')  d = d.filter(p => p.market === market)
    if (side !== 'Both')   d = d.filter(p => p.side === side)
    if (conf !== 'All')    d = d.filter(p => p.confidence === conf)
    if (search)            d = d.filter(p => p.player.toLowerCase().includes(search.toLowerCase()))
    if (hideLow)           d = d.filter(p => p.confidence==='Strong Lean'||p.confidence==='Lean')
    d.sort((a,b) => sortD==='desc' ? b[sortF]-a[sortF] : a[sortF]-b[sortF])
    return d
  }, [data, market, side, conf, search, sortF, sortD, hideLow])

  const toggleSort = f => {
    if (sortF===f) setSortD(d=>d==='desc'?'asc':'desc')
    else { setSortF(f); setSortD('desc') }
  }
  const SIcon = ({f}) => sortF===f ? (sortD==='desc'?<ChevronDown size={10}/>:<ChevronUp size={10}/>) : null

  return (
    <div>
      <div className="filter-bar">
        <div className="search-wrap">
          <Search size={13} className="search-icon"/>
          <input className="input-field" style={{paddingLeft:30,width:190}} placeholder="Search player..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
          {MARKETS.map(m=>(
            <button key={m} onClick={()=>setMarket(m)} className={`chip-btn${market===m?' active':''}`}>{m}</button>
          ))}
        </div>
        <div style={{display:'flex',gap:4}}>
          {SIDES.map(s=>(
            <button key={s} onClick={()=>setSide(s)}
              className={`chip-btn${side===s?(s==='OVER'?' active-green':s==='UNDER'?' active-red':' active'):''}`}>{s}</button>
          ))}
        </div>
        <select className="input-field" value={conf} onChange={e=>setConf(e.target.value)}>
          {CONFS.map(c=><option key={c}>{c}</option>)}
        </select>
        <label style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'var(--text-secondary)',cursor:'pointer'}}>
          <input type="checkbox" checked={hideLow} onChange={e=>setHideLow(e.target.checked)} style={{accentColor:'var(--accent-blue)'}}/>
          Hide low-confidence
        </label>
        <span style={{fontSize:11,color:'var(--text-muted)',marginLeft:'auto'}}>{filtered.length} picks</span>
      </div>

      <div className="card table-wrap">
        <table className="dt">
          <thead><tr>
            <th>#</th>
            <th>Player</th>
            <th className="hide-mobile">Matchup</th>
            <th>Mkt</th>
            <th>Side</th>
            <th onClick={()=>toggleSort('line')}>Line <SIcon f="line"/></th>
            <th onClick={()=>toggleSort('edge')}>Edge <SIcon f="edge"/></th>
            <th onClick={()=>toggleSort('score')} style={{color:'var(--blue)'}}>Score <SIcon f="score"/></th>
            <th className="hide-mobile">Move</th>
            <th className="hide-mobile">Sharp</th>
            <th className="hide-mobile">Align</th>
            <th className="hide-mobile">Trend</th>
            <th className="hide-mobile">Diff</th>
            <th className="hide-mobile">Conf</th>
          </tr></thead>
          <tbody>
            {filtered.map((p,i)=>(
              <tr 
                key={p.id} 
                onClick={() => onSelectPick(p)}
                style={{ cursor: 'pointer', transition: 'background 0.2s', background: selectedPickId === p.id ? 'var(--bg-elevated)' : 'transparent' }}
              >
                <td style={{color:'var(--text-muted)',fontSize:11}}>{i+1}</td>
                <td>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <div style={{width:30,height:30,borderRadius:'50%',background:'linear-gradient(135deg,#1e3a5f,#3b82f6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:900,color:'#fff',flexShrink:0}}>
                      {p.player.split(' ').map(w=>w[0]).join('').slice(0,2)}
                    </div>
                    <div>
                      <p style={{fontSize:12,fontWeight:600,color:'var(--text-primary)',whiteSpace:'nowrap'}}>{p.player}</p>
                      <p style={{fontSize:11,color:'var(--text-muted)'}}>{p.team}</p>
                    </div>
                    <Star size={11} className="hide-mobile" style={{color:'var(--text-muted)',cursor:'pointer',flexShrink:0}}/>
                  </div>
                </td>
                <td className="hide-mobile" style={{fontSize:11,color:'var(--text-muted)'}}>{p.matchup}</td>
                <td><span className="chip chip-market">{p.market}</span></td>
                <td>
                  <span className={`badge ${p.side==='OVER'?'badge-over':'badge-under'}`}>{p.side}</span>
                </td>
                <td className="mono-text" style={{fontWeight:600,color:'var(--text-primary)'}}>{p.line}</td>
                <td className="mono-text" style={{fontWeight:700,color:p.edge<0?'var(--accent-red)':'var(--accent-green)'}}>{p.edge.toFixed(1)}</td>
                <td className="mono-text" style={{fontWeight:700,color:'var(--blue)'}}>{p.score.toFixed(3)}</td>
                <td className="hide-mobile mono-text" style={{fontSize:11,color:'var(--text-secondary)'}}>{p.move}</td>
                <td className="hide-mobile"><span className={`chip ${p.sharp==='Sharp'?'chip-sharp':'chip-drift'}`}>{p.sharp}</span></td>
                <td className="hide-mobile"><span className={`chip ${p.align==='AGAINST'?'chip-against':p.align==='WITH'?'chip-with':'chip-neutral'}`}>{p.align}</span></td>
                <td className="hide-mobile"><Sparkline data={p.trend}/></td>
                <td className="hide-mobile"><span className={`chip ${p.difficulty==='HOSTILE'?'chip-hostile':p.difficulty==='TOUGH'?'chip-tough':'chip-favorable'}`}>{p.difficulty}</span></td>
                <td className="hide-mobile"><ConfBadge conf={p.confidence}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
