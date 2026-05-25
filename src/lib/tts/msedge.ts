import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts"
import type { Readable } from "stream"
import type { TTSProvider, TTSConfig } from "./types"
import { ttsLogger } from "./logger"

export class MsEdgeTTSProvider implements TTSProvider {
  private tts: MsEdgeTTS | null = null
  private ready = false

  constructor(_config?: TTSConfig) { void _config }

  private async ensure(): Promise<MsEdgeTTS> {
    if (this.ready && this.tts) return this.tts
    ttsLogger.info("Initializing MsEdgeTTS")
    this.tts = new MsEdgeTTS()
    await this.tts.setMetadata(
      "id-ID-GadisNeural",
      OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3,
    )
    this.ready = true
    ttsLogger.info("MsEdgeTTS initialized")
    return this.tts
  }

  async generateSpeech(text: string): Promise<ReadableStream<Uint8Array>> {
    const engine = await this.ensure()
    const escaped = this.xmlEscape(text)
    const { audioStream } = await engine.toStream(escaped, { rate: 0.85 })
    const nodeStream = audioStream as Readable

    return new ReadableStream<Uint8Array>({
      start(controller) {
        nodeStream.on("data", (chunk: Buffer) => {
          controller.enqueue(new Uint8Array(chunk))
        })
        nodeStream.on("end", () => controller.close())
        nodeStream.on("error", (err) => controller.error(err))
      },
    })
  }

  private xmlEscape(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;")
  }
}
