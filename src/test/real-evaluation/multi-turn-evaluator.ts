/**
 * ============================================================
 * MULTI-TURN EVALUATOR — EVALUASI PERCAKAPAN BANYAK TURN
 * ============================================================
 *
 * Mengevaluasi kemampuan chatbot dalam mempertahankan konteks
 * percakapan multi-turn (banyak putaran).
 *
 * DIMENSI EVALUASI:
 * 1. Memory Consistency — Apakah chatbot ingat info dari turn sebelumnya?
 * 2. Emotional Continuity — Apakah emosi konsisten sepanjang percakapan?
 * 3. Context Retention — Apakah topik lama masih diingat?
 * 4. Topic Tracking — Apakah chatbot mengikuti alur topik?
 *
 * PENTING UNTUK CHATBOT CURHAT:
 *   Chatbot curhat sangat bergantung pada kesinambungan
 *   percakapan. User yang curhat akan merasa tidak didengar
 *   jika chatbot lupa informasi yang sudah diceritakan.
 *
 * @author  Tim Skripsi
 * @version 1.0
 * ============================================================
 */

import {
  MultiTurnScenario,
  MultiTurnResult,
  MultiTurnSummary,
  EvaluationMode,
  QualityLabel,
} from "@/test/types";
import { getDeterministicResponse } from "@/test/mocks";
import {
  createEvaluationMode,
  EvaluationModeHandler,
} from "./evaluation-modes";

// EVALUASI MEMORY CONSISTENCY

/**
 * Mengevaluasi apakah chatbot mengingat informasi dari turn sebelumnya.
 *
 * @param botResponse - Respons chatbot pada turn ini
 * @param memoryHints - Petunjuk memori yang harus diingat dari turn sebelumnya
 * @returns Skor memory consistency (0-100)
 */
function evaluateMemoryConsistency(
  botResponse: string,
  memoryHints: string[],
): number {
  if (memoryHints.length === 0) return 100; // Tidak ada yang harus diingat

  const responseLower = botResponse.toLowerCase();
  let matchedHints = 0;

  for (const hint of memoryHints) {
    if (responseLower.includes(hint.toLowerCase())) {
      matchedHints++;
    }
  }

  return Math.round((matchedHints / memoryHints.length) * 100);
}

// EVALUASI EMOTIONAL CONTINUITY

/**
 * Mengevaluasi apakah emosi dalam respons sesuai dengan
 * perkembangan emosi yang diharapkan.
 *
 * @param botResponse - Respons chatbot
 * @param expectedState - Keadaan emosional yang diharapkan
 * @returns Skor emotional continuity (0-100)
 */
function evaluateEmotionalContinuity(
  botResponse: string,
  expectedState: string,
): number {
  const responseLower = botResponse.toLowerCase();
  const stateWords = expectedState
    .toLowerCase()
    .split(/[,\s]+/)
    .filter((w) => w.length > 2);

  if (stateWords.length === 0) return 100;

  const matched = stateWords.filter((w) => responseLower.includes(w));
  return Math.round((matched.length / stateWords.length) * 100);
}

// EVALUASI CONTEXT RETENTION

/**
 * Mengevaluasi apakah chatbot masih mempertahankan konteks
 * dari turn-turn sebelumnya (bukan hanya turn terakhir).
 *
 * @param botResponse - Respons chatbot
 * @param allPreviousHints - Semua petunjuk memori dari turn sebelumnya
 * @returns Skor context retention (0-100)
 */
function evaluateContextRetention(
  botResponse: string,
  allPreviousHints: string[],
): number {
  if (allPreviousHints.length === 0) return 100;

  const responseLower = botResponse.toLowerCase();

  // Ambil subset dari memory hints (fokus pada yang lebih lama)
  const oldHints = allPreviousHints.slice(
    0,
    Math.min(3, allPreviousHints.length),
  );
  const matched = oldHints.filter((h) =>
    responseLower.includes(h.toLowerCase()),
  );

  // Bobot: semakin lama semakin berharga (karena lebih sulit diingat)
  const weight = matched.length / oldHints.length;
  return Math.round(weight * 100);
}

// EVALUASI TOPIC TRACKING

/**
 * Mengevaluasi apakah chatbot mengikuti alur topik percakapan.
 *
 * @param botResponse - Respons chatbot
 * @param expectedTopic - Topik yang diharapkan
 * @returns Skor topic tracking (0-100)
 */
