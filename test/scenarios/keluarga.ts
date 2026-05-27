import { TestScenario } from "@test/types"

/** Skenario 1: Konflik dengan orang tua */
export const familyConflictScenario: TestScenario = {
  id: "keluarga_001",
  name: "Konflik dengan Orang Tua",
  category: "keluarga",

  userInput:
    "Orang tuaku selalu ngatur hidupku. Mau ambil jurusan apa, mau kerja dimana, semuanya mereka yang tentuin. Kalo aku ga sesuai maunya, mereka marah dan bilang aku ga tau terima kasih. Aku capek.",

  expectedRetrievedContext: [
    {
      chunkId: "emotion_0006",
      topic: "family",
      situation:
        "User merasa tertekan dan tidak dipahami oleh orang tua",
      expectedRelevanceScore: 0.7,
      emotions: ["hurt", "frustrated", "emotionally_unseen"],
      needs: ["validation", "emotional safety"],
    },
  ],

  expectedEmotionalDirection: [
    "Validasi perasaan tertekan oleh ekspektasi orang tua",
    "Normalisasi konflik orang tua-anak sebagai hal wajar",
    "Bantu user mengeksplorasi perasaannya tanpa menghakimi",
    "Tawarkan dukungan tanpa memberi saran yang memicu konflik",
  ],

  expectedResponseCriteria: [
    "Mengandung validasi emosional yang hangat",
    "Tidak menyalahkan orang tua atau user",
    "Tidak memberi saran 'lawan orang tua' atau 'manut aja'",
    "Menggunakan nada yang netral dan mendukung",
  ],

  requiredKeywords: [
    "paham",
    "berat",
    "wajar",
    "cerita",
    "rasa",
    "sendiri",
    "pelan",
  ],

  forbiddenKeywords: [
    "emang orang tua",
    "durhaka",
    "lawan aja",
    "manut aja",
    "cari perhatian",
  ],

  severityLevel: 4,
}

/** Skenario 2: Broken home */
export const brokenHomeScenario: TestScenario = {
  id: "keluarga_002",
  name: "Broken Home",
  category: "keluarga",

  userInput:
    "Orang tuaku cerai tahun lalu, dan sampe sekarang aku masih berantakan. Rumah rasanya ga utuh lagi. Aku tinggal sama ibu, tapi ibu sering sedih, dan aku ga tau cara ngehiburnya. Kadang aku ngerasa ini semua salahku.",

  expectedRetrievedContext: [
    {
      chunkId: "emotion_0014",
      topic: "loss",
      situation:
        "User merasa kehilangan dan berduka setelah perceraian orang tua",
      expectedRelevanceScore: 0.65,
      emotions: ["grief", "sadness", "guilt", "disbelief"],
      needs: ["presence", "validation", "space to grieve"],
    },
  ],

  expectedEmotionalDirection: [
    "Validasi rasa sakit dan kehilangan yang dirasakan",
    "Tegaskan bahwa perceraian bukan kesalahan user",
    "Normalisasi perasaan berantakan setelah perceraian orang tua",
    "Tawarkan ruang aman untuk mengekspresikan emosi",
  ],

  expectedResponseCriteria: [
    "Mengandung empati yang dalam",
    "Tidak menyalahkan siapapun",
    "Tidak memberikan saran 'ikhlaskan' yang tergesa-gesa",
    "Menggunakan nada yang sangat hangat dan penuh perhatian",
  ],

  requiredKeywords: [
    "berat",
    "paham",
    "salah",
    "rasa",
    "sendiri",
    "sedih",
    "cerita",
  ],

  forbiddenKeywords: [
    "ikhlasin aja",
    "udah biasa",
    "lupakan",
    "orang tua",
    "harusnya",
  ],

  severityLevel: 5,
}

/** Skenario 3: Tekanan ekspektasi keluarga */
export const familyPressureScenario: TestScenario = {
  id: "keluarga_003",
  name: "Tekanan Ekspektasi Keluarga",
  category: "keluarga",

  userInput:
    "Keluargaku punya ekspektasi tinggi banget ke aku. Harus jadi dokter, harus nilai bagus, harus jadi kebanggaan keluarga. Capek banget rasanya hidup buat memenuhi ekspektasi orang lain. Kalo gagal, rasanya aku ngecewain semuanya.",

  expectedRetrievedContext: [
    {
      chunkId: "emotion_0006",
      topic: "family",
      situation:
        "User merasa kelelahan karena terus-menerus berusaha memenuhi ekspektasi keluarga",
      expectedRelevanceScore: 0.75,
      emotions: ["hurt", "frustrated", "emotionally_unseen"],
      needs: ["validation", "emotional safety"],
    },
  ],

  expectedEmotionalDirection: [
    "Validasi perasaan lelah karena tekanan ekspektasi",
    "Normalisasi keinginan untuk hidup sesuai diri sendiri",
    "Bantu user menemukan nilai dirinya di luar ekspektasi keluarga",
    "Tawarkan dukungan tanpa menyuruh konfrontasi",
  ],

  expectedResponseCriteria: [
    "Mengandung validasi emosional yang kuat",
    "Tidak menyalahkan keluarga atau user",
    "Tidak memberi saran 'lawan aja'",
    "Menggunakan nada yang hangat dan mendukung",
  ],

  requiredKeywords: [
    "berat",
    "paham",
    "capek",
    "diri",
    "wajar",
    "hidup",
    "cerita",
  ],

  forbiddenKeywords: [
    "harusnya",
    "lawan",
    "durhaka",
    "cengeng",
    "males",
  ],

  severityLevel: 4,
}

/** Skenario 4: Komunikasi keluarga buruk */
export const familyCommunicationScenario: TestScenario = {
  id: "keluarga_004",
  name: "Tidak Bisa Terbuka dengan Keluarga",
  category: "keluarga",

  userInput:
    "Di keluargaku, kita ga pernah ngobrol dari hati ke hati. Kalo ada masalah, diemin aja. Aku pengen cerita, tapi takut ga diterima. Akhirnya aku pendem sendiri semua perasaanku. Rasanya sesek.",

  expectedRetrievedContext: [
    {
      chunkId: "emotion_0006",
      topic: "family",
      situation:
        "User merasa sendiri dan tidak dipahami meskipun tinggal bersama keluarga",
      expectedRelevanceScore: 0.7,
      emotions: ["hurt", "frustrated", "emotionally_unseen"],
      needs: ["validation", "emotional safety"],
    },
  ],

  expectedEmotionalDirection: [
    "Validasi perasaan kesepian meskipun ada keluarga",
    "Normalisasi kesulitan komunikasi dalam keluarga",
    "Berikan ruang aman untuk user bisa terbuka",
    "Tawarkan dukungan tanpa memaksa user untuk 'berubah'",
  ],

  expectedResponseCriteria: [
    "Mengandung validasi emosional",
    "Tidak menyalahkan keluarga atau user",
    "Tidak memberi saran instan untuk 'cuek aja' atau 'ngomong aja'",
    "Menggunakan nada yang hangat dan menerima",
  ],

  requiredKeywords: [
    "sendiri",
    "paham",
    "berat",
    "cerita",
    "disini",
    "rasa",
    "ngerti",
  ],

  forbiddenKeywords: [
    "cuek aja",
    "lupakan",
    "biasain",
    "cari perhatian",
    "diem aja",
  ],

  severityLevel: 3,
}
