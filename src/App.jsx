import React, { Suspense, lazy, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar.jsx'
import TopBar from './components/layout/TopBar.jsx'

// Lazy load pages for better build performance
const Slate = lazy(() => import('./pages/Slate.jsx'))
const Picks = lazy(() => import('./pages/Picks.jsx'))
const Lineup = lazy(() => import('./pages/Lineup.jsx'))
const Performance = lazy(() => import('./pages/Performance.jsx'))
const Ledger = lazy(() => import('./pages/Ledger.jsx'))
const Engine = lazy(() => import('./pages/Engine.jsx'))
const Series = lazy(() => import('./pages/Series.jsx'))
const Policies = lazy(() => import('./pages/Policies.jsx'))
const Pipeline = lazy(() => import('./pages/Pipeline.jsx'))

// Loading fallback with luxury styling
const PageLoader = () => (
  <div style={{ 
    height: '60vh', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center',
    gap: 16
  }}>
    <div className="live-dot" style={{ width: 24, height: 24 }} />
    <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue)', letterSpacing: '0.1em' }}>SYNCHRONIZING ENGINE...</p>
  </div>
)

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar 
          collapsed={collapsed} 
          setCollapsed={setCollapsed} 
          mobileOpen={mobileOpen} 
          setMobileOpen={setMobileOpen} 
        />
        
        <div className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
          <TopBar onMenuClick={() => setMobileOpen(true)} />
          <div className="content-inner">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Slate />} />
                <Route path="/picks" element={<Picks />} />
                <Route path="/lineup" element={<Lineup />} />
                <Route path="/performance" element={<Performance />} />
                <Route path="/ledger" element={<Ledger />} />
                <Route path="/engine" element={<Engine />} />
                <Route path="/series" element={<Series />} />
                <Route path="/policies" element={<Policies />} />
                <Route path="/pipeline" element={<Pipeline />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </div>
    </BrowserRouter>
  )
}
