/**
 * EMPATHY EVALUATOR â€” EVALUASI TINGKAT EMPATI CHATBOT
 *
 * Evaluator ini mengukur seberapa empatik respons chatbot
 * terhadap kondisi emosional user.
 *
 * Tiga dimensi empati yang diukur:
 * 1. EMOTIONAL VALIDATION â€” Apakah chatbot memvalidasi perasaan user?
 * 2. UNDERSTANDING â€” Apakah chatbot menunjukkan pemahaman?
 * 3. SUPPORTIVENESS â€” Apakah chatbot memberikan dukungan?
 *
 * PENGGUNAAN UNTUK SKRIPSI:
 *   Menjawab pertanyaan:
 *   "Apakah chatbot menunjukkan empati yang cukup dalam
 *    menanggapi curhat user?"
 *
 *   Empati adalah komponen krusial untuk chatbot curhat.
 *   Tanpa empati, respons akan terasa dingin dan robotik.
 *
 * @author  Tim Skripsi
 * @version 1.0
 */

import { EmpathyScore, TestScenario } from "@test/types";
import { EMOTIONAL_KEYWORD_GROUPS } from "@test/types/utils/keyword-matching";
import { clampScore } from "@test/types/utils/scoring";

// DIMENSI 1: EMOTIONAL VALIDATION

/**
 * Mengukur seberapa baik chatbot memvalidasi emosi user.
 *
 * Indikator:
 * - Menggunakan kata validasi (wajar, normal, paham, dll)
 * - Mengakui perasaan user tanpa menghakimi
 * - Tidak meremehkan emosi user
 *
 * @param botResponse - Respons chatbot
 * @returns Skor validasi emosional (0-100)
 */
function evaluateEmotionalValidation(botResponse: string): number {
  const responseLower = botResponse.toLowerCase();

  // Kata-kata validasi
  const validationWords = EMOTIONAL_KEYWORD_GROUPS.validation || [];
  const validationCount = validationWords.filter((w) =>
    responseLower.includes(w),
  ).length;

  // Rasio validasi
  const validationRatio = validationCount / validationWords.length;

  // Bonus: kehadiran kata validasi yang kuat
  const strongValidation = ["valid", "wajar", "pantas", "berhak", "manusiawi"];
  const strongCount = strongValidation.filter((w) =>
    responseLower.includes(w),
  ).length;

  // Penalti: kata yang menunjukkan kurangnya validasi
  const invalidatingWords = [
    "biasa aja",
    "jangan gitu",
    "ga usah",
    "berlebihan",
    "lupakan",
  ];
  const invalidatingCount = invalidatingWords.filter((w) =>
    responseLower.includes(w),
  ).length;

  let score =
    validationRatio * 60 + // 60% dari rasio validasi
    strongCount * 10 + // 10 poin per kata validasi kuat
    10; // Base score

  // Penalti
  if (invalidatingCount > 0) {
    score -= invalidatingCount * 20;
  }

  return clampScore(score);
}

// DIMENSI 2: PEMAHAMAN (UNDERSTANDING)

/**
 * Mengukur seberapa baik chatbot menunjukkan pemahaman.
 *
 * Indikator:
 * - Menunjukkan bahwa ia mendengarkan
 * - Merefleksikan kembali perasaan user
 * - Menggunakan bahasa yang menunjukkan pemahaman
 *
 * @param botResponse - Respons chatbot
 * @returns Skor pemahaman (0-100)
 */
