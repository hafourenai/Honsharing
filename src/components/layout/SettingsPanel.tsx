"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSettings } from "@/hooks/useSettings"
import Toggle from "./Toggle"

import { UserProfile } from "@/lib/db"

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  userProfile: UserProfile | null | undefined
  updateProfileName: (name: string) => Promise<void>
  clearAllHistory: () => Promise<void>
}

export default function SettingsPanel({ isOpen, onClose, userProfile, updateProfileName, clearAllHistory }: SettingsPanelProps) {
  const { preferences, updatePreferences } = useSettings()
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState("")

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
            className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 z-[90] flex h-full w-full flex-col bg-[#0d0a14] border-l-[0.5px] border-[#1a1528] md:w-[320px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b-[0.5px] border-[#1a1528] px-6 py-5">
              <h2 className="font-playfair text-lg italic text-[#e2d9f3]">pengaturan</h2>
              <button onClick={onClose} className="text-[#3d3356] hover:text-[#e2d9f3] transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              <div className="mb-10 flex flex-col items-center">
                <div className="mb-4 flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#261e45] text-xl font-bold uppercase text-white shadow-lg">
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
                      className="bg-transparent border-b-[0.5px] border-[#4a3d7a] text-center text-[16px] text-[#e2d9f3] font-jakarta w-full outline-none py-1"
                    />
                  </div>
                ) : (
                  <div 
                    onClick={() => setIsEditingName(true)}
                    className="group flex cursor-pointer items-center gap-2"
                  >
                    <span className="text-[16px] text-[#e2d9f3] font-medium">{userProfile?.name || "kamu"}</span>
                    <Pencil className="h-3 w-3 text-[#3d3356] group-hover:text-[#4a3d7a] transition-colors" />
                  </div>
                )}
                
                <span className="mt-1 text-[10px] text-[#3d3356]">bergabung {joiningDate} hari lalu</span>
              </div>

              <div className="mb-8 flex flex-col gap-6">
                <div className="text-[10px] font-jakarta uppercase tracking-wider text-[#3d3356]">Preferensi Percakapan</div>
                
                {/* Bahasa */}
                <div className="flex items-center justify-between group">
                  <div className="flex flex-col">
                    <span className="text-[13px] text-[#e2d9f3]">Bahasa Honey</span>
                    <span className="text-[11px] text-[#3d3356]">
                      {preferences.language === "santai" ? "Santai (default)" : "Formal"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#16122a] rounded-full p-1 border border-[#1a1528]">
                    <button 
                      onClick={() => updatePreferences({ language: "santai" })}
                      className={cn(
                        "px-3 py-1 text-[10px] rounded-full transition-all",
                        preferences.language === "santai" ? "bg-[#261e45] text-[#e2d9f3]" : "text-[#3d3356]"
                      )}
                    >
                      Santai
                    </button>
                    <button 
                      onClick={() => updatePreferences({ language: "formal" })}
                      className={cn(
                        "px-3 py-1 text-[10px] rounded-full transition-all",
                        preferences.language === "formal" ? "bg-[#261e45] text-[#e2d9f3]" : "text-[#3d3356]"
                      )}
                    >
                      Formal
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[13px] text-[#e2d9f3]">Suara notifikasi</span>
                    <span className="text-[11px] text-[#3d3356]">subtle chime saat membalas</span>
                  </div>
                  <Toggle 
                    isOn={preferences.soundNotif} 
                    onToggle={() => updatePreferences({ soundNotif: !preferences.soundNotif })} 
                  />
                </div>
              </div>

              <div className="mb-10 flex flex-col gap-4">
                <div className="text-[10px] font-jakarta uppercase tracking-wider text-[#3d3356]">Privasi</div>
                <button 
                  onClick={() => {
                    if (confirm("ini akan menghapus semua percakapanmu secara permanen.")) {
                      clearAllHistory()
                    }
                  }}
                  className="w-full rounded-lg border border-[#3d1515] bg-[#1a0d14] px-4 py-3 text-left text-[12px] text-[#c47a7a] hover:bg-[#25121a] transition-colors"
                >
                  hapus semua riwayat percakapan
                </button>
              </div>

              <div className="flex flex-col gap-1 border-t border-[#1a1528] pt-6 opacity-60">
                <span className="text-[11px] text-[#e2d9f3]">Honey v1.0</span>
                <span className="text-[10px] text-[#3d3356]">dibuat dengan ❤ untuk kamu yang butuh didengarkan</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
