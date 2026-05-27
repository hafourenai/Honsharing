/**
 * ============================================================
 * MULTI-TURN CONVERSATION DATASET
 * ============================================================
 *
 * Dataset percakapan multi-turn untuk menguji context retention,
 * memory consistency, emotional continuity, dan topic tracking
 * chatbot curhat "Honey".
 *
 * Total: 10 percakapan
 * Setiap percakapan: 4â€“8 message
 * Kategori: overthinking, anxiety, relationship, keluarga,
 *           kehilangan motivasi, kesepian, insecure, burnout
 *
 * @author  Tim Skripsi
 * @version 1.0
 * ============================================================
 */

import { MultiTurnScenario } from "@test/types"

// PERCAKAPAN 1: Overthinking Malam â†’ Tenang

export const multiOverthinkingMalam: MultiTurnScenario = {
  id: "multi_overthinking_malam",
  name: "Overthinking Malam Hari â€” Perkembangan Menuju Tenang",
  description:
    "User mengalami overthinking di malam hari, perlahan-lahan ditenangkan oleh chatbot. " +
    "Menguji kemampuan chatbot dalam menenangkan secara bertahap.",
  category: "overthinking",
  initialSeverity: 4,
  turns: [
    {
      userInput:
        "Aku ga bisa tidur samsek. Pikiran muter terus, mikirin masa depan, kuliah, kerja, semuanya.",
      expectedEmotionalState: "cemas, overthinking, gelisah",
      topic: "overthinking masa depan",
      memoryHints: [],
      requiredKeywords: ["pikiran", "muter", "capek"],
      forbiddenKeywords: ["lebay", "berlebihan"],
    },
    {
      userInput:
        "Iya, apalagi kalo malam gini, sepi, jadinya makin overthinking. Kadang sampe sesek napas.",
      expectedEmotionalState: "cemas berat, fisik terpengaruh",
      topic: "overthinking malam hari",
      memoryHints: ["ga bisa tidur", "pikiran muter"],
      requiredKeywords: ["napas", "tenang", "pelan"],
      forbiddenKeywords: ["lupakan", "jangan pikirin"],
    },
    {
      userInput:
        "Iya sih, tapi susah banget buat berenti mikir. Rasanya kayak otak ga mau diajak kompromi.",
      expectedEmotionalState: "mulai sedikit tenang, masih overthinking",
      topic: "kesulitan berhenti overthinking",
      memoryHints: ["ga bisa tidur", "sesek napas"],
      requiredKeywords: ["paham", "wajar", "pelan"],
      forbiddenKeywords: ["harusnya", "seharusnya"],
    },
    {
      userInput:
        "Hehe iya, makasih ya udah dengerin curhatku. Lumayan lega sih cerita dikit.",
      expectedEmotionalState: "mulai tenang, bersyukur",
      topic: "penutupan obrolan malam",
      memoryHints: ["pikiran muter", "sesek napas"],
      requiredKeywords: ["sama-sama", "istirahat", "kapan aja"],
      forbiddenKeywords: ["sudahlah"],
    },
  ],
  expectedOutcomes: {
    emotionalProgression: [
      "cemas berat",
      "sedikit tenang",
      "mulai rileks",
      "tenang dan bersyukur",
    ],
    topicContinuity: true,
    memoryMarkers: [
      "tidur",
      "pikiran",
      "napas",
      "malam",
    ],
    finalEmotionalDirection: ["tenang", "rileks", "bersyukur", "istirahat"],
  },
}

// PERCAKAPAN 2: Kecemasan Sosial â€” Persiapan Event

