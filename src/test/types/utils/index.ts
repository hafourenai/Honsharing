/**
 * ============================================================
 * BARREL FILE — UTILITY EVALUASI
 * ============================================================
 *
 * Re-export semua fungsi utility untuk kemudahan import.
 *
 * @author  Tim Skripsi
 * @version 1.0
 * ============================================================
 */

export { cosineSimilarity, textCosineSimilarity } from "./cosine-similarity"
export {
  jaccardSimilarity,
  overlapCoefficient,
  wordOverlapScore,
} from "./text-overlap"
export {
  keywordGroupScore,
  requiredKeywordScore,
  hasForbiddenKeywords,
  keywordMatchingScore,
  EMOTIONAL_KEYWORD_GROUPS,
} from "./keyword-matching"
export {
  getVerdict,
  normalizeCosineScore,
  normalizeScore,
  clampScore,
  weightedAverage,
  standardDeviation,
  getVerdictDescription,
} from "./scoring"

export type { Verdict } from "./scoring"
