import type { ReactNode } from "react"

interface DataTableColumn<T> {
  key: keyof T | string
  header: string
  render?: (row: T) => ReactNode
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  rows: T[]
  getRowKey: (row: T) => string
}

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
}: DataTableProps<T>) {
  const templateColumns = `repeat(${columns.length}, minmax(0, 1fr))`

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#eef2f7]">
      <div
        className="bg-[#f8fafc] px-5 py-4 text-xs font-semibold uppercase tracking-[0.08em] text-[#9aa1b1]"
        style={{ display: "grid", gridTemplateColumns: templateColumns }}
      >
        {columns.map((column) => (
          <span key={String(column.key)}>{column.header}</span>
        ))}
      </div>

      {rows.map((row) => (
        <div
          key={getRowKey(row)}
          className="items-center border-t border-[#eef2f7] px-5 py-4 text-sm text-[#5b6474]"
          style={{ display: "grid", gridTemplateColumns: templateColumns }}
        >
          {columns.map((column) => (
            <div key={String(column.key)}>
              {column.render
                ? column.render(row)
                : String(row[column.key as keyof T] ?? "")}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}