"use client"

import ChatWindow from "@/components/ChatWindow"
import OnboardingFlow from "@/components/onboarding/OnboardingFlow"
import { useConversations } from "@/hooks/useConversations"
import { motion, AnimatePresence } from "framer-motion"

export default function Home() {
  const { userProfile, isLoaded, saveProfile, sendMessage } = useConversations()

  if (!isLoaded) return null

  const handleOnboardingComplete = async (name: string, initialMood: string) => {
    await saveProfile(name, initialMood)
    // Automatically trigger the first message from the user based on their selected feeling
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
