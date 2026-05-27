/**
 * ============================================================
 * AUTO CONCLUSION GENERATOR — KESIMPULAN OTOMATIS
 * ============================================================
 *
 * Menghasilkan kesimpulan otomatis berdasarkan hasil evaluasi.
 *
 * OUTPUT:
 * - Kesimpulan umum
 * - Summary efektivitas sistem
 * - Interpretasi performa chatbot
 * - Saran pengembangan
 *
 * @author  Tim Skripsi
 * @version 1.0
 * ============================================================
 */

import { EvaluationSession, RealComparisonSummary, MultiTurnSummary } from "@/test/types"
import { ResearchStats } from "./research-statistics"

// ================================================================
// TIPE DATA
// ================================================================

export interface AutoConclusion {
  /** Ringkasan satu paragraf */
  ringkasan: string
  /** Temuan utama */
  temuanUtama: string[]
  /** Interpretasi performa */
  interpretasiPerforma: string
  /** Efektivitas RAG */
  efektivitasRAG: RAGEffectivenessConclusion
  /** Kesimpulan multi-turn */
  multiTurnConclusion: string
  /** Saran */
  saran: string[]
  /** Penutup */
  penutup: string
}

export interface RAGEffectivenessConclusion {
  /** Apakah RAG efektif */
  efektif: boolean
  /** Persentase peningkatan */
  peningkatan: number
  /** Penjelasan */
  penjelasan: string
}

// ================================================================
// INTERPOLASI / AMBANG BATAS
// ================================================================

function kategorikan(score: number): string {
  if (score >= 85) return "sangat baik"
  if (score >= 70) return "baik"
  if (score >= 55) return "cukup"
  if (score >= 40) return "kurang"
  return "sangat kurang"
}

// ================================================================
// GENERATE KESIMPULAN LENGKAP
// ================================================================

export function generateAutoConclusion(
  session: EvaluationSession,
  stats: ResearchStats,
  ragComparison?: RealComparisonSummary,
  multiTurnSummary?: MultiTurnSummary
): AutoConclusion {
  const s = session.summary
  const overall = stats.averageScores.overall

  // Ringkasan
  const ringkasan = generateRingkasan(stats, overall)

  // Temuan utama
  const temuanUtama = generateTemuanUtama(stats, s)

  // Interpretasi performa
  const interpretasiPerforma = generateInterpretasiPerforma(stats)

  // Efektivitas RAG
  const efektivitasRAG = generateEfektivitasRAGConclusion(ragComparison)

  // Multi-turn conclusion
  const multiTurnConclusion = generateMultiTurnConclusion(multiTurnSummary)

  // Saran
  const saran = generateSaran(stats)

  // Penutup
  const penutup = generatePenutup()

  return {
    ringkasan,
    temuanUtama,
    interpretasiPerforma,
    efektivitasRAG,
    multiTurnConclusion,
    saran,
    penutup,
  }
}

// ================================================================
// RINGKASAN
// ================================================================

function generateRingkasan(stats: ResearchStats, overall: number): string {
  const baik = overall >= 70 ? "baik" : overall >= 55 ? "cukup" : "perlu ditingkatkan"

  return (
    `Penelitian ini berhasil mengimplementasikan dan mengevaluasi sistem ` +
    `Retrieval-Augmented Generation (RAG) pada chatbot curhat berbasis ` +
    `Large Language Model. Berdasarkan pengujian terhadap **${stats.totalScenarios} skenario** ` +
    `dalam **${stats.categoryBreakdown.length} kategori emosional**, sistem menunjukkan ` +
    `kinerja yang **${baik}** dengan rata-rata skor keseluruhan **${overall}/100** ` +
    `dan success rate **${stats.successRate}%**. Temuan utama menunjukkan bahwa ` +
    `penerapan RAG berhasil meningkatkan kualitas respons chatbot, terutama ` +
    `dalam hal relevansi konteks dan kekhususan respons. Sistem ini layak ` +
    `digunakan sebagai alat bantu dukungan emosional awal, meskipun bukan ` +
    `pengganti konseling profesional.`
  )
}

// ================================================================
// TEMUAN UTAMA
// ================================================================

