"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Mic, MicOff, Plus, Send, Square } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAudioRecorder } from "@/hooks/useAudioRecorder"

interface InputAreaProps {
  onSend: (message: string) => void
  disabled?: boolean
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

export default function InputArea({ onSend, disabled }: InputAreaProps) {
  const [text, setText] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [transcribing, setTranscribing] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const { status, duration, startRecording, stopRecording, error } = useAudioRecorder()

  const isRecording = status === "recording"

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
    if (!disabled && inputRef.current && !isRecording && !transcribing) {
      inputRef.current.focus()
    }
  }, [disabled, isRecording, transcribing])

  useEffect(() => {
    adjustHeight()
  }, [text])

  const handleToggleMic = async () => {
    if (isRecording) {
      const blob = await stopRecording()
      if (blob.size > 0) {
        setTranscribing(true)
        try {
          const formData = new FormData()
          formData.append("audio", blob, "recording.webm")
          const res = await fetch("/api/stt", { method: "POST", body: formData })
          if (res.ok) {
            const data = await res.json()
            const transcript = data.transcript?.trim()
            if (transcript) {
              setIsSending(true)
              setTimeout(() => setIsSending(false), 200)
              onSend(transcript)
            }
          } else {
            const err = await res.json()
            console.error("STT error:", err.error)
          }
        } catch (e) {
          console.error("STT fetch error:", e)
        } finally {
          setTranscribing(false)
        }
      }
    } else {
      await startRecording()
    }
  }

  const handleSend = () => {
    if (text.trim() && !disabled) {
      setIsSending(true)
      setTimeout(() => setIsSending(false), 200)
      onSend(text)
      setText("")
    }
  }

  const placeholder = isRecording
    ? "sedang merekam..."
    : transcribing
      ? "memproses suara..."
      : "tulis apa yang kamu rasakan..."

  return (
    <div className="w-full bg-honey-bg-outer pb-6 pt-2 px-4 z-40">
      <motion.div 
        animate={{
          scale: isFocused ? 1.005 : 1,
          borderColor: isRecording ? "#ef4444" : isFocused ? "#8a74c2" : "#e4d9f1"
        }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className={cn(
          "flex w-full items-center gap-2 rounded-full border bg-honey-bg-input p-1.5 shadow-sm",
          isRecording && "border-red-400"
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
          readOnly={isRecording || transcribing}
          className="flex-1 bg-transparent px-2 font-playfair italic text-[14px] text-honey-text-primary placeholder:text-honey-text-ghost focus:outline-none resize-none"
          disabled={disabled && !isRecording && !transcribing}
        />

        {isRecording && (
          <span className="text-xs text-red-500 font-mono tabular-nums shrink-0">
            {formatDuration(duration)}
          </span>
        )}

        {transcribing && (
          <motion.div
            className="h-4 w-4 shrink-0 rounded-full border-2 border-honey-accent-primary border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
          />
        )}

        <motion.button
          type="button"
          onClick={handleToggleMic}
          disabled={(disabled && !isRecording) || transcribing}
          whileTap={{ scale: 0.9 }}
          className={cn(
            "flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full transition-colors relative",
            isRecording
              ? "bg-red-500 text-white"
              : "bg-honey-bg-user text-honey-text-muted hover:text-honey-text-primary"
          )}
        >
          {isRecording ? (
            <>
              <Square className="h-3 w-3" />
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-red-400"
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </>
          ) : status === "stopping" ? (
            <motion.div
              className="h-4 w-4 rounded-full border-2 border-honey-text-muted border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
            />
          ) : error ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </motion.button>
        
        <motion.button
          onClick={handleSend}
          animate={{ scale: isSending ? [1, 0.88, 1] : 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          disabled={!text.trim() || disabled || isRecording || transcribing}
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

      {error && (
        <p className="text-xs text-red-400 text-center mt-2">{error}</p>
      )}

      <div className="mt-5 flex justify-center">
        <div className="h-1 w-[100px] rounded-full bg-honey-bg-user" />
      </div>
    </div>
  )
}
