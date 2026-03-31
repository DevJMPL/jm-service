import { supabase } from "@/shared/lib/supabase/client";
import type { Workspace } from "@/app/features/workspaces/api/workspacesApi";

export type RegisterWithWorkspaceInput = {
  fullName: string;
  email: string;
  password: string;
};

export type AuthUserSummary = {
  id: string;
  email?: string | null;
};

export type RegisterResult = {
  user: AuthUserSummary | null;
  requiresEmailConfirmation: boolean;
};

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signUpWithEmail(email: string, password: string): Promise<RegisterResult> {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) {
    throw error;
  }

  return {
    user: data.user
      ? {
          id: data.user.id,
          email: data.user.email,
        }
      : null,
    requiresEmailConfirmation: !data.session,
  };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

/**
 * Registro simple (ya no crea workspace aquí)
 */
export async function registerWithWorkspace(
  input: RegisterWithWorkspaceInput,
): Promise<RegisterResult> {
  const result = await signUpWithEmail(input.email, input.password);

  if (!result.user) {
    throw new Error("No se pudo crear el usuario.");
  }

  return result;
}

/**
 * Onboarding: crea profile + workspace + membership (RPC)
 */
export async function completeInitialWorkspaceSetup(params: {
  fullName: string;
  workspaceName: string;
}): Promise<{
  workspace: Workspace;
}> {
  const { data, error } = await supabase.rpc("create_first_workspace", {
    p_full_name: params.fullName,
    p_workspace_name: params.workspaceName,
  });

  if (error) {
    throw error;
  }

  const row = Array.isArray(data) ? data[0] : data;

  if (!row?.workspace_id) {
    throw new Error("No fue posible crear el workspace inicial.");
  }

  return {
    workspace: {
      id: row.workspace_id,
      name: row.workspace_name,
      slug: row.workspace_slug,
      created_by: "",
      created_at: "",
      updated_at: "",
    },
  };
}

/**
 * Aliases
 */
export const login = signInWithEmail;
export const register = signUpWithEmail;
export const logout = signOut;