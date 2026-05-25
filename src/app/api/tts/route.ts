/*
 * TTS API — disabled. TTS requires a paid subscription (ElevenLabs).
 * Uncomment and set ELEVENLABS_API_KEY when ready.
 *
 * import { NextRequest, NextResponse } from "next/server"
 * import { z } from "zod"
 * import { validateRequest } from "@/lib/auth/validateRequest"
 * import { checkRateLimit, extractIp } from "@/lib/rate-limiter"
 * import { generateSpeech, TTSSkipError, ttsLogger } from "@/lib/tts"
 *
 * const TTSRequestSchema = z.object({
 *   text: z.string().min(1),
 *   sessionId: z.string().optional(),
 * })
 *
 * export async function POST(request: NextRequest) {
 *   const auth = await validateRequest()
 *   if (!auth.valid) {
 *     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
 *   }
 *   const ip = extractIp(request)
 *   if (!checkRateLimit(`tts:${ip}`, 30, 60_000)) {
 *     return NextResponse.json({ error: "Terlalu banyak permintaan." }, { status: 429 })
 *   }
 *   try {
 *     const body = await request.json()
 *     const parsed = TTSRequestSchema.safeParse(body)
 *     if (!parsed.success) {
 *       return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
 *     }
 *     const { text, sessionId } = parsed.data
 *     if (!text.trim()) {
 *       return NextResponse.json({ error: "Text is empty" }, { status: 400 })
 *     }
 *     const stream = await generateSpeech(text, sessionId)
 *     return new Response(stream, {
 *       status: 200,
 *       headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-cache" },
 *     })
 *   } catch (error) {
 *     if (error instanceof TTSSkipError) {
 *       return NextResponse.json({ skipped: true, message: error.message }, { status: 200 })
 *     }
 *     ttsLogger.error("TTS API error", {
 *       error: error instanceof Error ? error.message : String(error),
 *     })
 *     return NextResponse.json(
 *       { error: "TTS generation failed. Fallback to text mode." },
 *       { status: 503 },
 *     )
 *   }
 * }
 */

import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) { void request
  return NextResponse.json(
    { error: "TTS is disabled. Requires ElevenLabs subscription." },
    { status: 503 },
  )
}
