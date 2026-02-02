import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function OnboardingPage() {
  const { user, refreshProfile } = useAuth() // <--- Hämta refreshProfile
  const navigate = useNavigate()

  const finishOnboarding = async () => {
    if (!user) return

    // 1. Uppdatera databasen
    const { error } = await supabase
      .from("profiles")
      .update({ onboarding_complete: true })
      .eq("id", user.id)

    if (error) {
      console.error(error)
      return
    }

    // 2. Uppdatera din globala Context så Guard ser ändringen direkt
    await refreshProfile()

    // 3. Nu kan du navigera säkert
    navigate("/app")
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Välkommen!</h1>
      <p>Vi behöver bara ställa in det sista...</p>
      <button 
        onClick={finishOnboarding}
        className="mt-4 bg-blue-500 text-white p-2 rounded"
      >
        Slutför onboarding
      </button>
    </div>
  )
}

