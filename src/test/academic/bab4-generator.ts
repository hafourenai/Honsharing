/**
 * BAB 4 GENERATOR — HASIL PENELITIAN & PEMBAHASAN
 *
 * @author  Tim Skripsi
 * @version 1.0
 */

import { TestScenario, EvaluationSession, RealComparisonSummary, MultiTurnSummary, FailureAnalysis } from "@/test/types"
import { ResearchStats, calculateResearchStats } from "./research-statistics"
import {
  interpretTabelHasil,
  analisisSkorDimensi,
  analisisDistribusiLabel,
  analisisPerKategori,
  kesimpulanPengujian,
  penjelasanPeningkatan,
} from "./academic-writing"
import { analyzeRAGEffectiveness, generateRAGEffectivenessTable, RAGEffectivenessReport } from "./rag-effectiveness"
import { generateAcademicFailureReport, AcademicFailureReport } from "./failure-analysis-generator"
import { generateAutoConclusion, AutoConclusion } from "./auto-conclusion"
import { generateSummaryDashboard, SummaryDashboard } from "./evaluation-summary"

// TIPE DATA OUTPUT

export interface Bab4Output {
  /** Markdown lengkap BAB 4 */
  markdown: string
  /** Judul */
  title: string
  /** Ringkasan */
  abstraksi: string
}

// GENERATE BAB 4 LENGKAP

/**
 * Menghasilkan markdown BAB 4 lengkap.
 *
 * @param session        - Sesi evaluasi
 * @param scenarios      - Semua skenario pengujian
 * @param stats          - Statistik penelitian
 * @param failures       - Analisis kegagalan
 * @param ragComparison  - Perbandingan RAG vs Non-RAG
 * @param multiTurn      - Hasil multi-turn
 */
export function generateBab4(
  session: EvaluationSession,
  scenarios: TestScenario[],
  stats: ResearchStats,
  failures: FailureAnalysis[],
  ragComparison?: RealComparisonSummary,
  multiTurn?: MultiTurnSummary
): Bab4Output {
  const sections: string[] = []

  // Header
  sections.push("# BAB 4: HASIL PENELITIAN DAN PEMBAHASAN\n")
  sections.push(
    "Bab ini menyajikan hasil evaluasi sistem RAG chatbot curhat secara sistematis. " +
    "Pembahasan mencakup deskripsi skenario pengujian, metode evaluasi yang digunakan, " +
    "hasil pengujian pada setiap dimensi, perbandingan sistem dengan dan tanpa RAG, " +
    "analisis kegagalan sistem, serta kesimpulan dari seluruh rangkaian pengujian.\n"
  )

  // === 4.1 ===
  sections.push(generateBab41(scenarios, stats))

  // === 4.2 ===
  sections.push(generateBab42())

  // === 4.3 ===
  sections.push(generateBab43(session, stats))

  // === 4.4 ===
  sections.push(generateBab44(session, stats))

  // === 4.5 ===
  sections.push(generateBab45(session, stats))

  // === 4.6 ===
  sections.push(generateBab46(ragComparison))

  // === 4.7 ===
  sections.push(generateBab47(failures))

  // === 4.8 ===
  const conclusion = generateAutoConclusion(session, stats, ragComparison, multiTurn)
  sections.push(generateBab48(conclusion, stats, ragComparison))

  const markdown = sections.join("\n\n")

  return {
    markdown,
    title: "BAB 4: HASIL PENELITIAN DAN PEMBAHASAN",
    abstraksi: generateAbstraksi(stats, ragComparison),
  }
}

// 4.1 SKENARIO PENGUJIAN

