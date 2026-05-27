import { EvaluationSession, TestScenario } from "@/test/types"
import { ValidationIssue, ConsistencyResult, ValidationLevel } from "./types"

/**
 * Consistency Checker — mendeteksi inkonsistensi antar skor evaluasi.
 *
 * Contoh inkonsistensi:
 * - Similarity tinggi tapi relevance rendah → aneh
 * - Empati tinggi tapi response generic → kontradiksi
 * - Retrieval tinggi tapi similarity rendah → mungkin chunk tidak terpakai
 */
export function checkConsistency(
  session: EvaluationSession,
  scenarios: TestScenario[]
): ConsistencyResult {
  const issues: ValidationIssue[] = []
  const entries = session.entries

  for (const entry of entries) {
    const scenario = scenarios.find((s) => s.id === entry.scenarioId)
    const scores = {
      similarity: entry.similarityScore,
      empathy: entry.empathyScore,
      relevance: entry.relevanceScore,
      retrieval: entry.retrievalScore,
    }

    // 1. Similarity tinggi tapi relevance rendah
    if (scores.similarity >= 70 && scores.relevance < 40) {
      issues.push({
        id: `incon_sim_rel_${entry.scenarioId}`,
        type: "SIMILARITY_RELEVANCE_MISMATCH",
        level: "WARNING",
        message: `Similarity tinggi (${scores.similarity}) tapi relevance rendah (${scores.relevance})`,
        details: `Skenario ${entry.scenarioName}: Respons mirip secara kata tapi tidak relevan secara konteks. Mungkin chatbot menggunakan kata kunci yang sama tanpa memahami konteks.`,
        source: "consistency-checker",
      })
    }

    // 2. Empati tinggi tapi retrieval rendah
    if (scores.empathy >= 70 && scores.retrieval < 35) {
      issues.push({
        id: `incon_emp_ret_${entry.scenarioId}`,
        type: "EMPATHY_RETRIEVAL_MISMATCH",
        level: "WARNING",
        message: `Empati tinggi (${scores.empathy}) tapi retrieval rendah (${scores.retrieval})`,
        details: `Skenario ${entry.scenarioName}: Chatbot empatik tanpa konteks retrieval. Mungkin mengandalkan template bawaan.`,
        source: "consistency-checker",
      })
    }

    // 3. Retrieval tinggi tapi similarity rendah
    if (scores.retrieval >= 70 && scores.similarity < 35) {
      issues.push({
        id: `incon_ret_sim_${entry.scenarioId}`,
        type: "RETRIEVAL_SIMILARITY_MISMATCH",
        level: "WARNING",
        message: `Retrieval tinggi (${scores.retrieval}) tapi similarity rendah (${scores.similarity})`,
        details: `Skenario ${entry.scenarioName}: Chunk relevan terambil tapi respons tidak mencerminkan konteks. Kemungkinan chunk tidak digunakan oleh LLM.`,
        source: "consistency-checker",
      })
    }

    // 4. Semua skor tinggi sempurna (suspicious)
    const allHigh = Object.values(scores).every((s) => s >= 85)
    if (allHigh) {
      issues.push({
        id: `incon_all_high_${entry.scenarioId}`,
        type: "ALL_SCORES_HIGH",
        level: "WARNING",
        message: `Semua skor sangat tinggi (${scores.similarity}, ${scores.empathy}, ${scores.relevance}, ${scores.retrieval})`,
        details: `Skenario ${entry.scenarioName}: Semua dimensi di atas 85. Periksa apakah evaluasi terlalu longgar.`,
        source: "consistency-checker",
      })
    }

    // 5. Semua skor rendah (butuh perhatian)
    const allLow = Object.values(scores).every((s) => s < 30)
    if (allLow) {
      issues.push({
        id: `incon_all_low_${entry.scenarioId}`,
        type: "ALL_SCORES_LOW",
        level: "CRITICAL",
        message: `Semua skor sangat rendah (${scores.similarity}, ${scores.empathy}, ${scores.relevance}, ${scores.retrieval})`,
        details: `Skenario ${entry.scenarioName}: Sistem gagal total pada skenario ini. Perlu investigasi.`,
        source: "consistency-checker",
      })
    }
  }

  // Hitung consistency score
  const totalEntries = entries.length
  const warningCount = issues.filter((i) => i.level === "WARNING").length
  const criticalCount = issues.filter((i) => i.level === "CRITICAL").length
  const penalty = (warningCount * 5) + (criticalCount * 15)
  const consistencyScore = Math.max(0, 100 - penalty)

  // Summary
  let summary: string
  if (consistencyScore >= 80) {
    summary = "Konsistensi hasil evaluasi baik. Tidak ditemukan inkonsistensi signifikan."
  } else if (consistencyScore >= 60) {
    summary = `Terdapat ${issues.length} inkonsistensi yang perlu diperhatikan. Skor masih dalam batas wajar.`
  } else {
    summary = `Terdapat ${issues.length} inkonsistensi signifikan. Disarankan untuk meninjau ulang hasil evaluasi.`
  }

  return { issues, consistencyScore, summary }
}

/**
 * Mendeteksi kontradiksi antar dimensi evaluasi.
 */
export function detectContradictions(
  session: EvaluationSession
): ValidationIssue[] {
  const contradictions: ValidationIssue[] = []

  for (const entry of session.entries) {
    // Empati rendah pada skenario yang membutuhkan empati tinggi
    if (entry.empathyScore < 30 && entry.similarityScore > 70) {
      contradictions.push({
        id: `cont_emp_low_${entry.scenarioId}`,
        type: "LOW_EMPATHY_HIGH_SIMILARITY",
        level: "WARNING",
        message: `Empati rendah (${entry.empathyScore}) meskipun similarity tinggi (${entry.similarityScore})`,
        details: `Skenario ${entry.scenarioName}: Chatbot bisa meniru kata-kata tapi tidak menunjukkan empati.`,
        source: "consistency-checker",
      })
    }
  }

  return contradictions
}

/**
 * Menghasilkan ringkasan konsistensi dalam markdown.
 */
export function generateConsistencyMarkdown(
  result: ConsistencyResult
): string {
  const lines: string[] = []
  lines.push("## Hasil Consistency Check")
  lines.push("")
  lines.push(`**Consistency Score:** ${result.consistencyScore}/100`)
  lines.push("")
  lines.push(`**Ringkasan:** ${result.summary}`)
  lines.push("")

  if (result.issues.length > 0) {
    lines.push("### Issues yang Ditemukan")
    lines.push("")
    lines.push("| Level | Tipe | Pesan |")
    lines.push("|-------|------|-------|")
    for (const issue of result.issues) {
      const emoji = issue.level === "CRITICAL" ? "🔴" : issue.level === "WARNING" ? "🟡" : "🟢"
      lines.push(`| ${emoji} ${issue.level} | ${issue.type} | ${issue.message} |`)
    }
    lines.push("")
  } else {
    lines.push("Tidak ada inkonsistensi yang terdeteksi.")
    lines.push("")
  }

  return lines.join("\n")
}
