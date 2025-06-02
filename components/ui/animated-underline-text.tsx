// No changes to this file
"use client"

import type React from "react"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedUnderlineTextProps {
  children: React.ReactNode
  className?: string
  underlineClassName?: string
  pathDefinition: string
  animationDelay?: number
  animationDuration?: number
  viewBox?: string
  strokeWidth?: number
  onUnderlineComplete?: () => void
}

export const PREDEFINED_UNDERLINE_PATHS = {
  gentleArc: "M2 3 Q50 1, 98 3",
  subtleWave: "M2 3 C 20 1, 40 5, 60 3 S 80 1, 98 3",
  slightCurveUp: "M2 2 Q50 4, 98 2",
}

export function AnimatedUnderlineText({
  children,
  className,
  underlineClassName,
  pathDefinition,
  animationDelay = 0.3,
  animationDuration = 0.7,
  viewBox = "0 0 100 5",
  strokeWidth = 1.2,
  onUnderlineComplete,
}: AnimatedUnderlineTextProps) {
  return (
    <span className={cn("relative inline-block", className)}>
      {children}
      <motion.svg
        className={cn("absolute bottom-[-4px] left-0 w-full h-[10px]", underlineClassName)}
        viewBox={viewBox}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <motion.path
          d={pathDefinition}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: "some" }}
          transition={{
            delay: animationDelay,
            duration: animationDuration,
            ease: "easeInOut",
          }}
          onAnimationComplete={onUnderlineComplete}
        />
      </motion.svg>
    </span>
  )
}