export const multiKecemasanSosial: MultiTurnScenario = {
  id: "multi_anxiety_sosial",
  name: "Kecemasan Sosial â€” Persiapan Presentasi",
  description:
    "User cemas menghadapi presentasi besar. Chatbot harus membantu menenangkan " +
    "dan membangun kepercayaan diri secara bertahap.",
  category: "anxiety",
  initialSeverity: 4,
  turns: [
    {
      userInput:
        "Dua hari lagi aku presentasi proposal skripsi depan dosen penguji. Deg-degan banget rasanya.",
      expectedEmotionalState: "cemas, takut, gelisah",
      topic: "kecemasan presentasi",
      memoryHints: [],
      requiredKeywords: ["deg-degan", "cemas", "presentasi"],
      forbiddenKeywords: ["biasa aja", "gampang"],
    },
    {
      userInput:
        "Iya takut salah ngomong, lupa materi, ditanya ga bisa jawab. Pokoknya serem banget.",
      expectedEmotionalState: "ketakutan, kurang percaya diri",
      topic: "ketakutan presentasi",
      memoryHints: ["presentasi proposal", "dosen penguji"],
      requiredKeywords: ["takut", "siap", "percaya"],
      forbiddenKeywords: ["lupakan", "lebay"],
    },
    {
      userInput:
        "Udah sih, udah siap materi, udah latian beberapa kali. Tapi tetep aja deg-degan.",
      expectedEmotionalState: "sudah persiapan, tapi masih cemas",
      topic: "persiapan sudah matang",
      memoryHints: ["presentasi proposal", "takut salah"],
      requiredKeywords: ["paham", "usaha", "hebat"],
      forbiddenKeywords: ["harusnya"],
    },
    {
      userInput:
        "Iya makasih. Kamu bikin aku agak tenang sih. Makasih udah dengerin.",
      expectedEmotionalState: "mulai tenang, bersyukur",
      topic: "mulai tenang",
      memoryHints: ["presentasi", "deg-degan"],
      requiredKeywords: ["sama-sama", "semangat", "percaya"],
      forbiddenKeywords: [],
    },
  ],
  expectedOutcomes: {
    emotionalProgression: [
      "cemas berat",
      "takut dan kurang percaya diri",
      "sedikit tenang",
      "cukup tenang dan siap",
    ],
    topicContinuity: true,
    memoryMarkers: ["presentasi", "proposal", "dosen", "deg-degan", "materi"],
    finalEmotionalDirection: ["tenang", "percaya diri", "semangat"],
  },
}

// PERCAKAPAN 3: Masalah Hubungan â€” Konflik Bertahap

export const multiMasalahHubungan: MultiTurnScenario = {
  id: "multi_relationship_konflik",
  name: "Masalah Hubungan â€” Konflik dengan Pasangan",
  description:
    "User mengalami konflik berantai dengan pasangan. Dari marah â†’ sedih â†’ menerima.",
  category: "relationship",
  initialSeverity: 5,
  turns: [
    {
      userInput:
        "Gila, hari ini berantem hebat sama pacar. Dia bilang aku ga perhatian. Padahal aku sibuk banget.",
      expectedEmotionalState: "marah, kecewa, defensif",
      topic: "konflik hubungan",
      memoryHints: [],
      requiredKeywords: ["marah", "kecewa", "pacar"],
      forbiddenKeywords: ["putus aja", "tinggalin"],
    },
    {
      userInput:
        "Iya sih, mungkin akhir-akhir ini aku emang sibuk. Tapi bukan berarti aku ga peduli. Dia ga ngerti situasiku.",
      expectedEmotionalState: "mulai introspeksi, masih kecewa",
      topic: "introspeksi konflik",
      memoryHints: ["berantem", "pacar", "ga perhatian"],
      requiredKeywords: ["paham", "komunikasi", "cerita"],
      forbiddenKeywords: ["salah", "harusnya"],
    },
    {
      userInput:
        "Sedih juga sih kalo dipikirin. Aku sayang dia, cuma capek aja kadang. Pengennya dia ngerti.",
      expectedEmotionalState: "sedih, rindu, lelah emosional",
      topic: "kesedihan setelah konflik",
      memoryHints: ["berantem", "sibuk", "ga perhatian"],
      requiredKeywords: ["sedih", "sayang", "ngerti", "wajar"],
      forbiddenKeywords: ["lupakan", "sudahlah"],
    },
    {
      userInput:
        "Iya deh, mungkin besok aku coba ngomong baik-baik sama dia. Makasih ya udah dengerin curhatku.",
      expectedEmotionalState: "mulai tenang, berencana berdamai",
      topic: "rencana berdamai",
      memoryHints: ["berantem", "pacar", "sayang"],
      requiredKeywords: ["semangat", "komunikasi", "pelan"],
      forbiddenKeywords: [],
    },
  ],
  expectedOutcomes: {
    emotionalProgression: [
      "marah dan defensif",
      "introspeksi",
      "sedih dan lelah",
      "menerima dan berencana",
    ],
    topicContinuity: true,
    memoryMarkers: ["pacar", "berantem", "sayang", "komunikasi", "ngomong"],
    finalEmotionalDirection: ["tenang", "berdamai", "komunikasi"],
  },
}

