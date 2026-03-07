import { supabase } from "@/shared/lib/supabase/client"

export async function getMyProfile() {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { data: null, error: authError ?? new Error("User not found") }
  }

  return supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()
}