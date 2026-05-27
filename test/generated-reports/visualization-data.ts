

import { EvaluationReport, EvaluationResult } from "@test/types";
import { calculateCategoryStats } from "@test/statistics/statistical-summary";

// TIPE DATA VISUALISASI

export interface BarChartData {
  /** Label untuk sumbu X */
  labels: string[];
  /** Dataset untuk digambarkan */
  datasets: {
    /** Nama dataset */
    label: string;
    /** Nilai untuk sumbu Y */
    data: number[];
    /** Warna (opsional, untuk frontend) */
    backgroundColor?: string[];
  }[];
}

export interface PieChartData {
  /** Label setiap segmen */
  labels: string[];
  /** Nilai setiap segmen */
  data: number[];
  /** Warna setiap segmen */
  backgroundColor: string[];
}

export interface ScoreDistribution {
  /** Rentang skor */
  range: string;
  /** Jumlah skenario dalam rentang */
  count: number;
  /** Persentase */
  percentage: string;
}

export interface VisualizationPackage {
  /** Data untuk diagram batang skor per skenario */
  barChartPerScenario: BarChartData;
  /** Data untuk diagram batang rata-rata per kategori */
  barChartPerCategory: BarChartData;
  /** Data untuk diagram batang per dimensi */
  barChartPerDimension: BarChartData;
  /** Data untuk diagram pie distribusi verdict */
  pieChartVerdict: PieChartData;
  /** Data distribusi skor */
  scoreDistribution: ScoreDistribution[];
  /** Data untuk diagram batang perbandingan RAG vs Non-RAG (placeholder) */
  ragComparison?: BarChartData;
  /** Metadata */
  metadata: {
    totalScenarios: number;
    averageScore: number;
    date: string;
  };
}

// WARNA UNTUK VISUALISASI

const COLORS = {
  blue: "#3B82F6",
  green: "#10B981",
  yellow: "#F59E0B",
  red: "#EF4444",
  purple: "#8B5CF6",
  pink: "#EC4899",
  indigo: "#6366F1",
  teal: "#14B8A6",
  orange: "#F97316",
  cyan: "#06B6D4",
  gray: "#6B7280",
  darkGray: "#374151",
};

const CATEGORY_COLORS: Record<string, string> = {
  overthinking: COLORS.blue,
  anxiety: COLORS.red,
  relationship: COLORS.pink,
  insecure: COLORS.purple,
  keluarga: COLORS.orange,
  motivation: COLORS.yellow,
  stress: COLORS.teal,
  loneliness: COLORS.indigo,
  burnout: COLORS.cyan,
  self_doubt: COLORS.gray,
};

// GENERATE DATA DIAGRAM BATANG

/**
 * Menghasilkan data untuk diagram batang skor per skenario.
 *
 * @param results - Hasil evaluasi
 * @returns BarChartData
 */
export function barChartPerScenario(results: EvaluationResult[]): BarChartData {
  return {
    labels: results.map((r) => r.scenarioName),
    datasets: [
      {
        label: "Skor Keseluruhan",
        data: results.map((r) => r.overallScore),
        backgroundColor: results.map(
          (r) => CATEGORY_COLORS[extractCategory(r.scenarioId)] || COLORS.blue,
        ),
      },
    ],
  };
}

/**
 * Menghasilkan data untuk diagram batang rata-rata per kategori.
 *
 * @param results - Hasil evaluasi
 * @returns BarChartData
 */
export function barChartPerCategory(results: EvaluationResult[]): BarChartData {
  const catStats = calculateCategoryStats(results);

  return {
    labels: catStats.map((c) => c.category),
    datasets: [
      {
        label: "Rata-rata Skor",
        data: catStats.map((c) => c.averageScore),
        backgroundColor: catStats.map(
          (c) => CATEGORY_COLORS[c.category] || COLORS.blue,
        ),
      },
    ],
  };
}

/**
 * Menghasilkan data untuk diagram batang per dimensi evaluasi.
 *
 * @param report - Laporan evaluasi
 * @returns BarChartData
 */
export function barChartPerDimension(report: EvaluationReport): BarChartData {
  const cat = report.aggregateStats.categoryAverages;

  return {
    labels: ["Similarity", "Relevance", "Empathy", "Consistency", "Retrieval"],
    datasets: [
      {
        label: "Rata-rata Skor",
        data: [
          cat.similarity,
          cat.relevance,
          cat.empathy,
          cat.contextualConsistency,
          cat.retrievalAccuracy,
        ],
        backgroundColor: [
          COLORS.blue,
          COLORS.green,
          COLORS.purple,
          COLORS.yellow,
          COLORS.red,
        ],
      },
    ],
  };
}

// GENERATE DATA DIAGRAM PIE

