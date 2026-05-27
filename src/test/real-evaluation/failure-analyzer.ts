/**
 * ============================================================
 * FAILURE ANALYSIS — ANALISIS KEGAGALAN RESPONS
 * ============================================================
 *
 * Mendeteksi dan menganalisis kegagalan dalam respons chatbot.
 *
 * JENIS KEGAGALAN:
 * 1. IRRELEVANT       — Respons tidak relevan dengan input
 * 2. WRONG_CONTEXT    — Retrieval salah konteks
 * 3. GENERIC          — Jawaban terlalu generic
 * 4. HALLUCINATION    — Halusinasi ringan
 * 5. EMOTIONAL_MISMATCH — Konteks emosional tidak nyambung
 *
 * QUALITY LABELS:
 * - GOOD       (≥ 80) : Respons sangat baik
 * - ACCEPTABLE (≥ 60) : Respons cukup baik
 * - WEAK       (≥ 40) : Respons lemah
 * - FAILED     (< 40) : Respons gagal
 *
 * @author  Tim Skripsi
 * @version 1.0
 * ============================================================
 */

import {
  FailureAnalysis,
  QualityLabel,
  TestScenario,
  RetrievedChunkInfo,
} from "@/test/types"
import { textCosineSimilarity } from "@/test/types/utils/cosine-similarity"
import { jaccardSimilarity } from "@/test/types/utils/text-overlap"

// ------------------------------------------------------------------
// KATA KUNCI UNTUK DETEKSI
// ------------------------------------------------------------------

/**
 * Frasa yang menunjukkan respons generik/tidak spesifik.
 */
const GENERIC_MARKERS = [
  "semangat ya",
  "kamu pasti bisa",
  "jangan menyerah",
  "tetap semangat",
  "semua akan baik-baik saja",
  "ada hikmahnya",
  "positive thinking",
  "harus semangat",
  "jangan khawatir",
  "sudahlah",
  "lupakan aja",
  "biasa aja",
  "ga usah dipikirin",
  "pasti ada jalan",
  "yang penting kamu",
]

/**
 * Frasa yang menunjukkan halusinasi ringan.
 */
const HALLUCINATION_MARKERS = [
  "saya sarankan kamu",
  "sebaiknya kamu",
  "kamu harus konsultasi",
  "dokter",
  "terapi",
  "obat",
  "diagnosis",
  "menurut penelitian",
  "studies show",
  "data menunjukkan",
  "saya sebagai AI",
  "sebagai asisten",
]

/**
 * Frasa yang menunjukkan mismatch emosional.
 */
const MISMATCH_POSITIVE = [
  "senang",
  "bahagia",
  "gembira",
  "syukurlah",
  "bagus",
  "mantap",
  "keren",
  "happy",
]

/**
 * Frasa yang harus dihindari untuk konteks sedih/cemas.
 */
const JUDGEMENTAL_PHRASES = [
  "lebay",
  "berlebihan",
  "dramatis",
  "cari perhatian",
  "sensitif banget",
  "baper",
  "cengeng",
  "lemah",
  "males",
  "malas",
]

// ------------------------------------------------------------------
// DETEKSI IRRELEVAN
// ------------------------------------------------------------------

/**
 * Mendeteksi apakah respons tidak relevan dengan input user.
 *
 * Kriteria:
 * - Cosine similarity sangat rendah (< 0.1)
 * - Jaccard similarity sangat rendah (< 0.05)
 * - Respons tidak mengandung kata dari input
 *
 * @param response - Respons chatbot
 * @param userInput - Input user
 * @returns { isIrrelevant, reason }
 */
