

// TIPE SKENARIO

/**
 * Menyimpan satu skenario pengujian chatbot curhat.
 * Setiap skenario merepresentasikan satu kasus emosional spesifik.
 */
export interface TestScenario {
  /** ID unik skenario (contoh: "overthinking_001") */
  id: string;

  /** Nama skenario yang mudah dibaca manusia */
  name: string;

  /** Kategori emosional (contoh: "overthinking", "anxiety", "relationship") */
  category: string;

  /** Input/user query yang akan diuji */
  userInput: string;

  /** Konteks RAG yang diharapkan ter-retrieve (mock) */
  expectedRetrievedContext: RetrievedContext[];

  /** Arah emosional yang diharapkan dari respons chatbot */
  expectedEmotionalDirection: string[];

  /** Kriteria respons yang harus dipenuhi */
  expectedResponseCriteria: string[];

  /** Kata kunci yang harus muncul dalam respons (opsional) */
  requiredKeywords?: string[];

  /** Kata kunci yang TIDAK boleh muncul dalam respons (opsional) */
  forbiddenKeywords?: string[];

  /** Tingkat keparahan emosional (1 = ringan, 5 = sangat berat) */
  severityLevel: 1 | 2 | 3 | 4 | 5;
}

/**
 * Konteks yang diharapkan muncul dari hasil retrieval RAG.
 */
export interface RetrievedContext {
  /** ID chunk yang relevan */
  chunkId: string;

  /** Topik dari chunk */
  topic: string;

  /** Situasi emosional */
  situation: string;

  /** Skor relevansi yang diharapkan (0.0 - 1.0) */
  expectedRelevanceScore: number;

  /** Emosi yang terkandung */
  emotions: string[];

  /** Kebutuhan emosional */
  needs: string[];
}

// TIPE EVALUASI

/**
 * Hasil evaluasi untuk satu skenario pengujian.
 */
export interface EvaluationResult {
  /** ID skenario yang dievaluasi */
  scenarioId: string;

  /** Nama skenario */
  scenarioName: string;

  /** Timestamp evaluasi */
  timestamp: string;

  /** Skor keseluruhan (0-100) */
  overallScore: number;

  /** Hasil evaluasi similarity */
  similarity: SimilarityScore;

  /** Hasil evaluasi relevansi */
  relevance: RelevanceScore;

  /** Hasil evaluasi empati */
  empathy: EmpathyScore;

  /** Hasil evaluasi konsistensi konteks */
  contextualConsistency: ContextualConsistencyScore;

  /** Hasil evaluasi akurasi retrieval */
  retrievalAccuracy: RetrievalAccuracyScore;

  /** Catatan tambahan */
  notes: string;
}

/**
 * Skor evaluasi similarity antara respons chatbot dan konteks.
 */
export interface SimilarityScore {
  /** Nilai cosine similarity antara query dan respons (0.0 - 1.0) */
  cosineSimilarity: number;

  /** Skor overlap teks (0.0 - 1.0) */
  textOverlap: number;

  /** Skor keyword matching (0.0 - 1.0) */
  keywordMatch: number;

  /** Skor akhir similarity (rata-rata tertimbang, 0-100) */
  finalScore: number;

  /** Interpretasi kelulusan */
  verdict: "SANGAT_RELEVAN" | "RELEVAN" | "CUKUP" | "KURANG" | "TIDAK_RELEVAN";
}

/**
 * Skor evaluasi relevansi respons terhadap konteks emosional.
 */
export interface RelevanceScore {
  /** Relevansi konten (0-100) */
  contentRelevance: number;

  /** Relevansi konteks emosional (0-100) */
  emotionalRelevance: number;

  /** Kesesuaian tone/nada bicara (0-100) */
  toneAppropriateness: number;

  /** Skor akhir relevansi (rata-rata, 0-100) */
  finalScore: number;

  /** Interpretasi */
  verdict: "SANGAT_RELEVAN" | "RELEVAN" | "CUKUP" | "KURANG" | "TIDAK_RELEVAN";
}

/**
 * Skor evaluasi empati dalam respons chatbot.
 */
