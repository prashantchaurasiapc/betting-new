import React, { useState, useRef, useCallback } from 'react';
import { Upload, ImageIcon, Zap, CheckCircle2, AlertCircle, X, RefreshCw, Type, Users } from 'lucide-react';
import { parseGameSnapshot } from '../../lib/parseGameSnapshot';
import { useGame } from '../../context/GameContext';
import { useTheme } from '../../context/ThemeContext';

export default function SnapshotUploader({ onClose, onSuccess }) {
  const { setGameFromSnapshot, setGameFromSelector, setParseStatus, setParseError, parseError } = useGame();
  const { theme } = useTheme();

  const [method, setMethod] = useState('auto'); // 'auto' | 'manual'
  const [phase, setPhase] = useState('idle'); // idle | uploading | parsing | done | error
  const [preview, setPreview] = useState(null);
  const [parsedSnapshot, setParsedSnapshot] = useState(null);
  
  // Manual Entry State
  const [awayTeam, setAwayTeam] = useState('DET');
  const [homeTeam, setHomeTeam] = useState('ORL');
  const [manualData, setManualData] = useState('');

  const inputRef = useRef(null);

  const processFile = useCallback(async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setPhase('error');
      setParseError('Please upload a valid image file.');
      return;
    }

    setPreview(URL.createObjectURL(file));
    setPhase('uploading');
    await new Promise(r => setTimeout(r, 600));

    setPhase('parsing');
    setParseStatus('parsing');

    try {
      const snapshot = await parseGameSnapshot(file);
      setParsedSnapshot(snapshot);
      setPhase('done');
      setGameFromSnapshot(snapshot);
      onSuccess?.(snapshot);
    } catch (err) {
      setPhase('error');
      setParseError(err.message || 'Parsing failed.');
      setParseStatus('error');
    }
  }, [setGameFromSnapshot, setParseStatus, setParseError, onSuccess]);

  const handleManualSubmit = () => {
    if (!manualData.trim()) return;
    setPhase('parsing');
    setTimeout(() => {
      const manualSnapshot = {
        awayTeam: { code: awayTeam, name: awayTeam },
        homeTeam: { code: homeTeam, name: homeTeam },
        gameLabel: 'Manual Import',
        id: `${awayTeam}-${homeTeam}-manual`,
        date: new Date().toLocaleDateString(),
        status: 'Final'
      };
      setGameFromSelector(
        { away: manualSnapshot.awayTeam, home: manualSnapshot.homeTeam, id: 'manual' },
        { label: 'Manual Import', id: 'm1' }
      );
      setPhase('done');
      onSuccess?.(manualSnapshot);
    }, 1000);
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const reset = () => {
    setPhase('idle');
    setPreview(null);
    setParsedSnapshot(null);
    setParseError(null);
    setManualData('');
  };

  return (
    <div className="snapshot-uploader-card" style={{
      background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 20, padding: '24px', boxShadow: 'var(--shadow-lg)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Upload size={18} color="var(--blue)" /> Import Game Engine
          </h3>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '4px 0 0' }}>Set active game context via AI parse or manual entry.</p>
        </div>
        <button onClick={onClose} style={{ background: 'var(--bg-alpha-05)', border: 'none', borderRadius: '50%', cursor: 'pointer', padding: 6 }}>
          <X size={16} />
        </button>
      </div>

      {phase === 'idle' && (
        <div className="anim-fade">
          {/* Method Tabs */}
          <div style={{ display: 'flex', background: 'var(--bg-alpha-05)', borderRadius: 12, padding: 4, marginBottom: 20 }}>
            <button 
              onClick={() => setMethod('auto')}
              style={{ flex: 1, padding: '8px', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: method === 'auto' ? 'var(--blue)' : 'transparent', color: method === 'auto' ? '#000' : 'var(--text-muted)' }}
            >
              <ImageIcon size={14} /> AUTO-PARSE
            </button>
            <button 
              onClick={() => setMethod('manual')}
              style={{ flex: 1, padding: '8px', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: method === 'manual' ? 'var(--blue)' : 'transparent', color: method === 'manual' ? '#000' : 'var(--text-muted)' }}
            >
              <Type size={14} /> MANUAL
            </button>
          </div>

          {method === 'auto' ? (
            <div 
              onClick={() => inputRef.current?.click()}
              style={{ border: '2px dashed var(--border)', borderRadius: 16, padding: '40px 20px', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-secondary)' }}
            >
              <Upload size={32} color="var(--text-muted)" style={{ marginBottom: 12 }} />
              <p style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px' }}>Drop Game Screenshot</p>
              <button className="btn-secondary" style={{ fontSize: 10 }}>Select File</button>
              <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileInput} />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>AWAY TEAM</label>
                  <select value={awayTeam} onChange={e => setAwayTeam(e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 12, fontWeight: 700 }}>
                    {['DET', 'ORL', 'NYK', 'ATL', 'PHI', 'BOS', 'OKC', 'PHX', 'LAL', 'HOU'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>HOME TEAM</label>
                  <select value={homeTeam} onChange={e => setHomeTeam(e.target.value)} style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 12, fontWeight: 700 }}>
                    {['ORL', 'DET', 'ATL', 'NYK', 'BOS', 'PHI', 'PHX', 'OKC', 'HOU', 'LAL'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <textarea 
                placeholder="Paste box score data..."
                value={manualData}
                onChange={e => setManualData(e.target.value)}
                style={{ width: '100%', height: 100, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, fontSize: 12, color: 'var(--text-primary)', resize: 'none' }}
              />
              <button onClick={handleManualSubmit} className="btn-primary" style={{ padding: '12px', fontWeight: 900 }}>INITIALIZE MANUAL SYNC</button>
            </div>
          )}
        </div>
      )}

      {phase === 'parsing' && (
        <div style={{ padding: '40px 0', textAlign: 'center' }}>
          <RefreshCw size={32} className="anim-spin" color="var(--blue)" style={{ marginBottom: 12 }} />
          <p style={{ fontSize: 14, fontWeight: 900 }}>PROCESSING DATA...</p>
        </div>
      )}

      {phase === 'done' && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <CheckCircle2 size={48} color="var(--green)" style={{ marginBottom: 16 }} />
          <h4 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>SUCCESS</h4>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>Game context synchronized successfully.</p>
          <button onClick={reset} className="btn-secondary" style={{ padding: '8px 20px' }}>Sync Another</button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .anim-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
