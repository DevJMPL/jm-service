import type { ButtonHTMLAttributes, ReactNode } from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

interface AuthPrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  children: ReactNode
}

export function AuthPrimaryButton({
  loading = false,
  disabled,
  children,
  className = "",
  ...props
}: AuthPrimaryButtonProps) {
  const isDisabled = disabled || loading

  return (
    <motion.button
      whileTap={{ scale: isDisabled ? 1 : 0.99 }}
      whileHover={{ y: isDisabled ? 0 : -1 }}
      type="button"
      disabled={isDisabled}
      className={[
        "flex h-[52px] w-full items-center justify-center gap-2 rounded-full",
        "bg-[#2f80ed] px-6 text-base font-semibold text-white",
        "shadow-[0_10px_24px_rgba(47,128,237,0.22)] transition",
        "hover:bg-[#2274e2]",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      ].join(" ")}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </motion.button>
  )
}