export interface EmpathyScore {
  /** Tingkat validasi emosi (0-100) */
  emotionalValidation: number;

  /** Tingkat pemahaman (0-100) */
  understanding: number;

  /** Dukungan yang diberikan (0-100) */
  supportiveness: number;

  /** Skor akhir empati (rata-rata, 0-100) */
  finalScore: number;

  /** Interpretasi */
  verdict: "SANGAT_EMPATIK" | "EMPATIK" | "CUKUP" | "KURANG" | "TIDAK_EMPATIK";
}

/**
 * Skor konsistensi konteks â€” apakah respons chatbot
 * konsisten dengan informasi yang diberikan.
 */
export interface ContextualConsistencyScore {
  /** Konsistensi dengan retrieved chunks (0-100) */
  chunkConsistency: number;

  /** Konsistensi dengan arah emosional skenario (0-100) */
  emotionalConsistency: number;

  /** Kontradiksi dalam respons (0 = banyak kontradiksi, 100 = konsisten) */
  noContradiction: number;

  /** Skor akhir konsistensi (rata-rata, 0-100) */
  finalScore: number;

  /** Interpretasi */
  verdict:
    | "SANGAT_KONSISTEN"
    | "KONSISTEN"
    | "CUKUP"
    | "KURANG"
    | "TIDAK_KONSISTEN";
}

/**
 * Skor akurasi retrieval â€” apakah RAG mengambil chunk yang tepat.
 */
export interface RetrievalAccuracyScore {
  /** Precision retrieved chunks (0-100) */
  precision: number;

  /** Recall retrieved chunks (0-100) */
  recall: number;

  /** Skor relevansi rata-rata chunks (0-100) */
  avgRelevanceScore: number;

  /** Skor akhir akurasi (rata-rata, 0-100) */
  finalScore: number;

  /** Interpretasi */
  verdict: "SANGAT_AKURAT" | "AKURAT" | "CUKUP" | "KURANG" | "TIDAK_AKURAT";
}

// TIPE REPORT

/**
 * Report evaluasi lengkap untuk satu atau banyak skenario.
 */
export interface EvaluationReport {
  /** Judul report */
  title: string;

  /** Tanggal pembuatan */
  createdAt: string;

  /** Deskripsi report */
  description: string;

  /** Hasil evaluasi per skenario */
  results: EvaluationResult[];

  /** Statistik agregat */
  aggregateStats: AggregateStats;
}

/**
 * Statistik agregat dari seluruh skenario.
 */
export interface AggregateStats {
  /** Rata-rata skor keseluruhan */
  averageOverallScore: number;

  /** Skor tertinggi */
  highestScore: number;

  /** Skor terendah */
  lowestScore: number;

  /** Standar deviasi */
  standardDeviation: number;

  /** Distribusi verdict */
  verdictDistribution: Record<string, number>;

  /** Rata-rata per kategori evaluasi */
  categoryAverages: {
    similarity: number;
    relevance: number;
    empathy: number;
    contextualConsistency: number;
    retrievalAccuracy: number;
  };
}

// TIPE MOCK

/**
 * Konfigurasi untuk mock embedding.
 */
export interface MockEmbeddingConfig {
  /** Dimensi embedding (default: 384 untuk Xenova/Transformers) */
  dimension: number;

  /** Seed untuk deterministik random */
  seed: number;

  /** Apakah mock harus memberikan error simulasi */
  simulateError: boolean;

  /** Error rate untuk simulasi kegagalan (0.0 - 1.0) */
  errorRate: number;
}

/**
 * Konfigurasi mock retrieval.
 */
export interface MockRetrievalConfig {
  /** Jumlah chunk yang dikembalikan */
  topK: number;

  /** Threshold similarity minimum */
  threshold: number;

  /** Apakah hasil retrieval diacak */
  shuffle: boolean;
}

/**
 * Konfigurasi mock LLM.
 */
export interface MockLLMConfig {
  /** Mode respons: "deterministic" atau "template-based" */
  mode: "deterministic" | "template";

  /** Delay simulasi streaming (ms) */
  streamingDelay: number;

