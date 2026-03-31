import { create } from "zustand";

import {
  getMyWorkspaces,
  type MyWorkspaceItem,
  type WorkspaceRole,
} from "@/app/features/workspaces/api/workspacesApi";

const STORAGE_KEY = "reach-service:active-workspace-id";

export type WorkspaceSummary = {
  id: string;
  name: string;
  slug: string;
  role: WorkspaceRole;
  membershipId: string;
};

type WorkspaceState = {
  workspaces: WorkspaceSummary[];
  activeWorkspaceId: string | null;
  isLoading: boolean;
  hasLoaded: boolean;
  error: string | null;
  setWorkspaces: (items: WorkspaceSummary[]) => void;
  setActiveWorkspaceId: (workspaceId: string | null) => void;
  loadWorkspaces: (profileId: string) => Promise<void>;
  reloadWorkspaces: (profileId: string) => Promise<void>;
  getActiveWorkspace: () => WorkspaceSummary | null;
  clear: () => void;
};

function getStoredActiveWorkspaceId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function setStoredActiveWorkspaceId(workspaceId: string | null) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (!workspaceId) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, workspaceId);
  } catch {
    // no-op
  }
}

function mapItems(items: MyWorkspaceItem[]): WorkspaceSummary[] {
  return items.map((item) => ({
    id: item.workspace.id,
    name: item.workspace.name,
    slug: item.workspace.slug,
    role: item.role,
    membershipId: item.membership_id,
  }));
}

function resolveActiveWorkspaceId(
  workspaces: WorkspaceSummary[],
  currentActiveWorkspaceId: string | null,
): string | null {
  if (workspaces.length === 0) {
    return null;
  }

  const exists = workspaces.some(
    (workspace) => workspace.id === currentActiveWorkspaceId,
  );

  if (exists) {
    return currentActiveWorkspaceId;
  }

  return workspaces[0].id;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspaces: [],
  activeWorkspaceId: getStoredActiveWorkspaceId(),
  isLoading: false,
  hasLoaded: false,
  error: null,

  setWorkspaces: (items) => {
    const nextActiveWorkspaceId = resolveActiveWorkspaceId(
      items,
      get().activeWorkspaceId,
    );

    setStoredActiveWorkspaceId(nextActiveWorkspaceId);

    set({
      workspaces: items,
      activeWorkspaceId: nextActiveWorkspaceId,
      hasLoaded: true,
      isLoading: false,
      error: null,
    });
  },

  setActiveWorkspaceId: (workspaceId) => {
    const { workspaces } = get();

    if (!workspaceId) {
      setStoredActiveWorkspaceId(null);
      set({ activeWorkspaceId: null });
      return;
    }

    const exists = workspaces.some((workspace) => workspace.id === workspaceId);

    if (!exists) {
      return;
    }

    setStoredActiveWorkspaceId(workspaceId);
    set({ activeWorkspaceId: workspaceId });
  },

  loadWorkspaces: async (profileId) => {
    const { hasLoaded, isLoading } = get();

    if (!profileId) {
      get().clear();
      return;
    }

    if (hasLoaded || isLoading) {
      return;
    }

    set({
      isLoading: true,
      error: null,
    });

    try {
      const data = await getMyWorkspaces(profileId);
      const mapped = mapItems(data);

      const nextActiveWorkspaceId = resolveActiveWorkspaceId(
        mapped,
        get().activeWorkspaceId,
      );

      setStoredActiveWorkspaceId(nextActiveWorkspaceId);

      set({
        workspaces: mapped,
        activeWorkspaceId: nextActiveWorkspaceId,
        isLoading: false,
        hasLoaded: true,
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los workspaces.";

      setStoredActiveWorkspaceId(null);

      set({
        workspaces: [],
        activeWorkspaceId: null,
        isLoading: false,
        hasLoaded: true,
        error: message,
      });

      throw error;
    }
  },

  reloadWorkspaces: async (profileId) => {
    if (!profileId) {
      get().clear();
      return;
    }

    set({
      isLoading: true,
      error: null,
      hasLoaded: false,
    });

    try {
      const data = await getMyWorkspaces(profileId);
      const mapped = mapItems(data);

      const nextActiveWorkspaceId = resolveActiveWorkspaceId(
        mapped,
        get().activeWorkspaceId,
      );

      setStoredActiveWorkspaceId(nextActiveWorkspaceId);

      set({
        workspaces: mapped,
        activeWorkspaceId: nextActiveWorkspaceId,
        isLoading: false,
        hasLoaded: true,
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudieron recargar los workspaces.";

      setStoredActiveWorkspaceId(null);

      set({
        workspaces: [],
        activeWorkspaceId: null,
        isLoading: false,
        hasLoaded: true,
        error: message,
      });

      throw error;
    }
  },

  getActiveWorkspace: () => {
    const { workspaces, activeWorkspaceId } = get();

    if (!activeWorkspaceId) {
      return null;
    }

    return (
      workspaces.find((workspace) => workspace.id === activeWorkspaceId) ?? null
    );
  },

  clear: () => {
    setStoredActiveWorkspaceId(null);

    set({
      workspaces: [],
      activeWorkspaceId: null,
      isLoading: false,
      hasLoaded: false,
      error: null,
    });
  },
}));

export function getActiveWorkspaceRole(): WorkspaceRole | null {
  const { workspaces, activeWorkspaceId } = useWorkspaceStore.getState();

  return (
    workspaces.find((workspace) => workspace.id === activeWorkspaceId)?.role ??
    null
  );
}

export function getActiveWorkspaceId(): string | null {
  return useWorkspaceStore.getState().activeWorkspaceId;
}

export function getActiveWorkspace() {
  return useWorkspaceStore.getState().getActiveWorkspace();
}