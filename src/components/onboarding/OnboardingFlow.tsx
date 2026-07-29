"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import Image from "next/image"

const MOODS = [
  { id: "kesepian", label: "kesepian" },
  { id: "kecewa", label: "kecewa" },
  { id: "marah", label: "marah" },
  { id: "sedih", label: "sedih" },
  { id: "galau", label: "galau" },
  { id: "sakit hati", label: "sakit hati" },
  { id: "bingung", label: "bingung" },
  { id: "tidak dihargai", label: "tidak dihargai" },
  { id: "insecure", label: "insecure" },
  { id: "overthinking", label: "overthinking" }
]

interface OnboardingFlowProps {
  onComplete: (name: string, initialMood: string) => void
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1)
  const [showSubtext, setShowSubtext] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [name, setName] = useState("")
  const [mood, setMood] = useState("")

  useEffect(() => {
    if (step === 1) {
      const subtextTimer = setTimeout(() => setShowSubtext(true), 800)
      const buttonTimer = setTimeout(() => setShowButton(true), 1400)
      return () => { clearTimeout(subtextTimer); clearTimeout(buttonTimer) }
    }
  }, [step])

  const handleNext = () => setStep((s) => s + 1)

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-honey-bg relative overflow-hidden text-honey-text-primary p-6">
      <div className="absolute inset-0 bg-gradient-to-b from-honey-accent/[0.05] to-transparent pointer-events-none" />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center max-w-sm"
          >
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              className="mb-8 flex h-[72px] w-[72px] items-center justify-center rounded-[18px] bg-honey-surface border border-honey-border/40 shadow-glow overflow-hidden"
            >
              <Image src="/Logo.jpg" alt="Honey Logo" width={72} height={72} className="object-cover w-full h-full" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-playfair text-[34px] italic text-honey-text-primary leading-tight mb-5"
            >
              hei, aku Honey.
            </motion.h1>

            <AnimatePresence>
              {showSubtext && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-[15px] text-honey-text-muted/70 mb-10 leading-relaxed"
                >
                  aku di sini untuk mendengarkan, bukan menghakimi.
                </motion.p>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showButton && (
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  onClick={handleNext}
                  className="rounded-xl bg-honey-accent text-honey-bg px-8 py-3 text-[15px] font-medium hover:opacity-90 transition-opacity shadow-sm"
                >
                  kenalan dulu
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col max-w-sm w-full"
          >
            <h2 className="font-playfair text-[26px] italic text-honey-text-primary mb-1.5 leading-tight">panggil aku apa?</h2>
            <p className="text-[14px] text-honey-text-muted/70 mb-8">biar percakapan kita terasa lebih personal.</p>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 20))}
              placeholder="nama atau panggilanmu..."
              className="w-full rounded-xl border border-honey-border/40 bg-honey-input px-4 py-3 text-[15px] text-honey-text-primary placeholder:text-honey-text-muted/50 focus:border-honey-accent/50 focus:outline-none transition-colors mb-8"
            />

            <h3 className="text-[14px] text-honey-text-primary mb-4 font-medium">hari ini kamu lagi gimana?</h3>
            <div className="flex flex-wrap gap-2 mb-10">
              {MOODS.map((m) => {
                const isActive = mood === m.id
                return (
                  <button
                    key={m.id}
                    onClick={() => setMood(m.id)}
                    className={cn(
                      "rounded-lg border px-4 py-2 text-[14px] transition-colors duration-150",
                      isActive
                        ? "border-honey-accent bg-honey-accent text-honey-bg shadow-sm"
                        : "border-honey-border/40 bg-honey-surface text-honey-text-muted/60 hover:text-honey-accent hover:border-honey-accent/30"
                    )}
                  >
                    {m.label}
                  </button>
                )
              })}
            </div>

            <button
              disabled={!name.trim() || !mood}
              onClick={() => onComplete(name, mood)}
              className="rounded-xl bg-honey-accent text-honey-bg px-6 py-3 text-[15px] font-medium disabled:bg-honey-border disabled:text-honey-text-muted/50 transition-colors self-end w-full shadow-sm"
            >
              lanjut
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-8 flex gap-2">
        {[1, 2].map((idx) => (
          <motion.div
            key={idx}
            animate={{
              width: step === idx ? 24 : 6,
              backgroundColor: step === idx ? "#d4a373" : "#d2d2d7",
            }}
            transition={{ duration: 0.2 }}
            className="h-[5px] rounded-full"
          />
        ))}
      </div>
    </div>
  )
}
