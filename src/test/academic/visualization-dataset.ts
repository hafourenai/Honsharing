/**
 * VISUALIZATION DATASET GENERATOR — DATA UNTUK VISUALISASI
 *
 * Menghasilkan data untuk visualisasi yang dapat digunakan
 * dengan tools seperti Excel, Google Sheets, atau chart library.
 *
 * OUTPUT:
 * - CSV untuk bar chart, pie chart, score distribution
 * - JSON untuk integrasi dengan frontend chart
 * - Markdown table untuk skripsi
 *
 * @author  Tim Skripsi
 * @version 1.0
 */

import { EvaluationSession, TestScenario, MultiTurnSummary } from "@/test/types"
import { ResearchStats, CategoryStats } from "./research-statistics"

// TIPE DATA VISUALISASI

export interface VisualizationDataset {
  /** Data untuk bar chart (skor per dimensi) */
  barChart: BarChartData
  /** Data untuk pie chart (distribusi label) */
  pieChart: PieChartData
  /** Data untuk score distribution */
  scoreDistribution: ScoreDistributionData
  /** Data perbandingan per kategori */
  categoryComparison: CategoryComparisonData
  /** Data perbandingan RAG vs Non-RAG (opsional) */
  ragComparison: RAGComparisonData | null
  /** Data multi-turn (opsional) */
  multiTurnData: MultiTurnChartData | null
}

export interface BarChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string
  }>
}

export interface PieChartData {
  labels: string[]
  data: number[]
  backgroundColor: string[]
}

export interface ScoreDistributionData {
  /** Rentang skor */
  ranges: string[]
  /** Jumlah skenario per rentang */
  counts: number[]
}

export interface CategoryComparisonData {
  categories: string[]
  similarity: number[]
  empathy: number[]
  relevance: number[]
  retrieval: number[]
  overall: number[]
}

export interface RAGComparisonData {
  categories: string[]
  nonRag: number[]
  rag: number[]
  improvement: number[]
}

export interface MultiTurnChartData {
  conversations: string[]
  memoryConsistency: number[]
  emotionalContinuity: number[]
  contextRetention: number[]
  topicTracking: number[]
  overall: number[]
}

// GENERATE VISUALIZATION DATASET

export function generateVisualizationDataset(
  session: EvaluationSession,
  stats: ResearchStats,
  multiTurnSummary?: MultiTurnSummary,
  ragComparison?: { nonRagAvg: number; ragAvg: number }
): VisualizationDataset {
  const s = session.summary

  // Bar chart — skor per dimensi
  const barChart: BarChartData = {
    labels: ["Similarity", "Empati", "Relevansi", "Retrieval"],
    datasets: [
      {
        label: "Rata-rata Skor",
        data: [s.averageSimilarity, s.averageEmpathy, s.averageRelevance, s.averageRetrieval],
      },
    ],
  }

  // Pie chart — distribusi label
  const labelColors: Record<string, string> = {
    GOOD: "#4CAF50",
    ACCEPTABLE: "#8BC34A",
    WEAK: "#FFC107",
    FAILED: "#F44336",
  }
  const pieChart: PieChartData = {
    labels: Object.keys(s.labelDistribution),
    data: Object.values(s.labelDistribution),
    backgroundColor: Object.keys(s.labelDistribution).map(
      (k) => labelColors[k] || "#9E9E9E"
    ),
  }

  // Score distribution
  const ranges = ["0-20", "21-40", "41-60", "61-80", "81-100"]
  const counts = [0, 0, 0, 0, 0]
  for (const entry of session.entries) {
    const avg = (entry.similarityScore + entry.empathyScore + entry.relevanceScore + entry.retrievalScore) / 4
    if (avg <= 20) counts[0]++
    else if (avg <= 40) counts[1]++
    else if (avg <= 60) counts[2]++
    else if (avg <= 80) counts[3]++
    else counts[4]++
  }
  const scoreDistribution: ScoreDistributionData = { ranges, counts }

  // Category comparison
  const categories = stats.categoryBreakdown.map((c) => c.category)
  const categoryComparison: CategoryComparisonData = {
    categories,
    similarity: stats.categoryBreakdown.map((c) => c.avgSimilarity),
    empathy: stats.categoryBreakdown.map((c) => c.avgEmpathy),
    relevance: stats.categoryBreakdown.map((c) => c.avgRelevance),
    retrieval: stats.categoryBreakdown.map((c) => c.avgRetrieval),
    overall: stats.categoryBreakdown.map((c) => c.avgOverall),
  }

  // RAG comparison
  let ragComparisonData: RAGComparisonData | null = null
  if (ragComparison) {
    ragComparisonData = {
      categories: categories,
      nonRag: categories.map(() => ragComparison.nonRagAvg),
      rag: categories.map(() => ragComparison.ragAvg),
      improvement: categories.map(() => ragComparison.ragAvg - ragComparison.nonRagAvg),
    }
  }

  // Multi-turn
  let multiTurnData: MultiTurnChartData | null = null
  if (multiTurnSummary) {
    multiTurnData = {
      conversations: multiTurnSummary.details.map((d) => d.scenarioName),
      memoryConsistency: multiTurnSummary.details.map((d) => d.memoryConsistency),
      emotionalContinuity: multiTurnSummary.details.map((d) => d.emotionalContinuity),
      contextRetention: multiTurnSummary.details.map((d) => d.contextRetention),
      topicTracking: multiTurnSummary.details.map((d) => d.topicTracking),
      overall: multiTurnSummary.details.map((d) => d.overallScore),
    }
  }

  return {
    barChart,
    pieChart,
    scoreDistribution,
    categoryComparison,
    ragComparison: ragComparisonData,
    multiTurnData,
  }
}