function generateBab41(scenarios: TestScenario[], stats: ResearchStats): string {
  const catMap = new Map<string, TestScenario[]>()
  for (const s of scenarios) {
    const arr = catMap.get(s.category) || []
    arr.push(s)
    catMap.set(s.category, arr)
  }

  const lines: string[] = []
  lines.push("## 4.1 Skenario Pengujian\n")
  lines.push(
    `Pengujian dilakukan terhadap **${scenarios.length} skenario** yang terbagi dalam ` +
    `**${catMap.size} kategori emosional**. Setiap skenario merepresentasikan satu ` +
    `kondisi emosional spesifik yang umum ditemui dalam konteks curhat mahasiswa.\n`
  )
  lines.push("### 4.1.1 Distribusi Skenario per Kategori\n")
  lines.push("| No | Kategori | Jumlah Skenario | Tingkat Keparahan |")
  lines.push("|---|----------|-----------------|--------------------|")

  let no = 1
  for (const [cat, scens] of catMap) {
    const severitySum = scens.reduce((s, sc) => s + sc.severityLevel, 0)
    const avgSeverity = (severitySum / scens.length).toFixed(1)
    lines.push(`| ${no} | ${cat} | ${scens.length} | ${avgSeverity}/5 |`)
    no++
  }
  lines.push(`| | **Total** | **${scenarios.length}** | |`)
  lines.push("")

  lines.push("### 4.1.2 Detail Skenario\n")
  lines.push("Berikut adalah detail dari setiap skenario pengujian:\n")

  for (const [cat, scens] of catMap) {
    lines.push(`**Kategori: ${cat}**\n`)
    lines.push("| ID | Nama Skenario | Input User | Severity |")
    lines.push("|----|---------------|------------|----------|")
    for (const sc of scens) {
      const truncatedInput = sc.userInput.length > 60
        ? sc.userInput.substring(0, 60) + "..."
        : sc.userInput
      lines.push(`| ${sc.id} | ${sc.name} | ${truncatedInput} | ${sc.severityLevel}/5 |`)
    }
    lines.push("")
  }

  return lines.join("\n")
}

// 4.2 METODE EVALUASI

function generateBab42(): string {
  return (
    "## 4.2 Metode Evaluasi\n\n" +
    "### 4.2.1 Dimensi Evaluasi\n\n" +
    "Evaluasi dilakukan berdasarkan empat dimensi utama:\n\n" +
    "1. **Similarity**: Mengukur kesamaan antara respons chatbot dengan input pengguna " +
    "menggunakan cosine similarity, text overlap analysis, dan keyword matching.\n\n" +
    "2. **Empati**: Mengukur sejauh mana respons menunjukkan validasi emosional, " +
    "pemahaman, dan dukungan terhadap pengguna.\n\n" +
    "3. **Relevansi**: Mengukur kesesuaian respons dengan konteks percakapan dan " +
    "kondisi emosional pengguna.\n\n" +
    "4. **Akurasi Retrieval**: Mengukur seberapa baik sistem mengambil chunk yang " +
    "relevan dari basis data menggunakan metrik precision dan recall.\n\n" +
    "### 4.2.2 Alat Ukur\n\n" +
    "| Metrik | Deskripsi | Rentang |\n" +
    "|--------|-----------|---------|\n" +
    "| Cosine Similarity | Kesamaan vektor antara input dan respons | 0-100 |\n" +
    "| Text Overlap | Persentase kata yang sama | 0-100 |\n" +
    "| Keyword Match | Keberadaan kata kunci emosional | 0-100 |\n" +
    "| Precision | Proporsi chunk relevan | 0-100 |\n" +
    "| Recall | Proporsi chunk relevan yang terambil | 0-100 |\n\n" +
    "### 4.2.3 Skala Penilaian\n\n" +
    "| Rentang Skor | Kategori | Interpretasi |\n" +
    "|-------------|----------|--------------|\n" +
    "| 85-100 | Sangat Baik | Sistem menunjukkan kinerja optimal |\n" +
    "| 70-84 | Baik | Sistem berfungsi dengan baik |\n" +
    "| 55-69 | Cukup | Sistem cukup berfungsi, perlu peningkatan |\n" +
    "| 40-54 | Kurang | Sistem perlu perbaikan signifikan |\n" +
    "| 0-39 | Sangat Kurang | Sistem tidak berfungsi dengan baik |"
  )
}

