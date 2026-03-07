import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface SectionCardProps {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
}

export function SectionCard({
  title,
  description,
  action,
  children,
}: SectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32 }}
      className="rounded-[30px] border border-[#eef2f7] bg-white p-6 shadow-[0_8px_24px_rgba(120,144,180,0.08)]"
    >
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-[-0.03em] text-[#252733]">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm text-[#8f95a3]">{description}</p>
          )}
        </div>

        {action && <div>{action}</div>}
      </div>

      {children}
    </motion.div>
  )
}