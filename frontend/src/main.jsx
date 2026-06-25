/**
 * AI Career Assistant - Application Entry Point
 * 
 * Sets up React with StrictMode and BrowserRouter for SPA navigation.
 * StrictMode helps detect potential problems during development.
 * BrowserRouter enables client-side routing for the dashboard modules.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Create root and render the application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
