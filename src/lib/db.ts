import { get, set, del } from "idb-keyval"
import Dexie, { Table } from "dexie"
import { encryptText, decryptText } from "./auth/encryption"

// ─── Dexie row types (internal) ────────────────────────────────────────────

export interface ConversationRow {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  mood?: string
}

export interface MessageRow {
  id: string
  convId: string
  role: "bot" | "user"
  content: string
  timestamp: number
  tags?: string[]
}

class HoneyDB extends Dexie {
  conversations!: Table<ConversationRow>
  messages!: Table<MessageRow>

  constructor() {
    super("honeydb")
    this.version(1).stores({
      conversations: "id, updatedAt",
      messages: "id, convId, timestamp",
    })
  }
}

export const honeyDb = new HoneyDB()

export interface Message {
  id: string
  role: "bot" | "user"
  content: string
  timestamp: number
  tags?: string[]
}

export interface Conversation {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  mood?: string
  messages: Message[]
}

export interface UserProfile {
  name: string
  initialMood: string
  onboardedAt: number
}

export interface UserPreferences {
  language: "santai" | "formal"
  soundNotif: boolean
  voiceMode: boolean
}


const PROFILE_KEY = "honey_user_profile"
const PREFS_KEY = "honey_user_preferences"

export const db = {
  async getConversations(): Promise<Conversation[]> {
    try {
      const rows = await honeyDb.conversations
        .orderBy("updatedAt")
        .reverse()
        .toArray()

      return await Promise.all(
        rows.map(async (row) => {
          const messages = await honeyDb.messages
            .where("convId")
            .equals(row.id)
            .sortBy("timestamp")
          
          const decryptedMessages = await Promise.all(messages.map(async m => ({
            ...m,
            content: await decryptText(m.content)
          })))

          return { 
            ...row, 
            title: await decryptText(row.title),
            mood: row.mood ? await decryptText(row.mood) : row.mood,
            messages: decryptedMessages 
          }
        })
      )
    } catch (err) {
      console.error("[db] getConversations failed:", err)
      return []
    }
  },

  async getConversation(id: string): Promise<Conversation | undefined> {
    try {
      const row = await honeyDb.conversations.get(id)
      if (!row) return undefined
      const messages = await honeyDb.messages
        .where("convId")
        .equals(id)
        .sortBy("timestamp")

      const decryptedMessages = await Promise.all(messages.map(async m => ({
        ...m,
        content: await decryptText(m.content)
      })))

      return { 
        ...row, 
        title: await decryptText(row.title),
        mood: row.mood ? await decryptText(row.mood) : row.mood,
        messages: decryptedMessages 
      }
    } catch (err) {
      console.error("[db] getConversation failed:", err)
      return undefined
    }
  },

  async createConversation(id: string, initialMood?: string): Promise<Conversation> {
    const newConvo: ConversationRow = {
      id,
      title: await encryptText("percakapan baru"),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      mood: initialMood ? await encryptText(initialMood) : initialMood,
    }
    try {
      await honeyDb.conversations.add(newConvo)
    } catch (err) {
      console.error("[db] createConversation failed:", err)
      throw err
    }
    return { ...newConvo, messages: [] }
  },

  async appendMessage(convId: string, message: Message): Promise<void> {
    try {
      const encryptedContent = await encryptText(message.content)
      const encryptedMsg = { ...message, content: encryptedContent, convId }
      
      await honeyDb.transaction("rw", honeyDb.messages, honeyDb.conversations, async () => {
        await honeyDb.messages.add(encryptedMsg)
        await honeyDb.conversations.update(convId, { updatedAt: Date.now() })
      })
    } catch (err) {
      console.error("[db] appendMessage failed:", err)
      throw err
    }
  },

  async updateTitle(convId: string, title: string): Promise<void> {
    try {
      const encryptedTitle = await encryptText(title)
      await honeyDb.conversations.update(convId, { title: encryptedTitle, updatedAt: Date.now() })
    } catch (err) {
      console.error("[db] updateTitle failed:", err)
      throw err
    }
  },

  async deleteConversation(id: string): Promise<void> {
    try {
      await honeyDb.transaction("rw", honeyDb.conversations, honeyDb.messages, async () => {
        await honeyDb.conversations.delete(id)
        await honeyDb.messages.where("convId").equals(id).delete()
      })
    } catch (err) {
      console.error("[db] deleteConversation failed:", err)
      throw err
    }
  },

  async clearAllConversations(): Promise<void> {
    try {
      await honeyDb.transaction("rw", honeyDb.conversations, honeyDb.messages, async () => {
        await honeyDb.conversations.clear()
        await honeyDb.messages.clear()
      })
    } catch (err) {
      console.error("[db] clearAllConversations failed:", err)
      throw err
    }
  },

  async getUserProfile(): Promise<UserProfile | undefined> {
    try {
      const profile = await get<UserProfile>(PROFILE_KEY)
      if (profile) {
        return {
          ...profile,
          name: await decryptText(profile.name),
          initialMood: await decryptText(profile.initialMood)
        }
      }
      return undefined
    } catch (err) {
      console.error("[db] getUserProfile failed:", err)
      return undefined
    }
  },

  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      const encryptedProfile = {
        ...profile,
        name: await encryptText(profile.name),
        initialMood: await encryptText(profile.initialMood)
      }
      await set(PROFILE_KEY, encryptedProfile)
    } catch (err) {
      console.error("[db] saveUserProfile failed:", err)
      throw err
    }
  },

  async getPreferences(): Promise<UserPreferences | undefined> {
    try {
      return await get<UserPreferences>(PREFS_KEY)
    } catch (err) {
      console.error("[db] getPreferences failed:", err)
      return undefined
    }
  },

  async savePreferences(prefs: UserPreferences): Promise<void> {
    try {
      await set(PREFS_KEY, prefs)
    } catch (err) {
      console.error("[db] savePreferences failed:", err)
      throw err
    }
  },

  async clearAppData(): Promise<void> {
    try {
      await honeyDb.transaction("rw", honeyDb.conversations, honeyDb.messages, async () => {
        await honeyDb.conversations.clear()
        await honeyDb.messages.clear()
      })
      await del(PROFILE_KEY)
      await del(PREFS_KEY)
      try {
        const { clearAllChunks } = await import("@/lib/rag/indexeddb-store")
        await clearAllChunks()
      } catch (err) {
        console.warn("[db] Failed to clear RAG store:", err)
      }
      localStorage.clear()
      sessionStorage.clear()
    } catch (err) {
      console.error("[db] clearAppData failed:", err)
      throw err
    }
  },
}