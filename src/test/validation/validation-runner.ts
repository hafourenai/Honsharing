import { EvaluationSession, TestScenario, FailureAnalysis, RealComparisonSummary, MultiTurnSummary } from "@/test/types"
import { ValidationReport } from "./types"
import { generateValidationReport, reportToMarkdown } from "./validation-report"
import { checkConsistency } from "./consistency-checker"
import { performSanityCheck } from "./sanity-check"
import { detectOutliers } from "./outlier-detector"
import { validateDataset } from "./dataset-validator"
import { generateReliabilitySummary } from "./reliability-summary"
import { validateRAGEffectivenessFinal } from "./rag-effectiveness-validator"
import { validateDistribution } from "./distribution-generator"
import { generateFinalInterpretation } from "./final-interpretation"
import { generateFinalRecommendations } from "./final-recommendations"

/**
 * Validation Runner — entry point tunggal untuk menjalankan
 * seluruh validasi akhir.
 *
 * Memanggil semua validator, mengumpulkan hasil,
 * dan mengembalikan structured validation result.
 */
export interface FinalValidationResult {
  report: ValidationReport
  markdown: string
  passed: boolean
  overallGrade: string
  summary: {
    totalChecks: number
    passedChecks: number
    failedChecks: number
    warningChecks: number
    validationDate: string
  }
}

/**
 * Menjalankan seluruh validasi akhir untuk sesi evaluasi.
 */
export function runFinalValidation(
  session: EvaluationSession,
  scenarios: TestScenario[],
  failures: FailureAnalysis[],
  comparison?: RealComparisonSummary,
  multiTurn?: MultiTurnSummary,
): FinalValidationResult {
  const report = generateValidationReport(session, scenarios, failures, comparison, multiTurn)
  const markdown = reportToMarkdown(report)

  const passedChecks = report.sections.filter((s) => s.status === "PASS").length
  const warningChecks = report.sections.filter((s) => s.status === "WARNING").length
  const failedChecks = report.sections.filter((s) => s.status === "FAIL").length

  const summary = {
    totalChecks: report.sections.length,
    passedChecks,
    failedChecks,
    warningChecks,
    validationDate: report.date,
  }

  return {
    report,
    markdown,
    passed: report.passed,
    overallGrade: report.overallGrade,
    summary,
  }
}

/**
 * Cetak ringkasan cepat ke console.
 */
export function printValidationSummary(
  result: FinalValidationResult
): void {
  const border = "=".repeat(60)
  console.log("")
  console.log(border)
  console.log("  VALIDASI AKHIR SISTEM")
  console.log(border)
  console.log(`  Grade:       ${result.overallGrade}`)
  console.log(`  Status:      ${result.passed ? "✅ LULUS" : "❌ TIDAK LULUS"}`)
  console.log(`  Total Cek:   ${result.summary.totalChecks}`)
  console.log(`  Lulus:       ${result.summary.passedChecks}`)
  console.log(`  Peringatan:  ${result.summary.warningChecks}`)
  console.log(`  Gagal:       ${result.summary.failedChecks}`)
  console.log(`  Tanggal:     ${result.summary.validationDate}`)
  console.log(border)
  console.log("")
}