  /** Variasi respons (untuk mode template) */
  responseVariation: "low" | "medium" | "high";
}

// TIPE REAL EVALUATION â€” EVALUASI RESPON CHATBOT NYATA

/**
 * Mode evaluasi untuk real evaluation.
 *
 * - HYBRID: Retrieval real, respons mock
 * - REAL  : Respons asli dari chatbot
 */
export type EvaluationMode = "HYBRID" | "REAL";

/**
 * Label kualitas respons untuk failure analysis.
 */
export type QualityLabel = "GOOD" | "ACCEPTABLE" | "WEAK" | "FAILED";

// TIPE MULTI-TURN SCENARIO

/**
 * Satu putaran percakapan dalam multi-turn scenario.
 */
export interface ConversationTurn {
  /** Input user pada turn ini */
  userInput: string;
  /** Keadaan emosional yang diharapkan pada turn ini */
  expectedEmotionalState: string;
  /** Topik yang dibahas pada turn ini */
  topic: string;
  /** Petunjuk memori â€” hal yang harus diingat chatbot dari turn sebelumnya */
  memoryHints: string[];
  /** Kata kunci yang harus muncul dalam respons (opsional) */
  requiredKeywords?: string[];
  /** Kata kunci terlarang (opsional) */
  forbiddenKeywords?: string[];
}

/**
 * Skenario multi-turn â€” percakapan panjang dengan perkembangan emosi.
 */
export interface MultiTurnScenario {
  /** ID unik skenario multi-turn */
  id: string;
  /** Nama skenario */
  name: string;
  /** Deskripsi panjang skenario */
  description: string;
  /** Kategori emosional utama */
  category: string;
  /** Tingkat keparahan awal (1-5) */
  initialSeverity: 1 | 2 | 3 | 4 | 5;
  /** Semua putaran percakapan */
  turns: ConversationTurn[];
  /** Hasil yang diharapkan dari keseluruhan percakapan */
  expectedOutcomes: {
    /** Progresi emosional yang diharapkan */
    emotionalProgression: string[];
    /** Apakah topik berkesinambungan */
    topicContinuity: boolean;
    /** Penanda memori yang harus muncul */
    memoryMarkers: string[];
    /** Arah akhir percakapan */
    finalEmotionalDirection: string[];
  };
}

// TIPE CHAT API WRAPPER

/**
 * Informasi chunk yang diretrieve untuk inspection.
 */
export interface RetrievedChunkInfo {
  /** ID chunk */
  chunkId: string;
  /** Skor similarity */
  similarityScore: number;
  /** Peringkat dalam hasil retrieval */
  rank: number;
  /** Konten/topik chunk */
  topic: string;
  /** Situasi chunk */
  situation: string;
  /** Emosi yang terkandung */
  emotions: string[];
  /** Apakah chunk berkontribusi pada respons */
  contributedToResponse: boolean;
}

/**
 * Konfigurasi untuk Chat API Wrapper.
 */
export interface ChatApiConfig {
  /** Base URL aplikasi (default: http://localhost:3000) */
  baseUrl: string;
  /** Timeout dalam ms (default: 30000) */
  timeout: number;
  /** Jumlah maksimal retry (default: 3) */
  maxRetries: number;
  /** Delay antar retry dalam ms (default: 1000) */
  retryDelay: number;
  /** Session cookie untuk autentikasi */
  sessionCookie?: string;
  /** Mode chatting: "santai" | "formal" */
  mode?: string;
}

/**
 * Respons dari Chat API Wrapper.
 */
export interface ChatApiResponse {
  /** Respons teks dari chatbot */
  response: string;
  /** Waktu respons dalam ms */
  responseTimeMs: number;
  /** Jumlah retry yang dilakukan */
  retryCount: number;
  /** Apakah ada error */
  error: string | null;
  /** Status HTTP */
  status: number;
  /** Timestamp */
  timestamp: string;
}

// TIPE EVALUATION SESSION LOGGER

/**
 * Satu entry dalam session log evaluasi.
 */
