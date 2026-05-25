"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Pencil } from "lucide-react"
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
    if (tempName.trim()) {
      await updateProfileName(tempName.trim())
    }
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
            className="fixed inset-0 z-[80] bg-black/30 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 z-[90] flex h-full w-full flex-col bg-honey-bg-outer border-l-[0.5px] border-honey-bg-user md:w-[320px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b-[0.5px] border-honey-bg-user px-6 py-5">
              <h2 className="font-playfair text-lg italic text-honey-text-primary">pengaturan</h2>
              <button onClick={onClose} className="text-honey-text-ghost hover:text-honey-text-primary transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              <div className="mb-10 flex flex-col items-center">
                <div className="mb-4 flex h-[56px] w-[56px] items-center justify-center rounded-full bg-honey-bg-user text-xl font-bold uppercase text-honey-accent-primary shadow-lg">
                  {userProfile?.name?.charAt(0) || "K"}
                </div>
                
                {isEditingName ? (
                  <div className="flex flex-col items-center w-full">
                    <input
                      autoFocus
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleNameSave()}
                      onBlur={handleNameSave}
                      maxLength={20}
                      className="bg-transparent border-b-[0.5px] border-honey-accent-primary text-center text-[16px] text-honey-text-primary font-jakarta w-full outline-none py-1"
                    />
                  </div>
                ) : (
                  <div 
                    onClick={() => setIsEditingName(true)}
                    className="group flex cursor-pointer items-center gap-2"
                  >
                    <span className="text-[16px] text-honey-text-primary font-medium">{userProfile?.name || "kamu"}</span>
                    <Pencil className="h-3 w-3 text-honey-text-ghost group-hover:text-honey-accent-primary transition-colors" />
                  </div>
                )}
                
                <span className="mt-1 text-[10px] text-honey-text-ghost">bergabung {joiningDate} hari lalu</span>
              </div>

              <div className="mb-8 flex flex-col gap-6">
                <div className="text-[10px] font-jakarta uppercase tracking-wider text-honey-text-ghost">Preferensi Percakapan</div>
                
                {/* Bahasa */}
                <div className="flex items-center justify-between group">
                  <div className="flex flex-col">
                    <span className="text-[13px] text-honey-text-primary">Bahasa Honey</span>
                    <span className="text-[11px] text-honey-text-ghost">
                      {preferences.language === "santai" ? "Santai (default)" : "Formal"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-honey-bg-bot rounded-full p-1 border border-honey-bg-user">
                    <button 
                      onClick={() => updatePreferences({ language: "santai" })}
                      className={cn(
                        "px-3 py-1 text-[10px] rounded-full transition-all",
                        preferences.language === "santai" ? "bg-honey-bg-user text-honey-text-primary" : "text-honey-text-ghost"
                      )}
                    >
                      Santai
                    </button>
                    <button 
                      onClick={() => updatePreferences({ language: "formal" })}
                      className={cn(
                        "px-3 py-1 text-[10px] rounded-full transition-all",
                        preferences.language === "formal" ? "bg-honey-bg-user text-honey-text-primary" : "text-honey-text-ghost"
                      )}
                    >
                      Formal
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between opacity-60">
                  <div className="flex flex-col">
                    <span className="text-[13px] text-honey-text-primary">Call Dengan Honey</span>
                    <span className="text-[11px] text-honey-text-ghost">Mau Coba Interaksi Dengan ku?</span>
                    <span className="mt-0.5 text-[11px] italic text-amber-500">fitur ini masih dalam tahap pengembangan sampai developer punya duit</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[13px] text-honey-text-primary">Suara notifikasi</span>
                    <span className="text-[11px] text-honey-text-ghost">subtle chime saat membalas</span>
                  </div>
                  <Toggle 
                    isOn={preferences.soundNotif} 
                    onToggle={() => updatePreferences({ soundNotif: !preferences.soundNotif })} 
                  />
                </div>
              </div>

              <div className="mb-10 flex flex-col gap-4">
                <div className="text-[10px] font-jakarta uppercase tracking-wider text-honey-text-ghost">Privasi</div>
                <button 
                  onClick={() => setShowClearModal(true)}
                  className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-left text-[12px] text-red-500 hover:bg-red-100 transition-colors"
                >
                  hapus semua riwayat percakapan
                </button>
                <button
                  onClick={() => setShowResetModal(true)}
                  className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-left text-[12px] text-red-500 hover:bg-red-100 transition-colors"
                >
                  hard reset aplikasi
                </button>
              </div>
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
                message="Semua data lokal akan dihapus termasuk percakapan, preferensi, dan cache. Akun kamu tetap aman. Tindakan ini tidak bisa dibatalkan."
                confirmLabel="Hard Reset"
              />

              <div className="flex flex-col gap-1 border-t border-honey-bg-user pt-6 opacity-60">
                <span className="text-[11px] text-honey-text-primary">Honey v1.2</span>
                <span className="text-[10px] text-honey-text-ghost">dibuat dengan ❤ untuk kamu yang butuh teman</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
