import { Navigate, useLocation } from "react-router-dom";
import type { JSX } from "react";

import { useAuthStore } from "@/app/features/auth/model/useAuth";
import { useWorkspaceStore } from "@/app/features/workspaces/model/useWorkspace";

type AuthGuardProps = {
  children: JSX.Element;
};

export function AuthGuard({ children }: AuthGuardProps) {
  const location = useLocation();
  const { user, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

type GuestGuardProps = {
  children: JSX.Element;
};

export function GuestGuard({ children }: GuestGuardProps) {
  const { user, isInitialized } = useAuthStore();
  const { workspaces, hasLoaded } = useWorkspaceStore();

  if (!isInitialized) {
    return null;
  }

  if (!user) {
    return children;
  }

  // Esperar a que se carguen workspaces
  if (!hasLoaded) {
    return null;
  }

  // Usuario autenticado sin workspace → onboarding
  if (workspaces.length === 0) {
    return <Navigate to="/onboarding/workspace" replace />;
  }

  // Usuario autenticado con workspace → home
  return <Navigate to="/" replace />;
}