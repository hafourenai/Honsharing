/**
 * ============================================================
 * SKENARIO TESTING: INSECURE & SELF DOUBT
 * ============================================================
 *
 * Skenario ini menguji kemampuan chatbot dalam menangani
 * curhat tentang insecure dan self doubt — perasaan
 * tidak percaya diri, meragukan kemampuan diri, dan
 * merasa tidak cukup baik.
 *
 * Karakteristik insecure/self doubt:
 * - Merasa tidak mampu dibanding orang lain
 * - Impostor syndrome
 * - Overthink tentang penilaian orang terhadap diri
 * - Merasa gagal sebelum mencoba
 *
 * @author  Tim Skripsi
 * @version 1.0
 * ============================================================
 */

import { TestScenario } from "@/test/types"

/**
 * Skenario 1: Self doubt akademik
 * User merasa tidak pintar dan takut gagal di kuliah.
 */
export const selfDoubtAcademicScenario: TestScenario = {
  id: "self_doubt_001",
  name: "Self Doubt Akademik",
  category: "insecure",

  userInput:
    "Aku merasa ga sepintar temen-temenku yang lain. Nilai jelek terus, padahal udah belajar mati-matian. Kayak aku ga cocok kuliah aja, mungkin aku emang bodoh.",

  expectedRetrievedContext: [
    {
      chunkId: "test_overthinking_002",
      topic: "analisis berlebihan",
      situation:
        "User merasa tidak mampu dan membandingkan diri dengan orang lain",
      expectedRelevanceScore: 0.7,
      emotions: ["insecure", "self_doubt", "inadequate"],
      needs: ["reassurance", "perspective", "validation"],
    },
  ],

  expectedEmotionalDirection: [
    "Validasi perasaan tidak mampu tanpa memperkuatnya",
    "Bantu user melihat usaha yang sudah dilakukan",
    "Normalisasi kegagalan sebagai bagian dari proses belajar",
    "Tawarkan perspektif bahwa setiap orang punya kecepatan belajar berbeda",
  ],

  expectedResponseCriteria: [
    "Mengandung validasi emosional yang hangat",
    "Tidak membandingkan dengan orang lain",
    "Tidak memberikan solusi 'belajar lebih giat' yang klise",
    "Mengakui perjuangan yang sudah dilakukan user",
    "Menggunakan nada yang supportive dan tidak menghakimi",
  ],

  requiredKeywords: [
    "paham",
    "berat",
    "proses",
    "usaha",
    "banding",
    "wajar",
    "pelan",
  ],

  forbiddenKeywords: [
    "emang kamu kurang",
    "belajar lebih",
    "harusnya",
    "males",
    "cengeng",
  ],

  severityLevel: 3,
}

/**
 * Skenario 2: Impostor Syndrome
 * User merasa keberhasilannya hanya karena keberuntungan.
 */
export const impostorSyndromeScenario: TestScenario = {
  id: "self_doubt_002",
  name: "Impostor Syndrome",
  category: "insecure",

  userInput:
    "Baru dapet beasiswa, tapi aku malah takut. Kayak aku ga pantas dapet ini. Mungkin aku cuma beruntung aja, dan nanti orang-orang bakal tau kalo aku sebenernya ga sepintar yang mereka kira.",

  expectedRetrievedContext: [
    {
      chunkId: "test_overthinking_002",
      topic: "analisis berlebihan",
      situation:
        "User merasa tidak pantas dengan pencapaiannya, takut ketahuan 'palsu'",
      expectedRelevanceScore: 0.75,
      emotions: ["insecure", "self_doubt", "fear_of_rejection"],
      needs: ["reassurance", "validation", "perspective"],
    },
  ],

  expectedEmotionalDirection: [
    "Validasi perasaan tidak pantas (impostor syndrome)",
    "Normalisasi bahwa banyak orang ngerasain hal yang sama",
    "Bantu lihat bahwa pencapaian adalah hasil usaha sendiri",
    "Tawarkan perspektif bahwa kamu pantas atas apa yang kamu raih",
  ],

  expectedResponseCriteria: [
    "Mengandung validasi emosional",
    "Tidak langsung bilang 'kamu pantas' tanpa memahami perasaannya",
    "Tidak meremehkan kekhawatiran user",
    "Menggunakan nada yang hangat dan mendukung",
  ],

  requiredKeywords: [
    "paham",
    "wajar",
    "berat",
    "rasa",
    "usaha",
    "pantas",
    "cerita",
  ],

  forbiddenKeywords: [
    "emang kamu ga",
    "lebay",
    "cari perhatian",
    "harusnya syukur",
    "dramatis",
  ],

  severityLevel: 3,
}

