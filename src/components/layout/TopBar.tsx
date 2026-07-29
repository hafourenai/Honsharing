"use client"

import { Clock, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { motion } from "framer-motion"

interface TopBarProps {
  currentChatTitle?: string
  showHistory?: boolean
  isSidebarPinned?: boolean
  onToggleSidebarPinned?: () => void
  onOpenHistory?: () => void
  clockRef?: React.RefObject<HTMLButtonElement | null>
}

export default function TopBar({
  currentChatTitle,
  showHistory,
  isSidebarPinned,
  onToggleSidebarPinned,
  onOpenHistory,
  clockRef,
}: TopBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex items-center px-3 h-[44px] z-40 bg-honey-surface border-b border-honey-border shrink-0 w-full select-none"
    >
      <div className="flex items-center gap-1">
        {onToggleSidebarPinned && (
          <button
            onClick={onToggleSidebarPinned}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-honey-text-muted hover:text-honey-accent hover:bg-white/[0.06] transition-colors"
          >
            {isSidebarPinned ? (
              <PanelLeftClose className="h-[18px] w-[18px]" />
            ) : (
              <PanelLeftOpen className="h-[18px] w-[18px]" />
            )}
          </button>
        )}
        <span className="font-playfair italic text-[17px] text-honey-accent ml-1 leading-none">
          honey
        </span>
      </div>

      <div className="flex-1 flex justify-center">
        {currentChatTitle && currentChatTitle !== "Honey" && (
          <span className="text-[13px] text-honey-text-muted truncate max-w-[300px]">
            {currentChatTitle}
          </span>
        )}
      </div>

      <div className="flex items-center gap-0.5">
        {showHistory && onOpenHistory && (
          <button
            ref={clockRef}
            onClick={onOpenHistory}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-honey-text-muted hover:text-honey-accent hover:bg-white/[0.06] transition-colors"
          >
            <Clock className="h-[18px] w-[18px]" />
          </button>
        )}
      </div>
    </motion.div>
  )
}
