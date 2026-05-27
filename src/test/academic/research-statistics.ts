import {
  EvaluationSession,
  EvaluationResult,
  MultiTurnSummary,
  RealComparisonSummary,
  TestScenario,
  QualityLabel,
} from "@/test/types"

// ================================================================
// TIPE DATA STATISTIK
// ================================================================

export interface ResearchStats {
  totalScenarios: number
  successRate: number
  failureRate: number
  averageScores: {
    similarity: number
    empathy: number
    relevance: number
    retrieval: number
    overall: number
    responseTimeMs: number
  }
  distribution: Record<QualityLabel, number>
  categoryBreakdown: CategoryStats[]
  bestCategory: string
  worstCategory: string
}

export interface CategoryStats {
  category: string
  count: number
  avgSimilarity: number
  avgEmpathy: number
  avgRelevance: number
  avgRetrieval: number
  avgOverall: number
  distribution: Record<QualityLabel, number>
}

// ================================================================
// HITUNG STATISTIK
// ================================================================

export function calculateResearchStats(
  session: EvaluationSession,
  scenarios: TestScenario[]
): ResearchStats {
  const s = session.summary
  const total = s.totalScenarios

  const good = (s.labelDistribution.GOOD || 0) + (s.labelDistribution.ACCEPTABLE || 0)
  const totalLabeled = Object.values(s.labelDistribution).reduce((a, b) => a + b, 0)
  const successRate = totalLabeled > 0 ? Math.round((good / totalLabeled) * 100) : 0
  const failureRate = 100 - successRate

  const overall = Math.round(
    (s.averageSimilarity + s.averageEmpathy + s.averageRelevance + s.averageRetrieval) / 4
  )

  // Per-kategori
  const catMap = new Map<string, TestScenario[]>()
  for (const sc of scenarios) {
    const arr = catMap.get(sc.category) || []
    arr.push(sc)
    catMap.set(sc.category, arr)
  }

  const categoryBreakdown: CategoryStats[] = []
  let bestScore = -1
  let worstScore = 101
  let bestCategory = ""
  let worstCategory = ""

  for (const [cat, scens] of catMap) {
    const ids = new Set(scens.map((s) => s.id))
    const entries = session.entries.filter((e) => ids.has(e.scenarioId))
    const count = entries.length
    const avgSim = count > 0 ? Math.round(entries.reduce((a, e) => a + e.similarityScore, 0) / count) : 0
    const avgEmp = count > 0 ? Math.round(entries.reduce((a, e) => a + e.empathyScore, 0) / count) : 0
    const avgRel = count > 0 ? Math.round(entries.reduce((a, e) => a + e.relevanceScore, 0) / count) : 0
    const avgRet = count > 0 ? Math.round(entries.reduce((a, e) => a + e.retrievalScore, 0) / count) : 0
    const avgOvr = Math.round((avgSim + avgEmp + avgRel + avgRet) / 4)

    const dist: Record<QualityLabel, number> = { GOOD: 0, ACCEPTABLE: 0, WEAK: 0, FAILED: 0 }
    for (const e of entries) {
      dist[e.qualityLabel] = (dist[e.qualityLabel] || 0) + 1
    }

    categoryBreakdown.push({
      category: cat,
      count,
      avgSimilarity: avgSim,
      avgEmpathy: avgEmp,
      avgRelevance: avgRel,
      avgRetrieval: avgRet,
      avgOverall: avgOvr,
      distribution: dist,
    })

    if (avgOvr > bestScore) { bestScore = avgOvr; bestCategory = cat }
    if (avgOvr < worstScore) { worstScore = avgOvr; worstCategory = cat }
  }

  return {
    totalScenarios: total,
    successRate,
    failureRate,
    averageScores: {
      similarity: s.averageSimilarity,
      empathy: s.averageEmpathy,
      relevance: s.averageRelevance,
      retrieval: s.averageRetrieval,
      overall,
      responseTimeMs: s.averageResponseTimeMs,
    },
    distribution: s.labelDistribution,
    categoryBreakdown,
    bestCategory,
    worstCategory,
  }
}

// ================================================================
// TABEL MARKDOWN
// ================================================================

