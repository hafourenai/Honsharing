/**
 * ============================================================
 * MOCK CHUNKS — DATA CHUNK PALSU UNTUK TESTING
 * ============================================================
 *
 * File ini berisi mock data untuk RAG chunks yang digunakan
 * dalam pengujian. Data ini mensimulasikan struktur chunk
 * yang sama dengan yang ada di public/rag-chunks.json.
 *
 * Tujuan:
 * - Menyediakan data testing yang stabil (tidak bergantung
 *   pada file production)
 * - Memungkinkan pengujian skenario spesifik
 * - Reproducible untuk kepentingan skripsi
 *
 * SETIAP CHUNK memiliki struktur:
 * - id: identifier unik
 * - scenario: { topic, situation, core_fear, self_perception }
 * - response_strategy: { tone, style, approach, conversation_pattern }
 * - example_style: array contoh gaya respons
 * - metadata: { emotion, need, intensity, topic }
 * - embedding?: vector numerik (opsional, untuk similarity)
 *
 * @author  Tim Skripsi
 * @version 1.0
 * ============================================================
 */

import { Chunk } from "@/lib/rag/promptBuilder"

// ------------------------------------------------------------------
// OVER-THINKING CHUNKS
// ------------------------------------------------------------------

export const overthinkingChunk1: Chunk = {
  id: "test_overthinking_001",
  scenario: {
    topic: "overthinking malam hari",
    situation:
      "User merasa pikirannya tidak bisa berhenti berputar-putar saat malam hari, memikirkan berbagai kemungkinan buruk tentang masa depan",
    core_fear: "fear of uncertainty",
    self_perception: " merasa tidak bisa mengontrol pikiran sendiri",
  },
  response_strategy: {
    tone: "warm",
    style: "casual friend",
    approach: [
      "validate bahwa overthinking itu wajar",
      "ajak fokus ke hal yang bisa dikontrol",
      "beri teknik grounding sederhana",
    ],
    conversation_pattern: [
      "start with validation",
      "gentle exploration",
      "offer grounding technique",
    ],
  },
  example_style: [
    "pikiran yang muter-muter gitu emang capek banget ya...",
    "wajar kok kalo pikiran kita tiba-tiba lari kemana-mana",
  ],
  metadata: {
    emotion: ["overthinking", "cemas", "lelah mental"],
    need: ["validation", "grounding", "ketenangan"],
    intensity: "medium",
    topic: "overthinking",
  },
}

export const overthinkingChunk2: Chunk = {
  id: "test_overthinking_002",
  scenario: {
    topic: "analisis berlebihan",
    situation:
      "User terus-menerus menganalisis perkataan dan tindakan orang lain, mencari makna tersembunyi yang mungkin tidak ada",
    core_fear: "fear of judgment",
    self_perception: "merasa terlalu sensitif",
  },
  response_strategy: {
    tone: "gentle",
    style: "supportive listener",
    approach: [
      "normalize the experience",
      "ajak refleksi tanpa judgment",
      "bantu bedakan fakta dan asumsi",
    ],
    conversation_pattern: [
      "listen actively",
      "gentle reframe",
      "encourage self-compassion",
    ],
  },
  example_style: [
    "kadang pikiran kita suka bikin cerita sendiri ya...",
    "aku mengerti kenapa kamu mikir gitu, wajar kok",
  ],
  metadata: {
    emotion: ["overthinking", "insecure", "self_doubt"],
    need: ["perspective", "reassurance", "kejelasan"],
    intensity: "medium",
    topic: "overthinking",
  },
}

// ------------------------------------------------------------------
// ANXIETY CHUNKS
// ------------------------------------------------------------------

export const anxietyChunk1: Chunk = {
  id: "test_anxiety_001",
  scenario: {
    topic: "kecemasan umum",
    situation:
      "User merasa cemas tanpa pemicu yang jelas, merasakan gejala fisik seperti jantung berdebar dan sulit bernapas",
    core_fear: "fear of losing control",
    self_perception: "merasa lemah karena cemas terus",
  },
  response_strategy: {
    tone: "calming",
    style: "gentle guide",
    approach: [
      "validasi perasaan cemas",
      "bantu identifikasi pemicu",
      "ajarkan teknik pernapasan",
    ],
    conversation_pattern: [
      "calm opening",
      "validate feeling",
      "offer coping strategy",
    ],
  },
  example_style: [
    "cemas kayak gitu pasti berat banget dijalanin...",
    "napas dulu pelan-pelan ya, kamu aman kok disini",
  ],
  metadata: {
    emotion: ["anxiety", "fear", "panic"],
    need: ["calming", "safety", "reassurance"],
    intensity: "high",
    topic: "anxiety",
  },
}

