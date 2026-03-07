import { motion } from "framer-motion"
import { Plus, Search, Ticket, TimerReset, TriangleAlert } from "lucide-react"
import { AppLayout } from "@/app/layouts/AppLayout"

const tickets = [
  {
    id: "TIC-1042",
    subject: "Incidencia en portal",
    customer: "Grupo Nova",
    priority: "Alta",
    status: "Abierto",
  },
  {
    id: "TIC-1043",
    subject: "Falla en notificaciones",
    customer: "Transportes del Centro",
    priority: "Media",
    status: "En proceso",
  },
  {
    id: "TIC-1044",
    subject: "Consulta de facturación",
    customer: "Comercializadora HM",
    priority: "Baja",
    status: "Resuelto",
  },
]

export function TicketsPage() {
  return (
    <AppLayout
      title="Tickets"
      description="Gestiona solicitudes, incidencias y seguimiento operativo del servicio."
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa1b1]" />
            <input
              type="text"
              placeholder="Buscar ticket..."
              className="h-[50px] w-full rounded-full border border-[#eef2f7] bg-white pl-11 pr-4 text-sm text-[#252733] outline-none shadow-[0_4px_14px_rgba(120,144,180,0.06)] placeholder:text-[#a0a5b5]"
            />
          </div>

          <button className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2f80ed] px-5 py-3 text-sm font-medium text-white shadow-[0_10px_24px_rgba(47,128,237,0.22)] transition hover:bg-[#2274e2]">
            <Plus className="h-4 w-4" />
            Nuevo ticket
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <MetricCard icon={<Ticket className="h-5 w-5" />} title="Abiertos" value="128" />
          <MetricCard icon={<TimerReset className="h-5 w-5" />} title="En proceso" value="46" />
          <MetricCard icon={<TriangleAlert className="h-5 w-5" />} title="Críticos" value="5" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden rounded-[30px] border border-[#eef2f7] bg-white shadow-[0_8px_24px_rgba(120,144,180,0.08)]"
        >
          <div className="grid grid-cols-[1fr_1.6fr_1.2fr_1fr_1fr] bg-[#f8fafc] px-6 py-4 text-xs font-semibold uppercase tracking-[0.08em] text-[#9aa1b1]">
            <span>ID</span>
            <span>Asunto</span>
            <span>Cliente</span>
            <span>Prioridad</span>
            <span>Estatus</span>
          </div>

          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="grid grid-cols-[1fr_1.6fr_1.2fr_1fr_1fr] items-center border-t border-[#eef2f7] px-6 py-4 text-sm text-[#5b6474]"
            >
              <span className="font-medium text-[#252733]">{ticket.id}</span>
              <span>{ticket.subject}</span>
              <span>{ticket.customer}</span>
              <span>
                <span className="rounded-full bg-[#fff4e8] px-3 py-1 text-xs font-medium text-[#b7721d]">
                  {ticket.priority}
                </span>
              </span>
              <span>
                <span className="rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-medium text-[#2f80ed]">
                  {ticket.status}
                </span>
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </AppLayout>
  )
}

function MetricCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode
  title: string
  value: string
}) {
  return (
    <div className="rounded-[26px] border border-[#eef2f7] bg-white p-6 shadow-[0_8px_24px_rgba(120,144,180,0.08)]">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f4f7fb] text-[#2f80ed]">
        {icon}
      </div>
      <p className="text-sm text-[#8f95a3]">{title}</p>
      <h3 className="mt-2 text-[2rem] font-semibold tracking-[-0.04em] text-[#252733]">
        {value}
      </h3>
    </div>
  )
}