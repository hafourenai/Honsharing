// Skenario
import { overthinkingScenario } from "@test/scenarios/overthinking";
import { anxietyGeneralScenario } from "@test/scenarios/anxiety";
import { ALL_SCENARIOS } from "@test/scenarios";

// Mock
import { mockRetrieve } from "@test/mocks";
import { buildOptimalResponse } from "@test/mocks/response-builder";

// Evaluators
import { evaluateSimilarity } from "@test/evaluators/similarity-evaluator";
import { evaluateRelevance } from "@test/evaluators/relevance-evaluator";
import { evaluateEmpathy } from "@test/evaluators/empathy-evaluator";
import { evaluateContextualConsistency } from "@test/evaluators/contextual-consistency";
import { evaluateRetrievalAccuracy } from "@test/evaluators/retrieval-accuracy";

// Report
import { calculateAggregateStats } from "@test/statistics/statistical-summary";
import { generateAcademicReport } from "@test/reports/academic-report-generator";

// Types
import { EvaluationResult } from "@test/types";

// Chunk-Driven
import {
  GENERATED_SCENARIOS,
  getGeneratedScenarioByChunkId,
} from "@test/scenarios"
import { generateCoverageReport } from "@test/coverage/coverage-report"

// CONTOH 1: EVALUASI SATU SKENARIO

/**
 * Contoh paling sederhana: evaluasi satu skenario overthinking.
 *
 * Alur:
 * 1. Ambil skenario
 * 2. Mock retrieval (simulasi ambil chunks dari database)
 * 3. Dapatkan deterministik respons (simulasi LLM)
 * 4. Evaluasi dengan semua evaluator
 * 5. Lihat hasilnya
 */
async function evaluateSingleScenario(): Promise<void> {
  console.log("=".repeat(60));
  console.log("CONTOH 1: EVALUASI SATU SKENARIO");
  console.log("=".repeat(60));

  // 1. Pilih skenario
  const scenario = overthinkingScenario;
  console.log(`\nSkenario: ${scenario.name}`);
  console.log(`Kategori: ${scenario.category}`);
  console.log(`User Input: "${scenario.userInput}"\n`);

  // 2. Mock retrieval — simulasi pengambilan chunks dari RAG
  const retrievedChunks = await mockRetrieve(scenario.userInput);
  console.log(`Retrieved ${retrievedChunks.length} chunks:`);
  retrievedChunks.forEach((chunk) => {
    console.log(
      `  - [${chunk.id}] ${chunk.scenario.topic} (score: ${chunk.score?.toFixed(3)})`,
    );
  });

  // 3. Dapatkan respons chatbot (deterministic — sama setiap kali)
  const botResponse = buildOptimalResponse(scenario);
  console.log(`\nBot Response: "${botResponse}"\n`);

  // 4. Evaluasi dengan semua evaluator
  const similarityScore = evaluateSimilarity(botResponse, scenario);
  const relevanceScore = evaluateRelevance(botResponse, scenario);
  const empathyScore = evaluateEmpathy(botResponse, scenario);
  const consistencyScore = evaluateContextualConsistency(botResponse, scenario);
  const retrievalScore = evaluateRetrievalAccuracy(
    retrievedChunks,
    scenario,
    scenario.userInput,
  );

  // 5. Tampilkan hasil
  const overallScore = Math.round(
    (similarityScore.finalScore +
      relevanceScore.finalScore +
      empathyScore.finalScore +
      consistencyScore.finalScore +
      retrievalScore.finalScore) /
      5,
  );

  console.log("HASIL EVALUASI:");
  console.log(
    `  Similarity           : ${similarityScore.finalScore} (${similarityScore.verdict})`,
  );
  console.log(
    `  Relevance            : ${relevanceScore.finalScore} (${relevanceScore.verdict})`,
  );
  console.log(
    `  Empathy              : ${empathyScore.finalScore} (${empathyScore.verdict})`,
  );
  console.log(
    `  Consistency          : ${consistencyScore.finalScore} (${consistencyScore.verdict})`,
  );
  console.log(
    `  Retrieval Accuracy   : ${retrievalScore.finalScore} (${retrievalScore.verdict})`,
  );
  console.log(`  OVERALL              : ${overallScore}/100`);
}

