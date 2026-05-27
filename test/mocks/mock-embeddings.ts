import { TEST_CONFIG } from "@test/config/test-config";

// VOCABULARY EMOSIONAL INDONESIA

/**
 * Vocabulary kata kunci emosional untuk membangun vektor embedding.
 * Dipilih kata-kata yang relevan dengan domain chatbot curhat.
 */
const EMOTIONAL_VOCABULARY: string[] = [
  // Kecemasan & Ketakutan
  "cemas", "takut", "khawatir", "panik", "gelisah", "degdegan", "waswas",
  // Kesedihan & Kehilangan
  "sedih", "menangis", "nangis", "hampa", "kosong", "kesepian", "sepi", "sunyi",
  // Kelelahan Mental
  "capek", "lelah", "stress", "tekanan", "beban", "kelelahan",
  // Overthinking & Pikiran
  "overthinking", "pikiran", "pusing", "bingung", "muter",
  // Semangat & Harapan
  "semangat", "motivasi", "harapan", "percaya", "yakin", "optimis",
  // Kekuatan Diri
  "berani", "kuat", "hebat", "berharga", "pantas", "berguna", "berarti",
  // Hubungan & Kasih Sayang
  "sayang", "cinta", "teman", "sahabat", "keluarga", "pasangan", "pacaran", "hubungan",
  // Akademik & Pekerjaan
  "tugas", "kuliah", "sekolah", "belajar", "ujian", "nilai", "akademik",
  // Masa Depan
  "masa depan", "kerja", "lulus", "gagal", "sukses", "karir", "tujuan",
  // Empati & Validasi
  "cerita", "dengar", "paham", "ngerti", "mengerti", "validasi",
  // Kehadiran & Dukungan
  "disini", "bersama", "temani", "dukung", "support",
  // Validasi Emosi
  "wajar", "normal", "gapapa", "maklum", "manusiawi",
  // Ketenangan
  "pelan", "tenang", "santai", "bertahap",
  // Perasaan Berat
  "berat", "sulit", "susah", "sakit", "pedih",
  // Waktu & Istirahat
  "malam", "tidur", "istirahat", "rehat",
  // Sosial & Lingkungan
  "orang", "lingkungan", "sendiri", "sendirian",
  // Konflik & Masalah
  "konflik", "masalah", "salah", "salahpaham",
  // Perjalanan & Proses
  "proses", "jalan", "langkah", "waktu",
  // Diri & Identitas
  "diri", "percaya diri", "identitas",
  // Perbandingan Sosial
  "banding", "iri", "cemburu", "tertinggal",
  // Penolakan & Ketidakpantasan
  "takut", "ditolak", "ditinggal", "ditinggalkan",
  // Ekspektasi & Tekanan
  "ekspektasi", "target", "tuntutan", "harus",
  // Keluarga
  "orang tua", "ibu", "ayah", "rumah",
  // Emosi Campuran
  "campur aduk", "ambivalen", "bingung",
];

/**
 * Membersihkan dan menormalisasi teks untuk pencocokan vocabulary.
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// MOCK EMBEDDING GENERATOR

/**
 * Menghasilkan vektor embedding berdasarkan frekuensi kata
 * dalam vocabulary emosional.
 *
 * Cara kerja:
 * 1. Hitung jumlah kemunculan setiap kata vocabulary dalam teks
 * 2. Normalisasi menjadi unit vector (panjang = 1)
 * 3. Teks dengan topik serupa â†’ vektor serupa â†’ cosine similarity tinggi
 *
 * @param text - Teks yang akan di-embed
 * @returns Vektor embedding dengan dimensi = |vocabulary|
 */
export function generateMockEmbedding(text: string): number[] {
  const normalized = normalizeText(text);

  // Hitung frekuensi per kata dalam vocabulary
  const frequencies: number[] = [];
  for (const word of EMOTIONAL_VOCABULARY) {
    // Gunakan pencarian substring untuk fleksibilitas
    // Contoh: "pikiran" cocok dengan "pikiranku", "pikiranmu"
    const regex = new RegExp(word.replace(/\s+/g, "\\s+"), "gi");
    const matches = normalized.match(regex);
    frequencies.push(matches ? matches.length : 0);
  }

  // Normalisasi vektor (panjang = 1)
  const magnitude = Math.sqrt(
    frequencies.reduce((sum, val) => sum + val * val, 0),
  );

  if (magnitude === 0) {
    // Fallback: teks tanpa kata vocabulary â†’ vektor nol
    return new Array(EMOTIONAL_VOCABULARY.length).fill(0);
  }

  return frequencies.map((val) => val / magnitude);
}

// CACHE

/**
 * Cache embedding untuk teks yang sudah pernah diproses.
 * Memastikan teks yang sama selalu menghasilkan embedding identik.
 */
const embeddingCache = new Map<string, number[]>();

/**
 * Mendapatkan mock embedding dengan cache.
 *
 * @param text - Teks yang akan di-embed
 * @returns Vektor embedding
 */
export function getMockEmbedding(text: string): number[] {
  if (embeddingCache.has(text)) {
    return embeddingCache.get(text)!;
  }

  const embedding = generateMockEmbedding(text);
  embeddingCache.set(text, embedding);
  return embedding;
}

/**
 * Membersihkan cache embedding.
 * Berguna saat ingin memulai ulang testing.
 */
export function clearEmbeddingCache(): void {
  embeddingCache.clear();
}

// PRE-COMPUTED EMBEDDINGS UNTUK SKENARIO UMUM

/**
 * Pre-computed embeddings untuk query umum.
 */
export const SCENARIO_EMBEDDINGS: Record<string, number[]> = {
  overthinking: generateMockEmbedding(
    "pikiran saya tidak bisa berhenti, terus overthinking setiap malam",
  ),
  anxiety: generateMockEmbedding(
    "saya merasa cemas dan takut tanpa alasan yang jelas",
  ),
  relationship: generateMockEmbedding(
    "saya merasa tidak pantas untuk pasangan saya",
  ),
  loneliness: generateMockEmbedding(
    "saya merasa kesepian meskipun dikelilingi banyak orang",
  ),
  motivation: generateMockEmbedding(
    "saya kehilangan semangat untuk melakukan apapun",
  ),
  stress: generateMockEmbedding(
    "tugas kuliah menumpuk, saya merasa stress dan overwhelmed",
  ),
};

// SIMULASI ERROR

/**
 * Mock untuk fungsi embedText asli.
 *
 * @param text - Teks yang akan di-embed
 * @returns Promise vektor embedding
 * @throws Error jika simulasi error diaktifkan
 */
export async function mockEmbedText(text: string): Promise<number[]> {
  const config = TEST_CONFIG.mockEmbedding;

  // Simulasi error berdasarkan errorRate
  if (config.simulateError && Math.random() < config.errorRate) {
    throw new Error("[MOCK] Simulated embedding error");
  }

  return getMockEmbedding(text);
}
