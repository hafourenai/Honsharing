import { Chunk } from "@/lib/rag/promptBuilder"

export interface ScoredChunk extends Chunk {
  score: number
}

export function runSimilarityWorker(
  chunks: Chunk[],
  queryEmbedding: number[],
  topK: number,
  threshold: number
): Promise<ScoredChunk[]> {
  return new Promise((resolve, reject) => {
    const worker = new Worker("/rag-worker.js")

    worker.onmessage = (e) => {
      resolve(e.data.scored)
      worker.terminate()
    }

    worker.onerror = (err) => {
      reject(new Error(`Worker error: ${err.message}`))
      worker.terminate()
    }

    worker.postMessage({ chunks, queryEmbedding, topK, threshold })
  })
}
