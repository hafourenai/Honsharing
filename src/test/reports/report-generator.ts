/**
 * ============================================================
 * REPORT GENERATOR — GENERATOR LAPORAN EVALUASI
 * ============================================================
 *
 * Modul ini menghasilkan laporan evaluasi dalam format markdown
 * yang siap digunakan untuk dokumentasi skripsi.
 *
 * Fitur:
 * 1. Generate report per skenario
 * 2. Generate report agregat (semua skenario)
 * 3. Generate tabel similarity
 * 4. Generate tabel retrieval relevance
 * 5. Analisis dan interpretasi akademik
 *
 * @author  Tim Skripsi
 * @version 1.0
 * ============================================================
 */

import {
  EvaluationResult,
  EvaluationReport,
  AggregateStats,
} from "@/test/types";
import { TEST_CONFIG } from "@/test/config/test-config";
import { standardDeviation } from "@/test/types/utils/scoring";

// ------------------------------------------------------------------
// GENERATE REPORT MARKDOWN
// ------------------------------------------------------------------

/**
 * Menghasilkan laporan evaluasi lengkap dalam format markdown.
 *
 * @param report - Data evaluasi
 * @returns String markdown laporan
 */
export function generateMarkdownReport(report: EvaluationReport): string {
  const lines: string[] = [];

  // Header
  lines.push(`# Laporan Evaluasi Sistem RAG Chatbot Curhat`);
  lines.push(``);
  lines.push(`**Judul Penelitian:** ${report.title}`);
  lines.push(`**Tanggal:** ${report.createdAt}`);
  lines.push(`**Institusi:** ${TEST_CONFIG.report.institutionName}`);
  lines.push(``);
  lines.push(`---`);
  lines.push(``);
  lines.push(`## Deskripsi`);
  lines.push(``);
  lines.push(report.description);
  lines.push(``);

  // Ringkasan Eksekutif
  lines.push(`## Ringkasan Eksekutif`);
  lines.push(``);
  const stats = report.aggregateStats;
  lines.push(
    `Rata-rata skor keseluruhan: **${stats.averageOverallScore}/100**`,
  );
  lines.push(`Skor tertinggi: **${stats.highestScore}/100**`);
  lines.push(`Skor terendah: **${stats.lowestScore}/100**`);
  lines.push(`Standar deviasi: **${stats.standardDeviation}**`);
  lines.push(``);

  // Distribusi Verdict
  lines.push(`### Distribusi Verdict`);
  lines.push(``);
  lines.push(`| Verdict | Jumlah |`);
  lines.push(`|---------|--------|`);
  for (const [verdict, count] of Object.entries(stats.verdictDistribution)) {
    lines.push(`| ${verdict} | ${count} |`);
  }
  lines.push(``);

  // Rata-rata per kategori
  lines.push(`### Rata-rata Skor per Kategori`);
  lines.push(``);
  lines.push(`| Kategori | Rata-rata |`);
  lines.push(`|----------|-----------|`);
  const categories = stats.categoryAverages;
  lines.push(`| Similarity | ${categories.similarity} |`);
  lines.push(`| Relevance | ${categories.relevance} |`);
  lines.push(`| Empathy | ${categories.empathy} |`);
  lines.push(
    `| Contextual Consistency | ${categories.contextualConsistency} |`,
  );
  lines.push(`| Retrieval Accuracy | ${categories.retrievalAccuracy} |`);
  lines.push(``);

  // Tabel hasil per skenario
  lines.push(`## Hasil Evaluasi per Skenario`);
  lines.push(``);
  lines.push(
    `| # | Skenario | Similarity | Relevance | Empathy | Consistency | Retrieval | Overall |`,
  );
  lines.push(
    `|---|----------|------------|-----------|---------|-------------|-----------|---------|`,
  );

  report.results.forEach((result, index) => {
    lines.push(
      `| ${index + 1} | ${result.scenarioName} | ${result.similarity.finalScore} | ${result.relevance.finalScore} | ${result.empathy.finalScore} | ${result.contextualConsistency.finalScore} | ${result.retrievalAccuracy.finalScore} | **${result.overallScore}** |`,
    );
  });
  lines.push(``);

  // Detail per skenario
  lines.push(`## Detail Evaluasi per Skenario`);
  lines.push(``);

  for (const result of report.results) {
    lines.push(`### ${result.scenarioName}`);
    lines.push(``);
    lines.push(`**ID Skenario:** ${result.scenarioId}`);
    lines.push(`**Timestamp:** ${result.timestamp}`);
    lines.push(`**Skor Keseluruhan:** ${result.overallScore}/100`);
    lines.push(``);

    // Tabel detail
    lines.push(`| Dimensi | Skor | Verdict |`);
    lines.push(`|---------|------|---------|`);
    lines.push(
      `| Similarity | ${result.similarity.finalScore} | ${result.similarity.verdict} |`,
    );
    lines.push(
      `| Relevance | ${result.relevance.finalScore} | ${result.relevance.verdict} |`,
    );
    lines.push(
      `| Empathy | ${result.empathy.finalScore} | ${result.empathy.verdict} |`,
    );
    lines.push(
      `| Contextual Consistency | ${result.contextualConsistency.finalScore} | ${result.contextualConsistency.verdict} |`,
    );
    lines.push(
      `| Retrieval Accuracy | ${result.retrievalAccuracy.finalScore} | ${result.retrievalAccuracy.verdict} |`,
    );
    lines.push(``);

    // Detail similarity
    lines.push(`#### Detail Similarity`);
    lines.push(``);
    lines.push(`| Metrik | Nilai |`);
    lines.push(`|--------|-------|`);
    lines.push(`| Cosine Similarity | ${result.similarity.cosineSimilarity} |`);
    lines.push(`| Text Overlap | ${result.similarity.textOverlap} |`);
    lines.push(`| Keyword Match | ${result.similarity.keywordMatch} |`);
    lines.push(``);

    // Detail retrieval
    lines.push(`#### Detail Retrieval Accuracy`);
    lines.push(``);
    lines.push(`| Metrik | Nilai |`);
    lines.push(`|--------|-------|`);
    lines.push(`| Precision | ${result.retrievalAccuracy.precision}% |`);
    lines.push(`| Recall | ${result.retrievalAccuracy.recall}% |`);
    lines.push(
      `| Avg Relevance Score | ${result.retrievalAccuracy.avgRelevanceScore} |`,
    );
    lines.push(``);

    // Catatan
    if (result.notes) {
      lines.push(`**Catatan:** ${result.notes}`);
      lines.push(``);
    }

    lines.push(`---`);
    lines.push(``);
  }

  // Interpretasi Akademik
  lines.push(`## Interpretasi Akademik`);
  lines.push(``);
  lines.push(generateAcademicInterpretation(report));
  lines.push(``);

  // Penutup
  lines.push(`---`);
  lines.push(``);
  lines.push(
    `_Laporan ini digenerate secara otomatis oleh sistem evaluasi RAG Chatbot Curhat._`,
  );
  lines.push(`_Digunakan untuk keperluan akademik skripsi._`);
  lines.push(``);

  return lines.join("\n");
}

