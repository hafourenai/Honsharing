/**
 * SIMILARITY EVALUATOR â€” EVALUASI KESAMAAN RESPONS
 *
 * Evaluator ini mengukur seberapa mirip respons chatbot
 * dengan konteks yang diharapkan.
 *
 * Metrik yang digunakan:
 * 1. COSINE SIMILARITY (text-based)
 *    - Mengukur kesamaan vektor kata antara query dan respons
 *    - Skala 0.0 - 1.0
 *
 * 2. TEXT OVERLAP (Jaccard + Overlap Coefficient)
 *    - Mengukur irisan kata antara respons dan konteks
 *    - Skala 0.0 - 1.0
 *
 * 3. KEYWORD MATCHING
 *    - Mengecek kehadiran kata kunci yang diharapkan
 *    - Mengecek ketidakhadiran kata kunci terlarang
 *    - Skala 0-100
 *
 * PENGGUNAAN UNTUK SKRIPSI:
 *   Evaluator ini menjawab pertanyaan:
 *   "Apakah respons chatbot relevan dengan konteks
 *    emosional yang diberikan?"
 *
 * @author  Tim Skripsi
 * @version 1.0
 */

import { SimilarityScore, TestScenario, EvaluationResult } from "@test/types";
import { TEST_CONFIG } from "@test/config/test-config";
import { textCosineSimilarity } from "@test/types/utils/cosine-similarity";
import { wordOverlapScore } from "@test/types/utils/text-overlap";
import { keywordMatchingScore } from "@test/types/utils/keyword-matching";
import { clampScore, weightedAverage } from "@test/types/utils/scoring";

// INTERPRETASI SIMILARITY
/**
 * Menginterpretasikan skor similarity menjadi verdict.
 *
 * Threshold:
 * - SANGAT_RELEVAN  : >= 0.8
 * - RELEVAN         : >= 0.6
 * - CUKUP           : >= 0.4
 * - KURANG          : >= 0.2
 * - TIDAK_RELEVAN   : < 0.2
 */
function interpretSimilarity(score: number): SimilarityScore["verdict"] {
  const t = TEST_CONFIG.evaluationThresholds.cosineThresholds;

  if (score >= t.sangatRelevan) return "SANGAT_RELEVAN";
  if (score >= t.relevan) return "RELEVAN";
  if (score >= t.cukup) return "CUKUP";
  if (score >= t.kurang) return "KURANG";
  return "TIDAK_RELEVAN";
}

// EVALUASI UTAMA

/**
 * Mengevaluasi similarity antara respons chatbot dengan konteks.
 *
 * @param botResponse - Respons dari chatbot
 * @param scenario - Skenario pengujian
 * @returns SimilarityScore dengan detail dan verdict
 *
 * @example
 * const result = evaluateSimilarity(
 *   "Wajar kok kalo kamu merasa gitu...",
 *   overthinkingScenario
 * )
 * console.log(result.finalScore) // 0-100
 * console.log(result.verdict) // "RELEVAN"
 */
export function evaluateSimilarity(
  botResponse: string,
  scenario: TestScenario,
): SimilarityScore {
  // 1. COSINE SIMILARITY
  //    Membandingkan respons bot dengan input user
  const cosineSim = textCosineSimilarity(botResponse, scenario.userInput);

  // 2. TEXT OVERLAP
  //    Mengukur irisan kata antara respons bot dengan
  //    konteks yang diharapkan (situasi dari chunks)
  const retrievedSituations = scenario.expectedRetrievedContext
    .map((ctx) => ctx.situation)
    .join(" ");

  const textOverlap = wordOverlapScore(botResponse, retrievedSituations);

  // 3. KEYWORD MATCHING
  //    Mengecek kata kunci yang harus ada dan terlarang
  const keywordResult = keywordMatchingScore(
    botResponse,
    scenario.requiredKeywords || [],
    scenario.forbiddenKeywords || [],
  );

  // SKOR AKHIR (Weighted)
  const weights = TEST_CONFIG.evaluationThresholds.similarityWeights;
  const finalScore = clampScore(
    weightedAverage([
      { value: cosineSim * 100, weight: weights.cosineSimilarity },
      { value: textOverlap * 100, weight: weights.textOverlap },
      { value: keywordResult.score, weight: weights.keywordMatch },
    ]),
  );

  return {
    cosineSimilarity: Math.round(cosineSim * 1000) / 1000,
    textOverlap: Math.round(textOverlap * 1000) / 1000,
    keywordMatch: Math.round((keywordResult.score / 100) * 1000) / 1000,
    finalScore,
    verdict: interpretSimilarity(finalScore / 100),
  };
}