export function generateStatsTable(stats: ResearchStats): string {
  const lines: string[] = []
  lines.push("### Statistik Penelitian")
  lines.push("")
  lines.push("| Metrik | Nilai |")
  lines.push("|--------|-------|")
  lines.push(`| Total Skenario | ${stats.totalScenarios} |`)
  lines.push(`| Success Rate | ${stats.successRate}% |`)
  lines.push(`| Failure Rate | ${stats.failureRate}% |`)
  lines.push(`| Rata-rata Similarity | ${stats.averageScores.similarity}/100 |`)
  lines.push(`| Rata-rata Empati | ${stats.averageScores.empathy}/100 |`)
  lines.push(`| Rata-rata Relevansi | ${stats.averageScores.relevance}/100 |`)
  lines.push(`| Rata-rata Retrieval | ${stats.averageScores.retrieval}/100 |`)
  lines.push(`| Rata-rata Keseluruhan | ${stats.averageScores.overall}/100 |`)
  lines.push(`| Waktu Respon Rata-rata | ${stats.averageScores.responseTimeMs} ms |`)
  lines.push(`| Kategori Terbaik | ${stats.bestCategory} (${stats.categoryBreakdown.find(c => c.category === stats.bestCategory)?.avgOverall || 0}/100) |`)
  lines.push(`| Kategori Terendah | ${stats.worstCategory} (${stats.categoryBreakdown.find(c => c.category === stats.worstCategory)?.avgOverall || 0}/100) |`)
  lines.push("")
  return lines.join("\n")
}

export function generateDistributionTable(dist: Record<QualityLabel, number>): string {
  const total = Object.values(dist).reduce((a, b) => a + b, 0)
  const lines: string[] = []
  lines.push("| Label | Jumlah | Persentase |")
  lines.push("|-------|--------|------------|")
  const labels: QualityLabel[] = ["GOOD", "ACCEPTABLE", "WEAK", "FAILED"]
  for (const label of labels) {
    const val = dist[label] || 0
    const pct = total > 0 ? ((val / total) * 100).toFixed(1) : "0.0"
    lines.push(`| ${label} | ${val} | ${pct}% |`)
  }
  lines.push("")
  return lines.join("\n")
}

export function generateCategoryBreakdownTable(categories: CategoryStats[]): string {
  const lines: string[] = []
  lines.push("| Kategori | Jumlah | Similarity | Empati | Relevansi | Retrieval | Rata-rata |")
  lines.push("|----------|--------|------------|--------|-----------|-----------|-----------|")
  for (const c of categories) {
    lines.push(`| ${c.category} | ${c.count} | ${c.avgSimilarity} | ${c.avgEmpathy} | ${c.avgRelevance} | ${c.avgRetrieval} | ${c.avgOverall} |`)
  }
  lines.push("")
  return lines.join("\n")
}

// ================================================================
// SUMMARY JSON
// ================================================================

export function generateStatsJSON(stats: ResearchStats): string {
  return JSON.stringify(stats, null, 2)
}

// ================================================================
// CSV EXPORT
// ================================================================

export function generateStatsCSV(stats: ResearchStats): string {
  const rows: string[] = []
  rows.push("metrik,nilai")
  rows.push(`total_scenarios,${stats.totalScenarios}`)
  rows.push(`success_rate,${stats.successRate}`)
  rows.push(`failure_rate,${stats.failureRate}`)
  rows.push(`avg_similarity,${stats.averageScores.similarity}`)
  rows.push(`avg_empathy,${stats.averageScores.empathy}`)
  rows.push(`avg_relevance,${stats.averageScores.relevance}`)
  rows.push(`avg_retrieval,${stats.averageScores.retrieval}`)
  rows.push(`avg_overall,${stats.averageScores.overall}`)
  rows.push(`avg_response_time_ms,${stats.averageScores.responseTimeMs}`)
  rows.push(`best_category,${stats.bestCategory}`)
  rows.push(`worst_category,${stats.worstCategory}`)
  rows.push("")
  rows.push("kategori,jumlah,similarity,empati,relevansi,retrieval,rata_rata")
  for (const c of stats.categoryBreakdown) {
    rows.push(`${c.category},${c.count},${c.avgSimilarity},${c.avgEmpathy},${c.avgRelevance},${c.avgRetrieval},${c.avgOverall}`)
  }
  return rows.join("\n")
}
