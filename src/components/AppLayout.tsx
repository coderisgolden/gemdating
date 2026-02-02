// components/AppLayout.tsx
import { Outlet, useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { supabase } from "../lib/supabase"

export default function AppLayout() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/") // Guard kommer sköta resten, men navigate är snyggt
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* NAVBAR */}
      <nav className="border-b p-4 flex justify-between items-center bg-white">
        <div className="flex gap-4 items-center">
          <Link to="/app" className="font-bold text-lg">Min App</Link>
          <span className="text-sm text-gray-500">Inloggad som: {user?.email}</span>
        </div>
        
        <button 
          onClick={handleLogout}
          className="bg-red-50 text-red-600 px-3 py-1 rounded border border-red-200 hover:bg-red-100 transition"
        >
          Logga ut
        </button>
      </nav>

      {/* SIDINNEHÅLL */}
      <main className="flex-1 p-6">
        <Outlet /> 
      </main>
    </div>
  )
}
