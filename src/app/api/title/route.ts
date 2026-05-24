import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import Groq from "groq-sdk";
import { validateRequest } from "@/lib/auth/validateRequest";
import { checkRateLimit, extractIp } from "@/lib/rate-limiter";

const TitleRequestSchema = z.object({
  message: z.string().min(1).max(500),
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: NextRequest) {
  const auth = await validateRequest();
  if (!auth.valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = extractIp(request);
  if (!checkRateLimit(`title:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: "Terlalu banyak permintaan." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = TitleRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { message } = parsed.data;

    const systemPrompt = "Buat judul percakapan 4-5 kata, lowercase, dari pesan ini. Jangan pakai tanda baca.";

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.3,
      max_tokens: 20,
    });

    const title = completion.choices[0]?.message?.content ?? "";

    return NextResponse.json({ title });
  } catch (error: unknown) {
    console.error("Groq API error:", error);
    const msg = error instanceof Error ? error.message : "Terjadi kesalahan pada server";
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
