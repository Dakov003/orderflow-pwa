import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ensureAuth } from './firebase.js'

// Register PWA service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

async function boot() {
  try {
    // Initialize auth before rendering the app
    await ensureAuth();
    console.log('Auth initialized successfully');
  } catch (error) {
    console.warn('Auth initialization failed, running in demo mode:', error);
  }
  
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

boot();
