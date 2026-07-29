"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Plus, X, Pencil, Trash2 } from "lucide-react"
import { Conversation, UserProfile } from "@/lib/db"
import Image from "next/image"

interface SidebarProps {
  conversations: Conversation[]
  activeId: string | null
  isOpenMobile: boolean
  isPinned?: boolean
  onCloseMobile: () => void
  onSelectChat: (id: string) => void
  onNewChat: () => void
  onRenameChat?: (id: string, newTitle: string) => Promise<void>
  onDeleteChat?: (id: string) => Promise<void>
  onOpenSettings?: () => void
  userProfile?: UserProfile | null
}

export default function Sidebar({
  conversations,
  activeId,
  isOpenMobile, // Keep isOpenMobile for now to simplify
  isPinned,
  onCloseMobile,
  onSelectChat,
  onNewChat,
  onRenameChat,
  onDeleteChat,
  onOpenSettings,
  userProfile
}: SidebarProps) {
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameInput, setRenameInput] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [sidebarWidth, setSidebarWidth] = useState(240)
  const [isResizing, setIsResizing] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedWidth = localStorage.getItem('sidebarWidth')
    if (savedWidth) {
      const width = parseInt(savedWidth, 10)
      if (width >= 200 && width <= 500) setSidebarWidth(width)
    }
  }, [])

  useEffect(() => {
    if (sidebarWidth >= 200 && sidebarWidth <= 500) {
      localStorage.setItem('sidebarWidth', sidebarWidth.toString())
    }
  }, [sidebarWidth])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing && sidebarRef.current) {
        const newWidth = e.clientX
        if (newWidth >= 200 && newWidth <= 500) setSidebarWidth(newWidth)
      }
    }
    const handleMouseUp = () => setIsResizing(false)
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, sidebarWidth])

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  const handleRenameConfirm = async () => {
    if (renamingId && onRenameChat) {
      const trimmed = renameInput.trim()
      if (trimmed) await onRenameChat(renamingId, trimmed)
    }
    setRenamingId(null)
  }

  const startRename = (conv: Conversation) => {
    setRenamingId(conv.id)
    setRenameInput(conv.title)
    setDeletingId(null)
  }

  const startDelete = (conv: Conversation) => {
    setDeletingId(conv.id)
    setRenamingId(null)
  }

  const confirmDelete = async (id: string) => {
    if (onDeleteChat) await onDeleteChat(id)
    setDeletingId(null)
  }

  const isToday = (ts: number) => {
    const d = new Date(ts)
    const today = new Date()
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
  }

  const formatTime = (ts: number) => {
    const d = new Date(ts)
    return `${d.getHours().toString().padStart(2, "0")}.${d.getMinutes().toString().padStart(2, "0")}`
  }

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 h-[44px] border-b border-honey-border/40 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="h-[18px] w-[18px] rounded-md overflow-hidden">
            <Image src="/Logo.jpg" alt="Honey" width={18} height={18} className="object-cover w-full h-full" />
          </div>
          <span className="font-playfair italic text-[15px] text-honey-text-primary">Honey</span>
        </div>
        <button onClick={onCloseMobile} className="md:hidden text-honey-text-muted/50 hover:text-honey-text-primary transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-3 pt-3 pb-2">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 rounded-lg bg-honey-accent/10 border border-honey-accent/15 px-3 py-2 hover:bg-honey-accent/15 transition-colors"
        >
          <Plus className="h-4 w-4 text-honey-accent shrink-0" />
          <span className="text-[13px] text-honey-accent font-medium">Percakapan Baru</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-2 pb-2">
        <div className="flex flex-col gap-0.5">
          <AnimatePresence initial={false} mode="popLayout">
            {conversations.map((conv) => {
              const active = conv.id === activeId
              const meta = isToday(conv.updatedAt)
                ? `hari ini · ${formatTime(conv.updatedAt)}`
                : formatTime(conv.updatedAt)

              const isRenaming = renamingId === conv.id
              const isDeleting = deletingId === conv.id

              if (isDeleting) {
                return (
                  <motion.div
                    key={conv.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-honey-danger-bg border border-honey-danger-border w-full mb-0.5 overflow-hidden"
                  >
                    <span className="text-[12px] text-honey-danger-text mb-2.5 font-medium">hapus percakapan ini?</span>
                    <div className="flex gap-2">
                      <button onClick={(e) => { e.stopPropagation(); setDeletingId(null); }} className="text-[11px] text-honey-accent hover:text-honey-text-primary px-3 py-1 rounded-md bg-honey-bg/80 transition-colors">batal</button>
                      <button onClick={(e) => { e.stopPropagation(); confirmDelete(conv.id); }} className="text-[11px] text-white px-3 py-1 rounded-md bg-honey-danger-solid hover:bg-honey-danger-text transition-colors">hapus</button>
                    </div>
                  </motion.div>
                )
              }

              return (
                <motion.button
                  key={conv.id}
                  layout="position"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  onClick={() => { if (!isRenaming) onSelectChat(conv.id) }}
                  className={cn(
                    "flex flex-col items-start rounded-lg px-3 py-2.5 text-left transition-colors duration-150 relative group/item w-full",
                    active
                      ? "bg-honey-accent/10"
                      : "hover:bg-white/[0.06]"
                  )}
                >
                  <div className="flex items-center gap-2.5 w-full">
                    <div className="flex-1 overflow-hidden min-w-0">
                      {isRenaming ? (
                        <input
                          autoFocus
                          value={renameInput}
                          onChange={(e) => setRenameInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleRenameConfirm()
                            if (e.key === "Escape") handleRenameConfirm()
                          }}
                          onBlur={handleRenameConfirm}
                          maxLength={40}
                          className="bg-transparent border-b border-honey-accent text-honey-text-primary text-[13px] font-outfit w-full outline-none p-0"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <div className={cn("truncate text-[13px] leading-tight", active ? "text-honey-accent font-medium" : "text-honey-text-primary")}>
                          {conv.title}
                        </div>
                      )}
                      <div className="text-[11px] text-honey-text-muted/60 mt-0.5">{meta}</div>
                    </div>

                    {!isRenaming && (
                      <div className="flex items-center gap-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-150 shrink-0">
                        <div onClick={(e) => { e.stopPropagation(); startRename(conv); }} className="p-1 hover:bg-white/[0.08] rounded-md transition-colors">
                          <Pencil className="w-[13px] h-[13px] text-honey-text-muted/50" />
                        </div>
                        <div onClick={(e) => { e.stopPropagation(); startDelete(conv); }} className="p-1 hover:bg-white/[0.08] rounded-md transition-colors">
                          <Trash2 className="w-[13px] h-[13px] text-honey-text-muted/50" />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.button>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      <button
        onClick={onOpenSettings}
        className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 border-t border-honey-border/40 hover:bg-white/[0.06] transition-colors shrink-0"
      >
        <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md bg-honey-accent/10 text-honey-accent text-[10px] font-medium uppercase">
          {userProfile?.name ? userProfile.name.charAt(0) : "K"}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-[13px] text-honey-text-primary truncate leading-tight">{userProfile?.name || "kamu"}</span>
          <span className="text-[11px] text-honey-text-muted/60 truncate">Pengaturan</span>
        </div>
      </button>
    </div>
  )

  return (
    <>
      <AnimatePresence>
        {isOpenMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onClick={onCloseMobile}
            className="fixed inset-0 z-[60] bg-black/30 md:hidden"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpenMobile && (
          <motion.div
            className="fixed inset-y-0 left-0 z-[70] w-[280px] bg-honey-surface border-r border-honey-border/40 md:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {SidebarContent}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        ref={sidebarRef}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={cn(
          "hidden",
          isPinned && "md:flex flex-col h-full bg-honey-surface border-r border-honey-border/40 z-30 group shrink-0 relative"
        )}
        style={{ width: `${sidebarWidth}px` }}
      >
        {SidebarContent}
        <div
          onMouseDown={startResize}
          className={cn(
            "absolute right-0 top-0 h-full w-[3px] cursor-col-resize transition-colors z-40",
            "hover:bg-honey-accent/30",
            isResizing && "bg-honey-accent/30"
          )}
        />
      </motion.div>
    </>
  )
}
