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
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
  }

  const formatTime = (ts: number) => {
    const d = new Date(ts)
    return `${d.getHours().toString().padStart(2, "0")}.${d.getMinutes().toString().padStart(2, "0")}`
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        anchorRef?.current &&
        !anchorRef.current.contains(e.target as Node)
      ) onClose()
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, onClose, anchorRef])

  useEffect(() => { if (!isOpen) setSearchQuery("") }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: -4, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.96 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="absolute top-[48px] right-3 z-[80] w-[300px] rounded-xl bg-honey-surface border border-honey-border/50 shadow-glow flex flex-col overflow-hidden"
          style={{ maxHeight: "min(400px, calc(100vh - 90px))" }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-honey-border/30">
            <span className="text-[14px] font-medium text-honey-text-primary">Riwayat Chat</span>
            <button
              onClick={onClose}
              className="flex h-6 w-6 items-center justify-center rounded-md text-honey-text-muted/40 hover:text-honey-text-primary hover:bg-white/[0.06] transition-colors"
            >
              <X className="h-[14px] w-[14px]" />
            </button>
          </div>

          <div className="px-3 py-2.5 border-b border-honey-border/30">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-[14px] w-[14px] text-honey-text-muted/40" />
              <input
                type="text"
                placeholder="Cari chat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-honey-bg border border-honey-border/40 rounded-lg pl-8 pr-3 py-1.5 text-[13px] text-honey-text-primary placeholder:text-honey-text-muted/50 outline-none focus:border-honey-accent/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto honey-scrollbar py-1.5 px-1.5">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <MessageSquare className="h-8 w-8 text-honey-border/60" />
                <p className="text-[13px] text-honey-text-muted/60 text-center">
                  {searchQuery ? "Tidak ada chat ditemukan" : "Belum ada riwayat chat"}
                </p>
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
                      onClick={() => { onSelectChat(conv.id); onClose() }}
                      className={cn(
                        "flex flex-col items-start px-3 py-2 rounded-lg text-left transition-colors duration-150 w-full",
                        active
                          ? "bg-honey-accent/10"
                          : "hover:bg-white/[0.06]"
                      )}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <span className={cn("text-[13px] truncate flex-1 leading-tight", active ? "text-honey-accent font-medium" : "text-honey-text-primary")}>
                          {conv.title}
                        </span>
                      </div>
                      <div className="text-[11px] text-honey-text-muted/60 pl-0 mt-0.5">{meta}</div>
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