/**
 * Menghasilkan data untuk diagram pie distribusi verdict.
 *
 * @param results - Hasil evaluasi
 * @returns PieChartData
 */
export function pieChartVerdictDistribution(
  results: EvaluationResult[],
): PieChartData {
  const verdictCount: Record<string, number> = {};
  const verdictColors: Record<string, string> = {
    SANGAT_BAIK: COLORS.green,
    BAIK: COLORS.blue,
    CUKUP: COLORS.yellow,
    KURANG: COLORS.orange,
    TIDAK_MEMADAI: COLORS.red,
  };

  for (const r of results) {
    const v = getOverallVerdict(r.overallScore);
    verdictCount[v] = (verdictCount[v] || 0) + 1;
  }

  const sortedVerdicts = [
    "SANGAT_BAIK",
    "BAIK",
    "CUKUP",
    "KURANG",
    "TIDAK_MEMADAI",
  ];

  return {
    labels: sortedVerdicts.filter((v) => verdictCount[v]),
    data: sortedVerdicts
      .filter((v) => verdictCount[v])
      .map((v) => verdictCount[v]),
    backgroundColor: sortedVerdicts
      .filter((v) => verdictCount[v])
      .map((v) => verdictColors[v] || COLORS.gray),
  };
}

/**
 * Mendapatkan verdict dari overall score.
 */
function getOverallVerdict(score: number): string {
  if (score >= 85) return "SANGAT_BAIK";
  if (score >= 70) return "BAIK";
  if (score >= 55) return "CUKUP";
  if (score >= 40) return "KURANG";
  return "TIDAK_MEMADAI";
}

// DISTRIBUSI SKOR

/**
 * Menghasilkan distribusi skor dalam rentang.
 *
 * @param results - Hasil evaluasi
 * @returns Array ScoreDistribution
 */
export function calculateScoreDistribution(
  results: EvaluationResult[],
): ScoreDistribution[] {
  const ranges = [
    { label: "0â€“39 (Tidak Memadai)", min: 0, max: 39 },
    { label: "40â€“54 (Kurang)", min: 40, max: 54 },
    { label: "55â€“69 (Cukup)", min: 55, max: 69 },
    { label: "70â€“84 (Baik)", min: 70, max: 84 },
    { label: "85â€“100 (Sangat Baik)", min: 85, max: 100 },
  ];

  const total = results.length;

  return ranges.map((range) => {
    const count = results.filter(
      (r) => r.overallScore >= range.min && r.overallScore <= range.max,
    ).length;
    return {
      range: range.label,
      count,
      percentage: ((count / total) * 100).toFixed(1) + "%",
    };
  });
}

// EKSTRAK KATEGORI

/**
 * Mengekstrak kategori dari ID skenario.
 */
function extractCategory(scenarioId: string): string {
  const parts = scenarioId.split("_");
  return parts.length > 1 ? parts.slice(0, -1).join("_") : scenarioId;
}

// MAIN GENERATOR

/**
 * Menghasilkan semua data visualisasi dari laporan evaluasi.
 *
 * @param report - Laporan evaluasi
 * @returns VisualizationPackage
 */
export function generateVisualizationData(
  report: EvaluationReport,
): VisualizationPackage {
  return {
    barChartPerScenario: barChartPerScenario(report.results),
    barChartPerCategory: barChartPerCategory(report.results),
    barChartPerDimension: barChartPerDimension(report),
    pieChartVerdict: pieChartVerdictDistribution(report.results),
    scoreDistribution: calculateScoreDistribution(report.results),
    metadata: {
      totalScenarios: report.results.length,
      averageScore: report.aggregateStats.averageOverallScore,
      date: report.createdAt,
    },
  };
}

// GENERATE MARKDOWN TABEL (UNTUK DOKUMENTASI)

/**
 * Menghasilkan tabel distribusi skor dalam markdown.
 *
 * @param results - Hasil evaluasi
 * @returns String markdown
 */
export function generateScoreDistributionTable(
  results: EvaluationResult[],
): string {
  const distribution = calculateScoreDistribution(results);

  const lines: string[] = [];
  lines.push(`### Distribusi Skor`);
  lines.push(``);
  lines.push(`| Rentang Skor | Jumlah | Persentase |`);
  lines.push(`|-------------|--------|------------|`);
  for (const d of distribution) {
    lines.push(`| ${d.range} | ${d.count} | ${d.percentage} |`);
  }
  lines.push(``);

  return lines.join("\n");
}

/**
 * Menghasilkan JSON string dari data visualisasi.
 *
 * @param data - VisualizationPackage
 * @returns String JSON
 */
export function visualizeToJson(data: VisualizationPackage): string {
  return JSON.stringify(data, null, 2);
}
