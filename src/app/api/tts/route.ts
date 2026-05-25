import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateRequest } from "@/lib/auth/validateRequest";
import { checkRateLimit, extractIp } from "@/lib/rate-limiter";
import { createSpeechStream } from "@/lib/tts";

const TTSRequestSchema = z.object({
  text: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const auth = await validateRequest();
  if (!auth.valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = extractIp(request);
  if (!checkRateLimit(`tts:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: "Terlalu banyak permintaan." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = TTSRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const text = parsed.data.text;
    const stream = await createSpeechStream(text);

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: unknown) {
    console.error("[TTS] Error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "TTS generation failed" }, { status: 500 });
  }
}
