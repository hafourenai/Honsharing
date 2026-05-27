import {
  EvaluationMode,
  ChatApiConfig,
  ResponseQualityResult,
  FailureAnalysis,
  RealComparisonResult,
  MultiTurnResult,
  EvaluationSession,
  QualityLabel,
  RetrievedChunkInfo,
} from "@/test/types"

import { createEvaluationMode } from "./evaluation-modes"
import { EvaluationModeHandler } from "./evaluation-modes"
import { createLogEntry, createEvaluationSession, generateSessionMarkdown as formatSessionAsMarkdown } from "./evaluation-session-logger"
import { inspectRetrieval, analyzeRetrievalContribution } from "./retrieval-inspector"
import { analyzeResponseQuality } from "./response-quality-analyzer"
import { analyzeFailures } from "./failure-analyzer"
import { compareRealScenario, compareRealAllScenarios } from "./comparative-evaluator"
import { evaluateMultiTurnScenario, evaluateAllMultiTurn } from "./multi-turn-evaluator"
import { generateAcademicInterpretation } from "./academic-interpretation"
import { generateEvaluationReport, EvaluationReport } from "./report-structure"
import { ALL_MULTI_TURN_SCENARIOS } from "@/test/scenarios/multi-turn"
import { scenarios as singleTurnScenarios } from "@/test/scenarios"
import { getDeterministicResponse } from "@/test/mocks"
import { evaluateSimilarity } from "@/test/evaluators/similarity-evaluator"
import { evaluateEmpathy } from "@/test/evaluators/empathy-evaluator"
import { evaluateRelevance } from "@/test/evaluators/relevance-evaluator"
import { evaluateRetrievalAccuracy } from "@/test/evaluators/retrieval-accuracy"
import type { Chunk } from "@/lib/rag/promptBuilder"

export interface RunConfig {
  mode: EvaluationMode
  apiConfig?: Partial<ChatApiConfig>
  enableRetrievalInspection?: boolean
  enableQualityAnalysis?: boolean
  enableFailureAnalysis?: boolean
  enableComparison?: boolean
  enableMultiTurn?: boolean
  enableAcademicInterpretation?: boolean
  enableReportGeneration?: boolean
  outputDir?: string
}

const DEFAULT_CONFIG: RunConfig = {
  mode: "REAL",
  enableRetrievalInspection: true,
  enableQualityAnalysis: true,
  enableFailureAnalysis: true,
  enableComparison: true,
  enableMultiTurn: true,
  enableAcademicInterpretation: true,
  enableReportGeneration: true,
}

export interface RunResult {
  session: EvaluationSession
  qualityResults: Map<string, ResponseQualityResult>
  failureResults: FailureAnalysis[]
  comparisonResults?: RealComparisonResult[]
  comparisonSummary?: import("@/test/types").RealComparisonSummary
  multiTurnResults?: MultiTurnResult[]
  multiTurnSummary?: import("@/test/types").MultiTurnSummary
  interpretation?: import("@/test/types").AcademicInterpretation
  report?: EvaluationReport
  markdownLog?: string
  durationMs: number
}

