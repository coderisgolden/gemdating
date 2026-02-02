import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import type { User } from "@supabase/supabase-js"

type Profile = { onboarding_complete: boolean } | null

type AuthContextType = {
  user: User | null
  profile: Profile
  loading: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile>(null)
  const [loading, setLoading] = useState(true)

  // Denna funktion ersätter både ensureProfile och loadProfile.
  // Den skapar profilen om den saknas, annars hämtar den bara data.
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .upsert({ id: userId }, { onConflict: 'id' })
        .select("onboarding_complete")
        .single()
      
      if (error) throw error
      if (data) setProfile(data)
    } catch (err) {
      console.error("Error in fetchProfile:", err)
    }
  }

  // Exponeras så att t.ex. OnboardingPage kan trigga en omhämtning
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  useEffect(() => {
  let isMounted = true

  // 1. Initial kontroll vid start
  const initializeAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!isMounted) return
    
    const currentUser = session?.user ?? null
    setUser(currentUser)
    
    if (currentUser) {
      // VIKTIGT: Vi väntar (await) på profilen HÄR innan vi sätter loading(false)
      // Detta stoppar blinket vid siduppdatering/start
      await fetchProfile(currentUser.id)
    }
    
    setLoading(false)
  }

  initializeAuth()

  // 2. Lyssna på auth-förändringar
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (!isMounted) return

    const currentUser = session?.user ?? null
    
    // Vid utloggning: rensa allt och sluta ladda
    if (event === 'SIGNED_OUT') {
      setUser(null)
      setProfile(null)
      setLoading(false)
      return
    }

    // Vid inloggning eller token-förnyelse
    if (currentUser && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
      setUser(currentUser)
      
      // För att undvika blinket vid JUST inloggning (när man trycker på knappen)
      // kan vi sätta loading(true) medan vi hämtar den nya profilen
      setLoading(true) 
      
      // Använd fortfarande setTimeout för att undvika deadlock-buggen vid tab-swap
      setTimeout(async () => {
        await fetchProfile(currentUser.id)
        if (isMounted) setLoading(false)
      }, 0)
    }
  })

  return () => {
    isMounted = false
    subscription.unsubscribe()
  }
}, [])

  return (
    <AuthContext.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
