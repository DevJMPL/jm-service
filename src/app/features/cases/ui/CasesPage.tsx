import { motion } from "framer-motion"
import { FileText, FolderKanban, Search, ShieldAlert } from "lucide-react"
import { AppLayout } from "@/app/layouts/AppLayout"

const cases = [
  {
    id: "CAS-00124",
    customer: "Transportes del Centro",
    type: "Soporte técnico",
    owner: "Luis Martínez",
    status: "En revisión",
  },
  {
    id: "CAS-00125",
    customer: "Grupo Nova",
    type: "Seguimiento",
    owner: "Andrea Gómez",
    status: "Abierto",
  },
  {
    id: "CAS-00126",
    customer: "Comercializadora HM",
    type: "Actualización",
    owner: "Carlos Ruiz",
    status: "Resuelto",
  },
]

export function CasesPage() {
  return (
    <AppLayout
      title="Casos"
      description="Da seguimiento a la operación, escalaciones y resolución de casos."
    >
      <div className="space-y-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa1b1]" />
          <input
            type="text"
            placeholder="Buscar caso..."
            className="h-[50px] w-full rounded-full border border-[#eef2f7] bg-white pl-11 pr-4 text-sm text-[#252733] outline-none shadow-[0_4px_14px_rgba(120,144,180,0.06)] placeholder:text-[#a0a5b5]"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <SummaryCard icon={<FileText className="h-5 w-5" />} title="Casos abiertos" value="32" />
          <SummaryCard icon={<FolderKanban className="h-5 w-5" />} title="En revisión" value="11" />
          <SummaryCard icon={<ShieldAlert className="h-5 w-5" />} title="Escalados" value="3" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden rounded-[30px] border border-[#eef2f7] bg-white shadow-[0_8px_24px_rgba(120,144,180,0.08)]"
        >
          <div className="grid grid-cols-[1fr_1.3fr_1.2fr_1.2fr_1fr] bg-[#f8fafc] px-6 py-4 text-xs font-semibold uppercase tracking-[0.08em] text-[#9aa1b1]">
            <span>ID</span>
            <span>Cliente</span>
            <span>Tipo</span>
            <span>Responsable</span>
            <span>Estatus</span>
          </div>

          {cases.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_1.3fr_1.2fr_1.2fr_1fr] items-center border-t border-[#eef2f7] px-6 py-4 text-sm text-[#5b6474]"
            >
              <span className="font-medium text-[#252733]">{item.id}</span>
              <span>{item.customer}</span>
              <span>{item.type}</span>
              <span>{item.owner}</span>
              <span>
                <span className="rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-medium text-[#2f80ed]">
                  {item.status}
                </span>
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </AppLayout>
  )
}

function SummaryCard({
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