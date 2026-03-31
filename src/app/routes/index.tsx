import { createBrowserRouter, Navigate } from "react-router-dom";

import { GuestGuard } from "@/app/routes/guards";
import { ProtectedLayout } from "@/app/routes/ProtectedLayout";

import { AppLayout } from "@/app/layouts/AppLayout";

import { HomePage } from "@/app/pages/HomePage";
import { NotFoundPage } from "@/app/pages/NotFoundPage";

import { LoginPage } from "@/app/features/auth/ui/LoginPage";
import { RegisterPage } from "@/app/features/auth/ui/RegisterPage";

import { CustomersPage } from "@/app/features/customers/ui/CustomersPage";
import { CustomerDetailPage } from "@/app/features/customers/ui/CustomerDetailPage";
import { TicketsPage } from "@/app/features/tickets/ui/TicketsPage";
import { CasesPage } from "@/app/features/cases/ui/CasesPage";
import { ReportsPage } from "@/app/features/reports/ui/ReportsPage";
import { SettingsPage } from "@/app/features/settings/ui/SettingsPage";
import { FirstWorkspacePage } from "@/app/features/workspaces/ui/FirstWorkspacePage";

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
        element: (
          <AppLayout>
            <HomePage />
          </AppLayout>
        ),
      },
      {
        path: "customers",
        element: (
          <AppLayout>
            <CustomersPage />
          </AppLayout>
        ),
      },
      {
        path: "customers/:customerId",
        element: (
          <AppLayout>
            <CustomerDetailPage />
          </AppLayout>
        ),
      },
      {
        path: "tickets",
        element: (
          <AppLayout>
            <TicketsPage />
          </AppLayout>
        ),
      },
      {
        path: "cases",
        element: (
          <AppLayout>
            <CasesPage />
          </AppLayout>
        ),
      },
      {
        path: "reports",
        element: (
          <AppLayout>
            <ReportsPage />
          </AppLayout>
        ),
      },
      {
        path: "settings",
        element: (
          <AppLayout>
            <SettingsPage />
          </AppLayout>
        ),
      },
      {
        path: "onboarding/workspace",
        element: <FirstWorkspacePage />,
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
]);

export default router;