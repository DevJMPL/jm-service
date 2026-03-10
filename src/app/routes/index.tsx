import { createBrowserRouter, Navigate } from "react-router-dom"

import { GuestGuard } from "@/app/routes/guards"
import { ProtectedLayout } from "@/app/routes/ProtectedLayout"

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
    path: "/",
    element: <ProtectedLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "customers",
        element: <CustomersPage />,
      },
      {
        path: "customers/:customerId",
        element: <CustomerDetailPage />,
      },
      {
        path: "tickets",
        element: <TicketsPage />,
      },
      {
        path: "cases",
        element: <CasesPage />,
      },
      {
        path: "reports",
        element: <ReportsPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
])