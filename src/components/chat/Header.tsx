"use client"

import { PanelLeftClose, PanelLeftOpen, Clock } from "lucide-react"
import { motion } from "framer-motion"

interface HeaderProps {
  onOpenSidebar: () => void
  showHistory?: boolean
  isSidebarPinned?: boolean
  onToggleSidebarPinned?: () => void
  onOpenHistory?: () => void
  clockRef?: React.RefObject<HTMLButtonElement | null>
}

export default function Header({
  onOpenSidebar,
  showHistory,
  isSidebarPinned,
  onToggleSidebarPinned,
  onOpenHistory,
  clockRef,
}: HeaderProps) {
  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25, delay: 0.06, ease: "easeOut" }}
      className="flex items-center justify-between border-b-[0.5px] border-[#1a1528] px-4 h-[56px] z-40 bg-[#0a0812] shrink-0 w-full pl-2 md:pl-4"
    >
      <div className="flex items-center gap-2 md:gap-3">
        {/* Desktop sidebar toggle — only shown when there's history */}
        {showHistory && onToggleSidebarPinned && (
          <button
            onClick={onToggleSidebarPinned}
            className="hidden md:flex h-8 w-8 items-center justify-center rounded-full text-[#9b8ec4] transition-colors hover:bg-[#1e1830]"
          >
            {isSidebarPinned ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeftOpen className="h-5 w-5" />
            )}
          </button>
        )}

        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-[#4a3d6a] bg-honey-bg-elevated">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#9b8ec4" />
            </svg>
            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-[#0a0812] bg-honey-status-online" />
          </div>

          <div className="flex flex-col">
            <h1 className="font-playfair text-[15px] text-honey-text-primary">Honey</h1>
            <p className="font-jakarta text-[10px] text-honey-text-muted">mendengarkan · selalu ada</p>
          </div>
        </div>
      </div>

      {/* Right side icons */}
      <div className="flex items-center gap-1">
        {/* Mobile: open sidebar drawer */}
        {showHistory && !isSidebarPinned && (
          <button
            onClick={onOpenSidebar}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-full text-[#9b8ec4] transition-colors hover:bg-[#1e1830]"
          >
            <PanelLeftOpen className="h-5 w-5" />
          </button>
        )}

        {/* Clock / history — hidden when desktop sidebar is pinned */}
        {onOpenHistory && !isSidebarPinned && (
          <button
            ref={clockRef}
            onClick={onOpenHistory}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#9b8ec4] transition-colors hover:bg-[#1e1830]"
          >
            <Clock className="h-5 w-5" />
          </button>
        )}
      </div>
    </motion.div>
  )
}