// PERCAKAPAN 4: Masalah Keluarga â€” Tekanan Orang Tua

export const multiKeluargaTekanan: MultiTurnScenario = {
  id: "multi_keluarga_tekanan",
  name: "Keluarga â€” Tekanan Orang Tua Soal Masa Depan",
  description:
    "User merasa tertekan dengan ekspektasi orang tua. Dari frustrasi â†’ sedih â†’ mencari solusi.",
  category: "keluarga",
  initialSeverity: 4,
  turns: [
    {
      userInput:
        "Orang tuaku terus bandingin aku sama anak orang. 'Lihat si A, udah kerja mapan' gitu terus. Capek banget.",
      expectedEmotionalState: "frustrasi, lelah, tidak dihargai",
      topic: "tekanan orang tua",
      memoryHints: [],
      requiredKeywords: ["capek", "bandingin", "frustrasi"],
      forbiddenKeywords: ["diem aja", "lupakan"],
    },
    {
      userInput:
        "Udah bilang sih, tapi mereka ga ngerti. Katanya 'kami cuma mau yang terbaik'. Tapi rasanya sesek.",
      expectedEmotionalState: "frustrasi, merasa tidak didengar",
      topic: "komunikasi dengan orang tua",
      memoryHints: ["orang tua", "bandingin", "capek"],
      requiredKeywords: ["paham", "berat", "wajar"],
      forbiddenKeywords: ["seharusnya", "harusnya"],
    },
    {
      userInput:
        "Iya, mungkin cara mereka emang gitu. Tapi tetep aja sakit. Kadang aku nangis sendiri.",
      expectedEmotionalState: "sedih, menerima tapi sakit",
      topic: "kesedihan karena tekanan",
      memoryHints: ["orang tua", "bandingin", "ga ngerti"],
      requiredKeywords: ["sedih", "nangis", "sakit", "valid"],
      forbiddenKeywords: ["jangan nangis", "cemana"],
    },
    {
      userInput:
        "Iya, makasih. Mungkin aku perlu ngomong lagi baik-baik tapi dengan cara yang beda.",
      expectedEmotionalState: "mulai tenang, mencari solusi",
      topic: "mencari solusi",
      memoryHints: ["orang tua", "bandingin", "nangis"],
      requiredKeywords: ["solusi", "komunikasi", "coba"],
      forbiddenKeywords: ["sudahlah"],
    },
  ],
  expectedOutcomes: {
    emotionalProgression: [
      "frustrasi berat",
      "tidak didengar",
      "sedih dan menerima",
      "mencari solusi",
    ],
    topicContinuity: true,
    memoryMarkers: ["orang tua", "bandingin", "capek", "ngomong", "ngerti"],
    finalEmotionalDirection: ["tenang", "solutif", "komunikasi"],
  },
}

// PERCAKAPAN 5: Kehilangan Motivasi â€” Bangkit Kembali

