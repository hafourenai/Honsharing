"use client"

import { useState, useRef, KeyboardEvent } from "react"

interface Props {
  onSend: (text: string) => void
  disabled?: boolean
}

export default function InputBar({ onSend, disabled }: Props) {
  const [text, setText] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (!text.trim() || disabled) return
    onSend(text.trim())
    setText("")
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    e.target.style.height = "auto"
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"
  }

  return (
    <div className="px-4 py-4 bg-white/60 backdrop-blur-md border-t border-amber-100">
      <div className="flex gap-2 items-end">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Cerita dulu yuk... 💭"
          rows={1}
          disabled={disabled}
          className="flex-1 resize-none rounded-2xl border border-amber-200 bg-white/90 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 text-slate-700 placeholder-slate-300 disabled:opacity-50"
          style={{ maxHeight: "120px", overflowY: "auto" }}
        />
        <button
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-white text-base disabled:opacity-40 transition-all active:scale-95 shadow-md"
          style={{ background: "linear-gradient(135deg, #fb923c, #f97316)" }}
        >
          ➤
        </button>
      </div>
      <p className="text-center text-xs text-slate-300 mt-2">
        Chat tersimpan di browser · Enter untuk kirim
      </p>
    </div>
  )
}
