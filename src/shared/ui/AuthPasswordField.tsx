import { useState } from "react"
import type { InputHTMLAttributes } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff } from "lucide-react"

interface AuthPasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string | null
  helperActionLabel?: string
  onHelperActionClick?: () => void
}

export function AuthPasswordField({
  id,
  label,
  error,
  helperActionLabel,
  onHelperActionClick,
  className = "",
  ...props
}: AuthPasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: 0.03 }}
    >
      <div className="mb-3 flex items-center justify-between">
        <label htmlFor={id} className="block text-sm font-medium text-[#8f95a3]">
          {label}
        </label>

        {helperActionLabel && (
          <button
            type="button"
            onClick={onHelperActionClick}
            className="text-sm font-medium text-[#7a8090] transition hover:text-[#4e5565]"
          >
            {helperActionLabel}
          </button>
        )}
      </div>

      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          className={[
            "h-[52px] w-full rounded-[20px]",
            "border bg-[#f4f7fb] pl-5 pr-14",
            "text-[1rem] text-[#252733] outline-none transition",
            "placeholder:text-[#b0b5c2]",
            "focus:bg-white focus:shadow-[0_8px_24px_rgba(125,152,197,0.10)]",
            error
              ? "border-[#efcaca] focus:border-[#efcaca]"
              : "border-[#eef2f7] focus:border-[#d8e6fb]",
            className,
          ].join(" ")}
          {...props}
        />

        <button
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((prev) => !prev)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a0a7b6] transition hover:text-[#6f7787]"
        >
          {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </motion.div>
  )
}