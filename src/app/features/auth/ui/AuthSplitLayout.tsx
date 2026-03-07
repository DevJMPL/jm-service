import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { Boxes } from "lucide-react"

interface AuthSplitLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
  imageUrl?: string
}

export function AuthSplitLayout({
  children,
  title = "Reach Service",
  subtitle = "CRM y gestión inteligente de casos",
  imageUrl = "public/images/pexels-yurika-4151484.jpg",
}: AuthSplitLayoutProps) {
  return (
    <div className="min-h-screen bg-[#fbfbfc]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_1.02fr]">
        <section className="flex flex-col justify-between px-8 py-8 sm:px-12 lg:px-14 xl:px-16">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2f80ed] text-white shadow-[0_8px_22px_rgba(47,128,237,0.18)]">
              <Boxes className="h-5 w-5" />
            </div>

            <div>
              <div className="text-[2rem] font-semibold tracking-[-0.04em] text-[#252733]">
                {title}
              </div>
              <div className="text-sm text-[#9aa1b1]">{subtitle}</div>
            </div>
          </motion.div>

          <div className="mx-auto flex w-full max-w-[420px] flex-1 items-center">
            <div className="w-full">{children}</div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="pt-8 text-sm text-[#a0a5b5]"
          >
            Desarrollado por dev.jmpl18@gmail.com
          </motion.div>
        </section>

        <section className="relative hidden overflow-hidden lg:block">
          <img
            src={imageUrl}
            alt="Visual de autenticación"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-white/18" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-[#d8ebff]/18" />

          <div className="absolute inset-x-0 bottom-0 p-10">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="max-w-md rounded-[28px] border border-white/35 bg-white/24 p-6 backdrop-blur-md"
            >
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#6e7687]">
                Reach Service
              </p>

              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#253041]">
                Gestión ágil, elegante y segura para tu operación de servicio
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#667085]">
                Centraliza clientes, tickets, seguimiento de casos y atención del equipo en una sola plataforma.
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}