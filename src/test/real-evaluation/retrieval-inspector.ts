/**
 * ============================================================
 * RETRIEVAL INSPECTION SYSTEM — INSPEKSI HASIL RETRIEVAL RAG
 * ============================================================
 *
 * Utility untuk melihat dan menganalisis hasil retrieval RAG.
 * Membantu dosen pembimbing melihat bagaimana RAG bekerja.
 *
 * FITUR:
 * 1. Lihat chunk mana yang terambil
 * 2. Similarity score per chunk
 * 3. Peringkat retrieval (ranking)
 * 4. Kontribusi retrieval terhadap response
 * 5. Output mudah dianalisis (tabel)
 *
 * PENGGUNAAN UNTUK SKRIPSI:
 *   Modul ini membantu menjelaskan:
 *   - "Mengapa chatbot merespon seperti ini?"
 *   - "Apakah retrieval berhasil mengambil konteks yang tepat?"
 *   - "Bagaimana pengaruh similarity threshold terhadap hasil?"
 *
 * @author  Tim Skripsi
 * @version 1.0
 * ============================================================
 */

import { RetrievedChunkInfo, TestScenario } from "@/test/types";
import { Chunk } from "@/lib/rag/promptBuilder";
import { mockRetrieve } from "@/test/mocks";
import { textCosineSimilarity } from "@/test/types/utils/cosine-similarity";
import { wordOverlapScore } from "@/test/types/utils/text-overlap";
import { ALL_MOCK_CHUNKS } from "@/test/mocks";

// INSPEKSI RETRIEVAL

/**
 * Melakukan inspeksi terhadap hasil retrieval untuk suatu query.
 *
 * @param query - Query user
 * @param topK - Jumlah chunk yang diretrieve
 * @param threshold - Threshold similarity
 * @returns Informasi retrieval lengkap
 */
export async function inspectRetrieval(
  query: string,
  topK: number = 5,
  threshold: number = 0.3,
): Promise<{
  query: string;
  totalChunksAvailable: number;
  chunksRetrieved: RetrievedChunkInfo[];
  statistics: {
    highestScore: number;
    lowestScore: number;
    averageScore: number;
    aboveThreshold: number;
    belowThreshold: number;
  };
}> {
  // Simulasi retrieval
  const results = await mockRetrieve(query, ALL_MOCK_CHUNKS, topK, threshold);

  // Format hasil
  const chunksRetrieved: RetrievedChunkInfo[] = results.map((chunk, index) => ({
    chunkId: chunk.id,
    similarityScore: chunk.score || 0,
    rank: index + 1,
    topic: chunk.scenario?.topic || chunk.metadata?.topic || "unknown",
    situation: chunk.scenario?.situation || "",
    emotions: chunk.metadata?.emotion || [],
    contributedToResponse: false, // Akan diisi nanti
  }));

  // Statistik
  const scores = chunksRetrieved.map((c) => c.similarityScore);

  return {
    query,
    totalChunksAvailable: ALL_MOCK_CHUNKS.length,
    chunksRetrieved,
    statistics: {
      highestScore: scores.length > 0 ? Math.max(...scores) : 0,
      lowestScore: scores.length > 0 ? Math.min(...scores) : 0,
      averageScore:
        scores.length > 0
          ? scores.reduce((s, v) => s + v, 0) / scores.length
          : 0,
      aboveThreshold: scores.filter((s) => s >= threshold).length,
      belowThreshold: scores.filter((s) => s < threshold).length,
    },
  };
}

// ANALISIS KONTRIBUSI RETRIEVAL

/**
 * Menganalisis kontribusi retrieval terhadap respons chatbot.
 * Mengukur seberapa banyak kata dari chunk yang muncul dalam respons.
 *
 * @param response - Respons chatbot
 * @param retrievedChunks - Chunks yang diretrieve
 * @returns Analisis kontribusi
 */
