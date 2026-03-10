import {
  Activity,
  Clock3,
  Ticket,
  Users,
} from "lucide-react"

import { PageHeader } from "@/shared/ui/PageHeader"
import { StatCard } from "@/shared/ui/StatCard"
import { SectionCard } from "@/shared/ui/SectionCard"
import { DataTable } from "@/shared/ui/DataTable"

const metrics = [
  {
    title: "Tickets abiertos",
    value: "128",
    badge: "+12% este mes",
    icon: <Ticket className="h-5 w-5" />,
  },
  {
    title: "Clientes activos",
    value: "54",
    badge: "+6% este mes",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Casos en proceso",
    value: "32",
    badge: "+9% este mes",
    icon: <Activity className="h-5 w-5" />,
  },
  {
    title: "Tiempo promedio",
    value: "2.4h",
    badge: "-18% este mes",
    icon: <Clock3 className="h-5 w-5" />,
  },
]

const recentCases = [
  {
    id: "CAS-00124",
    customer: "Transportes del Centro",
    subject: "Error al registrar ticket",
    status: "En revisión",
    priority: "Alta",
  },
  {
    id: "CAS-00125",
    customer: "Grupo Nova",
    subject: "Seguimiento de incidencia",
    status: "Abierto",
    priority: "Media",
  },
  {
    id: "CAS-00126",
    customer: "Comercializadora HM",
    subject: "Actualización de datos del cliente",
    status: "Resuelto",
    priority: "Baja",
  },
]

export function HomePage() {
  return (
    <>
      <PageHeader
        title="Panel principal"
        description="Supervisa el estado general de clientes, tickets y casos desde un solo lugar."
      />

      <div className="space-y-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((item) => (
            <StatCard
              key={item.title}
              title={item.title}
              value={item.value}
              badge={item.badge}
              icon={item.icon}
            />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
          <SectionCard
            title="Casos recientes"
            description="Seguimiento rápido de la operación más reciente."
            action={
              <button className="rounded-full border border-[#e7edf5] bg-[#f9fbfd] px-4 py-2 text-sm font-medium text-[#5e6676] transition hover:bg-white">
                Ver todos
              </button>
            }
          >
            <DataTable
              columns={[
                {
                  key: "id",
                  header: "ID",
                  render: (row) => (
                    <span className="font-medium text-[#252733]">{row.id}</span>
                  ),
                },
                { key: "customer", header: "Cliente" },
                { key: "subject", header: "Asunto" },
                {
                  key: "status",
                  header: "Estatus",
                  render: (row) => (
                    <span className="rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-medium text-[#2f80ed]">
                      {row.status}
                    </span>
                  ),
                },
                {
                  key: "priority",
                  header: "Prioridad",
                  render: (row) => (
                    <span className="rounded-full bg-[#fff4e8] px-3 py-1 text-xs font-medium text-[#b7721d]">
                      {row.priority}
                    </span>
                  ),
                },
              ]}
              rows={recentCases}
              getRowKey={(row) => row.id}
            />
          </SectionCard>

          <div className="space-y-6">
            <SectionCard
              title="Rendimiento"
              description="Resumen del flujo operativo actual."
            >
              <div className="space-y-4">
                <ProgressItem label="Tickets resueltos" value="78%" />
                <ProgressItem label="SLA cumplido" value="91%" />
                <ProgressItem label="Seguimiento activo" value="64%" />
              </div>
            </SectionCard>

            <SectionCard
              title="Resumen rápido"
              description="Datos clave del día."
            >
              <div className="space-y-4">
                <QuickStat label="Nuevos clientes" value="12" />
                <QuickStat label="Tickets críticos" value="5" />
                <QuickStat label="Casos escalados" value="3" />
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </>
  )
}

function ProgressItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-[#667085]">{label}</span>
        <span className="font-medium text-[#252733]">{value}</span>
      </div>

      <div className="h-2 rounded-full bg-[#eef2f7]">
        <div className="h-2 rounded-full bg-[#2f80ed]" style={{ width: value }} />
      </div>
    </div>
  )
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-[#f8fafc] px-4 py-3">
      <span className="text-sm text-[#667085]">{label}</span>
      <span className="text-base font-semibold text-[#252733]">{value}</span>
    </div>
  )
}