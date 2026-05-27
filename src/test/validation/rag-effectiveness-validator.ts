import { RealComparisonSummary } from "@/test/types"
import { FinalRAGValidation } from "./types"

/**
 * RAG Effectiveness Validator — mengukur efektivitas RAG
 * dalam meningkatkan kualitas respons chatbot.
 *
 * Membandingkan:
 * - Relevance: kesesuaian respons dengan konteks
 * - Specificity: seberapa spesifik respons
 * - Emotional alignment: keselarasan emosional
 * - Contextual quality: kualitas konteks yang digunakan
 */
export function validateRAGEffectivenessFinal(
  comparison: RealComparisonSummary
): FinalRAGValidation {
  const details: string[] = []

  // Ambil improvement rata-rata
  const { averageImprovement } = comparison

  // Hitung improvement per dimensi dari details
  const improvements = comparison.details.length > 0
    ? comparison.details.map((d) => ({
        contextual: d.contextualImprovement,
        empathy: d.empathyImprovement,
        specificity: d.specificityImprovement,
      }))
    : []

  const relevanceImprovement = improvements.length > 0
    ? Math.round(improvements.reduce((a, b) => a + b.contextual, 0) / improvements.length)
    : 0

  const specificityImprovement = improvements.length > 0
    ? Math.round(improvements.reduce((a, b) => a + b.specificity, 0) / improvements.length)
    : 0

  const emotionalAlignmentImprovement = improvements.length > 0
    ? Math.round(improvements.reduce((a, b) => a + b.empathy, 0) / improvements.length)
    : 0

  // Contextual quality = rata-rata dari relevance & specificity
  const contextualQualityImprovement = Math.round(
    (relevanceImprovement + specificityImprovement) / 2
  )

  // Effectiveness score (rata-rata semua improvement)
  const effectivenessScore = Math.round(
    (relevanceImprovement + specificityImprovement +
     emotionalAlignmentImprovement + contextualQualityImprovement) / 4
  )

  // Apakah signifikan? (>15% improvement)
  const isSignificant = effectivenessScore > 15

  // Summary
  let summary: string
  if (isSignificant) {
    summary = `RAG memberikan peningkatan signifikan dengan efektivitas ${effectivenessScore}%.`
    details.push(`RAG secara signifikan meningkatkan kualitas respons chatbot.`)
  } else {
    summary = `RAG memberikan peningkatan minimal (${effectivenessScore}%).`
    details.push(`RAG belum memberikan dampak signifikan pada kualitas respons.`)
  }

  // Detail per dimensi
  details.push(`- Relevance: meningkat ${relevanceImprovement}%`)
  details.push(`- Specificity: meningkat ${specificityImprovement}%`)
  details.push(`- Emotional alignment: meningkat ${emotionalAlignmentImprovement}%`)
  details.push(`- Contextual quality: meningkat ${contextualQualityImprovement}%`)

  if (improvements.length > 0) {
    details.push(`- Total skenario: ${comparison.details.length}`)
  }

  return {
    effectivenessScore,
    relevanceImprovement,
    specificityImprovement,
    emotionalAlignmentImprovement,
    contextualQualityImprovement,
    isSignificant,
    summary,
    details,
  }
}

/**
 * Menghasilkan markdown untuk RAG effectiveness.
 */
export function generateRAGEffectivenessMarkdown(
  result: FinalRAGValidation
): string {
  const lines: string[] = []
  lines.push("## RAG Effectiveness Validation")
  lines.push("")
  lines.push(`**Effectiveness Score:** ${result.effectivenessScore}/100`)
  lines.push(`**Signifikan:** ${result.isSignificant ? "✅ YA" : "❌ TIDAK"}`)
  lines.push("")
  lines.push(`**Ringkasan:** ${result.summary}`)
  lines.push("")
  lines.push("### Improvement per Dimensi")
  lines.push("")
  lines.push("| Dimensi | Improvement |")
  lines.push("|---------|-------------|")
  lines.push(`| Contextual Relevance | ${result.relevanceImprovement}% |`)
  lines.push(`| Specificity | ${result.specificityImprovement}% |`)
  lines.push(`| Emotional Alignment | ${result.emotionalAlignmentImprovement}% |`)
  lines.push(`| Contextual Quality | ${result.contextualQualityImprovement}% |`)
  lines.push("")
  lines.push("### Detail")
  lines.push("")
  for (const d of result.details) {
    lines.push(d)
  }
  lines.push("")
  return lines.join("\n")
}
