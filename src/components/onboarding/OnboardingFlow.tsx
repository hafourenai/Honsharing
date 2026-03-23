"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { UserProfile } from "@/lib/db"
import { cn } from "@/lib/utils"

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
  
  // States for Step 1
  const [showSubtext, setShowSubtext] = useState(false)
  const [showButton, setShowButton] = useState(false)

  // States for Step 2
  const [name, setName] = useState("")
  const [mood, setMood] = useState("")

  // Typwriter effect simulation
  useEffect(() => {
    if (step === 1) {
      const subtextTimer = setTimeout(() => setShowSubtext(true), 1000)
      const buttonTimer = setTimeout(() => setShowButton(true), 1600)
      return () => {
        clearTimeout(subtextTimer)
        clearTimeout(buttonTimer)
      }
    }
  }, [step])

  const handleNext = () => setStep((s) => s + 1)

  const slideVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 }
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#0a0812] relative overflow-hidden text-honey-text-primary p-6">
      
      <AnimatePresence mode="wait">
        
        {step === 1 && (
          <motion.div
            key="step1"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col items-center text-center max-w-sm"
          >
            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="mb-8 flex h-[64px] w-[64px] items-center justify-center rounded-full border-[1.5px] border-[#4a3d6a] bg-honey-bg-elevated shadow-[0_0_20px_rgba(74,61,122,0.3)]"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#9b8ec4" />
              </svg>
            </motion.div>

            {/* Simulated Typewriter with simple CSS steps or just Framer Motion sequence */}
            <motion.h1 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.6, ease: "linear" }}
              className="font-playfair text-[32px] italic text-[#e2d9f3] overflow-hidden whitespace-nowrap mb-6"
            >
              hei, aku Honey.
            </motion.h1>

            <AnimatePresence>
              {showSubtext && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-[14px] text-[#5a4f72] mb-10"
                >
                  aku di sini untuk mendengarkan, bukan menghakimi.
                </motion.p>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showButton && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={handleNext}
                  className="rounded-full border border-[#2e264a] text-[#9b8ec4] px-6 py-2.5 text-[14px] hover:bg-[#16122a] transition-colors"
                >
                  kenalan dulu &rarr;
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col max-w-sm w-full"
          >
            <h2 className="font-playfair text-[22px] italic text-[#e2d9f3] mb-2">panggil aku apa?</h2>
            <p className="text-[13px] text-[#5a4f72] mb-8">biar percakapan kita terasa lebih personal.</p>
            
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 20))}
              placeholder="nama atau panggilanmu..."
              className="w-full rounded-2xl border border-[#2a2248] bg-[#131020] px-4 py-3 font-playfair italic text-[#e2d9f3] placeholder:text-[#3d3560] focus:border-[#4a3d7a] focus:outline-none mb-8"
            />

            <h3 className="text-[13px] text-[#e2d9f3] mb-4">hari ini kamu lagi gimana?</h3>
            <div className="flex flex-wrap gap-2 mb-10">
              {MOODS.map((m) => {
                const isActive = mood === m.id
                return (
                  <button
                    key={m.id}
                    onClick={() => setMood(m.id)}
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-[13px] font-medium transition-colors duration-[180ms] ease-out",
                      isActive
                        ? "border-[#6b5ca0] bg-[#231a3d] text-[#c4b8e8]"
                        : "border-[#2e2650] bg-[#13102099] text-[#8a7faa] hover:bg-[#231a3d] hover:text-[#c4b8e8]"
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
              className="rounded-full bg-[#4a3d7a] text-[#e2d9f3] px-6 py-3 text-[14px] font-medium disabled:bg-[#16122a] disabled:text-[#5a4f72] transition-colors self-end w-full"
            >
              lanjut &rarr;
            </button>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Progress Indicator */}
      <div className="absolute bottom-8 flex gap-2">
        {[1, 2].map((idx) => (
          <motion.div
            key={idx}
            initial={false}
            animate={{
              width: step === idx ? 20 : 6,
              backgroundColor: step === idx ? "#4a3d7a" : "#2a2248",
            }}
            transition={{ duration: 0.2 }}
            className="h-1.5 rounded-full"
          />
        ))}
      </div>
    </div>
  )
}
