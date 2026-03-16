"use client"

import { useState } from "react"
import { Conversation } from "@/types"

interface Props {
  conversations: Conversation[]
  activeId: string | null
  onSelect: (id: string) => void
  onNew: () => void
  onRename: (id: string, title: string) => void
  onDelete: (id: string) => void
  isOpen: boolean
  onClose: () => void
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Baru saja"
  if (mins < 60) return `${mins} menit lalu`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} jam lalu`
  const days = Math.floor(hours / 24)
  return `${days} hari lalu`
}

export default function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onRename,
  onDelete,
  isOpen,
  onClose,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [menuId, setMenuId] = useState<string | null>(null)

  const startEdit = (conv: Conversation) => {
    setEditingId(conv.id)
    setEditValue(conv.title)
    setMenuId(null)
  }

  const commitEdit = (id: string) => {
    if (editValue.trim()) onRename(id, editValue.trim())
    setEditingId(null)
  }

  const handleDelete = (id: string) => {
    if (confirm("Hapus obrolan ini?")) {
      onDelete(id)
      setMenuId(null)
    }
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-30 w-72
          bg-white/80 backdrop-blur-xl border-r border-amber-100
          flex flex-col shadow-2xl
          transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:shadow-none lg:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-amber-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍯</span>
            <span className="font-bold text-slate-700 text-base">Honey</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 rounded-xl bg-amber-50 text-amber-400 flex items-center justify-center hover:bg-amber-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* New chat button */}
        <div className="px-4 pt-4 pb-2">
          <button
            onClick={() => {
              onNew()
              onClose()
            }}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 text-white text-sm font-semibold shadow-md hover:opacity-90 transition-all active:scale-95"
          >
            <span className="text-base">＋</span>
            Obrolan baru
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          {conversations.length === 0 && (
            <p className="text-center text-xs text-slate-400 mt-8 px-4">
              Belum ada obrolan. Mulai curhat yuk! 💬
            </p>
          )}
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`relative group rounded-2xl px-3 py-2.5 cursor-pointer transition-all ${
                activeId === conv.id
                  ? "bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
                  : "hover:bg-amber-50/60"
              }`}
              onClick={() => {
                if (editingId !== conv.id) {
                  onSelect(conv.id)
                  onClose()
                }
              }}
            >
              {editingId === conv.id ? (
                <input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => commitEdit(conv.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitEdit(conv.id)
                    if (e.key === "Escape") setEditingId(null)
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full text-sm text-slate-700 bg-white border border-amber-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              ) : (
                <>
                  <p className="text-sm text-slate-700 font-medium truncate pr-6">{conv.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{timeAgo(conv.updatedAt)}</p>

                  {/* Menu button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setMenuId(menuId === conv.id ? null : conv.id)
                    }}
                    className="absolute right-2 top-2.5 w-6 h-6 rounded-lg text-slate-400 hover:bg-amber-100 hover:text-amber-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-xs"
                  >
                    ···
                  </button>

                  {/* Dropdown menu */}
                  {menuId === conv.id && (
                    <div
                      className="absolute right-2 top-8 z-40 bg-white rounded-xl shadow-lg border border-amber-100 py-1 w-36"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => startEdit(conv)}
                        className="w-full text-left px-3 py-2 text-xs text-slate-600 hover:bg-amber-50 flex items-center gap-2"
                      >
                        ✏️ Ganti nama
                      </button>
                      <button
                        onClick={() => handleDelete(conv.id)}
                        className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-50 flex items-center gap-2"
                      >
                        🗑️ Hapus
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-amber-100">
          <p className="text-xs text-slate-400 text-center">
            Semua chat tersimpan di browser kamu 🔒
          </p>
        </div>
      </aside>
    </>
  )
}
