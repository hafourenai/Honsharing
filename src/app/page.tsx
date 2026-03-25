"use client"

import ChatWindow from "@/components/ChatWindow"
import OnboardingFlow from "@/components/onboarding/OnboardingFlow"
import { ConversationsProvider } from "@/contexts/ConversationsContext"
import { useConversationsContext } from "@/contexts/ConversationsContext"
import { motion, AnimatePresence } from "framer-motion"

function HomeContent() {
  const { userProfile, isLoaded, saveProfile, sendMessage } = useConversationsContext()

  if (!isLoaded) return null

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