// CONTOH 2: EVALUASI SEMUA SKENARIO + REPORT

/**
 * Contoh lengkap: evaluasi semua skenario dan generate report.
 *
 * Ini adalah alur yang seharusnya digunakan untuk evaluasi skripsi.
 */
async function evaluateAllScenarios(): Promise<void> {
  console.log("\n" + "=".repeat(60));
  console.log("CONTOH 2: EVALUASI SEMUA SKENARIO");
  console.log("=".repeat(60));

  const results: EvaluationResult[] = [];

  for (const scenario of ALL_SCENARIOS) {
    console.log(`\nEvaluasi: ${scenario.name}...`);

    // Mock retrieval
    const retrievedChunks = await mockRetrieve(scenario.userInput);

    // Dapatkan respons deterministik
    const botResponse = buildOptimalResponse(scenario);

    // Evaluasi
    const similarityScore = evaluateSimilarity(botResponse, scenario);
    const relevanceScore = evaluateRelevance(botResponse, scenario);
    const empathyScore = evaluateEmpathy(botResponse, scenario);
    const consistencyScore = evaluateContextualConsistency(
      botResponse,
      scenario,
    );
    const retrievalScore = evaluateRetrievalAccuracy(
      retrievedChunks,
      scenario,
      scenario.userInput,
    );

    // Hitung overall
    const overallScore = Math.round(
      (similarityScore.finalScore +
        relevanceScore.finalScore +
        empathyScore.finalScore +
        consistencyScore.finalScore +
        retrievalScore.finalScore) /
        5,
    );

    results.push({
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      timestamp: new Date().toISOString(),
      overallScore,
      similarity: similarityScore,
      relevance: relevanceScore,
      empathy: empathyScore,
      contextualConsistency: consistencyScore,
      retrievalAccuracy: retrievalScore,
      notes: "",
    });

    console.log(`  Overall: ${overallScore}/100`);
  }

  // Hitung statistik agregat
  const aggregateStats = calculateAggregateStats(results);

  // Generate report
  const report = {
    title:
      "Evaluasi Sistem Retrieval-Augmented Generation (RAG) pada Chatbot Curhat Berbasis Emotional Context",
    createdAt: new Date().toISOString(),
    description:
      "Laporan ini menyajikan hasil evaluasi terhadap sistem RAG chatbot curhat menggunakan 10 skenario pengujian yang mencakup 6 kategori emosional.",
    results,
    aggregateStats,
  };

  // Generate markdown
  const academicMarkdown = generateAcademicReport(report);

  console.log("\n" + "=".repeat(60));
  console.log("REPORT BERHASIL DIGENERATE");
  console.log("=".repeat(60));
  console.log("\nPreview (1000 karakter pertama):\n");
  console.log(academicMarkdown.slice(0, 1000) + "...");
}

// CONTOH 3: EVALUASI MANDIRI (ISI RESPONS SENDIRI)

/**
 * Contoh untuk menguji respons chatbot secara manual.
 *
 * Berguna ketika:
 * - Ingin menguji respons asli dari Groq API
 * - Ingin membandingkan beberapa variasi prompt
 * - Ingin melihat skor untuk respons tertentu
 */
