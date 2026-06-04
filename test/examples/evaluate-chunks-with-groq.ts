/**
 * EVALUASI CHUNK-DRIVEN + GROQ API REAL
 * 
 * Memanggil chatbot via API asli (Groq) untuk setiap skenario
 * yang di-generate dari rag-chunks.json, lalu evaluasi responsnya.
 *
 * Prasyarat:
 *   1. Server jalan: npm run dev (localhost:3000)
 *   2. Groq API key terisi di .env
 *
 * Cara jalankan:
 *   npx tsx test/examples/evaluate-chunks-with-groq.ts
 */

import { runChunkDrivenRealEvaluation } from "@test/real-evaluation/real-evaluation-runner"
import { GENERATED_SCENARIOS } from "@test/scenarios/generated-from-chunks"
import { generateCoverageReport } from "@test/coverage/coverage-report"
import { writeFileSync, mkdirSync } from "fs"
import { join } from "path"

const OUT = join(__dirname, "..", "generated-reports")
mkdirSync(OUT, { recursive: true })

async function main() {
  console.log("=".repeat(70))
  console.log("EVALUASI CHUNK-DRIVEN + GROQ API")
  console.log("=".repeat(70))
  console.log()
  console.log(`Total skenario: ${GENERATED_SCENARIOS.length} (dari rag-chunks.json)`)
  console.log(`Setiap input berasal dari trigger_phrases chunk — on-topic 100%`)
  console.log()

  // 1. Jalankan real evaluation dengan chunk-driven mode
  const result = await runChunkDrivenRealEvaluation({
    enableRetrievalInspection: true,
    enableQualityAnalysis: true,
    enableFailureAnalysis: true,
    enableAcademicInterpretation: true,
    enableReportGeneration: true,
    outputDir: "./generated-reports",
  })

  // 2. Tampilkan ringkasan
  const summary = result.session.summary
  console.log("\n" + "=".repeat(70))
  console.log("RINGKASAN HASIL EVALUASI REAL")
  console.log("=".repeat(70))
  console.log(`Mode           : REAL (Groq API)`)
  console.log(`Source         : ${GENERATED_SCENARIOS.length} skenario dari rag-chunks.json`)
  console.log(`Durasi         : ${result.durationMs}ms`)
  console.log()
  console.log(`Similarity     : ${summary.averageSimilarity.toFixed(1)}`)
  console.log(`Empathy        : ${summary.averageEmpathy.toFixed(1)}`)
  console.log(`Relevance      : ${summary.averageRelevance.toFixed(1)}`)
  console.log(`Retrieval      : ${summary.averageRetrieval.toFixed(1)}`)
  console.log()

  // 3. Tampilkan detail per skenario
  console.log("-".repeat(70))
  console.log("DETAIL PER SKENARIO")
  console.log("-".repeat(70))

  for (const entry of result.session.entries) {
    console.log(`\n[${entry.scenarioId}] ${entry.scenarioName}`)
    console.log(`  Input   : "${entry.userInput.substring(0, 60)}..."`)
    console.log(`  Response: "${entry.generatedResponse.substring(0, 80)}..."`)
    console.log(`  Skor    : Sim=${entry.similarityScore} Emp=${entry.empathyScore} Rel=${entry.relevanceScore} Ret=${entry.retrievalScore}`)
    console.log(`  Label   : ${entry.qualityLabel} (${entry.responseTimeMs}ms)`)
  }

  // 4. Failure analysis
  if (result.failureResults.length > 0) {
    const failed = result.failureResults.filter(f => f.label === "FAILED").length
    const weak = result.failureResults.filter(f => f.label === "WEAK").length
    console.log("\n" + "-".repeat(70))
    console.log("FAILURE ANALYSIS")
    console.log("-".repeat(70))
    console.log(`GOOD: ${result.failureResults.filter(f => f.label === "GOOD").length}`)
    console.log(`WEAK: ${weak}`)
    console.log(`FAILED: ${failed}`)

    for (const f of result.failureResults.filter(f => f.label !== "GOOD")) {
      const issue = f.isIrrelevant ? "Irrelevant" :
        f.isWrongContext ? "Wrong context" :
        f.isGenericResponse ? "Generic" :
        f.isHallucination ? "Hallucination" :
        f.isEmotionalMismatch ? "Emotional mismatch" : ""
      console.log(`  [${f.scenarioId}] ${f.label}: ${issue}`)
    }
  }

  // 5. Coverage report
  console.log("\n" + "-".repeat(70))
  console.log("COVERAGE REPORT")
  console.log("-".repeat(70))
  const coverage = generateCoverageReport()
  console.log(coverage.summary)
  console.log(`Legacy coverage    : ${coverage.legacyCoveragePercent}`)
  console.log(`Chunk-driven cover : ${coverage.generatedCoveragePercent}`)
  console.log(`Overall coverage   : ${coverage.overallCoveragePercent}`)

  // 6. Simpan semua laporan
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")

  writeFileSync(join(OUT, `${timestamp}_chunk-groq-session.md`), result.markdownLog || "", "utf-8")
  console.log(`\n✅ Session log: ${timestamp}_chunk-groq-session.md`)

  if (result.interpretation) {
    const interp = `# Interpretasi Akademik\n\n## Executive Summary\n${result.interpretation.executiveSummary}\n\n## Saran\n${result.interpretation.suggestions.map((s, i) => `${i + 1}. ${s}`).join("\n")}`
    writeFileSync(join(OUT, `${timestamp}_chunk-groq-interpretation.md`), interp, "utf-8")
    console.log(`✅ Interpretation: ${timestamp}_chunk-groq-interpretation.md`)
  }

  writeFileSync(join(OUT, `${timestamp}_chunk-groq-coverage.md`), coverage.markdown, "utf-8")
  console.log(`✅ Coverage report: ${timestamp}_chunk-groq-coverage.md`)

  console.log(`\nSemua file tersimpan di: ${OUT}`)
}

main().catch((err) => {
  console.error("Gagal:", err)
  process.exit(1)
})
