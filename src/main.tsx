import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import "./index.css"
import { supabase } from "@/lib/supabase"

supabase.auth.onAuthStateChange((_event, _session) => {
  if (window.location.hash.includes("access_token")) {
    window.history.replaceState(
      null,
      "",
      window.location.pathname
    )
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
