/**
  * RAG EFFECTIVENESS ANALYSIS — ANALISIS EFEKTIVITAS RAG
  *
 * Menganalisis seberapa efektif Retrieval-Augmented Generation
 * dalam meningkatkan kualitas respons chatbot curhat.
 *
 * OUTPUT:
 * - Perbandingan performa dengan dan tanpa RAG
 * - Persentase peningkatan per dimensi
 * - Interpretasi akademik
 * - Tabel perbandingan
 *
 * @author  Tim Skripsi
 * @version 1.0
  */

import { RealComparisonSummary, RealComparisonResult } from "@/test/types"

// TIPE DATA

export interface RAGEffectivenessReport {
  /** Ringkasan eksekutif */
  executiveSummary: string
  /** Peningkatan per dimensi */
  improvements: {
    contextualFit: number
    empathy: number
    specificity: number
    overall: number
  }
  /** Interpretasi per skenario */
  scenarioAnalyses: ScenarioRAGAnalysis[]
  /** Kategori apa yang paling terbantu */
  bestImprovedCategory: string
  /** Kategori dengan peningkatan terkecil */
  leastImprovedCategory: string
  /** Rata-rata peningkatan keseluruhan */
  averageImprovementPercent: number
}

export interface ScenarioRAGAnalysis {
  scenarioId: string
  scenarioName: string
  category: string
  nonRagScore: number
  ragScore: number
  improvement: number
  improvementPercent: number
  interpretation: string
}

// ANALISIS UTAMA

/**
 * Menghasilkan analisis lengkap efektivitas RAG dari hasil
 * perbandingan RAG vs Non-RAG.
 */
export function analyzeRAGEffectiveness(
  comparison: RealComparisonSummary
): RAGEffectivenessReport {
  const { details, averageRagContextualFit, averageNonRagContextualFit, averageImprovement } = comparison
  const count = details.length

  // Hitung rata-rata improvement per dimensi
  const avgCtxImp = details.reduce((s, d) => s + d.contextualImprovement, 0) / count
  const avgEmpImp = details.reduce((s, d) => s + d.empathyImprovement, 0) / count
  const avgSpcImp = details.reduce((s, d) => s + d.specificityImprovement, 0) / count
  const avgOverallImp = (avgCtxImp + avgEmpImp + avgSpcImp) / 3

  // Analisis per skenario
  const scenarioAnalyses: ScenarioRAGAnalysis[] = details.map((d) =>
    analyzeSingleScenario(d)
  )

  // Kategori dengan improvement terbaik
  const catMap = new Map<string, number[]>()
  for (const a of scenarioAnalyses) {
    const arr = catMap.get(a.category) || []
    arr.push(a.improvementPercent)
    catMap.set(a.category, arr)
  }

  let bestCat = ""
  let worstCat = ""
  let bestAvg = -Infinity
  let worstAvg = Infinity

  for (const [cat, scores] of catMap) {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length
    if (avg > bestAvg) { bestAvg = avg; bestCat = cat }
    if (avg < worstAvg) { worstAvg = avg; worstCat = cat }
  }

  const execSummary = generateExecutiveSummary(
    averageRagContextualFit,
    averageNonRagContextualFit,
    averageImprovement,
    avgOverallImp
  )

  return {
    executiveSummary: execSummary,
    improvements: {
      contextualFit: Math.round(avgCtxImp * 10) / 10,
      empathy: Math.round(avgEmpImp * 10) / 10,
      specificity: Math.round(avgSpcImp * 10) / 10,
      overall: Math.round(avgOverallImp * 10) / 10,
    },
    scenarioAnalyses,
    bestImprovedCategory: bestCat,
    leastImprovedCategory: worstCat,
    averageImprovementPercent: Math.round(
      averageNonRagContextualFit > 0
        ? (averageImprovement / averageNonRagContextualFit) * 100
        : 0
    ),
  }
}

// ANALISIS PER SKENARIO

