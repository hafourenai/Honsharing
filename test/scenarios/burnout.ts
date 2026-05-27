import { TestScenario } from "@test/types"

/** Skenario 1: Burnout rutinitas */
export const burnoutGeneralScenario: TestScenario = {
  id: "burnout_001",
  name: "Burnout Rutinitas",
  category: "burnout",

  userInput:
    "Setiap hari rasanya sama aja. Bangun, kuliah, tugas, tidur, ulang lagi. Ga ada yang bikin semangat. Aku capek banget, bukan capek fisik, tapi capek yang dalem banget. Rasanya pengen istirahat lama tapi ga bisa.",

  expectedRetrievedContext: [
    {
      chunkId: "emotion_0003",
      topic: "mental health",
      situation:
        "User merasa kelelahan secara mental karena rutinitas monoton dan tekanan terus-menerus",
      expectedRelevanceScore: 0.85,
      emotions: ["burnout", "stress", "emotional_exhaustion"],
      needs: ["rest", "being understood"],
    },
  ],

  expectedEmotionalDirection: [
    "Validasi kelelahan yang dirasakan user",
    "Normalisasi perasaan jenuh dengan rutinitas",
    "Berikan izin untuk istirahat tanpa rasa bersalah",
    "Tawarkan perspektif bahwa perasaan ini bisa berubah",
  ],

  expectedResponseCriteria: [
    "Mengandung validasi emosional yang dalam",
    "Tidak menyuruh 'semangat' secara superficial",
    "Tidak meremehkan kelelahan mental user",
    "Menggunakan nada yang gentle dan caring",
    "Tidak membandingkan dengan orang lain",
  ],

  requiredKeywords: [
    "capek",
    "paham",
    "istirahat",
    "manusia",
    "berat",
    "pelan",
    "proses",
  ],

  forbiddenKeywords: [
    "semangat dong",
    "mager",
    "cuma",
    "harusnya",
    "biasain",
  ],

  severityLevel: 4,
}

/** Skenario 2: Burnout organisasi */
export const burnoutOrganizationScenario: TestScenario = {
  id: "burnout_002",
  name: "Burnout Organisasi dan Akademik",
  category: "burnout",

  userInput:
    "Aku aktif di 3 organisasi dan ambil banyak SKS. Awalnya semangat, tapi sekarang raseng pengen mundur semuanya. Tiap malem nangis kelelahan, tapi kalo mundur, takut ngecewain orang. Aku bener-bener ga tau harus gimana.",

  expectedRetrievedContext: [
    {
      chunkId: "emotion_0003",
      topic: "mental health",
      situation:
        "User merasa kelelahan karena terlalu banyak kegiatan tanpa waktu istirahat",
      expectedRelevanceScore: 0.9,
      emotions: ["burnout", "stress", "emotional_exhaustion"],
      needs: ["rest", "being understood"],
    },
  ],

  expectedEmotionalDirection: [
    "Validasi kelelahan fisik dan mental yang ekstrem",
    "Normalisasi keinginan untuk mundur dari tanggung jawab",
    "Tegaskan bahwa kesehatan mental lebih penting dari ekspektasi orang lain",
    "Dukung user untuk memprioritaskan diri sendiri",
  ],

  expectedResponseCriteria: [
    "Mengandung validasi yang hangat dan mendalam",
    "Tidak menyalahkan user karena 'ambil kebanyakan'",
    "Tidak menyuruh 'bertahan' atau 'mundur' secara ekstrem",
    "Menggunakan nada yang gentle dan penuh perhatian",
  ],

  requiredKeywords: [
    "capek",
    "berat",
    "paham",
    "istirahat",
    "diri",
    "wajar",
    "pelan",
  ],

  forbiddenKeywords: [
    "harusnya",
    "males",
    "resiko",
    "cengeng",
    "semangat",
  ],

  severityLevel: 5,
}

/** Skenario 3: Burnout karena overworking */
export const burnoutOverworkScenario: TestScenario = {
  id: "burnout_003",
  name: "Burnout karena Overworking",
  category: "burnout",

  userInput:
    "Aku tipe orang yang ga bisa diem. Kalo ga ngapa-ngapain, rasanya bersalah. Tapi sekarang badanku udah kasih sinyal, sering sakit, susah tidur, dan mood ancur. Aku tau harus istirahat, tapi pikiran ku bilang 'kamu ga boleh lemah'. Capek banget konflik sama diri sendiri.",

  expectedRetrievedContext: [
    {
      chunkId: "emotion_0003",
      topic: "mental health",
      situation:
        "User memaksakan diri terus bekerja meskipun sudah menunjukkan gejala fisik burnout",
      expectedRelevanceScore: 0.85,
      emotions: ["burnout", "stress", "emotional_exhaustion"],
      needs: ["rest", "being understood"],
    },
  ],

  expectedEmotionalDirection: [
    "Validasi konflik internal antara 'harus produktif' dan 'butuh istirahat'",
    "Normalisasi kebutuhan istirahat sebagai hal manusiawi",
    "Bantu user melihat bahwa istirahat adalah bentuk self-care, bukan kelemahan",
    "Tawarkan dukungan tanpa judgement",
  ],

  expectedResponseCriteria: [
    "Mengandung validasi yang hangat dan dalam",
    "Tidak menyalahkan user karena 'kerja terlalu keras'",
    "Tidak memberikan saran produktivitas",
    "Menggunakan nada yang gentle dan menerima",
  ],

  requiredKeywords: [
    "capek",
    "istirahat",
    "manusia",
    "paham",
    "diri",
    "berat",
    "wajar",
  ],

  forbiddenKeywords: [
    "harusnya",
    "males",
    "lemah",
    "cengeng",
    "semangat",
  ],

  severityLevel: 4,
}
