import React from 'react'
import { PERFORMANCE_BANDS, LEDGER_PICKS, PL_CURVE } from '../lib/data.js'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

function ConfBadge({ conf }) {
  const cls = conf==='Strong Lean'?'badge-strong':conf==='Lean'?'badge-lean':conf==='Marginal'?'badge-marginal':'badge-pass'
  return <span className={`badge ${cls}`}>{conf}</span>
}

export default function Performance() {
  return (
    <div className="anim-fade" style={{display:'flex',flexDirection:'column',gap:24}}>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
        <div>
          <h1 className="page-title">Model Performance</h1>
          <p className="page-sub">Training since Mar 28, 2026 · 325 picks resolved · 48.0% overall hit rate</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <select className="input-field" style={{fontSize:12}}>
            <option>All time · last 350 hits</option>
            <option>Last 30 days</option>
            <option>Last 7 days</option>
          </select>
          <select className="input-field" style={{fontSize:12}}>
            <option>All bands</option>
            <option>Strong Lean</option>
            <option>Lean</option>
          </select>
          <button className="btn-primary" style={{fontSize:12,padding:'7px 14px'}}>Export CSV</button>
        </div>
      </div>

      {/* Live evidence */}
      <div className="alert alert-info" style={{alignItems:'flex-start',gap:12,padding:'12px 16px',borderRadius:10}}>
        <span className="live-dot" style={{marginTop:2,flexShrink:0}}/>
        <div>
          <p style={{fontSize:12,fontWeight:600,color:'var(--accent-blue)'}}>Live Evidence Accumulating</p>
          <p style={{fontSize:12,color:'var(--text-secondary)',marginTop:3}}>Training since Mar 28, 2026 · Model: xgb-pra-20260420-000000 · Market: PTS – Points</p>
          <p style={{fontSize:11,color:'var(--text-muted)',marginTop:2}}>Training window: Apr 20, 2025 – Apr 19, 2026 · Val RMSE: 7.921</p>
        </div>
      </div>

      {/* Band results */}
      <div>
        <h2 style={{fontSize:14,fontWeight:700,color:'var(--text-primary)',marginBottom:12}}>Results by Strength Band</h2>
        <div className="card table-wrap">
          <table className="dt">
            <thead><tr><th>Band</th><th>Total</th><th>Hits</th><th>Hit Rate</th><th>Flat-unit P&amp;L</th></tr></thead>
            <tbody>
              {PERFORMANCE_BANDS.map(b=>(
                <tr key={b.band}>
                  <td><ConfBadge conf={b.band}/></td>
                  <td style={{fontWeight:600,color:'var(--text-primary)'}}>{b.total}</td>
                  <td style={{fontWeight:600,color:'var(--accent-green)'}}>{b.hits}</td>
                  <td style={{fontWeight:700,color:parseFloat(b.hitRate)>50?'var(--accent-green)':'var(--text-secondary)'}}>{b.hitRate}</td>
                  <td style={{fontWeight:700,color:b.flatPL.startsWith('+')?'var(--accent-green)':'var(--accent-red)'}}>{b.flatPL}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resolved picks */}
      <div>
        <h2 style={{fontSize:14,fontWeight:700,color:'var(--text-primary)',marginBottom:12}}>Resolved Picks</h2>
        <div className="card table-wrap">
          <table className="dt">
            <thead><tr><th>Pick date</th><th>Player</th><th>Mkt</th><th>Side</th><th>Line</th><th>Band</th><th>Result</th><th>P&amp;L</th></tr></thead>
            <tbody>
              {LEDGER_PICKS.map((p,i)=>(
                <tr key={i}>
                  <td style={{fontFamily:'monospace',fontSize:11,color:'var(--text-muted)'}}>{p.date}</td>
                  <td style={{fontWeight:600,color:'var(--text-primary)'}}>{p.player}</td>
                  <td><span className="chip chip-market">{p.market}</span></td>
                  <td><span className={`badge ${p.side==='OVER'?'badge-over':'badge-under'}`}>{p.side}</span></td>
                  <td style={{color:'var(--text-secondary)'}}>{p.line}</td>
                  <td><ConfBadge conf={p.band}/></td>
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
      </div>

      {/* P&L Chart */}
      <div>
        <h2 style={{fontSize:14,fontWeight:700,color:'var(--text-primary)',marginBottom:12}}>Cumulative Flat-Unit P&amp;L</h2>
        <div className="card" style={{padding:'20px 16px'}}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={PL_CURVE} margin={{top:5,right:10,left:-20,bottom:5}}>
              <XAxis dataKey="day" tick={{fontSize:10,fill:'var(--text-muted)'}} tickLine={false} axisLine={false} interval={6}/>
              <YAxis tick={{fontSize:10,fill:'var(--text-muted)'}} tickLine={false} axisLine={false}/>
              <Tooltip contentStyle={{background:'var(--bg-elevated)',border:'1px solid var(--border)',borderRadius:8,fontSize:12,color:'var(--text-primary)'}}/>
              <ReferenceLine y={0} stroke="var(--border-bright)" strokeDasharray="3 3"/>
              <Line type="monotone" dataKey="pl" stroke="var(--accent-red)" strokeWidth={2} dot={false}/>
            </LineChart>
          </ResponsiveContainer>
          <div className="grid-2" style={{marginTop:12,paddingTop:12,borderTop:'1px solid var(--border)'}}>
            <div>
              <p style={{fontSize:11,color:'var(--text-muted)'}}>Max Drawdown</p>
              <p style={{fontSize:16,fontWeight:700,color:'var(--accent-red)'}}>-21.00 u</p>
            </div>
            <div>
              <p style={{fontSize:11,color:'var(--text-muted)'}}>Longest Loss Streak</p>
              <p style={{fontSize:16,fontWeight:700,color:'var(--text-primary)'}}>2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
