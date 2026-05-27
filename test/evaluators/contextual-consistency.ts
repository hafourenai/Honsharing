/**
 * CONTEXTUAL CONSISTENCY â€” KONSISTENSI KONTEKS RESPONS
 *
 * Evaluator ini mengukur seberapa konsisten respons chatbot
 * dengan konteks yang diberikan:
 *
 * 1. CHUNK CONSISTENCY â€” Apakah respons menggunakan informasi
 *    dari retrieved chunks?
 *
 * 2. EMOTIONAL CONSISTENCY â€” Apakah respons konsisten dengan
 *    arah emosional yang diharapkan?
 *
 * 3. NO CONTRADICTION â€” Apakah respons mengandung kontradiksi?
 *
 * PENGGUNAAN UNTUK SKRIPSI:
 *   Menjawab pertanyaan:
 *   "Apakah chatbot konsisten dalam merespon sesuai konteks
 *    yang diberikan?"
 *
 *   Konsistensi penting karena menunjukkan bahwa RAG berfungsi
 *   dengan benar â€” chatbot menggunakan konteks yang relevan
 *   tanpa keluar dari topik.
 *
 * @author  Tim Skripsi
 * @version 1.0
 */

import {
  ContextualConsistencyScore,
  TestScenario,
} from "@test/types"
import { textCosineSimilarity } from "@test/types/utils/cosine-similarity"
import { wordOverlapScore } from "@test/types/utils/text-overlap"
import { clampScore } from "@test/types/utils/scoring"


// DIMENSI 1: CHUNK CONSISTENCY


/**
 * Mengukur konsistensi respons dengan retrieved chunks.
 *
 * Strategi:
 * 1. Gabungkan semua situasi dari expectedRetrievedContext
 * 2. Hitung text overlap antara respons dan situasi chunks
 * 3. Semakin tinggi overlap, semakin konsisten
 *
 * @param botResponse - Respons chatbot
 * @param scenario - Skenario dengan expectedRetrievedContext
 * @returns Skor konsistensi chunk (0-100)
 */
function evaluateChunkConsistency(
  botResponse: string,
  scenario: TestScenario
): number {
  if (scenario.expectedRetrievedContext.length === 0) {
    return 50 // Nilai tengah jika tidak ada acuan
  }

  // Gabungkan konteks dari semua chunk yang diharapkan
  const combinedContext = scenario.expectedRetrievedContext
    .map((ctx) => `${ctx.situation} ${ctx.emotions.join(" ")} ${ctx.needs.join(" ")}`)
    .join(" ")

  // Hitung overlap antara respons dan konteks chunk
  const overlap = wordOverlapScore(botResponse, combinedContext)

  // Cosine similarity untuk mengukur kesamaan topik
  const similarity = textCosineSimilarity(botResponse, combinedContext)

  // Kombinasi: 60% overlap + 40% similarity
  return clampScore((overlap * 60 + similarity * 40) * 100)
}

// DIMENSI 2: EMOTIONAL CONSISTENCY

/**
 * Mengukur konsistensi emosional respons.
 *
 * Strategi:
 * 1. Cek apakah respons mengandung kata-kata yang sesuai dengan
 *    expectedEmotionalDirection
 * 2. Cek apakah respons tidak bertentangan dengan direction
 *
 * @param botResponse - Respons chatbot
 * @param scenario - Skenario
 * @returns Skor konsistensi emosional (0-100)
 */
function evaluateEmotionalConsistency(
  botResponse: string,
  scenario: TestScenario
): number {
  const responseLower = botResponse.toLowerCase()
  const directions = scenario.expectedEmotionalDirection

  if (directions.length === 0) return 50

  let matchCount = 0

  for (const direction of directions) {
    // Tokenisasi direction
    const words = direction
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3)

    // Cek apakah setidaknya satu kata dari direction muncul
    const hasMatch = words.some((w) => responseLower.includes(w))
    if (hasMatch) matchCount++
  }

  // Skor: proporsi direction yang terpenuhi
  return clampScore((matchCount / directions.length) * 100)
}

// DIMENSI 3: NO CONTRADICTION

/**
 * Mendeteksi kontradiksi dalam respons chatbot.
 *
 * Kontradiksi terjadi ketika chatbot:
 * - Mengatakan hal yang bertentangan dalam satu respons
 * - Memberikan saran yang saling bertentangan
 * - Mengubah posisi secara tiba-tiba
 *
 * Deteksi sederhana: cari pasangan kata yang bertentangan.
 *
 * @param botResponse - Respons chatbot
 * @returns Skor (100 = tidak ada kontradiksi, 0 = banyak kontradiksi)
 */
function evaluateNoContradiction(botResponse: string): number {
  const responseLower = botResponse.toLowerCase()

  // Pasangan kata yang bertentangan
  const contradictionPairs = [
    ["semangat", "menyerah"],
    ["lanjutkan", "berhenti"],
    ["paksain", "santai"],
    ["sendiri", "bersama"],
    ["lupakan", "ingat"],
  ]

  let contradictionsFound = 0

  for (const [wordA, wordB] of contradictionPairs) {
    const hasA = responseLower.includes(wordA)
    const hasB = responseLower.includes(wordB)

    // Jika kedua kata muncul, periksa konteksnya
    if (hasA && hasB) {
      // Simple heuristic: jika kata muncul dalam jarak dekat,
      // kemungkinan itu adalah kontradiksi
      const indexA = responseLower.indexOf(wordA)
      const indexB = responseLower.indexOf(wordB)

      if (Math.abs(indexA - indexB) < 100) {
        contradictionsFound++
      }
    }
  }

  // Semakin banyak kontradiksi, semakin rendah skor
  return clampScore(100 - contradictionsFound * 33)
}

// EVALUATOR UTAMA

/**
 * Mengevaluasi konsistensi konteks respons chatbot.
 *
 * @param botResponse - Respons chatbot
 * @param scenario - Skenario pengujian
 * @returns ContextualConsistencyScore
 */
export function evaluateContextualConsistency(
  botResponse: string,
  scenario: TestScenario
): ContextualConsistencyScore {
  const chunkConsistency = evaluateChunkConsistency(
    botResponse,
    scenario
  )
  const emotionalConsistency = evaluateEmotionalConsistency(
    botResponse,
    scenario
  )
  const noContradiction = evaluateNoContradiction(botResponse)

  // Final score
  const finalScore = clampScore(
    chunkConsistency * 0.4 +
      emotionalConsistency * 0.4 +
      noContradiction * 0.2
  )

  // Verdict
  let verdict: ContextualConsistencyScore["verdict"]
  if (finalScore >= 85) verdict = "SANGAT_KONSISTEN"
  else if (finalScore >= 70) verdict = "KONSISTEN"
  else if (finalScore >= 55) verdict = "CUKUP"
  else if (finalScore >= 40) verdict = "KURANG"
  else verdict = "TIDAK_KONSISTEN"

  return {
    chunkConsistency,
    emotionalConsistency,
    noContradiction,
    finalScore,
    verdict,
  }
}
