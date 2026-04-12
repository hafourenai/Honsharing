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
      <div className="h-screen w-screen flex items-center justify-center bg-honey-bg-outer">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin" width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20Z" fill="#5a4f72" />
            <path d="M10.0001 2.00001C9.44736 2.00001 9.00009 2.44728 9.00009 3.00004V6.00004C9.00009 6.55279 9.44736 7.00005 10.0001 7.00005C10.5528 7.00005 10.9991 6.55279 10.9991 6.00004V3.00004C10.9991 2.44728 10.5528 2.00001 10.0001 2.00001Z" fill="#5a4f72" />
          </svg>
          <p className="text-sm text-neutral-400 italic">Loading...</p>
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
