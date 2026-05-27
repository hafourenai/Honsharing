// ============================================================
// VALIDATION MODULE — Final validation system for skripsi
// ============================================================

export type {
  ValidationLevel,
  ValidationIssue,
  ConsistencyResult,
  SanityCheckResult,
  OutlierResult,
  OutlierItem,
  DatasetValidationResult,
  CategoryBalanceInfo,
  ReliabilitySummary,
  DistributionValidation,
  RangeDistribution,
  FinalRAGValidation,
  FinalInterpretation,
  FinalRecommendations,
  ValidationReport,
  ValidationSection,
} from "./types"

export { checkConsistency, detectContradictions, generateConsistencyMarkdown } from "./consistency-checker"
export { performSanityCheck, generateRealismRecommendations, generateSanityMarkdown } from "./sanity-check"
export { detectOutliers, generateOutlierMarkdown } from "./outlier-detector"
export { validateDataset, generateDatasetValidationMarkdown } from "./dataset-validator"
export { generateReliabilitySummary, generateReliabilityMarkdown } from "./reliability-summary"
export { validateRAGEffectivenessFinal, generateRAGEffectivenessMarkdown } from "./rag-effectiveness-validator"
export { computeScoreDistribution, validateDistribution, adjustToNatural, generateDistributionMarkdown } from "./distribution-generator"
export { generateFinalInterpretation, generateInterpretationMarkdown } from "./final-interpretation"
export { generateFinalRecommendations, generateRecommendationsMarkdown } from "./final-recommendations"
export { generateValidationReport, reportToMarkdown } from "./validation-report"
export { runFinalValidation, printValidationSummary } from "./validation-runner"
export type { FinalValidationResult } from "./validation-runner"
export { validationDocs } from "./docs"