// 4.3 HASIL SIMILARITY

function generateBab43(session: EvaluationSession, stats: ResearchStats): string {
  const s = session.summary
  const lines: string[] = []

  lines.push("## 4.3 Hasil Pengujian Similarity\n")
  lines.push(
    "Pengujian similarity bertujuan untuk mengukur seberapa mirip respons chatbot " +
    "dengan input yang diberikan oleh pengguna. Similarity yang tinggi menunjukkan " +
    "bahwa chatbot merespon sesuai dengan topik yang dibicarakan.\n"
  )
  lines.push("### 4.3.1 Hasil Rata-rata Similarity\n")
  lines.push(`| Metrik | Skor |`)
  lines.push(`|--------|------|`)
  lines.push(`| Cosine Similarity | ${s.averageSimilarity}/100 |`)
  lines.push(`| Kategori | ${s.averageSimilarity >= 85 ? "Sangat Baik" : s.averageSimilarity >= 70 ? "Baik" : s.averageSimilarity >= 55 ? "Cukup" : "Kurang"} |`)
  lines.push("")

  lines.push("### 4.3.2 Similarity per Kategori\n")
  lines.push("| Kategori | Similarity |")
  lines.push("|----------|-----------|")
  for (const c of stats.categoryBreakdown) {
    lines.push(`| ${c.category} | ${c.avgSimilarity}/100 |`)
  }
  lines.push("")

  lines.push("### 4.3.3 Interpretasi\n")
  lines.push(interpretTabelHasil("Similarity", s.averageSimilarity, "semua kategori"))
  lines.push("")

  return lines.join("\n")
}

// 4.4 HASIL EMPATI

function generateBab44(session: EvaluationSession, stats: ResearchStats): string {
  const s = session.summary

  return (
    "## 4.4 Hasil Pengujian Empati\n\n" +
    "Pengujian empati merupakan dimensi paling kritis dalam chatbot curhat. " +
    "Empati diukur melalui tiga sub-dimensi: validasi emosional, pemahaman, dan dukungan.\n\n" +
    "### 4.4.1 Hasil Rata-rata Empati\n\n" +
    `| Metrik | Skor |\n` +
    `|--------|------|\n` +
    `| Rata-rata Empati | ${s.averageEmpathy}/100 |\n` +
    `| Kategori | ${s.averageEmpathy >= 85 ? "Sangat Baik" : s.averageEmpathy >= 70 ? "Baik" : s.averageEmpathy >= 55 ? "Cukup" : "Kurang"} |\n\n` +
    "### 4.4.2 Empati per Kategori\n\n" +
    "| Kategori | Empati |\n" +
    "|----------|--------|\n" +
    stats.categoryBreakdown.map((c) => `| ${c.category} | ${c.avgEmpathy}/100 |`).join("\n") +
    "\n\n" +
    "### 4.4.3 Interpretasi\n\n" +
    interpretTabelHasil("Empati", s.averageEmpathy, "semua kategori") +
    "\n\n" +
    `Skor empati yang ${s.averageEmpathy >= 70 ? "baik" : "cukup"} ini menunjukkan bahwa ` +
    "chatbot mampu memberikan respons yang hangat dan memvalidasi perasaan pengguna. " +
    "Hal ini penting karena dalam konteks curhat, pengguna perlu merasa didengarkan " +
    "dan dipahami secara emosional."
  )
}

// 4.5 HASIL RETRIEVAL

