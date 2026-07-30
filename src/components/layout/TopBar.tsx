"use client"

import { Clock, PanelLeftClose, PanelLeftOpen, Shield } from "lucide-react"
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
      className="flex items-center justify-between px-6 h-[52px] z-30 shrink-0 w-full"
    >
      <div className="flex items-center gap-2">
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
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-honey-border text-honey-text-muted/70">
          <Shield className="h-[13px] w-[13px]" />
          <span className="text-[11px] font-medium">cerita kamu tetap rahasia</span>
        </div>
      </div>

      <div className="flex items-center gap-1">
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
