import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "@/shared/lib/supabase/client";
import { useWorkspaceStore } from "@/app/features/workspaces/model/useWorkspace";

type AuthState = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  setSession: (session: Session | null) => Promise<void>;
  initialize: () => Promise<void>;
  clear: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  setSession: async (session) => {
    const workspaceStore = useWorkspaceStore.getState();

    set({
      session,
      user: session?.user ?? null,
      error: null,
    });

    if (session?.user?.id) {
      try {
        await workspaceStore.loadWorkspaces(session.user.id);
      } catch (error) {
        console.error("No se pudieron cargar los workspaces del usuario", error);
      }
    } else {
      workspaceStore.clear();
    }
  },

  initialize: async () => {
    const workspaceStore = useWorkspaceStore.getState();

    set({
      isLoading: true,
      error: null,
    });

    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      const session = data.session ?? null;

      set({
        session,
        user: session?.user ?? null,
        isLoading: false,
        isInitialized: true,
        error: null,
      });

      if (session?.user?.id) {
        try {
          await workspaceStore.loadWorkspaces(session.user.id);
        } catch (workspaceError) {
          console.error(
            "No se pudieron cargar los workspaces durante la inicialización",
            workspaceError,
          );
        }
      } else {
        workspaceStore.clear();
      }
    } catch (error) {
      workspaceStore.clear();

      set({
        session: null,
        user: null,
        isLoading: false,
        isInitialized: true,
        error:
          error instanceof Error
            ? error.message
            : "No se pudo inicializar la sesión.",
      });
    }
  },

  clear: () => {
    useWorkspaceStore.getState().clear();

    set({
      user: null,
      session: null,
      isLoading: false,
      isInitialized: true,
      error: null,
    });
  },
}));

export function useAuth() {
  return useAuthStore();
}

export default useAuthStore;