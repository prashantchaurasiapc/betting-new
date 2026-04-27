import React from 'react'
import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '../lib/data.js'
import { Zap, Moon } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-logo">
        <div className="nav-logo-icon">⚡</div>
        <span className="nav-logo-text">GeniePicks</span>
      </NavLink>

      <div className="nav-links">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="nav-right">
        <span style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span className="live-dot" />
          <span style={{ fontSize:11, fontWeight:700, color:'var(--accent-green)' }}>LIVE</span>
        </span>
        <button className="btn-ghost" style={{ padding:'5px 12px', fontSize:12 }}>
          <Moon size={13} /> Night
        </button>
      </div>
    </nav>
  )
}
