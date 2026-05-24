import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import Groq from "groq-sdk";
import { validateRequest } from "@/lib/auth/validateRequest";
import { buildSystemPrompt } from "@/lib/rag/promptBuilder";
import { ChatMode } from "@/lib/systemPrompt";
import type { Chunk } from "@/lib/rag/promptBuilder";
import { checkRateLimit, extractIp } from "@/lib/rate-limiter";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1),
});

const ChatRequestSchema = z.object({
  messages: z.array(ChatMessageSchema).min(1),
  mode: z.enum(["formal", "santai"]).optional(),
  username: z.string().max(20).optional(),
  retrievedChunks: z.array(z.any()).optional(),
});

export async function POST(request: NextRequest) {
  const auth = await validateRequest();
  if (!auth.valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = extractIp(request);
  if (!checkRateLimit(`chat:${ip}`, 20, 60_000)) {
    return NextResponse.json({ error: "Terlalu banyak permintaan." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = ChatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { messages, mode, username, retrievedChunks } = parsed.data;

    const systemContent = buildSystemPrompt((retrievedChunks ?? []) as Chunk[], mode as ChatMode, username);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemContent },
        ...messages,
      ],
      temperature: 0.75,
      max_tokens: 1024,
    });

    const reply = completion.choices[0]?.message?.content ?? "";

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error("Groq API error:", error);
    const msg = error instanceof Error ? error.message : "Terjadi kesalahan pada server";
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
