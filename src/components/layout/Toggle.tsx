"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ToggleProps {
  isOn: boolean
  onToggle: () => void
}

export default function Toggle({ isOn, onToggle }: ToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "relative h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-180",
        isOn ? "bg-honey-accent-primary" : "bg-honey-bg-user"
      )}
    >
      <motion.div
        className={cn(
          "absolute top-[2px] h-4 w-4 rounded-full transition-colors duration-180",
          isOn ? "bg-white" : "bg-honey-text-ghost"
        )}
        initial={false}
        animate={{ x: isOn ? 18 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  )
}
