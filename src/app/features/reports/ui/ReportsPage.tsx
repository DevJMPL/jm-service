import { motion } from "framer-motion"
import { BarChart3, Clock3, PieChart, TrendingUp } from "lucide-react"

export function ReportsPage() {
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        <ReportCard
          icon={<BarChart3 className="h-5 w-5" />}
          title="Volumen de tickets"
          description="Visualiza el comportamiento general de solicitudes y su evolución."
        />

        <ReportCard
          icon={<TrendingUp className="h-5 w-5" />}
          title="Tendencia de atención"
          description="Monitorea el ritmo de atención y resolución durante el periodo."
        />

        <ReportCard
          icon={<Clock3 className="h-5 w-5" />}
          title="Tiempos de respuesta"
          description="Analiza tiempos promedio, SLA y cumplimiento por tipo de caso."
        />

        <ReportCard
          icon={<PieChart className="h-5 w-5" />}
          title="Distribución por estatus"
          description="Revisa cómo se distribuyen los tickets entre estados y prioridades."
        />
      </div>
    </>
  )
}

function ReportCard({
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

      <div className="mt-6 h-40 rounded-[24px] bg-[#f8fafc] border border-[#eef2f7] flex items-center justify-center text-sm text-[#a0a5b5]">
        Gráfica próximamente
      </div>
    </motion.div>
  )
}