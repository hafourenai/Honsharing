import { EvaluationSession, TestScenario, FailureAnalysis, RealComparisonSummary, MultiTurnSummary } from "@/test/types"
import { ValidationReport, ValidationSection, ValidationIssue } from "./types"
import { checkConsistency, generateConsistencyMarkdown } from "./consistency-checker"
import { performSanityCheck, generateSanityMarkdown } from "./sanity-check"
import { detectOutliers, generateOutlierMarkdown } from "./outlier-detector"
import { validateDataset, generateDatasetValidationMarkdown } from "./dataset-validator"
import { generateReliabilitySummary, generateReliabilityMarkdown } from "./reliability-summary"
import { validateRAGEffectivenessFinal, generateRAGEffectivenessMarkdown } from "./rag-effectiveness-validator"
import { validateDistribution, generateDistributionMarkdown } from "./distribution-generator"
import { generateFinalInterpretation, generateInterpretationMarkdown } from "./final-interpretation"
import { generateFinalRecommendations, generateRecommendationsMarkdown } from "./final-recommendations"

/**
 * Validation Report — assembles all validation results
 * into a structured report for thesis documentation.
 */
export function generateValidationReport(
  session: EvaluationSession,
  scenarios: TestScenario[],
  failures: FailureAnalysis[],
  comparison?: RealComparisonSummary,
  multiTurn?: MultiTurnSummary,
): ValidationReport {
  const sections: ValidationSection[] = []

  // 1. System Validation (Consistency + Sanity)
  const consistency = checkConsistency(session, scenarios)
  const sanity = performSanityCheck(session, failures)
  const allSystemIssues = [...consistency.issues, ...sanity.issues]

  sections.push({
    title: "Validasi Sistem",
    content: [
      generateConsistencyMarkdown(consistency),
      generateSanityMarkdown(sanity),
    ].join("\n"),
    status: sanity.passed ? "PASS" : "FAIL",
    issues: allSystemIssues,
  })

  // 2. Dataset Validation
  const dataset = validateDataset(scenarios)
  sections.push({
    title: "Validasi Dataset",
    content: generateDatasetValidationMarkdown(dataset),
    status: dataset.passed ? "PASS" : "FAIL",
    issues: dataset.issues,
  })

  // 3. Similarity Analysis
  const simScore = session.summary.averageSimilarity
  sections.push({
    title: "Analisis Similarity",
    content: [
      "## Analisis Similarity",
      "",
      `Rata-rata similarity score: **${simScore}/100**`,
      "",
      simScore >= 70
        ? "Chatbot mampu menghasilkan respons dengan kesamaan konten yang baik terhadap konteks yang diharapkan."
        : simScore >= 55
        ? "Chatbot mampu menghasilkan respons dengan kesamaan konten yang cukup terhadap konteks yang diharapkan."
        : "Chatbot perlu meningkatkan kesamaan konten respons terhadap konteks yang diharapkan.",
      "",
      simScore < 60 ? "Rekomendasi: Tingkatkan kualitas dataset RAG dan optimalkan mekanisme retrieval." : "",
    ].filter(Boolean).join("\n"),
    status: simScore >= 70 ? "PASS" : simScore >= 55 ? "WARNING" : "FAIL",
    issues: [],
  })

  // 4. Empathy Analysis
  const empScore = session.summary.averageEmpathy
  sections.push({
    title: "Analisis Empati",
    content: [
      "## Analisis Empati",
      "",
      `Rata-rata empathy score: **${empScore}/100**`,
      "",
      empScore >= 70
        ? "Chatbot mampu menunjukkan empati yang baik terhadap kondisi emosional pengguna."
        : empScore >= 55
        ? "Chatbot mampu menunjukkan empati yang cukup terhadap kondisi emosional pengguna."
        : "Chatbot perlu meningkatkan kemampuan empati dalam merespon kondisi emosional.",
      "",
      empScore < 60 ? "Rekomendasi: Tambahkan variasi ekspresi empati dalam dataset dan template respons." : "",
    ].filter(Boolean).join("\n"),
    status: empScore >= 70 ? "PASS" : empScore >= 55 ? "WARNING" : "FAIL",
    issues: [],
  })

  // 5. Retrieval Analysis
  const retScore = session.summary.averageRetrieval
  sections.push({
    title: "Analisis Retrieval",
    content: [
      "## Analisis Retrieval",
      "",
      `Rata-rata retrieval score: **${retScore}/100**`,
      "",
      retScore >= 70
        ? "Sistem RAG mampu mengambil konteks yang relevan dengan baik."
        : retScore >= 55
        ? "Sistem RAG mampu mengambil konteks yang relevan dengan cukup baik."
        : "Sistem RAG perlu meningkatkan kualitas retrieval.",
      "",
      retScore < 60 ? "Rekomendasi: Optimalkan chunking strategy dan embedding model." : "",
    ].filter(Boolean).join("\n"),
    status: retScore >= 70 ? "PASS" : retScore >= 55 ? "WARNING" : "FAIL",
    issues: [],
  })

  // 6. Consistency Analysis
  sections.push({
    title: "Analisis Konsistensi",
    content: generateConsistencyMarkdown(consistency),
    status: consistency.consistencyScore >= 80 ? "PASS" : consistency.consistencyScore >= 60 ? "WARNING" : "FAIL",
    issues: consistency.issues,
  })

  // 7. Outlier Analysis
  const outliers = detectOutliers(session, scenarios)
  sections.push({
    title: "Analisis Outlier",
    content: generateOutlierMarkdown(outliers),
    status: outliers.criticalCount === 0 ? (outliers.warningCount > 0 ? "WARNING" : "PASS") : "FAIL",
    issues: [],
  })

  // 8. RAG Effectiveness
  if (comparison) {
    const ragResult = validateRAGEffectivenessFinal(comparison)
    sections.push({
      title: "Analisis Efektivitas RAG",
      content: generateRAGEffectivenessMarkdown(ragResult),
      status: ragResult.isSignificant ? "PASS" : "WARNING",
      issues: [],
    })
  }

  // 9. Reliability Summary
  const reliability = generateReliabilitySummary(session)
  sections.push({
    title: "Reliability Summary",
    content: generateReliabilityMarkdown(reliability),
    status: reliability.systemReliability === "TINGGI" ? "PASS" : reliability.systemReliability === "SEDANG" ? "WARNING" : "FAIL",
    issues: [],
  })

  // 10. Distribution Analysis
  const distribution = validateDistribution(session)
  sections.push({
    title: "Distribusi Skor",
    content: generateDistributionMarkdown(distribution),
    status: distribution.isNatural ? "PASS" : "WARNING",
    issues: [],
  })

  // 11. Final Interpretation
  const interpretation = generateFinalInterpretation(session, comparison, multiTurn, failures)
  sections.push({
    title: "Interpretasi Final",
    content: generateInterpretationMarkdown(interpretation),
    status: "PASS",
    issues: [],
  })

  // 12. Recommendations
  const recommendations = generateFinalRecommendations(session, comparison, multiTurn, failures)
  sections.push({
    title: "Rekomendasi",
    content: generateRecommendationsMarkdown(recommendations),
    status: "PASS",
    issues: [],
  })

  // Overall status
  const failedSections = sections.filter((s) => s.status === "FAIL")
  const warningSections = sections.filter((s) => s.status === "WARNING")
  const passed = failedSections.length === 0

  let overallGrade: string
  if (passed && warningSections.length === 0) {
    overallGrade = "SANGAT BAIK"
  } else if (passed) {
    overallGrade = "BAIK"
  } else if (failedSections.length <= 2) {
    overallGrade = "CUKUP"
  } else {
    overallGrade = "KURANG"
  }

  return {
    title: "Laporan Validasi Sistem RAG Chatbot Berbasis Emosi",
    date: new Date().toISOString(),
    mode: session.mode,
    sections,
    passed,
    overallGrade,
  }
}

