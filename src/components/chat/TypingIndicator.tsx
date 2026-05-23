"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } }}
      exit={{ opacity: 0, y: -4, transition: { duration: 0.15, ease: "easeOut" } }}
      className="mb-4 flex w-full justify-start"
    >
      <div className="mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[1.5px] border-honey-accent-lavender bg-honey-bg-elevated self-end mb-1 overflow-hidden">
        <Image src="/Logo.jpg" alt="Honey Logo" width={24} height={24} className="object-cover w-full h-full" />
      </div>

      <div className="flex items-center justify-center rounded-[4px_16px_16px_16px] border-[0.5px] border-honey-bg-user bg-honey-bg-bot px-4 py-3 h-[42px] shadow-sm">
        <div className="flex items-center justify-center space-x-[3px]">
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              className="h-[5px] w-[5px] rounded-full bg-honey-accent-lavender"
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
