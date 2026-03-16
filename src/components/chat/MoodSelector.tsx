"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const MOODS = [
  { id: "kesepian", label: "kesepian" },
  { id: "kecewa", label: "kecewa" },
  { id: "marah", label: "marah" },
  { id: "hampa", label: "hampa" },
  { id: "cemas", label: "cemas" },
  { id: "bingung", label: "bingung" },
]

export default function MoodSelector({ onSelect }: { onSelect?: (mood: string) => void }) {
  const [activeMood, setActiveMood] = useState<string | null>(null)

  const handleSelect = (id: string) => {
    setActiveMood(id)
    onSelect?.(id)
  }

  return (
    <div className="flex w-full flex-col gap-2 p-4 pt-1 z-30 bg-honey-bg-outer bg-gradient-to-t from-honey-bg-outer via-honey-bg-outer to-transparent">
      <div className="text-[10px] uppercase tracking-wider text-honey-text-ghost pl-1">
        aku lagi merasa
      </div>
      
      <div className="flex w-full gap-2 overflow-x-auto scrollbar-hide pb-1">
        {MOODS.map((mood) => {
          const isActive = activeMood === mood.id
          return (
            <motion.button
              key={mood.id}
              onClick={() => handleSelect(mood.id)}
              animate={{ 
                scale: isActive ? [1, 1.06, 1] : 1,
                opacity: activeMood !== null && !isActive ? 0.5 : 1
              }}
              transition={{
                scale: { duration: 0.2 },
                opacity: { duration: 0.15, ease: "easeOut" }
              }}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-[12px] font-medium transition-colors duration-[150ms] ease-out",
                isActive
                  ? "border-[#6b5ca0] bg-[#231a3d] text-[#c4b8e8]"
                  : "border-[#2e2650] bg-[#13102099] text-[#8a7faa] hover:bg-[#231a3d] hover:text-[#c4b8e8]"
              )}
            >
              {mood.label}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
