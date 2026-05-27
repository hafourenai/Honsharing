import { EvaluationSession } from "@/test/types"
import { ReliabilitySummary } from "./types"

/**
 * Reliability Summary — menghitung keandalan sistem secara keseluruhan.
 *
 * Menggabungkan:
 * - Distribusi label kualitas (GOOD / ACCEPTABLE / WEAK / FAILED)
 * - Consistency score
 * - Retrieval success rate
 * Menghasilkan label keandalan: TINGGI / SEDANG / RENDAH
 */
export function generateReliabilitySummary(
  session: EvaluationSession
): ReliabilitySummary {
  const totalTests = session.entries.length
  const dist = session.summary.labelDistribution

  const validResponses = (dist.GOOD || 0) + (dist.ACCEPTABLE || 0)
  const weakResponses = dist.WEAK || 0
  const failedResponses = dist.FAILED || 0

  // Consistency level: semakin banyak yang GOOD + ACCEPTABLE, semakin tinggi
  const consistencyLevel = totalTests > 0
    ? Math.round((validResponses / totalTests) * 100)
    : 0

  // Retrieval success rate: rata-rata retrieval score
  const allRetrievalScores = session.entries.map((e) => e.retrievalScore)
  const retrievalSuccessRate = allRetrievalScores.length > 0
    ? Math.round(allRetrievalScores.reduce((a, b) => a + b, 0) / allRetrievalScores.length)
    : 0

  // Label keandalan
  let systemReliability: "TINGGI" | "SEDANG" | "RENDAH"
  let summary: string
  let details: string

  if (consistencyLevel >= 80 && retrievalSuccessRate >= 70) {
    systemReliability = "TINGGI"
    summary = "Sistem menunjukkan keandalan tinggi."
    details = [
      `- ${validResponses} dari ${totalTests} respons valid (${consistencyLevel}%)`,
      `- Retrieval success rate: ${retrievalSuccessRate}%`,
      `- Sistem konsisten memberikan respons berkualitas di sebagian besar skenario.`,
    ].join("\n")
  } else if (consistencyLevel >= 60 && retrievalSuccessRate >= 50) {
    systemReliability = "SEDANG"
    summary = "Sistem menunjukkan keandalan sedang dengan beberapa kelemahan."
    details = [
      `- ${validResponses} dari ${totalTests} respons valid (${consistencyLevel}%)`,
      `- ${weakResponses} respons lemah dan ${failedResponses} respons gagal`,
      `- Retrieval success rate: ${retrievalSuccessRate}%`,
      `- Diperlukan peningkatan pada area yang masih lemah.`,
    ].join("\n")
  } else {
    systemReliability = "RENDAH"
    summary = "Sistem menunjukkan keandalan rendah dan perlu perbaikan signifikan."
    details = [
      `- Hanya ${validResponses} dari ${totalTests} respons valid (${consistencyLevel}%)`,
      `- ${weakResponses + failedResponses} respons bermasalah`,
      `- Retrieval success rate rendah: ${retrievalSuccessRate}%`,
      `- Diperlukan evaluasi ulang arsitektur dan dataset.`,
    ].join("\n")
  }

  return {
    totalTests,
    validResponses,
    weakResponses,
    failedResponses,
    consistencyLevel,
    retrievalSuccessRate,
    systemReliability,
    summary,
    details,
  }
}

/**
 * Markdown untuk reliability summary.
 */
export function generateReliabilityMarkdown(
  result: ReliabilitySummary
): string {
  const lines: string[] = []
  lines.push("## Reliability Summary")
  lines.push("")
  lines.push(`**System Reliability:** ${result.systemReliability}`)
  lines.push(`**Consistency Level:** ${result.consistencyLevel}%`)
  lines.push(`**Retrieval Success Rate:** ${result.retrievalSuccessRate}%`)
  lines.push("")
  lines.push("### Distribusi Respons")
  lines.push("")
  lines.push(`- ✅ Valid (GOOD + ACCEPTABLE): **${result.validResponses}** dari **${result.totalTests}**`)
  lines.push(`- ⚠️ Weak: **${result.weakResponses}**`)
  lines.push(`- ❌ Failed: **${result.failedResponses}**`)
  lines.push("")
  lines.push("### Detail")
  lines.push("")
  lines.push(result.details)
  lines.push("")
  lines.push("### Ringkasan")
  lines.push("")
  lines.push(result.summary)
  lines.push("")
  return lines.join("\n")
}
