/**
 * ============================================================
 * SKENARIO TESTING: ANXIETY (KECEMASAN)
 * ============================================================
 *
 * Skenario ini menguji kemampuan chatbot dalam menangani
 * curhat tentang kecemasan — kondisi di mana user merasa
 * takut, khawatir, atau gelisah secara berlebihan.
 *
 * Karakteristik anxiety:
 * - Perasaan takut yang intens
 * - Gejala fisik (jantung berdebar, sesak napas)
 * - Khawatir tentang hal yang belum terjadi
 * - Sulit merasa tenang
 *
 * @author  Tim Skripsi
 * @version 1.0
 * ============================================================
 */

import { TestScenario } from "@/test/types"

/**
 * Skenario 1: Kecemasan umum
 * User merasa cemas tanpa pemicu yang jelas.
 */
export const anxietyGeneralScenario: TestScenario = {
  id: "anxiety_001",
  name: "Kecemasan Tanpa Sebab Jelas",
  category: "anxiety",

  userInput:
    "Aku merasa cemas banget akhir-akhir ini. Ga tau kenapa, tiba-tiba aja jantungku berdebar kenceng, susah napas, rasanya pengen nangis terus. Capek banget.",

  expectedRetrievedContext: [
    {
      chunkId: "test_anxiety_001",
      topic: "kecemasan umum",
      situation: "User merasa cemas tanpa pemicu yang jelas, ada gejala fisik",
      expectedRelevanceScore: 0.9,
      emotions: ["anxiety", "fear", "panic"],
      needs: ["calming", "safety", "reassurance"],
    },
  ],

  expectedEmotionalDirection: [
    "Validasi bahwa kecemasan itu nyata dan berat",
    "Ajakan untuk grounding / teknik pernapasan",
    "Berikan rasa aman",
    "Normalisasi gejala fisik kecemasan",
  ],

  expectedResponseCriteria: [
    "Mengandung validasi emosional yang kuat",
    "Menggunakan nada yang menenangkan (calming tone)",
    "Tidak meremehkan kecemasan user",
    "Tidak memberikan diagnosa medis",
    "Mengundang user untuk cerita lebih lanjut",
    "Ada ajakan untuk teknik grounding sederhana",
  ],

  requiredKeywords: [
    "napas",
    "tenang",
    "aman",
    "berat",
    "disini",
    "pelan",
    "paham",
  ],

  forbiddenKeywords: [
    "lebay",
    "berlebihan",
    "biasa aja",
    "tenang aja",
    "ga usah khawatir",
  ],

  severityLevel: 4,
}

/**
 * Skenario 2: Social anxiety
 * User cemas dalam situasi sosial.
 */
export const anxietySocialScenario: TestScenario = {
  id: "anxiety_002",
  name: "Kecemasan Sosial",
  category: "anxiety",

  userInput:
    "Aku takut banget kalo harus ketemu orang baru atau ngomong di depan umum. Rasanya pengen menghilang aja. Deg-degan, keringet dingin, takut dinilai orang.",

  expectedRetrievedContext: [
    {
      chunkId: "test_anxiety_002",
      topic: "social anxiety",
      situation:
        "User merasa takut dan cemas ketika harus berinteraksi sosial",
      expectedRelevanceScore: 0.95,
      emotions: ["anxiety", "fear", "insecure"],
      needs: ["encouragement", "acceptance", "safety"],
    },
  ],

  expectedEmotionalDirection: [
    "Normalize social anxiety",
    "Validasi perasaan takut",
    "Dorong secara perlahan tanpa paksaan",
    "Berikan penghargaan atas keberanian cerita",
  ],

  expectedResponseCriteria: [
    "Mengandung normalisasi (banyak orang juga ngerasain)",
    "Tidak memaksa user untuk 'berubah'",
    "Memberikan encouragement yang gentle",
    "Tidak meremehkan ketakutan user",
  ],

  requiredKeywords: [
    "paham",
    "wajar",
    "berani",
    "pelan",
    "sendiri",
    "ngerti",
  ],

  forbiddenKeywords: [
    "lebay",
    "cari perhatian",
    "diem aja",
    "biasain",
  ],

  severityLevel: 3,
}

