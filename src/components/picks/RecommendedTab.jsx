import React, { useState } from 'react'
import { PLAYER_PROPS } from '../../lib/data.js'
import { Zap, TrendingUp, ShieldCheck, Plus, Trash2, LayoutGrid, List } from 'lucide-react'

export default function RecommendedTab({ slip, onToggleSlip }) {
  const [view, setView] = useState('table') // 'table' as default

  // Filter for high confidence or high edge picks
  const recommendations = PLAYER_PROPS
    .filter(p => p.confidence === 'Strong Lean' || p.edge > 10)
    .sort((a, b) => b.edge - a.edge)
    .slice(0, 10);

  return (
    <div className="anim-fade" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header with View Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Zap size={18} style={{ color: 'var(--accent-gold)' }} />
          <h2 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: 0.5 }}>MODEL TOP RECOMMENDATIONS</h2>
        </div>

        <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: 12, padding: 4, border: '1px solid var(--border)' }}>
          <button 
            onClick={() => setView('cards')}
            style={{
              padding: '6px 12px', borderRadius: 8, border: 'none',
              background: view === 'cards' ? 'var(--blue)' : 'transparent',
              color: view === 'cards' ? '#000' : 'var(--text-muted)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 11, fontWeight: 700, transition: '0.2s'
            }}
          >
            <LayoutGrid size={14} /> Cards
          </button>
          <button 
            onClick={() => setView('table')}
            style={{
              padding: '6px 12px', borderRadius: 8, border: 'none',
              background: view === 'table' ? 'var(--blue)' : 'transparent',
              color: view === 'table' ? '#000' : 'var(--text-muted)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 11, fontWeight: 700, transition: '0.2s'
            }}
          >
            <List size={14} /> Table
          </button>
        </div>
      </div>

      {view === 'cards' ? (
        <div className="recommended-grid">
          <style>{`
            .recommended-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
              gap: 20px;
            }
            @media (max-width: 600px) {
              .recommended-grid {
                grid-template-columns: 1fr;
              }
            }
            .rec-card {
              background: var(--bg-card);
              border: 1px solid var(--border);
              border-radius: 20px;
              padding: 20px;
              position: relative;
              overflow: hidden;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .rec-card:hover {
              border-color: var(--blue);
              transform: translateY(-4px);
              box-shadow: var(--shadow-float);
            }
            .rec-badge {
              position: absolute;
              top: 0;
              right: 0;
              padding: 6px 12px;
              background: var(--blue-dim);
              color: var(--blue);
              font-size: 10px;
              font-weight: 900;
              border-bottom-left-radius: 12px;
              text-transform: uppercase;
            }
          `}</style>

          {recommendations.map(pick => {
            const isInSlip = slip.some(s => s.id === pick.id);
            return (
              <div key={pick.id} className="rec-card anim-fade">
                <div className="rec-badge">{pick.confidence}</div>
                
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
                  <div style={{ 
                    width: 50, height: 50, borderRadius: 15, 
                    background: 'var(--icon-bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, border: '1px solid var(--border-bright)'
                  }}>
                    👤
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>{pick.player}</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{pick.matchup}</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                  <div style={{ background: 'var(--bg-alpha-05)', padding: 12, borderRadius: 12, border: '1px solid var(--border-soft)' }}>
                    <p style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 4 }}>SELECTION</p>
                    <p style={{ fontSize: 14, fontWeight: 900 }}>
                      <span style={{ color: pick.side === 'OVER' ? 'var(--green)' : 'var(--error)' }}>{pick.side}</span> {pick.line}
                    </p>
                    <p style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>{pick.market}</p>
                  </div>
                  <div style={{ background: 'rgba(0, 207, 255, 0.05)', padding: 12, borderRadius: 12, border: '1px solid rgba(0, 207, 255, 0.1)' }}>
                    <p style={{ fontSize: 9, color: 'var(--blue)', fontWeight: 700, marginBottom: 4 }}>MODEL EDGE</p>
                    <p className="mono-text" style={{ fontSize: 18, fontWeight: 900, color: 'var(--blue)' }}>+{pick.edge.toFixed(1)}%</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <TrendingUp size={10} style={{ color: 'var(--blue)' }} />
                      <span style={{ fontSize: 9, color: 'var(--blue)', fontWeight: 700 }}>HIGH EV</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => onToggleSlip(pick)}
                  style={{
                    width: '100%', padding: '12px', borderRadius: 12,
                    border: isInSlip ? '1px solid var(--error)' : 'none',
                    background: isInSlip ? 'transparent' : 'var(--blue)',
                    color: isInSlip ? 'var(--error)' : '#000',
                    fontWeight: 800, fontSize: 13, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: '0.2s'
                  }}
                >
                  {isInSlip ? <><Trash2 size={14} /> REMOVE</> : <><Plus size={14} /> ADD TO SLIP</>}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card table-wrap anim-fade" style={{ borderRadius: 16, overflow: 'hidden' }}>
          <table className="dt">
            <thead>
              <tr style={{ background: 'var(--bg-secondary)' }}>
                <th>PLAYER</th>
                <th className="hide-mobile">MARKET</th>
                <th>SIDE</th>
                <th className="hide-mobile">PROJ</th>
                <th>EDGE</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map(pick => {
                const isInSlip = slip.some(s => s.id === pick.id);
                return (
                  <tr key={pick.id}>
                    <td>
                      <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{pick.player}</p>
                      <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{pick.matchup}</p>
                    </td>
                    <td className="hide-mobile"><span className="chip" style={{ fontSize: 9 }}>{pick.market}</span></td>
                    <td style={{ fontWeight: 800, color: pick.side === 'OVER' ? 'var(--green)' : 'var(--error)' }}>{pick.side} {pick.line}</td>
                    <td className="hide-mobile mono-text" style={{ fontSize: 12 }}>{pick.projection}</td>
                    <td className="mono-text" style={{ fontWeight: 800, color: 'var(--blue)' }}>+{pick.edge.toFixed(1)}%</td>
                    <td>
                      <button 
                        onClick={() => onToggleSlip(pick)}
                        style={{
                          padding: '6px 12px', borderRadius: 8, border: 'none',
                          background: isInSlip ? 'var(--error-dim)' : 'var(--blue-dim)',
                          color: isInSlip ? 'var(--error)' : 'var(--blue)',
                          cursor: 'pointer', fontSize: 10, fontWeight: 800,
                          display: 'flex', alignItems: 'center', gap: 4, transition: '0.2s'
                        }}
                      >
                        {isInSlip ? <Trash2 size={12} /> : <Plus size={12} />}
                        {isInSlip ? 'REMOVE' : 'ADD'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="alert alert-info" style={{ borderRadius: 16, padding: '16px 20px' }}>
        <ShieldCheck size={16} />
        <p style={{ fontSize: 12, lineHeight: 1.5 }}>
          Recommended picks are generated using our <strong>Prop-Master v2.4</strong> engine, factoring in recent player performance, defensive matchups, and sharp market movement.
        </p>
      </div>
    </div>
  )
}