function evaluateUnderstanding(botResponse: string): number {
  const responseLower = botResponse.toLowerCase();

  // Indikator pemahaman
  const understandingIndicators = [
    "aku denger",
    "aku tau",
    "aku paham",
    "aku ngerti",
    "aku mengerti",
    "kedengarannya",
    "sepertinya",
    "kayaknya",
    "berarti",
    "aku bisa bayangin",
    "aku bisa lihat",
  ];

  const indicatorCount = understandingIndicators.filter((w) =>
    responseLower.includes(w),
  ).length;

  // Indikator eksplorasi (menanyakan lebih lanjut)
  const explorationIndicators = [
    "ceritain",
    "cerita lebih",
    "bagaimana perasaan",
    "apa yang kamu",
    "coba cerita",
    "kenapa",
    "gimana",
  ];

  const explorationCount = explorationIndicators.filter((w) =>
    responseLower.includes(w),
  ).length;

  // Skor: indikator + eksplorasi
  const score =
    Math.min(indicatorCount, 5) * 12 + // Maks 60 dari indikator
    Math.min(explorationCount, 4) * 10 + // Maks 40 dari eksplorasi
    10; // Base score

  return clampScore(score);
}

// DIMENSI 3: DUKUNGAN (SUPPORTIVENESS)

/**
 * Mengukur seberapa mendukung respons chatbot.
 *
 * Indikator:
 * - Menawarkan kehadiran (aku disini, aku temani)
 * - Memberikan semangat yang tulus
 * - Menawarkan bantuan
 * - Tidak memaksa atau mendikte
 *
 * @param botResponse - Respons chatbot
 * @returns Skor dukungan (0-100)
 */
function evaluateSupportiveness(botResponse: string): number {
  const responseLower = botResponse.toLowerCase();

  // Indikator kehadiran
  const presenceIndicators = [
    "disini",
    "bersama",
    "temani",
    "temenin",
    "ada untuk",
    "ga sendiri",
  ];
  const presenceCount = presenceIndicators.filter((w) =>
    responseLower.includes(w),
  ).length;

  // Indikator dukungan
  const supportWords = EMOTIONAL_KEYWORD_GROUPS.support || [];
  const supportCount = supportWords.filter((w) =>
    responseLower.includes(w),
  ).length;

  // Indikator dorongan positif
  const encouragementIndicators = [
    "pelan-pelan",
    "bertahap",
    "gapapa",
    "tidak apa",
    "berani",
    "hebat",
    "kuat",
  ];
  const encouragementCount = encouragementIndicators.filter((w) =>
    responseLower.includes(w),
  ).length;

  // Penalti: nada yang memaksa atau judgemental
  const dismissiveWords = EMOTIONAL_KEYWORD_GROUPS.dismissive || [];
  const dismissiveCount = dismissiveWords.filter((w) =>
    responseLower.includes(w),
  ).length;

  let score =
    Math.min(presenceCount, 3) * 15 + // Maks 45
    Math.min(supportCount, 4) * 8 + // Maks 32
    Math.min(encouragementCount, 4) * 8 + // Maks 32
    10; // Base

  if (dismissiveCount > 0) {
    score -= dismissiveCount * 25;
  }

  return clampScore(score);
}

// EVALUATOR UTAMA

/**
 * Mengevaluasi tingkat empati dalam respons chatbot.
 *
 * Tiga dimensi dengan bobot:
 * - Emotional Validation: 35%
 * - Understanding: 35%
 * - Supportiveness: 30%
 *
 * @param botResponse - Respons chatbot
 * @param scenario - Skenario pengujian (untuk konteks)
 * @returns EmpathyScore
 */
export function evaluateEmpathy(
  botResponse: string,
  _scenario: TestScenario,
): EmpathyScore {
  const emotionalValidation = evaluateEmotionalValidation(botResponse);
  const understanding = evaluateUnderstanding(botResponse);
  const supportiveness = evaluateSupportiveness(botResponse);

  // Final score: weighted average
  const finalScore = clampScore(
    emotionalValidation * 0.35 + understanding * 0.35 + supportiveness * 0.3,
  );

  // Verdict
  let verdict: EmpathyScore["verdict"];
  if (finalScore >= 85) verdict = "SANGAT_EMPATIK";
  else if (finalScore >= 70) verdict = "EMPATIK";
  else if (finalScore >= 55) verdict = "CUKUP";
  else if (finalScore >= 40) verdict = "KURANG";
  else verdict = "TIDAK_EMPATIK";

  return {
    emotionalValidation,
    understanding,
    supportiveness,
    finalScore,
    verdict,
  };
}
