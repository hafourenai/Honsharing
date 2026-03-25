import { ChatMode } from "@/lib/systemPrompt";
import { Chunk } from "@/lib/rag/promptBuilder";

export type { Chunk } from "@/lib/rag/promptBuilder";

const DB_NAME = "rag_store";
const DB_VERSION = 1;
const STORE_NAME = "chunks";



function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e: IDBVersionChangeEvent) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("source", "metadata.source", { unique: false });
      }
    };

    req.onsuccess = (e: Event) => resolve((e.target as IDBOpenDBRequest).result);
    req.onerror = (e: Event) => reject((e.target as IDBOpenDBRequest).error);
  });
}

export async function saveChunks(chunks: Chunk[]): Promise<number> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  for (const chunk of chunks) {
    store.put(chunk); 
  }

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(chunks.length);
    tx.onerror = (e: Event) => reject((e.target as IDBTransaction).error);
  });
}

export async function getAllChunks(): Promise<Chunk[]> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = (e: Event) => reject((e.target as IDBRequest).error);
  });
}

export async function clearStore(): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).clear();
  return new Promise((r) => (tx.oncomplete = () => r()));
}

export async function embedText(text: string): Promise<number[]> {
  const res = await fetch("/api/embed", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || `Embedding API error ${res.status}`);
  }

  return data.embedding as number[];
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] ** 2;
    normB += b[i] ** 2;
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}


const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function embedWithRetry(text: string, retries = 3): Promise<number[]> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await embedText(text);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      const isRateLimit = message.includes("429") || message.includes("Terlalu banyak");
      if (isRateLimit && attempt < retries - 1) {
        console.warn(`[RAG] Rate limit hit, retrying in ${(attempt + 1) * 5000}ms...`);
        await sleep((attempt + 1) * 5000);
      } else {
        throw err;
      }
    }
  }
  throw new Error("Max retries reached for embedding");
}

export async function getExistingChunkIds(): Promise<Set<string>> {
  const chunks = await getAllChunks();
  return new Set(chunks.map((c) => c.id));
}

export async function ingestChunks({ onProgress }: { onProgress?: (current: number, total: number) => void } = {}): Promise<number> {
  const res = await fetch("/rag-chunks.json");
  const allChunks: Chunk[] = await res.json();
  const totalInFile = allChunks.length;

  const existingIds = await getExistingChunkIds();
  const remainingChunks = allChunks.filter((c) => !existingIds.has(c.id));

  if (remainingChunks.length === 0) {
    console.log("[RAG] All chunks already ingested.");
  }

  const BATCH_SIZE = 3;
  const DELAY_MS = 3000;
  let processedCount = existingIds.size;

  for (let i = 0; i < remainingChunks.length; i += BATCH_SIZE) {
    const batch = remainingChunks.slice(i, i + BATCH_SIZE);
    
    // Embed batch
    const withEmbeddings = await Promise.all(
      batch.map(async (chunk) => {
        const embedding = await embedWithRetry(chunk.content);
        return { ...chunk, embedding };
      })
    );

    // Save batch immediately
    await saveChunks(withEmbeddings);
    
    processedCount += batch.length;
    if (onProgress) onProgress(processedCount, totalInFile);

    // Delay before next batch
    if (i + BATCH_SIZE < remainingChunks.length) {
      await sleep(DELAY_MS);
    }
  }

  return totalInFile;
}

export async function isIngested(): Promise<boolean> {
  const res = await fetch("/rag-chunks.json")
  if (!res.ok) return false
  const allChunks: Chunk[] = await res.json()
  const existingIds = await getExistingChunkIds()
  const threshold = Math.floor(allChunks.length * 0.95) // 95% harus sudah ada
  return existingIds.size >= threshold
}

export async function clearAllChunks(): Promise<void> {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, "readwrite")
  tx.objectStore(STORE_NAME).clear()
  return new Promise((r) => (tx.oncomplete = () => r()));
}


import { runSimilarityWorker } from "@/lib/rag/similarity-worker"

export async function retrieve(
  query: string,
  topK = 5
): Promise<(Chunk & { score: number })[]> {
  const queryEmbedding = await embedText(query)
  const allChunks = await getAllChunks()

  try {
    const scored = await runSimilarityWorker(
      allChunks,
      queryEmbedding,
      topK,
      0.3
    )
    return scored as (Chunk & { score: number })[]
  } catch (err) {
    console.warn("[RAG] Worker failed, falling back to main thread:", err)
    return allChunks
      .filter((c) => c.embedding)
      .map((c) => ({
        ...c,
        score: cosineSimilarity(queryEmbedding, c.embedding!),
      }))
      .sort((a, b) => b.score - a.score)
      .filter((c) => c.score > 0.3)
      .slice(0, topK)
  }
}



// ─── GENERATE: RAG dengan Groq ────────────────────────────────────────────────

export interface ChatHistoryItem {
  role: "user" | "assistant"
  content: string
}

interface RagSource {
  content: string
  source: string
  score: string
}

export async function ragQuery(
  userQuery: string,
  chatHistory: ChatHistoryItem[] = [],
  options: { mode?: ChatMode; username?: string } = {}
): Promise<{ answer: string; sources: RagSource[] }> {
  const relevantChunks = await retrieve(userQuery, 5);

  const messages = [
    ...chatHistory,
    { role: "user", content: userQuery },
  ];

  const retrievedChunks = relevantChunks.map(({ content, response, metadata }) => ({
    content,
    response,
    metadata,
  }));

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages,
      mode: options.mode,
      username: options.username,
      retrievedChunks,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || `Server error ${res.status}`);
  }

  const answer = data.reply ?? data.answer ?? "";

  return {
    answer,
    sources: relevantChunks.map((c) => ({
      content: c.content.slice(0, 100) + "...",
      source: c.metadata.source,
      score: c.score.toFixed(3),
    })),
  };
}
