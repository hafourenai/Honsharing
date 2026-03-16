import { NextRequest, NextResponse } from "next/server";

let embedder: any = null;

async function getEmbedder() {
  if (embedder) return embedder;

  const { pipeline } = await import("@xenova/transformers");
  embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  return embedder;
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Invalid text input" }, { status: 400 });
    }

    const pipe = await getEmbedder();
    const output = await pipe(text, { pooling: "mean", normalize: true });
    const embedding = Array.from(output.data) as number[];

    return NextResponse.json({ embedding });
  } catch (error: any) {
    console.error("Embedding error:", error);
    return NextResponse.json(
      { error: error.message || "Gagal generate embedding" },
      { status: 500 }
    );
  }
}
