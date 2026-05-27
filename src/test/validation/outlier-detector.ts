import { EvaluationSession, TestScenario } from "@/test/types"
import { ValidationIssue, OutlierResult, OutlierItem } from "./types"

/**
 * Outlier Detection — mendeteksi response abnormal.
 *
 * Mendeteksi:
 * - Response terlalu pendek
 * - Response terlalu generik
 * - Score abnormal (terlalu tinggi/rendah dibanding rata-rata)
 * - Retrieval mismatch
 * - Emotional inconsistency
 */
export function detectOutliers(
  session: EvaluationSession,
  scenarios: TestScenario[]
): OutlierResult {
  const items: OutlierItem[] = []
  const entries = session.entries
  const allScores = entries.map((e) => ({
    similarity: e.similarityScore,
    empathy: e.empathyScore,
    relevance: e.relevanceScore,
    retrieval: e.retrievalScore,
  }))

  const avgSimilarity = avg(allScores.map((s) => s.similarity))
  const avgEmpathy = avg(allScores.map((s) => s.empathy))
  const avgRelevance = avg(allScores.map((s) => s.relevance))
  const avgRetrieval = avg(allScores.map((s) => s.retrieval))
  const stdSimilarity = stdDev(allScores.map((s) => s.similarity), avgSimilarity)
  const stdEmpathy = stdDev(allScores.map((s) => s.empathy), avgEmpathy)

  for (const entry of entries) {
    const scenario = scenarios.find((s) => s.id === entry.scenarioId)
    const name = scenario?.name || entry.scenarioName

    // 1. Similarity outlier (z-score > 2)
    const simZ = stdSimilarity > 0 ? Math.abs(entry.similarityScore - avgSimilarity) / stdSimilarity : 0
    if (simZ > 2) {
      const isHigh = entry.similarityScore > avgSimilarity
      items.push({
        scenarioId: entry.scenarioId,
        scenarioName: name,
        metric: "similarity",
        value: entry.similarityScore,
        expected: `rata-rata ${avgSimilarity.toFixed(0)} ± ${(stdSimilarity * 2).toFixed(0)}`,
        level: "WARNING",
        reason: `Score similarity ${isHigh ? "jauh di atas" : "jauh di bawah"} rata-rata (z-score: ${simZ.toFixed(2)})`,
      })
    }

    // 2. Empathy outlier
    const empZ = stdEmpathy > 0 ? Math.abs(entry.empathyScore - avgEmpathy) / stdEmpathy : 0
    if (empZ > 2) {
      items.push({
        scenarioId: entry.scenarioId,
        scenarioName: name,
        metric: "empathy",
        value: entry.empathyScore,
        expected: `rata-rata ${avgEmpathy.toFixed(0)} ± ${(stdEmpathy * 2).toFixed(0)}`,
        level: "WARNING",
        reason: `Score empathy menyimpang signifikan (z-score: ${empZ.toFixed(2)})`,
      })
    }

    // 3. Score sangat rendah (CRITICAL)
    const minScore = Math.min(entry.similarityScore, entry.empathyScore, entry.relevanceScore, entry.retrievalScore)
    if (minScore < 15) {
      items.push({
        scenarioId: entry.scenarioId,
        scenarioName: name,
        metric: "overall_min",
        value: minScore,
        expected: "minimal 15",
        level: "CRITICAL",
        reason: `Ada dimensi dengan score sangat rendah (${minScore}). Sistem gagal pada skenario ini.`,
      })
    }

    // 4. Retrieval sangat rendah tapi similarity tinggi
    if (entry.retrievalScore < 20 && entry.similarityScore > 70) {
      items.push({
        scenarioId: entry.scenarioId,
        scenarioName: name,
        metric: "retrieval_vs_similarity",
        value: entry.retrievalScore,
        expected: `retrieval minimal 20 jika similarity ${entry.similarityScore}`,
        level: "WARNING",
        reason: "Chatbot merespon baik tanpa konteks retrieval. Mungkin mengandalkan pengetahuan internal model.",
      })
    }

    // 5. Ketimpangan ekstrim antar dimensi
    const dims = [entry.similarityScore, entry.empathyScore, entry.relevanceScore, entry.retrievalScore]
    const dimMin = Math.min(...dims)
    const dimMax = Math.max(...dims)
    if (dimMax - dimMin > 60) {
      items.push({
        scenarioId: entry.scenarioId,
        scenarioName: name,
        metric: "dimension_gap",
        value: dimMax - dimMin,
        expected: "maksimal 60",
        level: "CRITICAL",
        reason: `Ketimpangan antar dimensi sangat besar (${dimMax - dimMin} poin). Ada ketidakseimbangan kualitas.`,
      })
    }
  }

  const criticalCount = items.filter((i) => i.level === "CRITICAL").length
  const warningCount = items.filter((i) => i.level === "WARNING").length
  const totalOutliers = items.length

  let summary: string
  if (totalOutliers === 0) {
    summary = "Tidak terdeteksi outlier. Semua score dalam batas wajar."
  } else if (criticalCount === 0) {
    summary = `Terdeteksi ${totalOutliers} outlier ringan (${warningCount} warning). Masih dalam batas toleransi.`
  } else {
    summary = `Terdeteksi ${totalOutliers} outlier (${criticalCount} critical, ${warningCount} warning). Perlu investigasi lebih lanjut.`
  }

  return { items, totalOutliers, criticalCount, warningCount, summary }
}

/**
 * Menghasilkan markdown outlier report.
 */
export function generateOutlierMarkdown(result: OutlierResult): string {
  const lines: string[] = []
  lines.push("## Outlier Detection")
  lines.push("")
  lines.push(`**Total Outlier:** ${result.totalOutliers}`)
  lines.push(`**Critical:** ${result.criticalCount} | **Warning:** ${result.warningCount}`)
  lines.push("")
  lines.push(`**Ringkasan:** ${result.summary}`)
  lines.push("")

  if (result.items.length > 0) {
    lines.push("### Daftar Outlier")
    lines.push("")
    lines.push("| Level | Skenario | Metrik | Nilai | Ekspektasi | Alasan |")
    lines.push("|-------|----------|--------|-------|------------|--------|")
    for (const item of result.items) {
      const emoji = item.level === "CRITICAL" ? "🔴" : "🟡"
      lines.push(`| ${emoji} ${item.level} | ${item.scenarioName} | ${item.metric} | ${item.value} | ${item.expected} | ${item.reason} |`)
    }
    lines.push("")
  }

  return lines.join("\n")
}

// HELPERS

function avg(values: number[]): number {
  return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0
}

function stdDev(values: number[], mean: number): number {
  if (values.length < 2) return 0
  const squaredDiffs = values.map((v) => (v - mean) ** 2)
  return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / (values.length - 1))
}
