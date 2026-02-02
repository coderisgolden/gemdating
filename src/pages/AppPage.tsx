import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"



export default function AppPage() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">App</h1>

      <button
        onClick={handleLogout}
        className="mt-4 border p-2"
      >
        Logout
      </button>
    </div>
  )
}
