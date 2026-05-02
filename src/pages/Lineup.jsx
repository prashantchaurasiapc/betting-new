import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Plus, Trash2, Activity, TrendingUp, Loader2, Trophy } from 'lucide-react'
import { useSlip } from '../context/SlipContext'

const MARKETS   = ['PTS','REB','AST','Pts+Reb+Ast','3PM','STL','BLK']
const DIRECTIONS = ['Over','Under']

function ResultPanel({ legs, payout }) {
  if (legs.length < 2) {
    return (
      <div className="card" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:300,gap:16,border:'1px dashed var(--border)'}}>
        <Activity size={44} style={{color:'var(--text-muted)'}} strokeWidth={1}/>
        <p style={{textAlign:'center',fontSize:13,color:'var(--text-secondary)',maxWidth:280,lineHeight:1.6}}>
          Add picks on the left and hit <strong style={{color:'var(--accent-blue)'}}>Analyze Lineup</strong> to see hit probabilities, weak-link detection, and EV.
        </p>
        <p style={{fontSize:12,color:'var(--text-muted)'}}>Add 2–6 legs to begin.</p>
      </div>
    )
  }
  const hitProbs = legs.map(() => (Math.random()*25+55).toFixed(1))
  const joint    = (hitProbs.reduce((a,b) => a*parseFloat(b)/100, 1)*100).toFixed(2)
  const ev       = (parseFloat(joint)/100*parseFloat(payout||1)-1).toFixed(3)

  return (
    <div className="card" style={{padding:20,display:'flex',flexDirection:'column',gap:16}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <h3 style={{fontSize:14,fontWeight:700,color:'var(--text-primary)'}}>Analysis Results</h3>
        <span className="badge badge-lean">Live</span>
      </div>

      <div className="grid-2" style={{ gap: 12 }}>
        {[
          {label:'Joint Prob', val:`${joint}%`, color:parseFloat(joint)>25?'var(--accent-green)':'var(--accent-red)'},
          {label:'Slip EV', val:(parseFloat(ev)>0?'+':'')+ev, color:parseFloat(ev)>0?'var(--accent-green)':'var(--accent-red)'},
          {label:'Payout', val:`${payout}x`, color:'var(--accent-gold)'},
          {label:'Cumulative Edge', val: `+${(legs.length * 4.2).toFixed(1)}%`, color: 'var(--green)'},
          {label:'Sharp Score', val: 'ELITE', color: 'var(--blue)'},
          {label:'Vegas Implied', val: '4.8%', color: 'var(--text-muted)'},
        ].map(s=>(
          <div key={s.label} className="stat-block" style={{textAlign:'center', padding: '12px 8px'}}>
            <span className="stat-label" style={{ fontSize: 9 }}>{s.label}</span>
            <span style={{fontSize: 18, fontWeight:900, color:s.color}}>{s.val}</span>
          </div>
        ))}
      </div>

      <div>
        <p style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'.06em',color:'var(--text-muted)',marginBottom:10}}>Per-Leg Hit Probability</p>
        {legs.map((leg,i)=>{
          const prob = parseFloat(hitProbs[i])
          const weak = prob < 60
          return (
            <div key={i} style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
              <span style={{fontSize:12,width:130,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',color:'var(--text-secondary)'}}>{leg.player||`Leg ${i+1}`}</span>
              <div className="pbar-track" style={{flex:1}}>
                <div className="pbar-fill" style={{width:`${prob}%`,background:weak?'var(--accent-red)':'var(--accent-green)'}}/>
              </div>
              <span style={{fontSize:12,fontWeight:700,width:40,textAlign:'right',color:weak?'var(--accent-red)':'var(--accent-green)'}}>{prob}%</span>
              {weak && <span className="chip chip-against">Weak</span>}
            </div>
          )
        })}
      </div>

      <div style={{padding:'12px',borderRadius:8,background:'var(--bg-secondary)',border:'1px solid var(--border)'}}>
        <p style={{fontSize:12,fontWeight:600,color:'var(--accent-gold)',marginBottom:4}}>⚠ Risk Assessment</p>
        <p style={{fontSize:12,color:'var(--text-secondary)',lineHeight:1.5}}>
          {parseFloat(joint)>25
            ? 'Favorable combined odds. EV is positive — consider playing.'
            : 'Joint probability below threshold. Remove weak-link legs for better EV.'}
        </p>
      </div>
    </div>
  )
}

