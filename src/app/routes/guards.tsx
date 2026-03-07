import { Navigate } from "react-router-dom"
import { useAuth } from "@/app/features/auth/model/useAuth"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { loading, isAuthed } = useAuth()
  if (loading) return null
  return isAuthed ? children : <Navigate to="/login" replace />
}

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { loading, isAuthed } = useAuth()
  if (loading) return null
  return isAuthed ? <Navigate to="/" replace /> : children
}