/**
 * ============================================================
 * BARREL FILE — RUNNER
 * ============================================================
 *
 * @author  Tim Skripsi
 * @version 1.0
 * ============================================================
 */

export {
  evaluateScenario,
  evaluateAllScenarios,
  evaluateByCategory,
  runFullEvaluation,
} from "./evaluation-runner"

export type { RunnerConfig } from "./evaluation-runner"

export {
  compareSingleScenario,
  compareAllScenarios,
  generateComparisonTable,
} from "./rag-vs-non-rag"

export type {
  RagComparisonResult,
  RagComparisonSummary,
} from "./rag-vs-non-rag"
