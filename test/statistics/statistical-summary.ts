

import {
  EvaluationReport,
  AggregateStats,
  EvaluationResult,
} from "@test/types";
import { getVerdict, Verdict } from "@test/types/utils/scoring";
import { standardDeviation } from "@test/types/utils/scoring";

// STATISTIK DASAR

export interface BasicStats {
  mean: number;
  median: number;
  highest: number;
  lowest: number;
  stdDev: number;
  total: number;
}

/**
 * Menghitung statistik dasar dari array angka.
 *
 * @param values - Array angka
 * @returns BasicStats
 */
export function calculateBasicStats(values: number[]): BasicStats {
  if (values.length === 0) {
    return { mean: 0, median: 0, highest: 0, lowest: 0, stdDev: 0, total: 0 };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const median =
    sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];

  return {
    mean: Math.round(mean * 100) / 100,
    median: Math.round(median * 100) / 100,
    highest: Math.max(...values),
    lowest: Math.min(...values),
    stdDev: standardDeviation(values),
    total: values.length,
  };
}

// DISTRIBUSI PER KATEGORI

export interface CategoryStats {
  category: string;
  count: number;
  averageScore: number;
  highest: number;
  lowest: number;
  averageSimilarity: number;
  averageRelevance: number;
  averageEmpathy: number;
  averageConsistency: number;
  averageRetrieval: number;
}

/**
 * Menghitung statistik per kategori emosional.
 *
 * @param results - Hasil evaluasi
 * @returns Array CategoryStats
 */
export function calculateCategoryStats(
  results: EvaluationResult[],
): CategoryStats[] {
  const grouped: Record<string, EvaluationResult[]> = {};

  for (const r of results) {
    // Ekstrak kategori dari scenarioId atau notes
    const category = extractCategory(r.scenarioId);
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(r);
  }

  return Object.entries(grouped)
    .map(([category, items]) => {
      const scores = items.map((i) => i.overallScore);
      const stats = calculateBasicStats(scores);

      return {
        category,
        count: items.length,
        averageScore: Math.round(stats.mean),
        highest: stats.highest,
        lowest: stats.lowest,
        averageSimilarity: Math.round(
          items.reduce((s, i) => s + i.similarity.finalScore, 0) / items.length,
        ),
        averageRelevance: Math.round(
          items.reduce((s, i) => s + i.relevance.finalScore, 0) / items.length,
        ),
        averageEmpathy: Math.round(
          items.reduce((s, i) => s + i.empathy.finalScore, 0) / items.length,
        ),
        averageConsistency: Math.round(
          items.reduce((s, i) => s + i.contextualConsistency.finalScore, 0) /
            items.length,
        ),
        averageRetrieval: Math.round(
          items.reduce((s, i) => s + i.retrievalAccuracy.finalScore, 0) /
            items.length,
        ),
      };
    })
    .sort((a, b) => b.averageScore - a.averageScore);
}

/**
 * Mengekstrak kategori dari ID skenario.
 * Contoh: "overthinking_001" â†’ "overthinking"
 */
function extractCategory(scenarioId: string): string {
  const parts = scenarioId.split("_");
  return parts.length > 1 ? parts.slice(0, -1).join("_") : scenarioId;
}

// DISTRIBUSI VERDICT

export interface VerdictDistribution {
  verdict: string;
  count: number;
  percentage: string;
}

/**
 * Menghitung distribusi verdict dari hasil evaluasi.
 *
 * @param results - Hasil evaluasi
 * @param dimension - Dimensi yang akan dihitung (default: overall)
 * @returns Array VerdictDistribution
 */
export function calculateVerdictDistribution(
  results: EvaluationResult[],
  dimension:
    | "overall"
    | "similarity"
    | "relevance"
    | "empathy"
    | "consistency"
    | "retrieval" = "overall",
): VerdictDistribution[] {
  const verdictCount: Record<string, number> = {};
  const total = results.length;

  for (const r of results) {
    let v: string;
    switch (dimension) {
      case "similarity":
        v = r.similarity.verdict;
        break;
      case "relevance":
        v = r.relevance.verdict;
        break;
      case "empathy":
        v = r.empathy.verdict;
        break;
      case "consistency":
        v = r.contextualConsistency.verdict;
        break;
      case "retrieval":
        v = r.retrievalAccuracy.verdict;
        break;
      default:
        v = getVerdict(r.overallScore);
    }
    verdictCount[v] = (verdictCount[v] || 0) + 1;
  }

  return Object.entries(verdictCount)
    .map(([verdict, count]) => ({
      verdict,
      count,
      percentage: ((count / total) * 100).toFixed(1) + "%",
    }))
    .sort((a, b) => b.count - a.count);
}

