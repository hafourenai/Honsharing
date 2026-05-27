/**
 * ============================================================
 * REAL EVALUATION — BARREL EXPORTS
 * ============================================================
 */

export {
  createSession,
  callChatApi,
  callEmbedApi,
  callTitleApi,
  pingAPI,
  DEFAULT_CONFIG,
} from "./chat-api-wrapper"

export { createEvaluationMode } from "./evaluation-modes"
export type { EvaluationModeHandler } from "./evaluation-modes"

export {
  createLogEntry,
  createEvaluationSession,
  generateSessionMarkdown,
  generateSessionJSON,
  saveSessionLogs,
} from "./evaluation-session-logger"

export {
  inspectRetrieval,
  analyzeRetrievalContribution,
  generateRetrievalTable,
  generateContributionTable,
  compareRetrievalResults,
} from "./retrieval-inspector"

export { analyzeResponseQuality } from "./response-quality-analyzer"

export { analyzeFailures, generateFailureTable } from "./failure-analyzer"

export {
  compareRealScenario,
  compareRealAllScenarios,
  generateRealComparisonTable,
} from "./comparative-evaluator"

export {
  evaluateMultiTurnScenario,
  evaluateAllMultiTurn,
  generateMultiTurnTable,
} from "./multi-turn-evaluator"

export { generateAcademicInterpretation } from "./academic-interpretation"

export { generateEvaluationReport } from "./report-structure"
export type { ReportSection, EvaluationReport } from "./report-structure"

export {
  runEvaluation,
  runMockEvaluation,
  runRealEvaluation,
  runHybridEvaluation,
} from "./real-evaluation-runner"
export type { RunConfig, RunResult } from "./real-evaluation-runner"
