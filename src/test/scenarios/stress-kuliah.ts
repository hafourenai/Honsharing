/**
 * ============================================================
 * SKENARIO TESTING: STRESS KULIAH
 * ============================================================
 *
 * Skenario ini menguji kemampuan chatbot dalam menangani
 * curhat tentang stress akademik — tekanan yang dialami
 * mahasiswa dalam menjalani perkuliahan.
 *
 * Karakteristik stress kuliah:
 * - Tugas menumpuk dan deadline ketat
 * - Tekanan untuk mendapat nilai baik
 * - Burnout akademik
 * - Perasaan tidak mampu / imposter syndrome
 *
 * @author  Tim Skripsi
 * @version 1.0
 * ============================================================
 */

import { TestScenario } from "@/test/types"

/**
 * Skenario 1: Stress tugas menumpuk
 * User merasa overwhelmed dengan tugas kuliah.
 */
export const stressAcademicScenario: TestScenario = {
  id: "stress_001",
  name: "Tugas Kuliah Menumpuk",
  category: "stress",

  userInput:
    "Tugas kuliahku numpuk banget. Ada 3 paper, 2 presentasi, dan UTS minggu depan. Aku stress banget, rasanya mau nangis terus. Kayak ga sanggup handle semuanya.",

  expectedRetrievedContext: [
    {
      chunkId: "test_stress_001",
      topic: "stress kuliah",
      situation:
        "User merasa overwhelmed dengan tugas kuliah yang menumpuk",
      expectedRelevanceScore: 0.9,
      emotions: ["stress", "overwhelmed", "anxious", "inadequate"],
      needs: ["validation", "perspective", "self-care"],
    },
  ],

  expectedEmotionalDirection: [
    "Validasi tekanan akademik yang dialami",
    "Normalisasi perasaan overwhelmed",
    "Bantu break down masalah tanpa menggurui",
    "Ingatkan pentingnya self-care",
  ],

  expectedResponseCriteria: [
    "Mengandung validasi emosional yang kuat",
    "Tidak meremehkan stress akademik",
    "Tidak memberikan solusi akademik yang menggurui",
    "Mengakui usaha yang sudah dilakukan user",
    "Menggunakan nada yang supportive dan hangat",
  ],

  requiredKeywords: [
    "berat",
    "paham",
    "usaha",
    "istirahat",
    "sendiri",
    "pelan",
    "capek",
  ],

  forbiddenKeywords: [
    "males",
    "harusnya",
    "kamu ga usaha",
    "cuma tugas",
    "biasa aja",
  ],

  severityLevel: 4,
}

/**
 * Skenario 2: Burnout akademik
 * User merasa kelelahan secara mental dan fisik karena kuliah.
 */
export const stressBurnoutScenario: TestScenario = {
  id: "stress_002",
  name: "Burnout Akademik",
  category: "stress",

  userInput:
    "Capek banget. Setiap hari kuliah, tugas, organisasi. Ga pernah punya waktu buat diri sendiri. Badan capek, pikiran capek, tapi harus tetep jalan. Aku capek banget.",

  expectedRetrievedContext: [
    {
      chunkId: "test_stress_002",
      topic: "burnout akademik",
      situation:
        "User merasa kelelahan secara mental dan fisik karena tuntutan kuliah",
      expectedRelevanceScore: 0.9,
      emotions: ["burnout", "exhausted", "overwhelmed", "frustrated"],
      needs: ["rest", "validation", "balance"],
    },
  ],

  expectedEmotionalDirection: [
    "Validasi kelelahan yang dirasakan",
    "Normalisasi kebutuhan untuk istirahat",
    "Berikan izin untuk berhenti sejenak",
    "Ingatkan bahwa user bukan mesin",
  ],

  expectedResponseCriteria: [
    "Mengandung validasi emosional yang hangat",
    "Tidak menyuruh 'semangat' secara superficial",
    "Tidak menyalahkan user karena terlalu sibuk",
    "Mengakui validitas burnout sebagai kondisi nyata",
    "Menggunakan nada yang gentle dan caring",
  ],

  requiredKeywords: [
    "istirahat",
    "manusia",
    "mesin",
    "capek",
    "paham",
    "jaga",
    "diri",
  ],

  forbiddenKeywords: [
    "semangat",
    "cuma",
    "mager",
    "harus jalan",
    "biasa aja",
    "gausah",
  ],

  severityLevel: 4,
}

/**
 * Skenario 3: Prokrastinasi karena stress
 * User menunda-nunda tugas karena stress berlebihan.
 */
export const stressProcrastinationScenario: TestScenario = {
  id: "stress_003",
  name: "Prokrastinasi karena Stress Kuliah",
  category: "stress",

  userInput:
    "Aku punya banyak tugas tapi ga bisa mulai. Udah duduk depan laptop berjam-jam, tapi mentok ga nulis apa-apa. Semakin ditunda, semakin panik. Tapi makin panik, makin susah mulai. Ini kayak lingkaran setan. Aku takut nilainya jelek.",

  expectedRetrievedContext: [
    {
      chunkId: "test_stress_001",
      topic: "stress kuliah",
      situation:
        "User mengalami prokrastinasi karena stress dan tekanan akademik yang berlebihan",
      expectedRelevanceScore: 0.85,
      emotions: ["stress", "overwhelmed", "anxious", "inadequate"],
      needs: ["validation", "perspective", "self-care"],
    },
  ],

  expectedEmotionalDirection: [
    "Validasi bahwa prokrastinasi seringkali akibat stress, bukan malas",
    "Normalisasi kesulitan memulai tugas ketika tertekan",
    "Bantu user melihat bahwa memulai dari hal kecil itu sudah cukup",
    "Tawarkan dukungan tanpa judgement",
  ],

  expectedResponseCriteria: [
    "Mengandung validasi emosional",
    "Tidak menyalahkan user karena 'prokrastinasi'",
    "Tidak memberi saran manajemen waktu yang menggurui",
    "Menggunakan nada yang mendukung dan hangat",
  ],

  requiredKeywords: [
    "berat",
    "paham",
    "pelan",
    "mulai",
    "wajar",
    "tekanan",
    "istirahat",
  ],

  forbiddenKeywords: [
    "males",
    "harusnya",
    "cuma tugas",
    "disiplin",
    "gausah",
  ],

  severityLevel: 3,
}

