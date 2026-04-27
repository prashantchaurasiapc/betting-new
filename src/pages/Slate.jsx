import React, { useState } from 'react'
import { SLATE_STATS, GAMES } from '../lib/data.js'
import { AlertTriangle, TrendingUp, Clock, Zap, ChevronDown, ChevronUp } from 'lucide-react'

function StatCard({ label, value, sub, color }) {
  return (
    <div className="stat-block" style={{ minWidth: 140 }}>
      <span className="stat-label">{label}</span>
      <span className="stat-value" style={{ color: color || 'var(--text-primary)', textShadow: color ? `0 0 14px ${color}55` : 'none' }}>{value}</span>
      {sub && <span className="stat-sub">{sub}</span>}
    </div>
  )
}

function WinBar({ vegasWin, modelWin }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      <div style={{ display:'flex', justifyContent:'space-between' }}>
        <span style={{ fontSize:11, color:'var(--text-muted)' }}>Vegas</span>
        <span style={{ fontSize:11, fontWeight:700, color:'var(--blue)' }}>{vegasWin}%</span>
      </div>
      <div className="pbar-track">
        <div className="pbar-fill" style={{ width:`${vegasWin}%`, background:'linear-gradient(90deg,var(--blue-hover),var(--blue))' }} />
      </div>
      <div style={{ display:'flex', justifyContent:'space-between' }}>
        <span style={{ fontSize:11, color:'var(--text-muted)' }}>Model</span>
        <span style={{ fontSize:11, fontWeight:700, color:'var(--green)', textShadow:'0 0 8px rgba(0,255,136,.5)' }}>{modelWin}%</span>
      </div>
      <div className="pbar-track">
        <div className="pbar-fill" style={{ width:`${modelWin}%`, background:'linear-gradient(90deg,var(--green-hover),var(--green))' }} />
      </div>
    </div>
  )
}

function BlowoutMeter({ risk }) {
  const color = risk > 40 ? 'var(--error)' : risk > 25 ? 'var(--warning)' : 'var(--green)'
  const gradient = risk > 40 ? 'linear-gradient(90deg,#cc2020,var(--error))' : risk > 25 ? 'linear-gradient(90deg,#cc8800,var(--warning))' : 'linear-gradient(90deg,var(--green-hover),var(--green))'
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <div style={{ display:'flex', justifyContent:'space-between' }}>
        <span style={{ fontSize:11, color:'var(--text-muted)' }}>Blowout Risk</span>
        <span style={{ fontSize:11, fontWeight:700, color }}>{risk}%</span>
      </div>
      <div className="pbar-track">
        <div className="pbar-fill" style={{ width:`${risk}%`, background: gradient }} />
      </div>
      <span style={{ fontSize:10, color:'var(--text-muted)' }}>{risk > 40 ? '🔴 HIGH' : risk > 25 ? '🟡 MODERATE' : '🟢 LOW'} risk</span>
    </div>
  )
}

