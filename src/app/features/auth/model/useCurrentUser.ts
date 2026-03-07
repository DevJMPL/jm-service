import { useEffect, useState } from "react"
import { supabase } from "@/shared/lib/supabase/client"

export function useCurrentUser() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser()

      if (!mounted) return

      if (error || !data.user) {
        setUserId(null)
      } else {
        setUserId(data.user.id)
      }

      setLoading(false)
    }

    loadUser()

    return () => {
      mounted = false
    }
  }, [])

  return { userId, loading }
}