"use client"

import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Hapus",
  cancelLabel = "Batal",
  destructive = true,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/30"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6"
          >
            <div className="w-full max-w-xs rounded-xl bg-honey-surface border border-honey-border/50 shadow-glow-strong p-5">
              <div className="flex flex-col items-center text-center mb-5">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center mb-3",
                  destructive ? "bg-honey-danger-bg" : "bg-honey-accent/10"
                )}>
                  <span className={cn(
                    "text-lg",
                    destructive ? "text-honey-danger-text" : "text-honey-accent"
                  )}>!</span>
                </div>
                <h3 className="text-[14px] font-semibold text-honey-text-primary mb-1.5">{title}</h3>
                <p className="text-[13px] text-honey-text-muted leading-relaxed">{message}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { onConfirm(); onClose() }}
                  className={cn(
                    "w-full rounded-lg py-2 text-[13px] font-medium text-white transition-colors",
                    destructive
                      ? "bg-honey-danger-solid hover:bg-honey-danger-text"
                      : "bg-honey-accent hover:opacity-90"
                  )}
                >
                  {confirmLabel}
                </button>
                <button
                  onClick={onClose}
                  className="w-full rounded-lg py-2 text-[13px] text-honey-text-muted hover:text-honey-text-primary hover:bg-white/[0.06] transition-colors"
                >
                  {cancelLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
