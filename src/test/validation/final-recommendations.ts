import { EvaluationSession, RealComparisonSummary, MultiTurnSummary, FailureAnalysis } from "@/test/types"
import { FinalRecommendations } from "./types"

/**
 * Final Recommendations — menghasilkan rekomendasi akhir
 * berdasarkan hasil validasi dan evaluasi.
 *
 * Rekomendasi dikelompokkan menjadi:
 * - System Development: perbaikan arsitektur chatbot
 * - Retrieval Improvement: peningkatan kualitas RAG
 * - Emotional Understanding: peningkatan empati
 * - Dataset Development: pengembangan dataset
 * - Future Evaluation: saran untuk evaluasi selanjutnya
 */
export function generateFinalRecommendations(
  session: EvaluationSession,
  comparison?: RealComparisonSummary,
  multiTurn?: MultiTurnSummary,
  failures?: FailureAnalysis[]
): FinalRecommendations {
  const s = session.summary

  // System Development
  const systemDevelopment: string[] = []
  if (s.averageSimilarity < 70) {
    systemDevelopment.push("Tingkatkan kemampuan chatbot dalam menghasilkan respons yang mirip dengan konteks emosional pengguna.")
  }
  if (s.averageRelevance < 70) {
    systemDevelopment.push("Perbaiki mekanisme pemilihan konten agar respons lebih relevan dengan kondisi emosional.")
  }

  const weakCount = s.labelDistribution.WEAK || 0
  if (weakCount > 3) {
    systemDevelopment.push(`Evaluasi ulang ${weakCount} skenario dengan respons lemah. Identifikasi pola kegagalan dan sesuaikan strategi respons.`)
  }

  if (systemDevelopment.length === 0) {
    systemDevelopment.push("Sistem sudah cukup baik. Fokus pada pemeliharaan dan peningkatan bertahap.")
  }

  // Retrieval Improvement
  const retrievalImprovement: string[] = []
  if (s.averageRetrieval < 70) {
    retrievalImprovement.push("Tingkatkan kualitas dataset RAG dengan menambahkan lebih banyak chunk yang relevan dengan variasi emosional.")
    retrievalImprovement.push("Optimalkan mekanisme similarity search agar lebih sensitif terhadap konteks emosional.")
  }

  if (comparison && comparison.averageImprovement < 15) {
    retrievalImprovement.push("Evaluasi ulang strategi chunking dan embedding yang digunakan untuk retrieval.")
    retrievalImprovement.push("Pertimbangkan hybrid retrieval (keyword + semantic) untuk meningkatkan akurasi.")
  }

  if (retrievalImprovement.length === 0) {
    retrievalImprovement.push("Retrieval sudah berjalan baik. Pantau performa secara berkala.")
  }

  // Emotional Understanding
  const emotionalUnderstanding: string[] = []
  if (s.averageEmpathy < 70) {
    emotionalUnderstanding.push("Tingkatkan kemampuan deteksi emosi dengan menambahkan lebih banyak variasi ekspresi emosional dalam dataset.")
    emotionalUnderstanding.push("Kembangkan template respons yang lebih empatik dan personal.")
  }

  if (failures) {
    const mismatchCount = failures.filter((f) => f.isEmotionalMismatch).length
    if (mismatchCount > 2) {
      emotionalUnderstanding.push(`Investigasi ${mismatchCount} kasus ketidaksesuaian emosional. Identifikasi pola emosi yang sulit dideteksi.`)
    }
  }

  if (emotionalUnderstanding.length === 0) {
    emotionalUnderstanding.push("Pemahaman emosional sudah cukup baik. Terus tingkatkan variasi dataset emosional.")
  }

  // Dataset Development
  const datasetDevelopment: string[] = []
  if (session.entries.length < 10) {
    datasetDevelopment.push(`Tambah jumlah skenario (saat ini ${session.entries.length}). Minimal 20 skenario untuk hasil yang lebih representatif.`)
  }

  datasetDevelopment.push("Perkaya variasi emosional dalam dataset dengan menambahkan skenario dari kelompok under-represented.")
  datasetDevelopment.push("Validasi kualitas dataset dengan annotator manusia untuk memastikan konsistensi.")

  // Future Evaluation
  const futureEvaluation: string[] = []
  futureEvaluation.push("Lakukan evaluasi dengan pengguna nyata (human evaluation) untuk memvalidasi hasil evaluasi otomatis.")
  futureEvaluation.push("Uji chatbot dalam percakapan multi-turn yang lebih panjang untuk mengukur konsistensi memori.")
  futureEvaluation.push("Bandingkan dengan sistem baseline atau chatbot komersial untuk mengukur tingkat kompetitif.")

  if (multiTurn) {
    if (multiTurn.averageMemoryConsistency < 60) {
      futureEvaluation.push("Fokus pada peningkatan memory consistency dalam percakapan multi-turn.")
    }
  }

  return {
    systemDevelopment,
    retrievalImprovement,
    emotionalUnderstanding,
    datasetDevelopment,
    futureEvaluation,
  }
}

/**
 * Markdown untuk rekomendasi final.
 */
export function generateRecommendationsMarkdown(
  result: FinalRecommendations
): string {
  const lines: string[] = []
  lines.push("## Rekomendasi")
  lines.push("")

  const sections: Array<{ title: string; items: string[] }> = [
    { title: "Pengembangan Sistem", items: result.systemDevelopment },
    { title: "Peningkatan Retrieval", items: result.retrievalImprovement },
    { title: "Pemahaman Emosional", items: result.emotionalUnderstanding },
    { title: "Pengembangan Dataset", items: result.datasetDevelopment },
    { title: "Evaluasi Selanjutnya", items: result.futureEvaluation },
  ]

  for (const section of sections) {
    lines.push(`### ${section.title}`)
    lines.push("")
    for (const item of section.items) {
      lines.push(`- ${item}`)
    }
    lines.push("")
  }

  return lines.join("\n")
}
