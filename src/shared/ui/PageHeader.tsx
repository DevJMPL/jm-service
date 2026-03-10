import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="text-[1.8rem] font-semibold tracking-[-0.04em] text-[#252733]">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-[#8f95a3]">{description}</p>
        )}
      </div>

      {actions && <div>{actions}</div>}
    </div>
  )
}