/**
 * Skenario 3: Insecure penampilan fisik
 * User merasa tidak percaya diri dengan penampilannya.
 */
export const insecurePhysicalScenario: TestScenario = {
  id: "insecure_001",
  name: "Insecure dengan Penampilan Fisik",
  category: "insecure",

  userInput:
    "Aku ga pede banget sama penampilanku. Setiap liat cermin, rasanya muak. Apalagi kalo liat temen-temen yang cantik dan kurus, aku jadi makin insecure. Kadang sampe males keluar rumah.",

  expectedRetrievedContext: [
    {
      chunkId: "test_loneliness_002",
      topic: "social isolation",
      situation:
        "User merasa tidak percaya diri dan cenderung menarik diri dari sosial",
      expectedRelevanceScore: 0.6,
      emotions: ["insecure", "sadness", "isolated"],
      needs: ["acceptance", "validation", "self-worth"],
    },
  ],

  expectedEmotionalDirection: [
    "Validasi perasaan insecure terhadap penampilan",
    "Normalisasi bahwa banyak orang punya perasaan serupa",
    "Bantu user melihat nilai dirinya bukan hanya dari fisik",
    "Dorong penerimaan diri secara perlahan",
  ],

  expectedResponseCriteria: [
    "Mengandung validasi emosional yang hangat",
    "Tidak memberikan solusi 'diet' atau 'perbaiki penampilan'",
    "Tidak membandingkan dengan standar kecantikan",
    "Menggunakan nada yang menerima dan supportive",
  ],

  requiredKeywords: [
    "paham",
    "berat",
    "wajar",
    "diri",
    "cerita",
    "sendiri",
    "terima",
  ],

  forbiddenKeywords: [
    "coba diet",
    "olahraga",
    "berlebihan",
    "cari perhatian",
    "males",
  ],

  severityLevel: 4,
}

/**
 * Skenario 4: Insecure sosial
 * User merasa tidak menarik secara sosial dan takut ditolak.
 */
export const insecureSocialScenario: TestScenario = {
  id: "insecure_002",
  name: "Insecure dalam Bersosialisasi",
  category: "insecure",

  userInput:
    "Aku takut kalo orang-orang sebenernya ga suka sama aku. Apalagi kalo lagi kumpul, aku sering diemin. Kayak aku ga menarik buat diajak ngobrol. Mending diem aja daripada ngomong tapi dianggep aneh.",

  expectedRetrievedContext: [
    {
      chunkId: "test_anxiety_002",
      topic: "social anxiety",
      situation:
        "User merasa takut ditolak dan dinilai negatif dalam situasi sosial",
      expectedRelevanceScore: 0.8,
      emotions: ["anxiety", "fear", "insecure"],
      needs: ["acceptance", "encouragement", "safety"],
    },
  ],

  expectedEmotionalDirection: [
    "Validasi perasaan takut ditolak",
    "Normalisasi kecemasan sosial",
    "Berikan ruang aman tanpa paksaan",
    "Dorong secara perlahan tanpa judgement",
  ],

  expectedResponseCriteria: [
    "Mengandung validasi emosional",
    "Tidak memaksa user untuk 'lebih percaya diri'",
    "Tidak meremehkan ketakutan user",
    "Menggunakan nada yang gentle dan menerima",
  ],

  requiredKeywords: [
    "paham",
    "sendiri",
    "wajar",
    "cerita",
    "pelan",
    "disini",
    "berat",
  ],

  forbiddenKeywords: [
    "cuekin aja",
    "biasain",
    "lebay",
    "cari perhatian",
    "ga usah pikirin",
  ],

  severityLevel: 3,
}
