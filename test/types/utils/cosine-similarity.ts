

// COSINE SIMILARITY â€” Vektor Numerik

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
    throw new Error(`Vector dimension mismatch: a=${a.length}, b=${b.length}`);
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  // Hindari division by zero
  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}


export function textCosineSimilarity(textA: string, textB: string): number {
  // Tokenisasi dan lowercase
  const tokensA = tokenize(textA);
  const tokensB = tokenize(textB);

  if (tokensA.length === 0 || tokensB.length === 0) {
    return 0;
  }

  // Buat vocabulary (gabungan unique tokens)
  const vocab = new Set([...tokensA, ...tokensB]);

  // Hitung term frequency vectors
  const freqA = computeTermFrequency(tokensA, vocab);
  const freqB = computeTermFrequency(tokensB, vocab);

  // Konversi ke array dan hitung cosine similarity
  const vecA = Array.from(vocab).map((word) => freqA.get(word) || 0);
  const vecB = Array.from(vocab).map((word) => freqB.get(word) || 0);

  return cosineSimilarity(vecA, vecB);
}

// HELPER FUNCTIONS

/**
 * Tokenisasi teks: lowercase, split spasi, filter token kosong.
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ") // Hapus tanda baca
    .split(/\s+/)
    .filter((t) => t.length > 0);
}

/**
 * Menghitung term frequency untuk setiap token dalam vocabulary.
 */
function computeTermFrequency(
  tokens: string[],
  vocab: Set<string>,
): Map<string, number> {
  const freq = new Map<string, number>();

  for (const token of tokens) {
    if (vocab.has(token)) {
      freq.set(token, (freq.get(token) || 0) + 1);
    }
  }

  return freq;
}
