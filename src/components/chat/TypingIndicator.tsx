"use client"

import { motion } from "framer-motion"

const dotStyle = "h-[6px] w-[6px] rounded-full bg-honey-text-muted animate-typing-bounce"

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex w-full justify-start"
    >
      <div className="flex items-end gap-2.5 max-w-[80%]">
        <div
          className="w-7 h-7 rounded-full shrink-0 self-end mb-0.5"
          style={{
            background: "radial-gradient(circle at 35% 30%, #f2d4a3, #d99ba6 70%)",
          }}
        />

        <div className="flex items-center justify-center rounded-[20px_20px_20px_6px] border border-honey-border bg-honey-elevated px-4 py-3 h-[42px] shadow-glow">
          <div className="flex items-center gap-[5px]">
            <div className={dotStyle} style={{ animationDelay: "0s" }} />
            <div className={dotStyle} style={{ animationDelay: "0.15s" }} />
            <div className={dotStyle} style={{ animationDelay: "0.3s" }} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