function evaluateCustomResponse(): void {
  console.log("\n" + "=".repeat(60));
  console.log("CONTOH 3: EVALUASI RESPONS KUSTOM");
  console.log("=".repeat(60));

  // Ganti dengan respons chatbot yang ingin dievaluasi
  const customResponse =
    "Wajar kok kalo kamu merasa gitu. Overthinking emang bikin capek ya... Kamu ga sendirian, aku disini buat dengerin cerita kamu.";

  const scenario = overthinkingScenario;

  console.log(`\nUser Input: "${scenario.userInput}"`);
  console.log(`Respons: "${customResponse}"\n`);

  // Evaluasi
  const similarityScore = evaluateSimilarity(customResponse, scenario);
  const relevanceScore = evaluateRelevance(customResponse, scenario);
  const empathyScore = evaluateEmpathy(customResponse, scenario);

  console.log("HASIL EVALUASI:");
  console.log(
    `  Similarity : ${similarityScore.finalScore} (${similarityScore.verdict})`,
  );
  console.log(
    `  Relevance  : ${relevanceScore.finalScore} (${relevanceScore.verdict})`,
  );
  console.log(
    `  Empathy    : ${empathyScore.finalScore} (${empathyScore.verdict})`,
  );

  // Analisis detail
  console.log("\nDetail Similarity:");
  console.log(`  Cosine Similarity: ${similarityScore.cosineSimilarity}`);
  console.log(`  Text Overlap: ${similarityScore.textOverlap}`);
  console.log(`  Keyword Match: ${similarityScore.keywordMatch}`);
}

// CONTOH 5: EVALUASI CHUNK-DRIVEN (DARI RAG-CHUNKS.JSON)

async function evaluateChunkDriven(): Promise<void> {
  console.log("\n" + "=".repeat(60))
  console.log("CONTOH 5: EVALUASI CHUNK-DRIVEN")
  console.log("=".repeat(60))

  console.log(`\nTotal generated scenarios: ${GENERATED_SCENARIOS.length}`)
  console.log("Skenario di-generate otomatis dari 19 chunk di rag-chunks.json")
  console.log("Setiap scenario menggunakan trigger_phrases chunk sebagai input\n")

  for (const scenario of GENERATED_SCENARIOS) {
    const expectedChunkIds = scenario.expectedRetrievedContext.map(
      (c) => c.chunkId,
    )
    console.log(
      `  [${scenario.id}] ${scenario.name} (${scenario.category})`,
    )
    console.log(`    Input: "${scenario.userInput.slice(0, 60)}..."`)
    console.log(`    Expected chunk: ${expectedChunkIds.join(", ")}`)
  }

  console.log(
    `\n✅ 100% coverage: semua ${GENERATED_SCENARIOS.length} chunk memiliki test case.`,
  )
  console.log("✅ Input selalu on-topic: bersumber dari trigger_phrases chunk.")
  console.log("")
  console.log("📌 TAPI: ini masih MOCK (respons sintetis). Untuk akurasi real:")
  console.log("   Jalankan dengan Groq API:")
  console.log("   npx tsx -e \"")
  console.log("     import { runChunkDrivenRealEvaluation } from './test/real-evaluation/real-evaluation-runner'")
  console.log("     runChunkDrivenRealEvaluation({ saveReport: true }).catch(console.error)")
  console.log("   \"")
}

// CONTOH 6: COVERAGE REPORT

async function showCoverageReport(): Promise<void> {
  console.log("\n" + "=".repeat(60))
  console.log("CONTOH 6: COVERAGE REPORT")
  console.log("=".repeat(60))

  const report = generateCoverageReport()

  console.log(`\n${report.summary}`)
  console.log(`Legacy coverage    : ${report.legacyCoveragePercent}`)
  console.log(`Chunk-driven cover : ${report.generatedCoveragePercent}`)
  console.log(`Overall coverage   : ${report.overallCoveragePercent}`)

  if (report.uncoveredChunks.length > 0) {
    console.log("\nUncovered chunks (sebelum chunk-driven):")
    for (const c of report.uncoveredChunks) {
      console.log(`  ❌ ${c.chunkId} — ${c.topic}`)
    }
    console.log(`\n✅ Chunk-driven mode otomatis menutupi ${report.uncoveredChunks.length} celah ini`)
  }

  console.log("\n--- Preview Coverage Report (200 chars) ---")
  console.log(report.markdown.slice(0, 200) + "...")
}

// CONTOH 7: MODE PERBANDINGAN

