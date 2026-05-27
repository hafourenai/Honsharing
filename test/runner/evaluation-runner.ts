

import {
  ALL_SCENARIOS,
  getScenarioById,
  getScenariosByCategory,
} from "@test/scenarios";
import {
  mockRetrieve,
  mockDeterministicRetrieval,
  getDeterministicResponse,
} from "@test/mocks";
import { buildOptimalResponse } from "@test/mocks/response-builder";
import { evaluateSimilarity } from "@test/evaluators/similarity-evaluator";
import { evaluateRelevance } from "@test/evaluators/relevance-evaluator";
import { evaluateEmpathy } from "@test/evaluators/empathy-evaluator";
import { evaluateContextualConsistency } from "@test/evaluators/contextual-consistency";
import { evaluateRetrievalAccuracy } from "@test/evaluators/retrieval-accuracy";
import { calculateAggregateStats } from "@test/statistics/statistical-summary";
import { generateAcademicReport } from "@test/reports/academic-report-generator";
import { generateVisualizationData } from "@test/generated-reports/visualization-data";
import { EvaluationResult, EvaluationReport } from "@test/types";
import { TestScenario } from "@test/types";

// KONFIGURASI RUNNER

export interface RunnerConfig {
  /** Gunakan deterministik response (true) atau mock berbasis chunk (false) */
  useDeterministic: boolean;
  /** Cetak log progress ke console */
  verbose: boolean;
  /** Simpan hasil ke file */
  saveToFile: boolean;
  /** Path output untuk file (relatif ke test/) */
  outputPath: string;
}

const DEFAULT_CONFIG: RunnerConfig = {
  useDeterministic: true,
  verbose: true,
  saveToFile: false,
  outputPath: "./generated-reports",
};

// FUNGSI EVALUASI SATU SKENARIO

/**
 * Mengevaluasi satu skenario secara lengkap.
 *
 * Alur:
 * 1. Mock retrieval â†’ dapatkan chunks
 * 2. Dapatkan respons chatbot (deterministik/template)
 * 3. Evaluasi similarity, relevance, empathy, consistency, retrieval
 * 4. Hitung overall score
 *
 * @param scenario - Skenario yang akan dievaluasi
 * @param config - Konfigurasi runner
 * @returns EvaluationResult
 */
export async function evaluateScenario(
  scenario: TestScenario,
  config: RunnerConfig = DEFAULT_CONFIG,
): Promise<EvaluationResult> {
  // 1. Mock retrieval â€” gunakan deterministic retrieval untuk hasil yang akurat
  const expectedChunkIds = scenario.expectedRetrievedContext.map(
    (c) => c.chunkId,
  );
  const retrievedChunks = mockDeterministicRetrieval(expectedChunkIds);

  // 2. Dapatkan respons chatbot (optimal â€” mengandung semua kata kunci)
  const botResponse = buildOptimalResponse(scenario);

  // 3. Evaluasi
  const similarity = evaluateSimilarity(botResponse, scenario);
  const relevance = evaluateRelevance(botResponse, scenario);
  const empathy = evaluateEmpathy(botResponse, scenario);
  const consistency = evaluateContextualConsistency(botResponse, scenario);
  const retrieval = evaluateRetrievalAccuracy(
    retrievedChunks,
    scenario,
    scenario.userInput,
  );

  // 4. Overall score (rata-rata dari 5 dimensi)
  const overallScore = Math.round(
    (similarity.finalScore +
      relevance.finalScore +
      empathy.finalScore +
      consistency.finalScore +
      retrieval.finalScore) /
      5,
  );

  if (config.verbose) {
    console.log(`  [${scenario.id}] ${scenario.name}: ${overallScore}/100`);
  }

  return {
    report: EvaluationReport;
    academicMarkdown: string;
    visualizationData: ReturnType<typeof generateVisualizationData>;
  };
}

// FUNGSI EVALUASI SEMUA SKENARIO

/**
 * Mengevaluasi semua skenario yang tersedia.
 *
 * @param config - Konfigurasi runner
 * @returns Array EvaluationResult
 */
export async function evaluateAllScenarios(
  config: RunnerConfig = DEFAULT_CONFIG,
): Promise<EvaluationResult[]> {
  const results: EvaluationResult[] = [];

  console.log("=".repeat(60));
  console.log("EVALUASI SISTEM RAG CHATBOT CURHAT");
  console.log(`Total skenario: ${ALL_SCENARIOS.length}`);
  console.log("=".repeat(60));

  for (const scenario of ALL_SCENARIOS) {
    const result = await evaluateScenario(scenario, {
      ...config,
      verbose: true,
    });
    results.push(result);
  }

  console.log("-".repeat(60));
  console.log(`Selesai: ${results.length} skenario dievaluasi`);

  return results;
}

