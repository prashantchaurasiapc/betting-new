import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import { SlipProvider } from './context/SlipContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SlipProvider>
      <App />
    </SlipProvider>
  </React.StrictMode>,
)
