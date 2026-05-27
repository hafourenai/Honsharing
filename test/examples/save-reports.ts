/**
 * SAVE REPORTS â€” Simpan semua output evaluasi ke file markdown
 *
 * Cara pakai:
 *   npx tsx test/examples/save-reports.ts
 */

import { runFullEvaluation } from "@test/runner/evaluation-runner"
import { compareAllScenarios, generateComparisonTable } from "@test/runner/rag-vs-non-rag"
import { generateMarkdownSummary, generateJsonSummary, generateCsv } from "@test/statistics/statistical-summary"
import { writeFileSync, mkdirSync } from "fs"
import { join } from "path"

const OUT = join(__dirname, "..", "generated-reports")
mkdirSync(OUT, { recursive: true })

async function main() {
  const { report, academicMarkdown, visualizationData } =
    await runFullEvaluation({ useDeterministic: true, verbose: true, saveToFile: false, outputPath: "./generated-reports" })

  const ragComparison = await compareAllScenarios()
  const comparisonTable = generateComparisonTable(ragComparison)
  const summaryMarkdown = generateMarkdownSummary(report)
  const jsonSummary = generateJsonSummary(report)
  const csvData = generateCsv(report.results)

  // 1. Academic report (BAB 4)
  writeFileSync(join(OUT, "01-academic-report-bab4.md"), academicMarkdown, "utf-8")
  console.log(`✓ 01-academic-report-bab4.md (${academicMarkdown.length} chars)`)

  // 2. RAG vs Non-RAG comparison
  writeFileSync(join(OUT, "02-rag-vs-non-rag.md"), comparisonTable, "utf-8")
  console.log(`✓ 02-rag-vs-non-rag.md (${comparisonTable.length} chars)`)

  // 4. Combined summary
  const combined = `# Hasil Evaluasi Sistem RAG Chatbot Curhat

## Ringkasan

| Metrik | Nilai |
|--------|-------|
| Rata-rata Skor | ${report.aggregateStats.averageOverallScore}/100 |
| Skor Tertinggi | ${report.aggregateStats.highestScore}/100 |
| Skor Terendah | ${report.aggregateStats.lowestScore}/100 |
| Standar Deviasi | ${report.aggregateStats.standardDeviation} |
| Jumlah Skenario | ${report.results.length} |
| Skenario Lulus (>=70) | ${report.results.filter(r => r.overallScore >= 70).length}/${report.results.length} |
| RAG Improvement | ${ragComparison.averageImprovement} poin (${ragComparison.averageImprovementPercent}) |
| RAG Wins | ${ragComparison.ragWins}/${ragComparison.totalScenarios} |

## Rata-rata per Dimensi

| Dimensi | Skor |
|---------|------|
| Similarity | ${report.aggregateStats.categoryAverages.similarity} |
| Relevance | ${report.aggregateStats.categoryAverages.relevance} |
| Empathy | ${report.aggregateStats.categoryAverages.empathy} |
| Contextual Consistency | ${report.aggregateStats.categoryAverages.contextualConsistency} |
| Retrieval Accuracy | ${report.aggregateStats.categoryAverages.retrievalAccuracy} |
| **Overall** | **${report.aggregateStats.averageOverallScore}** |

${summaryMarkdown}

${comparisonTable}

## Data Visualisasi (JSON)

\`\`\`json
${JSON.stringify(visualizationData, null, 2)}
\`\`\`

## Ringkasan Statistik (JSON)

\`\`\`json
${JSON.stringify(jsonSummary, null, 2)}
\`\`\`

## Data CSV

\`\`\`
${csvData}
\`\`\`
`
  writeFileSync(join(OUT, "03-full-results.md"), combined, "utf-8")
  console.log(`✓ 03-full-results.md (${combined.length} chars)`)

  // 4. JSON data
  writeFileSync(join(OUT, "04-statistical-summary.json"), JSON.stringify(jsonSummary, null, 2), "utf-8")
  console.log(`✓ 04-statistical-summary.json`)

  // 5. CSV
  writeFileSync(join(OUT, "05-evaluation-data.csv"), csvData, "utf-8")
  console.log(`✓ 05-evaluation-data.csv (${csvData.split("\n").length} rows)`)

  console.log(`\nSemua file tersimpan di: ${OUT}`)
}

main().catch(err => { console.error(err); process.exit(1) })
