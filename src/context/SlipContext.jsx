import React, { createContext, useContext, useState } from 'react';

const SlipContext = createContext();

export function SlipProvider({ children }) {
  const [slip, setSlip] = useState([]);

  const togglePick = (pick) => {
    setSlip(prev => {
      const exists = prev.find(p => p.id === pick.id);
      if (exists) return prev.filter(p => p.id !== pick.id);
      return [...prev, pick];
    });
  };

  const removePick = (id) => {
    setSlip(prev => prev.filter(p => p.id !== id));
  };

  const clearSlip = () => setSlip([]);

  return (
    <SlipContext.Provider value={{ slip, togglePick, removePick, clearSlip }}>
      {children}
    </SlipContext.Provider>
  );
}

export function useSlip() {
  const context = useContext(SlipContext);
  if (!context) throw new Error('useSlip must be used within a SlipProvider');
  return context;
}