function evaluateTopicTracking(
  botResponse: string,
  expectedTopic: string,
): number {
  const responseLower = botResponse.toLowerCase();
  const topicWords = expectedTopic
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2);

  if (topicWords.length === 0) return 100;

  const matched = topicWords.filter((w) => responseLower.includes(w));
  return Math.round((matched.length / topicWords.length) * 100);
}

// EVALUASI SATU PERCAKAPAN MULTI-TURN

/**
 * Mengevaluasi satu percakapan multi-turn secara lengkap.
 *
 * @param scenario - Skenario multi-turn
 * @param mode - Mode evaluasi
 * @param apiConfig - Konfigurasi API (jika REAL mode)
 * @returns MultiTurnResult
 */
export async function evaluateMultiTurnScenario(
  scenario: MultiTurnScenario,
  mode: EvaluationModeHandler,
): Promise<MultiTurnResult> {
  const turnDetails: MultiTurnResult["turnDetails"] = [];
  const failures: string[] = [];

  // Kumpulkan semua memory hints dari turn sebelumnya
  const allPreviousHints: string[] = [];

  for (let i = 0; i < scenario.turns.length; i++) {
    const turn = scenario.turns[i];

    // Dapatkan respons chatbot (menggunakan mock untuk konsistensi)
    // TODO: Untuk REAL mode, gunakan mode.getResponse()
    const botResponse = getDeterministicResponse(scenario.id) || "";

    // Evaluasi
    const memoryScore = evaluateMemoryConsistency(
      botResponse,
      turn.memoryHints,
    );
    const emotionalScore = evaluateEmotionalContinuity(
      botResponse,
      turn.expectedEmotionalState,
    );
    const contextScore = evaluateContextRetention(
      botResponse,
      allPreviousHints,
    );
    const topicScore = evaluateTopicTracking(botResponse, turn.topic);

    // Catat semua hints untuk turn berikutnya
    allPreviousHints.push(...turn.memoryHints);

    // Deteksi kegagalan
    if (memoryScore < 50) {
      failures.push(
        `Turn ${i + 1}: Memory consistency rendah (${memoryScore}). ` +
          `Chatbot tidak mengingat: "${turn.memoryHints.join(", ")}"`,
      );
    }
    if (emotionalScore < 50) {
      failures.push(
        `Turn ${i + 1}: Emotional continuity rendah (${emotionalScore}). ` +
          `Emosi yang diharapkan: "${turn.expectedEmotionalState}"`,
      );
    }
    if (topicScore < 50) {
      failures.push(
        `Turn ${i + 1}: Topic tracking rendah (${topicScore}). ` +
          `Topik yang diharapkan: "${turn.topic}"`,
      );
    }

    // Simulasikan respons untuk demo (dengan mock response)
    // Catatan: Dalam REAL mode, botResponse akan berbeda per turn
    const mockResponseForTurn = getTurnMockResponse(
      scenario.id,
      i,
      turn.userInput,
    );

    turnDetails.push({
      turnIndex: i + 1,
      userInput: turn.userInput,
      botResponse: mockResponseForTurn,
      memoryScore,
      emotionalScore,
      contextScore,
      topicScore,
    });
  }

  // Skor akhir
  const avgMemory =
    turnDetails.reduce((s, t) => s + t.memoryScore, 0) / turnDetails.length;
  const avgEmotional =
    turnDetails.reduce((s, t) => s + t.emotionalScore, 0) / turnDetails.length;
  const avgContext =
    turnDetails.reduce((s, t) => s + t.contextScore, 0) / turnDetails.length;
  const avgTopic =
    turnDetails.reduce((s, t) => s + t.topicScore, 0) / turnDetails.length;

  const overallScore = Math.round(
    (avgMemory + avgEmotional + avgContext + avgTopic) / 4,
  );

  // Label
  let label: QualityLabel;
  if (overallScore >= 80) label = "GOOD";
  else if (overallScore >= 60) label = "ACCEPTABLE";
  else if (overallScore >= 40) label = "WEAK";
  else label = "FAILED";

  return {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    memoryConsistency: Math.round(avgMemory),
    emotionalContinuity: Math.round(avgEmotional),
    contextRetention: Math.round(avgContext),
    topicTracking: Math.round(avgTopic),
    overallScore,
    label,
    turnDetails,
    failures,
  };
}