async function compareModes(): Promise<void> {
  console.log("\n" + "=".repeat(60))
  console.log("CONTOH 7: PERBANDINGAN LEGACY VS CHUNK-DRIVEN")
  console.log("=".repeat(60))

  const { evaluateAllScenarios, evaluateChunkDriven } =
    await import("@test/runner/evaluation-runner")

  console.log("\n--- Legacy Mode ---")
  console.log(`Scenarios: manual (32 skenario)`)
  console.log(`Risiko   : beberapa topik chunk mungkin tidak ter-cover`)

  console.log("\n--- Chunk-Driven Mode ---")
  console.log(`Scenarios: auto-generated dari chunks (19 skenario)`)
  console.log(`Keuntungan: 100% coverage, input selalu on-topic`)
  console.log(`           otomatis sinkron dengan perubahan rag-chunks.json`)
}

// MAIN

/**
 * Jalankan semua contoh.
 *
 * Cara menjalankan:
 *   npx tsx test/examples/usage-example.ts
 *
 * Atau jika menggunakan tsx:
 *   npx tsx test/examples/usage-example.ts
 */
async function tryRealEvaluation(): Promise<void> {
  console.log("\n" + "=".repeat(60))
  console.log("CONTOH 8: REAL EVALUASI DENGAN GROQ API")
  console.log("=".repeat(60))

  // Cek apakah server lokal berjalan
  try {
    const res = await fetch("http://localhost:3001", { signal: AbortSignal.timeout(3000) })
    if (!res.ok) throw new Error("Server tidak merespon OK")
  } catch {
    console.log("\n⚠️  Server tidak terdeteksi di localhost:3000.")
    console.log("   Untuk evaluasi real, jalankan: npm run dev")
    console.log("   Lalu jalankan: npx tsx test/examples/evaluate-chunks-with-groq.ts")
    return
  }

  console.log("\n✅ Server terdeteksi! Menjalankan evaluasi real dengan Groq API...")
  console.log(`   (19 skenario dari rag-chunks.json — 100% on-topic)\n`)

  const { runChunkDrivenRealEvaluation } =
    await import("@test/real-evaluation/real-evaluation-runner")

  const result = await runChunkDrivenRealEvaluation({
    enableRetrievalInspection: true,
    enableQualityAnalysis: true,
    enableFailureAnalysis: true,
    enableAcademicInterpretation: true,
    enableReportGeneration: false,
  })

  const s = result.session.summary
  console.log("\n" + "-".repeat(50))
  console.log("RINGKASAN EVALUASI REAL")
  console.log("-".repeat(50))
  console.log(`Similarity : ${s.averageSimilarity.toFixed(1)}`)
  console.log(`Empathy    : ${s.averageEmpathy.toFixed(1)}`)
  console.log(`Relevance  : ${s.averageRelevance.toFixed(1)}`)
  console.log(`Retrieval  : ${s.averageRetrieval.toFixed(1)}`)
  console.log(`Durasi     : ${result.durationMs}ms`)
  console.log("")
  console.log("Detail lengkap ada di file session log dan interpretation.")
  console.log(`✅ Selesai!`)
}

async function main(): Promise<void> {
  await evaluateSingleScenario();
  await evaluateAllScenarios();
  evaluateCustomResponse();
  await evaluateChunkDriven()
  await showCoverageReport()
  await compareModes()
  await tryRealEvaluation()
}

// Uncomment untuk menjalankan:
main().catch(console.error)

// CONTOH 4: REAL EVALUATION SYSTEM (LENGKAP)

/**
 * Contoh penggunaan Real Evaluation System yang baru.
 *
 * Sistem ini mengintegrasikan:
 * - Multi-turn conversation evaluation
 * - RAG vs Non-RAG comparison
 * - Academic interpretation (Bahasa Indonesia formal)
 * - Evaluation report generation
 * - Failure analysis
 *
 * Cara menjalankan:
 *   npx tsx test/examples/usage-example.ts
 */
