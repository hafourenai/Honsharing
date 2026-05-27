/**
 * ============================================================
 * SKENARIO TESTING: OVERTHINKING
 * ============================================================
 *
 * Skenario ini menguji kemampuan chatbot dalam menangani
 * curhat tentang overthinking — kondisi di mana user
 * terus-menerus memikirkan hal yang sama secara berlebihan.
 *
 * Karakteristik overthinking:
 * - Pikiran berputar-putar tanpa solusi
 * - Biasanya terjadi saat malam hari / sendiri
 * - Fokus pada hal negatif atau kemungkinan buruk
 * - Sulit mengontrol pikiran sendiri
 *
 * @author  Tim Skripsi
 * @version 1.0
 * ============================================================
 */

import { TestScenario } from "@/test/types"

/**
 * Skenario 1: Overthinking malam hari
 * User merasa pikirannya tidak bisa berhenti di malam hari.
 */
export const overthinkingScenario: TestScenario = {
  id: "overthinking_001",
  name: "Overthinking Malam Hari",
  category: "overthinking",

  userInput:
    "Setiap malam aku selalu overthinking. Pikiranku muter-muter terus, mikirin masa depan, mikirin kuliah, mikirin semuanya. Capek banget rasanya.",

  expectedRetrievedContext: [
    {
      chunkId: "test_overthinking_001",
      topic: "overthinking malam hari",
      situation:
        "User merasa pikirannya tidak bisa berhenti berputar-putar saat malam hari",
      expectedRelevanceScore: 0.85,
      emotions: ["overthinking", "cemas", "lelah mental"],
      needs: ["validation", "grounding", "ketenangan"],
    },
    {
      chunkId: "test_overthinking_002",
      topic: "analisis berlebihan",
      situation: "User terus-menerus menganalisis berbagai hal secara berlebihan",
      expectedRelevanceScore: 0.7,
      emotions: ["overthinking", "insecure", "self_doubt"],
      needs: ["perspective", "reassurance", "kejelasan"],
    },
  ],

  expectedEmotionalDirection: [
    "Validasi bahwa overthinking itu wajar",
    "Normalisasi perasaan capek karena overthinking",
    "Ajakan untuk fokus pada hal yang bisa dikontrol",
    "Berikan rasa aman dan ketenangan",
  ],

  expectedResponseCriteria: [
    "Mengandung validasi emosional (wajar, normal, maklum)",
    "Tidak menyalahkan user karena overthinking",
    "Tidak memberikan solusi instan yang dangkal",
    "Menggunakan nada bicara yang hangat dan menenangkan",
    "Mengundang user untuk cerita lebih lanjut",
  ],

  requiredKeywords: [
    "wajar",
    "capek",
    "pikiran",
    "disini",
    "cerita",
    "paham",
    "sendiri",
  ],

  forbiddenKeywords: [
    "lebay",
    "berlebihan",
    "lupakan",
    "jangan pikirin",
    "diem aja",
  ],

  severityLevel: 3,
}

/**
 * Skenario 2: Overthinking tentang perkataan orang lain
 * User terus menganalisis perkataan orang lain.
 */
export const overthinkingSocialScenario: TestScenario = {
  id: "overthinking_002",
  name: "Overthinking Sosial",
  category: "overthinking",

  userInput:
    "Aku selalu mikirin perkataan orang lain. Kayak tadi temenku ngomong gini, apa maksudnya ya? Apa dia lagi sebel sama aku? Aku jadi overthinking terus.",

  expectedRetrievedContext: [
    {
      chunkId: "test_overthinking_002",
      topic: "analisis berlebihan",
      situation:
        "User terus-menerus menganalisis perkataan dan tindakan orang lain",
      expectedRelevanceScore: 0.9,
      emotions: ["overthinking", "insecure", "self_doubt"],
      needs: ["perspective", "reassurance", "kejelasan"],
    },
  ],

  expectedEmotionalDirection: [
    "Validasi bahwa overthinking sosial itu wajar",
    "Bantu bedakan fakta dan asumsi",
    "Normalize the experience",
    "Ajarkan self-compassion",
  ],

  expectedResponseCriteria: [
    "Mengandung validasi emosional",
    "Membantu perspektif tanpa judgement",
    "Tidak memperkuat kecemasan sosial",
    "Menggunakan nada yang gentle dan supportive",
  ],

  requiredKeywords: [
    "paham",
    "wajar",
    "pikiran",
    "asumsi",
    "cerita",
  ],

  forbiddenKeywords: [
    "lebay",
    "sensitiv",
    "baper",
    "cari perhatian",
  ],

  severityLevel: 2,
}