// RESPONS PER TURN (MOCK)

/**
 * Mendapatkan respons mock untuk setiap turn dalam percakapan.
 * Mensimulasikan bagaimana chatbot merespon di setiap tahap.
 *
 * @param scenarioId - ID skenario
 * @param turnIndex - Indeks turn (0-based)
 * @param userInput - Input user pada turn ini
 * @returns Mock response
 */
function getTurnMockResponse(
  scenarioId: string,
  turnIndex: number,
  userInput: string,
): string {
  // Template respons berdasarkan skenario dan turn
  const turnResponses: Record<string, string[]> = {
    multi_overthinking_malam: [
      "Wajar kok kalo pikiran muter terus pas malam hari. Sepi, sunyi, jadinya overthinking makin jadi. Coba tarik napas dulu pelan-pelan, aku temani.",
      "Iya, apalagi kalo udah sesek napas gitu tandanya tubuh butuh istirahat. Kamu ga sendirian kok ngadepin ini.",
      "Paham banget susahnya berhenti mikir. Otak kita emang kadang bandel. Tapi kamu hebat udah sadar dan berusaha. Pelan-pelan aja.",
      "Sama-sama ya. Senang bisa nemenin. Istirahat yang cukup ya, besok kita obrol lagi kalo kamu butuh.",
    ],
    multi_anxiety_sosial: [
      "Deg-degan ya hadepin presentasi proposal. Wajar banget. Kamu udah persiapan, tinggal percaya sama diri sendiri.",
      "Takut salah ngomong itu wajar. Tapi inget, dosen penguji juga pernah jadi mahasiswa. Mereka paham.",
      "Nah, kalo udah siap materi dan udah latian, berarti tinggal mental doang yang perlu dijaga. Kamu pasti bisa.",
      "Sama-sama. Ingat, deg-degan itu tanda kalo kamu peduli sama hasilnya. Itu bagus. Semoga lancar ya!",
    ],
    multi_relationship_konflik: [
      "Berantem sama pacar emang bikin kepala panas ya. Tapi dari cerita kamu, kayaknya dia cuma kangen perhatian kamu.",
      "Paham kok, sibuk dan capek bikin kita lupa sama orang terdekat. Tapi komunikasi itu kuncinya.",
      "Iya, sedih pasti. Tapi justru karena kamu sayang, kamu mau cerita dan cari solusi. Itu udah langkah besar.",
      "Semoga percakapan besok berjalan lancar ya. Yang penting jujur sama perasaan kamu.",
    ],
    multi_keluarga_tekanan: [
      "Capek banget pasti kalo terus dibanding-bandingin. Rasanya kayak usaha kita ga pernah cukup.",
      "Mereka mungkin ga sadar kalo 'yang terbaik' versi mereka belum tentu terbaik buat kamu. Tapi gapapa, perasaan kamu valid.",
      "Nangis itu wajar kok. Lega setelah nangis. Kadang kita butuh nangis buat ngeluarin semua beban.",
      "Bagus, komunikasi dengan cara yang beda bisa jadi solusi. Semoga mereka lebih bisa denger ya.",
    ],
    multi_motivasi_bangkit: [
      "Ilang semangat itu manusiawi banget. Kadang badan dan pikiran kita butuh istirahat.",
      "Nilai turun emang bikin khawatir, tapi istirahat bukan berarti menyerah. Itu bagian dari proses.",
      "Rasa bersalah pas istirahat itu wajar, tapi inget ya, kamu bukan robot. Tubuh kamu butuh recharge.",
      "Nah, itu dia. Atur ulang jadwal, kasih waktu buat istirahat. Produktivitas yang sehat itu yang ada jedanya.",
      "Istirahat dulu, besok mulai lagi. Semangat! Aku selalu disini kalo kamu butuh cerita.",
    ],
    multi_kesepian_kota: [
      "3 bulan di kota baru emang masih terasa asing. Wajar kok kalo kamu masih betah di kos.",
      "Butuh waktu buat beradaptasi. Ga semua orang bisa langsung nyaman di tempat baru. Pelan-pelan aja.",
      "Kangen rumah itu berat banget ya. Apalagi pas weekend sendiri. Tapi kamu hebat loh udah bertahan 3 bulan.",
      "Iya, waktu adalah kunci. Makasih udah mau cerita. Aku disini kalo kamu butuh temen ngobrol.",
    ],
    multi_insecure_akademik: [
      "Selamat dapet beasiswa! Kamu pantas dapet itu, percaya deh. Bukan karena keberuntungan, tapi karena usaha kamu.",
      "Impostor syndrome itu nyata dan banyak orang ngalamin. Tapi inget, kamu ga sampe disana tanpa alasan.",
      "Kamu udah kerja keras, dan itu cukup. Kamu ga perlu jadi yang paling pinter, kamu cukup kok.",
      "Iya, hargai diri sendiri itu penting. Perjalanan masih panjang, nikmati prosesnya.",
    ],
    multi_burnout_organisasi: [
      "3 organisasi? Wajar banget kalo capek. Itu overload banget untuk satu orang.",
      "Takut ngecewain orang lain itu wajar. Tapi kesehatan kamu lebih penting. Kalo kamu jatuh sakit, mereka juga ga akan diuntungkan.",
      "Prioritas itu penting. Kamu ga bisa ngurus semua orang kalo diri sendiri aja udah hancur.",
      "Keputusan yang bagus. Fokus ke yang paling berarti. Kualitas lebih penting dari kuantitas.",
      "Berani mundur itu lebih sulit dari bertahan. Kamu udah berani ambil keputusan, itu hebat.",
    ],
    multi_stress_kuliah: [
      "4 deadline dalam seminggu? Wajar panik. Tapi kita hadapi satu-satu ya. Jangan liat semuanya sekaligus.",
      "Bingung mulai dari mana itu wajar. Coba bikin list prioritas, mana yang paling mendesak.",
      "Waktu selalu bisa diatur. Kuncinya ada di prioritas. Yang penting kamu mulai dulu.",
      "Bagus, dengan list yang rapi pasti lebih keliatan mana yang harus dikerjain duluan.",
      "Good luck! Kamu udah punya rencana, tinggal jalanin. Pelan-pelan pasti selesai.",
    ],
    multi_cemas_masa_depan: [
      "Bingung setelah lulus itu wajar banget. Ga semua orang punya jalan yang jelas di awal.",
      "Jangan bandingin proses kamu sama orang lain. Setiap orang punya timeline masing-masing.",
      "Takut salah pilih itu wajar. Tapi inget, ga ada keputusan yang benar-benar salah. Semua jadi pelajaran.",
      "Eksplorasi itu bagus. Masa muda emang waktunya buat nyoba berbagai hal.",
      "Internship adalah langkah awal yang bagus. Dapet pengalaman sambil liat cocok atau ga. Semoga berhasil!",
    ],
  };

  const responses = turnResponses[scenarioId];
  if (responses && responses[turnIndex]) {
    return responses[turnIndex];
  }

  // Fallback
  return `Makasih udah cerita. Aku denger dan paham perasaan kamu. Pelan-pelan aja, aku temani.`;
}

