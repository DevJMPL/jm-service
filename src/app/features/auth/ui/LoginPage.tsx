import { useMemo, useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Apple, Facebook, Mail } from "lucide-react"

import { login } from "@/app/features/auth/api/authApi"
import { AuthSplitLayout } from "@/app/features/auth/ui/AuthSplitLayout"
import { AuthTextField } from "@/shared/ui/AuthTextField"
import { AuthPasswordField } from "@/shared/ui/AuthPasswordField"
import { AuthPrimaryButton } from "@/shared/ui/AuthPrimaryButton"
import { AuthMessage } from "@/shared/ui/AuthMessage"
import { AuthSocialButton } from "@/shared/ui/AuthSocialButton"

function getAuthErrorMessage(message?: string) {
  if (!message) return "No fue posible iniciar sesión. Inténtalo de nuevo."

  const normalized = message.toLowerCase()

  if (
    normalized.includes("invalid login credentials") ||
    normalized.includes("invalid credentials")
  ) {
    return "El correo o la contraseña son incorrectos."
  }

  if (normalized.includes("email not confirmed")) {
    return "Confirma tu correo electrónico antes de iniciar sesión."
  }

  return message
}

export function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.trim().length > 0 && !loading
  }, [email, password, loading])

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (errorMsg) setErrorMsg(null)
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (errorMsg) setErrorMsg(null)
    setPassword(e.target.value)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!canSubmit) return

    setErrorMsg(null)
    setLoading(true)

    const { error } = await login(email.trim(), password)

    if (error) {
      setErrorMsg(getAuthErrorMessage(error.message))
      setLoading(false)
      return
    }

    navigate("/", { replace: true })
  }

  return (
    <AuthSplitLayout title="Reach Service">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-8"
      >
        <div className="space-y-3 text-center">
          <h1 className="text-[2.8rem] font-semibold tracking-[-0.05em] text-[#252733]">
            Inicia sesión en Reach Service
          </h1>
          <p className="text-[15px] text-[#8f95a3]">
            Accede a tu espacio de trabajo y continúa con la gestión de clientes, tickets y casos.
          </p>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-center gap-4">
            <AuthSocialButton>
              <Facebook className="h-5 w-5 text-[#1877f2]" />
            </AuthSocialButton>

            <AuthSocialButton>
              <Mail className="h-5 w-5 text-[#ea4335]" />
            </AuthSocialButton>

            <AuthSocialButton>
              <Apple className="h-5 w-5 text-black" />
            </AuthSocialButton>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-[#e8ecf3]" />
            <span className="text-sm text-[#a0a5b5]">o continúa con tu correo</span>
            <div className="h-px flex-1 bg-[#e8ecf3]" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthTextField
            id="email"
            label="Correo electrónico"
            type="email"
            autoComplete="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="tu@empresa.com"
            error={errorMsg}
            required
          />

          <AuthPasswordField
            id="password"
            label="Contraseña"
            helperActionLabel="¿Olvidaste tu contraseña?"
            autoComplete="current-password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Ingresa tu contraseña"
            error={errorMsg}
            required
          />

          {errorMsg && <AuthMessage type="error">{errorMsg}</AuthMessage>}

          <AuthPrimaryButton type="submit" loading={loading} disabled={!canSubmit}>
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </AuthPrimaryButton>
        </form>

        <p className="text-center text-sm text-[#7f8593]">
          ¿No tienes una cuenta?{" "}
          <Link
            to="/register"
            className="font-medium text-[#2f80ed] transition hover:text-[#2274e2]"
          >
            Regístrate
          </Link>
        </p>
      </motion.div>
    </AuthSplitLayout>
  )
}