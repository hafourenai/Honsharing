import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

export type LLMProvider = "gemini" | "groq";

export interface ChatCandidate {
  provider: LLMProvider;
  model: string;
  supportsThinkingBudget?: boolean;
  isReasoningModel?: boolean;
}

export interface TitleCandidate {
  provider: LLMProvider;
  model: string;
  isReasoningModel?: boolean;
  supportsThinkingBudget?: boolean;
}

export interface STTCandidate {
  provider: LLMProvider;
  model: string;
}

// Order of models to attempt for chat streaming
// Gemini primary (best empathy & nuanced counseling tone) -> Groq fallback (ultra fast inference)
export const CHAT_CANDIDATES: ChatCandidate[] = [
  { provider: "gemini", model: "gemini-3.8-flash", supportsThinkingBudget: true },
  { provider: "gemini", model: "gemini-3.6-flash", supportsThinkingBudget: true },
  { provider: "gemini", model: "gemini-3.5-flash", supportsThinkingBudget: true },
  { provider: "gemini", model: "gemini-3.5-flash-lite", supportsThinkingBudget: false },
  { provider: "gemini", model: "gemini-flash-latest", supportsThinkingBudget: true },
  { provider: "groq", model: "openai/gpt-oss-120b", isReasoningModel: true },
  { provider: "groq", model: "qwen/qwen3.8-27b", isReasoningModel: false },
  { provider: "groq", model: "openai/gpt-oss-20b", isReasoningModel: true },
];

// Order of models for generating conversation titles (fast & concise)
export const TITLE_CANDIDATES: TitleCandidate[] = [
  { provider: "groq", model: "qwen/qwen3.8-27b", isReasoningModel: false },
  { provider: "groq", model: "openai/gpt-oss-20b", isReasoningModel: true },
  { provider: "gemini", model: "gemini-3.5-flash-lite", supportsThinkingBudget: false },
  { provider: "gemini", model: "gemini-3.6-flash", supportsThinkingBudget: true },
  { provider: "groq", model: "openai/gpt-oss-120b", isReasoningModel: true },
];

// STT Candidates (Speech-to-Text)
export const STT_CANDIDATES: STTCandidate[] = [
  { provider: "groq", model: "whisper-large-v3-turbo" },
  { provider: "groq", model: "whisper-large-v3" },
  { provider: "gemini", model: "gemini-3.5-flash-lite" },
];

let geminiClient: GoogleGenAI | null = null;
export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey });
  }
  return geminiClient;
}

let groqClient: Groq | null = null;
export function getGroqClient(): Groq | null {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) return null;
  if (!groqClient) {
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

export function isRetryableError(error: unknown): boolean {
  if (!error) return false;
  if (typeof error === "object") {
    const err = error as Record<string, unknown>;
    const status = Number(err.status || err.statusCode || err.code);
    if ([400, 401, 403, 404, 429, 500, 502, 503, 504].includes(status)) {
      return true;
    }
    const msg = String(err.message || "").toLowerCase();
    if (
      msg.includes("demand") ||
      msg.includes("quota") ||
      msg.includes("rate limit") ||
      msg.includes("overloaded") ||
      msg.includes("temporarily unavailable") ||
      msg.includes("resource has been exhausted") ||
      msg.includes("model not found") ||
      msg.includes("does not exist") ||
      msg.includes("access denied") ||
      msg.includes("fetch failed") ||
      msg.includes("timeout")
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Stream chat tokens with multi-provider fallback.
 * Checks the first token before returning the ReadableStream to ensure the connection works.
 */
export async function streamChatCompletion({
  messages,
  systemContent,
}: {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  systemContent: string;
}): Promise<{
  stream: ReadableStream;
  provider: LLMProvider;
  model: string;
}> {
  const encoder = new TextEncoder();
  const gemini = getGeminiClient();
  const groq = getGroqClient();

  if (!gemini && !groq) {
    throw new Error("Tidak ada API Key yang dikonfigurasi. Harap isi GEMINI_API_KEY atau GROQ_API_KEY.");
  }

  const errors: string[] = [];

  for (const candidate of CHAT_CANDIDATES) {
    if (candidate.provider === "gemini" && !gemini) continue;
    if (candidate.provider === "groq" && !groq) continue;

    try {
      if (candidate.provider === "gemini" && gemini) {
        const contents = messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        }));

        const config: Record<string, unknown> = {
          systemInstruction: { role: "user", parts: [{ text: systemContent }] },
          temperature: 0.55,
          maxOutputTokens: 1024,
        };

        if (candidate.supportsThinkingBudget) {
          config.thinkingConfig = { thinkingBudget: 0 };
        }

        const geminiStream = await gemini.models.generateContentStream({
          model: candidate.model,
          contents,
          config,
        });

        // Peek first chunk to verify stream actually produces tokens
        const iterator = geminiStream[Symbol.asyncIterator]();
        const first = await iterator.next();
        const firstText = first.value?.text || "";

        const stream = new ReadableStream({
          async start(controller) {
            try {
              if (firstText) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: firstText })}\n\n`));
              }
              if (!first.done) {
                for await (const chunk of { [Symbol.asyncIterator]: () => iterator }) {
                  const text = chunk.text;
                  if (text) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`));
                  }
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
        });

        return { stream, provider: "gemini", model: candidate.model };
      }

      if (candidate.provider === "groq" && groq) {
        const groqMessages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
          { role: "system", content: systemContent },
          ...messages,
        ];

        const groqStream = await groq.chat.completions.create({
          model: candidate.model,
          messages: groqMessages,
          temperature: 0.55,
          max_tokens: candidate.isReasoningModel ? 1500 : 1024,
          stream: true,
        });

        // Peek first chunk to verify stream
        const iterator = groqStream[Symbol.asyncIterator]();
        let firstText = "";
        let firstDone = false;

        while (true) {
          const item = await iterator.next();
          if (item.done) {
            firstDone = true;
            break;
          }
          const delta = item.value?.choices?.[0]?.delta?.content || "";
          if (delta) {
            firstText = delta;
            break;
          }
        }

        const stream = new ReadableStream({
          async start(controller) {
            try {
              if (firstText) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: firstText })}\n\n`));
              }
              if (!firstDone) {
                for await (const chunk of { [Symbol.asyncIterator]: () => iterator }) {
                  const text = chunk.choices?.[0]?.delta?.content || "";
                  if (text) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`));
                  }
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
        });

        return { stream, provider: "groq", model: candidate.model };
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      errors.push(`${candidate.provider}/${candidate.model}: ${errMsg}`);
      console.warn(`[LLM Fallback] Model ${candidate.provider}:${candidate.model} failed, trying next candidate. Reason: ${errMsg}`);
      continue;
    }
  }

  throw new Error(`Semua model LLM gagal dihubungi:\n${errors.join("\n")}`);
}

