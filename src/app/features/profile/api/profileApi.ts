import { supabase } from "@/shared/lib/supabase/client"

export interface Profile {
  id: string
  full_name: string | null
  email: string | null
  role: "admin" | "supervisor" | "agent"
  created_at: string
  updated_at: string
}

export async function getMyProfile() {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return {
      data: null,
      error: authError ?? new Error("No se encontró el usuario autenticado."),
    }
  }

  return supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>()
}