import { useEffect, useState } from "react"
import { getMyProfile, type Profile } from "@/app/features/profile/api/profileApi"

export function useMyProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const loadProfile = async () => {
      setLoading(true)
      setError(null)

      const { data, error } = await getMyProfile()

      if (!mounted) return

      if (error) {
        setProfile(null)
        setError("No fue posible cargar el perfil.")
        setLoading(false)
        return
      }

      setProfile(data)
      setLoading(false)
    }

    void loadProfile()

    return () => {
      mounted = false
    }
  }, [])

  return { profile, loading, error }
}