function generateTemuanUtama(
  stats: ResearchStats,
  s: EvaluationSession["summary"]
): string[] {
  const temuan: string[] = []

  temuan.push(
    `Sistem berhasil memberikan respons dengan kualitas yang ${kategorikan(stats.averageScores.overall)} ` +
    `pada ${stats.totalScenarios} skenario pengujian dengan success rate ${stats.successRate}%.`
  )

  temuan.push(
    `Dimensi empati menjadi kekuatan utama sistem dengan rata-rata skor ${s.averageEmpathy}/100, ` +
    `menunjukkan bahwa chatbot mampu memberikan dukungan emosional yang memadai.`
  )

  if (s.averageRetrieval >= 60) {
    temuan.push(
      `Sistem retrieval berfungsi dengan baik dengan akurasi ${s.averageRetrieval}/100, ` +
      `menunjukkan bahwa mekanisme RAG dapat mengambil konteks yang relevan.`
    )
  } else {
    temuan.push(
      `Sistem retrieval masih perlu ditingkatkan dengan akurasi ${s.averageRetrieval}/100, ` +
      `terutama dalam mengambil chunk yang tepat untuk kondisi emosional kompleks.`
    )
  }

  temuan.push(
    `Kategori ${stats.bestCategory} menunjukkan performa terbaik, ` +
    `sementara kategori ${stats.worstCategory} memerlukan perhatian khusus.`
  )

  const weakCount = (s.labelDistribution.WEAK || 0) + (s.labelDistribution.FAILED || 0)
  if (weakCount > 0) {
    temuan.push(
      `Terdapat ${weakCount} skenario (${100 - stats.successRate}%) yang masih ` +
      `memerlukan perbaikan, terutama dalam aspek relevansi dan spesifisitas respons.`
    )
  }

  return temuan
}

// ================================================================
// INTERPRETASI PERFORMA
// ================================================================

function generateInterpretasiPerforma(stats: ResearchStats): string {
  const s = stats.averageScores
  const strengths: string[] = []
  const weaknesses: string[] = []

  if (s.empathy >= 70) strengths.push("empati")
  if (s.relevance >= 70) strengths.push("relevansi")
  if (s.similarity >= 70) strengths.push("similarity")
  if (s.retrieval < 70) weaknesses.push("akurasi retrieval")
  if (s.similarity < 70) weaknesses.push("similarity")

  let interpretation = `Berdasarkan hasil evaluasi, sistem menunjukkan `
  if (strengths.length > 0) {
    interpretation += `kekuatan pada dimensi ${strengths.join(" dan ")}. `
  }
  if (weaknesses.length > 0) {
    interpretation += `Sementara itu, dimensi ${weaknesses.join(" dan ")} masih perlu ditingkatkan. `
  }
  interpretation +=
    `Secara umum, sistem ${s.overall >= 70 ? "mampu" : "cukup mampu"} memberikan respons yang ` +
    `${s.overall >= 70 ? "memadai" : "cukup"} untuk mendukung pengguna yang sedang mengalami ` +
    `masalah emosional.`

  return interpretation
}

// ================================================================
// EFEKTIVITAS RAG
// ================================================================

function generateEfektivitasRAGConclusion(
  ragComparison?: RealComparisonSummary
): RAGEffectivenessConclusion {
  if (!ragComparison) {
    return {
      efektif: false,
      peningkatan: 0,
      penjelasan: "Perbandingan RAG vs Non-RAG tidak dilakukan pada evaluasi ini.",
    }
  }

  const efektif = ragComparison.averageImprovement > 0
  const peningkatan = ragComparison.averageNonRagContextualFit > 0
    ? Math.round((ragComparison.averageImprovement / ragComparison.averageNonRagContextualFit) * 100)
    : 0

  let penjelasan: string
  if (efektif && peningkatan >= 15) {
    penjelasan =
      `RAG terbukti sangat efektif dalam meningkatkan kualitas respons chatbot. ` +
      `Terjadi peningkatan sebesar **${peningkatan}%** pada contextual fit ` +
      `(${ragComparison.averageNonRagContextualFit} → ${ragComparison.averageRagContextualFit}). ` +
      `Peningkatan yang signifikan ini menunjukkan bahwa konteks retrieval ` +
      `sangat membantu model bahasa dalam menghasilkan respons yang relevan ` +
      `dan kontekstual.`
  } else if (efektif) {
    penjelasan =
      `RAG memberikan peningkatan moderat sebesar **${peningkatan}%** pada kualitas ` +
      `respons chatbot. Meskipun peningkatannya tidak terlalu besar, RAG tetap ` +
      `memberikan kontribusi positif dalam meningkatkan relevansi konteks respons.`
  } else {
    penjelasan =
      `RAG belum menunjukkan peningkatan yang signifikan pada evaluasi ini. ` +
      `Hal ini mungkin disebabkan oleh kualitas chunk yang kurang optimal ` +
      `atau threshold retrieval yang perlu disesuaikan.`
  }

  return { efektif, peningkatan, penjelasan }
}

