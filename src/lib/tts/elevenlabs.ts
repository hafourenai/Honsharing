/*
 * ElevenLabs TTS Provider — requires paid subscription.
 * Uncomment and provide ELEVENLABS_API_KEY when ready.
 *
 * import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js"
 * import type { TTSProvider, TTSConfig } from "./types"
 * import { ttsLogger } from "./logger"
 *
 * const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"
 * const DEFAULT_MODEL_ID = "eleven_multilingual_v2"
 *
 * export class ElevenLabsTTSProvider implements TTSProvider {
 *   private client: ElevenLabsClient
 *   private voiceId: string
 *   private modelId: string
 *
 *   constructor(config?: TTSConfig) {
 *     const apiKey = config?.apiKey
 *     if (!apiKey) {
 *       throw new Error("ELEVENLABS_API_KEY is required for ElevenLabsTTSProvider")
 *     }
 *     this.client = new ElevenLabsClient({ apiKey })
 *     this.voiceId = config?.voiceId ?? DEFAULT_VOICE_ID
 *     this.modelId = config?.modelId ?? DEFAULT_MODEL_ID
 *   }
 *
 *   async generateSpeech(text: string): Promise<ReadableStream<Uint8Array>> {
 *     ttsLogger.info("ElevenLabs request start", {
 *       voiceId: this.voiceId,
 *       modelId: this.modelId,
 *       textLength: text.length,
 *     })
 *     const start = Date.now()
 *     try {
 *       const stream = await this.client.textToSpeech.convert(this.voiceId, {
 *         text,
 *         modelId: this.modelId,
 *         outputFormat: "mp3_44100_128",
 *       })
 *       const duration = Date.now() - start
 *       ttsLogger.info("ElevenLabs request success", { duration })
 *       return stream
 *     } catch (error) {
 *       const duration = Date.now() - start
 *       ttsLogger.error("ElevenLabs request failed", {
 *         duration,
 *         error: error instanceof Error ? error.message : String(error),
 *       })
 *       throw error
 *     }
 *   }
 * }
 */
export {}
