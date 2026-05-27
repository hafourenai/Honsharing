/**
  * FAILURE ANALYSIS GENERATOR — ANALISIS KEGAGALAN AKADEMIK
  *
 * Menganalisis kegagalan sistem secara akademik dan menghasilkan
 * dokumentasi yang siap digunakan untuk skripsi.
 *
 * Mencakup:
 * - Analisis penyebab kegagalan
 * - Dampak terhadap kualitas chatbot
 * - Rekomendasi perbaikan
 * - Tabel kegagalan
 *
 * @author  Tim Skripsi
 * @version 1.0
  */

import { FailureAnalysis, QualityLabel } from "@/test/types"

// TIPE DATA

export interface AcademicFailureReport {
  /** Ringkasan kegagalan */
  summary: string
  /** Analisis per jenis kegagalan */
  failureTypes: FailureTypeAnalysis[]
  /** Analisis per kategori */
  categoryBreakdown: CategoryFailureAnalysis[]
  /** Rekomendasi perbaikan */
  recommendations: FailureRecommendation[]
  /** Tabel distribusi */
  distributionTable: string
}

export interface FailureTypeAnalysis {
  /** Nama jenis kegagalan */
  type: string
  /** Jumlah kejadian */
  count: number
  /** Persentase dari total */
  percentage: number
  /** Kemungkinan penyebab */
  possibleCauses: string[]
  /** Dampak terhadap kualitas */
  impact: string
  /** Rekomendasi perbaikan */
  recommendation: string
}

export interface CategoryFailureAnalysis {
  category: string
  total: number
  failed: number
  failureRate: number
  commonFailures: string[]
}

export interface FailureRecommendation {
  /** Masalah yang dihadapi */
  issue: string
  /** Rekomendasi teknis */
  technicalRecommendation: string
  /** Rekomendasi akademik (untuk skripsi) */
  academicRecommendation: string
  /** Prioritas (tinggi/sedang/rendah) */
  priority: "Tinggi" | "Sedang" | "Rendah"
}

// DATA PENGETAHUAN KEGAGALAN

const FAILURE_KNOWLEDGE: Record<string, {
  possibleCauses: string[]
  impact: string
  recommendation: string
}> = {
  IRRELEVANT: {
    possibleCauses: [
      "Kurangnya chunk relevan dalam basis data retrieval",
      "Threshold similarity terlalu rendah sehingga chunk tidak relevan ikut terambil",
      "Model LLM salah memahami konteks yang diberikan",
      "Prompt engineering yang kurang optimal",
    ],
    impact: "Respons tidak relevan menyebabkan pengguna merasa tidak didengar dan mengurangi kepercayaan terhadap chatbot. Dalam konteks curhat, hal ini dapat memperburuk kondisi emosional pengguna.",
    recommendation: "Perbaiki kualitas basis data chunk dengan menambahkan lebih banyak variasi situasi emosional. Optimasi threshold similarity dan evaluasi ulang prompt engineering.",
  },
  WRONG_CONTEXT: {
    possibleCauses: [
      "Embedding chunk kurang optimal sehingga相似度计算 tidak akurat",
      "Basis data chunk memiliki konten yang mirip secara permukaan tapi berbeda konteks emosional",
      "Ukuran chunk terlalu besar sehingga sulit dipetakan secara spesifik",
    ],
    impact: "Retrieval dengan konteks salah menyebabkan chatbot memberikan respons yang tidak sesuai dengan kondisi emosional pengguna, misalnya memberikan saran yang tidak tepat.",
    recommendation: "Evaluasi kualitas embedding, pertimbangkan chunk size yang lebih kecil dan lebih spesifik, serta tambahkan metadata emosional pada setiap chunk.",
  },
  GENERIC: {
    possibleCauses: [
      "Model LLM cenderung memberikan respons aman yang generik",
      "Prompt sistem kurang mendorong kekhususan respons",
      "Konteks retrieval tidak cukup spesifik",
      "Terlalu banyak template respons yang mirip",
    ],
    impact: "Respons generik membuat chatbot terasa robotik dan tidak personal. Pengguna yang sedang curhat membutuhkan respons yang spesifik dan personal agar merasa dipahami.",
    recommendation: "Tingkatkan prompt sistem untuk mendorong respons yang lebih spesifik. Tambahkan chunk yang lebih variatif dan spesifik dalam basis data retrieval.",
  },
  HALLUCINATION: {
    possibleCauses: [
      "Model LLM menghasilkan informasi yang tidak akurat berdasarkan konteks yang ambiguous",
      "Retrieval memberikan konteks yang bertentangan",
      "Knowledge base memiliki informasi yang kurang akurat",
    ],
    impact: "Halusinasi dapat menyesatkan pengguna dan mengurangi kredibilitas chatbot. Dalam konteks dukungan emosional, halusinasi berbahaya karena dapat memberikan saran yang salah.",
    recommendation: "Tambahkan mekanisme verifikasi fakta sederhana. Kurasi basis data chunk dengan lebih ketat. Batasi domain pengetahuan chatbot pada topik yang sudah terverifikasi.",
  },
  EMOTIONAL_MISMATCH: {
    possibleCauses: [
      "Deteksi emosi yang kurang akurat",
      "Konteks retrieval tidak mengandung informasi emosional yang cukup",
      "Model LLM kurang peka terhadap nuansa emosional",
      "Klasifikasi emosi terlalu general",
    ],
    impact: "Mismatch emosional membuat pengguna merasa tidak dipahami secara emosional. Ini adalah kegagalan paling kritis dalam chatbot curhat karena tujuan utamanya adalah dukungan emosional.",
    recommendation: "Tingkatkan sistem deteksi emosi dengan menambahkan lebih banyak kategori emosional. Pastikan setiap chunk memiliki metadata emosional yang jelas. Evaluasi ulang prompt untuk mendorong empati.",
  },
}

