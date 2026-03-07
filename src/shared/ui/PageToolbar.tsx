import type { ChangeEvent, ReactNode } from "react"
import { Search } from "lucide-react"

interface PageToolbarProps {
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (e: ChangeEvent<HTMLInputElement>) => void
  rightAction?: ReactNode
}

export function PageToolbar({
  searchPlaceholder = "Buscar...",
  searchValue = "",
  onSearchChange,
  rightAction,
}: PageToolbarProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa1b1]" />
        <input
          type="text"
          value={searchValue}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          className="h-[50px] w-full rounded-full border border-[#eef2f7] bg-white pl-11 pr-4 text-sm text-[#252733] outline-none shadow-[0_4px_14px_rgba(120,144,180,0.06)] placeholder:text-[#a0a5b5] transition focus:border-[#d8e6fb]"
        />
      </div>

      {rightAction && <div>{rightAction}</div>}
    </div>
  )
}