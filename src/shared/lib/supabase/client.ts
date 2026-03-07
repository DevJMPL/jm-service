import { createClient } from "@supabase/supabase-js"

const url = import.meta.env.VITE_SUPABASE_URL as string
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!url || !anon) {
  // Esto ayuda mucho cuando falta .env
  // (en runtime; TS no lo verá, pero el error será claro)
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env")
}

export const supabase = createClient(url, anon)