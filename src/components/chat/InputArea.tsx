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
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus()
    }
  }, [disabled])

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
          borderColor: isFocused ? "#4a3d7a" : "#2a2248"
        }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="flex w-full items-center gap-2 rounded-full border bg-honey-bg-input p-1.5"
      >
        <button className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[#1e1838] text-honey-text-muted hover:text-honey-text-primary transition-colors">
          <Plus className="h-4 w-4" />
        </button>
        
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend()
          }}
          placeholder="tulis apa yang kamu rasakan..."
          className="flex-1 bg-transparent px-2 font-playfair italic text-[14px] text-honey-text-primary placeholder:text-[#3d3560] focus:outline-none"
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
              ? "bg-honey-accent-primary text-honey-text-primary"
              : "bg-[#2a2248] text-[#5a4f72]"
          )}
        >
          <Send className="h-[14px] w-[14px] translate-x-[-1px] translate-y-[1px]" />
        </motion.button>
      </motion.div>

      <div className="mt-5 flex justify-center">
        <div className="h-1 w-[100px] rounded-full bg-[#2a2248]" />
      </div>
    </div>
  )
}
