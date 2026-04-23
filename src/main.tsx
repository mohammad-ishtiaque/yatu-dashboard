/// <reference types="vite/client" />
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'

// StrictMode: renders components twice in development to catch side effects.
// It does NOT run in production — zero performance cost in prod.
// Keep it always — it catches bugs before they hit users.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
