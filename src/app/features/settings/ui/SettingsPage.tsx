import { motion } from "framer-motion"
import { Bell, Lock, Palette, UserCog } from "lucide-react"

export function SettingsPage() {
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        <SettingsCard
          icon={<UserCog className="h-5 w-5" />}
          title="Perfil"
          description="Actualiza tu información general, nombre y datos de contacto."
        />

        <SettingsCard
          icon={<Lock className="h-5 w-5" />}
          title="Seguridad"
          description="Gestiona contraseña, sesiones activas y controles de acceso."
        />

        <SettingsCard
          icon={<Bell className="h-5 w-5" />}
          title="Notificaciones"
          description="Configura avisos para tickets, casos y actividades relevantes."
        />

        <SettingsCard
          icon={<Palette className="h-5 w-5" />}
          title="Apariencia"
          description="Ajusta preferencias visuales y personalización de la interfaz."
        />
      </div>
    </>
  )
}

function SettingsCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-[30px] border border-[#eef2f7] bg-white p-6 shadow-[0_8px_24px_rgba(120,144,180,0.08)]"
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4f7fb] text-[#2f80ed]">
        {icon}
      </div>

      <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#252733]">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-[#8f95a3]">{description}</p>

      <button className="mt-6 rounded-full border border-[#e7edf5] bg-[#f9fbfd] px-4 py-2 text-sm font-medium text-[#5e6676] transition hover:bg-white">
        Configurar
      </button>
    </motion.div>
  )
}