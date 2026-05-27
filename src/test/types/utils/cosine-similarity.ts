/**
 * ============================================================
 * COSINE SIMILARITY — IMPLEMENTASI UNTUK EVALUASI
 * ============================================================
 *
 * Cosine similarity adalah metrik yang mengukur kesamaan
 * antara dua vektor dalam ruang multidimensi.
 *
 * Rumus:
 *   cosine_similarity(A, B) = (A · B) / (||A|| * ||B||)
 *
 * Nilai berkisar antara -1 hingga 1:
 *   +1.0 : vektor identik / sangat mirip
 *   +0.5 : cukup mirip
 *    0.0 : tidak ada hubungan
 *   -1.0 : vektor berlawanan
 *
 * Untuk teks, kita mengubah teks menjadi representasi vektor
 * menggunakan pendekatan bag-of-words atau TF-IDF sederhana.
 *
 * PENGGUNAAN UNTUK SKRIPSI:
 *   Metrik ini digunakan untuk mengukur seberapa relevan respons
 *   chatbot terhadap:
 *   - Query user
 *   - Retrieved chunks (konteks RAG)
 *   - Konteks emosional yang diharapkan
 *
 * @author  Tim Skripsi
 * @version 1.0
 * ============================================================
 */

// ------------------------------------------------------------------
// COSINE SIMILARITY — Vektor Numerik
// ------------------------------------------------------------------

/**
 * Menghitung cosine similarity antara dua vektor numerik.
 * Ini adalah implementasi standar yang sama dengan yang digunakan
 * di production (src/lib/rag/indexeddb-store.ts).
 *
 * @param a - Vektor pertama
 * @param b - Vektor kedua
 * @returns Nilai cosine similarity (-1 hingga 1)
 *
 * @example
 * const sim = cosineSimilarity([1, 2, 3], [1, 2, 3])
 * // Returns: 1.0 (identik)
 *
 * const sim2 = cosineSimilarity([1, 0, 0], [0, 1, 0])
 * // Returns: 0.0 (ortogonal / tidak related)
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  // Validasi: kedua vektor harus memiliki panjang yang sama
  if (a.length !== b.length) {
    throw new Error(
      `Vector dimension mismatch: a=${a.length}, b=${b.length}`
    )
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  // Hindari division by zero
  if (normA === 0 || normB === 0) {
    return 0
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

/**
 ============================================================
 * TEXT-BASED COSINE SIMILARITY (Bag of Words)
 * ============================================================
 *
 * Pendekatan sederhana untuk menghitung cosine similarity
 * antara dua teks tanpa perlu embedding vector.
 *
 * Cara kerja:
 * 1. Tokenisasi kedua teks (split spasi + lowercase)
 * 2. Buat vocabulary dari gabungan token
 * 3. Hitung term frequency untuk setiap teks
 * 4. Hitung cosine similarity dari vektor frekuensi
 *
 * KELEBIHAN:
 * - Sederhana dan mudah dijelaskan saat sidang
 * - Tidak perlu dependency tambahan
 * - Cepat dieksekusi
 *
 * KEKURANGAN:
 * - Tidak menangkap sinonim (misal: "sedih" vs "murung")
 * - Tidak menangkap urutan kata
 * - Rentan terhadap stopwords
 *
 * @param textA - Teks pertama
 * @param textB - Teks kedua
 * @returns Nilai cosine similarity (0 hingga 1)
 */
export function textCosineSimilarity(textA: string, textB: string): number {
  // Tokenisasi dan lowercase
  const tokensA = tokenize(textA)
  const tokensB = tokenize(textB)

  if (tokensA.length === 0 || tokensB.length === 0) {
    return 0
  }

  // Buat vocabulary (gabungan unique tokens)
  const vocab = new Set([...tokensA, ...tokensB])

  // Hitung term frequency vectors
  const freqA = computeTermFrequency(tokensA, vocab)
  const freqB = computeTermFrequency(tokensB, vocab)

  // Konversi ke array dan hitung cosine similarity
  const vecA = Array.from(vocab).map((word) => freqA.get(word) || 0)
  const vecB = Array.from(vocab).map((word) => freqB.get(word) || 0)

  return cosineSimilarity(vecA, vecB)
}

// ------------------------------------------------------------------
// HELPER FUNCTIONS
// ------------------------------------------------------------------

/**
 * Tokenisasi teks: lowercase, split spasi, filter token kosong.
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ") // Hapus tanda baca
    .split(/\s+/)
    .filter((t) => t.length > 0)
}

/**
 * Menghitung term frequency untuk setiap token dalam vocabulary.
 */
function computeTermFrequency(
  tokens: string[],
  vocab: Set<string>
): Map<string, number> {
  const freq = new Map<string, number>()

  for (const token of tokens) {
    if (vocab.has(token)) {
      freq.set(token, (freq.get(token) || 0) + 1)
    }
  }

  return freq
}
