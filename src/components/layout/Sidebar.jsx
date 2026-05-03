import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../../lib/data.js';
import { 
  Layout, Target, Shield, BarChart2, BookOpen, 
  Zap, TrendingUp, Lock, GitPullRequest, 
  ChevronLeft, ChevronRight, Trophy
} from 'lucide-react';
import { useSlip } from '../../context/SlipContext';

const ICON_MAP = {
  Layout, Target, Shield, BarChart2, BookOpen, 
  Zap, TrendingUp, Lock, GitPullRequest
};

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { slip } = useSlip();

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`mobile-sidebar-overlay ${mobileOpen ? 'active' : ''}`} 
        onClick={() => setMobileOpen(false)} 
      />

      <aside className={`desktop-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-active' : ''}`}>
      <div className="sidebar-brand">
        <div className="nav-logo-icon">⚡</div>
        {!collapsed && <span className="nav-logo-text" style={{ fontSize: 16 }}>GeniePicks</span>}
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => {
          const Icon = ICON_MAP[item.icon];
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => 'sidebar-nav-link' + (isActive ? ' active' : '')}
              title={collapsed ? item.label : ''}
            >
              {Icon && <Icon size={20} />}
              <span className="nav-label">{item.label}</span>
              {item.path === '/picks' && slip.length > 0 && (
                <span className="tab-count" style={{ 
                  marginLeft: 'auto', 
                  background: 'var(--green-dim)', 
                  color: 'var(--green)', 
                  borderColor: 'var(--green)',
                  display: collapsed ? 'none' : 'block'
                }}>
                  {slip.length}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div style={{ padding: collapsed ? '12px 4px' : '12px', borderTop: '1px solid var(--border-soft)' }}>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: 10, 
          padding: '8px', background: 'var(--bg-alpha-05)', borderRadius: 8,
          overflow: 'hidden'
        }}>
          <Trophy size={16} color="var(--gold)" style={{ flexShrink: 0 }} />
          {!collapsed && (
            <div style={{ whiteSpace: 'nowrap' }}>
              <p style={{ fontSize: 9, fontWeight: 800, color: 'var(--gold)' }}>POSTSEASON</p>
              <p style={{ fontSize: 8, color: 'var(--text-muted)' }}>Live Bracket Active</p>
            </div>
          )}
        </div>
      </div>

      <button className="sidebar-toggle-btn hide-mobile" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
      </aside>
    </>
  );
}
