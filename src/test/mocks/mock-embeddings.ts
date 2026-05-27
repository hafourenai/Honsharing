/**
 * ============================================================
 * MOCK EMBEDDINGS — SIMULASI RESPONSE EMBEDDING
 * ============================================================
 *
 * File ini menyediakan mock untuk sistem embedding.
 * Alih-alih memanggil endpoint /api/embed asli, modul ini
 * menghasilkan atau mengembalikan embedding palsu yang
 * konsisten (deterministic) untuk keperluan testing.
 *
 * Tujuan:
 * - Testing tidak bergantung pada API embedding asli
 * - Hasil embedding konsisten (reproducible)
 * - Bisa mensimulasikan kondisi error
 *
 * PENGGUNAAN UNTUK SKRIPSI:
 *   Dengan mock ini, penguji dapat fokus pada evaluasi
 *   kualitas RAG tanpa khawatir masalah teknis embedding.
 *
 * @author  Tim Skripsi
 * @version 1.0
 * ============================================================
 */

import { TEST_CONFIG } from "@/test/config/test-config";

// DETERMINISTIC PSEUDO-RANDOM NUMBER GENERATOR

/**
 * Simple PRNG (Pseudo-Random Number Generator) untuk menghasilkan
 * embedding yang deterministic.
 *
 * Menggunakan algoritma Linear Congruential Generator (LCG)
 * yang sederhana. Nilai yang dihasilkan akan selalu sama
 * untuk seed yang sama.
 *
 * @param seed - Nilai seed
 * @returns Fungsi random yang menghasilkan angka 0..1
 */
function createPRNG(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) & 0xffffffff;
    return (state >>> 0) / 0xffffffff;
  };
}

// MOCK EMBEDDING GENERATOR

/**
 * Menghasilkan vektor embedding deterministic untuk suatu teks.
 *
 * Cara kerja:
 * 1. Hash teks menjadi seed numerik
 * 2. Gunakan seed untuk menghasilkan vektor acak yang konsisten
 * 3. Normalisasi vektor (panjang = 1) untuk validitas cosine similarity
 *
 * @param text - Teks yang akan di-embed
 * @returns Vektor embedding dengan dimensi sesuai konfigurasi
 *
 * @example
 * const emb = generateMockEmbedding("saya merasa cemas")
 * // Returns: number[384] (vektor deterministic)
 */
export function generateMockEmbedding(text: string): number[] {
  const { dimension, seed } = TEST_CONFIG.mockEmbedding;

  // Hash teks menjadi seed numerik
  let textSeed = seed;
  for (let i = 0; i < text.length; i++) {
    textSeed = (textSeed * 31 + text.charCodeAt(i)) & 0xffffffff;
  }

  const random = createPRNG(textSeed);
  const vector: number[] = [];

  // Generate vektor
  let sumSquares = 0;
  for (let i = 0; i < dimension; i++) {
    const val = random() * 2 - 1; // Range -1..1
    vector.push(val);
    sumSquares += val * val;
  }

  // Normalisasi (panjang vektor = 1)
  const magnitude = Math.sqrt(sumSquares);
  return vector.map((val) => val / magnitude);
}

// SIMILARITY MATRIX (CACHED)

/**
 * Cache embedding untuk teks yang sudah pernah diproses.
 * Ini memastikan bahwa teks yang sama selalu menghasilkan
 * embedding yang identik.
 */
const embeddingCache = new Map<string, number[]>();

/**
 * Mendapatkan mock embedding dengan cache.
 *
 * @param text - Teks yang akan di-embed
 * @returns Vektor embedding
 */
export function getMockEmbedding(text: string): number[] {
  if (embeddingCache.has(text)) {
    return embeddingCache.get(text)!;
  }

  const embedding = generateMockEmbedding(text);
  embeddingCache.set(text, embedding);
  return embedding;
}

/**
 * Membersihkan cache embedding.
 * Berguna saat ingin memulai ulang testing.
 */
export function clearEmbeddingCache(): void {
  embeddingCache.clear();
}

// PRE-COMPUTED EMBEDDINGS UNTUK SKENARIO UMUM

/**
 * Pre-computed embeddings untuk query umum.
 * Ini mempercepat testing dengan menghindari komputasi ulang.
 */
export const SCENARIO_EMBEDDINGS: Record<string, number[]> = {
  overthinking: generateMockEmbedding(
    "pikiran saya tidak bisa berhenti, terus overthinking setiap malam",
  ),
  anxiety: generateMockEmbedding(
    "saya merasa cemas dan takut tanpa alasan yang jelas",
  ),
  relationship: generateMockEmbedding(
    "saya merasa tidak pantas untuk pasangan saya",
  ),
  loneliness: generateMockEmbedding(
    "saya merasa kesepian meskipun dikelilingi banyak orang",
  ),
  motivation: generateMockEmbedding(
    "saya kehilangan semangat untuk melakukan apapun",
  ),
  stress: generateMockEmbedding(
    "tugas kuliah menumpuk, saya merasa stress dan overwhelmed",
  ),
};

// SIMULASI ERROR

/**
 * Mock untuk fungsi embedText asli.
 * Menggantikan panggilan ke /api/embed dengan mock lokal.
 *
 * @param text - Teks yang akan di-embed
 * @returns Promise vektor embedding
 * @throws Error jika simulasi error diaktifkan
 */
export async function mockEmbedText(text: string): Promise<number[]> {
  const config = TEST_CONFIG.mockEmbedding;

  // Simulasi error berdasarkan errorRate
  if (config.simulateError && Math.random() < config.errorRate) {
    throw new Error("[MOCK] Simulated embedding error");
  }

  return getMockEmbedding(text);
}