// GENERATE LAPORAN

/**
 * Menghasilkan laporan analisis kegagalan akademik lengkap.
 */
export function generateAcademicFailureReport(
  failures: FailureAnalysis[]
): AcademicFailureReport {
  // Distribusi per jenis kegagalan
  const irrelevantCount = failures.filter((f) => f.isIrrelevant).length
  const wrongContextCount = failures.filter((f) => f.isWrongContext).length
  const genericCount = failures.filter((f) => f.isGenericResponse).length
  const hallucinationCount = failures.filter((f) => f.isHallucination).length
  const mismatchCount = failures.filter((f) => f.isEmotionalMismatch).length
  const total = failures.length

  const failureTypes: FailureTypeAnalysis[] = [
    {
      type: "Respons Tidak Relevan",
      count: irrelevantCount,
      percentage: total > 0 ? Math.round((irrelevantCount / total) * 100) : 0,
      ...FAILURE_KNOWLEDGE.IRRELEVANT,
    },
    {
      type: "Retrieval Salah Konteks",
      count: wrongContextCount,
      percentage: total > 0 ? Math.round((wrongContextCount / total) * 100) : 0,
      ...FAILURE_KNOWLEDGE.WRONG_CONTEXT,
    },
    {
      type: "Respons Generik",
      count: genericCount,
      percentage: total > 0 ? Math.round((genericCount / total) * 100) : 0,
      ...FAILURE_KNOWLEDGE.GENERIC,
    },
    {
      type: "Halusinasi",
      count: hallucinationCount,
      percentage: total > 0 ? Math.round((hallucinationCount / total) * 100) : 0,
      ...FAILURE_KNOWLEDGE.HALLUCINATION,
    },
    {
      type: "Mismatch Emosional",
      count: mismatchCount,
      percentage: total > 0 ? Math.round((mismatchCount / total) * 100) : 0,
      ...FAILURE_KNOWLEDGE.EMOTIONAL_MISMATCH,
    },
  ]

  // Per kategori
  const catMap = new Map<string, FailureAnalysis[]>()
  for (const f of failures) {
    const arr = catMap.get(f.scenarioName) || []
    arr.push(f)
    catMap.set(f.scenarioName, arr)
  }

  const categoryBreakdown: CategoryFailureAnalysis[] = []
  for (const [cat, fs] of catMap) {
    const failed = fs.filter((f) => f.label === "FAILED" || f.label === "WEAK").length
    const commonFailures: string[] = []
    if (fs.some((f) => f.isIrrelevant)) commonFailures.push("Tidak Relevan")
    if (fs.some((f) => f.isWrongContext)) commonFailures.push("Salah Konteks")
    if (fs.some((f) => f.isGenericResponse)) commonFailures.push("Generik")
    if (fs.some((f) => f.isHallucination)) commonFailures.push("Halusinasi")
    if (fs.some((f) => f.isEmotionalMismatch)) commonFailures.push("Mismatch Emosi")
    categoryBreakdown.push({
      category: cat,
      total: fs.length,
      failed,
      failureRate: fs.length > 0 ? Math.round((failed / fs.length) * 100) : 0,
      commonFailures,
    })
  }

  const recommendations = generateRecommendations(failureTypes)

  const distributionTable = generateDistribusiTable(failureTypes, total)

  return {
    summary: generateSummary(failureTypes, total),
    failureTypes,
    categoryBreakdown,
    recommendations,
    distributionTable,
  }
}

// SUMMARY

function generateSummary(
  types: FailureTypeAnalysis[],
  total: number
): string {
  const totalFailures = types.reduce((s, t) => s + t.count, 0)
  const mostCommon = [...types].sort((a, b) => b.count - a.count)[0]

  return (
    `Berdasarkan analisis kegagalan terhadap **${total} respons chatbot**, ditemukan ` +
    `**${totalFailures} kasus kegagalan** yang teridentifikasi. Jenis kegagalan ` +
    `yang paling sering muncul adalah **${mostCommon.type}** dengan **${mostCommon.count} kasus** ` +
    `(${mostCommon.percentage}% dari total Respons).\n\n` +
    `Keberadaan kegagalan-kegagalan ini menunjukkan bahwa meskipun sistem secara ` +
    `umum berfungsi dengan baik, masih terdapat area yang memerlukan perbaikan. ` +
    `Analisis lebih detail mengenai setiap jenis kegagalan, penyebab, dampak, ` +
    `dan rekomendasi perbaikan akan dijelaskan pada sub-bab berikutnya.`
  )
}