/**
 * Konversi report ke format markdown.
 */
export function reportToMarkdown(
  report: ValidationReport,
  includeDetail: boolean = true
): string {
  const lines: string[] = []
  lines.push(`# ${report.title}`)
  lines.push("")
  lines.push(`**Tanggal:** ${report.date}`)
  lines.push(`**Mode:** ${report.mode}`)
  lines.push(`**Grade:** ${report.overallGrade}`)
  lines.push(`**Status:** ${report.passed ? "✅ LULUS" : "❌ TIDAK LULUS"}`)
  lines.push("")

  // Daftar isi
  lines.push("## Daftar Isi")
  lines.push("")
  for (const section of report.sections) {
    const emoji = section.status === "PASS" ? "✅" : section.status === "WARNING" ? "⚠️" : "❌"
    lines.push(`- ${emoji} ${section.title}`)
  }
  lines.push("")

  // Isi per section
  for (const section of report.sections) {
    const emoji = section.status === "PASS" ? "✅" : section.status === "WARNING" ? "⚠️" : "❌"
    lines.push(`---`)
    lines.push(`${emoji} **${section.title}** — Status: ${section.status}`)
    lines.push("")
    lines.push(section.content)
    lines.push("")

    if (includeDetail && section.issues.length > 0) {
      lines.push("### Detail Issues")
      lines.push("")
      lines.push("| Level | Tipe | Pesan |")
      lines.push("|-------|------|-------|")
      for (const issue of section.issues) {
        lines.push(`| ${issue.level} | ${issue.type} | ${issue.message} |`)
      }
      lines.push("")
    }
  }

  // Footer
  lines.push("---")
  lines.push("*Laporan ini dihasilkan secara otomatis oleh sistem validasi.*")
  lines.push(`*Total ${report.sections.length} seksi validasi.*`)

  return lines.join("\n")
}
