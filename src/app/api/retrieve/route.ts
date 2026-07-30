import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth/validateRequest";
import { z } from "zod";
import { checkRateLimit, extractIp } from "@/lib/rate-limiter";
import { promises as fs } from "fs";
import path from "path";
import type { FeatureExtractionPipeline } from "@xenova/transformers";
import type { Chunk } from "@/lib/rag/promptBuilder";

const RetrieveRequestSchema = z.object({
  query: z.string().min(1).max(2000),
  topK: z.number().min(1).max(20).optional().default(5),
  threshold: z.number().min(0).max(1).optional().default(0.3),
});

let embedder: FeatureExtractionPipeline | null = null;
let cachedChunks: (Chunk & { embedding: number[] })[] | null = null;

async function getEmbedder(): Promise<FeatureExtractionPipeline> {
  if (embedder) return embedder;
  const { pipeline } = await import("@xenova/transformers");
  embedder = (await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2")) as FeatureExtractionPipeline;
  return embedder;
}

async function loadChunks(): Promise<(Chunk & { embedding: number[] })[]> {
  if (cachedChunks) return cachedChunks;

  const filePath = path.join(process.cwd(), "public", "rag-chunks.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const chunks: Chunk[] = JSON.parse(raw);

  const pipe = await getEmbedder();
  const withEmbeddings = await Promise.all(
    chunks.map(async (chunk) => {
      const textToEmbed = `${chunk.scenario?.topic || "Umum"}. ${chunk.scenario?.situation || "Tidak spesifik"}. Kebutuhan: ${chunk.metadata?.need?.join(", ") || ""}. Emosi: ${chunk.metadata?.emotion?.join(", ") || ""}.`;
      const output = await pipe(textToEmbed, { pooling: "mean", normalize: true });
      const embedding = Array.from(output.data) as number[];
      return { ...chunk, embedding };
    })
  );

  cachedChunks = withEmbeddings;
  return withEmbeddings;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function POST(request: NextRequest) {
  const auth = await validateRequest();
  if (!auth.valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = extractIp(request);
  if (!checkRateLimit(`retrieve:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: "Terlalu banyak permintaan." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = RetrieveRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { query, topK, threshold } = parsed.data;

    const pipe = await getEmbedder();
    const queryOutput = await pipe(query, { pooling: "mean", normalize: true });
    const queryEmbedding = Array.from(queryOutput.data) as number[];

    const chunks = await loadChunks();

    const scored = chunks
      .map((chunk) => ({
        ...chunk,
        embedding: undefined,
        score: cosineSimilarity(queryEmbedding, chunk.embedding),
      }))
      .filter((c) => c.score > threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return NextResponse.json({ chunks: scored });
  } catch (error: unknown) {
    console.error("Retrieve error:", error);
    const msg = error instanceof Error ? error.message : "Gagal retrieve chunks";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
