import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { db, Conversation, Message, UserProfile } from "@/lib/db"
import { ragQuery, ChatHistoryItem } from "@/lib/rag/indexeddb-store"
import { ChatMode } from "@/lib/systemPrompt"
import { playNotifSound } from "@/lib/audio/notif"

interface UseChatOptions {
  activeId: string | null
  userProfile: UserProfile | null | undefined
  loadData: () => Promise<{ convosData: Conversation[]; profileData: UserProfile | null }>
  createConversation: (mood?: string) => Promise<string>
}

export function useChat({ activeId, userProfile, loadData, createConversation }: UseChatOptions) {
  const [loading, setLoading] = useState(false)

  const generateTitle = async (convId: string, message: string) => {
    try {
      const response = await fetch("/api/title", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      })
      
      if (response.ok) {
        const data = await response.json()
        let title = data.title.trim().toLowerCase().replace(/[.,!?;:'"]/g, "")
        // Enforce max 5 words
        const words = title.split(" ")
        if (words.length > 5) {
          title = words.slice(0, 5).join(" ")
        }
        await db.updateTitle(convId, title)
        await loadData()
      }
    } catch (e) {
      console.error("Failed to generate title", e)
    }
  }

  const sendMessage = async (text: string, language: string = "santai") => {
    let targetId = activeId
    if (!targetId) {
      targetId = await createConversation()
    }

    const conv = await db.getConversation(targetId)
    if (!conv) return

    const userMsg: Message = {
      id: uuidv4(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    }

    await db.appendMessage(targetId, userMsg)
    
    // Auto generate title
    if (conv.messages.length === 0 && conv.title === "percakapan baru") {
      generateTitle(targetId, text)
    }
    
    await loadData()
    setLoading(true)

    try {
      const chatHistory: ChatHistoryItem[] = conv.messages.map(m => ({ 
        role: (m.role === "bot" ? "assistant" : "user") as "assistant" | "user", 
        content: m.content 
      }))
      const { answer } = await ragQuery(text, chatHistory, { 
        mode: language as ChatMode,
        username: userProfile?.name
      })

      const aiMsg: Message = {
        id: uuidv4(),
        role: "bot",
        content: answer,
        timestamp: Date.now(),
      }

      await db.appendMessage(targetId, aiMsg)

      const prefs = await db.getPreferences()
      if (prefs?.soundNotif) {
        playNotifSound()
      }
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error(String(e))
      console.error("[SEND MESSAGE ERROR]", error)
      const errMsg: Message = {
        id: uuidv4(),
        role: "bot",
        content: `Aduh, ada masalah teknis: ${error.message}. Coba lagi ya 🙏`,
        timestamp: Date.now(),
      }
      await db.appendMessage(targetId, errMsg)
    } finally {
      await loadData()
      setLoading(false)
    }
  }

  return { loading, sendMessage, generateTitle }
}
