/**
 * ============================================================
 * TYPE DEFINITIONS — SISTEM TESTING & EVALUASI RAG CHATBOT
 * ============================================================
 *
 * File ini berisi type definitions untuk seluruh sistem testing.
 * Dibuat terpisah dari types production agar tidak mengganggu
 * kode utama aplikasi.
 *
 * @author  Tim Skripsi
 * @version 1.0
 * ============================================================
 */

// ------------------------------------------------------------------
// TIPE SKENARIO
// ------------------------------------------------------------------

/**
 * Menyimpan satu skenario pengujian chatbot curhat.
 * Setiap skenario merepresentasikan satu kasus emosional spesifik.
 */
export interface TestScenario {
  /** ID unik skenario (contoh: "overthinking_001") */
  id: string

  /** Nama skenario yang mudah dibaca manusia */
  name: string

  /** Kategori emosional (contoh: "overthinking", "anxiety", "relationship") */
  category: string

  /** Input/user query yang akan diuji */
  userInput: string

  /** Konteks RAG yang diharapkan ter-retrieve (mock) */
  expectedRetrievedContext: RetrievedContext[]

  /** Arah emosional yang diharapkan dari respons chatbot */
  expectedEmotionalDirection: string[]

  /** Kriteria respons yang harus dipenuhi */
  expectedResponseCriteria: string[]

  /** Kata kunci yang harus muncul dalam respons (opsional) */
  requiredKeywords?: string[]

  /** Kata kunci yang TIDAK boleh muncul dalam respons (opsional) */
  forbiddenKeywords?: string[]

  /** Tingkat keparahan emosional (1 = ringan, 5 = sangat berat) */
  severityLevel: 1 | 2 | 3 | 4 | 5
}

/**
 * Konteks yang diharapkan muncul dari hasil retrieval RAG.
 */
export interface RetrievedContext {
  /** ID chunk yang relevan */
  chunkId: string

  /** Topik dari chunk */
  topic: string

  /** Situasi emosional */
  situation: string

  /** Skor relevansi yang diharapkan (0.0 - 1.0) */
  expectedRelevanceScore: number

  /** Emosi yang terkandung */
  emotions: string[]

  /** Kebutuhan emosional */
  needs: string[]
}

// ------------------------------------------------------------------
// TIPE EVALUASI
// ------------------------------------------------------------------

/**
 * Hasil evaluasi untuk satu skenario pengujian.
 */
export interface EvaluationResult {
  /** ID skenario yang dievaluasi */
  scenarioId: string

  /** Nama skenario */
  scenarioName: string

  /** Timestamp evaluasi */
  timestamp: string

  /** Skor keseluruhan (0-100) */
  overallScore: number

  /** Hasil evaluasi similarity */
  similarity: SimilarityScore

  /** Hasil evaluasi relevansi */
  relevance: RelevanceScore

  /** Hasil evaluasi empati */
  empathy: EmpathyScore

  /** Hasil evaluasi konsistensi konteks */
  contextualConsistency: ContextualConsistencyScore

  /** Hasil evaluasi akurasi retrieval */
  retrievalAccuracy: RetrievalAccuracyScore

  /** Catatan tambahan */
  notes: string
}

/**
 * Skor evaluasi similarity antara respons chatbot dan konteks.
 */
export interface SimilarityScore {
  /** Nilai cosine similarity antara query dan respons (0.0 - 1.0) */
  cosineSimilarity: number

  /** Skor overlap teks (0.0 - 1.0) */
  textOverlap: number

  /** Skor keyword matching (0.0 - 1.0) */
  keywordMatch: number

  /** Skor akhir similarity (rata-rata tertimbang, 0-100) */
  finalScore: number

  /** Interpretasi kelulusan */
  verdict: "SANGAT_RELEVAN" | "RELEVAN" | "CUKUP" | "KURANG" | "TIDAK_RELEVAN"
}

/**
 * Skor evaluasi relevansi respons terhadap konteks emosional.
 */
export interface RelevanceScore {
  /** Relevansi konten (0-100) */
  contentRelevance: number

  /** Relevansi konteks emosional (0-100) */
  emotionalRelevance: number

  /** Kesesuaian tone/nada bicara (0-100) */
  toneAppropriateness: number

  /** Skor akhir relevansi (rata-rata, 0-100) */
  finalScore: number

