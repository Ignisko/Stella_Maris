import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Block browser pinch-to-zoom
// Trackpad two-finger pinch sends wheel events with ctrlKey=true.
// The browser intercepts these to zoom the whole page, which moves all UI
// elements off-screen. We capture and suppress them here so Three.js
// OrbitControls can handle zoom exclusively.
document.addEventListener('wheel', (e) => {
  if (e.ctrlKey) e.preventDefault();
}, { passive: false });

// Also block Ctrl+Plus / Ctrl+Minus / Ctrl+0 keyboard zoom shortcuts
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=' || e.key === '0')) {
    e.preventDefault();
  }
}, { passive: false });
// End block browser pinch-to-zoom

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
