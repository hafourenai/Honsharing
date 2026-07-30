import { NextRequest } from "next/server";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";
import { validateRequest } from "@/lib/auth/validateRequest";
import { buildSystemPrompt } from "@/lib/rag/promptBuilder";
import { ChatMode } from "@/lib/systemPrompt";
import type { Chunk } from "@/lib/rag/promptBuilder";
import { checkRateLimit, extractIp } from "@/lib/rate-limiter";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
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

function isQuotaError(error: unknown): boolean {
  return (
    error instanceof Error &&
    "status" in error &&
    (error as any).status === 429
  );
}

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

    const encoder = new TextEncoder();

    async function createRawStream(): Promise<{
      stream: ReadableStream;
      provider: "gemini" | "groq";
    }> {
      const contents = messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      try {
        const geminiStream = await ai.models.generateContentStream({
          model: "gemini-2.0-flash",
          contents,
          config: {
            systemInstruction: { role: "user", parts: [{ text: systemContent }] },
            temperature: 0.55,
            maxOutputTokens: 512,
            seed: 42,
          },
        });

        return {
          provider: "gemini" as const,
          stream: new ReadableStream({
            async start(controller) {
              try {
                for await (const chunk of geminiStream) {
                  const text = chunk.text;
                  if (text) {
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`)
                    );
                  }
                }
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              } catch (err) {
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ error: err instanceof Error ? err.message : "Stream error" })}\n\n`
                  )
                );
              } finally {
                controller.close();
              }
            },
          }),
        };
      } catch (error) {
        if (!isQuotaError(error)) throw error;
        console.warn("Gemini quota exceeded, falling back to Groq");
      }

      const groqMessages: Array<{
        role: "system" | "user" | "assistant";
        content: string;
      }> = [{ role: "system", content: systemContent }];

      for (const m of messages) {
        groqMessages.push({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        });
      }

      const groqStream = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: groqMessages,
        temperature: 0.55,
        max_tokens: 512,
        stream: true,
      });

      return {
        provider: "groq" as const,
        stream: new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of groqStream) {
                const text = chunk.choices[0]?.delta?.content || "";
                if (text) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`)
                  );
                }
              }
              controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            } catch (err) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ error: err instanceof Error ? err.message : "Stream error" })}\n\n`
                )
              );
            } finally {
              controller.close();
            }
          },
        }),
      };
    }

    const { stream } = await createRawStream();

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
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
