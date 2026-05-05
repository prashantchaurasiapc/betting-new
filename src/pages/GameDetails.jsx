import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Zap, ChevronDown, Clock } from 'lucide-react';
import { GAMES, BOX_SCORE_DATA } from '../lib/data';

const STAT_COLUMNS = [
  { label: 'PTS', key: 'pts' },
  { label: 'REB', key: 'reb' },
  { label: 'AST', key: 'ast' },
  { label: 'STL', key: 'stl' },
  { label: 'BLK', key: 'blk' },
  { label: 'MIN', key: 'min' }
];

const MOCK_PROPS = [
  {
    player: 'Mike Conley',
    team: 'MIN',
    market: 'PTS',
    line: '4.5',
    proj: '12.4',
    edge: '+175.6%',
    implied: '53%',
    decision: 'OVER 4.5 ↑',
    type: 'VALUE PLAY',
    color: 'var(--green)',
    drivers: { defPres: 59, injRisk: 22, blowout: 28 }
  },
  {
    player: 'Devin Vassell',
    team: 'SAS',
    market: '3PM',
    line: '2.5',
    proj: '0',
    edge: '-100%',
    implied: '64%',
    decision: 'UNDER 2.5 ↓',
    type: 'FADE ALERT',
    color: 'var(--error)',
    drivers: { defPres: 59, injRisk: 15, blowout: 28 }
  }
];