/**
 * Generate title for a chat conversation with multi-provider fallback.
 */
export async function generateConversationTitle(message: string): Promise<{
  title: string;
  provider: LLMProvider;
  model: string;
}> {
  const gemini = getGeminiClient();
  const groq = getGroqClient();

  if (!gemini && !groq) {
    return { title: "percakapan baru", provider: "groq", model: "none" };
  }

  const systemPrompt = "Buat judul percakapan 4-5 kata, lowercase, dari pesan ini. Jangan pakai tanda baca.";
  const errors: string[] = [];

  for (const candidate of TITLE_CANDIDATES) {
    if (candidate.provider === "gemini" && !gemini) continue;
    if (candidate.provider === "groq" && !groq) continue;

    try {
      if (candidate.provider === "groq" && groq) {
        const completion = await groq.chat.completions.create({
          model: candidate.model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
          temperature: 0.3,
          max_tokens: candidate.isReasoningModel ? 150 : 50,
        });

        const rawTitle = completion.choices?.[0]?.message?.content?.trim() || "";
        if (rawTitle) {
          return { title: sanitizeTitle(rawTitle), provider: "groq", model: candidate.model };
        }
      }

      if (candidate.provider === "gemini" && gemini) {
        const config: Record<string, unknown> = {
          maxOutputTokens: 50,
          temperature: 0.3,
        };
        if (candidate.supportsThinkingBudget) {
          config.thinkingConfig = { thinkingBudget: 0 };
        }

        const res = await gemini.models.generateContent({
          model: candidate.model,
          contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\nPesan: ${message}` }] }],
          config,
        });

        const rawTitle = res.text?.trim() || "";
        if (rawTitle) {
          return { title: sanitizeTitle(rawTitle), provider: "gemini", model: candidate.model };
        }
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      errors.push(`${candidate.provider}/${candidate.model}: ${errMsg}`);
      console.warn(`[Title Fallback] Model ${candidate.provider}:${candidate.model} failed, trying next candidate. Reason: ${errMsg}`);
      continue;
    }
  }

  console.error("[Title Fallback] All title models failed:", errors);
  // Fallback to simple first words if all models fail
  return {
    title: sanitizeTitle(message),
    provider: "groq",
    model: "fallback-local",
  };
}

function sanitizeTitle(text: string): string {
  let cleaned = text
    .toLowerCase()
    .replace(/["'`*~_#\n\r]/g, " ")
    .replace(/[.,!?;:()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const words = cleaned.split(" ").filter(Boolean);
  if (words.length > 5) {
    cleaned = words.slice(0, 5).join(" ");
  }
  return cleaned || "percakapan baru";
}

/**
 * Transcribe audio using Groq Whisper with Google Gemini multimodal fallback.
 */
export async function transcribeAudioFile(audioFile: File): Promise<{
  transcript: string;
  provider: LLMProvider;
  model: string;
}> {
  const groq = getGroqClient();
  const gemini = getGeminiClient();

  if (!groq && !gemini) {
    throw new Error("Tidak ada API Key yang dikonfigurasi untuk Speech-to-Text.");
  }

  const errors: string[] = [];

  for (const candidate of STT_CANDIDATES) {
    if (candidate.provider === "groq" && !groq) continue;
    if (candidate.provider === "gemini" && !gemini) continue;

    try {
      if (candidate.provider === "groq" && groq) {
        const transcription = await groq.audio.transcriptions.create({
          file: audioFile,
          model: candidate.model,
          language: "id",
          response_format: "json",
        });

        const transcript = transcription.text?.trim() || "";
        return { transcript, provider: "groq", model: candidate.model };
      }

      if (candidate.provider === "gemini" && gemini) {
        const arrayBuffer = await audioFile.arrayBuffer();
        const base64Data = Buffer.from(arrayBuffer).toString("base64");
        const mimeType = audioFile.type || "audio/webm";

        const res = await gemini.models.generateContent({
          model: candidate.model,
          contents: [
            {
              role: "user",
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: base64Data,
                  },
                },
                {
                  text: "Transkripsikan audio ini ke dalam teks bahasa Indonesia secara akurat. Hanya berikan teks transkripsi tanpa komentar tambahan.",
                },
              ],
            },
          ],
        });

        const transcript = res.text?.trim() || "";
        return { transcript, provider: "gemini", model: candidate.model };
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      errors.push(`${candidate.provider}/${candidate.model}: ${errMsg}`);
      console.warn(`[STT Fallback] Model ${candidate.provider}:${candidate.model} failed, trying next candidate. Reason: ${errMsg}`);
      continue;
    }
  }

  throw new Error(`Semua model transkripsi gagal:\n${errors.join("\n")}`);
}
