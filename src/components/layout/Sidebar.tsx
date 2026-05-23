"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Plus, X, Pencil, Trash2, GripVertical } from "lucide-react"
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
  isOpenMobile,
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

  // Load saved width from localStorage
  useEffect(() => {
    const savedWidth = localStorage.getItem('sidebarWidth')
    if (savedWidth) {
      const width = parseInt(savedWidth, 10)
      if (width >= 200 && width <= 500) {
        setSidebarWidth(width)
      }
    }
  }, [])

  // Save width to localStorage when it changes
  useEffect(() => {
    if (sidebarWidth >= 200 && sidebarWidth <= 500) {
      localStorage.setItem('sidebarWidth', sidebarWidth.toString())
    }
  }, [sidebarWidth])

  // Handle mouse move during resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing && sidebarRef.current) {
        const newWidth = e.clientX
        // Constrain width between 200px and 500px
        if (newWidth >= 200 && newWidth <= 500) {
          setSidebarWidth(newWidth)
        }
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  const handleRenameConfirm = async () => {
    if (renamingId && onRenameChat) {
      const trimmed = renameInput.trim()
      if (trimmed) {
        await onRenameChat(renamingId, trimmed)
      }
    }
    setRenamingId(null)
  }

  const handleRenameCancel = () => {
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
    if (onDeleteChat) {
      await onDeleteChat(id)
    }
    setDeletingId(null)
  }

  // Group by timeframe
  const isToday = (ts: number) => {
    const d = new Date(ts)
    const today = new Date()
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
  }

  const formatTime = (ts: number) => {
    const d = new Date(ts)
    const hh = d.getHours().toString().padStart(2, "0")
    const mm = d.getMinutes().toString().padStart(2, "0")
    return `${hh}.${mm}`
  }

  const SidebarContent = (
    <div className="flex h-full flex-col justify-between">
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* New Chat Header */}
        <div className="p-4 border-b-[0.5px] border-honey-bg-user">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-playfair text-honey-accent-primary text-lg font-medium flex items-center gap-2">
              <div className="h-[18px] w-[18px] rounded-full overflow-hidden">
                <Image src="/Logo.jpg" alt="Honey" width={18} height={18} className="object-cover w-full h-full" />
              </div>
              <span>Honey</span>
            </h2>
            {/* Close button only visible on mobile */}
            <button onClick={onCloseMobile} className="md:hidden text-honey-text-muted hover:text-honey-text-primary">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <button 
            onClick={onNewChat}
            className="w-full flex items-center gap-2 rounded-lg bg-honey-bg-bot border border-honey-bg-user p-2 hover:bg-honey-bg-user transition-colors"
          >
            <Plus className="h-4 w-4 text-honey-accent-lavender shrink-0" />
            <span className="text-[12px] font-jakarta text-honey-text-primary whitespace-nowrap overflow-hidden">mulai percakapan baru</span>
          </button>
        </div>

        {/* History List */}
        <div className="p-2 py-4">
          <div className="px-2 mb-2 text-[9px] uppercase tracking-[0.1em] text-honey-text-ghost">
            RIWAYAT
          </div>
          <div className="flex flex-col gap-1">
            <AnimatePresence initial={false} mode="popLayout">
              {conversations.map((conv) => {
                const active = conv.id === activeId
                const meta = isToday(conv.updatedAt) ? `hari ini \u00b7 ${formatTime(conv.updatedAt)}` : formatTime(conv.updatedAt)
              
              const isRenaming = renamingId === conv.id
              const isDeleting = deletingId === conv.id
              
              if (isDeleting) {
                return (
                  <motion.div
                    key={conv.id}
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 2 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0, x: -20, transition: { duration: 0.18, ease: "easeOut" } }}
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-red-50 border border-red-200 w-full mb-1 overflow-hidden"
                  >
                    <span className="text-[11px] text-red-500 mb-2 font-medium">hapus percakapan ini?</span>
                    <div className="flex gap-2">
                      <button onClick={(e) => { e.stopPropagation(); setDeletingId(null); }} className="text-[10px] text-honey-accent-lavender hover:text-honey-text-primary px-3 py-1 rounded bg-honey-bg-user transition-colors">batal</button>
                      <button onClick={(e) => { e.stopPropagation(); confirmDelete(conv.id); }} className="text-[10px] text-white hover:bg-red-700 px-3 py-1 rounded bg-red-500 font-medium transition-colors">hapus</button>
                    </div>
                  </motion.div>
                )
              }
              
              return (
                <motion.button
                  key={conv.id}
                  layout="position"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 2 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0, x: -20, transition: { duration: 0.18, ease: "easeOut" } }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  onClick={() => {
                    if (!isRenaming) onSelectChat(conv.id)
                  }}
                  className={cn(
                    "flex flex-col items-start rounded-lg px-2.5 py-2 text-left transition-colors duration-150 relative group/item overflow-hidden",
                    active ? "bg-honey-bg-elevated border border-honey-bg-user" : "hover:bg-honey-bg-input border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-2 w-full relative">
                    {/* Expanded Content */}
                    <div className="flex-1 overflow-hidden relative w-full pr-12">
                      <AnimatePresence mode="wait">
                        {isRenaming ? (
                           <motion.div 
                             key="input"
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             exit={{ opacity: 0 }}
                             transition={{ duration: 0.12 }}
                             className="mb-0.5"
                           >
                             <input
                               autoFocus
                               value={renameInput}
                               onChange={(e) => setRenameInput(e.target.value)}
                               onKeyDown={(e) => {
                                 if (e.key === "Enter") handleRenameConfirm()
                                 if (e.key === "Escape") handleRenameCancel()
                               }}
                               onBlur={handleRenameConfirm}
                               maxLength={40}
                               className="bg-transparent border-b-[0.5px] border-honey-accent-primary text-honey-text-primary text-[12px] font-jakarta w-full outline-none p-0"
                               onClick={(e) => e.stopPropagation()}
                             />
                           </motion.div>
                        ) : (
                          <motion.div 
                            key="text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.12 }}
                            className={cn("truncate text-[12px] pr-4", active ? "text-honey-text-primary" : "text-honey-text-bot")}
                          >
                            {active ? "\u25cf" : "\u25cb"} {conv.title}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {!isRenaming && (
                        <div className="text-[10px] text-honey-text-ghost pl-3.5 truncate">
                          {meta}
                        </div>
                      )}
                    </div>

                    {/* Action Icons */}
                    {!isRenaming && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity duration-150 z-20">
                        <div 
                          onClick={(e) => { e.stopPropagation(); startRename(conv); }} 
                          className="p-1 hover:bg-honey-bg-user rounded cursor-pointer"
                        >
                          <Pencil className="w-[14px] h-[14px] text-honey-text-muted hover:text-honey-accent-lavender" />
                        </div>
                        <div 
                          onClick={(e) => { e.stopPropagation(); startDelete(conv); }} 
                          className="p-1 hover:bg-honey-bg-user rounded cursor-pointer"
                        >
                          <Trash2 className="w-[14px] h-[14px] text-honey-text-muted hover:text-honey-accent-lavender" />
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
      </div>

      {/* Profile Footer */}
      <button 
        onClick={onOpenSettings}
        className="w-full text-left p-4 border-t-[0.5px] border-honey-bg-user flex items-center gap-3 hover:bg-honey-bg-elevated transition-colors cursor-pointer"
      >
        <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-honey-bg-user text-honey-accent-primary text-[10px] font-bold uppercase transition-colors">
          {userProfile?.name ? userProfile.name.charAt(0) : "K"}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-[11px] text-honey-text-primary truncate">{userProfile?.name || "kamu"}</span>
          <span className="text-[10px] text-honey-text-ghost truncate">profil & pengaturan</span>
        </div>
      </button>
    </div>
  )

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpenMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={onCloseMobile}
            className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpenMobile && (
          <motion.div
            className="fixed inset-y-0 left-0 z-[70] w-[280px] bg-honey-bg-outer border-r-[0.5px] border-honey-bg-user"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {SidebarContent}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.div 
        ref={sidebarRef}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut", delay: 0 }}
        className={cn(
          "hidden",
          isPinned && "md:flex flex-col h-full bg-honey-bg-outer border-r-[0.5px] border-honey-bg-user z-30 group shrink-0 relative"
        )}
        style={{ width: `${sidebarWidth}px` }}
      >
        {SidebarContent}
        
        {/* Resize Handle */}
        <div
          onMouseDown={startResize}
          className={cn(
            "absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-honey-accent-primary/50 transition-colors z-40",
            isResizing && "bg-honey-accent-primary/50"
          )}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 flex items-center justify-center">
            <GripVertical className="h-4 w-4 text-honey-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </motion.div>
    </>
  )
}
