import React from 'react'
import { Trash2, ShieldCheck, AlertCircle, Info, CheckSquare, Square } from 'lucide-react'

export default function PPSlipTab({ slip, onRemove }) {
  if (slip.length === 0) {
    return (
      <div className="card anim-fade" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ 
          width: 64, height: 64, borderRadius: '50%', background: 'var(--bg-elevated)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' 
        }}>
          <ShieldCheck size={32} style={{ color: 'var(--text-muted)' }} />
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Your Slip is Empty</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, maxWidth: 300, margin: '0 auto' }}>
          Go to Top Picks and add some projections to build your entry.
        </p>
      </div>
    )
  }

  const getMarketColor = (m) => {
    switch (m) {
      case 'REB': return 'var(--green)';
      case 'AST': return 'var(--blue)';
      case 'PTS': return 'var(--warning)';
      case 'PRA': return '#818cf8';
      default: return 'var(--text-muted)';
    }
  }

  return (
    <div className="anim-fade">
      {/* PP Slip Header Section */}
      <div style={{ marginBottom: 24, borderBottom: '1px solid var(--border-soft)', paddingBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <h1 style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.5px' }}>PP Slip Builder</h1>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-elevated)', padding: '2px 8px', borderRadius: 4 }}>
            Covering {slip.length} players on today's PrizePicks slate
          </span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>
          Sweet-spot edges (±3-4% plus vs PP line) — 64% historical hit rate — REFUND first (72%)
        </p>
        
        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--text-muted)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)' }} /> Green border = top composite score
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--text-muted)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--warning)' }} /> Orange border = back-to-back game
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--text-muted)' }}>
            <Info size={10} /> Opponent defense grade for this market
          </div>
        </div>
      </div>

      {/* Slip List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {slip.map(p => (
          <div key={p.id} className="card" style={{ 
            padding: '12px 16px', 
            display: 'grid', 
            gridTemplateColumns: '40px 60px 1fr 120px', 
            alignItems: 'center',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-soft)',
            borderRadius: 12,
            transition: 'all 0.2s'
          }}>
            {/* Checkbox & Score */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <CheckSquare size={18} style={{ color: 'var(--blue)' }} />
              <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)' }}>{Math.round(p.score || 0)}</span>
            </div>

            {/* Market Badge */}
            <div style={{ paddingLeft: 4 }}>
              <div style={{ 
                width: 44, height: 24, borderRadius: 4, 
                background: `${getMarketColor(p.market)}15`, 
                border: `1px solid ${getMarketColor(p.market)}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 900, color: getMarketColor(p.market)
              }}>
                {p.market}
              </div>
            </div>

            {/* Player Info & Stats Row */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingLeft: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 800 }}>{p.player}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.matchup || p.team}</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ display: 'flex', gap: 8, fontSize: 11 }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>PP <span style={{ color: 'var(--text-primary)' }}>{p.line}</span></span>
                  <span style={{ color: p.side === 'OVER' ? 'var(--green)' : 'var(--error)', fontWeight: 800 }}>L {p.side}</span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>PROJ <span style={{ color: 'var(--blue)' }}>{p.projection}</span></span>
                </div>
                
                {/* Tags */}
                <div style={{ display: 'flex', gap: 6 }}>
                  {p.sharp === 'Sharp' && <span style={{ fontSize: 9, color: 'var(--green)', background: 'var(--green-dim)', padding: '1px 6px', borderRadius: 3, border: '1px solid var(--green-dim)' }}>Elite</span>}
                  <span style={{ fontSize: 9, color: 'var(--warning)', background: 'var(--gold-dim)', padding: '1px 6px', borderRadius: 3 }}>Hot</span>
                  <span style={{ fontSize: 9, color: 'var(--text-muted)', background: 'var(--bg-elevated)', padding: '1px 6px', borderRadius: 3 }}>HOME</span>
                  {p.difficulty === 'TOUGH' && <span style={{ fontSize: 9, color: 'var(--error)', background: 'rgba(255,77,79,0.1)', padding: '1px 6px', borderRadius: 3 }}>Tough</span>}
                </div>
              </div>
            </div>

            {/* Edge & Action */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: p.edge > 0 ? 'var(--green)' : 'var(--error)' }}>
                {p.edge > 0 ? '+' : ''}{p.edge.toFixed(1)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className={`badge ${p.confidence === 'Strong Lean' ? 'badge-strong' : 'badge-lean'}`} style={{ fontSize: 9, padding: '2px 6px' }}>
                    {p.confidence}
                  </span>
                  <button 
                    onClick={() => onRemove(p.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div style={{ fontSize: 8, fontWeight: 800, color: 'var(--blue)', background: 'var(--blue-dim)', padding: '1px 4px', borderRadius: 2 }}>
                  PP
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Bottom Action */}
      <div style={{ 
        marginTop: 32, padding: 20, borderRadius: 16, 
        background: 'linear-gradient(90deg, var(--bg-secondary), var(--bg-elevated))',
        border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Consensus Edge</p>
          <p style={{ fontSize: 18, fontWeight: 900, color: 'var(--green)' }}>
            +{(slip.reduce((a, b) => a + b.edge, 0) / slip.length).toFixed(1)}% Avg
          </p>
        </div>
        <button className="btn-primary" style={{ padding: '12px 24px' }}>
          COPY SLIP TO PRIZEPICKS
        </button>
      </div>
    </div>
  )
}
