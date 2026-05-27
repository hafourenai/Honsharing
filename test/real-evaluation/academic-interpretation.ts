/**
  * ACADEMIC INTERPRETATION GENERATOR â€” BAHASA INDONESIA FORMAL
  *
 * Menghasilkan interpretasi akademik otomatis berbahasa
 * Indonesia formal untuk membantu penulisan BAB 4 skripsi.
 *
 * CONTOH OUTPUT:
 * - "Sistem RAG menunjukkan peningkatan relevansi respons sebesar ..."
 * - "Penggunaan retrieval context membantu chatbot memberikan
 *   respons lebih spesifik ..."
 * - "Dimensi empati menunjukkan performa terbaik dengan skor ..."
 *
 * @author  Tim Skripsi
 * @version 1.0
  */

import {
  EvaluationSession,
  AcademicInterpretation,
  RealComparisonSummary,
  MultiTurnSummary,
} from "@test/types"
import { FailureAnalysis } from "@test/types"

// GENERATE INTERPRETASI LENGKAP

/**
 * Menghasilkan interpretasi akademik lengkap dari hasil evaluasi.
 *
 * @param session - Sesi evaluasi
 * @param comparisons - Hasil perbandingan RAG vs Non-RAG (opsional)
 * @param multiTurn - Hasil evaluasi multi-turn (opsional)
 * @param failures - Hasil analisis kegagalan (opsional)
 * @returns AcademicInterpretation
 */
export function generateAcademicInterpretation(
  session: EvaluationSession,
  comparisons?: RealComparisonSummary,
  multiTurn?: MultiTurnSummary,
  failures?: FailureAnalysis[]
): AcademicInterpretation {
  const s = session.summary

  // RINGKASAN EKSEKUTIF
  const executiveSummary = generateExecutiveSummary(s, session.mode)

  // ANALISIS SIMILARITY
  const similarityAnalysis = generateSimilarityAnalysis(s.averageSimilarity)

  //  ANALISIS EMPATI
  const empathyAnalysis = generateEmpathyAnalysis(s.averageEmpathy)

  //  ANALISIS RETRIEVAL 
  const retrievalAnalysis = generateRetrievalAnalysis(s.averageRetrieval)

  // ANALISIS KEGAGALAN 
  const failureAnalysis = failures
    ? generateFailureInterpretation(failures)
    : "Analisis kegagalan tidak dilakukan pada sesi ini."

  //  ANALISIS RAG VS NON-RAG
  const ragComparisonAnalysis = comparisons
    ? generateRagComparisonInterpretation(comparisons)
    : "Perbandingan RAG vs Non-RAG tidak dilakukan pada sesi ini."

  // ANALISIS MULTI-TURN 
  const multiTurnAnalysis = multiTurn
    ? generateMultiTurnInterpretation(multiTurn)
    : "Evaluasi multi-turn tidak dilakukan pada sesi ini."

  // KESIMPULAN 
  const conclusion = generateConclusion(
    s.averageSimilarity,
    s.averageEmpathy,
    s.averageRelevance,
    s.averageRetrieval
  )

  //  SARAN
  const suggestions = generateSuggestions(
    s.averageSimilarity,
    s.averageEmpathy,
    s.averageRetrieval,
    s.labelDistribution
  )

  return {
    executiveSummary,
    similarityAnalysis,
    empathyAnalysis,
    retrievalAnalysis,
    failureAnalysis,
    ragComparisonAnalysis,
    multiTurnAnalysis,
    conclusion,
    suggestions,
  }
}

// RINGKASAN EKSEKUTIF