export const multiKehilanganMotivasi: MultiTurnScenario = {
  id: "multi_motivasi_bangkit",
  name: "Kehilangan Motivasi â€” Proses Bangkit Kembali",
  description:
    "User kehilangan motivasi kuliah, melewati fase denial â†’ sadar â†’ bangkit.",
  category: "motivation",
  initialSeverity: 3,
  turns: [
    {
      userInput:
        "Akhir-akhir ini males banget kuliah. Ga tau kenapa, tiba-tiba ilang semangat. Capek.",
      expectedEmotionalState: "lesu, tidak bersemangat, bingung",
      topic: "kehilangan motivasi",
      memoryHints: [],
      requiredKeywords: ["males", "capek", "semangat"],
      forbiddenKeywords: ["harus semangat", "jangan males"],
    },
    {
      userInput:
        "Iya, mungkin capek aja. Tapi nilai udah mulai turun, takut nanti bermasalah.",
      expectedEmotionalState: "cemas akan dampak, masih lesu",
      topic: "dampak kehilangan motivasi",
      memoryHints: ["males", "ilang semangat", "kuliah"],
      requiredKeywords: ["wajar", "istirahat", "pelan"],
      forbiddenKeywords: ["harusnya", "seharusnya"],
    },
    {
      userInput:
        "Iya sih, tapi rasanya bersalah kalo istirahat. Kayak harus terus produktif.",
      expectedEmotionalState: "konflik internal, merasa bersalah",
      topic: "rasa bersalah istirahat",
      memoryHints: ["males", "nilai turun"],
      requiredKeywords: ["manusiawi", "istirahat", "ga apa"],
      forbiddenKeywords: ["malas", "lemah"],
    },
    {
      userInput:
        "Iya juga ya... Mungkin aku perlu ngatur ulang jadwal. Kasih waktu buat istirahat juga.",
      expectedEmotionalState: "mulai sadar, mencari solusi",
      topic: "perencanaan ulang",
      memoryHints: ["males", "capek", "istirahat"],
      requiredKeywords: ["coba", "atur", "pelan", "semangat"],
      forbiddenKeywords: [],
    },
    {
      userInput:
        "Makasih ya. Kayaknya aku perlu libur bentar buat recharge. Besok aku coba mulai lagi.",
      expectedEmotionalState: "mulai bangkit, optimis",
      topic: "rencana bangkit",
      memoryHints: ["jadwal", "istirahat", "recharge"],
      requiredKeywords: ["recharge", "istirahat", "semangat"],
      forbiddenKeywords: [],
    },
  ],
  expectedOutcomes: {
    emotionalProgression: [
      "lesu dan bingung",
      "cemas akan dampak",
      "merasa bersalah",
      "mulai sadar",
      "bangkit dan optimis",
    ],
    topicContinuity: true,
    memoryMarkers: ["males", "nilai", "istirahat", "jadwal", "recharge"],
    finalEmotionalDirection: ["optimis", "semangat", "teratur"],
  },
}

// PERCAKAPAN 6: Kesepian di Kota Baru

export const multiKesepianKotaBaru: MultiTurnScenario = {
  id: "multi_kesepian_kota",
  name: "Kesepian â€” Adaptasi di Kota Baru",
  description:
    "User pindah ke kota baru untuk kuliah, merasa kesepian dan kesulitan adaptasi.",
  category: "loneliness",
  initialSeverity: 4,
  turns: [
    {
      userInput:
        "Pindah ke kota baru buat kuliah, udah 3 bulan tapi masih betah di kos aja. Ga punya temen.",
      expectedEmotionalState: "kesepian, homesick",
      topic: "adaptasi kota baru",
      memoryHints: [],
      requiredKeywords: ["sendiri", "sepi", "berat"],
      forbiddenKeywords: ["cari temen aja", "gampang"],
    },
    {
      userInput:
        "Udah coba ikut UKM sih, tapi masih kaku. Bedanya budaya sama orang-orang sini.",
      expectedEmotionalState: "kesepian, kesulitan adaptasi",
      topic: "kesulitan bersosialisasi",
      memoryHints: ["kota baru", "ga punya temen", "3 bulan"],
      requiredKeywords: ["paham", "proses", "pelan"],
      forbiddenKeywords: ["harusnya", "udah biasa"],
    },
    {
      userInput:
        "Kangen rumah banget. Apalagi kalo weekend, temen-temen kos pulang, aku sendiri.",
      expectedEmotionalState: "homesick, kesepian berat",
      topic: "homesick",
      memoryHints: ["kota baru", "UKM", "kaku"],
      requiredKeywords: ["kangen", "rumah", "sedih", "wajar"],
      forbiddenKeywords: ["jangan sedih", "lupakan"],
    },
    {
      userInput:
        "Iya sih, mungkin perlu waktu. Makasih ya udah dengerin. Lumayan lega.",
      expectedEmotionalState: "mulai menerima, sedikit lega",
      topic: "mulai beradaptasi",
      memoryHints: ["kota baru", "kangen rumah", "UKM"],
      requiredKeywords: ["sabar", "proses", "ada untuk"],
      forbiddenKeywords: [],
    },
  ],
  expectedOutcomes: {
    emotionalProgression: [
      "kesepian akut",
      "kesulitan adaptasi",
      "homesick berat",
      "mulai menerima",
    ],
    topicContinuity: true,
    memoryMarkers: ["kota baru", "kos", "temen", "rumah", "UKM"],
    finalEmotionalDirection: ["menerima", "sabar", "beradaptasi"],
  },
}

