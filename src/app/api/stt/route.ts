import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth/validateRequest";
import { checkRateLimit, extractIp } from "@/lib/rate-limiter";
import { transcribeAudioFile } from "@/lib/llm/providers";

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

    const { transcript, provider, model } = await transcribeAudioFile(audioFile);

    return NextResponse.json(
      { transcript },
      {
        headers: {
          "X-LLM-Provider": provider,
          "X-LLM-Model": model,
        },
      }
    );
  } catch (error: unknown) {
    console.error("STT API error:", error);
    const msg = error instanceof Error ? error.message : "Gagal memproses audio";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
