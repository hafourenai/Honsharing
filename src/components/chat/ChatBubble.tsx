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
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1], delay }}
      className={cn("mb-2.5 flex w-full", isBot ? "justify-start" : "justify-end")}
    >
      <div className={cn("flex items-end gap-2 max-w-[78%]", isBot ? "flex-row" : "flex-row-reverse")}>
        {isBot && (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-honey-surface border border-honey-border self-end mb-0.5 overflow-hidden">
            <Image src="/Logo.jpg" alt="Honey" width={28} height={28} className="object-cover w-full h-full" />
          </div>
        )}

        <div
          className={cn(
            "relative px-3.5 py-2.5 text-[14px] leading-relaxed",
            isBot
              ? "bg-honey-surface text-honey-text-primary rounded-[18px_18px_18px_4px] border border-honey-border shadow-glow"
              : "bg-honey-accent text-honey-bg rounded-[18px_18px_4px_18px] shadow-glow-strong"
          )}
        >
          <div className="whitespace-pre-wrap">{text}</div>
        </div>
      </div>
    </motion.div>
  )
}
