import { NextRequest } from "next/server";
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

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemContent },
        ...messages,
      ],
      temperature: 0.75,
      max_tokens: 1024,
      stream: true,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (err) {
          const msg =
            err instanceof Error ? err.message : "Stream error";
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: msg })}\n\n`
            )
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    console.error("Groq API error:", error);
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
