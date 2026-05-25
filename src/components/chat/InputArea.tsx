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
    voiceStatus === "speaking" ? "#ef4444" :
    voiceStatus === "listening" ? "#8a74c2" :
    voiceStatus === "processing" ? "#f59e0b" :
    "#e4d9f1"

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
    if (!disabled && inputRef.current && !voiceActive) {
      inputRef.current.focus()
    }
  }, [disabled, voiceActive])

  useEffect(() => {
    adjustHeight()
  }, [text])

  useEffect(() => {
    if (voiceStatus === "error") {
      setVoiceActive(false)
    }
  }, [voiceStatus])

  const toggleVoice = useCallback(() => {
    if (voiceActive) {
      stopVad()
      setVoiceActive(false)
    } else {
      setVoiceActive(true)
      startVad()
    }
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
    ? voiceStatus === "speaking"
      ? "sedang bicara..."
      : voiceStatus === "processing"
        ? "memproses suara..."
        : voiceStatus === "listening"
          ? "aku dengar..."
          : "tulis apa yang kamu rasakan..."
    : "tulis apa yang kamu rasakan..."

  return (
    <div className="w-full bg-honey-bg-outer pb-6 pt-2 px-4 z-40">
      <motion.div
        animate={{
          scale: isFocused ? 1.005 : 1,
          borderColor: voiceActive ? voiceColor : isFocused ? "#8a74c2" : "#e4d9f1",
        }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className={cn(
          "flex w-full items-center gap-2 rounded-full border bg-honey-bg-input p-1.5 shadow-sm",
          voiceActive && voiceStatus === "speaking" && "border-red-400"
        )}
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
          placeholder={placeholder}
          rows={1}
          readOnly={voiceActive && voiceStatus === "speaking"}
          className="flex-1 bg-transparent px-2 font-playfair italic text-[14px] text-honey-text-primary placeholder:text-honey-text-ghost focus:outline-none resize-none"
          disabled={disabled && !voiceActive}
        />

        <motion.button
          type="button"
          onClick={toggleVoice}
          whileTap={{ scale: 0.9 }}
          className={cn(
            "flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full transition-colors relative",
            voiceActive && voiceStatus === "speaking"
              ? "bg-red-500 text-white"
              : voiceActive && voiceStatus === "listening"
                ? "bg-honey-accent-primary text-white"
                : voiceActive && voiceStatus === "processing"
                  ? "bg-amber-500 text-white"
                  : voiceActive && voiceStatus === "error"
                    ? "bg-red-100 text-red-500"
                    : "bg-honey-bg-user text-honey-text-muted hover:text-honey-text-primary"
          )}
        >
          {voiceActive && voiceStatus === "speaking" ? (
            <>
              <Mic className="h-4 w-4" />
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-red-400"
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </>
          ) : voiceActive && voiceStatus === "listening" ? (
            <>
              <Mic className="h-4 w-4" />
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-honey-accent-primary"
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </>
          ) : voiceActive && voiceStatus === "processing" ? (
            <motion.div
              className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
            />
          ) : voiceActive && voiceStatus === "error" ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </motion.button>

        <motion.button
          onClick={handleSend}
          animate={{ scale: isSending ? [1, 0.88, 1] : 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          disabled={!text.trim() || disabled || voiceActive}
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

      {voiceError && (
        <p className="text-xs text-red-400 text-center mt-2">{voiceError}</p>
      )}

      <div className="mt-5 flex justify-center">
        <div className="h-1 w-[100px] rounded-full bg-honey-bg-user" />
      </div>
    </div>
  )
}