// PERSENTASE KEBERHASILAN

export interface SuccessRate {
  /** Persentase skenario dengan skor >= 70 (BAIK) */
  above70: string;
  /** Persentase skenario dengan skor >= 85 (SANGAT_BAIK) */
  above85: string;
  /** Persentase skenario dengan skor < 55 (KURANG) */
  below55: string;
  /** Rata-rata skor keseluruhan */
  averageScore: number;
  /** Jumlah skenario yang lulus (>= 70) */
  passed: number;
  /** Jumlah total skenario */
  total: number;
}

/**
 * Menghitung persentase keberhasilan sistem.
 *
 * @param results - Hasil evaluasi
 * @returns SuccessRate
 */
export function calculateSuccessRate(results: EvaluationResult[]): SuccessRate {
  const total = results.length;
  const above70 = results.filter((r) => r.overallScore >= 70).length;
  const above85 = results.filter((r) => r.overallScore >= 85).length;
  const below55 = results.filter((r) => r.overallScore < 55).length;
  const avg = results.reduce((s, r) => s + r.overallScore, 0) / total;

  return {
    above70: ((above70 / total) * 100).toFixed(1) + "%",
    above85: ((above85 / total) * 100).toFixed(1) + "%",
    below55: ((below55 / total) * 100).toFixed(1) + "%",
    averageScore: Math.round(avg),
    passed: above70,
    total,
  };
}

// GENERATE MARKDOWN SUMMARY

/**
 * Menghasilkan ringkasan statistik dalam format markdown.
 *
 * @param report - Laporan evaluasi
 * @returns String markdown
 */
export function generateMarkdownSummary(report: EvaluationReport): string {
  const lines: string[] = [];
  const stats = report.aggregateStats;
  const success = calculateSuccessRate(report.results);
  const catStats = calculateCategoryStats(report.results);
  const verdictDist = calculateVerdictDistribution(report.results);

  lines.push(`## Ringkasan Statistik`);
  lines.push(``);
  lines.push(`### Statistik Umum`);
  lines.push(``);
  lines.push(`| Metrik | Nilai |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Jumlah Skenario | ${report.results.length} |`);
  lines.push(`| Rata-rata Skor | ${stats.averageOverallScore}/100 |`);
  lines.push(`| Skor Tertinggi | ${stats.highestScore}/100 |`);
  lines.push(`| Skor Terendah | ${stats.lowestScore}/100 |`);
  lines.push(`| Standar Deviasi | ${stats.standardDeviation} |`);
  lines.push(
    `| Skenario Lulus (>=70) | ${success.passed}/${success.total} (${success.above70}) |`,
  );
  lines.push(`| Skenario Sangat Baik (>=85) | ${success.above85} |`);
  lines.push(`| Skenario Kurang (<55) | ${success.below55} |`);
  lines.push(``);
  lines.push(``);

  // Tabel distribusi verdict
  lines.push(`### Distribusi Verdict`);
  lines.push(``);
  lines.push(`| Verdict | Jumlah | Persentase |`);
  lines.push(`|---------|--------|------------|`);
  for (const v of verdictDist) {
    lines.push(`| ${v.verdict} | ${v.count} | ${v.percentage} |`);
  }
  lines.push(``);
  lines.push(``);

  // Tabel per kategori
  lines.push(`### Statistik per Kategori`);
  lines.push(``);
  lines.push(
    `| Kategori | Jumlah | Rata-rata | Tertinggi | Terendah | Sim | Rel | Emp | Kon | Ret |`,
  );
  lines.push(
    `|----------|--------|-----------|-----------|----------|-----|-----|-----|-----|-----|`,
  );
  for (const c of catStats) {
    lines.push(
      `| ${c.category} | ${c.count} | ${c.averageScore} | ${c.highest} | ${c.lowest} | ${c.averageSimilarity} | ${c.averageRelevance} | ${c.averageEmpathy} | ${c.averageConsistency} | ${c.averageRetrieval} |`,
    );
  }
  lines.push(``);

  return lines.join("\n");
}

// GENERATE JSON SUMMARY

/**
 * Menghasilkan ringkasan statistik dalam format JSON.
 *
 * @param report - Laporan evaluasi
 * @returns Object JSON
 */
