/**
 * ============================================================
 * TEXT OVERLAP — PENGUKURAN IRISAN TEKS
 * ============================================================
 *
 * Text overlap adalah metrik sederhana yang mengukur seberapa
 * banyak kata yang sama antara dua teks.
 *
 * Metrik ini berguna untuk:
 * - Mengecek apakah respons chatbot menggunakan informasi
 *   dari retrieved chunks
 * - Mengukur kesamaan topik antara query dan respons
 * - Validasi bahwa chatbot tidak keluar dari konteks
 *
 * PENGGUNAAN UNTUK SKRIPSI:
 *   Metode ini mudah dijelaskan saat sidang. Cukup hitung
 *   irisan kata antara dua teks, lalu bagi dengan total
 *   kata unik.
 *
 *   Contoh:
 *   Teks A: "saya merasa cemas dengan masa depan"
 *   Teks B: "kamu merasa cemas ya, ceritakan lebih lanjut"
 *   Overlap: {saya, merasa, cemas} = 3 kata
 *   Union: {saya, merasa, cemas, dengan, masa, depan, kamu, ya,
 *           ceritakan, lebih, lanjut} = 11 kata
 *   Jaccard = 3/11 = 0.27
 *
 * @author  Tim Skripsi
 * @version 1.0
 * ============================================================
 */

// ------------------------------------------------------------------
// JACCARD SIMILARITY COEFFICIENT
// ------------------------------------------------------------------

/**
 * Menghitung Jaccard Similarity antara dua teks.
 *
 * Rumus:
 *   J(A, B) = |A ∩ B| / |A ∪ B|
 *
 * Dimana A dan B adalah set token dari masing-masing teks.
 *
 * Nilai:
 *   1.0 = kedua teks memiliki token yang identik
 *   0.0 = tidak ada token yang sama
 *
 * @param textA - Teks pertama
 * @param textB - Teks kedua
 * @returns Nilai Jaccard similarity (0.0 - 1.0)
 */
export function jaccardSimilarity(textA: string, textB: string): number {
  const tokensA = new Set(tokenize(textA))
  const tokensB = new Set(tokenize(textB))

  // Jika kedua teks kosong, anggap identik
  if (tokensA.size === 0 && tokensB.size === 0) {
    return 1.0
  }

  // Hitung irisan (intersection)
  const intersection = new Set(
    [...tokensA].filter((token) => tokensB.has(token))
  )

  // Hitung gabungan (union)
  const union = new Set([...tokensA, ...tokensB])

  return intersection.size / union.size
}

// ------------------------------------------------------------------
// OVERLAP COEFFICIENT (Szymkiewicz–Simpson)
// ------------------------------------------------------------------

/**
 * Overlap Coefficient mengukur proporsi overlap terhadap
 * teks yang lebih kecil.
 *
 * Rumus:
 *   O(A, B) = |A ∩ B| / min(|A|, |B|)
 *
 * Berbeda dengan Jaccard, metrik ini tidak terpengaruh oleh
 * ukuran teks yang lebih besar.
 *
 * Berguna ketika satu teks jauh lebih panjang dari lainnya.
 *
 * @param textA - Teks pertama
 * @param textB - Teks kedua
 * @returns Nilai overlap coefficient (0.0 - 1.0)
 */
export function overlapCoefficient(textA: string, textB: string): number {
  const tokensA = new Set(tokenize(textA))
  const tokensB = new Set(tokenize(textB))

  if (tokensA.size === 0 || tokensB.size === 0) {
    return 0
  }

  const intersection = new Set(
    [...tokensA].filter((token) => tokensB.has(token))
  )

  const minSize = Math.min(tokensA.size, tokensB.size)

  return intersection.size / minSize
}

// ------------------------------------------------------------------
// WORD OVERLAP SCORE (Composite)
// ------------------------------------------------------------------

/**
 * Menghitung composite word overlap score.
 * Menggabungkan Jaccard dan Overlap Coefficient untuk
 * memberikan gambaran yang lebih lengkap.
 *
 * Final score = (Jaccard + Overlap) / 2
 *
 * @param textA - Teks pertama
 * @param textB - Teks kedua
 * @returns Composite overlap score (0.0 - 1.0)
 */
export function wordOverlapScore(textA: string, textB: string): number {
  const jaccard = jaccardSimilarity(textA, textB)
  const overlap = overlapCoefficient(textA, textB)

  return (jaccard + overlap) / 2
}

// ------------------------------------------------------------------
// HELPER
// ------------------------------------------------------------------

/**
 * Tokenisasi teks untuk perbandingan.
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 0 && t.length > 2) // Filter kata pendek (stopword kasar)
}