// PERCAKAPAN 7: Insecure Akademik â€” Impostor Syndrome

export const multiInsecureAkademik: MultiTurnScenario = {
  id: "multi_insecure_akademik",
  name: "Insecure Akademik â€” Impostor Syndrome",
  description:
    "User merasa tidak pantas dengan pencapaian akademiknya. Dari insecure â†’ menerima diri.",
  category: "insecure",
  initialSeverity: 4,
  turns: [
    {
      userInput:
        "Aku dapet beasiswa tahun ini. Tapi rasanya aku ga pantas. Banyak yang lebih pinter dari aku.",
      expectedEmotionalState: "impostor syndrome, insecure",
      topic: "impostor syndrome",
      memoryHints: [],
      requiredKeywords: ["pantas", "beasiswa", "ragu"],
      forbiddenKeywords: ["berlebihan", "lebay"],
    },
    {
      userInput:
        "Iya, temen-temen bilang aku capable. Tapi takut suatu saat mereka tau aku sebenernya ga sebagus itu.",
      expectedEmotionalState: "takut ketahuan, cemas",
      topic: "ketakutan impostor syndrome",
      memoryHints: ["beasiswa", "ga pantas"],
      requiredKeywords: ["paham", "wajar", "usaha"],
      forbiddenKeywords: ["harusnya percaya diri"],
    },
    {
      userInput:
        "Mungkin iya. Aku emang kerja keras buat dapet ini. Tapi kok rasanya masih kurang ya.",
      expectedEmotionalState: "mulai introspeksi, masih ragu",
      topic: "evaluasi diri",
      memoryHints: ["beasiswa", "takut ketahuan"],
      requiredKeywords: ["usaha", "bangga", "cukup"],
      forbiddenKeywords: ["jangan insecure"],
    },
    {
      userInput:
        "Iya deh... Makasih ya. Mungkin aku perlu lebih hargai diri sendiri. Ini perjalanan panjang.",
      expectedEmotionalState: "mulai menerima, bersyukur",
      topic: "mulai menerima diri",
      memoryHints: ["beasiswa", "usaha"],
      requiredKeywords: ["hargai", "proses", "percaya"],
      forbiddenKeywords: [],
    },
  ],
  expectedOutcomes: {
    emotionalProgression: [
      "insecure berat",
      "takut ketahuan",
      "introspeksi",
      "mulai menerima",
    ],
    topicContinuity: true,
    memoryMarkers: ["beasiswa", "pantas", "usaha", "hargai", "proses"],
    finalEmotionalDirection: ["menerima", "percaya diri", "bersyukur"],
  },
}

// PERCAKAPAN 8: Burnout Organisasi

export const multiBurnoutOrganisasi: MultiTurnScenario = {
  id: "multi_burnout_organisasi",
  name: "Burnout â€” Kelelahan Organisasi Kampus",
  description:
    "User kelelahan karena terlalu banyak aktivitas organisasi. Dari burnout â†’ mulai mengatur ulang prioritas.",
  category: "burnout",
  initialSeverity: 5,
  turns: [
    {
      userInput:
        "Aku capek banget. Organisasi ini itu, tugas numpuk, rasanya pengen teriak aja.",
      expectedEmotionalState: "burnout, sangat lelah",
      topic: "kelelahan organisasi",
      memoryHints: [],
      requiredKeywords: ["capek", "berat", "lelah"],
      forbiddenKeywords: ["semangat", "jangan capek"],
    },
    {
      userInput:
        "Iya, aku di 3 organisasi. Tadinya seru, sekarang malah beban. Tapi kalo mundur takut ngecewain.",
      expectedEmotionalState: "burnout, merasa terjebak",
      topic: "beban organisasi",
      memoryHints: ["capek", "organisasi", "tugas"],
      requiredKeywords: ["berat", "paham", "wajar"],
      forbiddenKeywords: ["harusnya", "seharusnya"],
    },
    {
      userInput:
        "Iya, mungkin perlu prioritas. Tapi takut dibilang ga komitmen kalo mundur.",
      expectedEmotionalState: "konflik internal, takut judgement",
      topic: "takut mundur",
      memoryHints: ["3 organisasi", "takut ngecewain"],
      requiredKeywords: ["prioritas", "diri", "sehat"],
      forbiddenKeywords: ["jangan mundur", "bertahan"],
    },
    {
      userInput:
        "Iya sih, kesehatan mental lebih penting. Mending aku fokus ke 1 aja yang paling berarti.",
      expectedEmotionalState: "mulai sadar, mengambil keputusan",
      topic: "mengatur prioritas",
      memoryHints: ["organisasi", "capek", "mundur"],
      requiredKeywords: ["keputusan", "baik", "prioritas"],
      forbiddenKeywords: [],
    },
    {
      userInput:
        "Makasih sarannya. Kayaknya aku perlu ngomong ke ketua organisasi minggu depan buat mundur pelan-pelan.",
      expectedEmotionalState: "lega setelah memutuskan",
      topic: "rencana tindakan",
      memoryHints: ["prioritas", "organisasi", "kesehatan"],
      requiredKeywords: ["berani", "langkah", "dukung"],
      forbiddenKeywords: [],
    },
  ],
  expectedOutcomes: {
    emotionalProgression: [
      "burnout berat",
      "terjebak",
      "konflik internal",
      "mulai sadar",
      "lega dan berencana",
    ],
    topicContinuity: true,
    memoryMarkers: ["organisasi", "capek", "mundur", "prioritas", "sehat"],
    finalEmotionalDirection: ["tenang", "lega", "tegas", "sehat"],
  },
}