function detectIrrelevant(
  response: string,
  userInput: string
): { isIrrelevant: boolean; reason?: string } {
  const cosineSim = textCosineSimilarity(response, userInput)
  const jaccardSim = jaccardSimilarity(response, userInput)

  if (cosineSim < 0.1 && jaccardSim < 0.05) {
    return {
      isIrrelevant: true,
      reason: `Cosine similarity sangat rendah (${cosineSim.toFixed(3)}), Jaccard sangat rendah (${jaccardSim.toFixed(3)}). Respons tidak terhubung dengan input user.`,
    }
  }

  if (cosineSim < 0.2) {
    return {
      isIrrelevant: true,
      reason: `Cosine similarity rendah (${cosineSim.toFixed(3)}). Respons kurang relevan dengan konteks.`,
    }
  }

  // Cek apakah ada kata dari input dalam respons
  const inputWords = userInput.toLowerCase().split(/\s+/).filter(w => w.length > 3)
  const responseLower = response.toLowerCase()
  const matchedWords = inputWords.filter(w => responseLower.includes(w))

  if (inputWords.length > 2 && matchedWords.length === 0) {
    return {
      isIrrelevant: true,
      reason: "Tidak ada kata kunci dari input user yang muncul dalam respons.",
    }
  }

  return { isIrrelevant: false }
}

// ------------------------------------------------------------------
// DETEKSI WRONG CONTEXT
// ------------------------------------------------------------------

/**
 * Mendeteksi apakah retrieval mengambil konteks yang salah.
 *
 * Kriteria:
 * - Chunk yang diretrieve memiliki topik berbeda dari input
 * - Skor similarity chunk rendah
 *
 * @param retrievedChunks - Chunks yang diretrieve
 * @param userInput - Input user
 * @returns { isWrongContext, reason }
 */
function detectWrongContext(
  retrievedChunks: RetrievedChunkInfo[],
  userInput: string
): { isWrongContext: boolean; reason?: string } {
  if (retrievedChunks.length === 0) {
    return {
      isWrongContext: true,
      reason: "Tidak ada chunk yang diretrieve (retrieved context kosong).",
    }
  }

  const inputLower = userInput.toLowerCase()

  // Cek apakah chunk teratas relevan
  const topChunk = retrievedChunks[0]
  const chunkText = `${topChunk.topic} ${topChunk.situation}`
  const similarity = textCosineSimilarity(chunkText, userInput)

  if (similarity < 0.15 && topChunk.similarityScore < 0.3) {
    return {
      isWrongContext: true,
      reason: `Chunk teratas "${topChunk.topic}" memiliki similarity rendah (${similarity.toFixed(3)}) dengan input user. Retrieval tidak mengambil konteks yang tepat.`,
    }
  }

  // Cek apakah ada chunk yang relevan
  const relevantChunks = retrievedChunks.filter(
    (c) => c.similarityScore > 0.3
  )
  if (relevantChunks.length === 0) {
    return {
      isWrongContext: true,
      reason: "Tidak ada chunk dengan similarity score di atas 0.3. Semua chunk yang diretrieve memiliki relevansi rendah.",
    }
  }

  return { isWrongContext: false }
}

// ------------------------------------------------------------------
// DETEKSI GENERIC RESPONSE
// ------------------------------------------------------------------

/**
 * Mendeteksi apakah respons terlalu generic.
 *
 * @param response - Respons chatbot
 * @returns { isGeneric, reason }
 */
function detectGenericResponse(
  response: string
): { isGeneric: boolean; reason?: string } {
  const responseLower = response.toLowerCase()
  const matchedGeneric: string[] = []

  for (const marker of GENERIC_MARKERS) {
    if (responseLower.includes(marker)) {
      matchedGeneric.push(marker)
    }
  }

  if (matchedGeneric.length >= 3) {
    return {
      isGeneric: true,
      reason: `Respons mengandung ${matchedGeneric.length} frasa generik: ${matchedGeneric.slice(0, 3).join(", ")}. Jawaban terlalu umum.`,
    }
  }

  if (matchedGeneric.length >= 1) {
    // Cek panjang respons — respons pendek + generic = sangat generik
    const wordCount = response.split(/\s+/).length
    if (wordCount < 15) {
      return {
        isGeneric: true,
        reason: `Respons pendek (${wordCount} kata) dan mengandung frasa generik "${matchedGeneric[0]}".`,
      }
    }
  }

  return { isGeneric: false }
}

// ------------------------------------------------------------------
// DETEKSI HALLUCINATION
// ------------------------------------------------------------------

