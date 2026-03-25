"use client"

import { createContext, useContext, ReactNode } from "react"
import { useConversations } from "@/hooks/useConversations"
import { useRAG } from "@/hooks/useRAG"

type ConversationsContextValue = ReturnType<typeof useConversations>
const ConversationsContext = createContext<ConversationsContextValue | null>(null)

export function useConversationsContext() {
  const ctx = useContext(ConversationsContext)
  if (!ctx) throw new Error("useConversationsContext must be used within ConversationsProvider")
  return ctx
}

type RAGContextValue = ReturnType<typeof useRAG>
const RAGContext = createContext<RAGContextValue | null>(null)

export function useRAGContext() {
  const ctx = useContext(RAGContext)
  if (!ctx) throw new Error("useRAGContext must be used within ConversationsProvider")
  return ctx
}

export function ConversationsProvider({ children }: { children: ReactNode }) {
  const conversations = useConversations()
  const rag = useRAG()
  
  return (
    <ConversationsContext.Provider value={conversations}>
      <RAGContext.Provider value={rag}>
        {children}
      </RAGContext.Provider>
    </ConversationsContext.Provider>
  )
}
