import { TestScenario } from "@test/types"

/** Skenario 1: Kecemasan umum */
export const anxietyGeneralScenario: TestScenario = {
  id: "anxiety_001",
  name: "Kecemasan Tanpa Sebab Jelas",
  category: "anxiety",

  userInput:
    "Aku merasa cemas banget akhir-akhir ini. Ga tau kenapa, tiba-tiba aja jantungku berdebar kenceng, susah napas, rasanya pengen nangis terus. Capek banget.",

  expectedRetrievedContext: [
    {
      chunkId: "emotion_0010",
      topic: "academic",
      situation: "User merasa cemas tanpa pemicu yang jelas, ada gejala fisik dan tekanan",
      expectedRelevanceScore: 0.9,
      emotions: ["stress", "overwhelmed", "self_doubt", "fear_of_failure"],
      needs: ["validation", "emotional support", "clarity"],
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

/** Skenario 2: Social anxiety */
export const anxietySocialScenario: TestScenario = {
  id: "anxiety_002",
  name: "Kecemasan Sosial",
  category: "anxiety",

  userInput:
    "Aku takut banget kalo harus ketemu orang baru atau ngomong di depan umum. Rasanya pengen menghilang aja. Deg-degan, keringet dingin, takut dinilai orang.",

  expectedRetrievedContext: [
    {
      chunkId: "emotion_0001",
      topic: "romantic insecurity",
      situation:
        "User merasa takut dan cemas ketika harus berinteraksi sosial, merasa tidak pantas",
      expectedRelevanceScore: 0.95,
      emotions: ["insecure", "fear_of_rejection", "self_doubt"],
      needs: ["reassurance", "emotional safety"],
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

/** Skenario 3: Kecemasan akan kesehatan */
export const anxietyHealthScenario: TestScenario = {
  id: "anxiety_003",
  name: "Kecemasan tentang Kesehatan",
  category: "anxiety",

  userInput:
    "Aku selalu cemas sama kondisi kesehatanku. Tiap ada rasa sakit dikit, langsung takut ada penyakit serius. Udah sering periksa ke dokter dan hasilnya baik, tapi pikiran ku tetep ga tenang. Capek banget hidup dalam ketakutan terus.",

  expectedRetrievedContext: [
    {
      chunkId: "emotion_0014",
      topic: "loss",
      situation:
        "User merasa cemas berlebihan tentang kesehatannya, takut kehilangan sesuatu yang berharga",
      expectedRelevanceScore: 0.85,
      emotions: ["grief", "sadness", "guilt", "disbelief"],
      needs: ["presence", "validation", "space to grieve"],
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

/** Skenario 4: Kecemasan akan kegagalan */
export const anxietyFailureScenario: TestScenario = {
  id: "anxiety_004",
  name: "Kecemasan Akan Kegagalan",
  category: "anxiety",

  userInput:
    "Bentar lagi UTS dan aku udah panik dari sekarang. Takut banget gagal, takut nilainya jelek. Padahal udah belajar, tapi setiap mau ujian pasti perut mulas, tangan dingin, rasanya pengen kabur aja. Bagaimana kalo aku lupa semua yang udah dipelajari?",

  expectedRetrievedContext: [
    {
      chunkId: "emotion_0010",
      topic: "academic",
      situation:
        "User merasa cemas berlebihan menghadapi ujian, takut gagal dan mengecewakan",
      expectedRelevanceScore: 0.8,
      emotions: ["stress", "overwhelmed", "self_doubt", "fear_of_failure"],
      needs: ["validation", "emotional support", "clarity"],
    },
    {
      chunkId: "emotion_0003",
      topic: "mental health",
      situation:
        "User merasa tertekan dengan tekanan akademik dan kelelahan mental",
      expectedRelevanceScore: 0.7,
      emotions: ["burnout", "stress", "emotional_exhaustion"],
      needs: ["rest", "being understood"],
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
