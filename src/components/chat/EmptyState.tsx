"use client"

import { motion } from "framer-motion"

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
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#2e264a] bg-[#1a1530]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#5a4f72" />
          </svg>
        </div>
        
        <h2 className="mb-2 font-playfair text-[22px] italic text-[#4a3d7a]">
          ada apa hari ini?
        </h2>
        <p className="text-[13px] text-[#3d3356]">
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
            className="rounded-full border border-[#2e264a] bg-[#131020] px-4 py-3 text-[13px] text-[#9b8ec4] transition-colors hover:bg-[#1e1830] hover:text-[#e2d9f3]"
          >
            {`"${s}"`}
          </button>
        ))}
      </motion.div>
    </div>
  )
}
