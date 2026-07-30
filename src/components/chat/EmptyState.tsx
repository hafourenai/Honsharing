"use client"

import { motion } from "framer-motion"

interface EmptyStateProps {
  onSuggest: (msg: string) => void
}

export default function EmptyState({ onSuggest }: EmptyStateProps) {
  const suggestions = [
    "aku lagi insecure banget akhir-akhir ini",
    "butuh teman ngobrol malam ini",
    "bingung harus mulai dari mana",
    "hari ini berat banget",
  ]

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 pb-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center text-center"
      >
        <div className="relative w-24 h-24 mb-7">
          <div
            className="absolute inset-0 rounded-full animate-breathe"
            style={{
              background: "radial-gradient(circle at 35% 30%, #f2d4a3, #d99ba6 70%)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[34px]">
            🌸
          </div>
        </div>

        <h1 className="font-display italic font-medium text-[34px] text-honey-accent-soft leading-tight tracking-[0.2px]">
          malam ini cerita apa?
        </h1>
        <p className="mt-2.5 text-[15px] text-honey-text-muted max-w-[360px] leading-relaxed">
          nggak perlu rapi, nggak perlu jelas. aku di sini, pelan-pelan dengerin.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-wrap gap-2.5 justify-center max-w-[560px] mt-8"
      >
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggest(s)}
            className="px-4 py-2.5 rounded-full text-[14px] text-honey-text-muted bg-honey-elevated border border-honey-border hover:border-honey-accent/50 hover:text-honey-accent-soft hover:bg-honey-accent/10 transition-all duration-200"
          >
            {s}
          </button>
        ))}
      </motion.div>
    </div>
  )
}