export interface SessionLogEntry {
  /** ID unik sesi */
  sessionId: string;
  /** Mode evaluasi */
  mode: EvaluationMode;
  /** ID skenario yang dievaluasi */
  scenarioId: string;
  /** Nama skenario */
  scenarioName: string;
  /** Kategori skenario */
  category: string;
  /** Input user */
  userInput: string;
  /** Konteks yang diretrieve */
  retrievedContext: RetrievedChunkInfo[];
  /** Respons yang dihasilkan chatbot */
  generatedResponse: string;
  /** Skor similarity */
  similarityScore: number;
  /** Skor empati */
  empathyScore: number;
  /** Skor relevansi */
  relevanceScore: number;
  /** Skor retrieval */
  retrievalScore: number;
  /** Label kualitas */
  qualityLabel: QualityLabel;
  /** Waktu respons (ms) */
  responseTimeMs: number;
  /** Timestamp */
  timestamp: string;
  /** Catatan tambahan */
  notes: string;
}

/**
 * Koleksi session log untuk satu sesi evaluasi.
 */
export interface EvaluationSession {
  /** ID unik sesi evaluasi */
  evaluationId: string;
  /** Mode evaluasi */
  mode: EvaluationMode;
  /** Tanggal evaluasi */
  date: string;
  /** Semua entry log */
  entries: SessionLogEntry[];
  /** Ringkasan sesi */
  summary: {
    totalScenarios: number;
    averageSimilarity: number;
    averageEmpathy: number;
    averageRelevance: number;
    averageRetrieval: number;
    averageResponseTimeMs: number;
    labelDistribution: Record<QualityLabel, number>;
  };
}

// TIPE FAILURE ANALYSIS

/**
 * Hasil analisis kegagalan untuk satu respons.
 */
export interface FailureAnalysis {
  /** ID skenario */
  scenarioId: string;
  /** Nama skenario */
  scenarioName: string;
  /** Label kualitas akhir */
  label: QualityLabel;
  /** Apakah respons tidak relevan */
  isIrrelevant: boolean;
  /** Apakah retrieval salah konteks */
  isWrongContext: boolean;
  /** Apakah jawaban terlalu generic */
  isGenericResponse: boolean;
  /** Apakah ada hallucination ringan */
  isHallucination: boolean;
  /** Apakah konteks emosional tidak nyambung */
  isEmotionalMismatch: boolean;
  /** Detail analisis */
  details: {
    irrelevantReason?: string;
    wrongContextReason?: string;
    genericReason?: string;
    hallucinationEvidence?: string;
    mismatchEvidence?: string;
  };
  /** Skor kualitas akhir (0-100) */
  qualityScore: number;
}

// TIPE RESPONSE QUALITY ANALYZER

/**
 * Hasil analisis kualitas respons.
 */
export interface ResponseQualityResult {
  /** Skor kesesuaian konteks (0-100) */
  contextualFit: number;
  /** Skor empati (0-100) */
  empathyScore: number;
  /** Skor konsistensi (0-100) */
  consistencyScore: number;
  /** Skor kekhususan (0-100) â€” 100 = sangat spesifik */
  specificityScore: number;
  /** Apakah menggunakan konteks retrieval */
  usesRetrievalContext: boolean;
  /** Persentase overlap dengan retrieval context */
  retrievalOverlapPercent: number;
  /** Detail analisis */
  details: {
    contextualMarkers: string[];
    empathyMarkers: string[];
    genericPhrases: string[];
    retrievalPhrases: string[];
  };
}

// TIPE COMPARATIVE EVALUATION

/**
 * Hasil perbandingan RAG vs Non-RAG untuk satu skenario.
 */
export interface RealComparisonResult {
  /** ID skenario */
  scenarioId: string;
  /** Nama skenario */
  scenarioName: string;
  /** Kategori */
  category: string;
  /** Respons Non-RAG */
  nonRagResponse: string;
  /** Respons RAG */
  ragResponse: string;
  /** Skor kualitas Non-RAG */
  nonRagScore: ResponseQualityResult;
  /** Skor kualitas RAG */
  ragScore: ResponseQualityResult;
  /** Selisih kualitas konteks */
  contextualImprovement: number;
  /** Selisih empati */
  empathyImprovement: number;
  /** Selisih kekhususan */
  specificityImprovement: number;
  /** Kesimpulan */
  conclusion: string;
}