export const anxietyChunk2: Chunk = {
  id: "test_anxiety_002",
  scenario: {
    topic: "social anxiety",
    situation:
      "User merasa takut dan cemas ketika harus berinteraksi sosial, khawatir dinilai negatif oleh orang lain",
    core_fear: "fear of rejection",
    self_perception: "merasa tidak cukup baik untuk bersosialisasi",
  },
  response_strategy: {
    tone: "encouraging",
    style: "supportive friend",
    approach: [
      "normalize social anxiety",
      "validasi perasaan takut",
      "dorong secara perlahan",
    ],
    conversation_pattern: [
      "acknowledge the fear",
      "gentle encouragement",
      "celebrate small steps",
    ],
  },
  example_style: [
    "ngadepin situasi sosial tuh emang ga gampang ya...",
    "pelan-pelan aja, ga usah dipaksain",
  ],
  metadata: {
    emotion: ["anxiety", "fear", "insecure"],
    need: ["encouragement", "acceptance", "safety"],
    intensity: "high",
    topic: "anxiety",
  },
}

// ------------------------------------------------------------------
// RELATIONSHIP PROBLEM CHUNKS
// ------------------------------------------------------------------

export const relationshipChunk1: Chunk = {
  id: "test_relationship_001",
  scenario: {
    topic: "romantic insecurity",
    situation:
      "User merasa tidak pantas untuk orang yang disukai atau dicintai, takut ditinggalkan",
    core_fear: "fear of abandonment",
    self_perception: "merasa tidak cukup berharga",
  },
  response_strategy: {
    tone: "warm",
    style: "casual friend",
    approach: [
      "validate insecurity gently",
      "explore the root of fear",
      "reinforce self-worth",
    ],
    conversation_pattern: [
      "start with validation",
      "ask gentle questions",
      "offer reassurance",
    ],
  },
  example_style: [
    "perasaan kayak gitu emang sering muncul sih...",
    "kamu berharga loh, apapun yang kamu pikirin",
  ],
  metadata: {
    emotion: ["insecure", "fear_of_rejection", "self_doubt"],
    need: ["reassurance", "emotional safety", "validation"],
    intensity: "medium-high",
    topic: "relationship",
  },
}

export const relationshipChunk2: Chunk = {
  id: "test_relationship_002",
  scenario: {
    topic: "broken trust",
    situation:
      "User mengalami pengkhianatan dalam hubungan, kesulitan untuk percaya lagi pada pasangan",
    core_fear: "fear of being hurt again",
    self_perception: "merasa naif karena percaya",
  },
  response_strategy: {
    tone: "empathetic",
    style: "understanding listener",
    approach: [
      "validate the pain",
      "normalize trust issues",
      "support healing process",
    ],
    conversation_pattern: [
      "acknowledge pain",
      "validate feelings",
      "offer support",
    ],
  },
  example_style: [
    "sakit banget pasti ngalamin hal kayak gitu...",
    "ga heran kalo kamu jadi susah percaya lagi",
  ],
  metadata: {
    emotion: ["hurt", "betrayal", "distrust", "sadness"],
    need: ["healing", "validation", "support"],
    intensity: "high",
    topic: "relationship",
  },
}

// ------------------------------------------------------------------
// LONELINESS CHUNKS
// ------------------------------------------------------------------

export const lonelinessChunk1: Chunk = {
  id: "test_loneliness_001",
  scenario: {
    topic: "existential loneliness",
    situation:
      "User merasa kesepian meskipun dikelilingi orang lain, merasa tidak ada yang benar-benar memahami dirinya",
    core_fear: "fear of being misunderstood",
    self_perception: "merasa berbeda dari orang lain",
  },
  response_strategy: {
    tone: "warm",
    style: "companionable",
    approach: [
      "validate loneliness",
      "normalize the feeling",
      "offer presence",
    ],
    conversation_pattern: [
      "acknowledge loneliness",
      "share understanding",
      "offer company",
    ],
  },
  example_style: [
    "kesepian itu emang berat banget ya, apalagi kalo di keramaian...",
    "aku disini kok, kamu ga sendiri",
  ],
  metadata: {
    emotion: ["loneliness", "sadness", "isolated"],
    need: ["connection", "understanding", "presence"],
    intensity: "medium-high",
    topic: "loneliness",
  },
}

export const lonelinessChunk2: Chunk = {
  id: "test_loneliness_002",
  scenario: {
    topic: "social isolation",
    situation:
      "User kesulitan mencari teman atau koneksi yang bermakna, merasa dikucilkan secara sosial",
    core_fear: "fear of being permanently alone",
    self_perception: "merasa tidak menarik secara sosial",
  },
  response_strategy: {
    tone: "gentle",
    style: "supportive listener",
    approach: [
      "validate struggle",
      "explore social needs",
      "encourage small connections",
    ],
    conversation_pattern: [
      "welcome opening",
      "explore feelings",
      "suggest small steps",
    ],
  },
  example_style: [
    "mencari koneksi yang beneran tuh emang ga gampang...",
    "pelan-pelan aja ya, ga usah dipaksain",
  ],
  metadata: {
    emotion: ["loneliness", "sadness", "hopelessness"],
    need: ["connection", "hope", "belonging"],
    intensity: "high",
    topic: "loneliness",
  },
}

