import { getBasePrompt, ChatMode } from "@/lib/systemPrompt"

export interface Chunk {
  id: string;
  scenario: {
    topic: string;
    situation: string;
    core_fear: string;
    self_perception: string;
  };
  response_strategy: {
    tone: string;
    style: string;
    approach: string[];
    conversation_pattern: string[];
  };
  example_style: string[];
  metadata: {
    emotion: string[];
    need: string[];
    intensity: string;
    topic: string;
  };
  embedding?: number[];
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
    `\n\n---\n[KONTEKS EMOSIONAL DARI DATABASE REFERENSI]\n` +
    relevantChunks
      .map(
        (c) =>
          `Topik Masalah: ${c?.scenario?.topic || "Umum"}\n` +
          `Penjelasan Situasi: ${c?.scenario?.situation || "Tidak spesifik"}\n` +
          `Kemungkinan Kebutuhan: ${c?.metadata?.need?.join(", ") || "Didengar"}\n` +
          `Arah Pendekatan: ${c?.response_strategy?.approach?.join(", ") || "Dukung"}`
      )
      .join("\n\n") +
    `\n\nPETUNJUK PENGGUNAAN KONTEKS DI ATAS:\n` +
    `- Hubungkan secara halus kata kunci atau esensi situasi dari "Penjelasan Situasi" di atas ke dalam kalimat responmu.\n` +
    `- Gunakan pemahaman situasi tersebut untuk memvalidasi perasaan pengguna secara spesifik (misalnya, jika situasi menyebutkan "insecure penampilan" atau "konflik orang tua", sebutkan hal tersebut secara empati agar respon terasa sangat nyambung).\n` +
    `- Tetap pertahankan gaya bicara yang hangat, mengalir, santai, dan alami layaknya teman dekat yang peduli.\n---`

  return basePrompt + contextBlock
}
