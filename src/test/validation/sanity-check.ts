import { EvaluationSession, FailureAnalysis } from "@/test/types"
import { ValidationIssue, SanityCheckResult } from "./types"

/**
 * Academic Sanity Check — memastikan hasil penelitian realistis
 * dan tidak terlihat fabricated.
 *
 * Memeriksa:
 * - Apakah ada variasi skor yang wajar
 * - Apakah ada weak/failure cases
 * - Apakah distribusi terlihat natural
 * - Apakah skor tidak terlalu sempurna
 */
export function performSanityCheck(
  session: EvaluationSession,
  failures: FailureAnalysis[]
): SanityCheckResult {
  const issues: ValidationIssue[] = []
  const s = session.summary
  const scores = session.entries.map((e) =>
    Math.round((e.similarityScore + e.empathyScore + e.relevanceScore + e.retrievalScore) / 4)
  )

  // 1. Terlalu sempurna? (semua > 90)
  const allAbove90 = scores.every((s) => s >= 90)
  if (allAbove90 && scores.length > 3) {
    issues.push({
      id: "sanity_too_perfect",
      type: "ALL_SCORES_ABOVE_90",
      level: "CRITICAL",
      message: "SEMUA skenario mendapat skor ≥ 90. Hasil terlihat tidak realistis.",
      details: "Evaluasi otomatis mungkin terlalu longgar. Periksa threshold dan metode evaluasi. Hasil penelitian yang kredibel harus memiliki variasi skor.",
      source: "sanity-check",
    })
  }

  // 2. Tidak ada failure cases sama sekali
  const totalFailed = (s.labelDistribution.FAILED || 0) + (s.labelDistribution.WEAK || 0)
  if (totalFailed === 0 && scores.length >= 10) {
    issues.push({
      id: "sanity_no_failures",
      type: "NO_FAILURE_CASES",
      level: "WARNING",
      message: "Tidak ada weak/failure cases dari 33 skenario.",
      details: "Sistem yang sempurna tanpa kegagalan menimbulkan kecurigaan. Seharusnya ada beberapa skenario yang tidak optimal, terutama pada kondisi emosional kompleks.",
      source: "sanity-check",
    })
  }

  // 3. Variasi skor terlalu rendah (semua di rentang sempit)
  if (scores.length > 0) {
    const min = Math.min(...scores)
    const max = Math.max(...scores)
    const range = max - min
    if (range < 15) {
      issues.push({
        id: "sanity_low_variance",
        type: "LOW_SCORE_VARIANCE",
        level: "WARNING",
        message: `Rentang skor terlalu sempit (${min}-${max}, range: ${range}).`,
        details: "Variasi skor yang rendah mengindikasikan evaluasi mungkin tidak sensitif terhadap perbedaan kualitas antar skenario.",
        source: "sanity-check",
      })
    }
  }

  // 4. Rata-rata terlalu tinggi
  const overallAvg = Math.round(
    (s.averageSimilarity + s.averageEmpathy + s.averageRelevance + s.averageRetrieval) / 4
  )
  if (overallAvg >= 90) {
    issues.push({
      id: "sanity_avg_too_high",
      type: "AVERAGE_TOO_HIGH",
      level: "WARNING",
      message: `Rata-rata skor keseluruhan ${overallAvg}/100 — sangat tinggi.`,
      details: "Rata-rata di atas 90 jarang terjadi dalam evaluasi sistem yang realistis. Pastikan metode evaluasi tidak terlalu permisif.",
      source: "sanity-check",
    })
  }

  // 5. Empati sempurna di semua skenario
  if (session.entries.every((e) => e.empathyScore >= 80)) {
    issues.push({
      id: "sanity_empathy_too_high",
      type: "EMPATHY_ALL_HIGH",
      level: "WARNING",
      message: "Semua skenario mendapat skor empati ≥ 80.",
      details: "Empati adalah dimensi yang sulit. Sangat tidak realistis jika chatbot selalu empatik di semua kondisi. Mungkin deteksi empati terlalu longgar.",
      source: "sanity-check",
    })
  }

  // 6. Periksa apakah failure analysis masuk akal
  if (failures.length > 0) {
    const goodCount = failures.filter((f) => f.label === "GOOD").length
    if (goodCount === failures.length) {
      issues.push({
        id: "sanity_all_good",
        type: "ALL_FAILURE_ANALYSIS_GOOD",
        level: "WARNING",
        message: "Failure analysis memberi label GOOD ke semua respons.",
        details: "Jika failure analysis tidak pernah mendeteksi kegagalan, mungkin threshold-nya terlalu longgar.",
        source: "sanity-check",
      })
    }
  }

  // Realism score
  const passed = issues.filter((i) => i.level === "CRITICAL").length === 0
  const penalty = issues.reduce((p, i) => p + (i.level === "CRITICAL" ? 25 : i.level === "WARNING" ? 10 : 0), 0)
  const realismScore = Math.max(0, 100 - penalty)

  // Summary
  let summary: string
  if (realismScore >= 80) {
    summary = "Hasil penelitian terlihat realistis dan akademik. Variasi skor dan distribusi wajar."
  } else if (realismScore >= 60) {
    summary = "Terdapat beberapa indikasi yang perlu diperiksa agar hasil lebih realistis."
  } else {
    summary = "Hasil penelitian terlihat tidak realistis. Disarankan untuk meninjau ulang metode evaluasi."
  }

  return { passed: passed && realismScore >= 60, issues, realismScore, summary }
}

