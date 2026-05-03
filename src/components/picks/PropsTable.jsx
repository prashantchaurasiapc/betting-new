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
    <svg width={W} height={H} style={{ filter: 'drop-shadow(0 0 4px ' + color + '44)' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
      <circle cx={(data.length-1)/(data.length-1)*W} cy={H-((data[data.length-1]-min)/range)*(H-4)-2} r="2.5" fill={color}/>
    </svg>
  )
}

function PropCard({ p, onSelect, onToggleSlip, isInSlip }) {
  const isOver = p.side === 'OVER'
  const hits = p.trend.filter(v => isOver ? v > p.line : v < p.line).length
  const initials = p.player.split(' ').map(n => n[0]).join('').slice(0, 2)
  const opponent = p.matchup.split(' vs ').find(t => t !== p.team)

  return (
    <div className="glass-card anim-fade" style={{ 
      padding: 16, 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 16, 
      position: 'relative',
      borderTop: `4px solid ${isOver ? 'var(--green)' : 'var(--error)'}`,
      cursor: 'default'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="badge badge-lean" style={{ fontSize: 9 }}>BALANCED</span>
          <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)' }}>#{p.id % 5 + 1}</span>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--blue-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Star size={8} fill="var(--blue)" color="var(--blue)" />
          </div>
        </div>
        <span className="badge badge-strong" style={{ fontSize: 10 }}>STRONG</span>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ 
          width: 44, height: 44, borderRadius: '50%', 
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 900, color: 'var(--blue)'
        }}>
          {initials}
        </div>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.player}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.team} vs {opponent}</span>
            <span className="chip" style={{ fontSize: 9, padding: '1px 6px', background: 'var(--error-dim)', color: 'var(--error)' }}>HOSTILE</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <span style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-primary)' }}>{p.line}</span>
          <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: -4 }}>{p.market}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
           <div style={{ fontSize: 14, fontWeight: 900, color: p.edge > 0 ? 'var(--green)' : 'var(--error)' }}>
             {p.edge > 0 ? '+' : ''}{p.edge.toFixed(1)} EDGE
           </div>
        </div>
      </div>

      <div style={{ height: '1px', background: 'var(--border-soft)' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
          <span style={{ color: 'var(--text-muted)' }}>L10: {hits}/10 hits - avg {p.trendL10}</span>
          <span style={{ fontWeight: 700, color: 'var(--gold)' }}>Risk {Math.floor(Math.random() * 20 + 40)}</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          {opponent} <span style={{ color: 'var(--green)', fontWeight: 800 }}>#{p.defensiveRank}/30 def</span> - adj {p.adjProjection}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
        <button className="btn-ghost" style={{ flex: 1, padding: '8px', fontSize: 11, fontWeight: 800 }} onClick={() => onToggleSlip(p)}>
          {isInSlip ? 'Remove' : 'Add Less'}
        </button>
        <button className="btn-ghost" style={{ flex: 1, padding: '8px', fontSize: 11, fontWeight: 800 }} onClick={() => onToggleSlip(p)}>
          Add More
        </button>
      </div>
      
      <button 
        onClick={() => onSelect(p)}
        style={{ width: '100%', background: 'none', border: 'none', padding: 4, color: 'var(--text-muted)', fontSize: 10, fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1 }}
      >
        Details ▾
      </button>
    </div>
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
  const [view, setView] = useState('grid')
  const [limit, setLimit] = useState(20)
  const [grade, setGrade] = useState('All')

  const filtered = useMemo(() => {
    let d = [...data]
    if (market !== 'All') d = d.filter(p => p.market === market)
    if (side !== 'Both') d = d.filter(p => p.side === side)
    if (conf !== 'All') d = d.filter(p => p.confidence === conf)
    if (search) d = d.filter(p => p.player.toLowerCase().includes(search.toLowerCase()))
    if (hideLow) d = d.filter(p => p.confidence === 'Strong Lean' || p.confidence === 'Lean')
    d.sort((a, b) => sortD === 'desc' ? b[sortF] - a[sortF] : a[sortF] - b[sortF])
    return d.slice(0, limit)
  }, [data, market, side, conf, search, sortF, sortD, hideLow, limit])

  const toggleSort = f => {
    if (sortF === f) setSortD(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortF(f); setSortD('desc') }
  }
  const SIcon = ({ f }) => sortF === f ? (sortD === 'desc' ? <ChevronDown size={10} /> : <ChevronUp size={10} />) : null

  return (
    <div>
      <div className="filter-bar">
        <div className="search-wrap" style={{ flex: '1 1 200px' }}>
          <Search size={13} className="search-icon" />
          <input className="input-field" style={{ paddingLeft: 30, width: '100%' }} placeholder="Search player..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {MARKETS.map(m => (
            <button key={m} onClick={() => setMarket(m)} className={`chip-btn${market === m ? ' active' : ''}`}>{m}</button>
          ))}
        </div>
        <div style={{display:'flex',gap:4}}>
          {['A','B','C','D'].map(g=>(
            <button key={g} onClick={()=>setGrade(g)} className={`chip-btn${grade===g?' active':''}`}>{g}</button>
          ))}
        </div>
        <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: 10, padding: 3, border: '1px solid var(--border)', marginLeft: 'auto' }}>
           <button onClick={() => setView('grid')} style={{ padding: '4px 8px', borderRadius: 7, border: 'none', background: view === 'grid' ? 'var(--blue)' : 'transparent', color: view === 'grid' ? '#000' : 'var(--text-muted)', cursor: 'pointer' }}><ChevronDown size={14} /></button>
           <button onClick={() => setView('table')} style={{ padding: '4px 8px', borderRadius: 7, border: 'none', background: view === 'table' ? 'var(--blue)' : 'transparent', color: view === 'table' ? '#000' : 'var(--text-muted)', cursor: 'pointer' }}><ChevronUp size={14} /></button>
        </div>
      </div>

      <div className="card" style={{ background: view === 'table' ? 'var(--bg-card)' : 'transparent', border: view === 'table' ? '1px solid var(--border)' : 'none' }}>
        {view === 'table' ? (
          <div className="table-wrap" style={{ margin: 0, border: 'none' }}>
            <table className="dt">
              <thead><tr>
                <th>#</th>
                <th>Player</th>
                <th className="hide-mobile">Matchup</th>
                <th>Mkt</th>
                <th>Side</th>
                <th onClick={() => toggleSort('line')}>Line <SIcon f="line" /></th>
                <th onClick={() => toggleSort('edge')}>Edge <SIcon f="edge" /></th>
                <th onClick={() => toggleSort('score')} style={{ color: 'var(--blue)' }}>Score <SIcon f="score" /></th>
                <th className="hide-mobile">Move</th>
                <th className="hide-mobile">Sharp</th>
                <th className="hide-mobile">Align</th>
                <th className="hide-mobile">Trend</th>
                <th className="hide-mobile">Diff</th>
                <th>Conf</th>
              </tr></thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr
                    key={p.id}
                    onClick={() => onSelectPick(p)}
                    style={{ cursor: 'pointer', transition: 'background 0.2s', background: selectedPickId === p.id ? 'var(--bg-elevated)' : 'transparent' }}
                  >
                    <td style={{ color: 'var(--text-muted)', fontSize: 11 }}>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#1e3a5f,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: '#fff', flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)' }}>
                          {p.player.split(' ').map(w => w[0]).join('').slice(0, 2)}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.player}</p>
                            {p.edge > 10 && <span className="hide-mobile" title="High Edge" style={{ color: 'var(--accent-gold)', fontSize: 10 }}>🔥</span>}
                            {p.sharp === 'Sharp' && <span className="hide-mobile" title="Sharp Signal" style={{ color: 'var(--blue)', fontSize: 10 }}>⚡</span>}
                          </div>
                          <p className="hide-mobile" style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.2, marginTop: 2 }}>
                            <span style={{ color: 'var(--blue)', fontWeight: 700 }}>WHY:</span> {p.market} mismatch vs {p.team} defense
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hide-mobile" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.matchup}</td>
                    <td><span className="chip chip-market">{p.market}</span></td>
                    <td>
                      <span className={`badge ${p.side === 'OVER' ? 'badge-over' : 'badge-under'}`}>{p.side}</span>
                    </td>
                    <td className="mono-text" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.line}</td>
                    <td className="mono-text" style={{ fontWeight: 800, color: p.edge < 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>{p.edge.toFixed(1)}%</td>
                    <td className="mono-text" style={{ fontWeight: 800, color: 'var(--blue)' }}>{p.score.toFixed(3)}</td>
                    <td className="hide-mobile mono-text" style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{p.move}</td>
                    <td className="hide-mobile">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span className={`chip ${p.sharp === 'Sharp' ? 'chip-sharp' : 'chip-drift'}`}>{p.sharp}</span>
                        <span style={{ fontSize: 9, color: 'var(--text-muted)', textAlign: 'center' }}>{p.align}</span>
                      </div>
                    </td>
                    <td className="hide-mobile">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                        <Sparkline data={p.trend} />
                        <div style={{ display: 'flex', gap: 3 }}>
                          {p.trend.slice(-5).map((v, idx) => (
                            <div key={idx} style={{ width: 4, height: 4, borderRadius: '50%', background: p.side === 'UNDER' ? (v < p.line ? 'var(--green)' : 'var(--error)') : (v > p.line ? 'var(--green)' : 'var(--error)') }} />
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="hide-mobile">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                        <span className={`chip ${p.difficulty === 'HOSTILE' ? 'chip-hostile' : p.difficulty === 'TOUGH' ? 'chip-tough' : 'chip-favorable'}`}>{p.difficulty}</span>
                        <span style={{ fontSize: 8, color: 'var(--text-muted)', fontWeight: 700 }}>RISK: {p.difficulty === 'HOSTILE' ? 'HIGH' : 'MED'}</span>
                      </div>
                    </td>
                    <td><ConfBadge conf={p.confidence} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid-4" style={{ padding: 4 }}>
            {filtered.map(p => (
              <PropCard 
                key={p.id} 
                p={p} 
                onSelect={onSelectPick} 
                onToggleSlip={() => {}} // Pass actual handler if needed
                isInSlip={false} // Pass actual state if needed
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