export async function runEvaluation(
  config: Partial<RunConfig> = {}
): Promise<RunResult> {
  const cfg: RunConfig = { ...DEFAULT_CONFIG, ...config }
  const startTime = Date.now()

  const sessionId = `eval-${cfg.mode.toLowerCase()}-${Date.now()}`

  const mode: EvaluationModeHandler = createEvaluationMode(cfg.mode, cfg.apiConfig)

  const logEntries = []
  const qualityResults = new Map<string, ResponseQualityResult>()
  const failures: FailureAnalysis[] = []

  const MODE_DELAY_MS = 2500

  for (const scenario of singleTurnScenarios) {
    let botResponse: string
    let responseTimeMs = 0
    let retrievedContext: unknown[] = []

    if (cfg.mode === "REAL") {
      const result = await mode.getResponse(scenario.userInput, scenario)
      botResponse = result.response
      responseTimeMs = result.responseTimeMs
      retrievedContext = result.retrievedChunks
      console.log(`[${scenario.id}] ${scenario.name}: ${responseTimeMs}ms`)
      await new Promise((r) => setTimeout(r, MODE_DELAY_MS))
    } else {
      botResponse = getDeterministicResponse(scenario.id)
    }

    const similarityResult = evaluateSimilarity(botResponse, scenario)
    const empathyResult = evaluateEmpathy(botResponse, scenario)
    const relevanceResult = evaluateRelevance(botResponse, scenario)
    const retrievalResult = evaluateRetrievalAccuracy(
      retrievedContext as Chunk[],
      scenario,
      scenario.userInput,
    )

    const similarityScore = similarityResult.finalScore
    const empathyScore = empathyResult.finalScore
    const relevanceScore = relevanceResult.finalScore
    const retrievalScore = retrievalResult.finalScore

    const avgScore = Math.round(
      (similarityScore + empathyScore + relevanceScore + retrievalScore) / 4,
    )
    const qualityLabel: QualityLabel =
      avgScore >= 70 ? "GOOD" : avgScore >= 50 ? "ACCEPTABLE" : avgScore >= 30 ? "WEAK" : "FAILED"

    const entry = createLogEntry({
      sessionId,
      mode: cfg.mode,
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      category: scenario.category,
      userInput: scenario.userInput,
      retrievedContext: retrievedContext as RetrievedChunkInfo[],
      generatedResponse: botResponse,
      similarityScore,
      empathyScore,
      relevanceScore,
      retrievalScore,
      qualityLabel,
      responseTimeMs,
    })
    logEntries.push(entry)

    if (cfg.enableQualityAnalysis) {
      const quality = analyzeResponseQuality(botResponse, scenario.userInput)
      qualityResults.set(scenario.id, quality)
    }

    if (cfg.enableFailureAnalysis) {
      const failureAnalysis = analyzeFailures(botResponse, scenario)
      failureAnalysis.scenarioId = scenario.id
      failureAnalysis.scenarioName = scenario.name
      failures.push(failureAnalysis)
    }
  }

  const session = createEvaluationSession(
    logEntries,
    cfg.mode
  )

  let comparisonResults: RealComparisonResult[] | undefined
  let comparisonSummary: import("@/test/types").RealComparisonSummary | undefined

  if (cfg.enableComparison) {
    comparisonSummary = await compareRealAllScenarios(singleTurnScenarios)
    comparisonResults = comparisonSummary.details
  }

  let multiTurnResults: MultiTurnResult[] | undefined
  let multiTurnSummary: import("@/test/types").MultiTurnSummary | undefined

  if (cfg.enableMultiTurn) {
    multiTurnSummary = await evaluateAllMultiTurn(ALL_MULTI_TURN_SCENARIOS, mode)
    multiTurnResults = multiTurnSummary.details
  }

  let interpretation: import("@/test/types").AcademicInterpretation | undefined

  if (cfg.enableAcademicInterpretation) {
    interpretation = generateAcademicInterpretation(
      session,
      comparisonSummary,
      multiTurnSummary,
      failures
    )
  }

  let report: EvaluationReport | undefined

  if (cfg.enableReportGeneration && interpretation) {
    report = generateEvaluationReport(
      session,
      interpretation,
      comparisonSummary,
      multiTurnSummary,
      failures
    )
  }

  const markdownLog = formatSessionAsMarkdown(session)

  const durationMs = Date.now() - startTime

  return {
    session,
    qualityResults,
    failureResults: failures,
    comparisonResults,
    comparisonSummary,
    multiTurnResults,
    multiTurnSummary,
    interpretation,
    report,
    markdownLog,
    durationMs,
  }
}

export async function runMockEvaluation(
  config?: Partial<RunConfig>
): Promise<RunResult> {
  return runEvaluation({ ...config, mode: "MOCK" })
}

export async function runRealEvaluation(
  config?: Partial<RunConfig>
): Promise<RunResult> {
  return runEvaluation({ ...config, mode: "REAL" })
}

export async function runHybridEvaluation(
  config?: Partial<RunConfig>
): Promise<RunResult> {
  return runEvaluation({ ...config, mode: "HYBRID" })
}
