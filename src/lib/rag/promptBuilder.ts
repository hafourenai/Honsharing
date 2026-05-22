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
    `\n\n---\n[KONTEKS INTERNAL — jangan disebut, jangan dikutip]\n` +
    relevantChunks
      .map(
        (c) =>
          `Situasi mirip: ${c.scenario.situation}\n` +
          `Kemungkinan kebutuhan: ${c.metadata.need.join(", ")}\n` +
          `Arah emosi: ${c.metadata.emotion.join(", ")}\n` +
          `Intensitas: ${c.metadata.intensity}`
      )
      .join("\n\n") +
    `\n\nGunakan ini hanya untuk membaca situasi — bukan untuk menentukan gaya, nada, atau kalimat. Baca konteks percakapan aktual, lalu respons seperti biasa.\n---`

  return basePrompt + contextBlock
}
