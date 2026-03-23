"use client"

import { useState, useRef, useEffect } from "react"
import PhoneShell from "./chat/PhoneShell"
import StatusBar from "./chat/StatusBar"
import Header from "./chat/Header"
import ChatBubble from "./chat/ChatBubble"
import TypingIndicator from "./chat/TypingIndicator"

import InputArea from "./chat/InputArea"
import DateDivider from "./chat/DateDivider"
import Sidebar from "./layout/Sidebar"
import EmptyState from "./chat/EmptyState"
import { useConversations } from "@/hooks/useConversations"
import { motion, AnimatePresence } from "framer-motion"
import { SettingsProvider, useSettings } from "@/hooks/useSettings"
import dynamic from "next/dynamic"

const SettingsPanel = dynamic(() => import("./layout/SettingsPanel"), {
  ssr: false,
})

export default function ChatWindow() {
  return (
    <SettingsProvider>
      <ChatContent />
    </SettingsProvider>
  )
}

function ChatContent() {
  const {
    conversations,
    userProfile,
    activeId,
    activeConversation,
    isLoaded,
    loading,
    selectConversation,
    createConversation,
    deleteConversation,
    renameConversation,
    clearAllConversations,
    sendMessage,
    saveProfile,
    updateProfileName
  } = useConversations()

  const { preferences } = useSettings()

  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [activeConversation?.messages, loading])

  if (!isLoaded) return null

  const handleSend = (text: string) => {
    sendMessage(text, preferences.language)
  }

  return (
    <PhoneShell className="flex-row">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        isOpenMobile={isSidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
        onSelectChat={(id) => {
          selectConversation(id)
          setSidebarOpen(false)
        }}
        onNewChat={() => {
          createConversation()
          setSidebarOpen(false)
        }}
        onRenameChat={renameConversation}
        onDeleteChat={deleteConversation}
        onOpenSettings={() => setIsSettingsOpen(true)}
        userProfile={userProfile}
      />
      
      <div className="flex-1 flex flex-col relative h-full w-full min-w-0 bg-honey-bg-outer">
        {/* On mobile, status bar shows. On desktop, maybe not needed but keeping for stylistic consistency */}
        <div className="md:hidden">
          <StatusBar />
        </div>

        <Header onOpenSidebar={() => setSidebarOpen(true)} />
        
        <AnimatePresence mode="wait">
          {!activeConversation || activeConversation.messages.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.08, ease: "easeOut" } }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="flex-1 overflow-hidden"
            >
              <EmptyState onSuggest={handleSend} />
            </motion.div>
          ) : (
            <motion.div 
              key={`chat-${activeId}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.08, ease: "easeOut" } }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="flex-1 overflow-y-auto overflow-x-hidden p-4 scrollbar-hide relative flex flex-col pt-6 pb-2"
            >
              <DateDivider date="hari ini" />
              
              {activeConversation.messages.map((msg, index) => {
                const isNew = Date.now() - msg.timestamp < 2000
                return (
                  <ChatBubble
                    key={msg.id}
                    id={msg.id}
                    text={msg.content}
                    isBot={msg.role === "bot"}
                    delay={isNew ? 0 : Math.min(index * 0.05, 0.5)}
                  />
                )
              })}
              
              {loading && <TypingIndicator />}
              
              <div ref={messagesEndRef} className="h-4 w-full flex-shrink-0" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.1, ease: "easeOut" }}
          className="flex flex-col z-30 shrink-0"
        >
          <div className="relative">
            {/* Soft shadow/gradient to separate input from chat */}
            <div className="absolute left-0 top-[-20px] h-[20px] w-full bg-gradient-to-t from-honey-bg-outer to-transparent pointer-events-none" />
            <InputArea onSend={handleSend} disabled={loading} />
          </div>
        </motion.div>
      </div>

      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        userProfile={userProfile}
        updateProfileName={updateProfileName}
        clearAllHistory={clearAllConversations}
      />
    </PhoneShell>
  )
}

