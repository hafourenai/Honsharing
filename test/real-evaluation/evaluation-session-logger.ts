

import {
  EvaluationSession,
  SessionLogEntry,
  EvaluationMode,
  QualityLabel,
  RetrievedChunkInfo,
} from "@test/types";
import { EvaluationResult } from "@test/types";

// BUAT ENTRY LOG

/**
 * Membuat satu entry log dari hasil evaluasi.
 *
 * @param params - Parameter entry log
 * @returns SessionLogEntry
 */
export function createLogEntry(params: {
  sessionId: string;
  mode: EvaluationMode;
  scenarioId: string;
  scenarioName: string;
  category: string;
  userInput: string;
  retrievedContext: RetrievedChunkInfo[];
  generatedResponse: string;
  similarityScore: number;
  empathyScore: number;
  relevanceScore: number;
  retrievalScore: number;
  qualityLabel: QualityLabel;
  responseTimeMs: number;
  notes?: string;
}): SessionLogEntry {
  return {
    sessionId: params.sessionId,
    mode: params.mode,
    scenarioId: params.scenarioId,
    scenarioName: params.scenarioName,
    category: params.category,
    userInput: params.userInput,
    retrievedContext: params.retrievedContext,
    generatedResponse: params.generatedResponse,
    similarityScore: params.similarityScore,
    empathyScore: params.empathyScore,
    relevanceScore: params.relevanceScore,
    retrievalScore: params.retrievalScore,
    qualityLabel: params.qualityLabel,
    responseTimeMs: params.responseTimeMs,
    timestamp: new Date().toISOString(),
    notes: params.notes || "",
  };
}

// BUAT SESI EVALUASI

/**
 * Membuat sesi evaluasi dari kumpulan entry log.
 *
 * @param entries - Array entry log
 * @param mode - Mode evaluasi
 * @returns EvaluationSession
 */
