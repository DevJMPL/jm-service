import type { InputHTMLAttributes } from "react"
import { motion } from "framer-motion"

interface AuthTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string | null
}

export function AuthTextField({
  id,
  label,
  error,
  className = "",
  ...props
}: AuthTextFieldProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
    >
      <label htmlFor={id} className="mb-3 block text-sm font-medium text-[#8f95a3]">
        {label}
      </label>

      <input
        id={id}
        className={[
          "h-[52px] w-full rounded-[20px]",
          "border px-5 text-[1rem] text-[#252733]",
          "bg-[#f4f7fb] outline-none transition",
          "placeholder:text-[#b0b5c2]",
          "focus:bg-white focus:shadow-[0_8px_24px_rgba(125,152,197,0.10)]",
          error
            ? "border-[#efcaca] focus:border-[#efcaca]"
            : "border-[#eef2f7] focus:border-[#d8e6fb]",
          className,
        ].join(" ")}
        {...props}
      />
    </motion.div>
  )
}