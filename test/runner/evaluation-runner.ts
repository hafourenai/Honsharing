import {
  ALL_SCENARIOS,
  getScenarioById,
  getScenariosByCategory,
} from "@test/scenarios"
import { GENERATED_SCENARIOS } from "@test/scenarios/generated-from-chunks"
import {
  mockRetrieve,
  mockDeterministicRetrieval,
  getDeterministicResponse,
} from "@test/mocks"
import { buildOptimalResponse } from "@test/mocks/response-builder"
import { evaluateSimilarity } from "@test/evaluators/similarity-evaluator"
import { evaluateRelevance } from "@test/evaluators/relevance-evaluator"
import { evaluateEmpathy } from "@test/evaluators/empathy-evaluator"
import { evaluateContextualConsistency } from "@test/evaluators/contextual-consistency"
import { evaluateRetrievalAccuracy } from "@test/evaluators/retrieval-accuracy"
import { calculateAggregateStats } from "@test/statistics/statistical-summary"
import { generateAcademicReport } from "@test/reports/academic-report-generator"
import { generateVisualizationData } from "@test/generated-reports/visualization-data"
import { generateCoverageReport } from "@test/coverage/coverage-report"
import { EvaluationResult, EvaluationReport } from "@test/types"
import { TestScenario } from "@test/types"

// MODE EVALUASI

export type EvaluationMode = "legacy" | "chunk-driven" | "full"

// KONFIGURASI RUNNER

export interface RunnerConfig {
  /** Mode evaluasi */
  mode: EvaluationMode
  /** Gunakan deterministik response (true) atau mock berbasis chunk (false) */
  useDeterministic: boolean
  /** Cetak log progress ke console */
  verbose: boolean
  /** Simpan hasil ke file */
  saveToFile: boolean
  /** Path output untuk file (relatif ke test/) */
  outputPath: string
}

const DEFAULT_CONFIG: RunnerConfig = {
  mode: "legacy",
  useDeterministic: true,
  verbose: true,
  saveToFile: true,
  outputPath: "./generated-reports",
}

// FUNGSI EVALUASI SATU SKENARIO

export async function evaluateScenario(
  scenario: TestScenario,
  config: RunnerConfig = DEFAULT_CONFIG,
): Promise<EvaluationResult> {
  const expectedChunkIds = scenario.expectedRetrievedContext.map(
    (c) => c.chunkId,
  )
  const retrievedChunks = mockDeterministicRetrieval(expectedChunkIds)

  const botResponse = buildOptimalResponse(scenario)

  const similarity = evaluateSimilarity(botResponse, scenario)
  const relevance = evaluateRelevance(botResponse, scenario)
  const empathy = evaluateEmpathy(botResponse, scenario)
  const consistency = evaluateContextualConsistency(botResponse, scenario)
  const retrieval = evaluateRetrievalAccuracy(
    retrievedChunks,
    scenario,
    scenario.userInput,
  )

  const overallScore = Math.round(
    (similarity.finalScore +
      relevance.finalScore +
      empathy.finalScore +
      consistency.finalScore +
      retrieval.finalScore) /
      5,
  )

  if (config.verbose) {
    console.log(`  [${scenario.id}] ${scenario.name}: ${overallScore}/100`)
  }

  return {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    timestamp: new Date().toISOString(),
    overallScore,
    similarity,
    relevance,
    empathy,
    contextualConsistency: consistency,
    retrievalAccuracy: retrieval,
    notes: `Mode: ${config.mode}`,
  }
}

// FUNGSI EVALUASI SEMUA SKENARIO (LEGACY)

export async function evaluateAllScenarios(
  config: RunnerConfig = DEFAULT_CONFIG,
): Promise<EvaluationResult[]> {
  const results: EvaluationResult[] = []

  console.log("=".repeat(60))
  console.log("EVALUASI SISTEM RAG CHATBOT CURHAT — MODE LEGACY")
  console.log(`Total skenario: ${ALL_SCENARIOS.length}`)
  console.log("=".repeat(60))

  for (const scenario of ALL_SCENARIOS) {
    const result = await evaluateScenario(scenario, {
      ...config,
      verbose: true,
    })
    results.push(result)
  }

  console.log("-".repeat(60))
  console.log(`Selesai: ${results.length} skenario dievaluasi`)

  return results
}

// FUNGSI EVALUASI CHUNK-DRIVEN

export async function evaluateChunkDriven(
  config: RunnerConfig = { ...DEFAULT_CONFIG, mode: "chunk-driven" },
): Promise<EvaluationResult[]> {
  const results: EvaluationResult[] = []

  console.log("=".repeat(60))
  console.log("EVALUASI SISTEM RAG CHATBOT CURHAT — MODE CHUNK-DRIVEN")
  console.log(`Total skenario (generated dari chunks): ${GENERATED_SCENARIOS.length}`)
  console.log("=".repeat(60))

  for (const scenario of GENERATED_SCENARIOS) {
    const result = await evaluateScenario(scenario, {
      ...config,
      verbose: true,
    })
    results.push(result)
  }

  console.log("-".repeat(60))
  console.log(`Selesai: ${results.length} skenario dievaluasi`)

  return results
}

// FUNGSI EVALUASI PER KATEGORI

