import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { UserCard } from "@/features/discover/components/UserCard"
import { SplashScreen } from "@/components/splashscreen"

export default function AppPage() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDiscover() {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('onboarding_complete', true)
        .neq('id', user?.id) // Don't show yourself
        .limit(20)

      if (!error && data) setProfiles(data)
      setLoading(false)
    }

    loadDiscover()
  }, [])

  if (loading) return <SplashScreen />

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Discover</h1>
        <p className="text-muted-foreground">Find interesting people nearby</p>
      </header>

      {profiles.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No one else has joined yet!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((p) => (
            <UserCard key={p.id} profile={p} />
          ))}
        </div>
      )}
    </div>
  )
}
