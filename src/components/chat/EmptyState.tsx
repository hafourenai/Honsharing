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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mb-8 flex flex-col items-center text-center"
      >
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border-[1.5px] border-honey-accent-lavender bg-honey-bg-elevated overflow-hidden">
          <Image src="/Logo.jpg" alt="Honey Logo" width={64} height={64} className="object-cover w-full h-full" />
        </div>
        
        <h2 className="mb-2 font-playfair text-[22px] italic text-honey-accent-primary">
          ada apa hari ini?
        </h2>
        <p className="text-[13px] text-honey-text-muted">
          cerita aja, aku di sini untuk mendengarkan
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        className="flex w-full max-w-sm flex-col gap-3"
      >
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggest(s)}
            className="rounded-full border border-honey-bg-user bg-honey-bg-input px-4 py-3 text-[13px] text-honey-accent-lavender transition-colors hover:bg-honey-bg-user hover:text-honey-text-primary shadow-sm"
          >
            {`"${s}"`}
          </button>
        ))}
      </motion.div>
    </div>
  )
}
