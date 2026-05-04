import React, { useState, useMemo } from 'react'
import { Search, Star, ChevronUp, ChevronDown, Activity, Zap, Plus, Trash2, AlertCircle } from 'lucide-react'
import { SignalStrengthItem, ContextSummaryGrid, RecentFormSection, ConfidenceDistribution } from './AnalyticsSections'

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

function PropCard({ p: pick, onSelect, onToggleSlip, isInSlip }) {
  const [expanded, setExpanded] = useState(false);
  const opponent = pick.matchup.split(' vs ').find(t => t !== pick.team);
  const confidenceClass = pick.confidence.toLowerCase().replace(' ', '-');
  const edgeColor = pick.edge < 0 ? 'var(--error)' : 'var(--green)';

  return (
    <div 
      className={`rec-card-refactored anim-fade ${expanded ? 'is-expanded' : ''}`}
      style={{ 
        background: 'var(--bg-card)',
        border: `1px solid ${expanded ? 'var(--blue)' : 'var(--border)'}`,
        borderRadius: 24,
        padding: '20px',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }}
    >
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 2 }}>{pick.player}</h3>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>
            {pick.market} {pick.side} {pick.line}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <div className={`badge badge-${confidenceClass}`} style={{ padding: '3px 10px', fontSize: 9, borderRadius: 6, fontWeight: 900 }}>
            {pick.confidence.toUpperCase()}
          </div>
        </div>
      </div>

      {/* 1 — DECISION ROW */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr 1.2fr', 
        gap: 12, 
        padding: '14px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 12,
        border: '1px solid var(--border-soft)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Line</span>
          <span style={{ fontSize: 16, fontWeight: 900 }}>{pick.line}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Proj</span>
          <span style={{ fontSize: 16, fontWeight: 900, color: edgeColor }}>{pick.projection.toFixed(1)}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Edge</span>
          <span style={{ fontSize: 16, fontWeight: 900, color: edgeColor }}>{pick.edge.toFixed(0)}%</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Prob</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ fontSize: 16, fontWeight: 900, color: 'var(--blue)', lineHeight: 1 }}>68%</span>
            <div style={{ width: '100%', height: 3, background: 'var(--bg-alpha-10)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: '68%', height: '100%', background: 'var(--blue)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 2 — DRIVER ROW */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Defensive pressure</span>
          <div style={{ flex: 1, height: 3, background: 'var(--bg-alpha-10)', margin: '0 10px', borderRadius: 2 }}>
            <div style={{ width: '60%', height: '100%', background: 'var(--error)', marginLeft: '40%' }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--error)' }}>-1.4</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Injury impact</span>
          <div style={{ flex: 1, height: 3, background: 'var(--bg-alpha-10)', margin: '0 10px', borderRadius: 2 }}>
            <div style={{ width: '40%', height: '100%', background: 'var(--green)', marginLeft: '20%' }} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--green)' }}>+0.8</span>
        </div>
      </div>

      {/* 3 — RISK ROW */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        <div style={{ background: 'var(--gold-dim)', color: 'var(--gold)', padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, border: '1px solid rgba(212,175,55,0.1)' }}>
          Blowout 38%
        </div>
        <div style={{ background: 'rgba(255,77,79,0.05)', color: 'var(--error)', padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, border: '1px solid rgba(255,77,79,0.1)' }}>
          Hostile spot
        </div>
        <div style={{ background: 'rgba(0,207,255,0.05)', color: 'var(--blue)', padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, border: '1px solid rgba(0,207,255,0.1)' }}>
          Elite steam
        </div>
      </div>

      {/* 4 — EVIDENCE DRAWER */}
      <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: 12 }}>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          style={{
            width: '100%', background: 'transparent', border: 'none', color: 'var(--text-muted)',
            fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            marginBottom: expanded ? 12 : 0
          }}
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? 'Hide evidence' : 'Show evidence'}
        </button>

        {expanded && (
          <div className="anim-slide" style={{ display: 'flex', flexDirection: 'column', gap: 16 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Def</span>
                <span style={{ fontSize: 13, fontWeight: 900 }}>#{pick.defensiveRank || '4'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>L3</span>
                <span style={{ fontSize: 13, fontWeight: 900 }}>{pick.trendL3 || '28.0'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>L5</span>
                <span style={{ fontSize: 13, fontWeight: 900 }}>{pick.trendL5 || '27.6'}</span>
              </div>
            </div>
            <RecentFormSection 
              trend={pick.trend.slice(0, 5)} 
              line={pick.line} 
              side={pick.side} 
              market={pick.market} 
              compact
            />
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleSlip(pick);
          }}
          style={{
            flex: 1, padding: '12px', borderRadius: 12, border: 'none',
            background: isInSlip ? 'rgba(255, 77, 79, 0.1)' : 'var(--blue)',
            color: isInSlip ? 'var(--error)' : '#000',
            fontWeight: 900, fontSize: 13, cursor: 'pointer'
          }}
        >
          {isInSlip ? 'REMOVE' : 'ADD SLIP'}
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onSelect(pick);
          }}
          style={{
            padding: '12px', borderRadius: 12, border: '1px solid var(--border)',
            background: 'var(--bg-secondary)', color: 'var(--text-primary)',
            fontWeight: 800, fontSize: 13, cursor: 'pointer'
          }}
        >
          DETAILS
        </button>
      </div>
    </div>
  );
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
      <style>{`
        .rec-card-refactored:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
          border-color: var(--blue) !important;
        }
        .rec-card-refactored.is-expanded {
          background: var(--bg-elevated) !important;
        }
        @media (min-width: 769px) {
          .grid-4 {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 24px !important;
          }
        }
        @media (max-width: 768px) {
          .grid-4 {
            grid-template-columns: 1fr !important;
            padding: 0 4px !important;
          }
          .rec-card-refactored {
            padding: 16px !important;
          }
        }
      `}</style>
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
