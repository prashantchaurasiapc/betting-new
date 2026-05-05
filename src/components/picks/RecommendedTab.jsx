import React, { useState } from 'react'
import { PLAYER_PROPS } from '../../lib/data.js'
import { Zap, TrendingUp, ShieldCheck, Plus, Trash2, LayoutGrid, List, ChevronUp, ChevronDown, Activity, AlertCircle } from 'lucide-react'
import { useGame } from '../../context/GameContext'

import { RecentFormSection, OpponentHistorySection, ContextSummaryGrid, ConfidenceDistribution, SignalStrengthItem } from './AnalyticsSections'

function RecommendedCard({ pick, slip, onToggleSlip }) {
  const [expanded, setExpanded] = useState(false);
  const isInSlip = slip.some(s => s.id === pick.id);
  const opponent = pick.matchup.split(' vs ').find(t => t !== pick.team);

  const confidenceClass = pick.confidence.toLowerCase().replace(' ', '-');
  const isUnder = pick.side === 'UNDER';
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
        gap: 24
      }}
    >
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-primary)', marginBottom: 4 }}>{pick.player}</h3>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>
            {pick.market} {pick.side} {pick.line}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <div className={`badge badge-${confidenceClass}`} style={{ padding: '4px 12px', fontSize: 10, borderRadius: 8, fontWeight: 900 }}>
            {pick.confidence.toUpperCase()}
          </div>
          {pick.isCorrelated && (
            <div className="chip chip-sharp" style={{ fontSize: 9, padding: '2px 8px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
              + CORRELATED
            </div>
          )}
        </div>
      </div>

      {/* 1 — DECISION ROW (TOP PRIORITY) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr 1.2fr', 
        gap: 16, 
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 16,
        border: '1px solid var(--border-soft)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Line</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)' }}>{pick.line}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Projection</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: edgeColor }}>{pick.projection.toFixed(1)}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Edge</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: edgeColor }}>{pick.edge > 0 ? '+' : ''}{pick.edge.toFixed(0)}%</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Prob. {pick.side}</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--blue)', lineHeight: 1 }}>68%</span>
            <div style={{ width: '100%', height: 4, background: 'var(--bg-alpha-10)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: '68%', height: '100%', background: 'var(--blue)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 2 — DRIVER ROW (WHY FACTORS) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Defensive pressure</span>
            <div style={{ flex: 1, height: 4, background: 'var(--bg-alpha-10)', margin: '0 12px', borderRadius: 2, position: 'relative' }}>
              <div style={{ position: 'absolute', right: '15%', width: '60%', height: '100%', background: 'var(--error)', opacity: 0.6 }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--error)' }}>-1.4</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Injury impact</span>
            <div style={{ flex: 1, height: 4, background: 'var(--bg-alpha-10)', margin: '0 12px', borderRadius: 2, position: 'relative' }}>
              <div style={{ position: 'absolute', left: '20%', width: '40%', height: '100%', background: 'var(--green)', opacity: 0.6 }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--green)' }}>+0.8</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Blowout risk</span>
            <div style={{ flex: 1, height: 4, background: 'var(--bg-alpha-10)', margin: '0 12px', borderRadius: 2, position: 'relative' }}>
              <div style={{ position: 'absolute', right: '10%', width: '45%', height: '100%', background: 'var(--error)', opacity: 0.6 }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--error)' }}>-0.5</span>
          </div>
        </div>
      </div>

      {/* 3 — RISK ROW (SEPARATED TAGS) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ background: 'var(--gold-dim)', color: 'var(--gold)', padding: '6px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700, border: '1px solid rgba(212,175,55,0.2)' }}>
          Blowout risk 38%
        </div>
        <div style={{ background: 'rgba(255,77,79,0.1)', color: 'var(--error)', padding: '6px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700, border: '1px solid rgba(255,77,79,0.2)' }}>
          Hostile spot
        </div>
        <div style={{ background: 'rgba(0,207,255,0.1)', color: 'var(--blue)', padding: '6px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700, border: '1px solid rgba(0,207,255,0.2)' }}>
          Elite steam
        </div>
      </div>

      {/* EVIDENCE DRAWER (COLLAPSED BY DEFAULT) */}
      <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: 16 }}>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: expanded ? 20 : 0
          }}
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {expanded ? 'Hide evidence' : 'Show evidence'}
        </button>

        {expanded && (
          <div className="anim-slide" style={{ display: 'flex', flexDirection: 'column', gap: 24 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Def Rank</span>
                <span style={{ fontSize: 15, fontWeight: 900 }}>#{pick.defensiveRank || '4'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>L3 Avg</span>
                <span style={{ fontSize: 15, fontWeight: 900 }}>{pick.trendL3?.toFixed(1) || '28.0'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>L5 Avg</span>
                <span style={{ fontSize: 15, fontWeight: 900 }}>{pick.trendL5?.toFixed(1) || '27.6'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 900, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Recent Form — 4/10 {pick.side}s Hit
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>AVG 27.6</span>
              </div>
              <RecentFormSection 
                trend={pick.trend} 
                line={pick.line} 
                side={pick.side} 
                market={pick.market} 
                compact
              />
            </div>

            <OpponentHistorySection 
              history={pick.opponentHistory} 
              line={pick.line} 
              side={pick.side} 
              market={pick.market} 
              opponent={opponent}
              compact
            />
          </div>
        )}
      </div>

      {/* ACTION BUTTON (ALWAYS VISIBLE) */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onToggleSlip(pick);
        }}
        style={{
          width: '100%', padding: '16px', borderRadius: 16,
          border: 'none',
          background: isInSlip ? 'rgba(255, 77, 79, 0.15)' : 'var(--blue)',
          color: isInSlip ? 'var(--error)' : '#000',
          fontWeight: 900, fontSize: 15, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: '0.2s',
          marginTop: 'auto'
        }}
      >
        {isInSlip ? <><Trash2 size={18} /> REMOVE FROM SLIP</> : <><Plus size={18} /> ADD TO SLIP</>}
      </button>
    </div>
  );
}

export default function RecommendedTab({ slip, onToggleSlip }) {
  const { activeGame } = useGame();
  const [view, setView] = useState('table')

  const recommendations = PLAYER_PROPS
    .filter(p => {
      // High confidence or high edge
      const isGoodPick = p.confidence === 'Strong Lean' || p.edge > 10;
      
      // Filter by Active Game Context if set
      if (activeGame && activeGame.contextFilters?.seriesCode) {
        const codes = activeGame.contextFilters.seriesCode.split(/[@|\s|v|s|-]+/).filter(Boolean);
        return isGoodPick && codes.some(code => p.matchup.includes(code));
      }
      
      return isGoodPick;
    })
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
              grid-template-columns: repeat(2, 1fr);
              gap: 24px;
            }
            @media (max-width: 768px) {
              .recommended-grid {
                grid-template-columns: 1fr !important;
                padding: 0 4px;
              }
              .rec-card-refactored {
                padding: 16px !important;
              }
            }
            .rec-card-refactored:hover {
              transform: translateY(-4px);
              box-shadow: 0 20px 40px rgba(0,0,0,0.4);
              border-color: var(--blue) !important;
            }
            .rec-card-refactored.is-expanded {
              background: var(--bg-elevated) !important;
            }
          `}</style>

          {recommendations.map(pick => (
            <RecommendedCard 
              key={pick.id} 
              pick={pick} 
              slip={slip} 
              onToggleSlip={onToggleSlip} 
            />
          ))}
        </div>

      ) : (
        <div className="card table-wrap anim-fade" style={{ borderRadius: 16, overflow: 'hidden' }}>
          <table className="dt table-heavy">
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
