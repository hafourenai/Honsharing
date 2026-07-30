"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ChatBubbleProps {
  id: string
  text: string
  isBot: boolean
  delay?: number
}

export default function ChatBubble({ text, isBot, delay = 0 }: ChatBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1], delay }}
      className={cn("flex w-full", isBot ? "justify-start" : "justify-end")}
    >
      <div className={cn("flex items-end gap-2.5 max-w-[80%]", isBot ? "flex-row" : "flex-row-reverse")}>
        {isBot && (
          <div
            className="w-7 h-7 rounded-full shrink-0 self-end mb-0.5"
            style={{
              background: "radial-gradient(circle at 35% 30%, #f2d4a3, #d99ba6 70%)",
            }}
          />
        )}

        <div
          className={cn(
            "relative px-4 py-3 text-[14.5px] leading-relaxed",
            isBot
              ? "bg-honey-elevated border border-honey-border text-honey-text-primary rounded-[20px_20px_20px_6px] shadow-glow"
              : "text-[#2a1c12] font-medium rounded-[20px_20px_6px_20px]"
          )}
          style={isBot ? {} : {
            background: "linear-gradient(135deg, #f2d4a3, #e8b978)",
          }}
        >
          <div className="whitespace-pre-wrap">{text}</div>
        </div>
      </div>
    </motion.div>
  )
}