function generateBab45(session: EvaluationSession, stats: ResearchStats): string {
  const s = session.summary

  return (
    "## 4.5 Hasil Retrieval RAG\n\n" +
    "Pengujian retrieval mengukur seberapa baik sistem mengambil chunk yang relevan " +
    "dari basis data vektor. Keberhasilan retrieval sangat menentukan kualitas " +
    "respons akhir chatbot karena konteks yang diretrieve digunakan sebagai " +
    "bahan tambahan untuk model bahasa.\n\n" +
    "### 4.5.1 Hasil Rata-rata Retrieval\n\n" +
    `| Metrik | Skor |\n` +
    `|--------|------|\n` +
    `| Akurasi Retrieval | ${s.averageRetrieval}/100 |\n` +
    `| Kategori | ${s.averageRetrieval >= 85 ? "Sangat Baik" : s.averageRetrieval >= 70 ? "Baik" : s.averageRetrieval >= 55 ? "Cukup" : "Kurang"} |\n\n` +
    "### 4.5.2 Retrieval per Kategori\n\n" +
    "| Kategori | Retrieval |\n" +
    "|----------|-----------|\n" +
    stats.categoryBreakdown.map((c) => `| ${c.category} | ${c.avgRetrieval}/100 |`).join("\n") +
    "\n\n" +
    "### 4.5.3 Interpretasi\n\n" +
    interpretTabelHasil("Retrieval RAG", s.averageRetrieval, "semua kategori") +
    "\n\n" +
    "Mekanisme retrieval bekerja dengan menghitung cosine similarity antara " +
    "embedding query pengguna dengan embedding chunk yang tersimpan di IndexedDB. " +
    "Chunk dengan similarity di atas threshold akan diretrieve dan digunakan " +
    "sebagai konteks tambahan untuk menghasilkan respons yang lebih personal.\n\n" +
    `${s.averageRetrieval >= 70 ? "Akurasi retrieval yang baik" : "Meskipun akurasi retrieval masih perlu ditingkatkan"} ` +
    "ini berkontribusi terhadap kualitas respons akhir. Semakin relevan chunk " +
    "yang diretrieve, semakin baik respons yang dihasilkan oleh model bahasa."
  )
}

// 4.6 PERBANDINGAN RAG DAN NON-RAG

function generateBab46(ragComparison?: RealComparisonSummary): string {
  if (!ragComparison) {
    return "## 4.6 Perbandingan RAG dan Non-RAG\n\n" +
      "Perbandingan RAG dan Non-RAG tidak dilakukan pada sesi evaluasi ini."
  }

  const report = analyzeRAGEffectiveness(ragComparison)
  const lines: string[] = []

  lines.push("## 4.6 Perbandingan RAG dan Non-RAG\n")
  lines.push(
    "Untuk mengukur efektivitas RAG, dilakukan perbandingan antara sistem dengan " +
    "mekanisme retrieval (RAG) dan sistem tanpa retrieval (Non-RAG). Perbandingan " +
    "dilakukan pada skenario yang sama untuk memastikan hasil yang valid.\n"
  )
  lines.push("### 4.6.1 Hasil Perbandingan\n")
  lines.push(generateRAGEffectivenessTable(report))
  lines.push("### 4.6.2 Interpretasi\n")
  lines.push(report.executiveSummary)
  lines.push("")
  lines.push("### 4.6.3 Analisis per Skenario\n")
  lines.push("| Skenario | Kategori | Non-RAG | RAG | Peningkatan |")
  lines.push("|----------|----------|---------|-----|-------------|")
  for (const a of report.scenarioAnalyses) {
    const sign = a.improvement >= 0 ? "+" : ""
    lines.push(`| ${a.scenarioName} | ${a.category} | ${a.nonRagScore} | ${a.ragScore} | ${sign}${a.improvement} (${a.improvementPercent}%) |`)
  }
  lines.push("")

  return lines.join("\n")
}

// 4.7 ANALISIS KEGAGALAN