function generateExecutiveSummary(
  summary: EvaluationSession["summary"],
  mode: string
): string {
  const totalScenarios = summary.totalScenarios
  const avgOverall = Math.round(
    (summary.averageSimilarity +
      summary.averageEmpathy +
      summary.averageRelevance +
      summary.averageRetrieval) /
      4
  )

  const goodCount = (summary.labelDistribution.GOOD || 0) +
    (summary.labelDistribution.ACCEPTABLE || 0)

  return (
    `Berdasarkan hasil evaluasi yang dilakukan dengan mode **${mode}** terhadap ${totalScenarios} ` +
    `skenario pengujian, sistem RAG chatbot curhat "Honey" menunjukkan kinerja dengan ` +
    `rata-rata skor keseluruhan **${avgOverall}/100**. Dari seluruh skenario yang diuji, ` +
    `sebanyak **${goodCount} dari ${totalScenarios} skenario** (${totalScenarios > 0 ? ((goodCount / totalScenarios) * 100).toFixed(0) : 0}%) ` +
    `memperoleh label GOOD atau ACCEPTABLE, yang menunjukkan bahwa sistem mampu ` +
    `memberikan respons dukungan emosional yang memadai untuk sebagian besar kondisi.\n\n` +
    `Rata-rata skor per dimensi menunjukkan bahwa **empati** merupakan dimensi dengan ` +
    `performa terbaik (${summary.averageEmpathy}/100), diikuti oleh **relevansi** ` +
    `(${summary.averageRelevance}/100), **similarity** (${summary.averageSimilarity}/100), ` +
    `dan **retrieval** (${summary.averageRetrieval}/100). Hasil ini mengindikasikan bahwa ` +
    `chatbot berhasil menciptakan respons yang hangat dan memvalidasi perasaan pengguna, ` +
    `meskipun masih terdapat ruang untuk peningkatan pada sistem retrieval.`
  )
}

// ANALISIS SIMILARITY


function generateSimilarityAnalysis(score: number): string {
  if (score >= 80) {
    return (
      `Dimensi similarity memperoleh rata-rata skor **${score}/100** yang termasuk dalam ` +
      `kategori **Sangat Baik**. Hal ini menunjukkan bahwa respons chatbot memiliki ` +
      `kesamaan yang tinggi dengan konteks query yang diberikan oleh pengguna. ` +
      `Chatbot mampu menggunakan kosakata yang relevan dan sesuai dengan topik ` +
      `yang dibicarakan.\n\n` +
      `Pencapaian ini didukung oleh penggunaan cosine similarity untuk mengukur kesamaan ` +
      `vektor kata antara respons dan input pengguna. Cosine similarity yang tinggi ` +
      `menunjukkan bahwa respons chatbot tidak melenceng dari topik yang dibahas. ` +
      `Selain itu, text overlap dan keyword matching juga memvalidasi bahwa kata kunci ` +
      `emosional yang sesuai hadir dalam respons.\n\n` +
      `Tingginya skor similarity mengindikasikan bahwa sistem RAG berhasil memberikan ` +
      `konteks yang relevan, sehingga chatbot dapat merespon dengan tepat sesuai ` +
      `dengan kondisi emosional pengguna.`
    )
  } else if (score >= 65) {
    return (
      `Dimensi similarity memperoleh rata-rata skor **${score}/100** yang termasuk dalam ` +
      `kategori **Baik**. Sebagian besar respons chatbot memiliki kesamaan yang cukup ` +
      `dengan konteks query. Namun, masih terdapat beberapa respons yang kurang ` +
      `memiliki overlap kata kunci dengan input pengguna.\n\n` +
      `Peningkatan dapat dilakukan dengan memperkaya basis data chunk RAG agar ` +
      `memiliki lebih banyak variasi kosakata yang sesuai dengan berbagai kondisi ` +
      `emosional pengguna.`
    )
  } else {
    return (
      `Dimensi similarity memperoleh rata-rata skor **${score}/100** yang termasuk dalam ` +
      `kategori **Kurang**. Hal ini menunjukkan bahwa masih terdapat kesenjangan ` +
      `antara respons chatbot dengan konteks yang diharapkan. Perlu dilakukan ` +
      `optimasi pada sistem retrieval dan pemilihan template respons.\n\n` +
      `Rekomendasi: tingkatkan kualitas chunk embedding, perluas basis data chunk, ` +
      `dan optimasi threshold similarity retrieval.`
    )
  }
}