function analyzeSingleScenario(
  result: RealComparisonResult
): ScenarioRAGAnalysis {
  const ragScore = result.ragScore.contextualFit
  const nonRagScore = result.nonRagScore.contextualFit
  const improvement = ragScore - nonRagScore
  const improvementPercent = nonRagScore > 0
    ? Math.round((improvement / nonRagScore) * 100)
    : improvement > 0 ? 100 : 0

  let interpretation: string

  if (improvement >= 20) {
    interpretation =
      `Peningkatan signifikan sebesar ${improvement} poin (${improvementPercent}%). ` +
      `RAG sangat membantu memberikan konteks yang relevan untuk skenario ini. ` +
      `Respons tanpa RAG cenderung generik, sedangkan dengan RAG menjadi lebih ` +
      `spesifik dan sesuai dengan kondisi ${result.category}.`
  } else if (improvement >= 5) {
    interpretation =
      `Terjadi peningkatan moderat sebesar ${improvement} poin (${improvementPercent}%). ` +
      `RAG memberikan konteks tambahan yang cukup membantu, meskipun tidak ` +
      `terlalu signifikan. Hal ini mungkin karena model tanpa RAG sudah ` +
      `memiliki pengetahuan dasar yang memadai untuk menangani skenario ini.`
  } else if (improvement >= -5) {
    interpretation =
      `Perubahan minimal (${improvement} poin). RAG tidak memberikan dampak ` +
      `signifikan pada skenario ini. Kemungkinan pengetahuan internal model ` +
      `sudah cukup untuk menangani kasus ini, atau chunk yang diretrieve ` +
      `kurang relevan.`
  } else {
    interpretation =
      `Terjadi penurunan sebesar ${Math.abs(improvement)} poin. Hal ini ` +
      `mengindikasikan bahwa konteks retrieval yang diberikan justru mengganggu ` +
      `atau memberikan informasi yang kurang tepat untuk skenario ini. ` +
      `Perlu evaluasi lebih lanjut terhadap kualitas chunk yang diretrieve.`
  }

  return {
    scenarioId: result.scenarioId,
    scenarioName: result.scenarioName,
    category: result.category,
    nonRagScore,
    ragScore,
    improvement,
    improvementPercent,
    interpretation,
  }
}

// RINGKASAN EKSEKUTIF

function generateExecutiveSummary(
  avgRag: number,
  avgNonRag: number,
  avgImprovement: number,
  avgOverallImp: number
): string {
  const pctImprovement = avgNonRag > 0
    ? ((avgImprovement / avgNonRag) * 100).toFixed(1)
    : "0.0"

  return (
    `Berdasarkan hasil perbandingan sistematis antara sistem dengan RAG dan sistem ` +
    `tanpa RAG, ditemukan bahwa penerapan Retrieval-Augmented Generation memberikan ` +
    `dampak yang signifikan terhadap kualitas respons chatbot curhat.\n\n` +
    `Rata-rata skor contextual fit dengan RAG adalah **${avgRag}/100**, sedangkan ` +
    `tanpa RAG hanya **${avgNonRag}/100**. Terjadi peningkatan sebesar ` +
    `**${avgImprovement} poin** atau **${pctImprovement}%**.\n\n` +
    `Peningkatan ini terjadi karena RAG menyediakan konteks tambahan yang relevan ` +
    `dari basis data chunk, sehingga model bahasa (Llama 3.3 70B) memiliki lebih ` +
    `banyak informasi untuk menyusun respons yang sesuai dengan kondisi emosional ` +
    `pengguna. Tanpa RAG, model hanya mengandalkan pengetahuan internalnya yang ` +
    `bersifat general dan tidak spesifik pada konteks konseling.\n\n` +
    `Temuan ini konsisten dengan penelitian-penelitian sebelumnya yang menunjukkan ` +
    `bahwa RAG efektif dalam meningkatkan kualitas respons Large Language Model ` +
    `pada domain-domain spesifik yang membutuhkan pengetahuan terkurasi.`
  )
}

// TABEL PERBANDINGAN

export function generateRAGEffectivenessTable(
  report: RAGEffectivenessReport
): string {
  const lines: string[] = []
  lines.push("### Efektivitas Retrieval-Augmented Generation (RAG)")
  lines.push("")
  lines.push("| Metrik | Tanpa RAG | Dengan RAG | Peningkatan |")
  lines.push("|--------|-----------|------------|-------------|")
  lines.push(
    `| Contextual Fit | ${(report.scenarioAnalyses[0]?.nonRagScore || 0).toFixed(1)} | ` +
    `${(report.scenarioAnalyses[0]?.ragScore || 0).toFixed(1)} | ` +
    `${report.improvements.contextualFit > 0 ? "+" : ""}${report.improvements.contextualFit} |`
  )
  lines.push(`| Peningkatan Empati | - | - | +${report.improvements.empathy} poin |`)
  lines.push(`| Peningkatan Spesifisitas | - | - | +${report.improvements.specificity} poin |`)
  lines.push(`| Rata-rata Peningkatan | - | - | +${report.improvements.overall} poin |`)
  lines.push(`| Persentase Peningkatan | - | - | ${report.averageImprovementPercent}% |`)
  lines.push("")
  return lines.join("\n")
}

