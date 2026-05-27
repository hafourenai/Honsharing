

import { runFullEvaluation } from "@test/runner/evaluation-runner";
import {
  compareAllScenarios,
  generateComparisonTable,
} from "@test/runner/rag-vs-non-rag";
import {
  generateMarkdownSummary,
  generateJsonSummary,
  generateCsv,
} from "@test/statistics/statistical-summary";
import {
  visualizeToJson,
  generateScoreDistributionTable,
} from "@test/generated-reports/visualization-data";

// MAIN

async function main(): Promise<void> {
  console.log("=".repeat(70));
  console.log("EVALUASI SISTEM RAG CHATBOT CURHAT");
  console.log("Untuk keperluan Skripsi â€” BAB 4 Hasil dan Pembahasan");
  console.log("=".repeat(70));
  console.log();

  // 1. JALANKAN EVALUASI SEMUA SKENARIO

  console.log("\n[1/5] Menjalankan evaluasi semua skenario...\n");
  const { report, academicMarkdown, visualizationData } =
    await runFullEvaluation({
      useDeterministic: true,
      verbose: true,
      saveToFile: false,
      outputPath: "./generated-reports",
    });

  // 2. JALANKAN PERBANDINGAN RAG VS NON-RAG

  console.log("\n\n[2/5] Menjalankan perbandingan RAG vs Non-RAG...\n");
  const ragComparison = await compareAllScenarios();
  const comparisonTable = generateComparisonTable(ragComparison);

  // 3. GENERATE STATISTICAL SUMMARY

  console.log("\n\n[3/5] Menghasilkan ringkasan statistik...");
  const summaryMarkdown = generateMarkdownSummary(report);
  const summaryJson = generateJsonSummary(report);
  const csvData = generateCsv(report.results);

  // 4. GENERATE DATA VISUALISASI

  console.log("[4/5] Menghasilkan data visualisasi...");
  const vizJson = visualizeToJson(visualizationData);
  const scoreDistTable = generateScoreDistributionTable(report.results);

  // 5. TAMPILKAN OUTPUT

  console.log("\n[5/5] Menampilkan hasil...\n");

  // Print ringkasan statistik
  console.log("\n" + "=".repeat(70));
  console.log("RINGKASAN STATISTIK");
  console.log("=".repeat(70));
  console.log(summaryMarkdown);

  // Print tabel distribusi skor
  console.log(scoreDistTable);

  // Print tabel perbandingan
  console.log(comparisonTable);

  // Print sample academic report (first 2000 chars)
  console.log("\n" + "=".repeat(70));
  console.log("PREVIEW ACADEMIC REPORT (BAB 4)");
  console.log("(2000 karakter pertama)");
  console.log("=".repeat(70));
  console.log();
  console.log(academicMarkdown.slice(0, 2000));
  console.log("\n...");

  // Info tentang output lengkap
  console.log("\n" + "=".repeat(70));
  console.log("INFORMASI OUTPUT");
  console.log("=".repeat(70));
  console.log();
  console.log("Output yang tersedia:");
  console.log();
  console.log(`1. Academic Report (${academicMarkdown.length} chars)`);
  console.log(`   → Format BAB 4 Skripsi - Bahasa Indonesia formal`);
  console.log(
    `   → Mencakup: tujuan, metode, hasil, analisis, interpretasi, kesimpulan`,
  );
  console.log();
  console.log(`2. RAG vs Non-RAG Comparison Table`);
  console.log(
    `   â†’ Menunjukkan peningkatan RAG: ${ragComparison.averageNonRagScore} â†’ ${ragComparison.averageRagScore}`,
  );
  console.log(
    `   â†’ RAG menang: ${ragComparison.ragWins}/${ragComparison.totalScenarios} skenario`,
  );
  console.log();
  console.log(`3. Statistical Summary (JSON)`);
  console.log(`   â†’ ${Object.keys(summaryJson).length} key statistik`);
  console.log();
  console.log(`4. Visualization Data (JSON)`);
  console.log(
    `   â†’ ${Object.keys(visualizationData).length} tipe data visualisasi`,
  );
  console.log(`   â†’ Termasuk: bar chart, pie chart, score distribution`);
  console.log();
  console.log(`5. CSV Data (${csvData.split("\n").length - 1} baris data)`);
  console.log(`   â†’ Siap dibuka di Excel atau diolah di SPSS`);

  // Tampilkan JSON statistik
  console.log("\n" + "=".repeat(70));
  console.log("JSON STATISTICAL SUMMARY");
  console.log("=".repeat(70));
  console.log(JSON.stringify(summaryJson, null, 2));

  // Tampilkan sample CSV (5 baris pertama)
  console.log("\n" + "=".repeat(70));
  console.log("CSV DATA (5 baris pertama)");
  console.log("=".repeat(70));
  console.log(csvData.split("\n").slice(0, 6).join("\n"));
  console.log("...");

  console.log("\n" + "=".repeat(70));
  console.log("EVALUASI SELESAI!");
  console.log("=".repeat(70));
  console.log(`Total skenario: ${report.results.length}`);
  console.log(
    `Rata-rata skor: ${report.aggregateStats.averageOverallScore}/100`,
  );
  console.log(
    `RAG improvement: ${ragComparison.averageImprovement} poin (${ragComparison.averageImprovementPercent})`,
  );
  console.log();
  console.log("Semua data siap digunakan untuk BAB 4 skripsi.");
  console.log("Selamat sidang! ðŸ“š");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
