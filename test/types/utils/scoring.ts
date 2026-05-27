

import { TEST_CONFIG } from "@test/config/test-config";

// VERDICT / PREDIKAT KELULUSAN

/**
 * Tipe verdict untuk evaluasi.
 * Digunakan untuk memberikan interpretasi hasil skor.
 */
export type Verdict =
  | "SANGAT_BAIK"
  | "BAIK"
  | "CUKUP"
  | "KURANG"
  | "TIDAK_MEMADAI";

/**
 * Mengonversi skor numerik (0-100) menjadi verdict.
 *
 * Threshold ditentukan di TEST_CONFIG.evaluationThresholds.verdict.
 *
 * @param score - Skor numerik (0-100)
 * @returns Verdict string
 *
 * @example
 * getVerdict(90) // "SANGAT_BAIK"
 * getVerdict(45) // "KURANG"
 */
export function getVerdict(score: number): Verdict {
  const t = TEST_CONFIG.evaluationThresholds.verdict;

  if (score >= t.SANGAT) return "SANGAT_BAIK";
  if (score >= t.BAIK) return "BAIK";
  if (score >= t.CUKUP) return "CUKUP";
  if (score >= t.KURANG) return "KURANG";
  return "TIDAK_MEMADAI";
}

// NORMALISASI SKOR

/**
 * Menormalisasi cosine similarity (-1..1) ke skor 0-100.
 *
 * Rumus: (similarity + 1) / 2 * 100
 * - similarity = 1.0 -> 100
 * - similarity = 0.0 -> 50
 * - similarity = -1.0 -> 0
 *
 * @param similarity - Nilai cosine similarity (-1 hingga 1)
 * @returns Skor ternormalisasi (0-100)
 */
export function normalizeCosineScore(similarity: number): number {
  return Math.round(((similarity + 1) / 2) * 100);
}

/**
 * Menormalisasi nilai 0..1 ke skor 0-100.
 *
 * @param value - Nilai 0.0 - 1.0
 * @returns Skor 0-100
 */
export function normalizeScore(value: number): number {
  return Math.round(Math.max(0, Math.min(1, value)) * 100);
}

/**
 * Membulatkan skor ke integer dan memastikan dalam range 0-100.
 *
 * @param score - Skor mentah
 * @returns Skor yang sudah dibulatkan dan di-clamp
 */
export function clampScore(score: number): number {
  return Math.round(Math.max(0, Math.min(100, score)));
}

// RATA-RATA TERTIMBANG

/**
 * Menghitung rata-rata tertimbang (weighted average).
 *
 * @param values - Array objek { value, weight }
 * @returns Rata-rata tertimbang
 *
 * @example
 * weightedAverage([
 *   { value: 80, weight: 0.4 },
 *   { value: 70, weight: 0.6 },
 * ])
 * // Returns: 74
 */
export function weightedAverage(
  items: { value: number; weight: number }[],
): number {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);

  if (totalWeight === 0) return 0;

  const weightedSum = items.reduce(
    (sum, item) => sum + item.value * item.weight,
    0,
  );

  return weightedSum / totalWeight;
}

// STANDAR DEVIASI

/**
 * Menghitung standar deviasi dari array angka.
 *
 * @param values - Array angka
 * @returns Standar deviasi
 */
export function standardDeviation(values: number[]): number {
  if (values.length === 0) return 0;

  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const squaredDiffs = values.map((v) => (v - mean) ** 2);
  const variance = squaredDiffs.reduce((s, v) => s + v, 0) / values.length;

  return Math.round(Math.sqrt(variance) * 100) / 100;
}

// DESKRIPSI VERDICT (UNTUK REPORT)

/**
 * Mendapatkan deskripsi akademik untuk suatu verdict.
 */
export function getVerdictDescription(verdict: Verdict): string {
  const descriptions: Record<Verdict, string> = {
    SANGAT_BAIK:
      "Sistem menunjukkan performa yang sangat baik. Respons relevan, empatik, dan konsisten dengan konteks emosional.",
    BAIK: "Sistem menunjukkan performa yang baik. Sebagian besar respons sesuai dengan konteks emosional yang diharapkan.",
    CUKUP:
      "Sistem menunjukkan performa yang cukup. Beberapa respons masih kurang relevan atau kurang empatik.",
    KURANG:
      "Sistem menunjukkan performa yang kurang. Banyak respons yang tidak sesuai dengan konteks emosional.",
    TIDAK_MEMADAI:
      "Sistem menunjukkan performa yang tidak memadai. Respons tidak relevan dengan konteks emosional yang diberikan.",
  };

  return descriptions[verdict];
}
