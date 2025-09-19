import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { injectEnvToWindow } from './env-bridge.js'

// Inject Vite env into the globals your App expects
injectEnvToWindow()

// Register PWA Service Worker (via vite-plugin-pwa)
import { registerSW } from 'virtual:pwa-register'
registerSW({ immediate: true })

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
