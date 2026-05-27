/**
 * ============================================================
 * SKENARIO TESTING: KESEPIAN
 * ============================================================
 *
 * Skenario ini menguji kemampuan chatbot dalam menangani
 * curhat tentang kesepian — perasaan terisolasi meskipun
 * mungkin dikelilingi orang lain.
 *
 * Karakteristik kesepian:
 * - Merasa sendiri meskipun bersama orang lain
 * - Tidak ada koneksi yang bermakna
 * - Rindu untuk dimengerti
 * - Keinginan untuk terhubung secara emosional
 *
 * @author  Tim Skripsi
 * @version 1.0
 * ============================================================
 */

import { TestScenario } from "@/test/types"

/**
 * Skenario 1: Kesepian eksistensial
 * User merasa kesepian meskipun dikelilingi orang.
 */
export const lonelinessExistentialScenario: TestScenario = {
  id: "loneliness_001",
  name: "Kesepian di Tengah Keramaian",
  category: "loneliness",

  userInput:
    "Aku punya banyak temen, tapi kenapa aku masih merasa sendiri ya? Kayak ga ada yang beneran ngerti aku. Kalo malem tiba, rasanya sepi banget.",

  expectedRetrievedContext: [
    {
      chunkId: "test_loneliness_001",
      topic: "existential loneliness",
      situation:
        "User merasa kesepian meskipun dikelilingi orang lain",
      expectedRelevanceScore: 0.9,
      emotions: ["loneliness", "sadness", "isolated"],
      needs: ["connection", "understanding", "presence"],
    },
  ],

  expectedEmotionalDirection: [
    "Validasi perasaan kesepian yang mendalam",
    "Normalisasi bahwa kesepian bisa terjadi di keramaian",
    "Tawarkan kehadiran dan koneksi emosional",
    "Bantu user merasa dimengerti",
  ],

  expectedResponseCriteria: [
    "Mengandung validasi yang hangat",
    "Tidak meremehkan perasaan kesepian",
    "Tidak memberikan solusi 'cari temen baru' secara instan",
    "Menawarkan ruang aman untuk cerita",
    "Menggunakan nada yang companionable",
  ],

  requiredKeywords: [
    "sendiri",
    "paham",
    "disini",
    "cerita",
    "berat",
    "ngerti",
    "temenin",
  ],

  forbiddenKeywords: [
    "cari temen",
    "sibukin diri",
    "lupakan",
    "jangan mikir",
    "diem aja",
  ],

  severityLevel: 3,
}

/**
 * Skenario 2: Isolasi sosial
 * User kesulitan mencari koneksi yang bermakna.
 */
export const lonelinessIsolationScenario: TestScenario = {
  id: "loneliness_002",
  name: "Kesulitan Mencari Koneksi",
  category: "loneliness",

  userInput:
    "Aku susah banget cari temen yang beneran ngerti aku. Kayak semua orang punya circle masing-masing dan aku ga masuk ke circle manapun. Rasanya aku sendiri banget di dunia ini.",

  expectedRetrievedContext: [
    {
      chunkId: "test_loneliness_002",
      topic: "social isolation",
      situation:
        "User kesulitan mencari teman atau koneksi yang bermakna",
      expectedRelevanceScore: 0.9,
      emotions: ["loneliness", "sadness", "hopelessness"],
      needs: ["connection", "hope", "belonging"],
    },
  ],

  expectedEmotionalDirection: [
    "Validasi perasaan terisolasi",
    "Normalisasi kesulitan mencari koneksi",
    "Berikan harapan tanpa memberikan janji palsu",
    "Tawarkan penerimaan tanpa syarat",
  ],

  expectedResponseCriteria: [
    "Mengandung validasi emosional",
    "Tidak membandingkan dengan orang lain",
    "Tidak memberikan saran klise",
    "Memberikan rasa diterima dan dipahami",
    "Menggunakan nada yang hangat dan menerima",
  ],

  requiredKeywords: [
    "sendiri",
    "paham",
    "berat",
    "cerita",
    "tempat",
    "terima",
  ],

  forbiddenKeywords: [
    "coba join",
    "sibuk",
    "lupakan",
    "cari hobi",
    "udah biasa",
  ],

  severityLevel: 4,
}