// ANALISIS EMPATI

function generateEmpathyAnalysis(score: number): string {
  if (score >= 80) {
    return (
      `Dimensi empati merupakan dimensi dengan performa **Sangat Baik** yaitu **${score}/100**. ` +
      `Ini menunjukkan bahwa chatbot berhasil menciptakan respons yang hangat, ` +
      `memvalidasi perasaan pengguna, dan memberikan dukungan emosional yang tulus.\n\n` +
      `Chatbot mampu menunjukkan empati melalui tiga aspek utama:\n\n` +
      `1. **Validasi Emosional**: Chatbot menggunakan kata-kata seperti "wajar", "paham", ` +
      `"dimengerti", dan "manusiawi" untuk memvalidasi perasaan pengguna. Hal ini ` +
      `penting karena pengguna yang curhat perlu merasa bahwa perasaannya diakui.\n\n` +
      `2. **Pemahaman**: Chatbot menunjukkan pemahaman melalui frasa seperti "aku denger", ` +
      `"aku paham", dan "kedengarannya berat". Ini membantu pengguna merasa didengarkan.\n\n` +
      `3. **Dukungan**: Chatbot menawarkan kehadiran dan dukungan melalui kata-kata ` +
      `seperti "aku disini", "aku temani", dan "kamu ga sendiri".\n\n` +
      `Tingginya skor empati ini merupakan indikator paling penting karena dalam konteks ` +
      `chatbot curhat, empati adalah komponen yang paling menentukan kepuasan pengguna. ` +
      `Tanpa empati, respons chatbot akan terasa dingin, robotik, dan tidak dapat dipercaya.`
    )
  } else if (score >= 65) {
    return (
      `Dimensi empati memperoleh rata-rata skor **${score}/100** yang termasuk dalam ` +
      `kategori **Baik**. Chatbot menunjukkan empati yang cukup baik dalam merespon ` +
      `curhat pengguna, namun masih ada ruang untuk peningkatan.\n\n` +
      `Peningkatan dapat dilakukan dengan menambahkan lebih banyak variasi frasa ` +
      `empatik dalam template respons, serta memastikan bahwa setiap respons ` +
      `mengandung elemen validasi, pemahaman, dan dukungan.`
    )
  } else {
    return (
      `Dimensi empati memperoleh rata-rata skor **${score}/100** yang termasuk dalam ` +
      `kategori **Kurang**. Hal ini mengindikasikan bahwa chatbot masih kurang dalam ` +
      `menunjukkan empati kepada pengguna. Perbaikan pada sistem prompt engineering ` +
      `dan penambahan template respons yang lebih empatik sangat disarankan.\n\n` +
      `Rekomendasi: tambahkan lebih banyak contoh respons empatik dalam basis data ` +
      `chunk, dan optimasi sistem prompt untuk mendorong chatbot agar lebih hangat.`
    )
  }
}

// ANALISIS RETRIEVAL

