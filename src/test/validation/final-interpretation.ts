import { EvaluationSession, RealComparisonSummary, MultiTurnSummary, FailureAnalysis } from "@/test/types"
import { FinalInterpretation } from "./types"

/**
 * Final Interpretation — menghasilkan narasi interpretasi akhir
 * dalam Bahasa Indonesia formal untuk skripsi.
 *
 * Berdasarkan:
 * - Hasil evaluasi (session summary)
 * - Perbandingan RAG vs Non-RAG
 * - Analisis kegagalan
 * - Distribusi skor
 */
export function generateFinalInterpretation(
  session: EvaluationSession,
  comparison?: RealComparisonSummary,
  multiTurn?: MultiTurnSummary,
  failures?: FailureAnalysis[]
): FinalInterpretation {
  const s = session.summary
  const avgAll = Math.round(
    (s.averageSimilarity + s.averageEmpathy + s.averageRelevance + s.averageRetrieval) / 4
  )

  // Title berdasarkan skor
  const title = avgAll >= 75
    ? "Sistem RAG Chatbot Berbasis Emosi Menunjukkan Kinerja yang Baik"
    : avgAll >= 60
    ? "Sistem RAG Chatbot Berbasis Emosi Menunjukkan Kinerja yang Cukup"
    : "Sistem RAG Chatbot Berbasis Emosi Menunjukkan Kinerja yang Perlu Ditingkatkan"

  // Narrative
  const narrative = [
    `Berdasarkan hasil evaluasi yang dilakukan terhadap ${s.totalScenarios} skenario pengujian, `,
    `sistem RAG chatbot berbasis emosi menunjukkan kinerja `,
    avgAll >= 75 ? "yang baik" : avgAll >= 60 ? "yang cukup" : "yang perlu ditingkatkan",
    `. Rata-rata skor keseluruhan sistem adalah ${avgAll}/100. `,
    `Dimensi similarity mencapai ${s.averageSimilarity}/100, `,
    `dimensi empati mencapai ${s.averageEmpathy}/100, `,
    `dimensi relevance mencapai ${s.averageRelevance}/100, `,
    `dan dimensi retrieval mencapai ${s.averageRetrieval}/100.`,
  ].join("")

  // Strengths
  const strengths: string[] = []
  if (s.averageSimilarity >= 70) strengths.push(`Similarity tinggi (${s.averageSimilarity}/100) — chatbot mampu merespon dengan konten yang mirip dengan konteks yang diharapkan.`)
  if (s.averageEmpathy >= 70) strengths.push(`Empati baik (${s.averageEmpathy}/100) — chatbot mampu menunjukkan pemahaman emosional yang memadai.`)
  if (s.averageRelevance >= 70) strengths.push(`Relevansi konteks baik (${s.averageRelevance}/100) — respons chatbot sesuai dengan konteks emosional pengguna.`)
  if (s.averageRetrieval >= 70) strengths.push(`Kualitas retrieval baik (${s.averageRetrieval}/100) — RAG mampu mengambil konteks yang relevan.`)
  if (comparison && comparison.averageImprovement > 15) strengths.push(`RAG memberikan peningkatan signifikan (${Math.round(comparison.averageImprovement)}%) dibandingkan tanpa RAG.`)

  if (strengths.length === 0) {
    strengths.push("Sistem belum menunjukkan keunggulan yang signifikan pada dimensi yang diukur.")
  }

  // Weaknesses
  const weaknesses: string[] = []
  if (s.averageSimilarity < 60) weaknesses.push(`Similarity rendah (${s.averageSimilarity}/100) — chatbot sering memberikan respons yang tidak sesuai konteks.`)
  if (s.averageEmpathy < 60) weaknesses.push(`Empati rendah (${s.averageEmpathy}/100) — chatbot kurang mampu menunjukkan pemahaman emosional.`)
  if (s.averageRelevance < 60) weaknesses.push(`Relevansi rendah (${s.averageRelevance}/100) — respons chatbot sering tidak relevan dengan konteks.`)
  if (s.averageRetrieval < 60) weaknesses.push(`Retrieval rendah (${s.averageRetrieval}/100) — RAG sering gagal mengambil konteks yang tepat.`)

  const failedCount = s.labelDistribution.FAILED || 0
  if (failedCount > 0) {
    weaknesses.push(`${failedCount} skenario gagal total — sistem tidak mampu memberikan respons yang memadai pada kondisi emosional tertentu.`)
  }

  if (failures && failures.length > 0) {
    const genericCount = failures.filter((f) => f.isGenericResponse).length
    if (genericCount > 0) weaknesses.push(`${genericCount} respons terdeteksi terlalu generik — chatbot cenderung menggunakan template daripada respons spesifik.`)
    const mismatchCount = failures.filter((f) => f.isEmotionalMismatch).length
    if (mismatchCount > 0) weaknesses.push(`${mismatchCount} respons mengalami ketidaksesuaian emosional — chatbot gagal menangkap nuansa emosi pengguna.`)
  }

  if (weaknesses.length === 0) {
    weaknesses.push("Tidak ditemukan kelemahan signifikan pada sistem.")
  }

  // RAG Impact
  let ragImpact: string
  if (comparison) {
    if (comparison.averageImprovement > 15) {
      ragImpact = [
        `Penerapan RAG memberikan peningkatan sebesar ${Math.round(comparison.averageImprovement)}% `,
        `dibandingkan dengan sistem tanpa RAG. `,
        `Peningkatan paling signifikan terjadi pada dimensi `,
        `specificity dan contextual relevance. `,
        `Hal ini menunjukkan bahwa RAG efektif dalam menyediakan konteks `,
        `yang relevan untuk menghasilkan respons yang lebih berkualitas.`,
      ].join("")
    } else if (comparison.averageImprovement > 0) {
      ragImpact = [
        `Penerapan RAG memberikan peningkatan sebesar ${Math.round(comparison.averageImprovement)}% `,
        `dibandingkan tanpa RAG. Meskipun peningkatan tidak signifikan, `,
        `RAG tetap memberikan kontribusi positif terhadap kualitas respons chatbot.`,
      ].join("")
    } else {
      ragImpact = [
        `Penerapan RAG belum menunjukkan peningkatan yang berarti `,
        `dibandingkan sistem tanpa RAG. Perlu evaluasi lebih lanjut `,
        `terhadap kualitas dataset dan mekanisme retrieval.`,
      ].join("")
    }
  } else {
    ragImpact = "Data perbandingan RAG vs Non-RAG tidak tersedia."
  }

  // Conclusion
  const conclusion = [
    `Sistem RAG chatbot berbasis emosi `,
    avgAll >= 70 ? "berhasil" : avgAll >= 55 ? "cukup berhasil" : "belum berhasil",
    ` dalam memberikan respons yang sesuai dengan kondisi emosional pengguna. `,
    strengths.length > weaknesses.length
      ? "Kelebihan sistem lebih dominan dibandingkan kekurangannya."
      : "Masih terdapat beberapa kelemahan yang perlu diperbaiki.",
    ` Hasil evaluasi ini memberikan gambaran yang komprehensif `,
    `tentang kinerja sistem dan area yang memerlukan pengembangan lebih lanjut.`,
  ].join("")

  return { title, narrative, strengths, weaknesses, ragImpact, conclusion }
}

/**
 * Markdown untuk interpretasi final.
 */
export function generateInterpretationMarkdown(
  result: FinalInterpretation
): string {
  const lines: string[] = []
  lines.push(`## ${result.title}`)
  lines.push("")
  lines.push(result.narrative)
  lines.push("")
  lines.push("### Kelebihan Sistem")
  lines.push("")
  for (const s of result.strengths) lines.push(`- ${s}`)
  lines.push("")
  lines.push("### Kelemahan Sistem")
  lines.push("")
  for (const w of result.weaknesses) lines.push(`- ${w}`)
  lines.push("")
  lines.push("### Dampak RAG")
  lines.push("")
  lines.push(result.ragImpact)
  lines.push("")
  lines.push("### Kesimpulan")
  lines.push("")
  lines.push(result.conclusion)
  lines.push("")
  return lines.join("\n")
}
