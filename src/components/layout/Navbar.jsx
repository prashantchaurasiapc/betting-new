import React from 'react'
import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '../../lib/data.js'
import { Zap, Moon, Sun, Menu, X } from 'lucide-react'

import { useSlip } from '../../context/SlipContext'
import { useTheme } from '../../context/ThemeContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const { slip } = useSlip()
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      <nav className="navbar">
        <div className="nav-left-group">
          <button className="menu-toggle" onClick={() => setIsOpen(true)}>
            <Menu size={20} />
          </button>
          <NavLink to="/" className="nav-logo">
            <div className="nav-logo-icon">⚡</div>
            <span className="nav-logo-text">GeniePicks</span>
          </NavLink>
        </div>

        <div className="nav-links">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
            >
              {item.label}
              {item.path === '/picks' && slip.length > 0 && (
                <span className="tab-count" style={{ marginLeft: 6, background: 'var(--green-dim)', color: 'var(--green)', borderColor: 'var(--green)' }}>
                  {slip.length}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        <div className="nav-right">
          <span className="live-status-desktop" style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span className="live-dot" />
            <span style={{ fontSize:11, fontWeight:700, color:'var(--accent-green)' }}>LIVE</span>
          </span>
          <button 
            className="btn-ghost" 
            style={{ padding:'5px 12px', fontSize:12 }}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Moon size={13} /> : <Sun size={13} />}
            {theme === 'dark' ? 'Night' : 'Light'}
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div className={`mobile-sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
        <aside className={`mobile-sidebar ${isOpen ? 'active' : ''}`} onClick={e => e.stopPropagation()}>
          <div className="sidebar-header">
            <div className="nav-logo">
              <div className="nav-logo-icon">⚡</div>
              <span className="nav-logo-text">GeniePicks</span>
            </div>
            <button className="btn-close" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>
          
          <div className="sidebar-links">
            {NAV_ITEMS.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="sidebar-footer">
            <div style={{ display:'flex', alignItems:'center', gap:8, padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 12 }}>
              <span className="live-dot" />
              <span style={{ fontSize:12, fontWeight:700, color:'var(--accent-green)' }}>LIVE MARKET DATA</span>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
