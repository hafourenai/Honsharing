"use client"

import { useState, useEffect, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"
import { db, Conversation, UserProfile } from "@/lib/db"
import { useChat } from "./useChat"

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null | undefined>(undefined) // undefined = loading
  const [isLoaded, setIsLoaded] = useState(false)

  const loadData = useCallback(async () => {
    const [convosData, profileData] = await Promise.all([
      db.getConversations(),
      db.getUserProfile()
    ])
    setConversations(convosData)
    setUserProfile(profileData || null)
    setIsLoaded(true)
    return { convosData, profileData: profileData || null }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const createConversation = async (mood?: string) => {
    const id = uuidv4()
    await db.createConversation(id, mood)
    await loadData()
    setActiveId(id)
    return id
  }

  const { loading, sendMessage } = useChat({
    activeId,
    userProfile,
    loadData,
    createConversation
  })

  const selectConversation = (id: string) => {
    setActiveId(id)
  }

  const deleteConversation = async (id: string) => {
    await db.deleteConversation(id)
    await loadData()
    if (activeId === id) {
      setActiveId(null)
    }
  }

  const renameConversation = async (id: string, newTitle: string) => {
    await db.updateTitle(id, newTitle)
    await loadData()
  }

  const clearAllConversations = async () => {
    await db.clearAllConversations()
    await loadData()
    setActiveId(null)
  }

  const saveProfile = async (name: string, initialMood: string) => {
    const profile: UserProfile = { name, initialMood, onboardedAt: Date.now() }
    await db.saveUserProfile(profile)
    setUserProfile(profile)
    return profile
  }

  const updateProfileName = async (newName: string) => {
    if (!userProfile) return
    const updated = { ...userProfile, name: newName }
    setUserProfile(updated)
    await db.saveUserProfile(updated)
  }

  const activeConversation = conversations.find(c => c.id === activeId) || null

  return {
    conversations,
    userProfile,
    activeId,
    activeConversation,
    isLoaded,
    loading,
    selectConversation,
    setActiveId,
    createConversation,
    deleteConversation,
    renameConversation,
    clearAllConversations,
    sendMessage,
    saveProfile,
    updateProfileName
  }
}