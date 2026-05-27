/**
 * ============================================================
 * KEYWORD MATCHING — PENCOCOKAN KATA KUNCI SEMANTIK
 * ============================================================
 *
 * Keyword matching adalah pendekatan sederhana untuk mengukur
 * apakah suatu teks mengandung kata kunci yang diharapkan.
 *
 * Modul ini menyediakan:
 * 1. Exact keyword matching — cocok kata persis
 * 2. Partial keyword matching — cocok sebagian kata
 * 3. Semantic keyword groups — cocok berdasarkan kelompok makna
 *
 * PENGGUNAAN UNTUK SKRIPSI:
 *   Digunakan untuk memvalidasi bahwa respons chatbot:
 *   - Mengandung kata kunci emosional yang sesuai
 *   - Tidak mengandung kata terlarang (misal: kalimat judgemental)
 *   - Menggunakan kosakata yang sesuai konteks curhat
 *
 * @author  Tim Skripsi
 * @version 1.0
 * ============================================================
 */

// SEMANTIC KEYWORD GROUPS

/**
 * Grup kata kunci semantik untuk setiap konteks emosional.
 *
 * Setiap grup berisi sinonim atau kata terkait yang memiliki
 * makna serupa. Ini adalah pendekatan sederhana untuk menangkap
 * variasi bahasa tanpa NLP yang kompleks.
 */
export const EMOTIONAL_KEYWORD_GROUPS: Record<string, string[]> = {
  // Validasi dan empati
  validation: [
    "valid",
    "paham",
    "mengerti",
    "wajar",
    "normal",
    "natural",
    "boleh",
    "tidak apa",
    "gapapa",
    "maklum",
    "dimengerti",
  ],

  // Dukungan
  support: [
    "dukung",
    "support",
    "bantu",
    "temani",
    "bersama",
    "ada untuk",
    "siap",
    "bisa andalkan",
    "peduli",
    "supportif",
  ],

  // Eksplorasi perasaan
  exploration: [
    "cerita",
    "ceritakan",
    "rasakan",
    "perasaan",
    "bagaimana perasaan",
    "apa yang kamu rasa",
    "lebih lanjut",
    "cerita lebih",
    "pikirkan tentang",
  ],

  // Kecemasan
  anxiety: [
    "cemas",
    "cemas",
    "khawatir",
    "takut",
    "gelisah",
    "tidak tenang",
    "deg-degan",
    "was-was",
    "panik",
    "overthinking",
    "pikiran",
  ],

  // Kesedihan
  sadness: [
    "sedih",
    "murung",
    "sendiri",
    "kesepian",
    "sepi",
    "sunyi",
    "menangis",
    "hampa",
    "kosong",
    "terpuruk",
  ],

  // Motivasi
  motivation: [
    "semangat",
    "motivasi",
    "mampu",
    "kuat",
    "bangkit",
    "pulih",
    "berusaha",
    "coba lagi",
    "percaya",
    "yakin",
  ],

  // Harapan
  hope: [
    "harap",
    "masih ada",
    "lebih baik",
    "berubah",
    "membaik",
    "peluang",
    "kesempatan",
    "masa depan",
    "optimis",
    "positif",
  ],

  // Judgemental (terlarang)
  judgemental: [
    "lebay",
    "berlebihan",
    "dramatis",
    "cari perhatian",
    "males",
    "malas",
    "lemah",
    "cengeng",
    "sensitif banget",
    "baper",
  ],

  // Menghakimi
  dismissive: [
    "sudahlah",
    "lupakan",
    "jangan pikirin",
    "udah biasa",
    "bukan masalah",
    "masalah kecil",
    "gausah",
    "bodo amat",
    "cuek",
    "diem aja",
  ],
};

// KEYWORD SCORING

/**
 * Menghitung skor keyword match antara teks dan grup kata kunci.
 *
 * @param text - Teks yang akan diperiksa
 * @param keywordGroup - Nama grup kata kunci (lihat EMOTIONAL_KEYWORD_GROUPS)
 * @returns Skor 0.0 - 1.0 (proporsi keyword group yang muncul)
 */
export function keywordGroupScore(text: string, keywordGroup: string): number {
  const keywords = EMOTIONAL_KEYWORD_GROUPS[keywordGroup];
  if (!keywords) return 0;

  const textLower = text.toLowerCase();
  const matchedCount = keywords.filter((keyword) =>
    textLower.includes(keyword),
  ).length;

  return matchedCount / keywords.length;
}

/**
 * Menghitung skor keyword match dengan grup kata kunci yang
 * diharapkan muncul. Kata kunci yang bersifat umum mendapat
 * bobot lebih rendah.
 *
 * @param text - Teks yang diperiksa
 * @param expectedKeywords - Daftar kata kunci yang diharapkan
 * @returns Skor 0.0 - 1.0 (semakin banyak yang cocok, semakin tinggi)
 */
export function requiredKeywordScore(
  text: string,
  expectedKeywords: string[],
): number {
  if (expectedKeywords.length === 0) return 1.0; // Tidak ada requirement

  const textLower = text.toLowerCase();
  const matched = expectedKeywords.filter((kw) => textLower.includes(kw));

  return matched.length / expectedKeywords.length;
}

/**
 * Memeriksa apakah teks mengandung kata kunci terlarang.
 *
 * @param text - Teks yang diperiksa
 * @param forbiddenKeywords - Kata kunci yang tidak boleh ada
 * @returns true jika ada kata terlarang
 */
export function hasForbiddenKeywords(
  text: string,
  forbiddenKeywords: string[],
): boolean {
  const textLower = text.toLowerCase();
  return forbiddenKeywords.some((kw) => textLower.includes(kw));
}

/**
 * Menghitung skor akhir keyword matching berdasarkan:
 * - Kehadiran kata kunci yang diharapkan
 * - Ketidakhadiran kata kunci terlarang
 *
 * @param text - Teks respons chatbot
 * @param required - Kata kunci yang harus ada
 * @param forbidden - Kata kunci yang tidak boleh ada
 * @returns Skor akhir (0-100)
 */
export function keywordMatchingScore(
  text: string,
  required: string[],
  forbidden: string[],
): { score: number; details: { matched: string[]; violated: string[] } } {
  const textLower = text.toLowerCase();

  // Cari kata kunci yang harus ada
  const matched = required.filter((kw) => textLower.includes(kw));

  // Cari kata kunci yang tidak boleh ada
  const violated = forbidden.filter((kw) => textLower.includes(kw));

  // Skor: proporsi kata kunci yang terpenuhi dikurangi penalti
  const requiredScore =
    required.length > 0 ? matched.length / required.length : 1.0;

  // Penalti untuk kata terlarang
  const penalty = violated.length * 0.2; // Setiap pelanggaran -20%
  const finalScore = Math.max(
    0,
    Math.min(100, requiredScore * 100 * (1 - penalty)),
  );

  return {
    score: Math.round(finalScore),
    details: {
      matched,
      violated,
    },
  };
}
