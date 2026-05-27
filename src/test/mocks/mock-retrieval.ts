/**
 * ============================================================
 * MOCK RETRIEVAL — SIMULASI HASIL RETRIEVAL RAG
 * ============================================================
 *
 * File ini menyediakan mock untuk sistem retrieval RAG.
 * Mensimulasikan proses:
 * 1. Embedding query
 * 2. Cosine similarity dengan chunks
 * 3. Sorting by score
 * 4. Filter threshold
 * 5. Return top-K
 *
 * Tujuan:
 * - Testing tanpa IndexedDB
 * - Testing tanpa Web Worker
 * - Hasil retrieval yang predictable
 *
 * @author  Tim Skripsi
 * @version 1.0
 * ============================================================
 */

import { Chunk } from "@/lib/rag/promptBuilder";
import { TEST_CONFIG } from "@/test/config/test-config";
import { cosineSimilarity } from "@/test/types/utils/cosine-similarity";
import { getMockEmbedding } from "@/test/mocks/mock-embeddings";
import { ALL_MOCK_CHUNKS } from "@/test/mocks/mock-chunks";

// PENCARIAN SIMILARITY DENGAN MOCK EMBEDDING

/**
 * Mensimulasikan retrieval RAG dengan mock embedding.
 *
 * Alur:
 * 1. Generate mock embedding untuk query
 * 2. Hitung cosine similarity dengan setiap chunk
 * 3. Filter berdasarkan threshold
 * 4. Sort descending by score
 * 5. Ambil top-K
 *
 * @param query - Query user
 * @param chunks - Chunks yang akan dicari (default: ALL_MOCK_CHUNKS)
 * @param topK - Jumlah hasil yang dikembalikan
 * @param threshold - Threshold similarity minimum
 * @returns Array chunk dengan score similarity
 */
export async function mockRetrieve(
  query: string,
  chunks: Chunk[] = ALL_MOCK_CHUNKS,
  topK: number = TEST_CONFIG.mockRetrieval.topK,
  threshold: number = TEST_CONFIG.mockRetrieval.threshold,
): Promise<(Chunk & { score: number })[]> {
  // Generate mock embedding untuk query
  const queryEmbedding = getMockEmbedding(query);

  // Hitung similarity untuk setiap chunk
  const scored: (Chunk & { score: number })[] = chunks.map((chunk) => {
    // Jika chunk belum punya embedding, generate dari kontennya
    const embedding =
      chunk.embedding ||
      getMockEmbedding(
        `${chunk.scenario.topic}. ${chunk.scenario.situation}. Kebutuhan: ${chunk.metadata.need.join(", ")}. Emosi: ${chunk.metadata.emotion.join(", ")}.`,
      );

    const score = cosineSimilarity(queryEmbedding, embedding);
    return { ...chunk, embedding, score };
  });

  // Filter threshold, sort descending, ambil top-K
  return scored
    .filter((item) => item.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

// MOCK RETRIEVAL DENGAN HASIL YANG SUDAH DITENTUKAN

/**
 * Mendapatkan hasil retrieval yang sudah ditentukan untuk skenario.
 *
 * Berguna untuk testing di mana kita sudah tahu chunk mana
 * yang seharusnya diretrieve.
 *
 * @param expectedChunkIds - ID chunk yang diharapkan
 * @param chunks - Kumpulan chunk (default: ALL_MOCK_CHUNKS)
 * @returns Array chunk dengan score (score = 1 untuk yang diharapkan)
 */
export function mockDeterministicRetrieval(
  expectedChunkIds: string[],
  chunks: Chunk[] = ALL_MOCK_CHUNKS,
): (Chunk & { score: number })[] {
  return chunks
    .filter((c) => expectedChunkIds.includes(c.id))
    .map((chunk) => ({
      ...chunk,
      score: 1.0, // Score sempurna untuk yang diharapkan
    }));
}

// EVALUASI RETRIEVAL

/**
 * Mengevaluasi hasil retrieval dengan menghitung precision dan recall
 * terhadap ground truth (chunk yang memang seharusnya diretrieve).
 *
 * @param retrievedChunks - Chunks yang berhasil diretrieve
 * @param groundTruthChunkIds - ID chunk yang seharusnya diretrieve
 * @returns { precision, recall, f1Score }
 */
export function evaluateRetrievalAccuracy(
  retrievedChunks: (Chunk & { score: number })[],
  groundTruthChunkIds: string[],
): { precision: number; recall: number; f1Score: number } {
  const retrievedIds = new Set(retrievedChunks.map((c) => c.id));
  const groundTruth = new Set(groundTruthChunkIds);

  // True positive: chunk yang diretrieve DAN ada di ground truth
  const truePositives = [...retrievedIds].filter((id) =>
    groundTruth.has(id),
  ).length;

  // Precision: TP / (TP + FP)
  const precision =
    retrievedIds.size > 0 ? truePositives / retrievedIds.size : 0;

  // Recall: TP / (TP + FN)
  const recall = groundTruth.size > 0 ? truePositives / groundTruth.size : 0;

  // F1-Score: harmonic mean of precision and recall
  const f1Score =
    precision + recall > 0
      ? (2 * precision * recall) / (precision + recall)
      : 0;

  return {
    precision: Math.round(precision * 100),
    recall: Math.round(recall * 100),
    f1Score: Math.round(f1Score * 100),
  };
}
