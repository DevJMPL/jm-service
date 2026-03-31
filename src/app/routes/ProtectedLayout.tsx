import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthStore } from "@/app/features/auth/model/useAuth";
import { useWorkspaceStore } from "@/app/features/workspaces/model/useWorkspace";

export function ProtectedLayout() {
  const location = useLocation();

  const { user, isInitialized } = useAuthStore();
  const { workspaces, hasLoaded, isLoading } = useWorkspaceStore();

  if (!isInitialized) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (isLoading || !hasLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbfbfc]">
        <div className="rounded-2xl border border-[#eef2f7] bg-white px-6 py-5 shadow-[0_8px_30px_rgba(120,144,180,0.08)]">
          <p className="text-sm font-medium text-[#252733]">Cargando workspace...</p>
          <p className="mt-1 text-sm text-[#8f95a3]">
            Estamos preparando tu espacio de trabajo.
          </p>
        </div>
      </div>
    );
  }

  const isOnboardingRoute = location.pathname === "/onboarding/workspace";

  if (workspaces.length === 0 && !isOnboardingRoute) {
    return <Navigate to="/onboarding/workspace" replace />;
  }

  if (workspaces.length > 0 && isOnboardingRoute) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedLayout;