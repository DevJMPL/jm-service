import {
  revokeWorkspaceInvitation,
  type WorkspaceInvitation,
} from '@/app/features/workspaces/api/workspacesApi';

type WorkspaceInvitationsCardProps = {
  invitations: WorkspaceInvitation[];
  isLoading?: boolean;
  canManage?: boolean;
  onChanged?: () => Promise<void> | void;
};

export function WorkspaceInvitationsCard({
  invitations,
  isLoading = false,
  canManage = false,
  onChanged,
}: WorkspaceInvitationsCardProps) {
  async function handleRevoke(invitationId: string) {
    try {
      await revokeWorkspaceInvitation(invitationId);
      await onChanged?.();
    } catch (error) {
      console.error('No se pudo revocar la invitación', error);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-900">Invitaciones</h3>
        <p className="mt-1 text-sm text-slate-500">
          Invitaciones pendientes e histórico del workspace.
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando invitaciones...</p>
      ) : invitations.length === 0 ? (
        <p className="text-sm text-slate-500">No hay invitaciones registradas.</p>
      ) : (
        <div className="space-y-3">
          {invitations.map((invitation) => (
            <div
              key={invitation.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">{invitation.email}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Rol: {invitation.role} · Estado: {invitation.status}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Creada: {new Date(invitation.created_at).toLocaleString()}
                </p>
              </div>

              {canManage && invitation.status === 'pending' ? (
                <button
                  type="button"
                  onClick={() => handleRevoke(invitation.id)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Revocar
                </button>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}