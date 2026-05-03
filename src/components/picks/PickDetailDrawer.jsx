import React from 'react'
import { createPortal } from 'react-dom'
import { X, AlertCircle, ShieldCheck, Zap, Trash2, Activity, Target, BarChart2, TrendingUp } from 'lucide-react'
import { 
  SignalStrengthItem, 
  MatchupContextBox, 
  L3FormComparison, 
  HistorySection,
  ProjectionAttribution,
  MultiBookOdds,
  LineMovementHistory,
  UsageMinutes,
  ConfidenceDistribution,
  PublicSharpSplit,
  AlternateLinesLadder,
  CalibrationNote
} from './AnalyticsSections'

export default function PickDetailDrawer({ pick, onClose, onToggleSlip, isInSlip, theme = 'dark' }) {
  if (!pick) return null;

  const isUnder = pick.side === 'UNDER';
  const opponent = pick.matchup.split(' vs ').find(t => t !== pick.team);
  const isDark = theme === 'dark';

  const drawerContent = (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '10px',
      fontFamily: "'Outfit', sans-serif"
    }}>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0, background: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.65)', 
          backdropFilter: 'blur(12px)', opacity: 1, transition: 'opacity 0.4s ease'
        }}
      />
      
      {/* Modal Card */}
      <div style={{
        position: 'relative',
        width: 'min(580px, 100%)',
        maxHeight: '94vh',
        background: isDark ? '#0F172A' : '#FFFFFF',
        borderRadius: 32,
        border: isDark ? '1px solid rgba(255,255,255,0.1)' : 'none',
        boxShadow: isDark ? '0 40px 80px -12px rgba(0,0,0,0.8)' : '0 40px 80px -12px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        animation: 'modal-pop 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
          @keyframes modal-pop {
            from { opacity: 0; transform: scale(0.96) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          .custom-scrollbar::-webkit-scrollbar { width: 5px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isDark ? '#334155' : '#E2E8F0'}; borderRadius: 10px; }
          @media (max-width: 640px) {
            .drawer-header-main { padding: 20px 20px 16px !important; }
            .drawer-stats-grid { grid-template-columns: 1fr 1fr !important; }
            .drawer-content-area { padding: 20px 20px 24px !important; }
            .drawer-profile-title { font-size: 18px !important; }
            .drawer-footer { padding: 16px 20px 24px !important; }
          }
        `}</style>

        {/* Top Header Section */}
        <div style={{ 
          padding: '8px 16px', background: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 8, fontWeight: 900, color: '#F59E0B', border: '1px solid #F59E0B', padding: '1px 4px', borderRadius: 4 }}>AGGRESSIVE</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: isDark ? '#CBD5E1' : '#94A3B8' }}>#1 MODEL PICK</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14 }}>🏀</span>
            <span style={{ fontSize: 9, fontWeight: 900, color: '#FFFFFF', background: '#22C55E', padding: '2px 8px', borderRadius: 4 }}>STRONG LEAN</span>
          </div>
        </div>

        {/* Player Profile Header */}
        <div className="drawer-header-main" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
             <div style={{ 
               width: 44, height: 44, borderRadius: '50%', background: isDark ? 'rgba(34,197,94,0.1)' : '#F0FDF4', 
               border: `2px solid #22C55E`, display: 'flex', alignItems: 'center', justifyContent: 'center',
               fontSize: 14, fontWeight: 900, color: '#22C55E', flexShrink: 0
             }}>
               {pick.player.split(' ').map(n => n[0]).join('')}
             </div>
             <div style={{ minWidth: 0 }}>
               <h2 className="drawer-profile-title" style={{ fontSize: 16, fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pick.player}</h2>
               <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                 <span style={{ fontSize: 11, color: isDark ? '#CBD5E1' : '#64748B', fontWeight: 500 }}>{pick.team} vs {opponent}</span>
                 <span style={{ fontSize: 9, background: isDark ? 'rgba(225,29,72,0.1)' : '#FFF1F2', color: '#E11D48', padding: '1px 4px', border: `1px solid ${isDark ? 'rgba(225,29,72,0.2)' : '#FECDD3'}`, borderRadius: 4, fontWeight: 800 }}>HOSTILE</span>
               </div>
             </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
             <div style={{ textAlign: 'right' }}>
               <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, justifyContent: 'flex-end' }}>
                 <span style={{ fontSize: 20, fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A' }}>{pick.line}</span>
                 <span style={{ fontSize: 9, fontWeight: 800, color: isDark ? '#CBD5E1' : '#94A3B8', textTransform: 'uppercase' }}>{pick.market}</span>
               </div>
               <span style={{ fontSize: 10, fontWeight: 700, color: pick.edge > 0 ? (isDark ? '#00D4A1' : '#22C55E') : '#EF4444', padding: '1px 6px', borderRadius: 6, display: 'inline-block' }}>
                 {pick.edge > 0 ? '+' : ''}{pick.edge.toFixed(1)} EDGE
               </span>
             </div>
             <button onClick={onClose} style={{ 
               background: isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9', border: 'none', color: isDark ? '#94A3B8' : '#475569', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
             }}>
               <X size={18} />
             </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="mobile-stack" style={{ padding: '12px 32px', background: isDark ? 'rgba(255,255,255,0.02)' : '#F8FAFC', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <div style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#CBD5E1' : '#64748B' }}>L10 PERFORMANCE: <span style={{ color: isDark ? '#FFFFFF' : '#0F172A', fontWeight: 800 }}>5/10 {pick.side}S HIT</span> • AVG 24.1</div>
           <div style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#CBD5E1' : '#64748B' }}>{opponent} <span style={{ color: isDark ? '#00D4A1' : '#22C55E', fontWeight: 800 }}>#10 DEFENSE</span></div>
        </div>

        {/* Scrollable Analytics Area */}
        <div 
          className="custom-scrollbar drawer-content-area"
          style={{ padding: '28px 32px 32px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 32 }}
        >
           {/* Section: Overview Grid */}
           <div className="drawer-stats-grid" style={{ 
             display: 'grid', 
             gridTemplateColumns: 'repeat(3, 1fr)', 
             gap: 8 
           }}>
              <div style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC', padding: 12, borderRadius: 16, textAlign: 'center', border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : '#F1F5F9'}` }}>
                <p style={{ fontSize: 9, color: isDark ? '#CBD5E1' : '#94A3B8', fontWeight: 800, marginBottom: 4, textTransform: 'uppercase' }}>5G AVG</p>
                <p style={{ fontSize: 16, fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A' }}>15.6</p>
              </div>
              <div style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC', padding: 12, borderRadius: 16, textAlign: 'center', border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : '#F1F5F9'}` }}>
                <p style={{ fontSize: 9, color: isDark ? '#CBD5E1' : '#94A3B8', fontWeight: 800, marginBottom: 4, textTransform: 'uppercase' }}>MODEL EDGE</p>
                <p style={{ fontSize: 16, fontWeight: 900, color: '#EF4444' }}>-10.9%</p>
              </div>
              <div style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC', padding: 12, borderRadius: 16, textAlign: 'center', border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : '#F1F5F9'}` }}>
                <p style={{ fontSize: 9, color: isDark ? '#CBD5E1' : '#94A3B8', fontWeight: 800, marginBottom: 4, textTransform: 'uppercase' }}>WIN PROB</p>
                <p style={{ fontSize: 16, fontWeight: 900, color: isDark ? '#00D4A1' : '#22C55E' }}>97%</p>
              </div>
           </div>

           {/* Section: Signal Strength */}
           <div>
             <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
               <div style={{ width: 4, height: 16, background: '#3B82F6', borderRadius: 4 }} />
               <p style={{ fontSize: 12, fontWeight: 800, color: isDark ? '#F8FAFC' : '#0F172A', textTransform: 'uppercase', letterSpacing: '1px' }}>Signal Strength Breakdown</p>
             </div>
             <SignalStrengthItem label="Rolling Avg" value={97} weight={0.30} color="#F97316" icon={BarChart2} theme={theme} />
             <SignalStrengthItem label="Edge vs Line" value={82} weight={0.25} color="#A855F7" icon={TrendingUp} theme={theme} />
             <SignalStrengthItem label="Signal Quality" value={70} weight={0.25} color="#00D4A1" icon={Target} theme={theme} />
             <SignalStrengthItem label="Game Context" value={90} weight={0.20} color="#06B6D4" icon={Zap} theme={theme} />
           </div>

           {/* Section: Matchup Context */}
           <MatchupContextBox 
             status="HOSTILE" 
             theme={theme}
             text={`Opponent allows 109.0 pts/g allowed (P0 softest on today's slate). High defensive pressure expected from primary assignment.`} 
           />

           <CalibrationNote risk={38} theme={theme} />

           <UsageMinutes theme={theme} />

           <ProjectionAttribution pick={pick} theme={theme} />

           <ConfidenceDistribution theme={theme} />

           <PublicSharpSplit theme={theme} />

           <MultiBookOdds line={pick.line} theme={theme} />

           <AlternateLinesLadder line={pick.line} theme={theme} />

           <LineMovementHistory theme={theme} />

           <L3FormComparison l3={21.7} l5={19.4} theme={theme} />

           {/* Section: History Sections */}
           <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
             <HistorySection 
                title="Recent Form (Last 10)" 
                trend={pick.trend} 
                line={pick.line} 
                side={pick.side} 
                market={pick.market} 
                theme={theme}
             />

             <HistorySection 
                title={`vs ${opponent} (Past Games)`} 
                trend={pick.opponentHistory} 
                line={pick.line} 
                side={pick.side} 
                market={pick.market} 
                opponent={opponent}
                theme={theme}
             />
           </div>
        </div>

        {/* Footer Action */}
        <div className="drawer-footer" style={{ padding: '24px 32px 32px', background: isDark ? '#0F172A' : '#FFFFFF', borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9'}` }}>
          <button 
            onClick={() => {
              onToggleSlip(pick)
              if (!isInSlip) onClose()
            }}
            style={{ 
              width: '100%', 
              background: isInSlip ? (isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9') : (isDark ? '#3B82F6' : '#0F172A'), 
              border: isInSlip ? `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'}` : 'none', 
              borderRadius: 20, padding: '18px', 
              color: isInSlip ? '#FF4D4D' : '#FFFFFF', 
              fontWeight: 900, fontSize: 16, cursor: 'pointer', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, 
              transition: 'all 0.2s ease',
              boxShadow: !isInSlip && isDark ? '0 10px 20px rgba(59,130,246,0.3)' : 'none'
            }}
          >
            {isInSlip ? (
              <><Trash2 size={22} /> REMOVE FROM SLIP</>
            ) : (
              <><ShieldCheck size={22} /> ADD TO PP SLIP</>
            )}
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(drawerContent, document.body)
}
