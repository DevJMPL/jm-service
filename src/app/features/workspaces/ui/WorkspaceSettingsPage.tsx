import { useEffect, useMemo, useState } from "react";
import { InviteMemberForm } from "@/app/features/workspaces/ui/InviteMemberForm";
import { WorkspaceInvitationsCard } from "@/app/features/workspaces/ui/WorkspaceInvitationsCard";
import { WorkspaceMembersCard } from "@/app/features/workspaces/ui/WorkspaceMembersCard";
import {
  getWorkspaceById,
  getWorkspaceInvitations,
  getWorkspaceMembers,
  type Workspace,
  type WorkspaceInvitation,
  type WorkspaceMember,
} from "@/app/features/workspaces/api/workspacesApi";
import {
  getActiveWorkspaceRole,
  useWorkspaceStore,
} from "@/app/features/workspaces/model/useWorkspace";
import { useAuthStore } from "@/app/features/auth/model/useAuth";

export default function WorkspaceSettingsPage() {
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId);
  const authUser = useAuthStore((state) => state.user);

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [invitations, setInvitations] = useState<WorkspaceInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeRole = getActiveWorkspaceRole();

  const canManage = useMemo(() => {
    return activeRole === "owner" || activeRole === "admin";
  }, [activeRole]);

  async function loadWorkspaceData() {
    if (!activeWorkspaceId) {
      setWorkspace(null);
      setMembers([]);
      setInvitations([]);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [workspaceData, membersData, invitationsData] = await Promise.all([
        getWorkspaceById(activeWorkspaceId),
        getWorkspaceMembers(activeWorkspaceId),
        getWorkspaceInvitations(activeWorkspaceId),
      ]);

      setWorkspace(workspaceData);
      setMembers(membersData);
      setInvitations(invitationsData);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No fue posible cargar la información del workspace.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadWorkspaceData();
  }, [activeWorkspaceId]);

  if (!activeWorkspaceId) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-slate-900">Workspace</h1>
        <p className="text-sm text-slate-500">
          No hay un workspace activo seleccionado.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Configuración del workspace
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Administra la información general, los miembros y las invitaciones.
        </p>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">
          Información general
        </h2>

        {isLoading ? (
          <p className="mt-3 text-sm text-slate-500">Cargando workspace...</p>
        ) : workspace ? (
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Nombre</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {workspace.name}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Slug</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {workspace.slug}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Creado</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {new Date(workspace.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">
            No fue posible cargar la información del workspace.
          </p>
        )}
      </div>

      {canManage && authUser?.id ? (
        <InviteMemberForm
          workspaceId={activeWorkspaceId}
          currentUserId={authUser.id}
          onInvited={loadWorkspaceData}
        />
      ) : null}

      <WorkspaceMembersCard members={members} isLoading={isLoading} />

      <WorkspaceInvitationsCard
        invitations={invitations}
        isLoading={isLoading}
        canManage={canManage}
        onChanged={loadWorkspaceData}
      />
    </div>
  );
}