import { useState } from 'react';
import { inviteWorkspaceMember, type WorkspaceInvitationRole } from '@/app/features/workspaces/api/workspacesApi';

type InviteMemberFormProps = {
  workspaceId: string;
  currentUserId: string;
  onInvited?: () => Promise<void> | void;
};

export function InviteMemberForm({
  workspaceId,
  currentUserId,
  onInvited,
}: InviteMemberFormProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<WorkspaceInvitationRole>('agent');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await inviteWorkspaceMember({
        workspaceId,
        email,
        role,
        invitedBy: currentUserId,
      });

      setEmail('');
      setRole('agent');
      setSuccessMessage('Invitación creada correctamente.');

      await onInvited?.();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'No se pudo crear la invitación.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">Invitar miembro</h3>
      <p className="mt-1 text-sm text-slate-500">
        Agrega personas a este workspace usando su correo electrónico.
      </p>

      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Correo</label>
          <input
            type="email"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
            placeholder="persona@empresa.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Rol</label>
          <select
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
            value={role}
            onChange={(event) => setRole(event.target.value as WorkspaceInvitationRole)}
          >
            <option value="agent">Agent</option>
            <option value="supervisor">Supervisor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {errorMessage ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Invitando...' : 'Invitar miembro'}
        </button>
      </form>
    </div>
  );
}