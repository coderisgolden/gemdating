// features/discover/hooks/useDiscover.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useDiscover() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfiles() {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('onboarding_complete', true)
        .neq('id', user?.id) // Visa inte dig själv
        .order('updated_at', { ascending: false })
        .limit(20)

      if (!error && data) setProfiles(data)
      setLoading(false)
    }

    loadProfiles()
  }, [])

  return { profiles, loading }
}