// TABEL DISTRIBUSI

function generateDistribusiTable(
  types: FailureTypeAnalysis[],
  total: number
): string {
  const lines: string[] = []
  lines.push("| Jenis Kegagalan | Jumlah | Persentase |")
  lines.push("|-----------------|--------|------------|")
  for (const t of types) {
    lines.push(`| ${t.type} | ${t.count} | ${t.percentage}% |`)
  }
  lines.push(`| **Total** | **${total}** | **100%** |`)
  lines.push("")
  return lines.join("\n")
}

// REKOMENDASI

function generateRecommendations(
  types: FailureTypeAnalysis[]
): FailureRecommendation[] {
  const recs: FailureRecommendation[] = []

  for (const t of types) {
    if (t.count === 0) continue

    let priority: "Tinggi" | "Sedang" | "Rendah" = "Sedang"
    if (t.type === "Mismatch Emosional" || t.type === "Respons Tidak Relevan") {
      priority = "Tinggi"
    } else if (t.type === "Halusinasi") {
      priority = "Tinggi"
    }

    recs.push({
      issue: t.type,
      technicalRecommendation: t.recommendation,
      academicRecommendation:
        `Untuk mengatasi masalah ${t.type.toLowerCase()}, penelitian selanjutnya ` +
        `disarankan untuk ${t.recommendation.toLowerCase()}. ` +
        `Langkah ini diharapkan dapat mengurangi tingkat kegagalan dan meningkatkan ` +
        `kualitas respons chatbot secara keseluruhan.`,
      priority,
    })
  }

  return recs
}

// ANALISIS PER JENIS

/**
 * Menghasilkan analisis mendalam untuk satu jenis kegagalan.
 */
export function generateFailureTypeNarrative(
  type: FailureTypeAnalysis
): string {
  const label = type.type
  const causes = type.possibleCauses.map((c, i) => `${i + 1}. ${c}`).join("\n")
  const impact = type.impact
  const rec = type.recommendation

  return (
    `### ${label}\n\n` +
    `Ditemukan **${type.count} kasus** (${type.percentage}% dari total) ` +
    `dengan jenis kegagalan ${label.toLowerCase()}.\n\n` +
    `**Kemungkinan Penyebab:**\n${causes}\n\n` +
    `**Dampak terhadap Kualitas Chatbot:**\n${impact}\n\n` +
    `**Rekomendasi Perbaikan:**\n${rec}\n`
  )
}

// REKOMENDASI UNTUK DOSEN PENGUJI

/**
 * Menghasilkan jawaban atas kemungkinan pertanyaan dosen penguji
 * terkait kegagalan sistem.
 */
export function generateDefenseFailureAnswers(
  failures: FailureAnalysis[]
): string {
  const total = failures.length
  const failed = failures.filter((f) => f.label === "FAILED").length
  const rate = total > 0 ? ((failed / total) * 100).toFixed(1) : "0.0"

  return (
    `### Pertanyaan: "Mengapa masih ada kegagalan dalam sistem?"\n\n` +
    `**Jawaban:**\n` +
    `Dari total ${total} skenario pengujian, ditemukan **${rate}%** respons ` +
    `yang masuk dalam kategori FAILED. Hal ini wajar mengingat beberapa ` +
    `keterbatasan dalam penelitian ini:\n\n` +
    `1. **Keterbatasan basis data chunk**: Basis data chunk yang digunakan ` +
    `masih terbatas pada pola-pola emosional yang umum. Kondisi emosional ` +
    `yang kompleks atau jarang muncul mungkin belum terwakili dengan baik.\n\n` +
    `2. **Keterbatasan deteksi emosi otomatis**: Deteksi emosi dilakukan ` +
    `secara otomatis menggunakan metode keyword-based, yang memiliki ` +
    `keterbatasan dalam menangkap nuansa emosional yang halus.\n\n` +
    `3. **Sifat probabilistik LLM**: Model bahasa Large Language Model ` +
    `bersifat probabilistik, sehingga kadang menghasilkan respons yang ` +
    `kurang optimal meskipun dengan konteks yang baik.\n\n` +
    `4. **Trade-off antara keamanan dan relevansi**: Sistem dirancang ` +
    `untuk mengutamakan keamanan (tidak memberikan saran berbahaya), ` +
    `yang kadang mengorbankan relevansi respons.\n\n` +
    `Meskipun demikian, success rate sistem mencapai **${100 - Number(rate)}%**, ` +
    `yang menunjukkan bahwa sistem layak digunakan sebagai alat bantu ` +
    `dukungan emosional awal.`
  )
}
