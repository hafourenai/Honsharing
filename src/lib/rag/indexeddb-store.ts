import { Message } from "@/types";
import { getBasePrompt, ChatMode } from "@/lib/systemPrompt";

const DB_NAME = "rag_store";
const DB_VERSION = 1;
const STORE_NAME = "chunks";

export interface Chunk {
  id: string;
  content: string;
  embedding?: number[];
  metadata: {
    source: string;
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


export async function ingestChunks({ onProgress }: { onProgress?: (current: number, total: number) => void } = {}): Promise<number> {
  const res = await fetch("/rag-chunks.json");
  const chunks: Chunk[] = await res.json();

  const total = chunks.length;
  const withEmbeddings: Chunk[] = [];

  for (let i = 0; i < total; i++) {
    const chunk = chunks[i];
    const embedding = await embedText(chunk.content);
    withEmbeddings.push({ ...chunk, embedding });

    if (onProgress) onProgress(i + 1, total);
  }

  await saveChunks(withEmbeddings);
  return total;
}

export async function isIngested(): Promise<boolean> {
  const chunks = await getAllChunks();
  return chunks.length > 0;
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
    .filter((c) => c.score > 0.3)
    .slice(0, topK);

  return scored;
}


export function buildSystemPrompt(relevantChunks: Chunk[], mode: ChatMode = 'santai'): string {
  const basePrompt = getBasePrompt(mode);
  
  if (relevantChunks.length === 0) {
    return basePrompt;
  }

  const contextBlock =
    `\n\n---\nReferensi emosional (JANGAN sebut atau kutip secara langsung):\n` +
    relevantChunks.map((c) => `- ${c.content}`).join("\n") +
    `\n---`;

  return basePrompt + contextBlock;
}

// ─── GENERATE: RAG dengan Groq ────────────────────────────────────────────────

export async function ragQuery(userQuery: string, chatHistory: any[] = [], options: { customPrompt?: string, mode?: ChatMode } = {}): Promise<{ answer: string; sources: any[] }> {
  const relevantChunks = await retrieve(userQuery, 5);

  const systemPrompt = buildSystemPrompt(relevantChunks, options.mode)
    + (options.customPrompt ? " " + options.customPrompt : "");

  const messages = [
    ...chatHistory,
    { role: "user", content: userQuery },
  ];

  const debugChunks = relevantChunks.map(c => ({
    score: c.score,
    preview: c.content.slice(0, 80)
  }));

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, systemPrompt, debugChunks }),
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
