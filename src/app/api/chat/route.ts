import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Basic in-memory rate limit
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const limit = 20; // max requests
  const windowMs = 60 * 1000; // 1 minute
  
  const now = Date.now();
  const rl = rateLimitMap.get(ip);
  if (!rl || now > rl.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
  } else {
    if (rl.count >= limit) {
      return NextResponse.json({ error: "Terlalu banyak permintaan." }, { status: 429 });
    }
    rl.count++;
  }

  try {
    const body = await request.json();
    const { messages, systemPrompt } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages array" }, { status: 400 });
    }

    const systemContent = systemPrompt;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemContent },
        ...messages,
      ],
      temperature: 0.3,
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
