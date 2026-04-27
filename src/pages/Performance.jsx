import React from 'react'
import { PERFORMANCE_BANDS, LEDGER_PICKS, PL_CURVE } from '../lib/data.js'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Download } from 'lucide-react'

function ConfBadge({ conf }) {
  const cls = conf==='Strong Lean'?'badge-strong':conf==='Lean'?'badge-lean':conf==='Marginal'?'badge-marginal':'badge-pass'
  return <span className={`badge ${cls}`}>{conf}</span>
}

export default function Performance() {
  
  const exportToCSV = () => {
    const headers = ["Date", "Player", "Market", "Side", "Line", "Band", "Result", "P&L"];
    const rows = LEDGER_PICKS.map(p => [
      p.date, 
      `"${p.player}"`, 
      p.market, 
      p.side, 
      p.line, 
      `"${p.band}"`, 
      p.result, 
      p.flatPL.toFixed(2)
    ]);
    
    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `geniepicks_performance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="anim-fade" style={{display:'flex',flexDirection:'column',gap:24}}>
      
      {/* Header with Responsive Controls */}
      <div style={{display:'flex', flexDirection:'column', gap:16}}>
        <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:12}}>
          <div>
            <h1 className="page-title">Model Performance</h1>
            <p className="page-sub">Training since Mar 28, 2026 · 325 picks resolved · 48.0% overall hit rate</p>
          </div>
          
          <button onClick={exportToCSV} className="btn-primary" style={{fontSize:12, padding:'10px 16px', borderRadius: 10}}>
            <Download size={16} /> Export CSV
          </button>
        </div>

        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          <select className="input-field" style={{fontSize:12, flex: 1, minWidth: 160}}>
            <option>All time · last 350 hits</option>
            <option>Last 30 days</option>
            <option>Last 7 days</option>
          </select>
          <select className="input-field" style={{fontSize:12, flex: 1, minWidth: 120}}>
            <option>All bands</option>
            <option>Strong Lean</option>
            <option>Lean</option>
          </select>
        </div>
      </div>

      {/* Live evidence card */}
      <div className="alert alert-info" style={{alignItems:'flex-start', gap:12, padding:'16px', borderRadius:14, background:'rgba(0, 207, 255, 0.05)', border:'1px solid rgba(0, 207, 255, 0.15)'}}>
        <span className="live-dot" style={{marginTop:4, flexShrink:0}}/>
        <div>
          <p style={{fontSize:13, fontWeight:700, color:'var(--blue)'}}>Live Evidence Accumulating</p>
          <p style={{fontSize:12, color:'var(--text-secondary)', marginTop:4, lineHeight:1.4}}>
            Training since Mar 28, 2026 · Model: <code style={{color:'var(--text-primary)'}}>xgb-pra-20260420-000000</code> · Market: PTS
          </p>
          <p style={{fontSize:11, color:'var(--text-muted)', marginTop:2}}>Training window: Apr 20, 2025 – Apr 19, 2026 · Val RMSE: 7.921</p>
        </div>
      </div>

      {/* Band results */}
      <div>
        <h2 style={{fontSize:14, fontWeight:900, color:'var(--text-primary)', marginBottom:12, letterSpacing:0.5}}>RESULTS BY STRENGTH BAND</h2>
        <div className="card table-wrap" style={{borderRadius:16, overflow:'hidden'}}>
          <table className="dt">
            <thead>
              <tr style={{background:'var(--bg-secondary)'}}>
                <th>BAND</th>
                <th>TOTAL</th>
                <th>HITS</th>
                <th>HIT RATE</th>
                <th>FLAT-UNIT P&L</th>
              </tr>
            </thead>
            <tbody>
              {PERFORMANCE_BANDS.map(b=>(
                <tr key={b.band}>
                  <td><ConfBadge conf={b.band}/></td>
                  <td className="mono-text" style={{fontWeight:600}}>{b.total}</td>
                  <td className="mono-text" style={{fontWeight:600, color:'var(--green)'}}>{b.hits}</td>
                  <td className="mono-text" style={{fontWeight:700, color:parseFloat(b.hitRate)>50?'var(--green)':'var(--text-secondary)'}}>{b.hitRate}</td>
                  <td className="mono-text" style={{fontWeight:800, color:b.flatPL.startsWith('+')?'var(--green)':'var(--error)'}}>{b.flatPL}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resolved picks */}
      <div>
        <h2 style={{fontSize:14, fontWeight:900, color:'var(--text-primary)', marginBottom:12, letterSpacing:0.5}}>RESOLVED PICKS</h2>
        <div className="card table-wrap" style={{borderRadius:16, overflow:'hidden'}}>
          <table className="dt">
            <thead>
              <tr style={{background:'var(--bg-secondary)'}}>
                <th>DATE</th>
                <th>PLAYER</th>
                <th>MKT</th>
                <th>SIDE</th>
                <th className="hide-mobile">BAND</th>
                <th>RESULT</th>
                <th>P&L</th>
              </tr>
            </thead>
            <tbody>
              {LEDGER_PICKS.map((p,i)=>(
                <tr key={i}>
                  <td className="mono-text" style={{fontSize:10, color:'var(--text-muted)'}}>{p.date}</td>
                  <td style={{fontWeight:700}}>{p.player}</td>
                  <td><span className="chip" style={{fontSize:9, background:'var(--bg-secondary)'}}>{p.market}</span></td>
                  <td><span className={`badge ${p.side==='OVER'?'badge-over':'badge-under'}`} style={{fontSize:9}}>{p.side}</span></td>
                  <td className="hide-mobile"><ConfBadge conf={p.band}/></td>
                  <td style={{fontWeight:900, color:p.result==='W'?'var(--green)':'var(--error)'}}>
                    {p.result==='W'?'W':'L'}
                  </td>
                  <td className="mono-text" style={{fontWeight:900, color:p.flatPL>0?'var(--green)':'var(--error)'}}>
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
        <h2 style={{fontSize:14, fontWeight:900, color:'var(--text-primary)', marginBottom:12, letterSpacing:0.5}}>CUMULATIVE P&L</h2>
        <div className="card" style={{padding:'24px', borderRadius:20, background:'var(--bg-secondary)'}}>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={PL_CURVE}>
              <XAxis dataKey="day" tick={{fontSize:10, fill:'var(--text-muted)'}} tickLine={false} axisLine={false} interval={6}/>
              <YAxis tick={{fontSize:10, fill:'var(--text-muted)'}} tickLine={false} axisLine={false}/>
              <Tooltip 
                contentStyle={{background:'rgba(28, 33, 40, 0.95)', border:'1px solid var(--border)', borderRadius:12, fontSize:12}}
                itemStyle={{fontWeight:800}}
              />
              <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4"/>
              <Line type="monotone" dataKey="pl" stroke="var(--error)" strokeWidth={3} dot={false} animationDuration={1500}/>
            </LineChart>
          </ResponsiveContainer>
          
          <div className="grid-2" style={{marginTop:20, paddingTop:20, borderTop:'1px solid var(--border-soft)'}}>
            <div style={{textAlign:'center'}}>
              <p style={{fontSize:10, color:'var(--text-muted)', fontWeight:700, letterSpacing:1}}>MAX DRAWDOWN</p>
              <p className="mono-text" style={{fontSize:20, fontWeight:900, color:'var(--error)'}}>-21.00 u</p>
            </div>
            <div style={{textAlign:'center'}}>
              <p style={{fontSize:10, color:'var(--text-muted)', fontWeight:700, letterSpacing:1}}>LOSS STREAK</p>
              <p className="mono-text" style={{fontSize:20, fontWeight:900}}>2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