/**
 * Skenario 3: Kecemasan akan kesehatan
 * User cemas berlebihan tentang kesehatannya (health anxiety).
 */
export const anxietyHealthScenario: TestScenario = {
  id: "anxiety_003",
  name: "Kecemasan tentang Kesehatan",
  category: "anxiety",

  userInput:
    "Aku selalu cemas sama kondisi kesehatanku. Tiap ada rasa sakit dikit, langsung takut ada penyakit serius. Udah sering periksa ke dokter dan hasilnya baik, tapi pikiran ku tetep ga tenang. Capek banget hidup dalam ketakutan terus.",

  expectedRetrievedContext: [
    {
      chunkId: "test_anxiety_001",
      topic: "kecemasan umum",
      situation:
        "User merasa cemas berlebihan tentang kesehatannya meskipun sudah mendapat kepastian medis",
      expectedRelevanceScore: 0.85,
      emotions: ["anxiety", "fear", "panic"],
      needs: ["calming", "reassurance", "safety"],
    },
  ],

  expectedEmotionalDirection: [
    "Validasi bahwa kecemasan kesehatan itu nyata dan berat",
    "Normalisasi bahwa pikiran cemas sering tidak rasional",
    "Bantu user melihat pola kecemasannya tanpa judgement",
    "Tawarkan grounding dan teknik menenangkan diri",
  ],

  expectedResponseCriteria: [
    "Mengandung validasi emosional yang kuat",
    "Tidak meremehkan kecemasan user",
    "Tidak memberikan saran medis atau diagnosa",
    "Menggunakan nada yang menenangkan",
  ],

  requiredKeywords: [
    "cemas",
    "berat",
    "paham",
    "tenang",
    "pikiran",
    "aman",
    "disini",
  ],

  forbiddenKeywords: [
    "lebay",
    "berlebihan",
    "biasa aja",
    "ga usah takut",
    "cari perhatian",
  ],

  severityLevel: 4,
}

/**
 * Skenario 4: Kecemasan akan kegagalan
 * User cemas berlebihan jika harus menghadapi ujian/tantangan.
 */
export const anxietyFailureScenario: TestScenario = {
  id: "anxiety_004",
  name: "Kecemasan Akan Kegagalan",
  category: "anxiety",

  userInput:
    "Bentar lagi UTS dan aku udah panik dari sekarang. Takut banget gagal, takut nilainya jelek. Padahal udah belajar, tapi setiap mau ujian pasti perut mulas, tangan dingin, rasanya pengen kabur aja. Bagaimana kalo aku lupa semua yang udah dipelajari?",

  expectedRetrievedContext: [
    {
      chunkId: "test_anxiety_001",
      topic: "kecemasan umum",
      situation:
        "User merasa cemas berlebihan menghadapi ujian, ada gejala fisik kecemasan",
      expectedRelevanceScore: 0.8,
      emotions: ["anxiety", "fear", "panic"],
      needs: ["calming", "reassurance", "safety"],
    },
    {
      chunkId: "test_stress_001",
      topic: "stress kuliah",
      situation:
        "User merasa tertekan dengan tekanan akademik dan takut gagal",
      expectedRelevanceScore: 0.7,
      emotions: ["stress", "overwhelmed", "anxious"],
      needs: ["validation", "perspective", "self-care"],
    },
  ],

  expectedEmotionalDirection: [
    "Validasi kecemasan menghadapi ujian sebagai hal wajar",
    "Normalisasi gejala fisik karena kecemasan",
    "Bantu fokus pada persiapan yang sudah dilakukan",
    "Tawarkan teknik grounding sebelum ujian",
  ],

  expectedResponseCriteria: [
    "Mengandung validasi emosional",
    "Tidak meremehkan kecemasan user",
    "Tidak memberi saran belajar yang menggurui",
    "Menggunakan nada yang menenangkan dan supportive",
  ],

  requiredKeywords: [
    "cemas",
    "wajar",
    "paham",
    "belajar",
    "usaha",
    "tenang",
    "berat",
  ],

  forbiddenKeywords: [
    "lebay",
    "belajar lebih",
    "harusnya",
    "biasa aja",
    "ga usah panik",
  ],

  severityLevel: 3,
}