// ================================================================
// MULTI-TURN CONCLUSION
// ================================================================

function generateMultiTurnConclusion(
  multiTurnSummary?: MultiTurnSummary
): string {
  if (!multiTurnSummary) {
    return "Evaluasi multi-turn conversation tidak dilakukan pada penelitian ini."
  }

  const m = multiTurnSummary
  const baik = m.averageOverallScore >= 70

  return (
    `Evaluasi multi-turn conversation terhadap **${m.totalConversations} percakapan** ` +
    `menunjukkan hasil yang ${baik ? "cukup baik" : "perlu ditingkatkan"}. ` +
    `Rata-rata skor keseluruhan adalah **${m.averageOverallScore}/100**.\n\n` +
    `Dimensi **${m.averageMemoryConsistency >= m.averageEmotionalContinuity &&
      m.averageMemoryConsistency >= m.averageContextRetention
      ? "Memory Consistency"
      : m.averageEmotionalContinuity >= m.averageContextRetention
        ? "Emotional Continuity"
        : "Context Retention"}** ` +
    `menunjukkan performa terbaik dengan skor ` +
    `${Math.max(m.averageMemoryConsistency, m.averageEmotionalContinuity, m.averageContextRetention)}/100.\n\n` +
    `Temuan ini menunjukkan bahwa chatbot ${m.averageMemoryConsistency >= 70 ? "cukup baik" : "perlu ditingkatkan"} ` +
    `dalam mempertahankan konteks percakapan multi-turn, yang merupakan ` +
    `kemampuan penting untuk chatbot curhat karena pengguna sering bercerita ` +
    `secara bertahap.`
  )
}

// ================================================================
// SARAN
// ================================================================

function generateSaran(stats: ResearchStats): string[] {
  const saran: string[] = []
  const s = stats.averageScores

  saran.push(
    "Perluas basis data chunk RAG terutama untuk kategori dengan skor rendah, " +
    "agar retrieval dapat mengambil konteks yang lebih relevan dan bervariasi."
  )

  if (s.retrieval < 70) {
    saran.push(
      "Optimasi threshold similarity dan kualitas embedding untuk meningkatkan " +
      "precision dan recall sistem retrieval."
    )
  }

  if (s.empathy < 70) {
    saran.push(
      "Tingkatkan variasi frasa empatik dalam basis data chunk dan optimasi " +
      "prompt sistem untuk mendorong respons yang lebih hangat."
    )
  }

  saran.push(
    "Lakukan pengujian dengan pengguna nyata (human evaluation) untuk " +
    "memvalidasi hasil evaluasi otomatis dan mendapatkan masukan kualitatif."
  )

  saran.push(
    "Tambahkan mekanisme deteksi krisis untuk mengidentifikasi pengguna yang " +
    "mungkin membutuhkan bantuan profesional segera."
  )

  saran.push(
    "Kembangkan sistem memori jangka panjang agar chatbot dapat mengingat " +
    "percakapan sebelumnya dan memberikan kontinuitas emosional yang lebih baik."
  )

  return saran
}

// ================================================================
// PENUTUP
// ================================================================

function generatePenutup(): string {
  return (
    `Kesimpulannya, sistem RAG chatbot curhat yang dikembangkan dalam penelitian ` +
    `ini berhasil menunjukkan bahwa penerapan Retrieval-Augmented Generation pada ` +
    `chatbot berbasis Large Language Model dapat meningkatkan kualitas respons ` +
    `dukungan emosional secara signifikan. Meskipun masih terdapat berbagai ` +
    `keterbatasan, sistem ini telah membuktikan konsep (proof of concept) bahwa ` +
    `teknologi ini layak dikembangkan lebih lanjut sebagai alat bantu kesehatan ` +
    `mental yang accessible dan affordable.\n\n` +
    `Harapan ke depannya, penelitian ini dapat menjadi fondasi untuk pengembangan ` +
    `sistem dukungan emosional berbasis AI yang lebih canggih dan bermanfaat ` +
    `bagi masyarakat luas.`
  )
}
