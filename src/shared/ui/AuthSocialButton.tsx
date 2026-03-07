import type { ButtonHTMLAttributes, ReactNode } from "react"
import { motion } from "framer-motion"

interface AuthSocialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export function AuthSocialButton({
  children,
  className = "",
  ...props
}: AuthSocialButtonProps) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      className={[
        "flex h-14 w-14 items-center justify-center rounded-full",
        "border border-[#eef2f7] bg-[#f7f9fc] text-[#4f5666]",
        "shadow-[0_4px_14px_rgba(120,144,180,0.08)] transition",
        "hover:bg-white hover:shadow-[0_8px_20px_rgba(120,144,180,0.12)]",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </motion.button>
  )
}