/**
 * Mendeteksi halusinasi ringan dalam respons.
 *
 * @param response - Respons chatbot
 * @returns { isHallucination, evidence }
 */
function detectHallucination(
  response: string
): { isHallucination: boolean; evidence?: string } {
  const responseLower = response.toLowerCase()
  const matchedHallucination: string[] = []

  for (const marker of HALLUCINATION_MARKERS) {
    if (responseLower.includes(marker)) {
      matchedHallucination.push(marker)
    }
  }

  if (matchedHallucination.length > 0) {
    return {
      isHallucination: true,
      evidence: `Respons mengandung frasa yang tidak seharusnya: ${matchedHallucination.join(", ")}. Chatbot curhat tidak boleh memberikan saran medis.`,
    }
  }

  return { isHallucination: false }
}

// ------------------------------------------------------------------
// DETEKSI EMOTIONAL MISMATCH
// ------------------------------------------------------------------

/**
 * Mendeteksi apakah konteks emosional respons tidak nyambung.
 *
 * Kriteria:
 * - User input bernada sedih, tapi respons terlalu ceria
 * - User input bernada marah, tapi respons meremehkan
 * - Respons mengandung kata judgemental
 *
 * @param response - Respons chatbot
 * @param scenario - Skenario (untuk arah emosional)
 * @returns { isMismatch, evidence }
 */
function detectEmotionalMismatch(
  response: string,
  scenario: TestScenario
): { isMismatch: boolean; evidence?: string } {
  const responseLower = response.toLowerCase()
  const responseWords = responseLower.split(/\s+/)

  // Cek kata judgemental
  const matchedJudgemental = JUDGEMENTAL_PHRASES.filter((p) =>
    responseLower.includes(p)
  )

  if (matchedJudgemental.length > 0) {
    return {
      isMismatch: true,
      evidence: `Respons mengandung kata judgemental: ${matchedJudgemental.join(", ")}. Chatbot menghakimi perasaan user.`,
    }
  }

  // Cek apakah respons terlalu positif untuk skenario negatif
  const negativeScenarios = [
    "overthinking",
    "anxiety",
    "insecure",
    "keluarga",
    "burnout",
    "loneliness",
  ]
  const isNegativeScenario = negativeScenarios.includes(scenario.category)

  if (isNegativeScenario) {
    const positiveCount = MISMATCH_POSITIVE.filter((p) =>
      responseLower.includes(p)
    ).length

    if (positiveCount >= 2) {
      return {
        isMismatch: true,
        evidence: `Respons terlalu positif (${positiveCount} kata positif) untuk skenario negatif (${scenario.category}). User butuh validasi, bukan optimisme berlebihan.`,
      }
    }
  }

  // Cek apakah respons sesuai dengan arah emosional
  const emotionalDirections = scenario.expectedEmotionalDirection.map((d) =>
    d.toLowerCase()
  )
  const matchedDirections = emotionalDirections.filter((d) =>
    responseLower.includes(d)
  )

  if (matchedDirections.length === 0) {
    return {
      isMismatch: true,
      evidence: `Respons tidak mengandung arah emosional yang diharapkan (${scenario.expectedEmotionalDirection.join(", ")}). Konteks emosional tidak nyambung.`,
    }
  }

  return { isMismatch: false }
}

// ------------------------------------------------------------------
// MAIN FAILURE ANALYSIS
// ------------------------------------------------------------------

/**
 * Menganalisis kegagalan respons chatbot secara lengkap.
 *
 * @param response - Respons chatbot
 * @param scenario - Skenario pengujian
 * @param retrievedChunks - Chunks yang diretrieve (opsional)
 * @returns FailureAnalysis
 */