// ------------------------------------------------------------------
// INTERPRETASI AKADEMIK
// ------------------------------------------------------------------

/**
 * Menghasilkan interpretasi akademik berdasarkan hasil evaluasi.
 */
function generateAcademicInterpretation(report: EvaluationReport): string {
  const stats = report.aggregateStats;
  const parts: string[] = [];

  parts.push(
    `Berdasarkan hasil evaluasi terhadap ${report.results.length} skenario pengujian, `,
  );

  if (stats.averageOverallScore >= 80) {
    parts.push(
      `sistem RAG chatbot curhat menunjukkan performa yang **sangat baik** dengan rata-rata skor ${stats.averageOverallScore}/100. `,
    );
    parts.push(
      `Sistem mampu merespon curhat user secara relevan, empatik, dan konsisten dengan konteks emosional yang diberikan.`,
    );
  } else if (stats.averageOverallScore >= 65) {
    parts.push(
      `sistem RAG chatbot curhat menunjukkan performa yang **baik** dengan rata-rata skor ${stats.averageOverallScore}/100. `,
    );
    parts.push(
      `Sebagian besar respons sesuai dengan konteks emosional, meskipun masih terdapat beberapa area yang perlu ditingkatkan.`,
    );
  } else if (stats.averageOverallScore >= 50) {
    parts.push(
      `sistem RAG chatbot curhat menunjukkan performa yang **cukup** dengan rata-rata skor ${stats.averageOverallScore}/100. `,
    );
    parts.push(
      `Sistem mampu memberikan respons yang relevan secara umum, namun masih perlu peningkatan dalam konsistensi emosional dan empati.`,
    );
  } else {
    parts.push(
      `sistem RAG chatbot curhat menunjukkan performa yang **kurang** dengan rata-rata skor ${stats.averageOverallScore}/100. `,
    );
    parts.push(
      `Masih diperlukan perbaikan signifikan dalam kualitas respons dan akurasi retrieval.`,
    );
  }

  parts.push(``);
  parts.push(``);

  // Analisis per dimensi
  parts.push(`### Analisis per Dimensi`);
  parts.push(``);

  const cat = stats.categoryAverages;

  if (cat.similarity >= 70) {
    parts.push(
      `**Similarity (${cat.similarity}):** Respons chatbot memiliki kesamaan yang baik dengan konteks query, menunjukkan bahwa sistem mampu memahami dan merespon sesuai topik.`,
    );
  } else {
    parts.push(
      `**Similarity (${cat.similarity}):** Perlu peningkatan dalam kesesuaian respons dengan konteks query user.`,
    );
  }

  if (cat.empathy >= 70) {
    parts.push(
      `**Empati (${cat.empathy}):** Chatbot menunjukkan tingkat empati yang baik, mampu memvalidasi perasaan user dan memberikan dukungan emosional yang sesuai.`,
    );
  } else {
    parts.push(
      `**Empati (${cat.empathy}):** Perlu peningkatan dalam aspek empati, terutama dalam validasi emosional dan dukungan.`,
    );
  }

  if (cat.retrievalAccuracy >= 70) {
    parts.push(
      `**Akurasi Retrieval (${cat.retrievalAccuracy}):** Sistem RAG berfungsi dengan baik dalam mengambil konteks yang relevan dari database chunk.`,
    );
  } else {
    parts.push(
      `**Akurasi Retrieval (${cat.retrievalAccuracy}):** Perlu optimasi pada mekanisme retrieval untuk meningkatkan relevansi chunk yang diambil.`,
    );
  }

  parts.push(``);
  parts.push(``);
  parts.push(`### Kesimpulan`);
  parts.push(``);

  if (stats.averageOverallScore >= 70) {
    parts.push(
      `Sistem RAG chatbot curhat layak digunakan untuk memberikan dukungan emosional awal kepada user. `,
    );
    parts.push(
      `Sistem mampu menunjukkan empati dan konsistensi yang baik dalam merespon berbagai skenario emosional. `,
    );
    parts.push(
      `Namun, perlu diingat bahwa chatbot ini bukan pengganti konseling profesional dan hanya berfungsi sebagai alat bantu dukungan emosional.`,
    );
  } else {
    parts.push(
      `Sistem RAG chatbot curhat masih memerlukan pengembangan lebih lanjut sebelum dapat digunakan secara luas. `,
    );
    parts.push(
      `Disarankan untuk melakukan iterasi perbaikan pada komponen retrieval dan prompt engineering untuk meningkatkan kualitas respons.`,
    );
  }

  return parts.join("");
}

