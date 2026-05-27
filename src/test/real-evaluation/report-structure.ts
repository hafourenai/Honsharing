/**
 * ============================================================
 * EVALUATION REPORT STRUCTURE — BAHASA INDONESIA FORMAL
 * ============================================================
 *
 * Membantu menghasilkan struktur laporan evaluasi berbahasa
 * Indonesia formal untuk skripsi (BAB 4).
 *
 * OUTPUT:
 * - Pendahuluan Evaluasi
 * - Metode Evaluasi
 * - Hasil Evaluasi per Dimensi
 * - Analisis Perbandingan
 * - Kesimpulan dan Saran
 *
 * @author  Tim Skripsi
 * @version 1.0
 * ============================================================
 */

import {
  EvaluationSession,
  AcademicInterpretation,
  RealComparisonSummary,
  MultiTurnSummary,
  FailureAnalysis,
  QualityLabel,
} from "@/test/types"

// ------------------------------------------------------------------
// TIPE LAPORAN
// ------------------------------------------------------------------

export interface ReportSection {
  title: string
  content: string
  subsections?: ReportSection[]
}

export interface EvaluationReport {
  title: string
  subtitle: string
  date: string
  mode: string
  sections: ReportSection[]
}

// ------------------------------------------------------------------
// GENERATE REPORT
// ------------------------------------------------------------------

/**
 * Menghasilkan laporan evaluasi lengkap berbahasa Indonesia formal.
 *
 * @param session       - Sesi evaluasi
 * @param interpretation - Interpretasi akademik
 * @param comparisons   - Hasil perbandingan RAG vs Non-RAG
 * @param multiTurn     - Hasil evaluasi multi-turn
 * @param failures      - Analisis kegagalan
 * @returns EvaluationReport
 */
export function generateEvaluationReport(
  session: EvaluationSession,
  interpretation: AcademicInterpretation,
  comparisons?: RealComparisonSummary,
  multiTurn?: MultiTurnSummary,
  failures?: FailureAnalysis[]
): EvaluationReport {
  const s = session.summary
  const avgOverall = Math.round(
    (s.averageSimilarity + s.averageEmpathy + s.averageRelevance + s.averageRetrieval) / 4
  )

  const sections: ReportSection[] = [
    generatePendahuluan(avgOverall, s.totalScenarios, session.mode),
    generateMetodeEvaluasi(s.totalScenarios, session.mode),
    generateHasilEvaluasi(s, interpretation),
    generateDistribusiLabel(s.labelDistribution, interpretation),
  ]

  if (comparisons) {
    sections.push(generatePerbandingan(comparisons, interpretation))
  }

  if (multiTurn) {
    sections.push(generateMultiTurnSection(multiTurn, interpretation))
  }

  if (failures && failures.length > 0) {
    sections.push(generateAnalisisKegagalan(failures, interpretation))
  }

  sections.push(generateKesimpulan(interpretation))

  return {
    title: "LAPORAN EVALUASI SISTEM",
    subtitle: `Chatbot Curhat "Honey" — RAG-Based Emotional Support Chatbot`,
    date: new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    mode: session.mode,
    sections,
  }
}

// ------------------------------------------------------------------
// 1. PENDAHULUAN
// ------------------------------------------------------------------

function generatePendahuluan(
  avgOverall: number,
  totalScenarios: number,
  mode: string
): ReportSection {
  return {
    title: "1. Pendahuluan Evaluasi",
    content:
      `Bab ini menyajikan hasil evaluasi secara sistematis terhadap sistem RAG chatbot ` +
      `curhat "Honey" yang dikembangkan. Evaluasi dilakukan dengan menggunakan ` +
      `**${totalScenarios} skenario pengujian** yang merepresentasikan berbagai kondisi ` +
      `emosional pengguna seperti overthinking, anxiety, masalah relationship, masalah ` +
      `keluarga, kurang motivasi, kesepian, insecure, burnout, stress, dan kecemasan ` +
      `akan masa depan.\n\n` +
      `Mode evaluasi yang digunakan adalah **${mode}**, di mana sistem diuji dengan ` +
      `pendekatan yang sesuai untuk mendapatkan gambaran objektif tentang performa ` +
      `chatbot. Evaluasi dilakukan secara otomatis dengan bantuan program Python untuk ` +
      `memastikan konsistensi dan reproduktibilitas hasil.\n\n` +
      `Secara garis besar, sistem menunjukkan kinerja yang ` +
      `${avgOverall >= 80 ? "sangat baik" : avgOverall >= 65 ? "baik" : "cukup"} ` +
      `dengan rata-rata skor keseluruhan **${avgOverall}/100**. Laporan ini akan ` +
      `membahas secara detail hasil evaluasi per dimensi, analisis perbandingan, ` +
      `serta saran pengembangan untuk penelitian selanjutnya.`,
  }
}

// ------------------------------------------------------------------
// 2. METODE EVALUASI
// ------------------------------------------------------------------

