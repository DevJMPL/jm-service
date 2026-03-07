import { motion } from "framer-motion"
import type { ReactNode } from "react"

export interface TimelineItem {
  id: string
  icon: ReactNode
  title: string
  description?: string
  date: string
}

interface TimelineProps {
  items: TimelineItem[]
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative space-y-6 pl-8">
      <div className="absolute left-[14px] top-0 h-full w-[2px] bg-[#e9eef5]" />

      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04 }}
          className="relative"
        >
          <div className="absolute left-[-30px] flex h-7 w-7 items-center justify-center rounded-full bg-white border border-[#e9eef5] text-[#2f80ed]">
            {item.icon}
          </div>

          <div className="rounded-[22px] border border-[#eef2f7] bg-white p-4 shadow-[0_4px_14px_rgba(120,144,180,0.06)]">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-[#252733]">
                {item.title}
              </h4>

              <span className="text-xs text-[#8f95a3]">
                {item.date}
              </span>
            </div>

            {item.description && (
              <p className="mt-2 text-sm text-[#667085]">
                {item.description}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}