export default function GameDetails() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('PLAYER STATS');

  // Parse codes from ID (e.g., DET-ORL-g1)
  const parts = gameId ? gameId.split('-') : ['DET', 'ORL', 'g1'];
  const awayCode = parts[0];
  const homeCode = parts[1];

  // Dynamic Team Data Lookup
  const gameData = GAMES.find(g => (g.awayCode === awayCode && g.homeCode === homeCode) || (g.awayCode === homeCode && g.homeCode === awayCode));
  const awayName = (gameData?.awayTeam || awayCode).split(' ').pop().toUpperCase();
  const homeName = (gameData?.homeTeam || homeCode).split(' ').pop().toUpperCase();
  
  // Dynamic Scores (Try data then fallback)
  const isFinal = gameId.includes('g1') || gameId.includes('g2') || gameId.includes('g3') || gameId.includes('g4') || gameId.includes('g5') || gameId.includes('g6') || gameId.includes('g7');
  
  // Real check: If no score in BOX_SCORE_DATA, treat as unplayed
  const hasData = BOX_SCORE_DATA?.teams?.[awayCode]?.score !== undefined;
  
  const awayScore = hasData ? BOX_SCORE_DATA.teams[awayCode].score : null;
  const homeScore = hasData ? BOX_SCORE_DATA.teams[homeCode].score : null;
  
  const [activeTeam, setActiveTeam] = useState(`${awayCode} ${awayName}`);

  const mockPlayers = [
    { name: 'Cade Cunningham', pos: 'PG', num: '#2', pts: '25.7', reb: '4.4', ast: '8.4', stl: '1.1', blk: '0.5', min: '34.4', fg: '46.2%', p3: '35.1%', ft: '84.3%' },
    { name: 'Daniss Jenkins', pos: 'PG', num: '#8', pts: '6.4', reb: '2.2', ast: '3.4', stl: '0.9', blk: '0.1', min: '18.2', fg: '42.1%', p3: '33.4%', ft: '78.2%' },
    { name: 'Malik Beasley', pos: 'SG', num: '#7', pts: '16.8', reb: '3.5', ast: '1.8', stl: '0.9', blk: '0.1', min: '29.4', fg: '43.2%', p3: '38.4%', ft: '87.1%' },
    { name: 'Tim Hardaway Jr.', pos: 'SG', num: '#10', pts: '12.4', reb: '2.8', ast: '1.6', stl: '0.7', blk: '0.2', min: '26.4', fg: '41.5%', p3: '36.2%', ft: '85.4%' },
  ];

  const renderPlayerStats = () => (
    <>
      <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
        {[
          { name: awayName, code: awayCode },
          { name: homeName, code: homeCode }
        ].map(team => (
          <button
            key={team.code}
            onClick={() => setActiveTeam(`${team.code} ${team.name}`)}
            style={{
              padding: '6px 20px', background: activeTeam.includes(team.code) ? 'var(--bg-alpha-05)' : 'none',
              border: 'none', borderBottom: activeTeam.includes(team.code) ? '2px solid var(--yellow)' : 'none',
              color: activeTeam.includes(team.code) ? 'var(--text-primary)' : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
              fontSize: 10, fontWeight: 800
            }}
          >
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${team.code}`} style={{ width: '70%', height: '70%' }} alt="" />
            </div>
            {team.code} {team.name}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr repeat(6, 60px)', padding: '6px 8px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 9, fontWeight: 900, color: 'var(--text-muted)' }}>{activeTeam}</div>
          {STAT_COLUMNS.map(col => (
             <div key={col.label} style={{ textAlign: 'center', fontSize: 8, fontWeight: 900, color: 'var(--text-muted)', opacity: 0.6 }}>{col.label}</div>
          ))}
        </div>

        <div style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border-soft)' }}>
          <span style={{ fontSize: 8, fontWeight: 900, color: 'var(--text-muted)', textTransform: 'uppercase' }}>LEGEND</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 0, height: 0, borderLeft: '3px solid transparent', borderRight: '3px solid transparent', borderBottom: '5px solid var(--green)' }} />
            <span style={{ fontSize: 8, color: 'var(--text-muted)', fontWeight: 700 }}>over</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 0, height: 0, borderLeft: '3px solid transparent', borderRight: '3px solid transparent', borderTop: '5px solid var(--error)' }} />
            <span style={{ fontSize: 8, color: 'var(--text-muted)', fontWeight: 700 }}>under</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ fontSize: 7, fontWeight: 950, color: 'var(--green)', border: '1px solid var(--green)', padding: '0px 3px', borderRadius: 2 }}>LINE</div>
            <span style={{ fontSize: 8, color: 'var(--text-muted)', fontWeight: 700 }}>odds</span>
          </div>
        </div>

        {mockPlayers.map((player, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr repeat(6, 60px)', padding: '6px 8px', borderBottom: '1px solid var(--border-soft)', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--blue)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 950 }}>
                {player.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800 }}>{player.name}</div>
                <div style={{ fontSize: 8, color: 'var(--text-muted)' }}><span style={{ background: 'var(--bg-alpha-05)', padding: '0px 3px', borderRadius: 2 }}>{player.pos}</span> {player.num}</div>
              </div>
            </div>
            {STAT_COLUMNS.map(col => (
              <div key={col.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 950, color: col.key === 'pts' ? 'var(--yellow)' : 'var(--text-primary)' }}>{player[col.key]}</div>
                <div style={{ fontSize: 7, fontWeight: 800, color: 'var(--text-muted)' }}>{col.label}</div>
              </div>
            ))}
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: -4, paddingRight: 60 }}>
               <div style={{ fontSize: 8, fontWeight: 800, color: 'var(--text-muted)' }}><span style={{ color: 'var(--text-secondary)' }}>{player.fg}</span> FG%</div>
               <div style={{ fontSize: 8, fontWeight: 800, color: 'var(--text-muted)' }}><span style={{ color: 'var(--text-secondary)' }}>{player.p3}</span> 3P%</div>
               <div style={{ fontSize: 8, fontWeight: 800, color: 'var(--text-muted)' }}><span style={{ color: 'var(--text-secondary)' }}>{player.ft}</span> FT%</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const renderBetting = () => (
    <div style={{ padding: '10px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={{ padding: '4px 10px', borderRadius: 20, background: 'var(--green)', color: '#000', fontSize: 9, fontWeight: 900, border: 'none' }}>ALL (46)</button>
          <button style={{ padding: '4px 10px', borderRadius: 20, background: 'var(--bg-alpha-05)', color: 'var(--text-muted)', fontSize: 9, fontWeight: 900, border: '1px solid var(--border)' }}>{awayCode}</button>
          <button style={{ padding: '4px 10px', borderRadius: 20, background: 'var(--bg-alpha-05)', color: 'var(--text-muted)', fontSize: 9, fontWeight: 900, border: '1px solid var(--border)' }}>{homeCode}</button>
        </div>
        <div style={{ fontSize: 8, color: 'var(--green)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--green)' }} /> LIVE ODDS
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ background: 'var(--bg-alpha-05)', border: '1px solid var(--border)', padding: '4px 8px', borderRadius: 4, fontSize: 9, fontWeight: 800, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
          ALL MARKETS <ChevronDown size={10} />
        </div>
        <span style={{ fontSize: 8, color: 'var(--text-muted)', fontWeight: 900, textTransform: 'uppercase' }}>46 PROPS</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {MOCK_PROPS.map((prop, i) => (
          <div key={i} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 950 }}>{prop.player}</div>
                <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-muted)' }}>{prop.team}</div>
              </div>
              <div style={{ background: `${prop.color}15`, color: prop.color, padding: '4px 8px', borderRadius: 4, fontSize: 9, fontWeight: 950, border: `1px solid ${prop.color}40`, display: 'flex', alignItems: 'center', gap: 4 }}>
                 {prop.market} {prop.decision} <Zap size={10} fill={prop.color} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 10 }}>
               {[
                 { l: 'LINE', v: prop.line, c: 'var(--text-primary)' },
                 { l: 'PROJ', v: prop.proj, c: 'var(--text-primary)' },
                 { l: 'EDGE', v: prop.edge, c: prop.color },
                 { l: 'IMPLIED', v: prop.implied, c: 'var(--text-primary)' }
               ].map(s => (
                 <div key={s.l} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 8, color: 'var(--text-muted)', fontWeight: 800 }}>{s.l}</div>
                    <div style={{ fontSize: 16, fontWeight: 950, color: s.c }}>{s.v}</div>
                 </div>
               ))}
            </div>

            <div style={{ height: 3, background: 'var(--bg-alpha-05)', borderRadius: 2, marginBottom: 10, position: 'relative', overflow: 'hidden' }}>
               <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'var(--border)' }} />
               <div style={{ 
                 position: 'absolute', 
                 left: prop.edge.startsWith('+') ? '50%' : `calc(50% - ${Math.abs(parseInt(prop.edge)) / 4}%)`, 
                 width: `${Math.abs(parseInt(prop.edge)) / 4}%`, 
                 top: 0, bottom: 0, background: prop.color 
               }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
               {[
                 { l: 'DEF PRES', v: prop.drivers.defPres },
                 { l: 'INJ RISK', v: prop.drivers.injRisk },
                 { l: 'BLOWOUT', v: prop.drivers.blowout }
               ].map(d => (
                 <div key={d.l}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 7, fontWeight: 900, marginBottom: 2 }}>
                      <span style={{ color: 'var(--text-muted)' }}>{d.l}</span>
                      <span>{d.v}</span>
                   </div>
                   <div style={{ height: 2, background: 'var(--bg-alpha-05)', borderRadius: 1 }}>
                      <div style={{ width: `${d.v}%`, height: '100%', background: 'var(--text-muted)', borderRadius: 1 }} />
                   </div>
                 </div>
               ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  const renderBoxScore = () => {
    if (!hasData) {
      return (
        <div style={{ padding: '60px 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Clock size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
          <div style={{ fontSize: 13, fontWeight: 950, textTransform: 'uppercase', letterSpacing: 1 }}>Game Has Not Started</div>
          <div style={{ fontSize: 10, marginTop: 4 }}>Full box score data will be available at tip-off.</div>
        </div>
      );
    }
    return (
      <div style={{ padding: '10px 20px' }}>
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-alpha-02)' }}>
                <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 9, fontWeight: 900, color: 'var(--text-muted)' }}>TEAM</th>
                {['Q1','Q2','Q3','Q4','T'].map(h => (
                  <th key={h} style={{ textAlign: 'center', padding: '8px', fontSize: 9, fontWeight: 900, color: h === 'T' ? 'var(--text-primary)' : 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: awayName, q: [28, 31, 24, 31], code: awayCode },
                { name: homeName, q: [25, 26, 28, 24], code: homeCode }
              ].map((team, i) => (
                <tr key={i} style={{ borderBottom: i === 0 ? '1px solid var(--border-soft)' : 'none' }}>
                  <td style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${team.code}`} style={{ width: '70%', height: '70%' }} alt="" />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 800 }}>{team.name}</span>
                  </td>
                  {team.q.map((score, idx) => (
                     <td key={idx} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>{score}</td>
                  ))}
                  <td style={{ textAlign: 'center', fontSize: 13, fontWeight: 950, color: (i === 0 && awayScore > homeScore) || (i === 1 && homeScore > awayScore) ? 'var(--yellow)' : 'var(--text-primary)' }}>{team.q.reduce((a, b) => a + b, 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderTeamStats = () => (
    <div style={{ padding: '10px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: 12 }}>
        <h3 style={{ fontSize: 9, fontWeight: 950, color: 'var(--text-muted)', marginBottom: 10, letterSpacing: 1 }}>WIN PROBABILITY</h3>
        <div style={{ display: 'flex', height: 4, borderRadius: 2, overflow: 'hidden', background: 'var(--bg-alpha-05)', marginBottom: 8 }}>
          <div style={{ flex: 64, background: 'var(--yellow)' }} />
          <div style={{ flex: 36, background: 'var(--bg-alpha-10)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, fontWeight: 900 }}>
          <span>{awayCode} 64.2%</span>
          <span>{homeCode} 35.8%</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
        {[
          { label: 'FIELD GOAL %', away: '48.2%', home: '42.1%', winner: 'away' },
          { label: '3-POINT %', away: '38.4%', home: '34.6%', winner: 'away' },
          { label: 'REBOUNDS', away: '44', home: '46', winner: 'home' },
          { label: 'ASSISTS', away: '28', home: '22', winner: 'away' }
        ].map((metric, i) => (
          <div key={i} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 8, fontWeight: 900, color: 'var(--text-muted)', marginBottom: 10 }}>{metric.label}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
               <div>
                  <div style={{ fontSize: 8, color: 'var(--text-muted)' }}>{awayCode}</div>
                  <div style={{ fontSize: 16, fontWeight: 950, color: metric.winner === 'away' ? 'var(--yellow)' : 'var(--text-primary)' }}>{metric.away}</div>
               </div>
               <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 8, color: 'var(--text-muted)' }}>{homeCode}</div>
                  <div style={{ fontSize: 16, fontWeight: 950, color: metric.winner === 'home' ? 'var(--yellow)' : 'var(--text-primary)' }}>{metric.home}</div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="game-details-full" style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', padding: '0 0 80px' }}>
      
      <div style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button 
          onClick={() => navigate('/picks')}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700 }}
        >
          <ChevronLeft size={16} /> Back
        </button>
      </div>

      <div style={{ padding: '0px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 30 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6, margin: '0 auto 6px' }}>
            <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${awayCode}`} style={{ width: '60%', height: '60%' }} alt="" />
          </div>
          <h2 style={{ fontSize: 14, fontWeight: 950, margin: 0 }}>{awayName}</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {hasData ? (
            <>
              <div style={{ fontSize: 32, fontWeight: 950, color: awayScore > homeScore ? 'var(--yellow)' : 'var(--text-primary)' }}>{awayScore}</div>
              <div style={{ textAlign: 'center' }}>
                 <div style={{ fontSize: 9, fontWeight: 900, color: 'var(--text-muted)', letterSpacing: 1 }}>FINAL</div>
                 <div style={{ fontSize: 8, fontWeight: 700, color: 'var(--text-muted)', opacity: 0.5 }}>APR 21</div>
              </div>
              <div style={{ fontSize: 32, fontWeight: 950, color: homeScore > awayScore ? 'var(--yellow)' : 'var(--text-primary)' }}>{homeScore}</div>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
               <div style={{ fontSize: 18, fontWeight: 950, color: 'var(--text-primary)', letterSpacing: 2 }}>VS</div>
               <div style={{ fontSize: 9, fontWeight: 900, color: 'var(--yellow)', textTransform: 'uppercase', marginTop: 4 }}>PRE-GAME</div>
               <div style={{ fontSize: 8, fontWeight: 700, color: 'var(--text-muted)', opacity: 0.5 }}>7:30 PM ET</div>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6, margin: '0 auto 6px' }}>
            <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${homeCode}`} style={{ width: '60%', height: '60%' }} alt="" />
          </div>
          <h2 style={{ fontSize: 14, fontWeight: 950, margin: 0 }}>{homeName}</h2>
        </div>
      </div>

      <div style={{ borderBottom: '1px solid var(--border)', padding: '0 20px', display: 'flex', gap: 24 }}>
        {['PLAYER STATS', 'TEAM STATS', 'BOX SCORE', 'BETTING'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 0', background: 'none', border: 'none',
              color: activeTab === tab ? 'var(--yellow)' : 'var(--text-muted)',
              fontSize: 10, fontWeight: 900, cursor: 'pointer',
              borderBottom: activeTab === tab ? '2px solid var(--yellow)' : '2px solid transparent',
              transition: '0.2s'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'PLAYER STATS' && renderPlayerStats()}
      {activeTab === 'BETTING' && renderBetting()}
      {activeTab === 'BOX SCORE' && renderBoxScore()}
      {activeTab === 'TEAM STATS' && renderTeamStats()}

    </div>
  );
}