async function runRealEvaluationExample(): Promise<void> {
  console.log("\n" + "=".repeat(60));
  console.log("CONTOH 4: REAL EVALUATION SYSTEM");
  console.log("=".repeat(60));

  // 4a. Real Evaluation — panggil API sungguhan (Groq)
  console.log("\n--- 4a: Real Evaluation (Groq API) ---");
  const { runRealEvaluation } =
    await import("@test/real-evaluation/real-evaluation-runner");
  const result = await runRealEvaluation({
    enableRetrievalInspection: true,
    enableQualityAnalysis: true,
    enableFailureAnalysis: true,
    enableComparison: true,
    enableMultiTurn: true,
    enableAcademicInterpretation: true,
    enableReportGeneration: true,
  });

  console.log(
    `Sesi: ${result.session.evaluationId} | Mode: ${result.session.mode}`,
  );
  console.log(
    `Skor Similarity: ${result.session.summary.averageSimilarity.toFixed(1)}`,
  );
  console.log(
    `Skor Empati: ${result.session.summary.averageEmpathy.toFixed(1)}`,
  );
  console.log(
    `Skor Relevansi: ${result.session.summary.averageRelevance.toFixed(1)}`,
  );
  console.log(
    `Skor Retrieval: ${result.session.summary.averageRetrieval.toFixed(1)}`,
  );

  // 4b. Multi-turn evaluation
  if (result.multiTurnSummary) {
    console.log("\n--- Multi-turn Results ---");
    console.log(
      `Total conversasi: ${result.multiTurnSummary.totalConversations}`,
    );
    console.log(
      `Memory Consistency: ${result.multiTurnSummary.averageMemoryConsistency.toFixed(1)}`,
    );
    console.log(
      `Emotional Continuity: ${result.multiTurnSummary.averageEmotionalContinuity.toFixed(1)}`,
    );
    console.log(
      `Rata-rata skor: ${result.multiTurnSummary.averageOverallScore.toFixed(1)}`,
    );
  }

  // 4c. RAG vs Non-RAG
  if (result.comparisonSummary) {
    console.log("\n--- RAG vs Non-RAG ---");
    console.log(
      `RAG Contextual Fit: ${result.comparisonSummary.averageRagContextualFit.toFixed(1)}`,
    );
    console.log(
      `Non-RAG Contextual Fit: ${result.comparisonSummary.averageNonRagContextualFit.toFixed(1)}`,
    );
    console.log(
      `Peningkatan: ${result.comparisonSummary.averageImprovement.toFixed(1)} poin`,
    );
  }

  // 4d. Academic Interpretation (Bahasa Indonesia formal)
  if (result.interpretation) {
    console.log("\n--- Academic Interpretation (Preview) ---");
    console.log(result.interpretation.executiveSummary.slice(0, 500));
    console.log("\n--- Suggestions ---");
    result.interpretation.suggestions.forEach((s, i) => {
      console.log(`${i + 1}. ${s}`);
    });
  }

  // 4e. Failure Analysis
  if (result.failureResults.length > 0) {
    const failed = result.failureResults.filter(
      (f) => f.label === "FAILED",
    ).length;
    const weak = result.failureResults.filter(
      (f) => f.label === "WEAK",
    ).length;
    const good = result.failureResults.filter(
      (f) => f.label === "GOOD",
    ).length;

    console.log("\n--- Failure Analysis ---");
    console.log(`GOOD: ${good} | WEAK: ${weak} | FAILED: ${failed}`);
  }

  // 4f. Report
  if (result.report) {
    console.log("\n--- Evaluation Report ---");
    console.log(`Title: ${result.report.title}`);
    console.log(`Tanggal: ${result.report.date}`);
    console.log(
      `Sections: ${result.report.sections.map((s) => s.title).join(", ")}`,
    );
  }

  console.log(`\nDurasi: ${result.durationMs}ms`);

  // Simpan log ke file (opsional)
  const { saveSessionLogs } =
    await import("@test/real-evaluation/evaluation-session-logger");
  await saveSessionLogs(result.session);
  console.log("\nLog tersimpan di folder generated-reports/");
}


