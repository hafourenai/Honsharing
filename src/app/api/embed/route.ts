import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth/validateRequest";
import { z } from "zod";
import { checkRateLimit, extractIp } from "@/lib/rate-limiter";

const EmbedRequestSchema = z.object({
  text: z.string().min(1).max(5000),
});

import type { FeatureExtractionPipeline } from "@xenova/transformers";

let embedder: FeatureExtractionPipeline | null = null;

async function getEmbedder(): Promise<FeatureExtractionPipeline> {
  if (embedder) return embedder;

  const { pipeline } = await import("@xenova/transformers");
  embedder = (await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2")) as FeatureExtractionPipeline;
  return embedder;
}

export async function POST(request: NextRequest) {
  const auth = await validateRequest();
  if (!auth.valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = extractIp(request);
  if (!checkRateLimit(`embed:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: "Terlalu banyak permintaan." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = EmbedRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { text } = parsed.data;

    const pipe = await getEmbedder();
    const output = await pipe(text, { pooling: "mean", normalize: true });
    const embedding = Array.from(output.data) as number[];

    return NextResponse.json({ embedding });
  } catch (error: unknown) {
    console.error("Embedding error:", error);
    const msg = error instanceof Error ? error.message : "Gagal generate embedding";
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
