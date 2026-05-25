import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { validateRequest } from "@/lib/auth/validateRequest";
import { checkRateLimit, extractIp } from "@/lib/rate-limiter";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: NextRequest) {
  const auth = await validateRequest();
  if (!auth.valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = extractIp(request);
  if (!checkRateLimit(`stt:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: "Terlalu banyak permintaan." }, { status: 429 });
  }

  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio");

    if (!audioFile || !(audioFile instanceof File)) {
      return NextResponse.json({ error: "File audio diperlukan" }, { status: 400 });
    }

    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3-turbo",
      language: "id",
      response_format: "json",
    });

    const transcript = transcription.text ?? "";

    return NextResponse.json({ transcript });
  } catch (error: unknown) {
    console.error("STT API error:", error);
    const msg = error instanceof Error ? error.message : "Gagal memproses audio";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
