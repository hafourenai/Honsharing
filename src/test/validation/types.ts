import {
  EvaluationSession,
  TestScenario,
  FailureAnalysis,
  ResponseQualityResult,
  RealComparisonResult,
  RealComparisonSummary,
  MultiTurnResult,
  MultiTurnSummary,
  QualityLabel,
} from "@/test/types"

// ================================================================
// TIPE VALIDASI
// ================================================================

export type ValidationLevel = "NORMAL" | "WARNING" | "CRITICAL"

export interface ValidationIssue {
  id: string
  type: string
  level: ValidationLevel
  message: string
  details?: string
  source: string
}

export interface ConsistencyResult {
  issues: ValidationIssue[]
  consistencyScore: number
  summary: string
}

export interface SanityCheckResult {
  passed: boolean
  issues: ValidationIssue[]
  realismScore: number
  summary: string
}

export interface OutlierResult {
  items: OutlierItem[]
  totalOutliers: number
  criticalCount: number
  warningCount: number
  summary: string
}

export interface OutlierItem {
  scenarioId: string
  scenarioName: string
  metric: string
  value: number
  expected: string
  level: ValidationLevel
  reason: string
}

export interface DatasetValidationResult {
  passed: boolean
  totalScenarios: number
  categories: string[]
  issues: ValidationIssue[]
  categoryBalance: CategoryBalanceInfo[]
  completeness: boolean
  summary: string
}

export interface CategoryBalanceInfo {
  category: string
  count: number
  percent: number
  status: "SEIMBANG" | "KURANG" | "BERLEBIH"
}

export interface ReliabilitySummary {
  totalTests: number
  validResponses: number
  weakResponses: number
  failedResponses: number
  consistencyLevel: number
  retrievalSuccessRate: number
  systemReliability: "TINGGI" | "SEDANG" | "RENDAH"
  summary: string
  details: string
}

export interface DistributionValidation {
  isNatural: boolean
  issues: string[]
  scoreRanges: RangeDistribution[]
  summary: string
}

export interface RangeDistribution {
  range: string
  count: number
  percent: number
  expectedMin: number
  expectedMax: number
  status: "OK" | "WARNING" | "CRITICAL"
}

export interface FinalRAGValidation {
  effectivenessScore: number
  relevanceImprovement: number
  specificityImprovement: number
  emotionalAlignmentImprovement: number
  contextualQualityImprovement: number
  isSignificant: boolean
  summary: string
  details: string[]
}

export interface FinalInterpretation {
  title: string
  narrative: string
  strengths: string[]
  weaknesses: string[]
  ragImpact: string
  conclusion: string
}

export interface FinalRecommendations {
  systemDevelopment: string[]
  retrievalImprovement: string[]
  emotionalUnderstanding: string[]
  datasetDevelopment: string[]
  futureEvaluation: string[]
}

export interface ValidationReport {
  title: string
  date: string
  mode: string
  sections: ValidationSection[]
  passed: boolean
  overallGrade: string
}

export interface ValidationSection {
  title: string
  content: string
  status: "PASS" | "WARNING" | "FAIL"
  issues: ValidationIssue[]
}
