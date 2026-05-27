

import { ResponseQualityResult, RetrievedChunkInfo } from "@test/types";
import { textCosineSimilarity } from "@test/types/utils/cosine-similarity";
import {
  EMOTIONAL_KEYWORD_GROUPS,
  keywordGroupScore,
} from "@test/types/utils/keyword-matching";

// KATA-KATA UNTUK ANALISIS

/**
 * Frasa yang menunjukkan respons sesuai konteks.
 */
const CONTEXTUAL_PHRASES = [
  "aku denger",
  "aku paham",
  "aku ngerti",
  "ceritain",
  "cerita dong",
  "gimana perasaan",
  "pasti berat",
  "wajar kok",
  "manusiawi",
  "gapapa",
  "pelan-pelan",
  "ga sendiri",
  "disini buat",
  "kamu hebat",
  "kamu berani",
  "aku temani",
  "bersama",
  "hadapin",
  "coba cerita",
  "makasih udah cerita",
];

/**
 * Frasa yang menunjukkan respons empatik.
 */
const EMPATHY_PHRASES = [
  "maaf kamu",
  "pasti berat",
  "sakit banget",
  "berat banget",
  "capek banget",
  "aku turut",
  "perasaan kamu valid",
  "wajar kok",
  "manusiawi",
  "ga gampang",
  "aku tau rasanya",
  "pasti susah",
  "aku mengerti",
  "valid",
  "paham banget",
];

/**
 * Frasa generik yang menunjukkan respons tidak spesifik.
 */
const GENERIC_PHRASES = [
  "semangat ya",
  "kamu pasti bisa",
  "jangan menyerah",
  "tetap semangat",
  "semua akan baik-baik saja",
  "ini pasti berlalu",
  "ada hikmahnya",
  "positive thinking",
  "think positive",
  "harus semangat",
  "jangan patah semangat",
  "terus berjuang",
  "gausah khawatir",
  "jangan khawatir",
  "sudahlah",
  "lupakan aja",
  "biasa aja",
  "ga usah dipikirin",
];

/**
 * Frasa yang menunjukkan penggunaan konteks retrieval.
 */
const RETRIEVAL_PHRASES = [
  "kamu bilang",
  "kamu cerita",
  "kamu ngalamin",
  "dari cerita kamu",
  "kamu tadi bilang",
  "seperti yang kamu",
  "kamu rasakan",
  "kamu alami",
];

// TOKENISASI

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 0);
}

// ANALISIS KONTEN

/**
 * Menganalisis kesesuaian konteks respons.
 * Mengukur apakah respons sesuai dengan konteks percakapan.
 *
 * @param response - Respons chatbot
 * @param userInput - Input user
 * @returns Skor kesesuaian konteks (0-100)
 */
function analyzeContextualFit(
  response: string,
  userInput: string,
): { score: number; markers: string[] } {
  const responseLower = response.toLowerCase();
  const matchedMarkers: string[] = [];

  // Cari frasa kontekstual
  for (const phrase of CONTEXTUAL_PHRASES) {
    if (responseLower.includes(phrase)) {
      matchedMarkers.push(phrase);
    }
  }

  // Cosine similarity dengan user input
  const similarity = textCosineSimilarity(response, userInput);

  // Skor: kombinasi phrase matching dan similarity
  const phraseScore = Math.min(100, (matchedMarkers.length / 5) * 100);
  const similarityScore = Math.round((similarity + 1) * 50);

  const score = Math.round(phraseScore * 0.4 + similarityScore * 0.6);

  return { score, markers: matchedMarkers };
}

// ANALISIS EMPATI

/**
 * Menganalisis tingkat empati dalam respons.
 *
 * @param response - Respons chatbot
 * @returns Skor empati (0-100)
 */
