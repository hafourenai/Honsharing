"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Mic, MicOff, Plus, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { useVoiceChat } from "@/hooks/useVoiceChat"

interface InputAreaProps {
  onSend: (message: string) => void
  disabled?: boolean
  stopAiSpeech: () => void
}

export default function InputArea({ onSend, disabled, stopAiSpeech }: InputAreaProps) {
  const [text, setText] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [voiceActive, setVoiceActive] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const {
    status: voiceStatus,
    error: voiceError,
    start: startVad,
    stop: stopVad,
  } = useVoiceChat({ onSend, stopAiSpeech })

  const voiceColor =
    voiceStatus === "speaking" ? "#c46a6a" :
    voiceStatus === "listening" ? "#d4a373" :
    voiceStatus === "processing" ? "#d4a373" :
    "#3a3a44"

  const adjustHeight = () => {
    const el = inputRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 80)}px`
  }

  useEffect(() => {
    if (!disabled && inputRef.current && !voiceActive) inputRef.current.focus()
  }, [disabled, voiceActive])

  useEffect(() => { adjustHeight() }, [text])

  useEffect(() => {
    if (voiceStatus === "error") setVoiceActive(false)
  }, [voiceStatus])

  const toggleVoice = useCallback(() => {
    if (voiceActive) { stopVad(); setVoiceActive(false) }
    else { setVoiceActive(true); startVad() }
  }, [voiceActive, startVad, stopVad])

  const handleSend = () => {
    if (text.trim() && !disabled) {
      setIsSending(true)
      setTimeout(() => setIsSending(false), 200)
      onSend(text)
      setText("")
    }
  }

  const placeholder = voiceActive
    ? voiceStatus === "speaking" ? "sedang bicara..."
    : voiceStatus === "processing" ? "memproses suara..."
    : voiceStatus === "listening" ? "aku dengar..."
    : "tulis apa yang kamu rasakan..."
    : "tulis apa yang kamu rasakan..."

  return (
    <div className="w-full pt-1 pb-[max(env(safe-area-inset-bottom,8px),8px)] px-3 z-40 border-t border-honey-border bg-honey-bg">
      <motion.div
        animate={{
          borderColor: voiceActive ? voiceColor : isFocused ? "#d4a373" : "#2e2e38",
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className={cn(
          "flex w-full items-end gap-1.5 rounded-[10px] border bg-honey-input px-2 py-1 shadow-sm transition-shadow duration-150",
          isFocused && "shadow-glow"
        )}
      >
        <button className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg text-honey-text-muted/50 hover:text-honey-accent hover:bg-white/[0.06] transition-colors self-end">
          <Plus className="h-[16px] w-[16px]" />
        </button>

        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onInput={adjustHeight}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() }
          }}
          placeholder={placeholder}
          rows={1}
          readOnly={voiceActive && voiceStatus === "speaking"}
          className="flex-1 bg-transparent px-1 text-[14px] text-honey-text-primary placeholder:text-honey-text-muted/50 focus:outline-none resize-none leading-relaxed py-1.5 max-h-[80px] font-outfit"
          disabled={disabled && !voiceActive}
        />

        <motion.button
          type="button"
          onClick={toggleVoice}
          whileTap={{ scale: 0.9 }}
          className={cn(
            "flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg transition-colors self-end",
            voiceActive && voiceStatus === "speaking"
              ? "bg-honey-danger-solid text-white"
              : voiceActive && (voiceStatus === "listening" || voiceStatus === "processing")
                ? "bg-honey-accent text-honey-bg"
                : "text-honey-text-muted/50 hover:text-honey-accent hover:bg-white/[0.06]"
          )}
        >
          {voiceActive && voiceStatus === "speaking" ? (
            <Mic className="h-[15px] w-[15px]" />
          ) : voiceActive && voiceStatus === "processing" ? (
            <motion.div
              className="h-[14px] w-[14px] rounded-full border-2 border-honey-bg border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
            />
          ) : voiceActive && voiceStatus === "error" ? (
            <MicOff className="h-[15px] w-[15px]" />
          ) : (
            <Mic className="h-[15px] w-[15px]" />
          )}
        </motion.button>

        <motion.button
          onClick={handleSend}
          animate={{ scale: isSending ? [1, 0.88, 1] : 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          disabled={!text.trim() || disabled || voiceActive}
          className={cn(
            "flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg transition-colors self-end",
            text.trim() && !disabled
              ? "bg-honey-accent text-honey-bg"
              : "text-honey-text-muted/50"
          )}
        >
          <Send className="h-[14px] w-[14px]" />
        </motion.button>
      </motion.div>

      {voiceError && (
        <p className="text-xs text-honey-danger-text text-center mt-2">{voiceError}</p>
      )}
    </div>
  )
}
