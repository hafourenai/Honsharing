"use client"

import ChatWindow from "@/components/ChatWindow"
import OnboardingFlow from "@/components/onboarding/OnboardingFlow"
import { ConversationsProvider } from "@/contexts/ConversationsContext"
import { useConversationsContext } from "@/contexts/ConversationsContext"
import { motion, AnimatePresence } from "framer-motion"

function HomeContent() {
  const { userProfile, isLoaded, saveProfile, sendMessage } = useConversationsContext()

  if (!isLoaded) 
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-honey-bg">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ scale: [1, 1.04, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-honey-accent/10 to-honey-accent-glow/10 border border-honey-accent/10 flex items-center justify-center shadow-glow"
          >
            <span className="text-xl font-playfair italic text-honey-accent/60">H</span>
          </motion.div>
        </div>
      </div>
    )

  const handleOnboardingComplete = async (name: string, initialMood: string) => {
    await fetch("/api/auth/session", { method: "POST" })
    await saveProfile(name, initialMood)
    await sendMessage(`Aku lagi merasa ${initialMood}...`)
  }

  return (
    <AnimatePresence mode="wait">
      {!userProfile ? (
        <motion.div
          key="onboarding"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-screen w-screen"
        >
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        </motion.div>
      ) : (
        <motion.div
          key="chat"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-screen w-screen"
        >
          <ChatWindow />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Home() {
  return (
    <ConversationsProvider>
      <HomeContent />
    </ConversationsProvider>
  )
}
