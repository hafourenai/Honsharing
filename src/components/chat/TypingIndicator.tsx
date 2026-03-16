"use client"

import { motion } from "framer-motion"

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } }}
      exit={{ opacity: 0, y: -4, transition: { duration: 0.15, ease: "easeOut" } }}
      className="mb-4 flex w-full justify-start"
    >
      <div className="mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#4a3d6a] bg-honey-bg-elevated self-end mb-1">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#9b8ec4" />
        </svg>
      </div>

      <div className="flex items-center justify-center rounded-[4px_16px_16px_16px] border-[0.5px] border-[#2e264a] bg-honey-bg-bot px-4 py-3 h-[42px]">
        <div className="flex items-center justify-center space-x-[3px]">
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              className="h-[5px] w-[5px] rounded-full bg-[#5a4f80]"
              animate={{
                y: [0, -4, 0],
                opacity: [0.4, 1, 0.4]
              }}
              transition={{
                duration: 1.3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: dot * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