export function createEvaluationSession(
  entries: SessionLogEntry[],
  mode: EvaluationMode,
): EvaluationSession {
  // Hitung ringkasan
  const total = entries.length;
  const avgSimilarity =
    total > 0
      ? Math.round(entries.reduce((s, e) => s + e.similarityScore, 0) / total)
      : 0;
  const avgEmpathy =
    total > 0
      ? Math.round(entries.reduce((s, e) => s + e.empathyScore, 0) / total)
      : 0;
  const avgRelevance =
    total > 0
      ? Math.round(entries.reduce((s, e) => s + e.relevanceScore, 0) / total)
      : 0;
  const avgRetrieval =
    total > 0
      ? Math.round(entries.reduce((s, e) => s + e.retrievalScore, 0) / total)
      : 0;
  const avgResponseTime =
    total > 0
      ? Math.round(entries.reduce((s, e) => s + e.responseTimeMs, 0) / total)
      : 0;

  // Distribusi label
  const labelDistribution: Record<QualityLabel, number> = {
    GOOD: 0,
    ACCEPTABLE: 0,
    WEAK: 0,
    FAILED: 0,
  };
  for (const e of entries) {
    labelDistribution[e.qualityLabel] =
      (labelDistribution[e.qualityLabel] || 0) + 1;
  }

  return {
    evaluationId: `eval_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    mode,
    date: new Date().toISOString(),
    entries,
    summary: {
      totalScenarios: total,
      averageSimilarity: avgSimilarity,
      averageEmpathy: avgEmpathy,
      averageRelevance: avgRelevance,
      averageRetrieval: avgRetrieval,
      averageResponseTimeMs: avgResponseTime,
      labelDistribution,
    },
  };
}

// GENERATE MARKDOWN LOG

/**
 * Menghasilkan log sesi dalam format Markdown.
 * Siap digunakan untuk dokumentasi skripsi.
 *
 * @param session - Sesi evaluasi
 * @returns String markdown
 */
export function generateSessionMarkdown(session: EvaluationSession): string {
  const lines: string[] = [];

  lines.push(`# Laporan Sesi Evaluasi`);
  lines.push(``);
  lines.push(`**ID Sesi:** ${session.evaluationId}`);
  lines.push(`**Mode:** ${session.mode}`);
  lines.push(`**Tanggal:** ${session.date}`);
  lines.push(`**Total Skenario:** ${session.summary.totalScenarios}`);
  lines.push(``);
  lines.push(`---`);
  lines.push(``);

  // Ringkasan
  lines.push(`## Ringkasan`);
  lines.push(``);
  lines.push(`| Metrik | Nilai |`);
  lines.push(`|--------|-------|`);
  lines.push(
    `| Rata-rata Similarity | ${session.summary.averageSimilarity}/100 |`,
  );
  lines.push(`| Rata-rata Empati | ${session.summary.averageEmpathy}/100 |`);
  lines.push(
    `| Rata-rata Relevansi | ${session.summary.averageRelevance}/100 |`,
  );
  lines.push(
    `| Rata-rata Retrieval | ${session.summary.averageRetrieval}/100 |`,
  );
  lines.push(
    `| Rata-rata Waktu Respons | ${session.summary.averageResponseTimeMs}ms |`,
  );
  lines.push(``);
  lines.push(``);

  // Distribusi label
  lines.push(`## Distribusi Label Kualitas`);
  lines.push(``);
  lines.push(`| Label | Jumlah |`);
  lines.push(`|-------|--------|`);
  const labelOrder: QualityLabel[] = ["GOOD", "ACCEPTABLE", "WEAK", "FAILED"];
  for (const label of labelOrder) {
    const count = session.summary.labelDistribution[label] || 0;
    const pct =
      session.summary.totalScenarios > 0
        ? ((count / session.summary.totalScenarios) * 100).toFixed(1)
        : "0.0";
    lines.push(`| ${label} | ${count} (${pct}%) |`);
  }
  lines.push(``);
  lines.push(``);

  // Detail per entry
  lines.push(`## Detail Evaluasi`);
  lines.push(``);

  for (let i = 0; i < session.entries.length; i++) {
    const entry = session.entries[i];
    lines.push(`### ${i + 1}. ${entry.scenarioName}`);
    lines.push(``);
    lines.push(`**ID:** ${entry.scenarioId}`);
    lines.push(`**Kategori:** ${entry.category}`);
    lines.push(`**Waktu:** ${entry.responseTimeMs}ms`);
    lines.push(`**Label:** ${entry.qualityLabel}`);
    lines.push(``);

    lines.push(`**Input User:**`);
    lines.push("```");
    lines.push(entry.userInput);
    lines.push("```");
    lines.push(``);

    lines.push(`**Respons Chatbot:**`);
    lines.push("```");
    lines.push(entry.generatedResponse);
    lines.push("```");
    lines.push(``);

    lines.push(`**Skor:**`);
    lines.push(`| Dimensi | Skor |`);
    lines.push(`|---------|------|`);
    lines.push(`| Similarity | ${entry.similarityScore} |`);
    lines.push(`| Empati | ${entry.empathyScore} |`);
    lines.push(`| Relevansi | ${entry.relevanceScore} |`);
    lines.push(`| Retrieval | ${entry.retrievalScore} |`);
    lines.push(``);

    // Retrieved chunks
    if (entry.retrievedContext.length > 0) {
      lines.push(`**Retrieved Context:**`);
      lines.push(``);
      lines.push(`| # | Chunk ID | Skor | Topik |`);
      lines.push(`|---|----------|------|-------|`);
      for (const chunk of entry.retrievedContext) {
        lines.push(
          `| ${chunk.rank} | ${chunk.chunkId} | ${chunk.similarityScore.toFixed(3)} | ${chunk.topic} |`,
        );
      }
      lines.push(``);
    }

    if (entry.notes) {
      lines.push(`**Catatan:** ${entry.notes}`);
      lines.push(``);
    }

    lines.push(`---`);
    lines.push(``);
  }

  return lines.join("\n");
}

// GENERATE JSON LOG

/**
 * Menghasilkan log sesi dalam format JSON.
 * Siap untuk olah data statistik lanjutan.
 *
 * @param session - Sesi evaluasi
 * @returns String JSON
 */
export function generateSessionJSON(session: EvaluationSession): string {
  return JSON.stringify(session, null, 2);
}

// SIMPAN LOG KE FILE

/**
 * Menyimpan log sesi ke file JSON dan Markdown.
 *
 * Output:
 * - {sessionId}.json
 * - {sessionId}.md
 *
 * @param session - Sesi evaluasi
 * @param outputDir - Direktori output
 */
export async function saveSessionLogs(
  session: EvaluationSession,
  outputDir: string = "./generated-reports",
): Promise<void> {
  // Dynamic import fs untuk Node.js
  const fs = await import("fs/promises");
  const path = await import("path");

  // Buat direktori jika belum ada
  await fs.mkdir(outputDir, { recursive: true });

  // Simpan JSON
  const jsonPath = path.join(outputDir, `${session.evaluationId}.json`);
  await fs.writeFile(jsonPath, generateSessionJSON(session), "utf-8");
  console.log(`[SessionLogger] JSON saved: ${jsonPath}`);

  // Simpan Markdown
  const mdPath = path.join(outputDir, `${session.evaluationId}.md`);
  await fs.writeFile(mdPath, generateSessionMarkdown(session), "utf-8");
  console.log(`[SessionLogger] Markdown saved: ${mdPath}`);
}
