import { supabase } from "@/shared/lib/supabase/client"

export async function login(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password })
}

export async function register(email: string, password: string, fullName?: string) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName ?? "",
      },
    },
  })
}

export async function logout() {
  return supabase.auth.signOut()
}