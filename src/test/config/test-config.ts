/**
 * TEST CONFIGURATION — KONFIGURASI SISTEM TESTING & EVALUASI
 *
 * File ini berisi konfigurasi default untuk seluruh sistem testing.
 * Semua nilai dapat diubah sesuai kebutuhan evaluasi.
 * @author  Tim Skripsi
 * @version 1.0
 */

import {
  MockEmbeddingConfig,
  MockRetrievalConfig,
  MockLLMConfig,
} from "@/test/types"

/**
 * Konfigurasi default untuk sistem testing.
 */
export const TEST_CONFIG = {
  /** 
   *  KONFIGURASI MOCK
   *  Mock digunakan untuk mensimulasikan komponen RAG tanpa
   *  perlu memanggil API asli (Groq, embedding endpoint).
   */

  mockEmbedding: {
    dimension: 384, // Sesuai dimensi Xenova/Transformers
    seed: 42, // Seed untuk reproducibility
    simulateError: false,
    errorRate: 0.0,
  } satisfies MockEmbeddingConfig,

  mockRetrieval: {
    topK: 5, // Top-K chunks yang dikembalikan
    threshold: 0.3, // Threshold cosine similarity
    shuffle: false,
  } satisfies MockRetrievalConfig,

  mockLLM: {
    mode: "deterministic", // Gunakan respons tetap untuk konsistensi evaluasi
    streamingDelay: 0, // Tidak perlu delay untuk testing
    responseVariation: "low",
  } satisfies MockLLMConfig,

  /** 
   *  KONFIGURASI EVALUASI
   *  Ambang batas (threshold) untuk menentukan kelulusan evaluasi.
   */

  evaluationThresholds: {
    /** Batas skor untuk setiap verdict */
    verdict: {
      SANGAT: 85, // Skor >= 85: sangat baik
      BAIK: 70, // Skor >= 70: baik
      CUKUP: 55, // Skor >= 55: cukup
      KURANG: 40, // Skor >= 40: kurang
      // Skor < 40: tidak memenuhi
    },

    /** Bobot untuk perhitungan skor akhir similarity */
    similarityWeights: {
      cosineSimilarity: 0.4, // Bobot cosine similarity: 40%
      textOverlap: 0.3, // Bobot text overlap: 30%
      keywordMatch: 0.3, // Bobot keyword matching: 30%
    },

    /** Threshold cosine similarity untuk relevansi */
    cosineThresholds: {
      sangatRelevan: 0.8,
      relevan: 0.6,
      cukup: 0.4,
      kurang: 0.2,
    },
  },

  /** ------------------------------------------------------------------
   *  KONFIGURASI SKENARIO
   *  ------------------------------------------------------------------
   */

  scenarios: {
    /** Jumlah maksimal chunks yang diretrieve per skenario */
    maxRetrievedChunks: 5,

    /** Jumlah maksimal kata kunci yang diperiksa */
    maxKeywords: 10,
  },

  /** 
   *  KONFIGURASI REPORT
   */

  report: {
    /** Format timestamp untuk report */
    dateFormat: "YYYY-MM-DD HH:mm:ss",

    /** Nama institusi (untuk header report) */
    institutionName: "Universitas — Program Studi Ilmu Komputer",

    /** Judul penelitian */
    researchTitle:
      "Evaluasi Sistem Retrieval-Augmented Generation (RAG) pada Chatbot Curhat Berbasis Emotional Context",
  },
} as const

/** Tipe untuk konfigurasi */
export type TestConfig = typeof TEST_CONFIG