function generateMetodeEvaluasi(
  totalScenarios: number,
  mode: string
): ReportSection {
  return {
    title: "2. Metode Evaluasi",
    content:
      "Metode evaluasi yang digunakan dalam penelitian ini meliputi beberapa aspek " +
      "pengukuran yang saling melengkapi untuk memberikan gambaran komprehensif " +
      "tentang kualitas sistem:\n\n" +
      "**2.1 Dimensi Evaluasi**\n\n" +
      "Evaluasi dilakukan berdasarkan empat dimensi utama:\n" +
      "- **Similarity**: Mengukur kesamaan antara respons chatbot dengan input pengguna.\n" +
      "- **Empati**: Mengukur sejauh mana respons menunjukkan validasi dan dukungan emosional.\n" +
      "- **Relevansi**: Mengukur kesesuaian respons dengan konteks percakapan.\n" +
      "- **Retrieval**: Mengukur seberapa baik sistem mengambil konteks yang relevan.\n\n" +
      "**2.2 Skenario Pengujian**\n\n" +
      `Sejumlah ${totalScenarios} skenario pengujian digunakan untuk mengevaluasi sistem. ` +
      "Setiap skenario dirancang untuk menguji kemampuan chatbot dalam menangani " +
      "berbagai kondisi emosional yang umum ditemui dalam konteks curhat.\n\n" +
      "**2.3 Mode Evaluasi**\n\n" +
      `Evaluasi dilakukan dengan mode **${mode}**. Tiga mode yang tersedia adalah:\n` +
      "- **Real Mode**: Menggunakan API sesungguhnya (\/api\/chat) untuk menghasilkan respons.\n" +
      "- **Mock Mode**: Menggunakan respons deterministik dari sistem mock.\n" +
      "- **Hybrid Mode**: Menggunakan retrieval nyata namun respons dari sistem mock.\n\n" +
      "**2.4 Alat Ukur**\n\n" +
      "Alat ukur yang digunakan meliputi cosine similarity untuk mengukur kesamaan " +
      "vektor, text overlap analysis untuk mengukur kecocokan kata kunci emosional, " +
      "serta keyword matching untuk mendeteksi empati dan relevansi.",
  }
}

// ------------------------------------------------------------------
// 3. HASIL EVALUASI
// ------------------------------------------------------------------

function generateHasilEvaluasi(
  s: EvaluationSession["summary"],
  interpretation: AcademicInterpretation
): ReportSection {
  const overallAvg = Math.round(
    (s.averageSimilarity + s.averageEmpathy + s.averageRelevance + s.averageRetrieval) /
      4
  )

  return {
    title: "3. Hasil Evaluasi",
    content:
      "Bagian ini menyajikan hasil evaluasi sistem secara detail berdasarkan empat dimensi " +
      "pengukuran yang telah ditetapkan.\n\n" +
      "**Ringkasan Hasil:**\n\n" +
      "| Dimensi | Rata-rata Skor | Kategori |\n" +
      "|---------|----------------|----------|\n" +
      `| Similarity | ${s.averageSimilarity}/100 | ${kategori(s.averageSimilarity)} |\n` +
      `| Empati | ${s.averageEmpathy}/100 | ${kategori(s.averageEmpathy)} |\n` +
      `| Relevansi | ${s.averageRelevance}/100 | ${kategori(s.averageRelevance)} |\n` +
      `| Retrieval | ${s.averageRetrieval}/100 | ${kategori(s.averageRetrieval)} |\n` +
      `| **Rata-rata** | **${overallAvg}/100** | ${kategori(overallAvg)} |\n\n` +
      "**3.1 Analisis Similarity**\n\n" + interpretation.similarityAnalysis + "\n\n" +
      "**3.2 Analisis Empati**\n\n" + interpretation.empathyAnalysis + "\n\n" +
      "**3.3 Analisis Retrieval**\n\n" + interpretation.retrievalAnalysis + "\n\n",
    subsections: [
      {
        title: "3.1 Analisis Similarity",
        content: interpretation.similarityAnalysis,
      },
      {
        title: "3.2 Analisis Empati",
        content: interpretation.empathyAnalysis,
      },
      {
        title: "3.3 Analisis Retrieval",
        content: interpretation.retrievalAnalysis,
      },
    ],
  }
}

// ------------------------------------------------------------------
// 4. DISTRIBUSI LABEL
// ------------------------------------------------------------------