/**
 * Ringkasan perbandingan RAG vs Non-RAG untuk real evaluation.
 */
export interface RealComparisonSummary {
  /** Jumlah skenario */
  totalScenarios: number;
  /** Rata-rata skor Non-RAG */
  averageNonRagContextualFit: number;
  /** Rata-rata skor RAG */
  averageRagContextualFit: number;
  /** Rata-rata peningkatan */
  averageImprovement: number;
  /** Detail per skenario */
  details: RealComparisonResult[];
}

// TIPE MULTI-TURN EVALUATION

/**
 * Hasil evaluasi untuk satu percakapan multi-turn.
 */
export interface MultiTurnResult {
  /** ID skenario multi-turn */
  scenarioId: string;
  /** Nama skenario */
  scenarioName: string;
  /** Skor memory consistency (0-100) */
  memoryConsistency: number;
  /** Skor emotional continuity (0-100) */
  emotionalContinuity: number;
  /** Skor context retention (0-100) */
  contextRetention: number;
  /** Skor topic tracking (0-100) */
  topicTracking: number;
  /** Skor keseluruhan (0-100) */
  overallScore: number;
  /** Label kualitas */
  label: QualityLabel;
  /** Detail per turn */
  turnDetails: Array<{
    turnIndex: number;
    userInput: string;
    botResponse: string;
    memoryScore: number;
    emotionalScore: number;
    contextScore: number;
    topicScore: number;
  }>;
  /** Analisis kegagalan */
  failures: string[];
}

/**
 * Ringkasan evaluasi multi-turn.
 */
export interface MultiTurnSummary {
  totalConversations: number;
  averageMemoryConsistency: number;
  averageEmotionalContinuity: number;
  averageContextRetention: number;
  averageTopicTracking: number;
  averageOverallScore: number;
  details: MultiTurnResult[];
}

// TIPE ACADEMIC INTERPRETATION

/**
 * Bagian interpretasi akademik.
 */
export interface AcademicInterpretation {
  /** Ringkasan eksekutif */
  executiveSummary: string;
  /** Analisis similarity */
  similarityAnalysis: string;
  /** Analisis empati */
  empathyAnalysis: string;
  /** Analisis retrieval */
  retrievalAnalysis: string;
  /** Analisis kegagalan */
  failureAnalysis: string;
  /** Analisis RAG vs Non-RAG */
  ragComparisonAnalysis: string;
  /** Analisis multi-turn */
  multiTurnAnalysis: string;
  /** Kesimpulan */
  conclusion: string;
  /** Saran pengembangan */
  suggestions: string[];
}

// TIPE EVALUATION REPORT STRUCTURE

/**
 * Struktur laporan evaluasi lengkap.
 */
export interface AcademicReportStructure {
  /** Pendahuluan */
  pendahuluan: {
    latarBelakang: string;
    tujuanPengujian: string[];
    ruangLingkup: string;
  };
  /** Metode evaluasi */
  metode: {
    jenisEvaluasi: string;
    dimensiEvaluasi: Array<{
      nama: string;
      deskripsi: string;
      metrik: string;
    }>;
    skalaPenilaian: Array<{
      range: string;
      kategori: string;
      interpretasi: string;
    }>;
    dataset: {
      totalSkenario: number;
      kategori: Array<{
        nama: string;
        jumlah: number;
      }>;
    };
  };
  /** Hasil pengujian */
  hasil: {
    ringkasan: string;
    tabelSimilarity: string;
    tabelEmpati: string;
    tabelRetrieval: string;
    tabelPerbandinganRAG?: string;
    tabelMultiTurn?: string;
  };
  /** Analisis */
  analisis: {
    similarity: string;
    empati: string;
    retrieval: string;
    ragEffectiveness: string;
    kegagalan: string;
  };
  /** Kesimpulan */
  kesimpulan: {
    ringkasan: string;
    temuanUtama: string[];
    saran: string[];
  };
}