function analyzeEmpathy(response: string): {
  score: number;
  markers: string[];
} {
  const responseLower = response.toLowerCase();
  const matchedMarkers: string[] = [];

  // Cari frasa empatik
  for (const phrase of EMPATHY_PHRASES) {
    if (responseLower.includes(phrase)) {
      matchedMarkers.push(phrase);
    }
  }

  // Cek keyword groups
  const validationScore = keywordGroupScore(response, "validation") * 100;
  const supportScore = keywordGroupScore(response, "support") * 100;

  // Cek kata judgemental (penalty)
  const judgementalScore = keywordGroupScore(response, "judgemental");
  const hasJudgemental = judgementalScore > 0;

  // Skor
  const phraseScore = Math.min(100, (matchedMarkers.length / 4) * 100);
  const keywordAvg = (validationScore + supportScore) / 2;
  const penalty = hasJudgemental ? 30 : 0;

  const score = Math.max(
    0,
    Math.round(phraseScore * 0.3 + keywordAvg * 0.7 - penalty),
  );

  return { score, markers: matchedMarkers };
}

// ANALISIS KONSISTENSI

/**
 * Menganalisis konsistensi respons.
 * Apakah respons mengandung kontradiksi atau inkonsistensi.
 *
 * @param response - Respons chatbot
 * @returns Skor konsistensi (0-100)
 */
function analyzeConsistency(response: string): number {
  const responseLower = response.toLowerCase();
  let inconsistencyPenalty = 0;

  // Cek kontradiksi umum
  const contradictions = [
    { a: ["harus semangat"], b: ["gapape kalo capek", "boleh istirahat"] },
    { a: ["lupakan aja"], b: ["ceritain", "ingat"] },
    { a: ["jangan nangis"], b: ["gapape nangis", "wajar nangis"] },
    { a: ["sendiri"], b: ["disini buat kamu", "aku temani"] },
  ];

  for (const pair of contradictions) {
    const hasA = pair.a.some((p) => responseLower.includes(p));
    const hasB = pair.b.some((p) => responseLower.includes(p));
    if (hasA && hasB) {
      inconsistencyPenalty += 20;
    }
  }

  // Skor dasar 100, kurangi penalty
  return Math.max(0, 100 - inconsistencyPenalty);
}

// ANALISIS KEKHUSUSAN

/**
 * Menganalisis seberapa spesifik respons.
 * Respons yang baik memiliki kata-kata spesifik, bukan generik.
 *
 * @param response - Respons chatbot
 * @returns { score, genericPhrases }
 */
function analyzeSpecificity(response: string): {
  score: number;
  genericPhrases: string[];
} {
  const responseLower = response.toLowerCase();
  const matchedGeneric: string[] = [];

  // Cari frasa generik
  for (const phrase of GENERIC_PHRASES) {
    if (responseLower.includes(phrase)) {
      matchedGeneric.push(phrase);
    }
  }

  // Hitung rasio kata unik
  const words = tokenize(response);
  const uniqueWords = new Set(words);
  const uniqueRatio = uniqueWords.size / Math.max(words.length, 1);

  // Skor: semakin banyak frasa generik, semakin rendah skor
  const genericPenalty = matchedGeneric.length * 15;
  const specificityBase = Math.round(uniqueRatio * 100);

  // Panjang respons juga mempengaruhi (respons terlalu pendek = kurang spesifik)
  const lengthScore = Math.min(100, (words.length / 50) * 100);

  const score = Math.max(
    0,
    Math.round(
      specificityBase * 0.3 + lengthScore * 0.3 - genericPenalty * 0.4,
    ),
  );

  return { score, genericPhrases: matchedGeneric };
}

// ANALISIS PENGGUNAAN RETRIEVAL CONTEXT

/**
 * Menganalisis apakah respons menggunakan konteks retrieval.
 *
 * @param response - Respons chatbot
 * @param retrievedChunks - Chunks yang diretrieve
 * @returns { usesRetrieval, overlapPercent, phrases }
 */
