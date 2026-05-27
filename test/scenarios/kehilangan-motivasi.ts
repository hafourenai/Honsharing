import { TestScenario } from "@test/types"

/** Skenario: Kehilangan semangat hidup */
export const motivationLossScenario: TestScenario = {
  id: "motivation_001",
  name: "Kehilangan Semangat Hidup",
  category: "motivation",

  userInput:
    "Aku kehilangan semangat buat ngapa-ngapain. Dulu aku suka main game, nonton anime, sekarang males banget. Bangun tidur aja rasanya berat. Kayak hampa gitu.",

  expectedRetrievedContext: [
    {
      chunkId: "emotion_0008",
      topic: "mental state",
      situation:
        "User merasa kehilangan motivasi, kosong, dan kehilangan semangat",
      expectedRelevanceScore: 0.9,
      emotions: ["numb", "empty", "emotionally_tired"],
      needs: ["rest", "emotional comfort"],
    },
  ],

  expectedEmotionalDirection: [
    "Validasi bahwa kehilangan motivasi itu wajar",
    "Normalisasi perasaan hampa",
    "Berikan ruang untuk istirahat tanpa rasa bersalah",
    "Dorong untuk langkah kecil tanpa tekanan",
  ],

  expectedResponseCriteria: [
    "Mengandung validasi emosional",
    "Tidak menyalahkan user karena 'malas'",
    "Tidak memberikan saran 'semangat!' yang superficial",
    "Memberikan perspektif bahwa ini sementara",
    "Menggunakan nada yang hangat dan menerima",
  ],

  requiredKeywords: [
    "wajar",
    "istirahat",
    "manusia",
    "proses",
    "pelan",
    "paham",
  ],

  forbiddenKeywords: [
    "malas",
    "semangat dong",
    "bangun",
    "gausah",
    "cuma",
    "mager",
  ],

  severityLevel: 3,
}

/** Skenario 2: Kehilangan arah hidup */
export const motivationDirectionScenario: TestScenario = {
  id: "motivation_002",
  name: "Kehilangan Arah Hidup",
  category: "motivation",

  userInput:
    "Aku bingung sama tujuan hidupku. Umur udah 22 tapi masih ga tau mau jadi apa. Lihat temen-temen pada tau arahnya, aku malah bingung. Kadang mikir, apa ya gunanya aku hidup kalo ga tau mau kemana?",

  expectedRetrievedContext: [
    {
      chunkId: "emotion_0012",
      topic: "self identity",
      situation:
        "User merasa bingung dengan tujuan dan arah hidupnya",
      expectedRelevanceScore: 0.8,
      emotions: ["lost", "confused", "purposeless", "anxious"],
      needs: ["clarity", "self exploration", "non-judgmental space"],
    },
  ],

  expectedEmotionalDirection: [
    "Validasi kebingungan mencari arah hidup",
    "Normalisasi bahwa ga semua orang punya jalan yang jelas di usia 20-an",
    "Tawarkan perspektif bahwa hidup adalah proses eksplorasi",
    "Bantu user melihat bahwa bingung itu manusiawi",
  ],

  expectedResponseCriteria: [
    "Mengandung validasi emosional",
    "Tidak memberikan solusi karir yang instan",
    "Tidak membandingkan dengan orang lain",
    "Menggunakan nada yang hangat dan menerima",
  ],

  requiredKeywords: [
    "paham",
    "wajar",
    "bingung",
    "hidup",
    "proses",
    "jalan",
    "sendiri",
  ],

  forbiddenKeywords: [
    "harusnya",
    "coba ini",
    "ikuti temen",
    "males",
    "gausah mikir",
  ],

  severityLevel: 3,
}

/** Skenario 3: Merasa tidak berguna */
export const motivationWorthlessScenario: TestScenario = {
  id: "motivation_003",
  name: "Merasa Tidak Berguna",
  category: "motivation",

  userInput:
    "Aku merasa ga berguna. Di rumah ga bisa bantu orang tua, di kuliah prestasi biasa aja, di organisasi juga ga aktif. Kayak apapun yang aku lakuin, ga ada dampaknya. Mending ga usah ada aku aja kali ya.",

  expectedRetrievedContext: [
    {
      chunkId: "emotion_0016",
      topic: "mental state",
      situation:
        "User merasa tidak berguna, stuck, dan kehilangan motivasi",
      expectedRelevanceScore: 0.85,
      emotions: ["unmotivated", "stuck", "flat", "exhausted"],
      needs: ["understanding", "non-judgment", "space"],
    },
  ],

  expectedEmotionalDirection: [
    "Validasi perasaan tidak berguna tanpa memperkuatnya",
    "Tegaskan bahwa nilai diri bukan dari produktivitas atau prestasi",
    "Bantu user melihat hal-hal kecil yang sudah ia lakukan",
    "Tawarkan dukungan dan kehadiran tanpa syarat",
  ],

  expectedResponseCriteria: [
    "Mengandung validasi emosional yang dalam",
    "Tidak memberikan saran 'lakukan ini itu'",
    "Tidak menyalahkan user karena 'membandingkan'",
    "Menggunakan nada yang sangat hangat dan penuh perhatian",
  ],

  requiredKeywords: [
    "berat",
    "paham",
    "diri",
    "berarti",
    "ada",
    "rasa",
    "cerita",
  ],

  forbiddenKeywords: [
    "harusnya",
    "cari kegiatan",
    "males",
    "cengeng",
    "gausah",
  ],

  severityLevel: 4,
}
