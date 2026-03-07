import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface StatCardProps {
  title: string
  value: string
  icon: ReactNode
  badge?: string
}

export function StatCard({ title, value, icon, badge }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-[28px] border border-[#eef2f7] bg-white p-6 shadow-[0_8px_24px_rgba(120,144,180,0.08)]"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#8f95a3]">{title}</p>
          <h3 className="mt-3 text-[2rem] font-semibold tracking-[-0.04em] text-[#252733]">
            {value}
          </h3>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f4f7fb] text-[#2f80ed]">
          {icon}
        </div>
      </div>

      {badge && (
        <div className="mt-5 inline-flex rounded-full bg-[#eef8f1] px-3 py-1 text-xs font-medium text-[#3d8b5c]">
          {badge}
        </div>
      )}
    </motion.div>
  )
}