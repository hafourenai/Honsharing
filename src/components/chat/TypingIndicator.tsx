"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const dotStyle = "h-[6px] w-[6px] rounded-full bg-honey-accent/60 animate-typing-bounce"

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="mb-2.5 flex w-full justify-start"
    >
      <div className="flex items-end gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-honey-surface border border-honey-border self-end mb-0.5 overflow-hidden">
          <Image src="/Logo.jpg" alt="Honey" width={28} height={28} className="object-cover w-full h-full" />
        </div>

        <div className="flex items-center justify-center rounded-[18px_18px_18px_4px] border border-honey-border bg-honey-surface px-4 py-3 h-[38px] shadow-glow">
          <div className="flex items-center gap-[4px]">
            <div className={dotStyle} style={{ animationDelay: "0s" }} />
            <div className={dotStyle} style={{ animationDelay: "0.2s" }} />
            <div className={dotStyle} style={{ animationDelay: "0.4s" }} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
