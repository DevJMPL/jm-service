import type { ReactNode } from "react"

export interface TabItem {
  key: string
  label: string
  icon?: ReactNode
}

interface TabsProps {
  items: TabItem[]
  activeKey: string
  onChange: (key: string) => void
}

export function Tabs({ items, activeKey, onChange }: TabsProps) {
  return (
    <div className="flex flex-wrap gap-2 rounded-[22px] border border-[#eef2f7] bg-white p-2 shadow-[0_4px_14px_rgba(120,144,180,0.06)]">
      {items.map((item) => {
        const isActive = item.key === activeKey

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={[
              "inline-flex items-center gap-2 rounded-[16px] px-4 py-2.5 text-sm font-medium transition",
              isActive
                ? "bg-[#eef5ff] text-[#2f80ed]"
                : "text-[#6f7787] hover:bg-[#f7f9fc] hover:text-[#252733]",
            ].join(" ")}
          >
            {item.icon}
            {item.label}
          </button>
        )
      })}
    </div>
  )
}