function generateDistribusiLabel(
  labelDistribution: Record<string, number>,
  interpretation: AcademicInterpretation
): ReportSection {
  const total = Object.values(labelDistribution).reduce((a, b) => a + b, 0)

  const goodCount = (labelDistribution.GOOD || 0) +
    (labelDistribution.ACCEPTABLE || 0)
  const weakCount = (labelDistribution.WEAK || 0) +
    (labelDistribution.FAILED || 0)
  const goodPct = total > 0 ? ((goodCount / total) * 100).toFixed(1) : "0.0"
  const weakPct = total > 0 ? ((weakCount / total) * 100).toFixed(1) : "0.0"

  return {
    title: "4. Distribusi Label Kualitas",
    content:
      "Setiap respons chatbot diklasifikasikan ke dalam empat label kualitas:\n\n" +
      "| Label | Jumlah | Persentase |\n" +
      "|-------|--------|------------|\n" +
      `| GOOD | ${labelDistribution.GOOD || 0} | ${total > 0 ? (((labelDistribution.GOOD || 0) / total) * 100).toFixed(1) : "0.0"}% |\n` +
      `| ACCEPTABLE | ${labelDistribution.ACCEPTABLE || 0} | ${total > 0 ? (((labelDistribution.ACCEPTABLE || 0) / total) * 100).toFixed(1) : "0.0"}% |\n` +
      `| WEAK | ${labelDistribution.WEAK || 0} | ${total > 0 ? (((labelDistribution.WEAK || 0) / total) * 100).toFixed(1) : "0.0"}% |\n` +
      `| FAILED | ${labelDistribution.FAILED || 0} | ${total > 0 ? (((labelDistribution.FAILED || 0) / total) * 100).toFixed(1) : "0.0"}% |\n\n` +
      `Hasil distribusi menunjukkan bahwa **${goodPct}%** dari seluruh respons berada ` +
      `pada kategori GOOD atau ACCEPTABLE, yang berarti sistem berfungsi dengan baik ` +
      `untuk sebagian besar skenario. Sementara **${weakPct}%** sisanya berada pada ` +
      `kategori WEAK atau FAILED yang memerlukan perbaikan lebih lanjut.\n\n` +
      `${interpretation.executiveSummary}`,
  }
}

// ------------------------------------------------------------------
// 5. PERBANDINGAN RAG VS NON-RAG
// ------------------------------------------------------------------

function generatePerbandingan(
  comparisons: RealComparisonSummary,
  interpretation: AcademicInterpretation
): ReportSection {
  return {
    title: "5. Analisis Perbandingan RAG vs Non-RAG",
    content: interpretation.ragComparisonAnalysis,
    subsections: [
      {
        title: "5.1 Tabel Perbandingan",
        content:
          `| Metrik | Dengan RAG | Tanpa RAG | Peningkatan |\n` +
          `|--------|------------|-----------|-------------|\n` +
          `| Contextual Fit | ${comparisons.averageRagContextualFit.toFixed(1)} | ${comparisons.averageNonRagContextualFit.toFixed(1)} | ${comparisons.averageImprovement.toFixed(1)} |\n` +
          `| Total Skenario | ${comparisons.totalScenarios} | ${comparisons.totalScenarios} | - |`,
      },
      {
        title: "5.2 Interpretasi",
        content: interpretation.ragComparisonAnalysis,
      },
    ],
  }
}

// ------------------------------------------------------------------
// 6. MULTI-TURN
// ------------------------------------------------------------------

function generateMultiTurnSection(
  summary: MultiTurnSummary,
  interpretation: AcademicInterpretation
): ReportSection {
  return {
    title: "6. Evaluasi Multi-Turn Conversation",
    content: interpretation.multiTurnAnalysis,
    subsections: [
      {
        title: "6.1 Hasil per Dimensi",
        content:
          `| Dimensi | Rata-rata Skor |\n` +
          `|---------|----------------|\n` +
          `| Memory Consistency | ${summary.averageMemoryConsistency.toFixed(1)}/100 |\n` +
          `| Emotional Continuity | ${summary.averageEmotionalContinuity.toFixed(1)}/100 |\n` +
          `| Context Retention | ${summary.averageContextRetention.toFixed(1)}/100 |\n` +
          `| Topic Tracking | ${summary.averageTopicTracking.toFixed(1)}/100 |\n` +
          `| **Rata-rata** | **${summary.averageOverallScore.toFixed(1)}/100** |`,
      },
      {
        title: "6.2 Interpretasi",
        content: interpretation.multiTurnAnalysis,
      },
    ],
  }
}

// ------------------------------------------------------------------
// 7. ANALISIS KEGAGALAN
// ------------------------------------------------------------------

function generateAnalisisKegagalan(
  failures: FailureAnalysis[],
  interpretation: AcademicInterpretation
): ReportSection {
  return {
    title: "7. Analisis Kegagalan",
    content: interpretation.failureAnalysis,
  }
}

// ------------------------------------------------------------------
// 8. KESIMPULAN
// ------------------------------------------------------------------

function generateKesimpulan(
  interpretation: AcademicInterpretation
): ReportSection {
  return {
    title: "8. Kesimpulan dan Saran",
    content:
      `${interpretation.conclusion}\n\n` +
      `**Saran untuk Pengembangan Selanjutnya:**\n\n` +
      interpretation.suggestions.map((s, i) => `${i + 1}. ${s}`).join("\n\n"),
    subsections: [
      {
        title: "8.1 Kesimpulan",
        content: interpretation.conclusion,
      },
      {
        title: "8.2 Saran",
        content: interpretation.suggestions
          .map((s, i) => `${i + 1}. ${s}`)
          .join("\n\n"),
      },
    ],
  }
}

// ------------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------------

function kategori(score: number): string {
  if (score >= 80) return "Sangat Baik"
  if (score >= 65) return "Baik"
  if (score >= 50) return "Cukup"
  return "Kurang"
}