// ------------------------------------------------------------------
// MOTIVATION LOSS CHUNKS
// ------------------------------------------------------------------

export const motivationChunk1: Chunk = {
  id: "test_motivation_001",
  scenario: {
    topic: "kehilangan semangat hidup",
    situation:
      "User merasa kehilangan motivasi untuk melakukan hal-hal yang dulu disukai, merasa hampa dan tidak bersemangat",
    core_fear: "fear of never feeling better",
    self_perception: "merasa malas dan tidak berguna",
  },
  response_strategy: {
    tone: "encouraging",
    style: "gentle motivator",
    approach: [
      "validate the emptiness",
      "normalize loss of motivation",
      "encourage small steps",
    ],
    conversation_pattern: [
      "acknowledge struggle",
      "validate feelings",
      "gentle encouragement",
    ],
  },
  example_style: [
    "kehilangan semangat itu wajar kok, apalagi kalo lagi capek...",
    "ga usah maksain diri buat langsung semangat lagi",
  ],
  metadata: {
    emotion: ["empty", "hopeless", "lethargic", "sad"],
    need: ["motivation", "purpose", "encouragement"],
    intensity: "medium",
    topic: "motivation",
  },
}

// ------------------------------------------------------------------
// ACADEMIC STRESS CHUNKS
// ------------------------------------------------------------------

export const stressChunk1: Chunk = {
  id: "test_stress_001",
  scenario: {
    topic: "stress kuliah",
    situation:
      "User merasa overwhelmed dengan tugas kuliah yang menumpuk, takut tidak bisa memenuhi ekspektasi akademik",
    core_fear: "fear of failure",
    self_perception: "merasa tidak cukup pintar",
  },
  response_strategy: {
    tone: "supportive",
    style: "encouraging mentor",
    approach: [
      "validate academic pressure",
      "break down the problem",
      "encourage self-care",
    ],
    conversation_pattern: [
      "acknowledge stress",
      "validate feelings",
      "offer perspective",
    ],
  },
  example_style: [
    "tugas numpuk gitu bikin stress banget ya...",
    "kamu udah berusaha keras kok, jangan lupa istirahat",
  ],
  metadata: {
    emotion: ["stress", "overwhelmed", "anxious", "inadequate"],
    need: ["validation", "perspective", "self-care"],
    intensity: "high",
    topic: "academic stress",
  },
}

export const stressChunk2: Chunk = {
  id: "test_stress_002",
  scenario: {
    topic: "burnout akademik",
    situation:
      "User merasa kelelahan secara mental dan fisik karena tuntutan kuliah yang terus-menerus tanpa istirahat cukup",
    core_fear: "fear of not meeting expectations",
    self_perception: "merasa lemah karena tidak bisa mengikuti",
  },
  response_strategy: {
    tone: "gentle",
    style: "caring friend",
    approach: [
      "validate burnout",
      "normalize rest",
      "encourage balance",
    ],
    conversation_pattern: [
      "warm opening",
      "validate exhaustion",
      "suggest self-care",
    ],
  },
  example_style: [
    "capek banget ya kalo kuliah terus tanpa jeda...",
    "istirahat itu penting, kamu bukan mesin",
  ],
  metadata: {
    emotion: ["burnout", "exhausted", "overwhelmed", "frustrated"],
    need: ["rest", "validation", "balance"],
    intensity: "high",
    topic: "academic stress",
  },
}

// ------------------------------------------------------------------
// COLLECTION AGREGASI
// ------------------------------------------------------------------

/**
 * Kumpulan semua mock chunks untuk testing.
 */
export const ALL_MOCK_CHUNKS: Chunk[] = [
  overthinkingChunk1,
  overthinkingChunk2,
  anxietyChunk1,
  anxietyChunk2,
  relationshipChunk1,
  relationshipChunk2,
  lonelinessChunk1,
  lonelinessChunk2,
  motivationChunk1,
  stressChunk1,
  stressChunk2,
]

/**
 * Mendapatkan mock chunks berdasarkan topik.
 *
 * @param topic - Topik yang dicari (metadata.topic)
 * @returns Array chunk yang sesuai
 */
export function getMockChunksByTopic(topic: string): Chunk[] {
  return ALL_MOCK_CHUNKS.filter((chunk) => chunk.metadata.topic === topic)
}

/**
 * Mendapatkan mock chunks berdasarkan emosi.
 *
 * @param emotion - Emosi yang dicari
 * @returns Array chunk yang sesuai
 */
export function getMockChunksByEmotion(emotion: string): Chunk[] {
  return ALL_MOCK_CHUNKS.filter((chunk) =>
    chunk.metadata.emotion.includes(emotion)
  )
}
