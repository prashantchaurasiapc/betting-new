import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, ShieldCheck, Target, Activity, BarChart2, Zap, AlertCircle, Info, ChevronUp, ChevronDown } from 'lucide-react';

// --- Sub-components with High Visibility (Universal Fix) ---

export const SignalStrengthItem = ({ label, value, weight, color, icon: Icon, theme = 'dark' }) => {
  const isDark = theme === 'dark';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr 40px 60px', alignItems: 'center', gap: 10, marginBottom: 12 }}>
      <Icon size={14} style={{ color, filter: isDark ? `drop-shadow(0 0 8px ${color}55)` : 'none' }} />
      <div>
        <span style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#F8FAFC' : '#0F172A' }}>{label}</span>
        <span style={{ fontSize: 10, color: isDark ? '#CBD5E1' : '#475569', marginLeft: 6 }}>x{weight.toFixed(2)}</span>
      </div>
      <div style={{ width: '100%', height: 6, background: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ 
          width: `${value}%`, height: '100%', background: color, borderRadius: 10,
          boxShadow: isDark ? `0 0 12px ${color}aa` : 'none'
        }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 800, color: isDark ? '#FFFFFF' : '#0F172A', textAlign: 'right' }}>{value}</span>
    </div>
  );
};

export const MatchupContextBox = ({ status, text, theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const accent = status === 'HOSTILE' ? '#FF4D4D' : '#00D4A1';
  return (
    <div style={{ 
      background: isDark ? `rgba(${status === 'HOSTILE' ? '255,77,77' : '0,212,161'}, 0.08)` : (status === 'HOSTILE' ? '#FFF1F2' : '#F0FDF4'), 
      border: `1.5px solid ${isDark ? `rgba(${status === 'HOSTILE' ? '255,77,77' : '0,212,161'}, 0.4)` : (status === 'HOSTILE' ? '#FFC1C1' : '#B5EAD7')}`,
      borderRadius: 12, padding: 14, display: 'flex', gap: 12, marginTop: 16
    }}>
      <div style={{ 
        fontSize: 10, fontWeight: 900, color: accent, 
        textTransform: 'uppercase', padding: '2px 6px', border: `1.5px solid ${accent}`,
        borderRadius: 4, height: 'fit-content'
      }}>
        {status}
      </div>
      <p style={{ fontSize: 12, color: isDark ? '#F1F5F9' : '#0F172A', lineHeight: 1.5, fontWeight: 800 }}>{text}</p>
    </div>
  );
};

export const L3FormComparison = ({ l3, l5, theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const divergence = Math.abs(((l3 - l5) / l5) * 100).toFixed(0);
  return (
    <div style={{ marginTop: 24 }}>
      <p style={{ fontSize: 11, fontWeight: 800, color: isDark ? '#CBD5E1' : '#475569', textTransform: 'uppercase', marginBottom: 12 }}>L3 Form vs L5</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC', border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : '#CBD5E1'}`, borderRadius: 12, padding: '12px 16px', textAlign: 'center', flex: 1 }}>
          <p style={{ fontSize: 9, color: isDark ? '#CBD5E1' : '#64748B', fontWeight: 700, marginBottom: 4 }}>L3</p>
          <p style={{ fontSize: 18, fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A' }}>{l3}</p>
        </div>
        <div style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC', border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : '#CBD5E1'}`, borderRadius: 12, padding: '12px 16px', textAlign: 'center', flex: 1 }}>
          <p style={{ fontSize: 9, color: isDark ? '#CBD5E1' : '#64748B', fontWeight: 700, marginBottom: 4 }}>L5</p>
          <p style={{ fontSize: 18, fontWeight: 900, color: isDark ? '#FFFFFF' : '#0F172A' }}>{l5}</p>
        </div>
        <div style={{ flex: 1.2, paddingLeft: 10 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: isDark ? '#F1F5F9' : '#0F172A' }}>{divergence}% divergence</p>
          <div style={{ width: '100%', height: 4, background: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0', borderRadius: 4, marginTop: 6 }}>
            <div style={{ width: `${Math.min(divergence, 100)}%`, height: '100%', background: '#3B82F6', borderRadius: 4 }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const Skeleton = ({ width, height, borderRadius = 4, theme = 'dark' }) => (
  <div style={{ 
    width, height, borderRadius, 
    background: theme === 'light' 
      ? 'linear-gradient(90deg, #E2E8F0 25%, #CBD5E1 50%, #E2E8F0 75%)'
      : 'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.05) 75%)',
    backgroundSize: '200% 100%',
    animation: 'skeleton-loading 1.5s infinite linear'
  }}>
    <style>{` @keyframes skeleton-loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } } `}</style>
  </div>
);

export const MiniStatBar = ({ value, line, side, theme = 'dark', compact = false }) => {
  const isDark = theme === 'dark';
  const isHit = side === 'UNDER' ? value < line : value > line;
  const percentage = Math.min((value / (line * 1.5)) * 100, 100);
  const targetPos = (line / (line * 1.5)) * 100;
  
  return (
    <div style={{ width: '100%', height: compact ? 6 : 8, background: isDark ? 'rgba(255,255,255,0.15)' : '#E2E8F0', borderRadius: 10, overflow: 'hidden', position: 'relative' }}>
      <div style={{ 
        width: `${percentage}%`, height: '100%', 
        background: isHit ? (isDark ? '#00D4A1' : '#16A34A') : (isDark ? '#FF4D4D' : '#DC2626'),
        borderRadius: 10, transition: 'width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }} />
      <div style={{ 
        position: 'absolute', left: `${targetPos}%`, top: 0, width: 2, height: '100%', 
        background: isDark ? '#60A5FA' : '#2563EB', zIndex: 1
      }} />
    </div>
  );
};

export const PropHistoryRow = ({ item, line, side, market, theme = 'dark', compact = false }) => {
  const isDark = theme === 'dark';
  const isHit = side === 'UNDER' ? item.result < line : item.result > line;
  const hitColor = isHit ? (isDark ? '#00D4A1' : '#16A34A') : (isDark ? '#FF4D4D' : '#DC2626');
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '44px 64px 1fr 34px', 
      alignItems: 'center', 
      gap: 16, 
      padding: compact ? '8px 0' : '14px 0', 
      borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #F1F5F9' 
    }}>
      <span style={{ fontSize: compact ? 10 : 11, color: isDark ? '#CBD5E1' : '#475569', fontWeight: 700 }}>{item.date}</span>
      <span style={{ fontSize: compact ? 11 : 12, fontWeight: 800, color: isDark ? '#F1F5F9' : '#0F172A' }}>
        {item.home ? 'vs' : '@'} {item.opponent}
      </span>
      <div style={{ padding: '0 4px' }}><MiniStatBar value={item.result} line={line} side={side} theme={theme} compact={compact} /></div>
      <div style={{ textAlign: 'right' }}>
        <span style={{ fontSize: compact ? 12 : 14, fontWeight: 900, color: hitColor }}>{item.result}</span>
      </div>
    </div>
  );
};

export const HistorySection = ({ title, trend, line, side, market, theme = 'dark', opponent, compact = false }) => {
  const isDark = theme === 'dark';
  const hits = trend.filter(v => typeof v === 'object' ? (side === 'UNDER' ? v.result < line : v.result > line) : (side === 'UNDER' ? v < line : v > line)).length;
  const count = trend.length;
  const avg = (trend.reduce((a, b) => a + (typeof b === 'object' ? b.result : b), 0) / count).toFixed(1);

  return (
    <div style={{ marginTop: compact ? 16 : 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: compact ? 10 : 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 14, background: '#3B82F6', borderRadius: 4 }} />
          <h4 style={{ fontSize: compact ? 11 : 13, fontWeight: 900, color: isDark ? '#F8FAFC' : '#0F172A', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</h4>
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          <span style={{ fontSize: compact ? 10 : 11, fontWeight: 900, color: isDark ? '#00D4A1' : '#16A34A' }}>{hits}/{count} HITS</span>
          <span style={{ fontSize: compact ? 10 : 11, fontWeight: 900, color: isDark ? '#CBD5E1' : '#475569' }}>AVG {avg}</span>
        </div>
      </div>
      <div style={{ padding: '0 4px' }}>
        {trend.map((val, i) => {
          const item = typeof val === 'object' ? val : {
            date: `04/${25-i}`,
            opponent: ['PHX', 'GSW', 'LAL', 'DAL', 'DEN', 'SAC', 'NOP', 'HOU', 'MEM', 'LAC'][i % 10],
            home: i % 2 === 0,
            result: val
          };
          return <PropHistoryRow key={i} item={item} line={line} side={side} market={market} theme={theme} compact={compact} />;
        })}
      </div>
    </div>
  );
};

export const ContextSummaryGrid = ({ pick, theme = 'dark', compact = false }) => {
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const metrics = [
    { label: 'Line', val: pick.line },
    { label: 'Proj', val: pick.projection.toFixed(1), color: '#3B82F6' },
    { label: 'Edge', val: `${pick.edge > 0 ? '+' : ''}${pick.edge.toFixed(1)}%`, color: pick.edge > 0 ? (isDark ? '#00D4A1' : '#16A34A') : (isDark ? '#FF4D4D' : '#DC2626') },
    { label: 'Def Rnk', val: `#${pick.defensiveRank || '??'}`, color: pick.defensiveRank <= 10 ? '#00D4A1' : pick.defensiveRank >= 20 ? '#FF4D4D' : '#F59E0B' },
    { label: 'L3 Avg', val: pick.trendL3?.toFixed(1) || '??' },
    { label: 'L5 Avg', val: pick.trendL5?.toFixed(1) || '??' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
      {metrics.map(m => (
        <div key={m.label} style={{ 
          background: isDark ? 'rgba(255,255,255,0.06)' : '#F8FAFC', 
          border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.15)' : '#CBD5E1'}`,
          borderRadius: 12, padding: compact ? '10px 12px' : '12px'
        }}>
          <p style={{ fontSize: compact ? 9 : 9, color: isDark ? '#CBD5E1' : '#475569', textTransform: 'uppercase', marginBottom: 6, fontWeight: 900 }}>{m.label}</p>
          {loading ? <Skeleton width="60%" height={compact ? 12 : 14} theme={theme} /> : 
            <p style={{ fontSize: compact ? 13 : 15, fontWeight: 900, color: m.color || (isDark ? '#FFFFFF' : '#0F172A') }}>{m.val}</p>
          }
        </div>
      ))}
    </div>
  );
};

export const RecentFormSection = ({ trend, line, side, market, theme = 'dark', compact = false }) => (
  <HistorySection title="Recent Form" trend={trend} line={line} side={side} market={market} theme={theme} compact={compact} />
);

export const OpponentHistorySection = ({ history, line, side, market, opponent, theme = 'dark', compact = false }) => (
  <HistorySection title={`vs ${opponent}`} trend={history} line={line} side={side} market={market} theme={theme} opponent={opponent} compact={compact} />
);
