import type { ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import {
  BarChart3,
  Bell,
  Boxes,
  CircleHelp,
  FileText,
  Headset,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  Ticket,
  Users,
} from "lucide-react"

import { logout } from "@/app/features/auth/api/authApi"

interface AppLayoutProps {
  title: string
  description?: string
  children: ReactNode
}

const navigation = [
  {
    label: "Inicio",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Clientes",
    href: "/customers",
    icon: Users,
  },
  {
    label: "Tickets",
    href: "/tickets",
    icon: Ticket,
  },
  {
    label: "Casos",
    href: "/cases",
    icon: FileText,
  },
  {
    label: "Reportes",
    href: "/reports",
    icon: BarChart3,
  },
  {
    label: "Configuración",
    href: "/settings",
    icon: Settings,
  },
]

export function AppLayout({ title, description, children }: AppLayoutProps) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[#fbfbfc]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-[#eef2f7] bg-white/80 px-6 py-8 backdrop-blur-sm">
          <div className="flex h-full flex-col">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2f80ed] text-white shadow-[0_8px_22px_rgba(47,128,237,0.18)]">
                <Boxes className="h-5 w-5" />
              </div>

              <div>
                <div className="text-[1.35rem] font-semibold tracking-[-0.04em] text-[#252733]">
                  Reach Service
                </div>
                <div className="text-sm text-[#9aa1b1]">
                  CRM y gestión de casos
                </div>
              </div>
            </motion.div>

            <nav className="mt-10 space-y-2">
              {navigation.map((item, index) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.28, delay: index * 0.04 }}
                  >
                    <Link
                      to={item.href}
                      className={[
                        "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                        isActive
                          ? "bg-[#eef5ff] text-[#2f80ed] shadow-[0_4px_14px_rgba(47,128,237,0.08)]"
                          : "text-[#6f7787] hover:bg-[#f7f9fc] hover:text-[#252733]",
                      ].join(" ")}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            <div className="mt-auto">
              <div className="rounded-[24px] border border-[#eef2f7] bg-[#f8fafc] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dbeafe] text-[#2f80ed]">
                    <Headset className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-[#252733]">
                      Operación activa
                    </p>
                    <p className="text-xs text-[#97a0af]">
                      Plataforma lista para atención
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => logout()}
                  className="
                    mt-4 flex w-full items-center justify-center gap-2 rounded-full
                    border border-[#e7edf5] bg-white px-4 py-2.5 text-sm font-medium text-[#4f5666]
                    transition hover:bg-[#f9fbfd]
                  "
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          <header className="border-b border-[#eef2f7] bg-[#fbfbfc]/80 px-8 py-6 backdrop-blur-sm">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h1 className="text-[2rem] font-semibold tracking-[-0.04em] text-[#252733]">
                  {title}
                </h1>
                {description && (
                  <p className="mt-1 text-sm text-[#8f95a3]">{description}</p>
                )}
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative w-full min-w-[280px] max-w-[380px]">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa1b1]" />
                  <input
                    type="text"
                    placeholder="Buscar clientes, tickets o casos..."
                    className="
                      h-[48px] w-full rounded-full border border-[#eef2f7] bg-white
                      pl-11 pr-4 text-sm text-[#252733] outline-none
                      shadow-[0_4px_14px_rgba(120,144,180,0.06)]
                      placeholder:text-[#a0a5b5]
                      transition focus:border-[#d8e6fb]
                    "
                  />
                </div>

                <div className="flex items-center gap-3">
                  <IconButton>
                    <Bell className="h-4 w-4" />
                  </IconButton>

                  <IconButton>
                    <CircleHelp className="h-4 w-4" />
                  </IconButton>

                  <div className="flex items-center gap-3 rounded-full border border-[#eef2f7] bg-white px-3 py-2 shadow-[0_4px_14px_rgba(120,144,180,0.06)]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2f80ed] text-sm font-semibold text-white shadow-[0_8px_22px_rgba(47,128,237,0.18)]">
                      JP
                    </div>

                    <div className="hidden sm:block">
                      <p className="text-sm font-medium text-[#252733]">
                        Juan Pérez
                      </p>
                      <p className="text-xs text-[#97a0af]">
                        Administrador
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <section className="p-8">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {children}
            </motion.div>
          </section>
        </main>
      </div>
    </div>
  )
}

function IconButton({ children }: { children: ReactNode }) {
  return (
    <button
      className="
        flex h-11 w-11 items-center justify-center rounded-full
        border border-[#eef2f7] bg-white text-[#6f7787]
        shadow-[0_4px_14px_rgba(120,144,180,0.06)]
        transition hover:bg-[#f9fbfd] hover:text-[#252733]
      "
    >
      {children}
    </button>
  )
}