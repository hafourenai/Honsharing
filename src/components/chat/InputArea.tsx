"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface InputAreaProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export default function InputArea({ onSend, disabled }: InputAreaProps) {
  const [text, setText] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = () => {
    const el = inputRef.current
    if (!el) return

    el.style.height = "auto"

    const computed = window.getComputedStyle(el)
    const lineHeight = Number.parseFloat(computed.lineHeight)
    const paddingTop = Number.parseFloat(computed.paddingTop)
    const paddingBottom = Number.parseFloat(computed.paddingBottom)
    const borderTop = Number.parseFloat(computed.borderTopWidth)
    const borderBottom = Number.parseFloat(computed.borderBottomWidth)

    const verticalPadding =
      (Number.isFinite(paddingTop) ? paddingTop : 0) +
      (Number.isFinite(paddingBottom) ? paddingBottom : 0)

    const verticalBorder =
      (Number.isFinite(borderTop) ? borderTop : 0) +
      (Number.isFinite(borderBottom) ? borderBottom : 0)

    const isBorderBox = computed.boxSizing === "border-box"
    const maxHeight = Number.isFinite(lineHeight)
      ? lineHeight * 3 + verticalPadding + (isBorderBox ? verticalBorder : 0)
      : 0

    if (maxHeight > 0) {
      el.style.maxHeight = `${maxHeight}px`
      const nextHeight = Math.min(el.scrollHeight, maxHeight)
      el.style.height = `${nextHeight}px`
      el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden"
    } else {
      el.style.height = `${el.scrollHeight}px`
      el.style.overflowY = "hidden"
    }
  }

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus()
    }
  }, [disabled])

  useEffect(() => {
    adjustHeight()
  }, [text])

  const handleSend = () => {
    if (text.trim() && !disabled) {
      setIsSending(true)
      setTimeout(() => setIsSending(false), 200)
      onSend(text)
      setText("")
    }
  }

  return (
    <div className="w-full bg-honey-bg-outer pb-6 pt-2 px-4 z-40">
      <motion.div 
        animate={{
          scale: isFocused ? 1.005 : 1,
          borderColor: isFocused ? "#8a74c2" : "#e4d9f1"
        }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="flex w-full items-center gap-2 rounded-full border bg-honey-bg-input p-1.5 shadow-sm"
      >
        <button className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-honey-bg-user text-honey-text-muted hover:text-honey-text-primary transition-colors">
          <Plus className="h-4 w-4" />
        </button>
        
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onInput={adjustHeight}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder="tulis apa yang kamu rasakan..."
          rows={1}
          className="flex-1 bg-transparent px-2 font-playfair italic text-[14px] text-honey-text-primary placeholder:text-honey-text-ghost focus:outline-none resize-none"
          disabled={disabled}
        />
        
        <motion.button
          onClick={handleSend}
          animate={{ scale: isSending ? [1, 0.88, 1] : 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          disabled={!text.trim() || disabled}
          className={cn(
            "flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full transition-colors",
            text.trim() && !disabled
              ? "bg-honey-accent-primary text-white"
              : "bg-honey-bg-user text-honey-text-muted"
          )}
        >
          <Send className="h-[14px] w-[14px] translate-x-[-1px] translate-y-[1px]" />
        </motion.button>
      </motion.div>

      <div className="mt-5 flex justify-center">
        <div className="h-1 w-[100px] rounded-full bg-honey-bg-user" />
      </div>
    </div>
  )
}