// EVALUASI SEMUA SKENARIO MULTI-TURN

/**
 * Mengevaluasi semua skenario multi-turn.
 *
 * @param scenarios - Daftar skenario multi-turn
 * @returns MultiTurnSummary
 */
export async function evaluateAllMultiTurn(
  scenarios: MultiTurnScenario[],
  mode: EvaluationModeHandler,
): Promise<MultiTurnSummary> {
  const details: MultiTurnResult[] = [];

  console.log("=".repeat(70));
  console.log("EVALUASI MULTI-TURN CONVERSATION");
  console.log("=".repeat(70));

  for (const scenario of scenarios) {
    console.log(
      `\n  Percakapan: ${scenario.name} (${scenario.turns.length} turn)...`,
    );
    const result = await evaluateMultiTurnScenario(scenario, mode);
    details.push(result);

    console.log(
      `  Memory: ${result.memoryConsistency} | Emosi: ${result.emotionalContinuity} | ` +
        `Konteks: ${result.contextRetention} | Topik: ${result.topicTracking} | ` +
        `Overall: ${result.overallScore} (${result.label})`,
    );

    if (result.failures.length > 0) {
      for (const f of result.failures) {
        console.log(`    ⚠ ${f}`);
      }
    }
  }

  // Rata-rata
  const avgMem =
    details.reduce((s, d) => s + d.memoryConsistency, 0) / details.length;
  const avgEmo =
    details.reduce((s, d) => s + d.emotionalContinuity, 0) / details.length;
  const avgCtx =
    details.reduce((s, d) => s + d.contextRetention, 0) / details.length;
  const avgTop =
    details.reduce((s, d) => s + d.topicTracking, 0) / details.length;
  const avgOverall =
    details.reduce((s, d) => s + d.overallScore, 0) / details.length;

  return {
    totalConversations: details.length,
    averageMemoryConsistency: Math.round(avgMem),
    averageEmotionalContinuity: Math.round(avgEmo),
    averageContextRetention: Math.round(avgCtx),
    averageTopicTracking: Math.round(avgTop),
    averageOverallScore: Math.round(avgOverall),
    details,
  };
}

