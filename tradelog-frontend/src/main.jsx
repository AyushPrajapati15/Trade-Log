import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#0E1420',
            color: '#E2EAF8',
            border: '1px solid #1C2840',
            borderRadius: '10px',
            fontFamily: 'Instrument Sans, sans-serif',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#05E8B4', secondary: '#080C14' } },
          error: { iconTheme: { primary: '#FF3D6B', secondary: '#080C14' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