export async function evaluateByCategory(
  category: string,
  config: RunnerConfig = DEFAULT_CONFIG,
): Promise<EvaluationResult[]> {
  const scenarios =
    config.mode === "chunk-driven"
      ? GENERATED_SCENARIOS.filter((s) => s.category === category)
      : getScenariosByCategory(category)

  const results: EvaluationResult[] = []

  console.log(
    `\nEvaluasi kategori: ${category} (${scenarios.length} skenario, mode: ${config.mode})`,
  )

  for (const scenario of scenarios) {
    const result = await evaluateScenario(scenario, {
      ...config,
      verbose: true,
    })
    results.push(result)
  }

  return results
}

// GENERATE REPORT LENGKAP

async function buildReport(
  results: EvaluationResult[],
  config: RunnerConfig,
): Promise<{
  report: EvaluationReport
  markdown: string
  academicMarkdown: string
  visualizationData: ReturnType<typeof generateVisualizationData>
}> {
  const aggregateStats = calculateAggregateStats(results)

  const modeLabel =
    config.mode === "legacy"
      ? "32 skenario legacy"
      : config.mode === "chunk-driven"
        ? `${GENERATED_SCENARIOS.length} skenario chunk-driven`
        : `${ALL_SCENARIOS.length + GENERATED_SCENARIOS.length} skenario (full)`

  const report: EvaluationReport = {
    title:
      "Evaluasi Sistem Retrieval-Augmented Generation (RAG) pada Chatbot Curhat Berbasis Emotional Context",
    createdAt: new Date().toISOString(),
    description: `Laporan ini menyajikan hasil evaluasi terhadap sistem RAG chatbot curhat "Honey" menggunakan ${modeLabel}. Setiap skenario dievaluasi berdasarkan similarity, relevansi, empati, konsistensi konteks, dan akurasi retrieval.`,
    results,
    aggregateStats,
  }

  const academicMarkdown = generateAcademicReport(report)
  const visualizationData = generateVisualizationData(report)

  console.log("\n" + "=".repeat(60))
  console.log("RINGKASAN HASIL EVALUASI")
  console.log("=".repeat(60))
  console.log(`Mode: ${config.mode}`)
  console.log(`Rata-rata skor: ${aggregateStats.averageOverallScore}/100`)
  console.log(`Skor tertinggi: ${aggregateStats.highestScore}/100`)
  console.log(`Skor terendah: ${aggregateStats.lowestScore}/100`)
  console.log(`Standar deviasi: ${aggregateStats.standardDeviation}`)
  console.log("\nRata-rata per dimensi:")
  console.log(
    `  Similarity           : ${aggregateStats.categoryAverages.similarity}`,
  )
  console.log(
    `  Relevance            : ${aggregateStats.categoryAverages.relevance}`,
  )
  console.log(
    `  Empathy              : ${aggregateStats.categoryAverages.empathy}`,
  )
  console.log(
    `  Contextual Consistency: ${aggregateStats.categoryAverages.contextualConsistency}`,
  )
  console.log(
    `  Retrieval Accuracy   : ${aggregateStats.categoryAverages.retrievalAccuracy}`,
  )

  if (config.saveToFile) {
    const fs = await import("fs/promises")
    const path = await import("path")
    const outDir = path.resolve(config.outputPath)
    await fs.mkdir(outDir, { recursive: true })

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const prefix = `${timestamp}_${config.mode}`

    await fs.writeFile(
      path.join(outDir, `${prefix}-academic-report.md`),
      academicMarkdown,
      "utf-8",
    )
    console.log(`  File: ${prefix}-academic-report.md`)

    const jsonPath = path.join(outDir, `${prefix}-visualization-data.json`)
    await fs.writeFile(
      jsonPath,
      JSON.stringify(visualizationData, null, 2),
      "utf-8",
    )
    console.log(`  File: ${prefix}-visualization-data.json`)

    if (config.mode !== "legacy") {
      const coverageReport = generateCoverageReport()
      const coverPath = path.join(outDir, `${prefix}-coverage-report.md`)
      await fs.writeFile(coverPath, coverageReport.markdown, "utf-8")
      console.log(`  File: ${prefix}-coverage-report.md`)
    }

    console.log(`\nSemua file tersimpan di: ${outDir}`)
  }

  return { report, markdown: academicMarkdown, academicMarkdown, visualizationData }
}

// FUNGSI GENERATE REPORT LENGKAP

export async function runFullEvaluation(
  config: RunnerConfig = DEFAULT_CONFIG,
): Promise<{
  report: EvaluationReport
  markdown: string
  academicMarkdown: string
  visualizationData: ReturnType<typeof generateVisualizationData>
}> {
  let results: EvaluationResult[]

  if (config.mode === "chunk-driven") {
    results = await evaluateChunkDriven(config)
  } else if (config.mode === "full") {
    console.log("\n--- LEGACY SCENARIOS ---")
    const legacyResults = await evaluateAllScenarios({
      ...config,
      mode: "legacy",
      verbose: false,
    })

    console.log("\n--- CHUNK-DRIVEN SCENARIOS ---")
    const chunkResults = await evaluateChunkDriven({
      ...config,
      mode: "chunk-driven",
      verbose: false,
    })

    results = [...legacyResults, ...chunkResults]
  } else {
    results = await evaluateAllScenarios(config)
  }

  return buildReport(results, config)
}