function GameCard({ game }) {
  const [expanded, setExpanded] = useState(false)
  const totalDiff = (game.modelTotal - game.vegasTotal).toFixed(1)
  const modelAdv = game.modelHomeWin - game.vegasHomeWin

  return (
    <div className="card anim-slide">
      {/* Header */}
      <div style={{ padding:'16px', borderBottom:'1px solid var(--border)', display:'flex', flexWrap:'wrap', gap:16, alignItems:'center', justifyContent:'space-between' }}>
        {/* Teams */}
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#1d3461,#3b82f6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:900, color:'#fff' }}>
                {game.awayCode}
              </div>
              <div>
                <p style={{ fontSize:13, fontWeight:600, color:'var(--text-secondary)' }}>{game.awayTeam}</p>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#065f46,#00d4a1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:900, color:'#000' }}>
                {game.homeCode}
              </div>
              <div>
                <p style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{game.homeTeam}</p>
              </div>
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'0 16px', borderLeft:'1px solid var(--border)', borderRight:'1px solid var(--border)' }}>
            <span style={{ fontSize:12, fontWeight:700, color:'var(--accent-gold)' }}>VS</span>
            <span style={{ fontSize:11, color:'var(--text-muted)', marginTop:4, display:'flex', alignItems:'center', gap:3 }}>
              <Clock size={10} /> {game.time}
            </span>
          </div>
        </div>

        {/* Key stats */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:16, alignItems:'center' }}>
          {[
            { label:'Spread', val: game.spread > 0 ? `+${game.spread}` : `${game.spread}`, color:'var(--text-primary)' },
            { label:'Vegas O/U', val: game.vegasTotal, color:'var(--text-primary)' },
            { label:'Model O/U', val: `${game.modelTotal} (${Number(totalDiff)>0?'+':''}${totalDiff})`, color: Number(totalDiff)>0?'var(--green)':'var(--error)' },
            { label:'Pace', val: game.paceValue, color:'var(--text-primary)' },
            { label:'Inj. Impact', val: game.injuryImpact, color: game.injuryImpact>3?'var(--error)':'var(--warning)' },
            { label:'Total Picks', val: game.homePicks+game.awayPicks, color:'var(--blue)' },
          ].map(s => (
            <div key={s.label} style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
              <span style={{ fontSize:10, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'.06em' }}>{s.label}</span>
              <span style={{ fontSize:14, fontWeight:700, color:s.color, marginTop:3 }}>{s.val}</span>
            </div>
          ))}
        </div>

        {/* Best bet */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}>
          <span style={{ fontSize:10, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'.06em' }}>Best Bet</span>
          <button className="btn-primary" style={{ fontSize:12, padding:'6px 14px' }}>{game.bestBet}</button>
        </div>
      </div>

      {/* Win bars + Blowout + Injuries */}
      <div style={{ padding:'14px 16px', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:16 }}>
        <WinBar vegasWin={game.vegasHomeWin} modelWin={game.modelHomeWin} />
        <BlowoutMeter risk={game.blowoutRisk} />
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {[...game.injuries.home, ...game.injuries.away].slice(0,3).map((inj,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span className={`chip ${inj.status==='OUT'?'chip-against':'chip-tough'}`}>{inj.status}</span>
              <span style={{ fontSize:12, color:'var(--text-secondary)', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{inj.player}</span>
              <span style={{ fontSize:10, color:'var(--text-muted)', flexShrink:0 }}>{inj.impact}</span>
            </div>
          ))}
          {game.injuries.home.length === 0 && game.injuries.away.length === 0 && (
            <span style={{ fontSize:12, color:'var(--accent-green)' }}>✓ No major injuries</span>
          )}
        </div>
      </div>

      {/* Model edge note */}
      {modelAdv !== 0 && (
        <div style={{ padding:'0 16px 10px' }}>
          <div className="alert" style={{
            background: modelAdv>0?'rgba(0,255,136,.06)':'rgba(255,77,79,.06)',
            border:`1px solid ${modelAdv>0?'rgba(0,255,136,.22)':'rgba(255,77,79,.22)'}`,
            color: modelAdv>0?'var(--green)':'var(--error)',
          }}>
            <Zap size={11} />
            Model {modelAdv>0?'favors':'fades'} {game.homeCode} by {Math.abs(modelAdv)}% vs Vegas line
          </div>
        </div>
      )}

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:6,
          padding:'10px', borderTop:'1px solid var(--border)', background:'transparent',
          border:'none', borderTop:'1px solid var(--border)', cursor:'pointer',
          fontSize:12, color: expanded?'var(--accent-blue)':'var(--text-muted)',
          fontFamily:'inherit', transition:'color .2s'
        }}
      >
        {expanded ? <><ChevronUp size={14}/> Hide Details</> : <><ChevronDown size={14}/> Expand Details</>}
      </button>

      {/* Expanded */}
      {expanded && (
        <div style={{ padding:'16px', borderTop:'1px solid var(--border)' }} className="anim-fade">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12 }}>
            {[
              { label:'Last 10 Matchups', val:game.last10, color:'var(--text-primary)' },
              { label:'Rest Advantage', val:game.restAdvantage, color:'var(--gold)' },
              { label:`ATS ${game.homeCode}`, val:game.atsRecord.home, color:'var(--text-primary)' },
              { label:'Pace Rating', val:`${game.paceRating} (${game.paceValue})`, color:'var(--blue)' },
              { label:`Off Rtg ${game.homeCode}`, val:game.offRtg.home, color:'var(--green)' },
              { label:`Off Rtg ${game.awayCode}`, val:game.offRtg.away, color:'var(--text-secondary)' },
              { label:`Def Rtg ${game.homeCode}`, val:game.defRtg.home, color:'var(--error)' },
              { label:`Def Rtg ${game.awayCode}`, val:game.defRtg.away, color:'var(--text-secondary)' },
            ].map(s => (
              <div key={s.label} style={{ background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:8, padding:'10px 12px' }}>
                <p style={{ fontSize:10, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:4 }}>{s.label}</p>
                <p style={{ fontSize:14, fontWeight:700, color:s.color }}>{s.val}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Slate() {
  const s = SLATE_STATS
  const [filter, setFilter] = useState('All Games')

  const filteredGames = GAMES.filter(game => {
    if (filter === 'All Games') return true
    if (filter === 'Best Bets') return !!game.bestBet
    if (filter === 'High Edge') return Math.abs(game.modelHomeWin - game.vegasHomeWin) >= 4
    if (filter === 'Late Slate') return game.time.includes('9:') || game.time.includes('10:')
    if (filter === 'Injuries') return game.injuries.home.length > 0 || game.injuries.away.length > 0
    return true
  })

  return (
    <div className="anim-fade">
      {/* Page header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:12, marginBottom:20 }}>
        <div>
          <h1 className="page-title">Today's Slate</h1>
          <p className="page-sub">{s.date} · NBA · Updated {s.lastUpdated}</p>
        </div>
        <span style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span className="live-dot" />
          <span style={{ fontSize:11, fontWeight:700, color:'var(--accent-green)' }}>LIVE DATA</span>
        </span>
      </div>

      {/* Stats strip */}
      <div className="stats-strip">
        <StatCard label="Total Games"   value={s.totalGames}      sub="NBA today"          />
        <StatCard label="Best Edge"     value={s.bestEdge}        sub="vs market"          color="var(--green)" />
        <StatCard label="Top Pick"      value="SGA"               sub="PTS Under 27.5"     color="var(--blue)" />
        <StatCard label="Injury Alerts" value={s.injuryAlerts}    sub="players affected"   color="var(--error)" />
        <StatCard label="Last Updated"  value={s.lastUpdated}     sub="auto-refresh 30s"   />
        <StatCard label="Total Picks"   value="122"               sub="across all games"   color="var(--gold)" />
      </div>

      {/* Alert banners */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:20 }}>
        <div className="alert alert-injury"><AlertTriangle size={12}/> Trae Young OUT — ATL vs NYK</div>
        <div className="alert alert-sharp"><Zap size={12}/> Sharp steam: SGA PTS line moved -0.98 units</div>
        <div className="alert alert-movement"><TrendingUp size={12}/> Line move: Anthony Edwards PRA -4.0 units</div>
      </div>

      {/* Action filter bar */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:20, paddingBottom:14, borderBottom:'1px solid var(--border)' }}>
        {['All Games','Best Bets','High Edge','Late Slate','Injuries'].map((btn) => (
          <button 
            key={btn} 
            onClick={() => setFilter(btn)}
            className={`chip-btn${filter === btn ? ' active' : ''}`}
          >
            {btn}
          </button>
        ))}
      </div>

      {/* Game cards */}
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {filteredGames.length > 0 ? (
          filteredGames.map(game => <GameCard key={game.id} game={game} />)
        ) : (
          <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
            No games match the "{filter}" criteria.
          </div>
        )}
      </div>
    </div>
  )
}
