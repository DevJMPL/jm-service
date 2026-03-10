import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/app/features/auth/model/useAuth"
import { AppLayout } from "@/app/layouts/AppLayout"

export function ProtectedLayout() {
  const { loading, isAuthed } = useAuth()

  if (loading) return null

  if (!isAuthed) {
    return <Navigate to="/login" replace />
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}