// EXPORT CSV

export function generateBarChartCSV(data: BarChartData): string {
  const rows: string[] = []
  rows.push(`dimensi,${data.datasets.map((d) => d.label).join(",")}`)
  for (let i = 0; i < data.labels.length; i++) {
    const vals = data.datasets.map((d) => d.data[i]).join(",")
    rows.push(`${data.labels[i]},${vals}`)
  }
  return rows.join("\n")
}

export function generatePieChartCSV(data: PieChartData): string {
  const rows: string[] = []
  rows.push("label,jumlah")
  for (let i = 0; i < data.labels.length; i++) {
    rows.push(`${data.labels[i]},${data.data[i]}`)
  }
  return rows.join("\n")
}

export function generateScoreDistributionCSV(data: ScoreDistributionData): string {
  const rows: string[] = []
  rows.push("rentang,jumlah")
  for (let i = 0; i < data.ranges.length; i++) {
    rows.push(`${data.ranges[i]},${data.counts[i]}`)
  }
  return rows.join("\n")
}

export function generateCategoryComparisonCSV(data: CategoryComparisonData): string {
  const rows: string[] = []
  rows.push("kategori,similarity,empati,relevansi,retrieval,rata_rata")
  for (let i = 0; i < data.categories.length; i++) {
    rows.push(
      `${data.categories[i]},${data.similarity[i]},${data.empathy[i]},` +
      `${data.relevance[i]},${data.retrieval[i]},${data.overall[i]}`
    )
  }
  return rows.join("\n")
}

export function generateRAGComparisonCSV(data: RAGComparisonData): string {
  const rows: string[] = []
  rows.push("kategori,non_rag,rag,peningkatan")
  for (let i = 0; i < data.categories.length; i++) {
    rows.push(`${data.categories[i]},${data.nonRag[i]},${data.rag[i]},${data.improvement[i]}`)
  }
  return rows.join("\n")
}

export function generateMultiTurnCSV(data: MultiTurnChartData): string {
  const rows: string[] = []
  rows.push("percakapan,memory_consistency,emotional_continuity,context_retention,topic_tracking,overall")
  for (let i = 0; i < data.conversations.length; i++) {
    rows.push(
      `${data.conversations[i]},${data.memoryConsistency[i]},${data.emotionalContinuity[i]},` +
      `${data.contextRetention[i]},${data.topicTracking[i]},${data.overall[i]}`
    )
  }
  return rows.join("\n")
}

// EXPORT JSON

export function generateVisualizationJSON(data: VisualizationDataset): string {
  return JSON.stringify(data, null, 2)
}

// EXPORT MARKDOWN TABLE

export function generateScoreDistributionTable(data: ScoreDistributionData): string {
  const lines: string[] = []
  lines.push("| Rentang Skor | Jumlah Skenario |")
  lines.push("|--------------|-----------------|")
  for (let i = 0; i < data.ranges.length; i++) {
    const bar = "█".repeat(data.counts[i])
    lines.push(`| ${data.ranges[i]} | ${data.counts[i]} ${bar} |`)
  }
  lines.push("")
  return lines.join("\n")
}