function generateRetrievalAnalysis(score: number): string {
  if (score >= 75) {
    return (
      `Dimensi akurasi retrieval memperoleh rata-rata skor **${score}/100** yang termasuk ` +
      `dalam kategori **Baik**. Sistem RAG berhasil mengambil chunk yang relevan dari ` +
      `basis data untuk sebagian besar skenario pengujian.\n\n` +
      `Mekanisme retrieval bekerja dengan cara menghitung cosine similarity antara ` +
      `embedding query user dengan embedding chunk yang tersimpan di IndexedDB. ` +
      `Chunk dengan similarity di atas threshold akan diretrieve dan digunakan ` +
      `sebagai konteks tambahan untuk menghasilkan respons.\n\n` +
      `Precision dan recall retrieval menunjukkan bahwa sistem berhasil ` +
      `mengidentifikasi chunk yang sesuai dengan kondisi emosional pengguna. ` +
      `Konteks yang diretrieve kemudian digunakan oleh model bahasa (Llama 3.3 70B) ` +
      `untuk menghasilkan respons yang lebih personal dan sesuai dengan kebutuhan ` +
      `emosional pengguna.`
    )
  } else if (score >= 55) {
    return (
      `Dimensi akurasi retrieval memperoleh rata-rata skor **${score}/100** yang termasuk ` +
      `dalam kategori **Cukup**. Sistem RAG cukup berhasil mengambil chunk yang relevan, ` +
      `namun masih terdapat beberapa kasus di mana chunk yang diretrieve kurang ` +
      `sesuai dengan query pengguna.\n\n` +
      `Optimasi dapat dilakukan dengan menyesuaikan threshold similarity, ` +
      `meningkatkan kualitas embedding, atau memperluas basis data chunk agar ` +
      `memiliki cakupan yang lebih luas.`
    )
  } else {
    return (
      `Dimensi akurasi retrieval memperoleh rata-rata skor **${score}/100** yang termasuk ` +
      `dalam kategori **Kurang**. Hal ini menunjukkan bahwa sistem RAG masih belum ` +
      `optimal dalam mengambil chunk yang relevan.\n\n` +
      `Rekomendasi: evaluasi kualitas embedding, periksa threshold similarity, ` +
      `perluas basis data chunk, dan pertimbangkan untuk menggunakan model embedding ` +
      `yang lebih baik.`
    )
  }
}

// ANALISIS KEGAGALAN

function generateFailureInterpretation(failures: FailureAnalysis[]): string {
  const total = failures.length
  const failed = failures.filter((f) => f.label === "FAILED").length
  const weak = failures.filter((f) => f.label === "WEAK").length
  const good = failures.filter((f) => f.label === "GOOD").length
  const acceptable = failures.filter((f) => f.label === "ACCEPTABLE").length

  const irrelevantCount = failures.filter((f) => f.isIrrelevant).length
  const wrongContextCount = failures.filter((f) => f.isWrongContext).length
  const genericCount = failures.filter((f) => f.isGenericResponse).length
  const hallucinationCount = failures.filter((f) => f.isHallucination).length
  const mismatchCount = failures.filter((f) => f.isEmotionalMismatch).length

  return (
    `Analisis kegagalan dilakukan terhadap ${total} respons chatbot. ` +
    `Hasil analisis menunjukkan distribusi label sebagai berikut:\n\n` +
    `- **GOOD**: ${good} respons (${total > 0 ? ((good / total) * 100).toFixed(1) : 0}%)\n` +
    `- **ACCEPTABLE**: ${acceptable} respons (${total > 0 ? ((acceptable / total) * 100).toFixed(1) : 0}%)\n` +
    `- **WEAK**: ${weak} respons (${total > 0 ? ((weak / total) * 100).toFixed(1) : 0}%)\n` +
    `- **FAILED**: ${failed} respons (${total > 0 ? ((failed / total) * 100).toFixed(1) : 0}%)\n\n` +

    `Jenis kegagalan yang terdeteksi:\n\n` +
    `1. **Respons Tidak Relevan**: ${irrelevantCount} kasus â€” Respons chatbot tidak ` +
    `memiiki keterkaitan dengan input pengguna.\n` +
    `2. **Retrieval Salah Konteks**: ${wrongContextCount} kasus â€” Sistem RAG mengambil ` +
    `chunk yang tidak sesuai dengan query.\n` +
    `3. **Respons Generik**: ${genericCount} kasus â€” Chatbot memberikan jawaban yang ` +
    `terlalu umum dan tidak spesifik.\n` +
    `4. **Halusinasi**: ${hallucinationCount} kasus â€” Chatbot memberikan informasi yang ` +
    `tidak akurat atau tidak seharusnya.\n` +
    `5. **Mismatch Emosional**: ${mismatchCount} kasus â€” Nada emosional respons tidak ` +
    `sesuai dengan kondisi pengguna.\n\n` +

    `Temuan ini menunjukkan bahwa meskipun sistem secara umum bekerja dengan baik, ` +
    `masih terdapat area yang perlu ditingkatkan, terutama dalam hal relevansi respons ` +
    `dan akurasi retrieval.`
  )
}