export function analyzeRetrievalContribution(
  response: string,
  retrievedChunks: RetrievedChunkInfo[],
): {
  totalChunksUsed: number;
  chunkContributions: Array<{
    chunkId: string;
    topic: string;
    overlapScore: number;
    wordOverlap: string[];
    contributionPercent: number;
  }>;
  overallContributionPercent: number;
} {
  const responseLower = response.toLowerCase();
  const responseWords = new Set(
    responseLower
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3),
  );

  const chunkContributions = retrievedChunks.map((chunk) => {
    const chunkText = `${chunk.topic} ${chunk.situation} ${chunk.emotions.join(" ")}`;
    const chunkWords = new Set(
      chunkText
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 3),
    );

    // Cari kata yang overlap
    const wordOverlap = [...responseWords].filter((w) => chunkWords.has(w));

    // Overlap score
    const overlapScore =
      chunkWords.size > 0 ? wordOverlap.length / chunkWords.size : 0;

    // Kontribusi persentase
    const contributionPercent =
      responseWords.size > 0
        ? (wordOverlap.length / responseWords.size) * 100
        : 0;

    return {
      chunkId: chunk.chunkId,
      topic: chunk.topic,
      overlapScore,
      wordOverlap,
      contributionPercent: Math.round(contributionPercent * 100) / 100,
    };
  });

  // Keseluruhan kontribusi
  const allChunkWords = new Set(
    retrievedChunks.flatMap((c) => {
      const text = `${c.topic} ${c.situation} ${c.emotions.join(" ")}`;
      return text
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 3);
    }),
  );

  const allOverlap = [...responseWords].filter((w) => allChunkWords.has(w));
  const overallContributionPercent =
    responseWords.size > 0 ? (allOverlap.length / responseWords.size) * 100 : 0;

  return {
    totalChunksUsed: chunkContributions.filter((c) => c.overlapScore > 0)
      .length,
    chunkContributions,
    overallContributionPercent:
      Math.round(overallContributionPercent * 100) / 100,
  };
}

// GENERATE TABEL RETRIEVAL (MARKDOWN)

/**
 * Menghasilkan tabel hasil retrieval dalam format Markdown.
 * Siap dimasukkan ke BAB 4 skripsi.
 *
 * @param inspection - Hasil inspeksi retrieval
 * @returns String markdown tabel
 */
export function generateRetrievalTable(inspection: {
  query: string;
  totalChunksAvailable: number;
  chunksRetrieved: RetrievedChunkInfo[];
  statistics: {
    highestScore: number;
    lowestScore: number;
    averageScore: number;
    aboveThreshold: number;
    belowThreshold: number;
  };
}): string {
  const lines: string[] = [];

  lines.push(`### Hasil Retrieval RAG`);
  lines.push(``);
  lines.push(`**Query:** ${inspection.query}`);
  lines.push(`**Total Chunks:** ${inspection.totalChunksAvailable}`);
  lines.push(`**Chunks Retrieved:** ${inspection.chunksRetrieved.length}`);
  lines.push(``);

  lines.push(
    `**Tabel ${new Date().getFullYear()}.** Daftar Chunk yang Diretrive`,
  );
  lines.push(``);
  lines.push(`| Peringkat | ID Chunk | Topik | Similarity Score | Emosi |`);
  lines.push(`|-----------|----------|-------|-----------------|-------|`);
  for (const chunk of inspection.chunksRetrieved) {
    lines.push(
      `| ${chunk.rank} | ${chunk.chunkId} | ${chunk.topic} | ${chunk.similarityScore.toFixed(4)} | ${chunk.emotions.join(", ")} |`,
    );
  }
  lines.push(``);
  lines.push(``);

  lines.push(`**Statistik Retrieval:**`);
  lines.push(``);
  lines.push(`| Metrik | Nilai |`);
  lines.push(`|--------|-------|`);
  lines.push(
    `| Skor Tertinggi | ${inspection.statistics.highestScore.toFixed(4)} |`,
  );
  lines.push(
    `| Skor Terendah | ${inspection.statistics.lowestScore.toFixed(4)} |`,
  );
  lines.push(
    `| Rata-rata Skor | ${inspection.statistics.averageScore.toFixed(4)} |`,
  );
  lines.push(
    `| Chunk di Atas Threshold | ${inspection.statistics.aboveThreshold} |`,
  );
  lines.push(
    `| Chunk di Bawah Threshold | ${inspection.statistics.belowThreshold} |`,
  );
  lines.push(``);

  return lines.join("\n");
}

// GENERATE TABEL KONTRIBUSI (MARKDOWN)

/**
 * Menghasilkan tabel kontribusi retrieval terhadap respons.
 *
 * @param contribution - Analisis kontribusi
 * @returns String markdown tabel
 */
