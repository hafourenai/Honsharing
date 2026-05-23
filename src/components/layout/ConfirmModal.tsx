"use client"

import { motion, AnimatePresence } from "framer-motion"

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
            className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6"
          >
            <div className="w-full max-w-sm rounded-2xl bg-honey-bg-outer border border-honey-bg-user p-6 shadow-xl">
              <h3 className="font-playfair text-lg italic text-honey-text-primary mb-2">{title}</h3>
              <p className="text-[13px] text-honey-text-ghost mb-6">{message}</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={onClose}
                  className="rounded-lg px-4 py-2 text-[12px] text-honey-text-ghost hover:text-honey-text-primary transition-colors"
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={() => {
                    onConfirm()
                    onClose()
                  }}
                  className={`rounded-lg px-4 py-2 text-[12px] text-white transition-colors ${
                    destructive ? "bg-red-500 hover:bg-red-600" : "bg-honey-accent-primary hover:opacity-90"
                  }`}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
