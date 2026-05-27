import { TestScenario } from "@test/types"

/** Skenario 1: Overthinking malam hari */
export const overthinkingScenario: TestScenario = {
  id: "overthinking_001",
  name: "Overthinking Malam Hari",
  category: "overthinking",

  userInput:
    "Setiap malam aku selalu overthinking. Pikiranku muter-muter terus, mikirin masa depan, mikirin kuliah, mikirin semuanya. Capek banget rasanya.",

  expectedRetrievedContext: [
    {
      chunkId: "emotion_0019",
      topic: "overthinking",
      situation:
        "User merasa pikirannya tidak bisa berhenti berputar-putar saat malam hari, memikirkan berbagai hal",
      expectedRelevanceScore: 0.85,
      emotions: ["overthinking", "mental_fatigue", "anxiety", "restlessness"],
      needs: ["mental rest", "reassurance", "grounding"],
    },
    {
      chunkId: "emotion_0005",
      topic: "self comparison",
      situation: "User terus-menerus menganalisis dan membandingkan diri dengan standar orang lain",
      expectedRelevanceScore: 0.7,
      emotions: ["insecure", "envy", "self_pressure"],
      needs: ["self acceptance", "reassurance"],
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

/** Skenario 2: Overthinking tentang perkataan orang lain */
export const overthinkingSocialScenario: TestScenario = {
  id: "overthinking_002",
  name: "Overthinking Sosial",
  category: "overthinking",

  userInput:
    "Aku selalu mikirin perkataan orang lain. Kayak tadi temenku ngomong gini, apa maksudnya ya? Apa dia lagi sebel sama aku? Aku jadi overthinking terus.",

  expectedRetrievedContext: [
    {
      chunkId: "emotion_0019",
      topic: "overthinking",
      situation:
        "User terus-menerus menganalisis perkataan dan tindakan orang lain, overthinking sosial",
      expectedRelevanceScore: 0.9,
      emotions: ["overthinking", "mental_fatigue", "anxiety", "restlessness"],
      needs: ["mental rest", "reassurance", "grounding"],
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

/** Skenario 3: Overthinking tentang masa depan */
export const overthinkingFutureScenario: TestScenario = {
  id: "overthinking_003",
  name: "Overthinking Masa Depan",
  category: "overthinking",

  userInput:
    "Aku sering banget mikirin masa depan sampe panik. Lulus mau ngapain? Bisa kerja ga? Jangan-jangan aku gagal dan ga berguna. Pikiran kayak gini dateng terus apalagi pas mau tidur, jadi susah tidur.",

  expectedRetrievedContext: [
    {
      chunkId: "emotion_0012",
      topic: "self identity",
      situation:
        "User merasa cemas dan overthinking tentang ketidakpastian masa depan, tidak tahu arah hidup",
      expectedRelevanceScore: 0.85,
      emotions: ["lost", "confused", "purposeless", "anxious"],
      needs: ["clarity", "self exploration", "non-judgmental space"],
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

/** Skenario 4: Overthinking karena membandingkan diri */
export const overthinkingComparisonScenario: TestScenario = {
  id: "overthinking_004",
  name: "Overthinking karena Membandingkan Diri",
  category: "overthinking",

  userInput:
    "Kenapa ya temen-temenku kayaknya pada sukses semua? Ada yang udah kerja, ada yang S2, ada yang nikah. Sedangkan aku masih disini, bingung dan ga tau arah. Aku ga mau iri, tapi rasanya aku tertinggal banget.",

  expectedRetrievedContext: [
    {
      chunkId: "emotion_0005",
      topic: "self comparison",
      situation:
        "User terus membandingkan pencapaian dirinya dengan orang lain, merasa tertinggal dan tidak cukup",
      expectedRelevanceScore: 0.8,
      emotions: ["insecure", "envy", "self_pressure"],
      needs: ["self acceptance", "reassurance"],
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