// ------------------------------------------------------------------
// HITUNG STATISTIK AGREGAT
// ------------------------------------------------------------------

/**
 * Menghitung statistik agregat dari hasil evaluasi.
 *
 * @param results - Array hasil evaluasi
 * @returns AggregateStats
 */
export function calculateAggregateStats(
  results: EvaluationResult[],
): AggregateStats {
  if (results.length === 0) {
    return {
      averageOverallScore: 0,
      highestScore: 0,
      lowestScore: 0,
      standardDeviation: 0,
      verdictDistribution: {},
      categoryAverages: {
        similarity: 0,
        relevance: 0,
        empathy: 0,
        contextualConsistency: 0,
        retrievalAccuracy: 0,
      },
    };
  }

  const overallScores = results.map((r) => r.overallScore);
  const averageOverallScore = Math.round(
    overallScores.reduce((s, v) => s + v, 0) / overallScores.length,
  );

  // Verdict distribution
  const verdictDistribution: Record<string, number> = {};
  for (const r of results) {
    const v = r.similarity.verdict;
    verdictDistribution[v] = (verdictDistribution[v] || 0) + 1;
  }

  // Category averages
  const categoryAverages = {
    similarity: Math.round(
      results.reduce((s, r) => s + r.similarity.finalScore, 0) / results.length,
    ),
    relevance: Math.round(
      results.reduce((s, r) => s + r.relevance.finalScore, 0) / results.length,
    ),
    empathy: Math.round(
      results.reduce((s, r) => s + r.empathy.finalScore, 0) / results.length,
    ),
    contextualConsistency: Math.round(
      results.reduce((s, r) => s + r.contextualConsistency.finalScore, 0) /
        results.length,
    ),
    retrievalAccuracy: Math.round(
      results.reduce((s, r) => s + r.retrievalAccuracy.finalScore, 0) /
        results.length,
    ),
  };

  return {
    averageOverallScore,
    highestScore: Math.max(...overallScores),
    lowestScore: Math.min(...overallScores),
    standardDeviation: standardDeviation(overallScores),
    verdictDistribution,
    categoryAverages,
  };
}
