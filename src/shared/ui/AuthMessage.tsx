import type { ReactNode } from "react"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

interface AuthMessageProps {
  type: "error" | "success"
  children: ReactNode
}

export function AuthMessage({ type, children }: AuthMessageProps) {
  const isError = type === "error"

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className={[
        "flex items-start gap-3 rounded-[18px] border px-4 py-3 text-sm",
        isError
          ? "border-[#f5d4d4] bg-[#fff6f6] text-[#c65d5d]"
          : "border-[#d7edd8] bg-[#f3fbf4] text-[#4f8b59]",
      ].join(" ")}
    >
      {isError ? (
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <div>{children}</div>
    </motion.div>
  )
}