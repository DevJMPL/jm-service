import { useEffect, useState } from "react"
import type { Session } from "@supabase/supabase-js"
import { supabase } from "@/shared/lib/supabase/client"

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return
      if (error) {
        setSession(null)
      } else {
        setSession(data.session ?? null)
      }
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null)
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  return { session, loading, isAuthed: !!session }
}