// PERCAKAPAN 9: Stress Kuliah â€” Deadline Bertubi-tubi

export const multiStressKuliah: MultiTurnScenario = {
  id: "multi_stress_kuliah",
  name: "Stress Kuliah â€” Deadline Bertumpuk",
  description:
    "User menghadapi deadline kuliah yang bertumpuk. Dari panik â†’ terorganisir.",
  category: "stress",
  initialSeverity: 4,
  turns: [
    {
      userInput:
        "Tugas numpuk! 4 deadline minggu depan, 2 ujian, 1 presentasi. Aku panic attack.",
      expectedEmotionalState: "panik, stress akut",
      topic: "deadline bertumpuk",
      memoryHints: [],
      requiredKeywords: ["tugas", "deadline", "panik"],
      forbiddenKeywords: ["biasa aja", "gampang"],
    },
    {
      userInput:
        "Iya, bingung mau mulai dari mana. Semuanya penting katanya. Rasanya mau nangis.",
      expectedEmotionalState: "panik, bingung, ingin menangis",
      topic: "kebingungan prioritas",
      memoryHints: ["4 deadline", "ujian", "presentasi"],
      requiredKeywords: ["bingung", "prioritas", "satu"],
      forbiddenKeywords: ["jangan nangis", "harusnya"],
    },
    {
      userInput:
        "Iya sih, mungkin perlu dibikin list. Tapi takut ga cukup waktu.",
      expectedEmotionalState: "mulai tenang, masih cemas",
      topic: "perencanaan",
      memoryHints: ["deadline", "minggu depan", "tugas"],
      requiredKeywords: ["list", "break down", "cukup"],
      forbiddenKeywords: ["pasti bisa", "gampang"],
    },
    {
      userInput:
        "Okay udah kubikin list. Ada 4 tugas. Paling berat presentasi, tapi presentasinya paling akhir. Jadi aman.",
      expectedEmotionalState: "lebih teratur, tenang",
      topic: "pengerjaan tugas",
      memoryHints: ["list", "prioritas", "presentasi"],
      requiredKeywords: ["bagus", "kerjain", "pelan"],
      forbiddenKeywords: [],
    },
    {
      userInput:
        "Makasih udah bantu tenangin. Aku mulai dari yang paling gampang dulu ya. Wish me luck!",
      expectedEmotionalState: "tenang, siap mengerjakan",
      topic: "siap mengerjakan",
      memoryHints: ["list", "tugas", "presentasi"],
      requiredKeywords: ["semangat", "pelan", "percaya"],
      forbiddenKeywords: [],
    },
  ],
  expectedOutcomes: {
    emotionalProgression: [
      "panik akut",
      "bingung dan ingin menangis",
      "mulai tenang",
      "teratur",
      "siap mengerjakan",
    ],
    topicContinuity: true,
    memoryMarkers: ["tugas", "deadline", "presentasi", "list", "prioritas"],
    finalEmotionalDirection: ["tenang", "teratur", "semangat"],
  },
}