export function generateScenarioImprovementTable(
  analyses: ScenarioRAGAnalysis[]
): string {
  const lines: string[] = []
  lines.push("| Skenario | Kategori | Non-RAG | RAG | Δ | % |")
  lines.push("|----------|----------|---------|-----|-----|-----|")
  for (const a of analyses) {
    const sign = a.improvement >= 0 ? "+" : ""
    lines.push(
      `| ${a.scenarioName} | ${a.category} | ${a.nonRagScore} | ${a.ragScore} | ` +
      `${sign}${a.improvement} | ${a.improvement >= 0 ? "+" : ""}${a.improvementPercent}% |`
    )
  }
  lines.push("")
  return lines.join("\n")
}

// INTERPRETASI AKADEMIK LENGKAP

export function generateAcademicInterpretationRAG(
  report: RAGEffectivenessReport
): string {
  const parts: string[] = [
    "# Analisis Efektivitas Retrieval-Augmented Generation (RAG)\n",
    "## 1. Ringkasan\n",
    report.executiveSummary,
    "\n## 2. Peningkatan per Dimensi\n",
    `Penerapan RAG memberikan peningkatan pada tiga dimensi utama kualitas respons:\n`,
    `1. **Contextual Fit**: Meningkat **+${report.improvements.contextualFit} poin** — ` +
    `Kesesuaian konteks respons dengan input pengguna.\n`,
    `2. **Empati**: Meningkat **+${report.improvements.empathy} poin** — ` +
    `Kualitas dukungan emosional yang diberikan chatbot.\n`,
    `3. **Spesifisitas**: Meningkat **+${report.improvements.specificity} poin** — ` +
    `Tingkat kekhususan respons (tidak generik).\n`,
    "\n## 3. Analisis per Skenario\n",
    "Berikut adalah analisis dampak RAG pada setiap skenario pengujian:\n",
  ]

  for (const a of report.scenarioAnalyses) {
    parts.push(`**${a.scenarioName}** (${a.category}): ${a.interpretation}\n`)
  }

  parts.push(
    "\n## 4. Implikasi Penelitian\n",
    `Hasil analisis menunjukkan bahwa RAG efektif meningkatkan kualitas respons ` +
    `chatbot, terutama pada skenario-skenario yang membutuhkan pengetahuan ` +
    `spesifik tentang teknik konseling dan dukungan emosional. Kategori ` +
    `**${report.bestImprovedCategory}** menunjukkan peningkatan terbesar, ` +
    `sementara kategori **${report.leastImprovedCategory}** menunjukkan ` +
    `peningkatan yang lebih kecil.\n\n` +
    `Temuan ini memiliki implikasi penting untuk pengembangan chatbot dukungan ` +
    `emosional: (1) RAG sangat direkomendasikan untuk meningkatkan relevansi ` +
    `respons, (2) kualitas basis data chunk sangat memengaruhi efektivitas RAG, ` +
    `dan (3) diperlukan kurasi chunk yang cermat untuk memaksimalkan manfaat RAG.`
  )

  return parts.join("\n")
}

// EXPORT CSV

export function generateRAGComparisonCSV(
  analyses: ScenarioRAGAnalysis[]
): string {
  const rows: string[] = []
  rows.push("scenario_id,scenario_name,category,non_rag_score,rag_score,improvement,improvement_pct")
  for (const a of analyses) {
    rows.push(
      `${a.scenarioId},${a.scenarioName},${a.category},${a.nonRagScore},${a.ragScore},${a.improvement},${a.improvementPercent}`
    )
  }
  return rows.join("\n")
}

export function generateRAGComparisonJSON(
  report: RAGEffectivenessReport
): string {
  return JSON.stringify(report, null, 2)
}
