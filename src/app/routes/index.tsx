import { createBrowserRouter } from "react-router-dom"
import { AuthGuard, GuestGuard } from "@/app/routes/guards"

import { HomePage } from "@/app/pages/HomePage"
import { NotFoundPage } from "@/app/pages/NotFoundPage"

import { LoginPage } from "@/app/features/auth/ui/LoginPage"
import { RegisterPage } from "@/app/features/auth/ui/RegisterPage"

import { CustomersPage } from "@/app/features/customers/ui/CustomersPage"
import { CustomerDetailPage } from "@/app/features/customers/ui/CustomerDetailPage"
import { TicketsPage } from "@/app/features/tickets/ui/TicketsPage"
import { CasesPage } from "@/app/features/cases/ui/CasesPage"
import { ReportsPage } from "@/app/features/reports/ui/ReportsPage"
import { SettingsPage } from "@/app/features/settings/ui/SettingsPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthGuard>
        <HomePage />
      </AuthGuard>
    ),
  },
  {
    path: "/customers",
    element: (
      <AuthGuard>
        <CustomersPage />
      </AuthGuard>
    ),
  },
  {
    path: "/customers/:customerId",
    element: (
      <AuthGuard>
        <CustomerDetailPage />
      </AuthGuard>
    ),
  },
  {
    path: "/tickets",
    element: (
      <AuthGuard>
        <TicketsPage />
      </AuthGuard>
    ),
  },
  {
    path: "/cases",
    element: (
      <AuthGuard>
        <CasesPage />
      </AuthGuard>
    ),
  },
  {
    path: "/reports",
    element: (
      <AuthGuard>
        <ReportsPage />
      </AuthGuard>
    ),
  },
  {
    path: "/settings",
    element: (
      <AuthGuard>
        <SettingsPage />
      </AuthGuard>
    ),
  },
  {
    path: "/login",
    element: (
      <GuestGuard>
        <LoginPage />
      </GuestGuard>
    ),
  },
  {
    path: "/register",
    element: (
      <GuestGuard>
        <RegisterPage />
      </GuestGuard>
    ),
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
])