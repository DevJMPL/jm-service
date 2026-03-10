import { motion } from "framer-motion"
import type { ReactNode } from "react"
import type { HTMLMotionProps } from "framer-motion"

interface AuthSocialButtonProps extends HTMLMotionProps<"button"> {
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
      whileTap={{ scale: 0.97 }}
      className={[
        "flex h-12 w-12 items-center justify-center rounded-full cursor-pointer",
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