/**
  * EVALUATION SUMMARY DASHBOARD — DATA RINGKASAN EVALUASI
  *
 * Menghasilkan data ringkasan untuk dashboard evaluasi.
 * Output dalam format JSON dan Markdown.
 *
 * @author  Tim Skripsi
 * @version 1.0
  */

import { EvaluationSession } from "@/test/types"
import { ResearchStats, CategoryStats } from "./research-statistics"

// TIPE DATA

export interface SummaryDashboard {
  /** Informasi sesi */
  session: {
    id: string
    mode: string
    date: string
    duration: string
  }
  /** Metrik utama */
  metrics: {
    totalScenarios: number
    successCount: number
    weakCount: number
    failedCount: number
    successRate: number
    failureRate: number
    averageScore: number
    bestScore: number
    worstScore: number
    averageResponseTimeMs: number
  }
  /** Kategori */
  categories: {
    best: string
    worst: string
    totalCategories: number
  }
  /** Peringkat kategori */
  categoryRankings: CategoryRanking[]
}

export interface CategoryRanking {
  rank: number
  category: string
  averageScore: number
  status: "Sangat Baik" | "Baik" | "Cukup" | "Kurang"
}

// GENERATE DASHBOARD

/**
 * Menghasilkan data dashboard dari sesi evaluasi dan statistik.
 */
export function generateSummaryDashboard(
  session: EvaluationSession,
  stats: ResearchStats
): SummaryDashboard {
  const s = session.summary
  const successCount = (s.labelDistribution.GOOD || 0) + (s.labelDistribution.ACCEPTABLE || 0)
  const weakCount = s.labelDistribution.WEAK || 0
  const failedCount = s.labelDistribution.FAILED || 0
  const totalLabeled = Object.values(s.labelDistribution).reduce((a, b) => a + b, 0)

  // Cari skor terbaik dan terendah dari entries
  const scores = session.entries.map((e) =>
    Math.round((e.similarityScore + e.empathyScore + e.relevanceScore + e.retrievalScore) / 4)
  )
  const bestScore = scores.length > 0 ? Math.max(...scores) : 0
  const worstScore = scores.length > 0 ? Math.min(...scores) : 0

  // Hitung rata-rata keseluruhan
  const avgScore = Math.round(
    (s.averageSimilarity + s.averageEmpathy + s.averageRelevance + s.averageRetrieval) / 4
  )

  // Peringkat kategori
  const sorted = [...stats.categoryBreakdown].sort((a, b) => b.avgOverall - a.avgOverall)
  const categoryRankings: CategoryRanking[] = sorted.map((c, i) => ({
    rank: i + 1,
    category: c.category,
    averageScore: c.avgOverall,
    status: c.avgOverall >= 80 ? "Sangat Baik" : c.avgOverall >= 65 ? "Baik" : c.avgOverall >= 50 ? "Cukup" : "Kurang",
  }))

  return {
    session: {
      id: session.evaluationId,
      mode: session.mode,
      date: session.date,
      duration: `${s.averageResponseTimeMs} ms rata-rata per respons`,
    },
    metrics: {
      totalScenarios: s.totalScenarios,
      successCount,
      weakCount,
      failedCount,
      successRate: totalLabeled > 0 ? Math.round((successCount / totalLabeled) * 100) : 0,
      failureRate: totalLabeled > 0 ? Math.round(((weakCount + failedCount) / totalLabeled) * 100) : 0,
      averageScore: avgScore,
      bestScore,
      worstScore,
      averageResponseTimeMs: s.averageResponseTimeMs,
    },
    categories: {
      best: stats.bestCategory,
      worst: stats.worstCategory,
      totalCategories: stats.categoryBreakdown.length,
    },
    categoryRankings,
  }
}

// OUTPUT FORMATS

export function generateDashboardJSON(dashboard: SummaryDashboard): string {
  return JSON.stringify(dashboard, null, 2)
}

export function generateDashboardMarkdown(dashboard: SummaryDashboard): string {
  const m = dashboard.metrics
  const lines: string[] = []

  lines.push("# Dashboard Evaluasi Sistem")
  lines.push("")
  lines.push(`**Sesi:** ${dashboard.session.id}  `)
  lines.push(`**Mode:** ${dashboard.session.mode}  `)
  lines.push(`**Tanggal:** ${dashboard.session.date}  `)
  lines.push("")
  lines.push("## Metrik Utama")
  lines.push("")
  lines.push("| Metrik | Nilai |")
  lines.push("|--------|-------|")
  lines.push(`| Total Skenario | ${m.totalScenarios} |`)
  lines.push(`| Success Count | ${m.successCount} |`)
  lines.push(`| Weak Count | ${m.weakCount} |`)
  lines.push(`| Failed Count | ${m.failedCount} |`)
  lines.push(`| Success Rate | ${m.successRate}% |`)
  lines.push(`| Failure Rate | ${m.failureRate}% |`)
  lines.push(`| Rata-rata Skor | ${m.averageScore}/100 |`)
  lines.push(`| Skor Tertinggi | ${m.bestScore}/100 |`)
  lines.push(`| Skor Terendah | ${m.worstScore}/100 |`)
  lines.push(`| Waktu Respon Rata-rata | ${m.averageResponseTimeMs} ms |`)
  lines.push("")
  lines.push("## Peringkat Kategori")
  lines.push("")
  lines.push("| Peringkat | Kategori | Rata-rata Skor | Status |")
  lines.push("|-----------|----------|----------------|--------|")
  for (const r of dashboard.categoryRankings) {
    lines.push(`| ${r.rank} | ${r.category} | ${r.averageScore}/100 | ${r.status} |`)
  }
  lines.push("")
  lines.push(`**Kategori Terbaik:** ${dashboard.categories.best}  `)
  lines.push(`**Kategori Terendah:** ${dashboard.categories.worst}  `)
  lines.push("")

  return lines.join("\n")
}

export function generateDashboardCSV(dashboard: SummaryDashboard): string {
  const rows: string[] = []
  rows.push("metrik,nilai")
  rows.push(`session_id,${dashboard.session.id}`)
  rows.push(`mode,${dashboard.session.mode}`)
  rows.push(`date,${dashboard.session.date}`)
  rows.push(`total_scenarios,${dashboard.metrics.totalScenarios}`)
  rows.push(`success_count,${dashboard.metrics.successCount}`)
  rows.push(`weak_count,${dashboard.metrics.weakCount}`)
  rows.push(`failed_count,${dashboard.metrics.failedCount}`)
  rows.push(`success_rate,${dashboard.metrics.successRate}`)
  rows.push(`failure_rate,${dashboard.metrics.failureRate}`)
  rows.push(`average_score,${dashboard.metrics.averageScore}`)
  rows.push(`best_score,${dashboard.metrics.bestScore}`)
  rows.push(`worst_score,${dashboard.metrics.worstScore}`)
  rows.push(`best_category,${dashboard.categories.best}`)
  rows.push(`worst_category,${dashboard.categories.worst}`)
  return rows.join("\n")
}
