import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateRequest } from "@/lib/auth/validateRequest";
import { checkRateLimit, extractIp } from "@/lib/rate-limiter";
import { generateConversationTitle } from "@/lib/llm/providers";

const TitleRequestSchema = z.object({
  message: z.string().min(1).max(500),
});

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

    const { title, provider, model } = await generateConversationTitle(message);

    return NextResponse.json(
      { title },
      {
        headers: {
          "X-LLM-Provider": provider,
          "X-LLM-Model": model,
        },
      }
    );
  } catch (error: unknown) {
    console.error("Title API error:", error);
    const msg = error instanceof Error ? error.message : "Terjadi kesalahan pada server";
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
