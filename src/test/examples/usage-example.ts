/**
 * ============================================================
 * CONTOH PENGGUNAAN — SISTEM TESTING & EVALUASI RAG CHATBOT
 * ============================================================
 *
 * File ini menunjukkan cara menggunakan seluruh sistem testing
 * untuk melakukan evaluasi skenario chatbot curhat.
 *
 * ALUR LENGKAP:
 * 1. Pilih skenario
 * 2. Mock retrieval untuk mendapatkan chunks
 * 3. Mock LLM untuk mendapatkan respons
 * 4. Evaluasi respons dengan semua evaluator
 * 5. Generate report
 *
 * @author  Tim Skripsi
 * @version 1.0
 * ============================================================
 */

// IMPORT

// Skenario
import { overthinkingScenario } from "@/test/scenarios/overthinking";
import { anxietyGeneralScenario } from "@/test/scenarios/anxiety";
import { ALL_SCENARIOS } from "@/test/scenarios";

// Mock
import { mockRetrieve, getDeterministicResponse } from "@/test/mocks";

// Evaluators
import { evaluateSimilarity } from "@/test/evaluators/similarity-evaluator";
import { evaluateRelevance } from "@/test/evaluators/relevance-evaluator";
import { evaluateEmpathy } from "@/test/evaluators/empathy-evaluator";
import { evaluateContextualConsistency } from "@/test/evaluators/contextual-consistency";
import { evaluateRetrievalAccuracy } from "@/test/evaluators/retrieval-accuracy";

// Report
import {
  generateMarkdownReport,
  calculateAggregateStats,
} from "@/test/reports/report-generator";

// Types
import { EvaluationResult } from "@/test/types";

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
  const markdown = generateMarkdownReport(report);

  console.log("\n" + "=".repeat(60));
  console.log("REPORT BERHASIL DIGENERATE");
  console.log("=".repeat(60));
  console.log("\nPreview (1000 karakter pertama):\n");
  console.log(markdown.slice(0, 1000) + "...");
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
 *   npx ts-node src/test/examples/usage-example.ts
 *
 * Atau jika menggunakan tsx:
 *   npx tsx src/test/examples/usage-example.ts
 */
async function main(): Promise<void> {
  await evaluateSingleScenario();
  await evaluateAllScenarios();
  evaluateCustomResponse();
  await runRealEvaluationExample();
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
 *   npx tsx src/test/examples/usage-example.ts
 */
async function runRealEvaluationExample(): Promise<void> {
  console.log("\n" + "=".repeat(60));
  console.log("CONTOH 4: REAL EVALUATION SYSTEM");
  console.log("=".repeat(60));

  // 4a. Mock Evaluation — tanpa API, cepat
  console.log("\n--- 4a: Mock Evaluation ---");
  const { runMockEvaluation } =
    await import("@/test/real-evaluation/real-evaluation-runner");
  const mockResult = await runMockEvaluation({
    enableRetrievalInspection: true,
    enableQualityAnalysis: true,
    enableFailureAnalysis: true,
    enableComparison: true,
    enableMultiTurn: true,
    enableAcademicInterpretation: true,
    enableReportGeneration: true,
  });

  console.log(
    `Sesi: ${mockResult.session.evaluationId} | Mode: ${mockResult.session.mode}`,
  );
  console.log(
    `Skor Similarity: ${mockResult.session.summary.averageSimilarity.toFixed(1)}`,
  );
  console.log(
    `Skor Empati: ${mockResult.session.summary.averageEmpathy.toFixed(1)}`,
  );
  console.log(
    `Skor Relevansi: ${mockResult.session.summary.averageRelevance.toFixed(1)}`,
  );
  console.log(
    `Skor Retrieval: ${mockResult.session.summary.averageRetrieval.toFixed(1)}`,
  );

  // 4b. Multi-turn evaluation
  if (mockResult.multiTurnSummary) {
    console.log("\n--- Multi-turn Results ---");
    console.log(
      `Total conversasi: ${mockResult.multiTurnSummary.totalConversations}`,
    );
    console.log(
      `Memory Consistency: ${mockResult.multiTurnSummary.averageMemoryConsistency.toFixed(1)}`,
    );
    console.log(
      `Emotional Continuity: ${mockResult.multiTurnSummary.averageEmotionalContinuity.toFixed(1)}`,
    );
    console.log(
      `Rata-rata skor: ${mockResult.multiTurnSummary.averageOverallScore.toFixed(1)}`,
    );
  }

  // 4c. RAG vs Non-RAG
  if (mockResult.comparisonSummary) {
    console.log("\n--- RAG vs Non-RAG ---");
    console.log(
      `RAG Contextual Fit: ${mockResult.comparisonSummary.averageRagContextualFit.toFixed(1)}`,
    );
    console.log(
      `Non-RAG Contextual Fit: ${mockResult.comparisonSummary.averageNonRagContextualFit.toFixed(1)}`,
    );
    console.log(
      `Peningkatan: ${mockResult.comparisonSummary.averageImprovement.toFixed(1)} poin`,
    );
  }

  // 4d. Academic Interpretation (Bahasa Indonesia formal)
  if (mockResult.interpretation) {
    console.log("\n--- Academic Interpretation (Preview) ---");
    console.log(mockResult.interpretation.executiveSummary.slice(0, 500));
    console.log("\n--- Suggestions ---");
    mockResult.interpretation.suggestions.forEach((s, i) => {
      console.log(`${i + 1}. ${s}`);
    });
  }

  // 4e. Failure Analysis
  if (mockResult.failureResults.length > 0) {
    const failed = mockResult.failureResults.filter(
      (f) => f.label === "FAILED",
    ).length;
    const weak = mockResult.failureResults.filter(
      (f) => f.label === "WEAK",
    ).length;
    const good = mockResult.failureResults.filter(
      (f) => f.label === "GOOD",
    ).length;

    console.log("\n--- Failure Analysis ---");
    console.log(`GOOD: ${good} | WEAK: ${weak} | FAILED: ${failed}`);
  }

  // 4f. Report
  if (mockResult.report) {
    console.log("\n--- Evaluation Report ---");
    console.log(`Title: ${mockResult.report.title}`);
    console.log(`Tanggal: ${mockResult.report.date}`);
    console.log(
      `Sections: ${mockResult.report.sections.map((s) => s.title).join(", ")}`,
    );
  }

  console.log(`\nDurasi: ${mockResult.durationMs}ms`);

  // Simpan log ke file (opsional)
  const { saveSessionLogs } =
    await import("@/test/real-evaluation/evaluation-session-logger");
  await saveSessionLogs(mockResult.session);
  console.log("\nLog tersimpan di folder generated-reports/");
}

/**
 * ============================================================
 * CATATAN PENTING
 * ============================================================
 *
 * 1. File ini menggunakan import path `@/test/...` yang sama
 *    dengan path alias di tsconfig.json (`@/*` -> `./src/*`).
 *
 * 2. Pastikan tsconfig.json memiliki path alias @ yang
 *    mengarah ke ./src:
 *    "paths": { "@/*": ["./src/*"] }
 *
 * 3. Untuk menjalankan, gunakan:
 *    npx tsx src/test/examples/usage-example.ts
 *
 * 4. Untuk evaluasi dengan respons asli Groq, ganti
 *    getDeterministicResponse() dengan panggilan API asli.
 *
 * 5. Semua mock bersifat lokal dan tidak memerlukan API key.
 *
 * ============================================================
 */