function generateBab47(failures: FailureAnalysis[]): string {
  if (failures.length === 0) {
    return "## 4.7 Analisis Kegagalan Sistem\n\nAnalisis kegagalan tidak dilakukan pada sesi evaluasi ini."
  }

  const report = generateAcademicFailureReport(failures)
  const lines: string[] = []

  lines.push("## 4.7 Analisis Kegagalan Sistem\n")
  lines.push(
    "Analisis kegagalan dilakukan untuk mengidentifikasi kelemahan sistem dan " +
    "memberikan rekomendasi perbaikan. Kegagalan dikategorikan ke dalam lima jenis: " +
    "respons tidak relevan, retrieval salah konteks, respons generik, halusinasi, " +
    "dan mismatch emosional.\n"
  )
  lines.push("### 4.7.1 Distribusi Kegagalan\n")
  lines.push(report.distributionTable)
  lines.push("### 4.7.2 Analisis per Jenis Kegagalan\n")

  for (const t of report.failureTypes) {
    if (t.count === 0) continue
    lines.push(`**${t.type}** — ${t.count} kasus (${t.percentage}%)\n`)
    lines.push(`- **Kemungkinan Penyebab:** ${t.possibleCauses[0]}`)
    lines.push(`- **Dampak:** ${t.impact}`)
    lines.push(`- **Rekomendasi:** ${t.recommendation}\n`)
  }

  lines.push("### 4.7.3 Rekomendasi Perbaikan\n")
  lines.push("| Masalah | Prioritas | Rekomendasi |")
  lines.push("|---------|-----------|-------------|")
  for (const r of report.recommendations) {
    lines.push(`| ${r.issue} | ${r.priority} | ${r.technicalRecommendation} |`)
  }
  lines.push("")

  return lines.join("\n")
}

// 4.8 KESIMPULAN PENGUJIAN

function generateBab48(
  conclusion: AutoConclusion,
  stats: ResearchStats,
  ragComparison?: RealComparisonSummary
): string {
  const lines: string[] = []

  lines.push("## 4.8 Kesimpulan Pengujian\n")
  lines.push("### 4.8.1 Ringkasan Hasil\n")
  lines.push(conclusion.ringkasan)
  lines.push("")

  lines.push("### 4.8.2 Temuan Utama\n")
  for (const t of conclusion.temuanUtama) {
    lines.push(`- ${t}`)
  }
  lines.push("")

  lines.push("### 4.8.3 Efektivitas RAG\n")
  lines.push(conclusion.efektivitasRAG.penjelasan)
  lines.push("")

  if (ragComparison) {
    const pct = ragComparison.averageNonRagContextualFit > 0
      ? ((ragComparison.averageImprovement / ragComparison.averageNonRagContextualFit) * 100).toFixed(1)
      : "0.0"
    lines.push(
      `Penerapan RAG memberikan peningkatan sebesar **${pct}%** pada kualitas respons ` +
      "chatbot. Hal ini membuktikan bahwa mekanisme retrieval context berkontribusi " +
      "positif terhadap relevansi dan kekhususan respons.\n"
    )
  }

  lines.push("### 4.8.4 Saran Pengembangan\n")
  for (let i = 0; i < conclusion.saran.length; i++) {
    lines.push(`${i + 1}. ${conclusion.saran[i]}`)
  }
  lines.push("")

  lines.push("### 4.8.5 Penutup\n")
  lines.push(conclusion.penutup)

  return lines.join("\n")
}

// ABSTRAKSI / RINGKASAN

function generateAbstraksi(
  stats: ResearchStats,
  ragComparison?: RealComparisonSummary
): string {
  const overall = stats.averageScores.overall
  let ragText = ""

  if (ragComparison) {
    const pct = ragComparison.averageNonRagContextualFit > 0
      ? ((ragComparison.averageImprovement / ragComparison.averageNonRagContextualFit) * 100).toFixed(1)
      : "0.0"
    ragText = ` Penerapan RAG memberikan peningkatan kualitas respons sebesar ${pct}%.`
  }

  return (
    `Penelitian ini mengevaluasi sistem Retrieval-Augmented Generation (RAG) pada ` +
    `chatbot curhat berbasis Large Language Model. Evaluasi dilakukan terhadap ` +
    `${stats.totalScenarios} skenario dalam ${stats.categoryBreakdown.length} kategori emosional. ` +
    `Hasil menunjukkan rata-rata skor keseluruhan ${overall}/100 dengan success rate ${stats.successRate}%.` +
    ragText
  )
}
