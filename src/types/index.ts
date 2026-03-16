export type Role = "user" | "assistant"

export type Message = {
  id: string
  role: Role
  content: string
  timestamp: number
}

export type Conversation = {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}