export function analyzeFailures(
  response: string,
  scenario: TestScenario,
  retrievedChunks?: RetrievedChunkInfo[]
): FailureAnalysis {
  // Deteksi berbagai jenis kegagalan
  const irrelevant = detectIrrelevant(response, scenario.userInput)
  const wrongContext = retrievedChunks
    ? detectWrongContext(retrievedChunks, scenario.userInput)
    : { isWrongContext: false }
  const generic = detectGenericResponse(response)
  const hallucination = detectHallucination(response)
  const mismatch = scenario ? detectEmotionalMismatch(response, scenario) : { isMismatch: false }

  // Hitung skor kualitas
  let qualityScore = 100

  if (irrelevant.isIrrelevant) qualityScore -= 30
  if (wrongContext.isWrongContext) qualityScore -= 20
  if (generic.isGeneric) qualityScore -= 15
  if (hallucination.isHallucination) qualityScore -= 25
  if (mismatch.isMismatch) qualityScore -= 20

  qualityScore = Math.max(0, qualityScore)

  // Tentukan label
  let label: QualityLabel
  if (qualityScore >= 80) {
    label = "GOOD"
  } else if (qualityScore >= 60) {
    label = "ACCEPTABLE"
  } else if (qualityScore >= 40) {
    label = "WEAK"
  } else {
    label = "FAILED"
  }

  return {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    label,
    isIrrelevant: irrelevant.isIrrelevant,
    isWrongContext: wrongContext.isWrongContext,
    isGenericResponse: generic.isGeneric,
    isHallucination: hallucination.isHallucination,
    isEmotionalMismatch: mismatch.isMismatch,
    details: {
      irrelevantReason: irrelevant.reason,
      wrongContextReason: wrongContext.reason,
      genericReason: generic.reason,
      hallucinationEvidence: hallucination.evidence,
      mismatchEvidence: mismatch.evidence,
    },
    qualityScore,
  }
}

// ------------------------------------------------------------------
// GENERATE FAILURE TABLE (MARKDOWN)
// ------------------------------------------------------------------

/**
 * Menghasilkan tabel analisis kegagalan dalam format Markdown.
 *
 * @param analyses - Array hasil analisis kegagalan
 * @returns String markdown
 */
export function generateFailureTable(
  analyses: FailureAnalysis[]
): string {
  const lines: string[] = []

  lines.push(`### Analisis Kegagalan Respons`)
  lines.push(``)
  lines.push(`| Skenario | Label | Skor | Irrelevan | Salah Konteks | Generik | Halusinasi | Mismatch |`)
  lines.push(`|----------|-------|------|-----------|---------------|---------|------------|----------|`)
  for (const a of analyses) {
    lines.push(
      `| ${a.scenarioName} | ${a.label} | ${a.qualityScore} | ${a.isIrrelevant ? "⚠️" : "✅"} | ${a.isWrongContext ? "⚠️" : "✅"} | ${a.isGenericResponse ? "⚠️" : "✅"} | ${a.isHallucination ? "⚠️" : "✅"} | ${a.isEmotionalMismatch ? "⚠️" : "✅"} |`
    )
  }
  lines.push(``)

  // Ringkasan distribusi label
  const labelCount: Record<QualityLabel, number> = {
    GOOD: 0,
    ACCEPTABLE: 0,
    WEAK: 0,
    FAILED: 0,
  }
  for (const a of analyses) {
    labelCount[a.label]++
  }

  lines.push(`**Distribusi Label:**`)
  lines.push(``)
  lines.push(`| Label | Jumlah | Persentase |`)
  lines.push(`|-------|--------|------------|`)
  for (const [label, count] of Object.entries(labelCount)) {
    const pct = analyses.length > 0
      ? ((count / analyses.length) * 100).toFixed(1)
      : "0.0"
    lines.push(`| ${label} | ${count} | ${pct}% |`)
  }
  lines.push(``)

  // Skenario yang gagal
  const failed = analyses.filter((a) => a.label === "FAILED")
  if (failed.length > 0) {
    lines.push(`**Skenario Gagal (FAILED):**`)
    lines.push(``)
    for (const f of failed) {
      lines.push(`- **${f.scenarioName}**: ${f.details.irrelevantReason || f.details.wrongContextReason || f.details.genericReason || f.details.hallucinationEvidence || f.details.mismatchEvidence || "Alasan tidak diketahui"}`)
    }
    lines.push(``)
  }

  return lines.join("\n")
}
