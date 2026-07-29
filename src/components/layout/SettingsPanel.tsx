"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Pencil, MessageCircle, Bell, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSettings } from "@/hooks/useSettings"
import Toggle from "./Toggle"
import ConfirmModal from "./ConfirmModal"
import { UserProfile } from "@/lib/db"

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  userProfile: UserProfile | null | undefined
  updateProfileName: (name: string) => Promise<void>
  clearAllHistory: () => Promise<void>
  onHardReset: () => Promise<void>
}

export default function SettingsPanel({ isOpen, onClose, userProfile, updateProfileName, clearAllHistory, onHardReset }: SettingsPanelProps) {
  const { preferences, updatePreferences } = useSettings()
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState("")
  const [showResetModal, setShowResetModal] = useState(false)
  const [showClearModal, setShowClearModal] = useState(false)

  useEffect(() => {
    if (userProfile) setTempName(userProfile.name)
  }, [userProfile])

  const handleNameSave = async () => {
    if (tempName.trim()) await updateProfileName(tempName.trim())
    setIsEditingName(false)
  }

  const joiningDate = userProfile?.onboardedAt
    ? Math.floor((Date.now() - userProfile.onboardedAt) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-black/30"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="fixed inset-y-0 right-0 z-[90] flex h-full w-full flex-col bg-honey-surface border-l border-honey-border/40 md:w-[340px]"
          >
            <div className="flex items-center justify-between px-5 h-[44px] border-b border-honey-border/40 shrink-0">
              <h2 className="text-[15px] font-medium text-honey-text-primary">Pengaturan</h2>
              <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-md text-honey-text-muted/50 hover:text-honey-text-primary hover:bg-white/[0.06] transition-colors">
                <X className="h-[17px] w-[17px]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto honey-scrollbar px-4 py-5">
              <div className="flex flex-col items-center mb-8">
                <div className="mb-3 flex h-[60px] w-[60px] items-center justify-center rounded-xl bg-gradient-to-br from-honey-accent/10 to-honey-accent-glow/10 border border-honey-accent/10 shadow-sm">
                  <span className="text-xl font-medium text-honey-accent">{userProfile?.name?.charAt(0) || "K"}</span>
                </div>

                {isEditingName ? (
                  <input
                    autoFocus
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleNameSave()}
                    onBlur={handleNameSave}
                    maxLength={20}
                    className="bg-transparent border-b border-honey-accent text-center text-[15px] text-honey-text-primary font-outfit w-full max-w-[200px] outline-none py-0.5"
                  />
                ) : (
                  <div onClick={() => setIsEditingName(true)} className="group flex cursor-pointer items-center gap-2">
                    <span className="text-[15px] text-honey-text-primary font-medium">{userProfile?.name || "kamu"}</span>
                    <Pencil className="h-3 w-3 text-honey-text-muted/40 group-hover:text-honey-accent transition-colors" />
                  </div>
                )}
                <span className="mt-1 text-[11px] text-honey-text-muted/60">bergabung {joiningDate} hari lalu</span>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MessageCircle className="h-[15px] w-[15px] text-honey-text-muted/50" />
                    <span className="text-[12px] font-medium text-honey-text-muted/70">Preferensi Percakapan</span>
                  </div>

                  <div className="space-y-3 pl-7">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[14px] text-honey-text-primary">Bahasa Honey</span>
                        <span className="text-[12px] text-honey-text-muted/60">
                          {preferences.language === "santai" ? "Santai" : "Formal"}
                        </span>
                      </div>
                      <div className="flex items-center rounded-lg border border-honey-border/40 p-0.5 bg-honey-input">
                        <button
                          onClick={() => updatePreferences({ language: "santai" })}
                          className={cn(
                            "px-3 py-1 text-[12px] rounded-md transition-colors",
                            preferences.language === "santai" ? "bg-honey-accent text-honey-bg shadow-sm" : "text-honey-text-muted/60 hover:text-honey-text-primary"
                          )}
                        >
                          Santai
                        </button>
                        <button
                          onClick={() => updatePreferences({ language: "formal" })}
                          className={cn(
                            "px-3 py-1 text-[12px] rounded-md transition-colors",
                            preferences.language === "formal" ? "bg-honey-accent text-honey-bg shadow-sm" : "text-honey-text-muted/60 hover:text-honey-text-primary"
                          )}
                        >
                          Formal
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between opacity-60">
                      <div className="flex flex-col">
                        <span className="text-[14px] text-honey-text-primary">Call Dengan Honey</span>
                        <span className="text-[12px] text-honey-text-muted/60">Mau coba interaksi dengan ku?</span>
                        <span className="text-[11px] italic text-honey-text-muted/40 mt-0.5">fitur ini masih dalam tahap pengembangan</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Bell className="h-[15px] w-[15px] text-honey-text-muted/50" />
                    <span className="text-[12px] font-medium text-honey-text-muted/70">Notifikasi</span>
                  </div>

                  <div className="space-y-3 pl-7">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[14px] text-honey-text-primary">Suara notifikasi</span>
                        <span className="text-[12px] text-honey-text-muted/60">subtle chime saat membalas</span>
                      </div>
                      <Toggle
                        isOn={preferences.soundNotif}
                        onToggle={() => updatePreferences({ soundNotif: !preferences.soundNotif })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-[15px] w-[15px] text-honey-text-muted/50" />
                    <span className="text-[12px] font-medium text-honey-text-muted/70">Privasi</span>
                  </div>

                  <div className="space-y-2 pl-7">
                    <button
                      onClick={() => setShowClearModal(true)}
                      className="w-full rounded-lg border border-honey-danger-border bg-honey-danger-bg px-4 py-2.5 text-left text-[13px] text-honey-danger-text hover:bg-honey-danger-bg/80 transition-colors"
                    >
                      Hapus Semua Riwayat
                    </button>
                    <button
                      onClick={() => setShowResetModal(true)}
                      className="w-full rounded-lg border border-honey-danger-border bg-honey-danger-bg px-4 py-2.5 text-left text-[13px] text-honey-danger-text hover:bg-honey-danger-bg/80 transition-colors"
                    >
                      Hard Reset Aplikasi
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-honey-border/30 flex flex-col gap-0.5 items-center">
                <span className="text-[12px] text-honey-text-muted/50">Honey v1.2</span>
                <span className="text-[11px] text-honey-text-muted/40">dibuat untuk kamu yang butuh teman</span>
              </div>
            </div>
          </motion.div>

          <ConfirmModal
            isOpen={showClearModal}
            onClose={() => setShowClearModal(false)}
            onConfirm={clearAllHistory}
            title="Hapus Semua Riwayat?"
            message="ini akan menghapus semua percakapanmu secara permanen."
            confirmLabel="Hapus Semua"
          />
          <ConfirmModal
            isOpen={showResetModal}
            onClose={() => setShowResetModal(false)}
            onConfirm={onHardReset}
            title="Hard Reset Aplikasi?"
            message="Semua data lokal akan dihapus termasuk percakapan, preferensi, dan cache."
            confirmLabel="Hard Reset"
          />
        </>
      )}
    </AnimatePresence>
  )
}
