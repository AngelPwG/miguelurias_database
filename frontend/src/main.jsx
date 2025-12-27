import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // 👈 ESTE ES EL ENCHUFE
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 👇 Aquí envolvemos la App para que funcionen las rutas */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)