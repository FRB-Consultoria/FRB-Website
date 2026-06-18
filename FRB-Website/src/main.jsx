import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// ── PWA: registra o service worker (somente no build de produção) ──
// Habilita instalação na tela inicial com o ícone da FRB e suporte offline.
// Em dev (npm run dev) não registra para não interferir no HMR do Vite.
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("[PWA] Falha ao registrar o service worker:", err);
    });
  });
}
