import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * GameSnapshot shape (normalized database object):
 * {
 *   id: string,                  // e.g. "PHX-OKC-G1"
 *   seriesId: string,            // e.g. "west-1"
 *   gameLabel: string,           // e.g. "Game 1"
 *   gameNumber: number,          // 1-7
 *   date: string,                // ISO or readable
 *   status: "Final" | "Live" | "Upcoming",
 *   homeTeam: { code, name, seed, score },
 *   awayTeam: { code, name, seed, score },
 *   winner: string | null,       // team code
 *   source: "manual" | "upload", // how it was set
 *   rawImageUrl: string | null,  // blob URL of uploaded file
 *   parsedAt: string,            // ISO timestamp
 *   contextFilters: {            // downstream filter applied to all modules
 *     seriesCode: string,        // "PHX@OKC"
 *     gameLabel: string,
 *   }
 * }
 */

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [activeGame, setActiveGame] = useState(null);
  const [parseStatus, setParseStatus] = useState('idle'); // idle | parsing | success | error
  const [parseError, setParseError] = useState(null);
  
  // Track upload status per gameId
  // Shape: { [gameId]: { awayLoaded: boolean, homeLoaded: boolean } }
  const [gameStatuses, setGameStatuses] = useState(() => {
    try {
      const saved = localStorage.getItem('genie_game_statuses');
      return saved ? JSON.parse(saved) : {};
    } catch (_) {
      return {};
    }
  });

  const updateGameStatus = useCallback((gameId, teamSide, loaded) => {
    setGameStatuses(prev => {
      const current = prev[gameId] || { awayLoaded: false, homeLoaded: false };
      const updated = {
        ...prev,
        [gameId]: {
          ...current,
          [`${teamSide}Loaded`]: loaded
        }
      };
      try {
        localStorage.setItem('genie_game_statuses', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  }, []);

  /**
   * Set a manually selected game as the active context
   * (original Postseason Navigator flow — no upload needed)
   */
  const setGameFromSelector = useCallback((series, game) => {
    const snapshot = {
      id: `${series.away.code}-${series.home.code}-${game.id}`,
      seriesId: series.id,
      gameLabel: game.label,
      gameNumber: parseInt(game.id.replace('g', '')) || 1,
      date: game.status === 'Final'
        ? game.date || 'Final'
        : game.time || 'Upcoming',
      status: game.status,
      homeTeam: { ...series.home, score: game.homeScore || series.home.score },
      awayTeam: { ...series.away, score: game.awayScore || series.away.score },
      winner: game.winner || null,
      source: 'manual',
      rawImageUrl: null,
      parsedAt: new Date().toISOString(),
      contextFilters: {
        seriesCode: `${series.away.code}@${series.home.code}`,
        gameLabel: game.label,
        awayScore: game.awayScore,
        homeScore: game.homeScore,
      },
    };
    setActiveGame(snapshot);
    setParseStatus('success');
    setParseError(null);
    // Persist for session refresh
    try {
      localStorage.setItem('genie_active_game', JSON.stringify(snapshot));
    } catch (_) {}
  }, []);

  /**
   * Set a parsed snapshot (from image upload pipeline) as the active context.
   * This is the "database object" representation.
   */
  const setGameFromSnapshot = useCallback((snapshot) => {
    setActiveGame(snapshot);
    setParseStatus('success');
    setParseError(null);
    try {
      localStorage.setItem('genie_active_game', JSON.stringify(snapshot));
    } catch (_) {}
  }, []);

  const clearActiveGame = useCallback(() => {
    setActiveGame(null);
    setParseStatus('idle');
    setParseError(null);
    try {
      localStorage.removeItem('genie_active_game');
    } catch (_) {}
  }, []);

  return (
    <GameContext.Provider value={{
      activeGame,
      parseStatus,
      parseError,
      gameStatuses,
      updateGameStatus,
      setParseStatus,
      setParseError,
      setGameFromSelector,
      setGameFromSnapshot,
      clearActiveGame,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within a GameProvider');
  return ctx;
}
