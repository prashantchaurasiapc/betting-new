import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import { SlipProvider } from './context/SlipContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { GameProvider } from './context/GameContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <GameProvider>
        <SlipProvider>
          <App />
        </SlipProvider>
      </GameProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
