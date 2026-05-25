import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts"
import type { Readable } from "stream"

let tts: MsEdgeTTS | null = null
let ttsReady = false

async function ensureTTS(): Promise<MsEdgeTTS> {
  if (ttsReady && tts) return tts
  console.log("[TTS] Initializing MsEdgeTTS ...")
  tts = new MsEdgeTTS()
  await tts.setMetadata(
    "id-ID-GadisNeural",
    OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3,
  )
  ttsReady = true
  console.log("[TTS] MsEdgeTTS initialized successfully")
  return tts
}

function xmlEscape(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export async function createSpeechStream(text: string): Promise<ReadableStream<Uint8Array>> {
  const engine = await ensureTTS()

  const { audioStream } = await engine.toStream(xmlEscape(text), { rate: 0.85 })
  const nodeStream = audioStream as Readable

  return new ReadableStream<Uint8Array>({
    start(controller) {
      nodeStream.on("data", (chunk: Buffer) => {
        controller.enqueue(new Uint8Array(chunk))
      })
      nodeStream.on("end", () => {
        controller.close()
      })
      nodeStream.on("error", (err) => {
        controller.error(err)
      })
    },
  })
}
