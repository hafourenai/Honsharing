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
      initial={{ opacity: 0, y: isBot ? 10 : 0, x: isBot ? 0 : 12, scale: isBot ? 0.97 : 1 }}
      animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      transition={{ 
        duration: isBot ? 0.25 : 0.18, 
        ease: isBot ? [0.16, 1, 0.3, 1] : "easeOut",
        delay
      }}
      className={cn("mb-4 flex w-full", isBot ? "justify-start" : "justify-end")}
    >
      {isBot && (
        <div className="mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#4a3d6a] bg-honey-bg-elevated self-end mb-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#9b8ec4" />
          </svg>
        </div>
      )}

      <div
        className={cn(
          "relative max-w-[80%] px-4 py-3 leading-relaxed",
          isBot
            ? "rounded-[4px_16px_16px_16px] border-[0.5px] border-[#2e264a] bg-honey-bg-bot text-[13px] text-honey-text-bot font-inter"
            : "rounded-[16px_4px_16px_16px] border-[0.5px] border-[#3d3060] bg-honey-bg-user text-[13px] text-honey-text-user font-inter font-medium"
        )}
      >
        <div className="whitespace-pre-wrap">{text}</div>
      </div>
    </motion.div>
  )
}
