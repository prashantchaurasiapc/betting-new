import React, { useState } from 'react'
import { PLAYER_PROPS } from '../lib/data.js'
import PropsTable from '../components/picks/PropsTable'
import BigMoversTab from '../components/picks/BigMoversTab'
import BestCombosTab from '../components/picks/BestCombosTab'
import PickDetailDrawer from '../components/picks/PickDetailDrawer'

import PPSlipTab from '../components/picks/PPSlipTab'
import RecommendedTab from '../components/picks/RecommendedTab'

import { useSlip } from '../context/SlipContext'

export default function Picks() {
  const [tab, setTab] = useState('top')
  const [selectedPick, setSelectedPick] = useState(null)
  const { slip, togglePick, removePick } = useSlip()

  const TABS = [
    {key:'top',         label:'Top Picks',       badge:null},
    {key:'recommended', label:'Recommended v1', badge:null},
    {key:'ppslip',      label:'PP Slip β',       badge: slip.length > 0 ? slip.length : null},
    {key:'movers',      label:'Big Movers',      badge:null},
    {key:'combos',      label:'Best Combos',     badge:null},
  ]

  return (
    <div className="anim-fade">
      <div className="page-header">
        <h1 className="page-title">Top Picks</h1>
        <p className="page-sub">Model-driven player prop projections for today's slate.</p>
      </div>

      <div className="tab-bar">
        {TABS.map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key)} className={`tab-btn${tab===t.key?' active':''}`}>
            {t.label}
            {t.badge!==null && <span className="tab-count">{t.badge}</span>}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {tab === 'top' && (
          <PropsTable 
            data={PLAYER_PROPS} 
            onSelectPick={setSelectedPick} 
            selectedPickId={selectedPick?.id}
            slip={slip}
            onToggleSlip={togglePick}
          />
        )}
        {tab === 'ppslip' && (
          <PPSlipTab slip={slip} onRemove={removePick} />
        )}
        {tab === 'recommended' && <RecommendedTab slip={slip} onToggleSlip={togglePick} />}
        {tab === 'movers' && <BigMoversTab />}
        {tab === 'combos' && <BestCombosTab />}
      </div>

      <PickDetailDrawer 
        pick={selectedPick} 
        onClose={() => setSelectedPick(null)} 
        onToggleSlip={togglePick}
        isInSlip={slip.some(p => p.id === selectedPick?.id)}
      />
    </div>
  )
}