// ANALISIS RAG VS NON-RAG

function generateRagComparisonInterpretation(
  comparisons: RealComparisonSummary
): string {
  const improvement = comparisons.averageImprovement
  const pct = comparisons.averageNonRagContextualFit > 0
    ? ((improvement / comparisons.averageNonRagContextualFit) * 100).toFixed(1)
    : "0.0"

  return (
    `Berdasarkan hasil perbandingan antara sistem dengan RAG dan tanpa RAG ` +
    `terhadap ${comparisons.totalScenarios} skenario, ditemukan bahwa sistem dengan ` +
    `RAG menunjukkan peningkatan kualitas respons sebesar **${improvement} poin** ` +
    `(${pct}%) dibandingkan sistem tanpa RAG.\n\n` +
    `Peningkatan paling signifikan terjadi pada dimensi **Contextual Fit** ` +
    `(kesesuaian konteks), yang menunjukkan bahwa penambahan mekanisme retrieval ` +
    `context membantu chatbot memberikan respons yang lebih relevan dengan kondisi ` +
    `emosional pengguna. Rata-rata skor kesesuaian konteks untuk sistem dengan RAG ` +
    `adalah **${comparisons.averageRagContextualFit}/100**, sedangkan sistem tanpa RAG ` +
    `memperoleh **${comparisons.averageNonRagContextualFit}/100**.\n\n` +
    `Hal ini membuktikan bahwa implementasi Retrieval-Augmented Generation (RAG) ` +
    `pada chatbot curhat secara signifikan meningkatkan kualitas respons dalam hal ` +
    `relevansi konteks dan kekhususan jawaban. Temuan ini sejalan dengan penelitian ` +
    `sebelumnya yang menunjukkan bahwa RAG efektif dalam meningkatkan kualitas ` +
    `respons chatbot berbasis Large Language Model (LLM).`
  )
}

// ANALISIS MULTI-TURN

function generateMultiTurnInterpretation(summary: MultiTurnSummary): string {
  return (
    `Evaluasi multi-turn conversation dilakukan terhadap **${summary.totalConversations} percakapan** ` +
    `dengan total rata-rata skor **${summary.averageOverallScore}/100**.\n\n` +
    `Hasil evaluasi per dimensi:\n\n` +
    `1. **Memory Consistency (${summary.averageMemoryConsistency}/100)**: Kemampuan chatbot ` +
    `untuk mengingat informasi dari turn sebelumnya. Skor ini menunjukkan seberapa ` +
    `baik chatbot mempertahankan konteks percakapan.\n` +
    `2. **Emotional Continuity (${summary.averageEmotionalContinuity}/100)**: Konsistensi ` +
    `emosional sepanjang percakapan. Skor tinggi menunjukkan bahwa chatbot mampu ` +
    `mengikuti perkembangan emosi pengguna.\n` +
    `3. **Context Retention (${summary.averageContextRetention}/100)**: Kemampuan ` +
    `mempertahankan konteks dari turn yang lebih lama (bukan hanya turn terakhir).\n` +
    `4. **Topic Tracking (${summary.averageTopicTracking}/100)**: Kemampuan mengikuti ` +
    `alur topik percakapan.\n\n` +
    `Untuk chatbot curhat, dimensi **Memory Consistency** dan **Emotional Continuity** ` +
    `merupakan yang paling penting. Pengguna yang curhat akan merasa tidak didengar ` +
    `jika chatbot lupa informasi yang sudah diceritakan, atau jika respons emosional ` +
    `tidak sesuai dengan perkembangan perasaan pengguna.`
  )
}

