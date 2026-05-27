

// IMPORT

// Skenario
import { overthinkingScenario } from "@test/scenarios/overthinking";
import { anxietyGeneralScenario } from "@test/scenarios/anxiety";
import { ALL_SCENARIOS } from "@test/scenarios";

// Mock
import { mockRetrieve, getDeterministicResponse } from "@test/mocks";

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

  // 2. Mock retrieval â€” simulasi pengambilan chunks dari RAG
  const retrievedChunks = await mockRetrieve(scenario.userInput);
  console.log(`Retrieved ${retrievedChunks.length} chunks:`);
  retrievedChunks.forEach((chunk) => {
    console.log(
      `  - [${chunk.id}] ${chunk.scenario.topic} (score: ${chunk.score?.toFixed(3)})`,
    );
  });

  // 3. Dapatkan respons chatbot (deterministic â€” sama setiap kali)
  const botResponse = getDeterministicResponse(scenario.id);
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
    const botResponse = getDeterministicResponse(scenario.id);

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

// MAIN

/**
 * Jalankan semua contoh.
 *
 * Cara menjalankan:
 *   npx ts-node test/examples/usage-example.ts
 *
 * Atau jika menggunakan tsx:
 *   npx tsx test/examples/usage-example.ts
 */
async function main(): Promise<void> {
  await evaluateSingleScenario();
  await evaluateAllScenarios();
  evaluateCustomResponse();
  await runRealEvaluationExample();
}

// Uncomment untuk menjalankan:
// main().catch(console.error)

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

  // 4a. Real Evaluation â€” panggil API sungguhan (Groq)
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


