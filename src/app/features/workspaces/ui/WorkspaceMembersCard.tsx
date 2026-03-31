import { type WorkspaceMember } from '@/app/features/workspaces/api/workspacesApi';

type WorkspaceMembersCardProps = {
  members: WorkspaceMember[];
  isLoading?: boolean;
};

export function WorkspaceMembersCard({
  members,
  isLoading = false,
}: WorkspaceMembersCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-900">Miembros</h3>
        <p className="mt-1 text-sm text-slate-500">
          Personas con acceso al workspace actual.
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Cargando miembros...</p>
      ) : members.length === 0 ? (
        <p className="text-sm text-slate-500">No hay miembros registrados todavía.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-4">Nombre</th>
                <th className="py-2 pr-4">Correo</th>
                <th className="py-2 pr-4">Rol</th>
                <th className="py-2 pr-4">Alta</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="rounded-xl bg-slate-50 text-sm text-slate-700">
                  <td className="rounded-l-xl px-3 py-3">
                    {member.profile?.full_name || 'Sin nombre'}
                  </td>
                  <td className="px-3 py-3">{member.profile?.email || '-'}</td>
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700">
                      {member.role}
                    </span>
                  </td>
                  <td className="rounded-r-xl px-3 py-3">
                    {new Date(member.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}