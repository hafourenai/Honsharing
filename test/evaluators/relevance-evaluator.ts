/**
 * RELEVANCE EVALUATOR â€” EVALUASI RELEVANSI RESPONS
 *
 * Evaluator ini mengukur relevansi respons chatbot terhadap:
 * 1. Konten â€” apakah respons menjawab/merespon konteks user
 * 2. Emosi â€” apakah respons sesuai dengan keadaan emosional user
 * 3. Tone â€” apakah nada bicara sesuai dengan situasi
 *
 * PENGGUNAAN UNTUK SKRIPSI:
 *   Menjawab pertanyaan:
 *   "Apakah chatbot memberikan respons yang relevan secara
 *    konten dan emosional?"
 *
 * Skor 0-100 untuk setiap aspek.
 *
 * @author  Tim Skripsi
 * @version 1.0
 */

import { RelevanceScore, TestScenario } from "@test/types";
import { TEST_CONFIG } from "@test/config/test-config";
import { textCosineSimilarity } from "@test/types/utils/cosine-similarity";
import { clampScore } from "@test/types/utils/scoring";

// EVALUASI RELEVANSI KONTEN

/**
 * Mengukur relevansi konten respons terhadap input user.
 *
 * Strategi:
 * 1. Cosine similarity antara respons dan input user
 * 2. Normalisasi ke skor 0-100
 * 3. Tambahan poin jika respons mengandung kata dari input user
 *
 * @param botResponse - Respons chatbot
 * @param userInput - Input user
 * @returns Skor relevansi konten (0-100)
 */
function evaluateContentRelevance(
  botResponse: string,
  userInput: string,
): number {
  // Cosine similarity antara respons dan input user
  const similarity = textCosineSimilarity(botResponse, userInput);

  // Normalisasi: cosine similarity 0.0-1.0 menjadi skor 0-100
  const baseScore = similarity * 100;

  // Bonus: jika respons mengandung kata-kata penting dari input
  const userWords = userInput
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3);
  const responseLower = botResponse.toLowerCase();
  const overlapCount = userWords.filter((w) =>
    responseLower.includes(w),
  ).length;
  const overlapRatio =
    userWords.length > 0 ? overlapCount / userWords.length : 0;

  // Kombinasi: 70% similarity + 30% overlap
  return clampScore(baseScore * 0.7 + overlapRatio * 100 * 0.3);
}

// EVALUASI RELEVANSI EMOSIONAL

/**
 * Mengukur relevansi emosional respons.
 *
 * Strategi:
 * 1. Cek apakah respons mengandung kata-kata yang sesuai dengan
 *    emosi yang diharapkan (dari scenario.expectedEmotionalDirection)
 * 2. Cek apakah tone respons sesuai dengan yang diharapkan
 * 3. Cek apakah respons tidak menggunakan kata yang bertentangan
 *    dengan arah emosional
 *
 * @param botResponse - Respons chatbot
 * @param scenario - Skenario pengujian
 * @returns Skor relevansi emosional (0-100)
 */
function evaluateEmotionalRelevance(
  botResponse: string,
  scenario: TestScenario,
): number {
  const responseLower = botResponse.toLowerCase();
  const directions = scenario.expectedEmotionalDirection;

  if (directions.length === 0) return 50; // Nilai tengah jika tidak ada acuan

  let totalScore = 0;

  for (const direction of directions) {
    // Tokenisasi arah emosional menjadi kata kunci
    const keywords = direction
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3);

    // Hitung berapa banyak kata kunci yang muncul dalam respons
    const matchedCount = keywords.filter((kw) =>
      responseLower.includes(kw),
    ).length;
    const ratio = keywords.length > 0 ? matchedCount / keywords.length : 0;

    totalScore += ratio * 100;
  }

  // Rata-rata skor dari semua arah emosional
  const avgScore = totalScore / directions.length;

  // Penalti jika respons mengandung kata judgemental
  const judgementalWords = ["lebay", "berlebihan", "cengeng", "lemah", "malas"];
  const hasJudgemental = judgementalWords.some((w) =>
    responseLower.includes(w),
  );
  const penalty = hasJudgemental ? 30 : 0;

  return clampScore(avgScore - penalty);
}

// EVALUASI KESESUAIAN TONE

/**
 * Mengukur kesesuaian tone respons chatbot.
 *
 * Kriteria:
 * - Nada hangat (warm) vs dingin
 * - Nada mendukung (supportive) vs menghakimi
 * - Nada sabar (patient) vs tergesa-gesa
 * - Penggunaan bahasa yang sesuai (tidak kaku/formal berlebihan)
 *
 * @param botResponse - Respons chatbot
 * @returns Skor kesesuaian tone (0-100)
 */
function evaluateToneAppropriateness(botResponse: string): number {
  const responseLower = botResponse.toLowerCase();

  // Positif indicators (tone yang baik untuk curhat)
  const positiveIndicators = [
    "paham",
    "ngerti",
    "wajar",
    "disini",
    "cerita",
    "pelan",
    "tenang",
    "denger",
    "bersama",
    "sendiri",
    "gapapa",
    "kok",
    "ya",
    "sih",
  ];

  // Negatif indicators (tone yang tidak sesuai)
  const negativeIndicators = [
    "harusnya",
    "seharusnya",
    "kamu salah",
    "sebaiknya",
    "pokoknya",
    "pasti",
    "jangan pernah",
    "ga boleh",
  ];

  const positiveCount = positiveIndicators.filter((w) =>
    responseLower.includes(w),
  ).length;
  const negativeCount = negativeIndicators.filter((w) =>
    responseLower.includes(w),
  ).length;

  // Skor: proporsi positif minus penalti negatif
  const positiveRatio = positiveCount / Math.max(1, positiveIndicators.length);
  const negativeRatio = negativeCount / Math.max(1, negativeIndicators.length);

  const score = positiveRatio * 100 - negativeRatio * 50;

  return clampScore(score);
}

// EVALUATOR UTAMA

/**
 * Mengevaluasi relevansi respons chatbot terhadap skenario.
 *
 * Menggabungkan:
 * - Content relevance (30%)
 * - Emotional relevance (40%)
 * - Tone appropriateness (30%)
 *
 * @param botResponse - Respons dari chatbot
 * @param scenario - Skenario pengujian
 * @returns RelevanceScore
 */
export function evaluateRelevance(
  botResponse: string,
  scenario: TestScenario,
): RelevanceScore {
  const contentRelevance = evaluateContentRelevance(
    botResponse,
    scenario.userInput,
  );
  const emotionalRelevance = evaluateEmotionalRelevance(botResponse, scenario);
  const toneAppropriateness = evaluateToneAppropriateness(botResponse);

  // Skor akhir: weighted average
  const finalScore = clampScore(
    contentRelevance * 0.3 +
      emotionalRelevance * 0.4 +
      toneAppropriateness * 0.3,
  );

  // Verdict
  let verdict: RelevanceScore["verdict"];
  if (finalScore >= 85) verdict = "SANGAT_RELEVAN";
  else if (finalScore >= 70) verdict = "RELEVAN";
  else if (finalScore >= 55) verdict = "CUKUP";
  else if (finalScore >= 40) verdict = "KURANG";
  else verdict = "TIDAK_RELEVAN";

  return {
    contentRelevance,
    emotionalRelevance,
    toneAppropriateness,
    finalScore,
    verdict,
  };
}
