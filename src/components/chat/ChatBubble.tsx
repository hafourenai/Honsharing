"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Image from "next/image"

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
        <div className="mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[1.5px] border-honey-accent-lavender bg-honey-bg-elevated self-end mb-1 overflow-hidden">
          <Image src="/Logo.jpg" alt="Honey Logo" width={24} height={24} className="object-cover w-full h-full" />
        </div>
      )}

      <div
        className={cn(
          "relative max-w-[80%] px-4 py-3 leading-relaxed",
          isBot
            ? "rounded-[4px_16px_16px_16px] border-[0.5px] border-honey-bg-user bg-honey-bg-bot text-[13px] text-honey-text-bot font-inter shadow-sm"
            : "rounded-[16px_4px_16px_16px] border-[0.5px] border-honey-accent-lavender bg-honey-bg-user text-[13px] text-honey-text-user font-inter font-medium shadow-sm"
        )}
      >
        <div className="whitespace-pre-wrap">{text}</div>
      </div>
    </motion.div>
  )
}