  /** Interpretasi */
  verdict: "SANGAT_RELEVAN" | "RELEVAN" | "CUKUP" | "KURANG" | "TIDAK_RELEVAN"
}

/**
 * Skor evaluasi empati dalam respons chatbot.
 */
export interface EmpathyScore {
  /** Tingkat validasi emosi (0-100) */
  emotionalValidation: number

  /** Tingkat pemahaman (0-100) */
  understanding: number

  /** Dukungan yang diberikan (0-100) */
  supportiveness: number

  /** Skor akhir empati (rata-rata, 0-100) */
  finalScore: number

  /** Interpretasi */
  verdict: "SANGAT_EMPATIK" | "EMPATIK" | "CUKUP" | "KURANG" | "TIDAK_EMPATIK"
}

/**
 * Skor konsistensi konteks — apakah respons chatbot
 * konsisten dengan informasi yang diberikan.
 */
export interface ContextualConsistencyScore {
  /** Konsistensi dengan retrieved chunks (0-100) */
  chunkConsistency: number

  /** Konsistensi dengan arah emosional skenario (0-100) */
  emotionalConsistency: number

  /** Kontradiksi dalam respons (0 = banyak kontradiksi, 100 = konsisten) */
  noContradiction: number

  /** Skor akhir konsistensi (rata-rata, 0-100) */
  finalScore: number

  /** Interpretasi */
  verdict: "SANGAT_KONSISTEN" | "KONSISTEN" | "CUKUP" | "KURANG" | "TIDAK_KONSISTEN"
}

/**
 * Skor akurasi retrieval — apakah RAG mengambil chunk yang tepat.
 */
export interface RetrievalAccuracyScore {
  /** Precision retrieved chunks (0-100) */
  precision: number

  /** Recall retrieved chunks (0-100) */
  recall: number

  /** Skor relevansi rata-rata chunks (0-100) */
  avgRelevanceScore: number

  /** Skor akhir akurasi (rata-rata, 0-100) */
  finalScore: number

  /** Interpretasi */
  verdict: "SANGAT_AKURAT" | "AKURAT" | "CUKUP" | "KURANG" | "TIDAK_AKURAT"
}

// ------------------------------------------------------------------
// TIPE REPORT
// ------------------------------------------------------------------

/**
 * Report evaluasi lengkap untuk satu atau banyak skenario.
 */
export interface EvaluationReport {
  /** Judul report */
  title: string

  /** Tanggal pembuatan */
  createdAt: string

  /** Deskripsi report */
  description: string

  /** Hasil evaluasi per skenario */
  results: EvaluationResult[]

  /** Statistik agregat */
  aggregateStats: AggregateStats
}

/**
 * Statistik agregat dari seluruh skenario.
 */
export interface AggregateStats {
  /** Rata-rata skor keseluruhan */
  averageOverallScore: number

  /** Skor tertinggi */
  highestScore: number

  /** Skor terendah */
  lowestScore: number

  /** Standar deviasi */
  standardDeviation: number

  /** Distribusi verdict */
  verdictDistribution: Record<string, number>

  /** Rata-rata per kategori evaluasi */
  categoryAverages: {
    similarity: number
    relevance: number
    empathy: number
    contextualConsistency: number
    retrievalAccuracy: number
  }
}

// ------------------------------------------------------------------
// TIPE MOCK
// ------------------------------------------------------------------

/**
 * Konfigurasi untuk mock embedding.
 */
export interface MockEmbeddingConfig {
  /** Dimensi embedding (default: 384 untuk Xenova/Transformers) */
  dimension: number

  /** Seed untuk deterministik random */
  seed: number

  /** Apakah mock harus memberikan error simulasi */
  simulateError: boolean

  /** Error rate untuk simulasi kegagalan (0.0 - 1.0) */
  errorRate: number
}

/**
 * Konfigurasi mock retrieval.
 */
export interface MockRetrievalConfig {
  /** Jumlah chunk yang dikembalikan */
  topK: number

  /** Threshold similarity minimum */
  threshold: number

  /** Apakah hasil retrieval diacak */
  shuffle: boolean
}

/**
 * Konfigurasi mock LLM.
 */
export interface MockLLMConfig {
  /** Mode respons: "deterministic" atau "template-based" */
  mode: "deterministic" | "template"

  /** Delay simulasi streaming (ms) */
  streamingDelay: number

  /** Variasi respons (untuk mode template) */
  responseVariation: "low" | "medium" | "high"
}
