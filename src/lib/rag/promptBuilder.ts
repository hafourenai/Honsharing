import { getBasePrompt, ChatMode } from "@/lib/systemPrompt"

export interface Chunk {
  id: string
  content: string
  response?: string
  embedding?: number[]
  metadata: {
    source: string
    emotion?: string[]
    intensity?: "low" | "medium" | "high"
    [key: string]: unknown
  }
}

export function buildSystemPrompt(
  relevantChunks: Chunk[],
  mode: ChatMode = "santai",
  username?: string
): string {
  const basePrompt = getBasePrompt(mode, username)

  if (relevantChunks.length === 0) {
    return basePrompt
  }

  const contextBlock =
    `\n\n---\nKonteks percakapan yang relevan:\n` +
    relevantChunks
      .map(
        (c) =>
          `User berkata: "${c.content}"\nCara merespons yang tepat: "${c.response || "Berikan empati yang sesuai."}"`
      )
      .join("\n\n") +
    `\n\n(PENTING: Gunakan "Cara merespons yang tepat" di atas HANYA sebagai panduan nada dan gaya empati. JANGAN menyalin jawaban tersebut secara persis. Sesuaikan dengan konteks obrolan saat ini.)\n---`

  return basePrompt + contextBlock
}
