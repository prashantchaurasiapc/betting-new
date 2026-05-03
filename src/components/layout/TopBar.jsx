import React, { useState } from 'react';
import { Moon, Sun, Bell, User, Menu } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function TopBar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="top-bar">
      <div className="show-mobile" style={{ marginRight: 12 }}>
        <button 
          className="btn-ghost" 
          onClick={onMenuClick} 
          style={{ 
            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-alpha-05)', borderRadius: 10, padding: 0
          }}
        >
          <Menu size={18} />
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20, width: '100%', justifyContent: 'flex-end' }}>
        <div className="search-wrap hide-mobile">
          <input className="input-field" placeholder="Search signals..." style={{ width: 180 }} />
        </div>

        <div style={{ position: 'relative' }}>
          <button 
            className="btn-ghost" 
            style={{ padding: '8px' }}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={18} />
            <span style={{ 
              position: 'absolute', top: 6, right: 6, 
              width: 8, height: 8, background: 'var(--error)', 
              borderRadius: '50%', border: '2px solid var(--bg-secondary)' 
            }} />
          </button>

          {showNotifications && (
            <div className="glass-card anim-slide" style={{ 
              position: 'absolute', top: '120%', right: 0, width: 280,
              padding: '16px', zIndex: 2000, boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h4 style={{ margin: 0, fontSize: 14 }}>Notifications</h4>
                <span style={{ fontSize: 10, color: 'var(--blue)', cursor: 'pointer' }}>Mark all read</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[1, 2].map(i => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '8px', borderRadius: 8, background: 'var(--bg-alpha-05)' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--blue)', marginTop: 4 }} />
                    <div>
                      <p style={{ fontSize: 12, margin: 0, fontWeight: 600 }}>New Signal Alert</p>
                      <p style={{ fontSize: 11, margin: '2px 0 0 0', color: 'var(--text-muted)' }}>LeBron James Prop (O/U) updated...</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button 
          className="btn-ghost" 
          style={{ padding: '8px' }}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <div style={{ height: 24, width: 1, background: 'var(--border-soft)' }} />

        <button className="btn-ghost" style={{ gap: 8, padding: '2px 10px 2px 2px', borderRadius: 99 }}>
          <div style={{ 
            width: 32, height: 32, borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--blue), var(--blue-hover))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#000', fontWeight: 800, fontSize: 12
          }}>
            JD
          </div>
          <span style={{ fontSize: 12, fontWeight: 600 }} className="hide-mobile">John Doe</span>
        </button>
      </div>
    </header>
  );
}