/**
 * Skenario 3: Overthinking tentang masa depan
 * User cemas dan overthinking tentang ketidakpastian masa depan.
 */
export const overthinkingFutureScenario: TestScenario = {
  id: "overthinking_003",
  name: "Overthinking Masa Depan",
  category: "overthinking",

  userInput:
    "Aku sering banget mikirin masa depan sampe panik. Lulus mau ngapain? Bisa kerja ga? Jangan-jangan aku gagal dan ga berguna. Pikiran kayak gini dateng terus apalagi pas mau tidur, jadi susah tidur.",

  expectedRetrievedContext: [
    {
      chunkId: "test_overthinking_001",
      topic: "overthinking malam hari",
      situation:
        "User merasa cemas dan overthinking tentang ketidakpastian masa depan",
      expectedRelevanceScore: 0.85,
      emotions: ["overthinking", "cemas", "lelah mental"],
      needs: ["validation", "grounding", "ketenangan"],
    },
  ],

  expectedEmotionalDirection: [
    "Validasi bahwa ketidakpastian masa depan bikin cemas",
    "Normalisasi perasaan takut gagal",
    "Bantu fokus ke langkah kecil yang bisa dikontrol",
    "Berikan grounding untuk mengurangi panik",
  ],

  expectedResponseCriteria: [
    "Mengandung validasi emosional",
    "Tidak meremehkan kekhawatiran user",
    "Tidak memberikan solusi karir yang menggurui",
    "Menggunakan nada yang menenangkan",
  ],

  requiredKeywords: [
    "wajar",
    "paham",
    "cemas",
    "pelan",
    "kontrol",
    "disini",
    "sendiri",
  ],

  forbiddenKeywords: [
    "lebay",
    "berlebihan",
    "lupakan",
    "jangan pikirin",
    "tenang aja",
  ],

  severityLevel: 3,
}

/**
 * Skenario 4: Overthinking karena membandingkan diri
 * User terus membandingkan dirinya dengan pencapaian orang lain.
 */
export const overthinkingComparisonScenario: TestScenario = {
  id: "overthinking_004",
  name: "Overthinking karena Membandingkan Diri",
  category: "overthinking",

  userInput:
    "Kenapa ya temen-temenku kayaknya pada sukses semua? Ada yang udah kerja, ada yang S2, ada yang nikah. Sedangkan aku masih disini, bingung dan ga tau arah. Aku ga mau iri, tapi rasanya aku tertinggal banget.",

  expectedRetrievedContext: [
    {
      chunkId: "test_overthinking_002",
      topic: "analisis berlebihan",
      situation:
        "User terus membandingkan pencapaian dirinya dengan orang lain secara berlebihan",
      expectedRelevanceScore: 0.8,
      emotions: ["overthinking", "insecure", "self_doubt"],
      needs: ["perspective", "reassurance", "validation"],
    },
  ],

  expectedEmotionalDirection: [
    "Validasi perasaan tertinggal tanpa memperkuatnya",
    "Normalisasi bahwa setiap orang punya jalannya masing-masing",
    "Bantu lihat bahwa perbandingan itu tidak adil karena konteks berbeda",
    "Tawarkan perspektif bahwa proses setiap orang berbeda",
  ],

  expectedResponseCriteria: [
    "Mengandung validasi emosional yang hangat",
    "Tidak membandingkan user dengan orang lain",
    "Tidak memberikan saran 'syukur aja' yang superficial",
    "Menggunakan nada yang gentle dan supportive",
  ],

  requiredKeywords: [
    "paham",
    "wajar",
    "berat",
    "proses",
    "banding",
    "jalan",
    "cerita",
  ],

  forbiddenKeywords: [
    "syukur",
    "lebi",
    "harusnya",
    "cengeng",
    "iri",
  ],

  severityLevel: 3,
}
