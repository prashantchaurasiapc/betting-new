import React, { useState } from 'react';
import { BOX_SCORE_DATA } from '../../lib/data.js';

export default function BoxScoreTab() {
  const [activeTeam, setActiveTeam] = useState('POR');
  const teamData = BOX_SCORE_DATA.teams[activeTeam];

  return (
    <div className="anim-fade" style={{ background: '#080808', color: '#fff', borderRadius: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header Stat Strip (The one above the tabs in the image) */}
      <div style={{ display: 'flex', gap: 2, background: '#000', padding: '10px 16px', overflowX: 'auto', borderBottom: '1px solid #111' }}>
        {['98-111', '112-101', '84-119', '91-123'].map((score, i) => (
          <div key={i} style={{ fontSize: 9, fontWeight: 900, color: '#666', borderRight: '1px solid #222', paddingRight: 10, paddingLeft: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
             <span style={{ color: i === 1 ? 'var(--blue)' : '#444' }}>●</span> {score}
          </div>
        ))}
      </div>

      {/* Team Tabs */}
      <div style={{ display: 'flex', background: '#000', borderBottom: '1px solid #1a1a1a' }}>
        {['Feed', 'Markets', 'Game', ...Object.keys(BOX_SCORE_DATA.teams)].map(t => {
          const isTeam = BOX_SCORE_DATA.teams[t];
          const isActive = activeTeam === t || (!isTeam && t === 'Game');
          return (
            <button
              key={t}
              onClick={() => isTeam && setActiveTeam(t)}
              style={{
                padding: '12px 16px', background: 'transparent',
                border: 'none', borderBottom: isActive ? '2px solid var(--blue)' : '2px solid transparent',
                color: isActive ? '#fff' : '#666', fontSize: 11, fontWeight: 800, cursor: 'pointer',
                transition: '0.2s'
              }}
            >
              {t.toUpperCase()}
            </button>
          );
        })}
      </div>

      <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
        {/* Team Summary Row */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, background: '#111', borderRadius: '50%', border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <span style={{ fontSize: 10, fontWeight: 900 }}>{teamData.code}</span>
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 900 }}>{teamData.name} · <span style={{ color: '#666', fontWeight: 600 }}>▼ 3.9</span></p>
            </div>
          </div>
          
          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: 12, border: '1px solid #111' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(11, 1fr)', gap: 4, textAlign: 'center', fontSize: 8, fontWeight: 900, color: '#444', marginBottom: 4, letterSpacing: 0.5 }}>
               <span>FG</span><span>3FG</span><span>FTS</span><span>TO</span><span>REB</span><span>AST</span><span>BLK</span><span>DREB</span><span>OREB</span><span>POT</span><span>PIP</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(11, 1fr)', gap: 4, textAlign: 'center', fontSize: 10, fontWeight: 900, color: '#999', marginBottom: 6 }}>
               <span>{teamData.totals.fg}</span><span>{teamData.totals.tfg}</span><span>{teamData.totals.ft}</span><span>{teamData.totals.to}</span><span>{teamData.totals.reb}</span><span>{teamData.totals.ast}</span><span>{teamData.totals.blk}</span><span>{teamData.totals.dreb}</span><span>{teamData.totals.oreb}</span><span>{teamData.totals.pot}</span><span>{teamData.totals.pip}</span>
            </div>
            <div style={{ display: 'flex', gap: 12, fontSize: 10, fontWeight: 900, color: '#444' }}>
               <span>{teamData.totals.fgp}</span><span>{teamData.totals.tfgp}</span><span>{teamData.totals.ftp}</span>
            </div>
          </div>
        </div>

        {/* Player Stats Table */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 650 }}>
            <thead>
              <tr style={{ background: '#050505', borderBottom: '1px solid #111' }}>
                <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: 9, color: '#444', fontWeight: 900 }}>PLAYER</th>
                {['MIN', 'PTS', 'REB', 'AST', 'STL', 'BLK', '+/-', 'FG%', '3FG', 'FTS'].map(h => (
                  <th key={h} style={{ padding: '10px 4px', fontSize: 9, color: '#444', fontWeight: 900 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teamData.players.map((p, i) => (
                <React.Fragment key={i}>
                  <tr style={{ borderBottom: '1px solid #0f0f0f' }}>
                    <td style={{ padding: '10px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#111', border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                           <span style={{ fontSize: 9, fontWeight: 800 }}>{p.name.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: 12, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap' }}>{p.name} · <span style={{ color: '#666' }}>{p.pos}</span></p>
                          <p style={{ fontSize: 9, color: 'var(--blue)', fontWeight: 700 }}>1.3K MIN</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#ccc' }}>{p.min}</td>
                    <td style={{ textAlign: 'center', fontSize: 12, fontWeight: 900, color: '#fff' }}>{p.pts}</td>
                    <td style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#ccc' }}>{p.reb}</td>
                    <td style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#ccc' }}>{p.ast}</td>
                    <td style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#ccc' }}>{p.stl}</td>
                    <td style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#ccc' }}>{p.blk}</td>
                    <td style={{ textAlign: 'center', fontSize: 11, fontWeight: 900, color: p.plusMinus > 0 ? 'var(--green)' : p.plusMinus < 0 ? 'var(--error)' : '#666' }}>
                      {p.plusMinus > 0 ? p.plusMinus : p.plusMinus}
                    </td>
                    <td style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: '#666' }}>{p.fg}</td>
                    <td style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: '#666' }}>{p.tfg}</td>
                    <td style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: '#666' }}>{p.ft || '0/0'}</td>
                  </tr>
                  <tr style={{ background: '#030303' }}>
                    <td colSpan="11" style={{ padding: '4px 16px 8px 54px' }}>
                       <div style={{ display: 'flex', gap: 12, fontSize: 9, fontWeight: 700, color: '#333' }}>
                          <span>FBP: {p.fbp}</span>
                          <span>SCP: {p.scp}</span>
                          <span>STL: {p.stl}</span>
                          <span>FPS: 32.9</span>
                       </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        .box-score-table th { font-size: 10px; color: #666; font-weight: 800; padding: 10px 4px; }
        .box-score-table td { font-size: 12px; }
        .box-score-table .mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>
    </div>
  );
}
