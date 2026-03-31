import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  Bell,
  Boxes,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  FileText,
  Headset,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  Ticket,
  Users,
} from "lucide-react";

import { signOut } from "@/app/features/auth/api/authApi";
import { useMyProfile } from "@/app/features/profile/model/useMyProfile";
import { WorkspaceSwitcher } from "@/app/features/workspaces/ui/WorkspaceSwitcher";

interface AppLayoutProps {
  children: ReactNode;
}

const SIDEBAR_STORAGE_KEY = "reach-service:sidebar-collapsed";

const navigation = [
  { label: "Inicio", href: "/", icon: LayoutDashboard },
  { label: "Clientes", href: "/customers", icon: Users },
  { label: "Tickets", href: "/tickets", icon: Ticket },
  { label: "Casos", href: "/cases", icon: FileText },
  { label: "Reportes", href: "/reports", icon: BarChart3 },
  { label: "Configuración", href: "/settings", icon: Settings },
];

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useMyProfile();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
  });

  const [isReady, setIsReady] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const updateSidebarCollapsed = (value: boolean) => {
    setIsSidebarCollapsed(value);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(value));
    }
  };

  async function handleSignOut() {
    if (isSigningOut) return;

    try {
      setIsSigningOut(true);
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("No se pudo cerrar la sesión", error);
    } finally {
      setIsSigningOut(false);
    }
  }

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== SIDEBAR_STORAGE_KEY) return;
      setIsSidebarCollapsed(event.newValue === "true");
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-[#fbfbfc]">
      <div
        className={`grid h-full ${
          isReady ? "transition-[grid-template-columns] duration-300" : ""
        } ${
          isSidebarCollapsed
            ? "lg:grid-cols-[92px_1fr]"
            : "lg:grid-cols-[280px_1fr]"
        }`}
      >
        <aside className="hidden h-screen border-r border-[#eef2f7] bg-white/80 backdrop-blur-sm lg:block">
          <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
            <div
              className={`flex items-center ${
                isSidebarCollapsed ? "justify-center px-4" : "justify-between px-6"
              } py-6`}
            >
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35 }}
                className={`flex items-center ${
                  isSidebarCollapsed ? "justify-center" : "gap-3"
                }`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2f80ed] text-white shadow-[0_8px_22px_rgba(47,128,237,0.18)]">
                  <Boxes className="h-5 w-5" />
                </div>

                {!isSidebarCollapsed && (
                  <div className="min-w-0">
                    <div className="text-[1.35rem] font-semibold tracking-[-0.04em] text-[#252733]">
                      Reach Service
                    </div>
                    <div className="text-sm text-[#9aa1b1]">
                      CRM y gestión de casos
                    </div>
                  </div>
                )}
              </motion.div>

              {!isSidebarCollapsed && (
                <button
                  type="button"
                  onClick={() => updateSidebarCollapsed(true)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eef2f7] bg-white text-[#6f7787] shadow-[0_4px_14px_rgba(120,144,180,0.06)] transition hover:bg-[#f9fbfd] hover:text-[#252733]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              )}
            </div>

            {isSidebarCollapsed && (
              <div className="px-4 pb-2">
                <button
                  type="button"
                  onClick={() => updateSidebarCollapsed(false)}
                  className="flex h-10 w-full items-center justify-center rounded-full border border-[#eef2f7] bg-white text-[#6f7787] shadow-[0_4px_14px_rgba(120,144,180,0.06)] transition hover:bg-[#f9fbfd] hover:text-[#252733]"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {!isSidebarCollapsed && (
              <div className="px-4 pb-2">
                <WorkspaceSwitcher />
              </div>
            )}

            <nav className="flex-1 overflow-y-auto px-4 py-4">
              <div className="space-y-2">
                {navigation.map((item, index) => {
                  const Icon = item.icon;
                  const isActive =
                    location.pathname === item.href ||
                    (item.href !== "/" && location.pathname.startsWith(item.href));

                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.28, delay: index * 0.04 }}
                    >
                      <Link
                        to={item.href}
                        title={isSidebarCollapsed ? item.label : undefined}
                        className={[
                          "flex items-center rounded-2xl text-sm font-medium transition",
                          isSidebarCollapsed
                            ? "justify-center px-3 py-3"
                            : "gap-3 px-4 py-3",
                          isActive
                            ? "bg-[#eef5ff] text-[#2f80ed] shadow-[0_4px_14px_rgba(47,128,237,0.08)]"
                            : "text-[#6f7787] hover:bg-[#f7f9fc] hover:text-[#252733]",
                        ].join(" ")}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {!isSidebarCollapsed && <span>{item.label}</span>}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </nav>

            <div className="border-t border-[#eef2f7] p-4">
              <div className="rounded-[24px] border border-[#eef2f7] bg-[#f8fafc] p-4">
                <div
                  className={`flex ${
                    isSidebarCollapsed ? "justify-center" : "items-center gap-3"
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dbeafe] text-[#2f80ed]">
                    <Headset className="h-5 w-5" />
                  </div>

                  {!isSidebarCollapsed && (
                    <div>
                      <p className="text-sm font-medium text-[#252733]">
                        Operación activa
                      </p>
                      <p className="text-xs text-[#97a0af]">
                        Plataforma lista para atención
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  title={isSidebarCollapsed ? "Cerrar sesión" : undefined}
                  className={[
                    "mt-4 flex rounded-full border border-[#e7edf5] bg-white text-sm font-medium text-[#4f5666] transition hover:bg-[#f9fbfd] disabled:cursor-not-allowed disabled:opacity-60",
                    isSidebarCollapsed
                      ? "h-10 w-full items-center justify-center"
                      : "w-full items-center justify-center gap-2 px-4 py-2.5",
                  ].join(" ")}
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  {!isSidebarCollapsed && (
                    <span>{isSigningOut ? "Cerrando..." : "Cerrar sesión"}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex h-screen min-w-0 flex-col overflow-hidden">
          <header className="sticky top-0 z-20 border-b border-[#eef2f7] bg-[#fbfbfc]/90 px-8 py-6 backdrop-blur-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-[2rem] font-semibold tracking-[-0.04em] text-[#252733]">
                  Reach Service
                </h1>
                <p className="mt-1 text-sm text-[#8f95a3]">
                  CRM y gestión inteligente de clientes, tickets y casos.
                </p>
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative w-full min-w-[280px] max-w-[380px]">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa1b1]" />
                  <input
                    type="text"
                    placeholder="Buscar clientes, tickets o casos..."
                    className="h-[48px] w-full rounded-full border border-[#eef2f7] bg-white pl-11 pr-4 text-sm text-[#252733] outline-none shadow-[0_4px_14px_rgba(120,144,180,0.06)] placeholder:text-[#a0a5b5] transition focus:border-[#d8e6fb]"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden min-w-[220px] xl:block">
                    <WorkspaceSwitcher />
                  </div>

                  <IconButton>
                    <Bell className="h-4 w-4" />
                  </IconButton>

                  <IconButton>
                    <CircleHelp className="h-4 w-4" />
                  </IconButton>

                  <div className="flex items-center gap-3 rounded-full border border-[#eef2f7] bg-white px-3 py-2 shadow-[0_4px_14px_rgba(120,144,180,0.06)]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2f80ed] text-sm font-semibold text-white shadow-[0_8px_22px_rgba(47,128,237,0.18)]">
                      {getInitials(profile?.full_name, profile?.email)}
                    </div>

                    <div className="hidden sm:block">
                      <p className="text-sm font-medium text-[#252733]">
                        {getDisplayName(profile?.full_name, profile?.email)}
                      </p>
                      <p className="text-xs text-[#97a0af]">
                        {getRoleLabel(profile?.role)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto">
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
    </div>
  );
}

function IconButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="flex h-11 w-11 items-center justify-center rounded-full border border-[#eef2f7] bg-white text-[#6f7787] shadow-[0_4px_14px_rgba(120,144,180,0.06)] transition hover:bg-[#f9fbfd] hover:text-[#252733]"
    >
      {children}
    </button>
  );
}

function getInitials(fullName?: string | null, email?: string | null) {
  if (fullName?.trim()) {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    const initials = parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "");

    return initials.join("") || "US";
  }

  if (email?.trim()) {
    return email.slice(0, 2).toUpperCase();
  }

  return "US";
}

function getDisplayName(fullName?: string | null, email?: string | null) {
  if (fullName?.trim()) return fullName;
  if (email?.trim()) return email;
  return "Usuario";
}

function getRoleLabel(role?: string | null) {
  switch (role) {
    case "admin":
      return "Administrador";
    case "supervisor":
      return "Supervisor";
    case "agent":
      return "Agente";
    default:
      return "Usuario";
  }
}