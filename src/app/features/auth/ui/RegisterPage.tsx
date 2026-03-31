import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

import { registerWithWorkspace } from "@/app/features/auth/api/authApi";
import { AuthSplitLayout } from "@/app/features/auth/ui/AuthSplitLayout";
import { AuthMessage } from "@/shared/ui/AuthMessage";
import { AuthPrimaryButton } from "@/shared/ui/AuthPrimaryButton";
import { AuthTextField } from "@/shared/ui/AuthTextField";
import { AuthPasswordField } from "@/shared/ui/AuthPasswordField";

type RegisterFormState = {
  fullName: string;
  email: string;
  password: string;
};

const initialState: RegisterFormState = {
  fullName: "",
  email: "",
  password: "",
};

function getRegisterErrorMessage(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : "No fue posible crear tu cuenta. Intenta nuevamente.";

  const normalized = message.toLowerCase();

  if (normalized.includes("user already registered")) {
    return "Este correo ya está registrado.";
  }

  if (normalized.includes("signup is disabled")) {
    return "El registro de usuarios está deshabilitado.";
  }

  if (
    normalized.includes("too many requests") ||
    normalized.includes("over_email_send_rate_limit")
  ) {
    return "Demasiados intentos. Espera un momento antes de volver a intentarlo.";
  }

  return message;
}

export function RegisterPage() {
  const [form, setForm] = useState<RegisterFormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isValid = useMemo(() => {
    return (
      form.fullName.trim().length >= 3 &&
      form.email.trim().length > 0 &&
      form.password.trim().length >= 6
    );
  }, [form]);

  function updateField<K extends keyof RegisterFormState>(
    key: K,
    value: RegisterFormState[K],
  ) {
    if (errorMessage) {
      setErrorMessage(null);
    }

    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await registerWithWorkspace({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });

      if (result.requiresEmailConfirmation) {
        setSuccessMessage(
          "Tu cuenta fue creada correctamente. Revisa tu correo para confirmar tu email. Después inicia sesión para crear tu primer workspace.",
        );
      } else {
        setSuccessMessage(
          "Tu cuenta fue creada correctamente. Ya puedes iniciar sesión.",
        );
      }

      setForm(initialState);
    } catch (error) {
      setErrorMessage(getRegisterErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthSplitLayout
      title="Crea tu cuenta"
      subtitle="Regístrate para comenzar a usar Reach Service."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <AuthTextField
          id="fullName"
          label="Nombre completo"
          type="text"
          value={form.fullName}
          onChange={(event) => updateField("fullName", event.target.value)}
          placeholder="Juan Manuel Pérez"
          autoComplete="name"
          required
        />

        <AuthTextField
          id="email"
          label="Correo electrónico"
          type="email"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
          placeholder="correo@empresa.com"
          autoComplete="email"
          required
        />

        <AuthPasswordField
          id="password"
          label="Contraseña"
          value={form.password}
          onChange={(event) => updateField("password", event.target.value)}
          placeholder="Mínimo 6 caracteres"
          autoComplete="new-password"
          required
        />

        {errorMessage ? (
          <AuthMessage type="error">{errorMessage}</AuthMessage>
        ) : null}

        {successMessage ? (
          <AuthMessage type="success">{successMessage}</AuthMessage>
        ) : null}

        <AuthPrimaryButton
          type="submit"
          loading={isSubmitting}
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
        </AuthPrimaryButton>

        <p className="text-center text-sm text-slate-500">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="font-medium text-slate-800 underline underline-offset-4"
          >
            Inicia sesión
          </Link>
        </p>
      </form>
    </AuthSplitLayout>
  );
}

export default RegisterPage;