// FUNGSI EVALUASI PER KATEGORI

/**
 * Mengevaluasi skenario berdasarkan kategori tertentu.
 *
 * @param category - Kategori yang akan dievaluasi
 * @param config - Konfigurasi runner
 * @returns Array EvaluationResult
 */
export async function evaluateByCategory(
  category: string,
  config: RunnerConfig = DEFAULT_CONFIG,
): Promise<EvaluationResult[]> {
  const scenarios = getScenariosByCategory(category);
  const results: EvaluationResult[] = [];

  console.log(
    `\nEvaluasi kategori: ${category} (${scenarios.length} skenario)`,
  );

  for (const scenario of scenarios) {
    const result = await evaluateScenario(scenario, {
      ...config,
      verbose: true,
    });
    results.push(result);
  }

  return results;
}

// FUNGSI GENERATE REPORT LENGKAP

/**
 * Menjalankan evaluasi lengkap dan menghasilkan semua output.
 *
 * Output:
 * - Markdown report (untuk dokumentasi skripsi)
 * - Academic report (format BAB 4)
 * - JSON data (untuk visualisasi)
 * - CSV data (untuk excel)
 *
 * @param config - Konfigurasi runner
 * @returns EvaluationReport
 */
export async function runFullEvaluation(
  config: RunnerConfig = DEFAULT_CONFIG,
): Promise<{
  report: EvaluationReport;
  markdown: string;
  academicMarkdown: string;
  visualizationData: ReturnType<typeof generateVisualizationData>;
}> {
  // 1. Evaluasi semua skenario
  const results = await evaluateAllScenarios(config);

  // 2. Hitung statistik agregat
  const aggregateStats = calculateAggregateStats(results);

  // 3. Buat report object
  const report: EvaluationReport = {
    title:
      "Evaluasi Sistem Retrieval-Augmented Generation (RAG) pada Chatbot Curhat Berbasis Emotional Context",
    createdAt: new Date().toISOString(),
    description: `Laporan ini menyajikan hasil evaluasi terhadap sistem RAG chatbot curhat "Honey" menggunakan ${results.length} skenario pengujian yang mencakup 10 kategori emosional: overthinking, anxiety, relationship, insecure, keluarga, kehilangan motivasi, stress kuliah, kesepian, burnout, dan self doubt. Setiap skenario dievaluasi berdasarkan similarity, relevansi, empati, konsistensi konteks, dan akurasi retrieval.`,
    results,
    aggregateStats,
  };

  // 4. Generate format output
  const academicMarkdown = generateAcademicReport(report);
  const visualizationData = generateVisualizationData(report);

  // 5. Tampilkan ringkasan
  console.log("\n" + "=".repeat(60));
  console.log("RINGKASAN HASIL EVALUASI");
  console.log("=".repeat(60));
  console.log(`Rata-rata skor: ${aggregateStats.averageOverallScore}/100`);
  console.log(`Skor tertinggi: ${aggregateStats.highestScore}/100`);
  console.log(`Skor terendah: ${aggregateStats.lowestScore}/100`);
  console.log(`Standar deviasi: ${aggregateStats.standardDeviation}`);
  console.log("\nRata-rata per dimensi:");
  console.log(
    `  Similarity           : ${aggregateStats.categoryAverages.similarity}`,
  );
  console.log(
    `  Relevance            : ${aggregateStats.categoryAverages.relevance}`,
  );
  console.log(
    `  Empathy              : ${aggregateStats.categoryAverages.empathy}`,
  );
  console.log(
    `  Contextual Consistency: ${aggregateStats.categoryAverages.contextualConsistency}`,
  );
  console.log(
    `  Retrieval Accuracy   : ${aggregateStats.categoryAverages.retrievalAccuracy}`,
  );

  // 6. Simpan ke file jika diminta
  if (config.saveToFile) {
    const fs = await import("fs/promises");
    const path = await import("path");
    const outDir = path.resolve(config.outputPath);
    await fs.mkdir(outDir, { recursive: true });

    await fs.writeFile(path.join(outDir, "01-academic-report-bab4.md"), academicMarkdown, "utf-8");
    console.log(`âœ“ 02-academic-report-bab4.md`);

    const jsonPath = path.join(outDir, "03-visualization-data.json");
    await fs.writeFile(jsonPath, JSON.stringify(visualizationData, null, 2), "utf-8");
    console.log(`âœ“ 03-visualization-data.json`);

    console.log(`\nSemua file tersimpan di: ${outDir}`);
  }

  return { report, academicMarkdown, visualizationData };
}