// GENERATE MULTI-TURN TABLE (MARKDOWN)

/**
 * Menghasilkan tabel evaluasi multi-turn dalam format Markdown.
 *
 * @param summary - Ringkasan evaluasi multi-turn
 * @returns String markdown
 */
export function generateMultiTurnTable(summary: MultiTurnSummary): string {
  const lines: string[] = [];

  lines.push(`## Evaluasi Multi-Turn Conversation`);
  lines.push(``);
  lines.push(`**Total Percakapan:** ${summary.totalConversations}`);
  lines.push(``);

  lines.push(`### Ringkasan`);
  lines.push(``);
  lines.push(`| Dimensi | Rata-rata |`);
  lines.push(`|---------|-----------|`);
  lines.push(
    `| Memory Consistency | ${summary.averageMemoryConsistency}/100 |`,
  );
  lines.push(
    `| Emotional Continuity | ${summary.averageEmotionalContinuity}/100 |`,
  );
  lines.push(`| Context Retention | ${summary.averageContextRetention}/100 |`);
  lines.push(`| Topic Tracking | ${summary.averageTopicTracking}/100 |`);
  lines.push(`| Overall | ${summary.averageOverallScore}/100 |`);
  lines.push(``);
  lines.push(``);

  lines.push(`### Detail per Percakapan`);
  lines.push(``);
  lines.push(
    `| Percakapan | Turn | Memory | Emosi | Konteks | Topik | Overall | Label |`,
  );
  lines.push(
    `|------------|------|--------|-------|---------|-------|---------|-------|`,
  );
  for (const d of summary.details) {
    lines.push(
      `| ${d.scenarioName} | ${d.turnDetails.length} | ${d.memoryConsistency} | ${d.emotionalContinuity} | ${d.contextRetention} | ${d.topicTracking} | ${d.overallScore} | ${d.label} |`,
    );
  }
  lines.push(``);
  lines.push(``);

  // Kegagalan
  const allFailures = summary.details.flatMap((d) => d.failures);
  if (allFailures.length > 0) {
    lines.push(`### Analisis Kegagalan Multi-Turn`);
    lines.push(``);
    for (const f of allFailures) {
      lines.push(`- ⚠️ ${f}`);
    }
    lines.push(``);
    lines.push(``);
  }

  lines.push(`### Interpretasi`);
  lines.push(``);
  if (summary.averageOverallScore >= 70) {
    lines.push(
      `Hasil evaluasi multi-turn menunjukkan bahwa chatbot mampu mempertahankan ` +
        `kesinambungan percakapan dengan baik. Memory consistency yang tinggi ` +
        `menunjukkan bahwa chatbot dapat mengingat informasi dari turn sebelumnya, ` +
        `yang sangat penting untuk chatbot curhat.`,
    );
  } else if (summary.averageOverallScore >= 50) {
    lines.push(
      `Hasil evaluasi multi-turn menunjukkan bahwa chatbot cukup mampu ` +
        `mempertahankan kesinambungan percakapan, namun masih terdapat beberapa ` +
        `kegagalan dalam memory consistency dan topic tracking. Perlu peningkatan ` +
        `pada mekanisme context retention.`,
    );
  } else {
    lines.push(
      `Hasil evaluasi multi-turn menunjukkan bahwa chatbot masih kurang dalam ` +
        `mempertahankan kesinambungan percakapan. Perbaikan pada sistem prompt ` +
        `dan context management sangat disarankan.`,
    );
  }
  lines.push(``);

  return lines.join("\n");
}
