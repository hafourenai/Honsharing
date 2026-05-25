export interface TTSConfig {
  apiKey?: string
  voiceId?: string
  modelId?: string
}

export interface TTSProvider {
  generateSpeech(text: string): Promise<ReadableStream<Uint8Array>>
}

export type TTSProviderType = "elevenlabs" | "msedge"
