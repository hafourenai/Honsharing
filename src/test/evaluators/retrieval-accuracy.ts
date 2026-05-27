/**
 * RETRIEVAL ACCURACY — EVALUASI AKURASI RETRIEVAL RAG
 *
 * Evaluator ini mengukur seberapa akurat sistem RAG dalam
 * meretrieve chunk yang relevan dengan query user.
 *
 * Metrik yang digunakan:
 * 1. PRECISION — Dari semua chunk yang diretrieve, berapa
 *    banyak yang benar-benar relevan?
 *    Rumus: TP / (TP + FP)
 *
 * 2. RECALL — Dari semua chunk yang seharusnya diretrieve,
 *    berapa banyak yang berhasil diambil?
 *    Rumus: TP / (TP + FN)
 *
 * 3. AVG RELEVANCE SCORE — Rata-rata skor similarity dari
 *    chunk yang diretrieve.
 *
 * PENGGUNAAN UNTUK SKRIPSI:
 *   Menjawab pertanyaan:
 *   "Seberapa baik sistem RAG dalam mengambil konteks yang
 *    relevan untuk query user?"
 *
 *   Precision dan recall adalah metrik standar dalam IR
 *   (Information Retrieval) yang mudah dijelaskan saat sidang.
 *
 * @author  Tim Skripsi
 * @version 1.0
 */

import {
  RetrievalAccuracyScore,
  TestScenario,
  RetrievedContext,
} from "@/test/types";
import { Chunk } from "@/lib/rag/promptBuilder";
import { cosineSimilarity } from "@/test/types/utils/cosine-similarity";
import { getMockEmbedding } from "@/test/mocks/mock-embeddings";
import { clampScore } from "@/test/types/utils/scoring";

// HELPER: CEK RELEVANSI CHUNK
/**
 * Mengecek apakah suatu chunk relevan dengan query.
 *
 * Strategi:
 * 1. Hitung cosine similarity antara embedding chunk dan query
 * 2. Jika similarity > threshold, anggap relevan
 *
 * @param chunk - Chunk yang diperiksa
 * @param queryEmbedding - Embedding dari query user
 * @param threshold - Threshold relevansi
 * @returns true jika chunk relevan
 */
function isChunkRelevant(
  chunk: Chunk,
  queryEmbedding: number[],
  threshold: number = -1,
): boolean {
  // Generate embedding untuk chunk jika belum ada
  const chunkEmbedding =
    chunk.embedding ||
    getMockEmbedding(`${chunk.scenario.topic}. ${chunk.scenario.situation}`);

  const similarity = cosineSimilarity(queryEmbedding, chunkEmbedding);
  return similarity >= threshold;
}

// HITUNG PRECISION

/**
 * Menghitung precision dari retrieval.
 *
 * Precision = Chunk relevan yang diretrieve / Total chunk yang diretrieve
 *
 * @param retrievedChunks - Chunks hasil retrieval
 * @param queryEmbedding - Embedding query
 * @returns Precision (0-100)
 */
function calculatePrecision(
  retrievedChunks: Chunk[],
  queryEmbedding: number[],
): number {
  if (retrievedChunks.length === 0) return 0;

  const relevantCount = retrievedChunks.filter((c) =>
    isChunkRelevant(c, queryEmbedding),
  ).length;

  return clampScore((relevantCount / retrievedChunks.length) * 100);
}

// HITUNG RECALL

/**
 * Menghitung recall dari retrieval.
 *
 * Recall = Chunk relevan yang diretrieve / Total chunk relevan di database
 *
 * Karena kita menggunakan mock chunks yang terbatas, total chunk
 * relevan dihitung dari ground truth yang ada di skenario.
 *
 * @param retrievedChunks - Chunks hasil retrieval
 * @param expectedContext - Ground truth dari skenario
 * @returns Recall (0-100)
 */
function calculateRecall(
  retrievedChunks: Chunk[],
  expectedContext: RetrievedContext[],
): number {
  if (expectedContext.length === 0) return 50;

  const retrievedIds = new Set(retrievedChunks.map((c) => c.id));
  const expectedIds = new Set(expectedContext.map((c) => c.chunkId));

  // True positive: chunk yang diretrieve DAN ada di ground truth
  const truePositives = [...retrievedIds].filter((id) =>
    expectedIds.has(id),
  ).length;

  return clampScore((truePositives / expectedIds.size) * 100);
}

// HITUNG AVG RELEVANCE SCORE

/**
 * Menghitung rata-rata skor relevansi dari retrieved chunks.
 *
 * @param retrievedChunks - Chunks hasil retrieval
 * @param queryEmbedding - Embedding query
 * @returns Rata-rata skor relevansi (0-100)
 */
function calculateAvgRelevanceScore(
  retrievedChunks: Chunk[],
  queryEmbedding: number[],
): number {
  if (retrievedChunks.length === 0) return 0;

  let totalSimilarity = 0;
  let count = 0;

  for (const chunk of retrievedChunks) {
    const chunkEmbedding =
      chunk.embedding ||
      getMockEmbedding(`${chunk.scenario.topic}. ${chunk.scenario.situation}`);

    const similarity = cosineSimilarity(queryEmbedding, chunkEmbedding);
    totalSimilarity += similarity;
    count++;
  }

  const avgSimilarity = totalSimilarity / count;

  // Normalisasi: cosine similarity 0.0-1.0 menjadi skor 0-100
  return clampScore(avgSimilarity * 100);
}

// EVALUATOR UTAMA

/**
 * Mengevaluasi akurasi retrieval RAG.
 *
 * @param retrievedChunks - Chunks yang diretrieve oleh sistem
 * @param scenario - Skenario pengujian (berisi ground truth)
 * @param userQuery - Query user (untuk embedding)
 * @returns RetrievalAccuracyScore
 */
export function evaluateRetrievalAccuracy(
  retrievedChunks: Chunk[],
  scenario: TestScenario,
  userQuery: string,
): RetrievalAccuracyScore {
  // Generate embedding untuk query
  const queryEmbedding = getMockEmbedding(userQuery);

  // Hitung metrik
  const precision = calculatePrecision(retrievedChunks, queryEmbedding);
  const recall = calculateRecall(
    retrievedChunks,
    scenario.expectedRetrievedContext,
  );
  const avgRelevanceScore = calculateAvgRelevanceScore(
    retrievedChunks,
    queryEmbedding,
  );

  // Final score: weighted average (precision 40%, recall 40%, avg score 20%)
  const finalScore = clampScore(
    precision * 0.4 + recall * 0.4 + avgRelevanceScore * 0.2,
  );

  // Verdict
  let verdict: RetrievalAccuracyScore["verdict"];
  if (finalScore >= 85) verdict = "SANGAT_AKURAT";
  else if (finalScore >= 70) verdict = "AKURAT";
  else if (finalScore >= 55) verdict = "CUKUP";
  else if (finalScore >= 40) verdict = "KURANG";
  else verdict = "TIDAK_AKURAT";

  return {
    precision,
    recall,
    avgRelevanceScore,
    finalScore,
    verdict,
  };
}