export function generateContributionTable(contribution: {
  totalChunksUsed: number;
  chunkContributions: Array<{
    chunkId: string;
    topic: string;
    overlapScore: number;
    wordOverlap: string[];
    contributionPercent: number;
  }>;
  overallContributionPercent: number;
}): string {
  const lines: string[] = [];

  lines.push(`### Kontribusi Retrieval terhadap Respons`);
  lines.push(``);
  lines.push(
    `Dari ${contribution.chunkContributions.length} chunk yang diretrieve, ` +
      `${contribution.totalChunksUsed} chunk berkontribusi terhadap respons chatbot.`,
  );
  lines.push(``);
  lines.push(
    `**Kontribusi Keseluruhan:** ${contribution.overallContributionPercent.toFixed(1)}% kata dalam ` +
      `respons berasal dari retrieved chunks.`,
  );
  lines.push(``);

  lines.push(`| Chunk | Topik | Overlap Score | Kontribusi | Kata yang Sama |`);
  lines.push(`|-------|-------|---------------|------------|----------------|`);
  for (const c of contribution.chunkContributions) {
    const overlapWords =
      c.wordOverlap.slice(0, 5).join(", ") +
      (c.wordOverlap.length > 5 ? " (+lebih)" : "");
    lines.push(
      `| ${c.chunkId} | ${c.topic} | ${(c.overlapScore * 100).toFixed(1)}% | ${c.contributionPercent.toFixed(1)}% | ${overlapWords} |`,
    );
  }
  lines.push(``);
  lines.push(``);

  // Interpretasi
  if (contribution.overallContributionPercent >= 30) {
    lines.push(
      "**Interpretasi:** Retrieval RAG berkontribusi signifikan terhadap respons chatbot. " +
        "Chatbot menggunakan informasi dari retrieved chunks untuk merespon.",
    );
  } else if (contribution.overallContributionPercent >= 10) {
    lines.push(
      "**Interpretasi:** Retrieval RAG berkontribusi cukup terhadap respons chatbot. " +
        "Masih ada ruang untuk meningkatkan pemanfaatan konteks retrieval.",
    );
  } else {
    lines.push(
      "**Interpretasi:** Retrieval RAG berkontribusi rendah terhadap respons chatbot. " +
        "Perlu evaluasi apakah chunks yang diretrieve sudah relevan.",
    );
  }
  lines.push(``);

  return lines.join("\n");
}

// BANDINGKAN DUA HASIL RETRIEVAL

/**
 * Membandingkan dua hasil retrieval untuk query berbeda.
 * Berguna untuk menganalisis perbedaan retrieval antar skenario.
 *
 * @param inspectionA - Hasil retrieval pertama
 * @param inspectionB - Hasil retrieval kedua
 * @returns Tabel perbandingan markdown
 */
export function compareRetrievalResults(
  inspectionA: {
    query: string;
    chunksRetrieved: RetrievedChunkInfo[];
    statistics: {
      highestScore: number;
      lowestScore: number;
      averageScore: number;
    };
  },
  inspectionB: {
    query: string;
    chunksRetrieved: RetrievedChunkInfo[];
    statistics: {
      highestScore: number;
      lowestScore: number;
      averageScore: number;
    };
  },
): string {
  const lines: string[] = [];

  lines.push(`### Perbandingan Hasil Retrieval`);
  lines.push(``);
  lines.push(
    `| Metrik | "${inspectionA.query.slice(0, 30)}..." | "${inspectionB.query.slice(0, 30)}..." |`,
  );
  lines.push(
    `|--------|${"-".repeat(inspectionA.query.slice(0, 30).length + 4)}|${"-".repeat(inspectionB.query.slice(0, 30).length + 4)}|`,
  );
  lines.push(
    `| Jumlah Retrieved | ${inspectionA.chunksRetrieved.length} | ${inspectionB.chunksRetrieved.length} |`,
  );
  lines.push(
    `| Skor Tertinggi | ${inspectionA.statistics.highestScore.toFixed(4)} | ${inspectionB.statistics.highestScore.toFixed(4)} |`,
  );
  lines.push(
    `| Rata-rata Skor | ${inspectionA.statistics.averageScore.toFixed(4)} | ${inspectionB.statistics.averageScore.toFixed(4)} |`,
  );
  lines.push(``);

  // Topik yang sama
  const topicsA = new Set(inspectionA.chunksRetrieved.map((c) => c.topic));
  const topicsB = new Set(inspectionB.chunksRetrieved.map((c) => c.topic));
  const commonTopics = [...topicsA].filter((t) => topicsB.has(t));

  if (commonTopics.length > 0) {
    lines.push(
      `**Topik yang sama:** ${commonTopics.join(", ")} — Menunjukkan konsistensi retrieval antar skenario.`,
    );
  } else {
    lines.push(
      "**Tidak ada topik yang sama** — Menunjukkan retrieval spesifik per skenario.",
    );
  }
  lines.push(``);

  return lines.join("\n");
}