/**
 * Skenario 3: Kesepian karena pindah kota
 * User merasa kesepian setelah pindah ke kota baru untuk kuliah.
 */
export const lonelinessNewCityScenario: TestScenario = {
  id: "loneliness_003",
  name: "Kesepian di Kota Baru",
  category: "loneliness",

  userInput:
    "Baru pindah ke kota lain buat kuliah. Jauh dari keluarga dan temen-temen lama. Sampe sekarang belum dapet temen yang bener-bener deket. Malem-malem sering nangis sendiri kangen rumah. Gimana ya caranya biar ga kesepian terus?",

  expectedRetrievedContext: [
    {
      chunkId: "test_loneliness_002",
      topic: "social isolation",
      situation:
        "User merasa kesepian setelah pindah ke lingkungan baru dan kesulitan mencari koneksi",
      expectedRelevanceScore: 0.85,
      emotions: ["loneliness", "sadness", "hopelessness"],
      needs: ["connection", "belonging", "support"],
    },
  ],

  expectedEmotionalDirection: [
    "Validasi perasaan kesepian di lingkungan baru",
    "Normalisasi bahwa butuh waktu untuk beradaptasi",
    "Tawarkan kehadiran dan dukungan emosional",
    "Dorong untuk membuka diri secara perlahan tanpa paksaan",
  ],

  expectedResponseCriteria: [
    "Mengandung validasi emosional yang hangat",
    "Tidak meremehkan perasaan kesepian",
    "Tidak memberikan saran 'sosialisasi yang banyak'",
    "Menggunakan nada yang companionable",
  ],

  requiredKeywords: [
    "sendiri",
    "berat",
    "paham",
    "wajar",
    "proses",
    "disini",
    "cerita",
  ],

  forbiddenKeywords: [
    "cari temen",
    "sibukin diri",
    "biasain",
    "lupakan",
    "ga usah mikir",
  ],

  severityLevel: 3,
}

/**
 * Skenario 4: Kesepian karena kehilangan teman
 * User kehilangan teman dekat dan merasa sendiri.
 */
export const lonelinessLostFriendScenario: TestScenario = {
  id: "loneliness_004",
  name: "Kesepian karena Kehilangan Teman",
  category: "loneliness",

  userInput:
    "Aku baru aja lost contact sama sahabatku dari SMA. Kita dulu deket banget, tapi sekarang masing-masing sibuk dan jarang komunikasi. Rasanya kehilangan banget, kayak ada yang hilang dalam hidupku. Susah cari temen yang senyaman dia.",

  expectedRetrievedContext: [
    {
      chunkId: "test_loneliness_001",
      topic: "existential loneliness",
      situation:
        "User merasa kehilangan setelah hubungan pertemanan yang dulu dekat mulai renggang",
      expectedRelevanceScore: 0.7,
      emotions: ["loneliness", "sadness", "nostalgia"],
      needs: ["connection", "understanding", "healing"],
    },
  ],

  expectedEmotionalDirection: [
    "Validasi rasa kehilangan akan hubungan yang dulu dekat",
    "Normalisasi bahwa pertemanan bisa berubah seiring waktu",
    "Bantu user menghargai kenangan tanpa terjebak di masa lalu",
    "Tawarkan harapan bahwa akan ada koneksi baru di masa depan",
  ],

  expectedResponseCriteria: [
    "Mengandung validasi yang hangat dan dalam",
    "Tidak meremehkan rasa kehilangan",
    "Tidak memberikan saran 'cari temen baru' yang tergesa-gesa",
    "Menggunakan nada yang penuh pengertian",
  ],

  requiredKeywords: [
    "berat",
    "paham",
    "sedih",
    "rasa",
    "wajar",
    "kenang",
    "cerita",
  ],

  forbiddenKeywords: [
    "cari temen baru",
    "lupakan",
    "udah biasa",
    "sibuk",
    "ga usah",
  ],

  severityLevel: 3,
}
