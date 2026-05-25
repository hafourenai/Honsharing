"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"
import { db, UserPreferences } from "@/lib/db"

interface SettingsContextType {
  preferences: UserPreferences
  updatePreferences: (newPrefs: Partial<UserPreferences>) => Promise<void>
  isLoaded: boolean
}

const defaultPreferences: UserPreferences = {
  language: "santai",
  soundNotif: false,
  voiceMode: false,
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)
  const [isLoaded, setIsLoaded] = useState(false)

  const loadData = useCallback(async () => {
    const prefs = await db.getPreferences()
    if (prefs) setPreferences(prefs)
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const updatePreferences = useCallback(async (newPrefs: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPrefs }
    setPreferences(updated)
    await db.savePreferences(updated)
  }, [preferences])

  const contextValue = useMemo(() => ({
    preferences,
    updatePreferences,
    isLoaded,
  }), [preferences, updatePreferences, isLoaded])

  return (
    <SettingsContext.Provider value={contextValue}>
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
