"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Plus, X, Pencil, Trash2 } from "lucide-react"
import { Conversation, UserProfile } from "@/lib/db"

interface SidebarProps {
  conversations: Conversation[]
  activeId: string | null
  isOpenMobile: boolean
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
        <div className="p-4 border-b-[0.5px] border-[#1a1528]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-playfair text-[#4a3d7a] text-lg font-medium flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#9b8ec4" />
              </svg>
              <span>Honey</span>
            </h2>
            {/* Close button only visible on mobile */}
            <button onClick={onCloseMobile} className="md:hidden text-honey-text-muted hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <button 
            onClick={onNewChat}
            className="w-full flex items-center gap-2 rounded-lg bg-[#16122a] border border-[#2e264a] p-2 hover:bg-[#1e1838] transition-colors"
          >
            <Plus className="h-4 w-4 text-[#9b8ec4] shrink-0" />
            <span className="text-[12px] font-jakarta text-[#e2d9f3] whitespace-nowrap overflow-hidden">mulai percakapan baru</span>
          </button>
        </div>

        {/* History List */}
        <div className="p-2 py-4">
          <div className="px-2 mb-2 text-[9px] uppercase tracking-[0.1em] text-[#3d3356]">
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
                    className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#1a1530]/50 border border-[#2e264a] w-full mb-1 overflow-hidden"
                  >
                    <span className="text-[11px] text-[#c47a7a] mb-2 font-medium">hapus percakapan ini?</span>
                    <div className="flex gap-2">
                      <button onClick={(e) => { e.stopPropagation(); setDeletingId(null); }} className="text-[10px] text-[#9b8ec4] hover:text-white px-3 py-1 rounded bg-[#2e264a] transition-colors">batal</button>
                      <button onClick={(e) => { e.stopPropagation(); confirmDelete(conv.id); }} className="text-[10px] text-white hover:bg-red-700 px-3 py-1 rounded bg-[#c47a7a] font-medium transition-colors">hapus</button>
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
                    active ? "bg-[#1a1530] border border-[#2e264a]" : "hover:bg-[#131020] border border-transparent"
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
                               className="bg-transparent border-b-[0.5px] border-[#4a3d7a] text-[#e2d9f3] text-[12px] font-jakarta w-full outline-none p-0"
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
                            className={cn("truncate text-[12px] pr-4", active ? "text-[#e2d9f3]" : "text-[#c4b8e8]")}
                          >
                            {active ? "\u25cf" : "\u25cb"} {conv.title}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {!isRenaming && (
                        <div className="text-[10px] text-[#3d3356] pl-3.5 truncate">
                          {meta}
                        </div>
                      )}
                    </div>

                    {/* Action Icons */}
                    {!isRenaming && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity duration-150 z-20">
                        <div 
                          onClick={(e) => { e.stopPropagation(); startRename(conv); }} 
                          className="p-1 hover:bg-[#1e1838] rounded cursor-pointer"
                        >
                          <Pencil className="w-[14px] h-[14px] text-[#5a4f72] hover:text-[#9b8ec4]" />
                        </div>
                        <div 
                          onClick={(e) => { e.stopPropagation(); startDelete(conv); }} 
                          className="p-1 hover:bg-[#1e1838] rounded cursor-pointer"
                        >
                          <Trash2 className="w-[14px] h-[14px] text-[#5a4f72] hover:text-[#9b8ec4]" />
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
        className="w-full text-left p-4 border-t-[0.5px] border-[#1a1528] flex items-center gap-3 hover:bg-[#1a1530] transition-colors cursor-pointer"
      >
        <div className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-[#261e45] text-white text-[10px] font-bold uppercase transition-colors">
          {userProfile?.name ? userProfile.name.charAt(0) : "K"}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-[11px] text-[#e2d9f3] truncate">{userProfile?.name || "kamu"}</span>
          <span className="text-[10px] text-[#3d3356] truncate">profil & pengaturan</span>
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
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-[2px] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpenMobile && (
          <motion.div
            className="fixed inset-y-0 left-0 z-[70] w-[280px] bg-[#0d0a14] border-r-[0.5px] border-[#1a1528] md:hidden"
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
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut", delay: 0 }}
        className="hidden md:flex flex-col h-full bg-[#0d0a14] border-r-[0.5px] border-[#1a1528] z-30 group shrink-0 w-[240px]"
      >
        {SidebarContent}
      </motion.div>
    </>
  )
}
