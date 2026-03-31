import { useMemo } from "react";

import { useWorkspaceStore } from "@/app/features/workspaces/model/useWorkspace";

export function WorkspaceSwitcher() {
  const {
    workspaces,
    activeWorkspaceId,
    isLoading,
    hasLoaded,
    setActiveWorkspaceId,
  } = useWorkspaceStore();

  const activeWorkspace = useMemo(() => {
    if (!activeWorkspaceId) {
      return null;
    }

    return workspaces.find((workspace) => workspace.id === activeWorkspaceId) ?? null;
  }, [workspaces, activeWorkspaceId]);

  if (isLoading && !hasLoaded) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Workspace
        </p>
        <p className="mt-1 text-sm text-slate-700">Cargando...</p>
      </div>
    );
  }

  if (hasLoaded && workspaces.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Workspace
        </p>
        <p className="mt-1 text-sm text-slate-700">Sin workspaces</p>
      </div>
    );
  }

  if (!hasLoaded && workspaces.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Workspace
        </p>
        <p className="mt-1 text-sm text-slate-700">Preparando...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
      <label
        htmlFor="workspace-switcher"
        className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500"
      >
        Workspace actual
      </label>

      <select
        id="workspace-switcher"
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-slate-400"
        value={activeWorkspaceId ?? ""}
        onChange={(event) => setActiveWorkspaceId(event.target.value || null)}
        disabled={workspaces.length === 0}
      >
        {workspaces.map((workspace) => (
          <option key={workspace.id} value={workspace.id}>
            {workspace.name}
          </option>
        ))}
      </select>

      {activeWorkspace ? (
        <p className="mt-2 text-xs text-slate-500">
          Rol actual: <span className="font-medium text-slate-700">{activeWorkspace.role}</span>
        </p>
      ) : null}
    </div>
  );
}

export default WorkspaceSwitcher;