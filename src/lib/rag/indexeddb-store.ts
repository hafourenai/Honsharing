import { Message } from "@/types";
import { getBasePrompt, ChatMode } from "@/lib/systemPrompt";

const DB_NAME = "rag_store";
const DB_VERSION = 1;
const STORE_NAME = "chunks";

export interface Chunk {
  id: string;
  content: string;
  response?: string;
  embedding?: number[];
  metadata: {
    source: string;
    emotion?: string[];
    intensity?: "low" | "medium" | "high";
    [key: string]: any;
  };
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("source", "metadata.source", { unique: false });
      }
    };

    req.onsuccess = (e: any) => resolve(e.target.result);
    req.onerror = (e: any) => reject(e.target.error);
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
    tx.onerror = (e: any) => reject(e.target.error);
  });
}

export async function getAllChunks(): Promise<Chunk[]> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = (e: any) => reject(e.target.error);
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
    } catch (err: any) {
      const isRateLimit = err?.message?.includes("429") || err?.message?.includes("Terlalu banyak");
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


export async function retrieve(query: string, topK = 5): Promise<(Chunk & { score: number })[]> {
  const queryEmbedding = await embedText(query);
  const allChunks = await getAllChunks();


  const scored = allChunks
    .filter((c) => c.embedding)
    .map((c) => ({
      ...c,
      score: cosineSimilarity(queryEmbedding, c.embedding!),
    }))
    .sort((a, b) => b.score - a.score)
    .filter((c) => c.score > 0.3);

  return scored.slice(0, topK);
}


export function buildSystemPrompt(relevantChunks: Chunk[], mode: ChatMode = 'santai', username?: string): string {
  const basePrompt = getBasePrompt(mode, username);
  
  if (relevantChunks.length === 0) {
    return basePrompt;
  }

  const contextBlock =
    `\n\n---\nKonteks percakapan yang relevan:\n` +
    relevantChunks.map((c) =>
      `User berkata: "${c.content}"\nCara merespons yang tepat: "${c.response || 'Berikan empati yang sesuai.'}"`
    ).join("\n\n") +
    `\n\n(PENTING: Gunakan "Cara merespons yang tepat" di atas HANYA sebagai panduan nada dan gaya empati. JANGAN menyalin jawaban tersebut secara persis. Sesuaikan dengan konteks obrolan saat ini.)\n---`;

  return basePrompt + contextBlock;
}

// ─── GENERATE: RAG dengan Groq ────────────────────────────────────────────────

export async function ragQuery(userQuery: string, chatHistory: any[] = [], options: { customPrompt?: string, mode?: ChatMode, username?: string } = {}): Promise<{ answer: string; sources: any[] }> {
  const relevantChunks = await retrieve(userQuery, 5);

  const systemPrompt = buildSystemPrompt(relevantChunks, options.mode, options.username)
    + (options.customPrompt ? " " + options.customPrompt : "");

  const messages = [
    ...chatHistory,
    { role: "user", content: userQuery },
  ];

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, systemPrompt }),
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
