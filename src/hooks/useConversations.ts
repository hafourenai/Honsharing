"use client"

import { useState, useEffect, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"
import { db, Conversation, Message, UserProfile } from "@/lib/db"
import { isIngested, ingestChunks, ragQuery } from "@/lib/rag/indexeddb-store"

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null | undefined>(undefined) // undefined = loading
  const [isLoaded, setIsLoaded] = useState(false)
  const [loading, setLoading] = useState(false) // for chat messages
  
  // RAG states
  const [ingesting, setIngesting] = useState(false)
  const [ingestProgress, setIngestProgress] = useState({ current: 0, total: 0 })

  const loadData = useCallback(async () => {
    const [convosData, profileData] = await Promise.all([
      db.getConversations(),
      db.getUserProfile()
    ])
    setConversations(convosData)
    setUserProfile(profileData || null)
    setIsLoaded(true)
    return { convosData, profileData }
  }, [])

  useEffect(() => {
    loadData().then(({ convosData }) => {
      if (convosData.length > 0 && !activeId) {
        setActiveId(convosData[0].id)
      }
    })

    // RAG Initialization
    isIngested().then((ingested) => {
      if (!ingested) {
        setIngesting(true)
        ingestChunks({
          onProgress: (current: number, total: number) => {
            setIngestProgress({ current, total })
          }
        }).finally(() => {
          setIngesting(false)
        })
      }
    })
  }, [loadData, activeId])

  const createConversation = async (mood?: string) => {
    const id = uuidv4()
    await db.createConversation(id, mood)
    await loadData()
    setActiveId(id)
    return id
  }

  const selectConversation = (id: string) => {
    setActiveId(id)
  }

  const deleteConversation = async (id: string) => {
    await db.deleteConversation(id)
    const { convosData } = await loadData()
    if (activeId === id) {
      setActiveId(convosData.length > 0 ? convosData[0].id : null)
    }
  }

  const renameConversation = async (id: string, newTitle: string) => {
    await db.updateTitle(id, newTitle)
    await loadData()
  }

  const clearAllConversations = async () => {
    const convos = await db.getConversations()
    for (const c of convos) {
      await db.deleteConversation(c.id)
    }
    await loadData()
    setActiveId(null)
  }


  const saveProfile = async (name: string, initialMood: string) => {
    const profile: UserProfile = { name, initialMood, onboardedAt: Date.now() }
    await db.saveUserProfile(profile)
    setUserProfile(profile)
    return profile
  }

  const generateTitle = async (convId: string, message: string) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: "Buat judul percakapan 4-5 kata, lowercase, dari pesan ini. Jangan pakai tanda baca.",
          messages: [{ role: "user", content: message }]
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        let title = data.reply.trim().toLowerCase().replace(/[.,!?;:'"]/g, "")
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
    
    // Auto generate title on first user message if title is default
    if (conv.messages.length === 0 && conv.title === "percakapan baru") {
      generateTitle(targetId, text)
    }
    
    await loadData()
    setLoading(true)

    try {
      const chatHistory = conv.messages.map(m => ({ role: m.role === "bot" ? "assistant" : "user", content: m.content }))
      const { answer } = await ragQuery(text, chatHistory, { 
        mode: language as any,
        customPrompt: "Balas dengan empati." 
      })

      const aiMsg: Message = {
        id: uuidv4(),
        role: "bot",
        content: answer,
        timestamp: Date.now(),
      }

      await db.appendMessage(targetId, aiMsg)
    } catch (e: any) {
      const errMsg: Message = {
        id: uuidv4(),
        role: "bot",
        content: `Aduh, ada masalah teknis: ${e.message}. Coba lagi ya 🙏`,
        timestamp: Date.now(),
      }
      await db.appendMessage(targetId, errMsg)
    } finally {
      await loadData()
      setLoading(false)
    }
  }

  const activeConversation = conversations.find(c => c.id === activeId) || null

  return {
    conversations,
    userProfile,
    activeId,
    activeConversation,
    isLoaded,
    loading,
    ingesting,
    ingestProgress,
    selectConversation,
    setActiveId,
    createConversation,
    deleteConversation,
    renameConversation,
    clearAllConversations,
    sendMessage,
    saveProfile
  }
}