// PERCAKAPAN 10: Kecemasan Masa Depan â€” Lulus

export const multiCemasMasaDepan: MultiTurnScenario = {
  id: "multi_cemas_masa_depan",
  name: "Kecemasan Masa Depan â€” Mau Lulus",
  description:
    "User cemas menghadapi masa depan setelah lulus kuliah. Dari cemas â†’ mendapatkan perspektif.",
  category: "anxiety",
  initialSeverity: 3,
  turns: [
    {
      userInput:
        "Bentar lagi lulus, tapi bingung mau ngapain. Kerja? S2? Atau apa? Ga tau arah.",
      expectedEmotionalState: "bingung, cemas masa depan",
      topic: "kebingungan setelah lulus",
      memoryHints: [],
      requiredKeywords: ["bingung", "arah", "masa depan"],
      forbiddenKeywords: ["harus tau", "seharusnya"],
    },
    {
      userInput:
        "Iya, temen-temen udah pada punya rencana. Ada yang udah terima kerja, ada yang lanjut S2. Aku masih hampa.",
      expectedEmotionalState: "cemas, membandingkan diri",
      topic: "perbandingan dengan teman",
      memoryHints: ["lulus", "bingung", "arah"],
      requiredKeywords: ["banding", "wajar", "proses"],
      forbiddenKeywords: ["jangan bandingin", "harusnya"],
    },
    {
      userInput:
        "Iya sih, takut salah ambil keputusan. Ininya pengen, itunya pengen, ujung-ujungnya ga ada yang dikerjain.",
      expectedEmotionalState: "cemas, overthinking keputusan",
      topic: "takut salah keputusan",
      memoryHints: ["lulus", "temen", "rencana"],
      requiredKeywords: ["takut", "pilih", "wajar"],
      forbiddenKeywords: ["pasti", "gampang"],
    },
    {
      userInput:
        "Mungkin iya ya, ga semua orang punya jalan yang jelas di awal. Mungkin aku perlu eksplorasi dulu.",
      expectedEmotionalState: "mulai menerima ketidakpastian",
      topic: "eksplorasi diri",
      memoryHints: ["lulus", "S2", "kerja", "pilih"],
      requiredKeywords: ["eksplor", "coba", "nikmat"],
      forbiddenKeywords: [],
    },
    {
      userInput:
        "Iya, makasih. Kayaknya aku mau coba internship dulu, liat gimana rasanya kerja. Kalo ga cocok, coba yang lain.",
      expectedEmotionalState: "optimis, punya rencana",
      topic: "rencana konkret",
      memoryHints: ["eksplor", "internship", "coba"],
      requiredKeywords: ["rencana", "coba", "proses"],
      forbiddenKeywords: [],
    },
  ],
  expectedOutcomes: {
    emotionalProgression: [
      "bingung dan cemas",
      "membandingkan diri",
      "takut salah",
      "mulai menerima",
      "optimis dan berencana",
    ],
    topicContinuity: true,
    memoryMarkers: ["lulus", "arah", "coba", "rencana", "eksplor"],
    finalEmotionalDirection: ["optimis", "berencana", "tenang"],
  },
}

// REGISTRY SEMUA SKENARIO MULTI-TURN

export const ALL_MULTI_TURN_SCENARIOS: MultiTurnScenario[] = [
  multiOverthinkingMalam,
  multiKecemasanSosial,
  multiMasalahHubungan,
  multiKeluargaTekanan,
  multiKehilanganMotivasi,
  multiKesepianKotaBaru,
  multiInsecureAkademik,
  multiBurnoutOrganisasi,
  multiStressKuliah,
  multiCemasMasaDepan,
]

/**
 * Mendapatkan skenario multi-turn berdasarkan ID.
 */
export function getMultiTurnScenarioById(
  id: string
): MultiTurnScenario | undefined {
  return ALL_MULTI_TURN_SCENARIOS.find((s) => s.id === id)
}

/**
 * Mendapatkan skenario multi-turn berdasarkan kategori.
 */
export function getMultiTurnScenariosByCategory(
  category: string
): MultiTurnScenario[] {
  return ALL_MULTI_TURN_SCENARIOS.filter((s) => s.category === category)
}
