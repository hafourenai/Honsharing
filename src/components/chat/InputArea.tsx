"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Mic, MicOff, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useVoiceChat } from "@/hooks/useVoiceChat"

interface InputAreaProps {
  onSend: (message: string) => void
  disabled?: boolean
  stopAiSpeech: () => void
}

export default function InputArea({ onSend, disabled, stopAiSpeech }: InputAreaProps) {
  const [text, setText] = useState("")
  const [voiceActive, setVoiceActive] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null) // Changed to HTMLTextAreaElement

  const {
    status: voiceStatus,
    error: voiceError,
    start: startVad,
    stop: stopVad,
  } = useVoiceChat({ onSend, stopAiSpeech })

  // Function to adjust textarea height
  const adjustHeight = () => {
    const el = inputRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 120)}px` // Max height 120px
  }

  useEffect(() => {
    if (!disabled && inputRef.current && !voiceActive) inputRef.current.focus()
  }, [disabled, voiceActive])

  useEffect(() => {
    adjustHeight() // Adjust height on text change
  }, [text])

  useEffect(() => {
    if (voiceStatus === "error") setVoiceActive(false)
  }, [voiceStatus])

  const toggleVoice = useCallback(() => {
    if (voiceActive) { stopVad(); setVoiceActive(false) }
    else { setVoiceActive(true); startVad() }
  }, [voiceActive, startVad, stopVad])

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text)
      setText("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // Shift + Enter for newline
        // Default browser behavior for textarea already inserts newline
      } else {
        // Enter for send
        e.preventDefault() // Prevent default newline
        handleSend()
      }
    }
  }

  const placeholder = voiceActive
    ? voiceStatus === "speaking" ? "sedang bicara..."
    : voiceStatus === "processing" ? "memproses suara..."
    : voiceStatus === "listening" ? "aku dengar..."
    : "tulis apa yang kamu rasakan..."
    : "tulis apa yang kamu rasakan..."

  return (
    <div className="w-full max-w-[680px] mx-auto">
      <div className="flex items-end gap-2 bg-honey-elevated border border-honey-border rounded-full px-2 py-1 shadow-glow">
        <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-honey-text-muted hover:text-honey-accent hover:bg-white/[0.06] transition-colors">
          <Plus className="h-[17px] w-[17px]" />
        </button>

        <textarea // Changed to textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown} // New handler
          placeholder={placeholder}
          rows={1}
          readOnly={voiceActive && voiceStatus === "speaking"}
          className="flex-1 bg-transparent px-2 text-[14.5px] text-honey-text-primary placeholder:text-honey-text-muted/60 focus:outline-none font-sans py-2.5 resize-none overflow-hidden" // Added resize-none and overflow-hidden
          disabled={disabled && !voiceActive}
        />

        <button
          type="button"
          onClick={toggleVoice}
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors",
            voiceActive && voiceStatus === "speaking"
              ? "bg-honey-danger-solid text-white"
              : voiceActive && (voiceStatus === "listening" || voiceStatus === "processing")
                ? "bg-honey-accent text-honey-bg"
                : "text-honey-text-muted hover:text-honey-accent hover:bg-white/[0.06]"
          )}
        >
          {voiceActive && voiceStatus === "speaking" ? (
            <Mic className="h-[16px] w-[16px]" />
          ) : voiceActive && voiceStatus === "processing" ? (
            <motion.div
              className="h-[14px] w-[14px] rounded-full border-2 border-honey-bg border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
            />
          ) : voiceActive && voiceStatus === "error" ? (
            <MicOff className="h-[16px] w-[16px]" />
          ) : (
            <Mic className="h-[16px] w-[16px]" />
          )}
        </button>

        <button
          onClick={handleSend}
          disabled={!text.trim() || disabled || voiceActive}
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors",
            text.trim() && !disabled
              ? "bg-honey-accent text-honey-bg"
              : "text-honey-text-muted/50"
          )}
          style={text.trim() && !disabled ? {
            background: "linear-gradient(135deg, #f2d4a3, #e8b978)",
          } : {}}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M4 12L20 4L13 20L11 13L4 12Z" fill="currentColor"/>
          </svg>
        </button>
      </div>

      <div className="text-center mt-2.5">
        <span className="text-[11px] text-honey-text-muted/50">Honey bisa saja keliru. Untuk kondisi darurat, hubungi layanan profesional.</span>
      </div>

      {voiceError && (
        <p className="text-xs text-honey-danger-text text-center mt-2">{voiceError}</p>
      )}
    </div>
  )
}
