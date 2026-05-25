/*
 * TTS Service — disabled until ElevenLabs (or another provider) is ready.
 *
 * import type { TTSProvider, TTSProviderType, TTSConfig } from "./types"
 * import { ElevenLabsTTSProvider } from "./elevenlabs"
 * import { MsEdgeTTSProvider } from "./msedge"
 * import { rewriteForSpeech, shouldSkipTTS } from "./voice-rewrite"
 * import { ttsQueue } from "./queue"
 * import { ttsLogger } from "./logger"
 *
 * function getConfig(): TTSConfig {
 *   return {
 *     apiKey: process.env.ELEVENLABS_API_KEY,
 *     voiceId: process.env.ELEVENLABS_VOICE_ID,
 *     modelId: process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2",
 *   }
 * }
 *
 * function detectProvider(): TTSProviderType {
 *   if (process.env.ELEVENLABS_API_KEY) return "elevenlabs"
 *   return "msedge"
 * }
 *
 * function createProvider(type: TTSProviderType, config: TTSConfig): TTSProvider {
 *   switch (type) {
 *     case "elevenlabs":
 *       ttsLogger.info("Using ElevenLabs TTS provider")
 *       return new ElevenLabsTTSProvider(config)
 *     case "msedge":
 *       ttsLogger.info("Using MsEdge TTS provider")
 *       return new MsEdgeTTSProvider(config)
 *     default:
 *       ttsLogger.warn("Unknown TTS provider, falling back to MsEdge")
 *       return new MsEdgeTTSProvider(config)
 *   }
 * }
 *
 * let initialized = false
 *
 * function ensureInit(): void {
 *   if (initialized) return
 *   const config = getConfig()
 *   const type = detectProvider()
 *   const provider = createProvider(type, config)
 *   ttsQueue.setProvider(provider)
 *   initialized = true
 *   ttsLogger.info("TTS service initialized", {
 *     provider: type,
 *     voiceId: config.voiceId ? "configured" : undefined,
 *   })
 * }
 *
 * export async function generateSpeech(
 *   text: string,
 *   sessionId?: string,
 * ): Promise<ReadableStream<Uint8Array>> {
 *   ensureInit()
 *   const rewritten = rewriteForSpeech(text)
 *   if (shouldSkipTTS(rewritten)) {
 *     ttsLogger.info("Skipping TTS for short/empty text", { originalLength: text.length })
 *     throw new TTSSkipError("Text too short or not suitable for TTS")
 *   }
 *   ttsLogger.info("generateSpeech called", {
 *     originalLength: text.length,
 *     rewrittenLength: rewritten.length,
 *     hasSessionId: !!sessionId,
 *   })
 *   const sid = sessionId || "anonymous"
 *   return ttsQueue.enqueue(rewritten, sid)
 * }
 *
 * export class TTSSkipError extends Error {
 *   constructor(message: string) { super(message); this.name = "TTSSkipError" }
 * }
 *
 * export { ttsQueue } from "./queue"
 * export { ttsLogger } from "./logger"
 * export { rewriteForSpeech, shouldSkipTTS } from "./voice-rewrite"
 * export type { TTSProvider, TTSConfig, TTSProviderType } from "./types"
 */

export class TTSSkipError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "TTSSkipError"
  }
}

export async function generateSpeech(): Promise<ReadableStream<Uint8Array>> {
  throw new TTSSkipError("TTS is disabled")
}

export const ttsLogger = {
  info: () => {},
  warn: () => {},
  error: () => {},
}

export const ttsQueue = {
  cancelSession: () => {},
  cancelAll: () => {},
}
