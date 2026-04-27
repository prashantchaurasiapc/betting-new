import React, { useState, useMemo } from 'react'
import { PLAYER_PROPS, BIG_MOVERS, BEST_COMBOS } from '../lib/data.js'
import { Search, Star, ChevronUp, ChevronDown } from 'lucide-react'

const MARKETS = ['All','PTS','REB','AST','PRA','3PM','STL','BLK']
const SIDES   = ['Both','OVER','UNDER']
const CONFS   = ['All','Strong Lean','Lean','Marginal','Pass']

function ConfBadge({ conf }) {
  const cls = conf==='Strong Lean'?'badge-strong':conf==='Lean'?'badge-lean':conf==='Marginal'?'badge-marginal':'badge-pass'
  const icon = conf==='Strong Lean'?'🔥':conf==='Lean'?'✅':conf==='Marginal'?'⚠':'⛔'
  return <span className={`badge ${cls}`}>{icon} {conf}</span>
}

function Sparkline({ data }) {
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

function PropsTable() {
  const [market, setMarket] = useState('PTS')
  const [side, setSide]     = useState('Both')
  const [conf, setConf]     = useState('All')
  const [search, setSearch] = useState('')
  const [sortF, setSortF]   = useState('score')
  const [sortD, setSortD]   = useState('desc')
  const [hideLow, setHideLow] = useState(false)

  const filtered = useMemo(() => {
    let d = [...PLAYER_PROPS]
    if (market !== 'All')  d = d.filter(p => p.market === market)
    if (side !== 'Both')   d = d.filter(p => p.side === side)
    if (conf !== 'All')    d = d.filter(p => p.confidence === conf)
    if (search)            d = d.filter(p => p.player.toLowerCase().includes(search.toLowerCase()))
    if (hideLow)           d = d.filter(p => p.confidence==='Strong Lean'||p.confidence==='Lean')
    d.sort((a,b) => sortD==='desc' ? b[sortF]-a[sortF] : a[sortF]-b[sortF])
    return d
  }, [market, side, conf, search, sortF, sortD, hideLow])

  const toggleSort = f => {
    if (sortF===f) setSortD(d=>d==='desc'?'asc':'desc')
    else { setSortF(f); setSortD('desc') }
  }
  const SIcon = ({f}) => sortF===f ? (sortD==='desc'?<ChevronDown size={10}/>:<ChevronUp size={10}/>) : null

  return (
    <div>
      {/* Filters */}
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
            <th>Matchup</th>
            <th>Mkt</th>
            <th>Side</th>
            <th onClick={()=>toggleSort('line')}>Line <SIcon f="line"/></th>
            <th onClick={()=>toggleSort('edge')}>Edge <SIcon f="edge"/></th>
            <th onClick={()=>toggleSort('score')} style={{color:'var(--blue)'}}>Score <SIcon f="score"/></th>
            <th>Move</th>
            <th>Sharp</th>
            <th>Align</th>
            <th>Trend (L5)</th>
            <th>Difficulty</th>
            <th>Confidence</th>
          </tr></thead>
          <tbody>
            {filtered.map((p,i)=>(
              <tr key={p.id}>
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
                    <Star size={11} style={{color:'var(--text-muted)',cursor:'pointer',flexShrink:0}}/>
                  </div>
                </td>
                <td style={{fontSize:11,color:'var(--text-muted)'}}>{p.matchup}</td>
                <td><span className="chip chip-market">{p.market}</span></td>
                <td>
                  <span className={`badge ${p.side==='OVER'?'badge-over':'badge-under'}`}>{p.side}</span>
                </td>
                <td style={{fontWeight:600,color:'var(--text-primary)'}}>{p.line}</td>
                <td style={{fontWeight:700,color:p.edge<0?'var(--accent-red)':'var(--accent-green)'}}>{p.edge.toFixed(1)}</td>
                <td style={{fontWeight:700,color:'var(--blue)'}}>{p.score.toFixed(3)}</td>
                <td style={{fontFamily:'monospace',fontSize:11,color:'var(--text-secondary)'}}>{p.move}</td>
                <td><span className={`chip ${p.sharp==='Sharp'?'chip-sharp':'chip-drift'}`}>{p.sharp}</span></td>
                <td><span className={`chip ${p.align==='AGAINST'?'chip-against':p.align==='WITH'?'chip-with':'chip-neutral'}`}>{p.align}</span></td>
                <td><Sparkline data={p.trend}/></td>
                <td><span className={`chip ${p.difficulty==='HOSTILE'?'chip-hostile':p.difficulty==='TOUGH'?'chip-tough':'chip-favorable'}`}>{p.difficulty}</span></td>
                <td><ConfBadge conf={p.confidence}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{fontSize:11,color:'var(--text-muted)',marginTop:8}}>As of 03:05 PM ET</p>
    </div>
  )
}

function BigMoversTab() {
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

function BestCombosTab() {
  const [slip, setSlip] = useState('Pick 2')
  return (
    <div>
      <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:14}}>
        {['Pick 2','Pick 3','Pick 4','Pick 5','Pick 6','Player Stack','Game Stack','Auto'].map(s=>(
          <button key={s} onClick={()=>setSlip(s)} className={`chip-btn${slip===s?' active':''}`}>{s}</button>
        ))}
      </div>
      <p style={{fontSize:12,color:'var(--text-muted)',marginBottom:6}}>86 eligible picks · {BEST_COMBOS.length} combos generated</p>
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        {BEST_COMBOS.map(c=>(
          <div key={c.id} className="card" style={{padding:16}}>
            <div style={{display:'flex',alignItems:'center',gap:14,flexWrap:'wrap',marginBottom:12,paddingBottom:12,borderBottom:'1px solid var(--border)'}}>
              <span style={{fontSize:12,color:'var(--text-muted)'}}>#{c.id}</span>
              <span style={{fontSize:24,fontWeight:900,color:'var(--accent-green)'}}>{c.score}</span>
              <span style={{fontSize:11,color:'var(--text-muted)'}}>score</span>
              <span className="badge badge-lean">{c.type}</span>
              <div style={{display:'flex',gap:16,fontSize:12,marginLeft:'auto'}}>
                <span><span style={{color:'var(--text-muted)'}}>TOTAL EDGE </span><strong style={{color:'var(--accent-green)'}}>{c.totalEdge}</strong></span>
                <span><span style={{color:'var(--text-muted)'}}>AVG RANK </span><strong style={{color:'var(--text-primary)'}}>{c.avgRank}</strong></span>
                <span><span style={{color:'var(--text-muted)'}}>GAMES </span><strong style={{color:'var(--text-primary)'}}>{c.games}</strong></span>
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

const TABS = [
  {key:'recommended', label:'Recommended v1', badge:10},
  {key:'top',         label:'Top Picks',       badge:122},
  {key:'movers',      label:'Big Movers β',    badge:50},
  {key:'combos',      label:'Best Combos β',   badge:null},
  {key:'ppslip',      label:'PP Slip β',       badge:33},
]

export default function Picks() {
  const [tab, setTab] = useState('recommended')
  return (
    <div className="anim-fade">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8,marginBottom:16}}>
        <h1 className="page-title">Picks</h1>
        <span style={{fontSize:11,color:'var(--text-muted)'}}>Updated 11:30 AM · xgb-pra-20260420-070000</span>
      </div>

      <div className="tab-bar">
        {TABS.map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key)} className={`tab-btn${tab===t.key?' active':''}`}>
            {t.label}
            {t.badge!==null && <span className="tab-count">{t.badge}</span>}
          </button>
        ))}
      </div>

      {(tab==='recommended'||tab==='top') && <PropsTable/>}
      {tab==='movers'  && <BigMoversTab/>}
      {tab==='combos'  && <BestCombosTab/>}
      {tab==='ppslip'  && (
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:160,color:'var(--text-muted)'}}>
          PP Slip feature coming soon...
        </div>
      )}
    </div>
  )
}