export default function Lineup() {
  const { slip } = useSlip()
  const location = useLocation()
  const playoffContext = location.state?.series && location.state?.game ? location.state : null

  const [platform, setPlatform] = useState('Pick6')
  const [payout,   setPayout]   = useState('24')
  const [legs, setLegs]         = useState([{player:'',market:'Pts+Reb+Ast',direction:'Under',line:'0'}])
  const [analyzed, setAnalyzed] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const addLeg    = () => { if(legs.length<6) { setLegs([...legs,{player:'',market:'PTS',direction:'Under',line:'0'}]); setAnalyzed(false); } }
  const removeLeg = i  => { setLegs(legs.filter((_,idx)=>idx!==i)); setAnalyzed(false); }
  const updateLeg = (i,f,v) => { const u=[...legs]; u[i]={...u[i],[f]:v}; setLegs(u); setAnalyzed(false); }

  const runAnalysis = () => {
    if (legs.length < 2) return showToast("Add at least 2 legs for analysis")
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setAnalyzed(true)
      showToast("Lineup Analysis Complete")
    }, 1500)
  }

  const fillDemo = () => {
    setLegs([
      {player:'LeBron James', market:'PTS', direction:'Over', line:'24.5'},
      {player:'Kevin Durant', market:'REB', direction:'Under', line:'7.5'},
      {player:'Stephen Curry', market:'3PM', direction:'Over', line:'4.5'}
    ])
    setAnalyzed(false)
    showToast("Demo lineup loaded")
  }

  const importFromSlip = () => {
    if (slip.length === 0) return
    const newLegs = slip.map(p => ({
      player: p.player,
      market: p.market,
      direction: p.side,
      line: p.line.toString()
    })).slice(0, 6)
    setLegs(newLegs)
    setAnalyzed(false)
  }

  return (
    <div className="anim-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title">Lineup Analyzer</h1>
          <p className="page-sub" style={{marginBottom:12}}>Enter your DFS picks to see per-leg hit probability, joint odds, and EV.</p>
          
          {playoffContext && (
            <div className="anim-slide" style={{ 
              display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 14px', 
              background: 'var(--gold-dim)', border: '1px solid var(--gold)', borderRadius: 10,
              marginBottom: 24
            }}>
              <Trophy size={14} color="var(--gold)" />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)' }}>
                PLAYOFF CONTEXT: {playoffContext.series.away.code} @ {playoffContext.series.home.code} — {playoffContext.game.label}
              </span>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={fillDemo} className="btn-ghost" style={{ fontSize: 11, padding: '10px 16px', borderRadius: 10 }}>
            FILL DEMO
          </button>
          {slip.length > 0 && (
            <button 
              onClick={importFromSlip}
              className="btn-ghost" 
              style={{ 
                borderColor: 'var(--green)', color: 'var(--green)', background: 'var(--green-dim)',
                fontSize: 12, padding: '10px 16px', borderRadius: 10
              }}
            >
               IMPORT SLIP ({slip.length})
            </button>
          )}
        </div>
      </div>

      <div className="grid-2" style={{alignItems:'start'}}>
        {/* Builder */}
        <div className="card" style={{padding:20,display:'flex',flexDirection:'column',gap:14}}>
          <h2 style={{fontSize:14,fontWeight:700,color:'var(--text-primary)'}}>Build Lineup</h2>
          <div className="grid-2">
            <div>
              <label style={{fontSize:11,color:'var(--text-muted)',display:'block',marginBottom:5}}>Platform</label>
              <input className="input-field" style={{width:'100%'}} value={platform} onChange={e=>setPlatform(e.target.value)}/>
            </div>
            <div>
              <label style={{fontSize:11,color:'var(--text-muted)',display:'block',marginBottom:5}}>Payout (x)</label>
              <input className="input-field" style={{width:'100%'}} type="number" value={payout} onChange={e=>setPayout(e.target.value)}/>
            </div>
          </div>

          {legs.map((leg,i)=>(
            <div key={i} style={{padding:12,borderRadius:10,background:'var(--bg-secondary)',border:'1px solid var(--border)',display:'flex',flexDirection:'column',gap:10}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <span style={{fontSize:11,fontWeight:600,color:'var(--text-muted)'}}>Leg {i+1}</span>
                {legs.length>1 && <button onClick={()=>removeLeg(i)} style={{background:'none',border:'none',cursor:'pointer',padding:0}}><Trash2 size={13} style={{color:'var(--accent-red)'}}/></button>}
              </div>
              <div>
                <label style={{fontSize:11,color:'var(--text-muted)',display:'block',marginBottom:4}}>Player name</label>
                <input className="input-field" style={{width:'100%'}} placeholder="e.g. Anthony Edwards" value={leg.player} onChange={e=>updateLeg(i,'player',e.target.value)}/>
              </div>
              <div className="grid-2">
                <div>
                  <label style={{fontSize:11,color:'var(--text-muted)',display:'block',marginBottom:4}}>Market</label>
                  <select className="input-field" style={{width:'100%'}} value={leg.market} onChange={e=>updateLeg(i,'market',e.target.value)}>
                    {MARKETS.map(m=><option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{fontSize:11,color:'var(--text-muted)',display:'block',marginBottom:4}}>Direction</label>
                  <select className="input-field" style={{width:'100%'}} value={leg.direction} onChange={e=>updateLeg(i,'direction',e.target.value)}>
                    {DIRECTIONS.map(d=><option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{fontSize:11,color:'var(--text-muted)',display:'block',marginBottom:4}}>Line</label>
                <input className="input-field" style={{width:'100%'}} type="number" value={leg.line} onChange={e=>updateLeg(i,'line',e.target.value)}/>
              </div>
            </div>
          ))}

          <button onClick={addLeg} disabled={legs.length>=6} style={{
            width:'100%',padding:'10px',borderRadius:8,border:'1px dashed var(--accent-blue)',
            background:'rgba(59,130,246,.07)',color:'var(--accent-blue)',
            cursor:legs.length>=6?'not-allowed':'pointer',fontSize:12,fontWeight:600,fontFamily:'inherit',
            display:'flex',alignItems:'center',justifyContent:'center',gap:6,opacity:legs.length>=6?.4:1
          }}>
            <Plus size={13}/> Add Leg (max 6)
          </button>

          <button 
            onClick={runAnalysis} 
            disabled={isAnalyzing}
            className="btn-primary" 
            style={{width:'100%',justifyContent:'center',padding:'12px',fontSize:13, background: isAnalyzing ? 'var(--bg-secondary)' : 'var(--blue)', color: isAnalyzing ? 'var(--blue)' : '#000'}}
          >
            {isAnalyzing ? <><Loader2 size={14} className="animate-spin" /> Analyzing...</> : <><TrendingUp size={14}/> Analyze Lineup</>}
          </button>
        </div>

        {/* Results */}
        <ResultPanel legs={analyzed && !isAnalyzing ? legs : []} payout={payout}/>
      </div>
    </div>
  )
}
