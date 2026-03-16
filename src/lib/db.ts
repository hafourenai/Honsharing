import { get, set, update } from "idb-keyval"

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
}

const STORE_KEY = "honey_conversations"
const PROFILE_KEY = "honey_user_profile"
const PREFS_KEY = "honey_user_preferences"

export const db = {
  async getConversations(): Promise<Conversation[]> {
    const convos = await get<Conversation[]>(STORE_KEY)
    if (!convos) return []
    return convos.sort((a, b) => b.updatedAt - a.updatedAt)
  },

  async getConversation(id: string): Promise<Conversation | undefined> {
    const convos = await this.getConversations()
    return convos.find((c) => c.id === id)
  },

  async createConversation(id: string, initialMood?: string): Promise<Conversation> {
    const newConvo: Conversation = {
      id,
      title: "percakapan baru",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      mood: initialMood,
      messages: [],
    }

    await update(STORE_KEY, (val) => {
      const convos = (val as Conversation[]) || []
      return [newConvo, ...convos]
    })

    return newConvo
  },

  async appendMessage(convId: string, message: Message): Promise<void> {
    await update(STORE_KEY, (val) => {
      const convos = (val as Conversation[]) || []
      return convos.map((c) => {
        if (c.id === convId) {
          return {
            ...c,
            updatedAt: Date.now(),
            messages: [...c.messages, message],
          }
        }
        return c
      })
    })
  },

  async updateTitle(convId: string, title: string): Promise<void> {
    await update(STORE_KEY, (val) => {
      const convos = (val as Conversation[]) || []
      return convos.map((c) => (c.id === convId ? { ...c, title, updatedAt: Date.now() } : c))
    })
  },

  async deleteConversation(id: string): Promise<void> {
    await update(STORE_KEY, (val) => {
      const convos = (val as Conversation[]) || []
      return convos.filter((c) => c.id !== id)
    })
  },

  async getUserProfile(): Promise<UserProfile | undefined> {
    return await get<UserProfile>(PROFILE_KEY)
  },

  async saveUserProfile(profile: UserProfile): Promise<void> {
    await set(PROFILE_KEY, profile)
  },
  
  async getPreferences(): Promise<UserPreferences | undefined> {
    return await get<UserPreferences>(PREFS_KEY)
  },

  async savePreferences(prefs: UserPreferences): Promise<void> {
    await set(PREFS_KEY, prefs)
  }
}