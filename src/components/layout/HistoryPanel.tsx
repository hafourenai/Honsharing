"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Search, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { Conversation } from "@/lib/db"

interface HistoryPanelProps {
  isOpen: boolean
  onClose: () => void
  conversations: Conversation[]
  activeId: string | null
  onSelectChat: (id: string) => void
  anchorRef?: React.RefObject<HTMLButtonElement | null>
}

export default function HistoryPanel({
  isOpen,
  onClose,
  conversations,
  activeId,
  onSelectChat,
  anchorRef,
}: HistoryPanelProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const panelRef = useRef<HTMLDivElement>(null)

  const isToday = (ts: number) => {
    const d = new Date(ts)
    const today = new Date()
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    )
  }

  const formatTime = (ts: number) => {
    const d = new Date(ts)
    const hh = d.getHours().toString().padStart(2, "0")
    const mm = d.getMinutes().toString().padStart(2, "0")
    return `${hh}.${mm}`
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        anchorRef?.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, onClose, anchorRef])

  // Reset search on close
  useEffect(() => {
    if (!isOpen) setSearchQuery("")
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="absolute top-[56px] right-2 z-[80] w-[300px] rounded-xl bg-honey-bg-outer border border-honey-bg-user shadow-xl flex flex-col overflow-hidden"
          style={{ maxHeight: "min(420px, calc(100vh - 80px))" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-honey-bg-user">
            <div className="flex items-center gap-2">
              <span className="font-playfair text-honey-text-bot text-[13px] font-medium">Riwayat Chat</span>
            </div>
            <button
              onClick={onClose}
              className="flex h-6 w-6 items-center justify-center rounded-full text-honey-text-muted transition-colors hover:text-honey-accent-lavender hover:bg-honey-bg-elevated"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Search */}
          <div className="px-3 py-2.5 border-b border-honey-bg-user">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-honey-text-muted" />
              <input
                type="text"
                placeholder="Cari chat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-honey-bg-bot border border-honey-bg-user rounded-lg pl-9 pr-3 py-1.5 text-[11px] text-honey-text-primary placeholder-honey-text-ghost outline-none focus:border-honey-accent-primary transition-colors"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto py-2 px-2 scrollbar-hide">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <MessageSquare className="h-8 w-8 text-honey-bg-user" />
                <p className="text-[11px] text-honey-text-ghost text-center">
                  {searchQuery ? "Tidak ada chat ditemukan" : "Belum ada riwayat Chat"}
                </p>
                {!searchQuery && (
                  <p className="text-[10px] text-honey-text-ghost text-center">
                    Mulai Chat baru untuk percakapan<br />
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-0.5">
                {filteredConversations.map((conv) => {
                  const active = conv.id === activeId
                  const meta = isToday(conv.updatedAt)
                    ? `hari ini · ${formatTime(conv.updatedAt)}`
                    : formatTime(conv.updatedAt)

                  return (
                    <button
                      key={conv.id}
                      onClick={() => {
                        onSelectChat(conv.id)
                        onClose()
                      }}
                      className={cn(
                        "flex flex-col items-start px-3 py-2 rounded-lg text-left transition-all duration-150 w-full",
                        active
                          ? "bg-honey-bg-elevated border border-honey-bg-user"
                          : "hover:bg-honey-bg-input border border-transparent"
                      )}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <span className={cn("text-[9px] shrink-0", active ? "text-honey-accent-lavender" : "text-honey-text-ghost")}>
                          {active ? "●" : "○"}
                        </span>
                        <span
                          className={cn(
                            "text-[12px] font-jakarta truncate flex-1",
                            active ? "text-honey-text-primary" : "text-honey-text-bot"
                          )}
                        >
                          {conv.title}
                        </span>
                      </div>
                      <div className="text-[10px] text-honey-text-ghost pl-4 mt-0.5">{meta}</div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