function analyzeRetrievalUsage(
  response: string,
  retrievedChunks: RetrievedChunkInfo[],
): {
  usesRetrieval: boolean;
  overlapPercent: number;
  phrases: string[];
} {
  const responseLower = response.toLowerCase();
  const matchedPhrases: string[] = [];

  // Cek frasa yang menunjukkan penggunaan retrieval
  for (const phrase of RETRIEVAL_PHRASES) {
    if (responseLower.includes(phrase)) {
      matchedPhrases.push(phrase);
    }
  }

  // Hitung overlap dengan chunk text
  const responseWords = new Set(tokenize(response));
  const chunkWords = new Set(
    retrievedChunks.flatMap((c) => {
      const text = `${c.topic} ${c.situation} ${c.emotions.join(" ")}`;
      return tokenize(text);
    }),
  );

  const overlap = [...responseWords].filter((w) => chunkWords.has(w));
  const overlapPercent =
    responseWords.size > 0 ? (overlap.length / responseWords.size) * 100 : 0;

  return {
    usesRetrieval: matchedPhrases.length > 0 || overlapPercent > 20,
    overlapPercent: Math.round(overlapPercent * 100) / 100,
    phrases: matchedPhrases,
  };
}

// MAIN ANALYZER

/**
 * Menganalisis kualitas respons chatbot secara lengkap.
 *
 * @param response - Respons chatbot
 * @param userInput - Input user
 * @param retrievedChunks - Chunks yang diretrieve (opsional)
 * @returns ResponseQualityResult
 */
export function analyzeResponseQuality(
  response: string,
  userInput: string,
  retrievedChunks?: RetrievedChunkInfo[],
): ResponseQualityResult {
  // Analisis kesesuaian konteks
  const contextual = analyzeContextualFit(response, userInput);

  // Analisis empati
  const empathy = analyzeEmpathy(response);

  // Analisis konsistensi
  const consistencyScore = analyzeConsistency(response);

  // Analisis kekhususan
  const specificity = analyzeSpecificity(response);

  // Analisis penggunaan retrieval
  const retrieval = retrievedChunks
    ? analyzeRetrievalUsage(response, retrievedChunks)
    : { usesRetrieval: false, overlapPercent: 0, phrases: [] };

  // Skor akhir empati (dari contextual)
  const finalEmpathyScore = empathy.score;

  return {
    contextualFit: contextual.score,
    empathyScore: finalEmpathyScore,
    consistencyScore,
    specificityScore: specificity.score,
    usesRetrievalContext: retrieval.usesRetrieval,
    retrievalOverlapPercent: retrieval.overlapPercent,
    details: {
      contextualMarkers: contextual.markers,
      empathyMarkers: empathy.markers,
      genericPhrases: specificity.genericPhrases,
      retrievalPhrases: retrieval.phrases,
    },
  };
}

// GENERATE TABEL ANALISIS (MARKDOWN)

/**
 * Menghasilkan tabel analisis kualitas dalam format Markdown.
 *
 * @param result - Hasil analisis kualitas
 * @returns String markdown
 */
export function generateQualityTable(result: ResponseQualityResult): string {
  const lines: string[] = [];

  lines.push(`### Analisis Kualitas Respons`);
  lines.push(``);
  lines.push(`| Dimensi | Skor | Detail |`);
  lines.push(`|---------|------|--------|`);
  lines.push(
    `| Kesesuaian Konteks | ${result.contextualFit}/100 | ${result.details.contextualMarkers.length > 0 ? "Frasa konteks: " + result.details.contextualMarkers.slice(0, 3).join(", ") : "Tidak ada frasa konteks"} |`,
  );
  lines.push(
    `| Empati | ${result.empathyScore}/100 | ${result.details.empathyMarkers.length > 0 ? "Frasa empati: " + result.details.empathyMarkers.slice(0, 3).join(", ") : "Tidak ada frasa empati"} |`,
  );
  lines.push(
    `| Konsistensi | ${result.consistencyScore}/100 | ${result.consistencyScore >= 80 ? "Konsisten" : "Ada kontradiksi"} |`,
  );
  lines.push(
    `| Kekhususan | ${result.specificityScore}/100 | ${result.details.genericPhrases.length > 0 ? "Frasa generik: " + result.details.genericPhrases.slice(0, 3).join(", ") : "Spesifik"} |`,
  );
  lines.push(
    `| Penggunaan Retrieval | ${result.usesRetrievalContext ? "Ya" : "Tidak"} | Overlap: ${result.retrievalOverlapPercent}% |`,
  );
  lines.push(``);

  return lines.join("\n");
}
