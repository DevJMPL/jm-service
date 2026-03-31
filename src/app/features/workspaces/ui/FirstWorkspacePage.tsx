import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Building2, CheckCircle2, Sparkles } from "lucide-react";

import { completeInitialWorkspaceSetup } from "@/app/features/auth/api/authApi";
import { useAuthStore } from "@/app/features/auth/model/useAuth";
import { useMyProfile } from "@/app/features/profile/model/useMyProfile";
import { useWorkspaceStore } from "@/app/features/workspaces/model/useWorkspace";
import { AuthMessage } from "@/shared/ui/AuthMessage";
import { AuthPrimaryButton } from "@/shared/ui/AuthPrimaryButton";
import { AuthTextField } from "@/shared/ui/AuthTextField";

function getWorkspaceSetupErrorMessage(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : "No fue posible crear tu primer workspace.";

  const normalized = message.toLowerCase();

  if (normalized.includes("unauthorized")) {
    return "Tu sesión no es válida. Inicia sesión nuevamente.";
  }

  if (normalized.includes("workspace name must contain at least 3 characters")) {
    return "El nombre del workspace debe tener al menos 3 caracteres.";
  }

  return message;
}

function buildWorkspaceSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function FirstWorkspacePage() {
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.user);
  const { profile, reload } = useMyProfile();
  const { setActiveWorkspaceId, reloadWorkspaces } = useWorkspaceStore();

  const [workspaceName, setWorkspaceName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return workspaceName.trim().length >= 3 && !isSubmitting;
  }, [workspaceName, isSubmitting]);

  const previewSlug = useMemo(() => {
    const slug = buildWorkspaceSlug(workspaceName);
    return slug || "tu-workspace";
  }, [workspaceName]);

  const displayName = profile?.full_name || authUser?.email || "Usuario";

  const handleWorkspaceNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (errorMessage) {
      setErrorMessage(null);
    }

    setWorkspaceName(event.target.value);
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!authUser?.id || !canSubmit) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await completeInitialWorkspaceSetup({
        fullName: profile?.full_name || authUser.email || "Usuario",
        workspaceName: workspaceName.trim(),
      });

      setActiveWorkspaceId(result.workspace.id);

      await reload();
      await reloadWorkspaces(authUser.id);

      navigate("/", { replace: true });
    } catch (error) {
      setErrorMessage(getWorkspaceSetupErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(47,128,237,0.10),_transparent_35%),linear-gradient(180deg,#f8fbff_0%,#f5f7fb_100%)] px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center">
        <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col justify-center"
          >
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d9e8ff] bg-white/80 px-4 py-2 text-sm font-medium text-[#2f80ed] shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Último paso de configuración
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-[#1f2937] md:text-5xl">
              Crea tu primer workspace
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-[#667085]">
              Bienvenido, <span className="font-medium text-[#344054]">{displayName}</span>.
              Tu cuenta ya está lista. Ahora crea el espacio de trabajo inicial
              para comenzar a administrar clientes, tickets y casos en Reach Service.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <FeatureCard
                icon={<Building2 className="h-5 w-5" />}
                title="Tu espacio"
                description="Centraliza operación, equipo y datos."
              />
              <FeatureCard
                icon={<CheckCircle2 className="h-5 w-5" />}
                title="Configuración inicial"
                description="Se crea tu perfil y el workspace owner."
              />
              <FeatureCard
                icon={<ArrowRight className="h-5 w-5" />}
                title="Siguiente paso"
                description="Entrarás directo a tu panel principal."
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="relative"
          >
            <div className="absolute inset-0 -z-10 rounded-[32px] bg-[radial-gradient(circle,_rgba(47,128,237,0.14),_transparent_65%)] blur-2xl" />

            <div className="overflow-hidden rounded-[32px] border border-[#e6edf7] bg-white/90 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur">
              <div className="border-b border-[#eef2f7] bg-gradient-to-r from-[#f8fbff] to-[#fdfefe] px-7 py-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2f80ed] text-white shadow-[0_10px_25px_rgba(47,128,237,0.25)]">
                    <Building2 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-[#2f80ed]">
                      Workspace inicial
                    </p>
                    <h2 className="text-xl font-semibold tracking-[-0.03em] text-[#1f2937]">
                      Define el nombre de tu espacio
                    </h2>
                  </div>
                </div>
              </div>

              <div className="px-7 py-7">
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <AuthTextField
                    id="workspaceName"
                    label="Nombre del workspace"
                    type="text"
                    value={workspaceName}
                    onChange={handleWorkspaceNameChange}
                    placeholder="Izei Consulting"
                    autoComplete="organization"
                    required
                  />

                  <div className="rounded-2xl border border-[#e8eef6] bg-[#f8fafc] p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-[#667085]">
                      Vista previa
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-4 rounded-2xl border border-[#edf2f7] bg-white px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#1f2937]">
                          {workspaceName.trim() || "Tu Workspace"}
                        </p>
                        <p className="mt-1 text-xs text-[#98a2b3]">
                          slug: {previewSlug}
                        </p>
                      </div>

                      <span className="rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-medium text-[#2f80ed]">
                        Owner
                      </span>
                    </div>
                  </div>

                  {errorMessage ? (
                    <AuthMessage type="error">{errorMessage}</AuthMessage>
                  ) : null}

                  <AuthPrimaryButton
                    type="submit"
                    loading={isSubmitting}
                    disabled={!canSubmit}
                  >
                    {isSubmitting ? "Creando workspace..." : "Crear workspace"}
                  </AuthPrimaryButton>

                  <p className="text-center text-xs leading-6 text-[#98a2b3]">
                    Este será tu espacio principal. Después podrás invitar a más
                    personas y administrar miembros desde la configuración.
                  </p>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/70 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef5ff] text-[#2f80ed]">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-semibold text-[#1f2937]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#667085]">{description}</p>
    </div>
  );
}

export default FirstWorkspacePage;