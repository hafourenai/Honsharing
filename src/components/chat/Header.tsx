"use client"

import { PanelLeftClose, PanelLeftOpen, Clock } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

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
      className="flex items-center justify-between border-b-[0.5px] border-honey-bg-user px-4 h-[56px] z-40 bg-honey-bg-outer shrink-0 w-full pl-2 md:pl-4"
    >
      <div className="flex items-center gap-2 md:gap-3">
        {/* Desktop sidebar toggle — only shown when there's history */}
        {showHistory && onToggleSidebarPinned && (
          <button
            onClick={onToggleSidebarPinned}
            className="hidden md:flex h-8 w-8 items-center justify-center rounded-full text-honey-accent-lavender transition-colors hover:bg-honey-bg-elevated"
          >
            {isSidebarPinned ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeftOpen className="h-5 w-5" />
            )}
          </button>
        )}

        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-honey-accent-lavender bg-honey-bg-elevated overflow-hidden">
              <Image src="/Logo.jpg" alt="Honey Logo" width={40} height={40} className="object-cover w-full h-full" />
            </div>
            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-white bg-honey-status-online z-10" />
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
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-full text-honey-accent-lavender transition-colors hover:bg-honey-bg-elevated"
          >
            <PanelLeftOpen className="h-5 w-5" />
          </button>
        )}

        {/* Clock / history — hidden when desktop sidebar is pinned */}
        {onOpenHistory && !isSidebarPinned && (
          <button
            ref={clockRef}
            onClick={onOpenHistory}
            className="flex h-8 w-8 items-center justify-center rounded-full text-honey-accent-lavender transition-colors hover:bg-honey-bg-elevated"
          >
            <Clock className="h-5 w-5" />
          </button>
        )}
      </div>
    </motion.div>
  )
}
