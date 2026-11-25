import { NextRequest } from "next/server";
import { z } from "zod";
import { validateRequest } from "@/lib/auth/validateRequest";
import { buildSystemPrompt } from "@/lib/rag/promptBuilder";
import { ChatMode } from "@/lib/systemPrompt";
import type { Chunk } from "@/lib/rag/promptBuilder";
import { checkRateLimit, extractIp } from "@/lib/rate-limiter";
import { streamChatCompletion } from "@/lib/llm/providers";

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
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const ip = extractIp(request);
  if (!checkRateLimit(`chat:${ip}`, 20, 60_000)) {
    return new Response(JSON.stringify({ error: "Terlalu banyak permintaan." }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await request.json();
    const parsed = ChatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid request", details: parsed.error.flatten() }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { messages, mode, username, retrievedChunks } = parsed.data;
    const systemContent = buildSystemPrompt(
      (retrievedChunks ?? []) as Chunk[],
      mode as ChatMode,
      username
    );

    const { stream, provider, model } = await streamChatCompletion({
      messages,
      systemContent,
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-LLM-Provider": provider,
        "X-LLM-Model": model,
      },
    });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    const msg =
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan pada server";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