export function generateJsonSummary(
  report: EvaluationReport,
): Record<string, unknown> {
  return {
    judul: report.title,
    tanggal: report.createdAt,
    jumlahSkenario: report.results.length,
    statistikUmum: {
      rataRata: report.aggregateStats.averageOverallScore,
      tertinggi: report.aggregateStats.highestScore,
      terendah: report.aggregateStats.lowestScore,
      standarDeviasi: report.aggregateStats.standardDeviation,
      persentaseKeberhasilan: calculateSuccessRate(report.results),
    },
    rataRataPerDimensi: {
      similarity: report.aggregateStats.categoryAverages.similarity,
      relevance: report.aggregateStats.categoryAverages.relevance,
      empathy: report.aggregateStats.categoryAverages.empathy,
      konsistensiKonteks:
        report.aggregateStats.categoryAverages.contextualConsistency,
      akurasiRetrieval:
        report.aggregateStats.categoryAverages.retrievalAccuracy,
    },
    distribusiVerdict: calculateVerdictDistribution(report.results),
    statistikPerKategori: calculateCategoryStats(report.results),
  };
}

// GENERATE CSV

/**
 * Menghasilkan data CSV dari hasil evaluasi.
 * Format siap dibuka di Excel atau diolah di SPSS.
 *
 * @param results - Hasil evaluasi
 * @returns String CSV
 */
export function generateCsv(results: EvaluationResult[]): string {
  const header =
    "ID,Nama,Kategori,Overall,Similarity,Cosine_Similarity,Text_Overlap,Keyword_Match,Relevance,Content_Relevance,Emotional_Relevance,Tone,Empathy,Emotional_Validation,Understanding,Supportiveness,Consistency,Chunk_Consistency,Emotional_Consistency,No_Contradiction,Retrieval,Precision,Recall,Avg_Relevance_Score";

  const rows = results.map((r) => {
    const cat = extractCategory(r.scenarioId);
    return [
      r.scenarioId,
      `"${r.scenarioName}"`,
      cat,
      r.overallScore,
      r.similarity.finalScore,
      r.similarity.cosineSimilarity,
      r.similarity.textOverlap,
      r.similarity.keywordMatch,
      r.relevance.finalScore,
      r.relevance.contentRelevance,
      r.relevance.emotionalRelevance,
      r.relevance.toneAppropriateness,
      r.empathy.finalScore,
      r.empathy.emotionalValidation,
      r.empathy.understanding,
      r.empathy.supportiveness,
      r.contextualConsistency.finalScore,
      r.contextualConsistency.chunkConsistency,
      r.contextualConsistency.emotionalConsistency,
      r.contextualConsistency.noContradiction,
      r.retrievalAccuracy.finalScore,
      r.retrievalAccuracy.precision,
      r.retrievalAccuracy.recall,
      r.retrievalAccuracy.avgRelevanceScore,
    ].join(",");
  });

  return [header, ...rows].join("\n");
}

// STATISTIK AGREGAT (UNTUK REPORT)

/**
 * Menghitung statistik agregat dari hasil evaluasi.
 *
 * @param results - Array hasil evaluasi
 * @returns AggregateStats
 */
export function calculateAggregateStats(
  results: EvaluationResult[],
): AggregateStats {
  if (results.length === 0) {
    return {
      averageOverallScore: 0,
      highestScore: 0,
      lowestScore: 0,
      standardDeviation: 0,
      verdictDistribution: {},
      categoryAverages: {
        similarity: 0,
        relevance: 0,
        empathy: 0,
        contextualConsistency: 0,
        retrievalAccuracy: 0,
      },
    };
  }

  const overallScores = results.map((r) => r.overallScore);
  const averageOverallScore = Math.round(
    overallScores.reduce((s, v) => s + v, 0) / overallScores.length,
  );

  const verdictDistribution: Record<string, number> = {};
  for (const r of results) {
    const v = r.similarity.verdict;
    verdictDistribution[v] = (verdictDistribution[v] || 0) + 1;
  }

  const categoryAverages = {
    similarity: Math.round(
      results.reduce((s, r) => s + r.similarity.finalScore, 0) / results.length,
    ),
    relevance: Math.round(
      results.reduce((s, r) => s + r.relevance.finalScore, 0) / results.length,
    ),
    empathy: Math.round(
      results.reduce((s, r) => s + r.empathy.finalScore, 0) / results.length,
    ),
    contextualConsistency: Math.round(
      results.reduce((s, r) => s + r.contextualConsistency.finalScore, 0) /
        results.length,
    ),
    retrievalAccuracy: Math.round(
      results.reduce((s, r) => s + r.retrievalAccuracy.finalScore, 0) /
        results.length,
    ),
  };

  return {
    averageOverallScore,
    highestScore: Math.max(...overallScores),
    lowestScore: Math.min(...overallScores),
    standardDeviation: standardDeviation(overallScores),
    verdictDistribution,
    categoryAverages,
  };
}