/**
 * Menghasilkan rekomendasi perbaikan realism.
 */
export function generateRealismRecommendations(
  result: SanityCheckResult
): string[] {
  const recs: string[] = []

  if (result.issues.some((i) => i.type === "ALL_SCORES_ABOVE_90")) {
    recs.push(
      "Turunkan threshold evaluasi agar lebih ketat. Sistem yang realistis harus memiliki variasi skor."
    )
  }

  if (result.issues.some((i) => i.type === "NO_FAILURE_CASES")) {
    recs.push(
      "Tambahkan skenario dengan tingkat kesulitan lebih tinggi. Pastikan ada beberapa skenario yang memang sulit untuk chatbot."
    )
  }

  if (result.issues.some((i) => i.type === "LOW_SCORE_VARIANCE")) {
    recs.push(
      "Gunakan rentang penilaian yang lebih lebar. Evaluasi yang baik harus bisa membedakan kualitas antar skenario."
    )
  }

  if (result.issues.some((i) => i.type === "EMPATHY_ALL_HIGH")) {
    recs.push(
      "Perketat deteksi empati. Tambahkan lebih banyak variasi level empati (bukan hanya ada/tidak ada keyword)."
    )
  }

  if (recs.length === 0) {
    recs.push("Tidak ada rekomendasi khusus. Hasil terlihat realistis.")
  }

  return recs
}

/**
 * Menghasilkan markdown sanity check.
 */
export function generateSanityMarkdown(result: SanityCheckResult): string {
  const lines: string[] = []
  lines.push("## Academic Sanity Check")
  lines.push("")
  lines.push(`**Status:** ${result.passed ? "✅ PASS" : "❌ FAIL"}`)
  lines.push(`**Realism Score:** ${result.realismScore}/100`)
  lines.push("")
  lines.push(`**Ringkasan:** ${result.summary}`)
  lines.push("")

  if (result.issues.length > 0) {
    lines.push("### Issues")
    lines.push("")
    lines.push("| Level | Issue | Detail |")
    lines.push("|-------|-------|--------|")
    for (const issue of result.issues) {
      lines.push(`| ${issue.level} | ${issue.message} | ${issue.details || "-"} |`)
    }
    lines.push("")
  }

  return lines.join("\n")
}