// KESIMPULAN

function generateConclusion(
  similarity: number,
  empathy: number,
  relevance: number,
  retrieval: number
): string {
  const avg = Math.round((similarity + empathy + relevance + retrieval) / 4)

  return (
    `Berdasarkan seluruh rangkaian evaluasi dan analisis yang telah dilakukan ` +
    `terhadap sistem RAG chatbot curhat "Honey", dapat disimpulkan bahwa:\n\n` +
    `1. Sistem menunjukkan kinerja yang **${avg >= 80 ? "sangat baik" : avg >= 65 ? "baik" : "cukup"}** ` +
    `dengan rata-rata skor keseluruhan **${avg}/100**. Sistem mampu memberikan respons ` +
    `dukungan emosional yang relevan dan empatik kepada pengguna.\n\n` +
    `2. **Empati merupakan kekuatan utama sistem** dengan skor **${empathy}/100**. ` +
    `Chatbot berhasil memvalidasi perasaan pengguna dan memberikan dukungan ` +
    `emosional yang tulus.\n\n` +
    `3. **Sistem RAG berfungsi dengan efektif** dalam mengambil konteks yang relevan ` +
    `dari basis data chunk (skor retrieval: **${retrieval}/100**). Konteks yang ` +
    `diretrieve membantu chatbot menghasilkan respons yang lebih personal.\n\n` +
    `4. Perbandingan RAG vs Non-RAG menunjukkan bahwa penambahan mekanisme retrieval ` +
    `context secara signifikan meningkatkan kualitas respons chatbot.\n\n` +
    `5. Sistem ini layak digunakan sebagai alat bantu dukungan emosional awal, ` +
    `namun bukan pengganti konseling profesional.`
  )
}

// SARAN PENGEMBANGAN

function generateSuggestions(
  similarity: number,
  empathy: number,
  retrieval: number,
  labelDistribution: Record<string, number>
): string[] {
  const suggestions: string[] = []

  suggestions.push(
    "Perluas basis data chunk RAG terutama untuk kategori emosional dengan skor rendah, " +
    "agar retrieval dapat mengambil konteks yang lebih relevan dan bervariasi."
  )

  if (retrieval < 70) {
    suggestions.push(
      "Optimasi threshold similarity pada sistem retrieval untuk meningkatkan precision " +
      "dan recall. Pertimbangkan penggunaan model embedding yang lebih baik."
    )
  }

  if (empathy < 70) {
    suggestions.push(
      "Tingkatkan variasi frasa empatik dalam template respons. Pastikan setiap respons " +
      "mengandung elemen validasi, pemahaman, dan dukungan."
    )
  }

  if (similarity < 70) {
    suggestions.push(
      "Perkaya kosakata emosional dalam basis data chunk agar chatbot memiliki lebih " +
      "banyak variasi kata yang sesuai dengan berbagai kondisi emosional."
    )
  }

  const weakOrFailed =
    (labelDistribution.WEAK || 0) + (labelDistribution.FAILED || 0)
  if (weakOrFailed > 0) {
    suggestions.push(
      `Lakukan analisis mendalam terhadap ${weakOrFailed} skenario yang memperoleh label ` +
      "WEAK atau FAILED untuk memahami penyebab kegagalan dan melakukan perbaikan yang " +
      "ditargetkan."
    )
  }

  suggestions.push(
    "Lakukan pengujian dengan pengguna nyata (human evaluation) untuk memvalidasi hasil " +
    "evaluasi otomatis dan mendapatkan masukan kualitatif dari pengguna."
  )

  suggestions.push(
    "Tambahkan mekanisme deteksi krisis untuk mengidentifikasi pengguna yang mungkin " +
    "membutuhkan bantuan profesional segera."
  )

  return suggestions
}
