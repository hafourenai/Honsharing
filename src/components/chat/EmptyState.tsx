"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface EmptyStateProps {
  onSuggest: (msg: string) => void
}

export default function EmptyState({ onSuggest }: EmptyStateProps) {
  const suggestions = [
    "aku lagi insecure",
    "butuh seseorang untuk diajak ngobrol",
    "nggak tau harus mulai dari mana",
  ]

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10 flex flex-col items-center text-center"
      >
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-honey-surface border border-honey-border overflow-hidden shadow-glow">
          <Image src="/Logo.jpg" alt="Honey Logo" width={64} height={64} className="object-cover w-full h-full" />
        </div>

        <h2 className="mb-2 font-playfair text-[24px] italic text-honey-accent leading-tight">
          ada apa hari ini?
        </h2>
        <p className="text-[14px] text-honey-text-muted max-w-[260px] leading-relaxed">
          cerita aja, aku di sini untuk mendengarkan
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        className="flex w-full max-w-sm flex-col gap-2.5"
      >
        {suggestions.map((s, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + i * 0.06, ease: "easeOut" }}
            onClick={() => onSuggest(s)}
            className="rounded-lg border border-honey-border bg-honey-surface px-4 py-3 text-[14px] text-honey-text-muted hover:text-honey-accent hover:border-honey-accent/40 hover:shadow-glow transition-colors duration-150 text-left"
          >
            &ldquo;{s}&rdquo;
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}
