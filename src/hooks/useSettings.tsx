"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { db, UserPreferences, UserProfile } from "@/lib/db"

interface SettingsContextType {
  preferences: UserPreferences
  userProfile: UserProfile | null
  updatePreferences: (newPrefs: Partial<UserPreferences>) => Promise<void>
  updateProfileName: (newName: string) => Promise<void>
  clearAllHistory: () => Promise<void>
  isLoaded: boolean
}

const defaultPreferences: UserPreferences = {
  language: "santai",
  soundNotif: false,
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const loadData = useCallback(async () => {
    const [prefs, profile] = await Promise.all([
      db.getPreferences(),
      db.getUserProfile(),
    ])

    if (prefs) setPreferences(prefs)
    if (profile) setUserProfile(profile)
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const updatePreferences = async (newPrefs: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPrefs }
    setPreferences(updated)
    await db.savePreferences(updated)
  }

  const updateProfileName = async (newName: string) => {
    if (!userProfile) return
    const updated = { ...userProfile, name: newName }
    setUserProfile(updated)
    await db.saveUserProfile(updated)
  }

  const clearAllHistory = async () => {
    const convos = await db.getConversations()
    await Promise.all(convos.map(c => db.deleteConversation(c.id)))
    // We don't manage activeId here, but we trigger a refresh maybe via a callback or just reload
    window.location.reload() // Simplest way to clear everything and reset state
  }

  return (
    <SettingsContext.Provider
      value={{
        preferences,
        userProfile,
        updatePreferences,
        updateProfileName,
        clearAllHistory,
        isLoaded,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
