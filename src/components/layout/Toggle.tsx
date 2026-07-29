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
        "relative h-[22px] w-[38px] shrink-0 cursor-pointer rounded-full transition-colors duration-200",
        isOn ? "bg-honey-status-online" : "bg-honey-border"
      )}
    >
      <motion.div
        className="absolute top-[2px] h-[18px] w-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.15)]"
        animate={{ x: isOn ? 18 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.8 }}
      />
    </button>
  )
}
