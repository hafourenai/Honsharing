import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: NextRequest) {
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
  } catch (error: any) {
    console.error("Groq API error:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
