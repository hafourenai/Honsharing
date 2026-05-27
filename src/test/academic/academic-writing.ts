/**
 * ============================================================
 * ACADEMIC WRITING GENERATOR — NARASI FORMAL OTOMATIS
 * ============================================================
 *
 * Utility untuk menghasilkan narasi akademik formal berbahasa
 * Indonesia yang natural dan siap digunakan dalam skripsi S1.
 *
 * Mencakup:
 * - Interpretasi tabel hasil
 * - Analisis skor
 * - Penjelasan peningkatan performa
 * - Kesimpulan pengujian
 *
 * @author  Tim Skripsi
 * @version 1.0
 * ============================================================
 */

import {
  ResearchStats,
  CategoryStats,
} from "./research-statistics"

// ================================================================
// INTERPRETASI TABEL HASIL
// ================================================================

/**
 * Menghasilkan narasi interpretasi untuk tabel hasil pengujian.
 * Cocok ditempatkan setelah tabel di BAB 4.
 */
export function interpretTabelHasil(
  dimensi: string,
  skor: number,
  kategori: string
): string {
  const kualitas = kategorikan(skor)
  const prefix = kalimatPembuka(dimensi, skor)

  return (
    `${prefix} Tabel di atas menunjukkan bahwa rata-rata skor ${dimensi.toLowerCase()} ` +
    `yang diperoleh sistem adalah **${skor}/100**, yang termasuk dalam kategori ` +
    `**${kualitas}**. Hasil ini mengindikasikan bahwa chatbot mampu memberikan respons ` +
    `dengan tingkat ${dimensi.toLowerCase()} yang ${kualitas.toLowerCase()} ` +
    `terhadap input emosional pengguna.\n\n` +
    `Kategori "${kategori}" dipilih karena mencakup berbagai variasi kondisi emosional ` +
    `yang relevan dengan konteks curhat mahasiswa. Dengan demikian, hasil ini dapat ` +
    `menjadi indikator awal yang cukup representatif untuk menilai kualitas sistem ` +
    `secara keseluruhan.`
  )
}

/**
 * Interpretasi perbandingan antara dua skor.
 */
export function interpretPeningkatan(
  dimensi: string,
  skorAwal: number,
  skorAkhir: number
): string {
  const selisih = skorAkhir - skorAwal
  const arah = selisih >= 0 ? "meningkat" : "menurun"
  const signifikansi = Math.abs(selisih) >= 15 ? "signifikan" : "moderat"

  if (selisih >= 0) {
    return (
      `Berdasarkan hasil pengujian, terjadi peningkatan sebesar **${selisih} poin** ` +
      `pada dimensi **${dimensi}** setelah penerapan mekanisme Retrieval-Augmented ` +
      `Generation (RAG). Peningkatan yang ${signifikansi} ini menunjukkan bahwa ` +
      `penambahan konteks retrieval berkontribusi positif terhadap kualitas respons ` +
      `chatbot dalam hal ${dimensi.toLowerCase()}.\n\n` +
      `Skor awal sebelum penerapan RAG adalah **${skorAwal}/100**, sedangkan setelah ` +
      `penerapan RAG meningkat menjadi **${skorAkhir}/100**. Temuan ini konsisten ` +
      `dengan penelitian sebelumnya yang menyatakan bahwa RAG dapat meningkatkan ` +
      `relevansi dan kontekstualitas respons pada sistem conversational AI.`
    )
  }

  return (
    `Pada dimensi **${dimensi}**, terjadi penurunan skor sebesar **${Math.abs(selisih)} poin** ` +
    `setelah penerapan RAG. Skor awal adalah **${skorAwal}/100** dan skor akhir ` +
    `adalah **${skorAkhir}/100**. Penurunan ini perlu menjadi perhatian dan bahan ` +
    `evaluasi lebih lanjut. Kemungkinan penyebabnya adalah adanya noise dari ` +
    `retrieval context yang kurang relevan, atau adanya informasi yang bertentangan ` +
    `dengan konteks emosional pengguna.`
  )
}

// ================================================================
// ANALISIS SKOR
// ================================================================

/**
 * Menghasilkan analisis akademik untuk rata-rata skor per dimensi.
 */
export function analisisSkorDimensi(
  stats: ResearchStats
): string {
  const { similarity, empathy, relevance, retrieval, overall } = stats.averageScores

  return (
    `Berdasarkan hasil evaluasi terhadap **${stats.totalScenarios} skenario pengujian**, ` +
    `sistem RAG chatbot curhat menunjukkan kinerja dengan rata-rata skor keseluruhan ` +
    `**${overall}/100**.\n\n` +

    `**Hasil per dimensi:**\n\n` +
    `1. **Similarity (${similarity}/100)** — ${kategorikan(similarity)}: ` +
    `Dimensi ini mengukur kesamaan antara respons chatbot dengan input pengguna. ` +
    `Skor ${similarity >= 70 ? "yang baik" : "yang perlu ditingkatkan"} ini ` +
    `${similarity >= 70 ? "menunjukkan bahwa" : "mengindikasikan perlunya"} ` +
    `chatbot mampu menggunakan kosakata yang relevan dengan topik pembicaraan.\n\n` +
    `2. **Empati (${empathy}/100)** — ${kategorikan(empathy)}: ` +
    `Dimensi ini merupakan aspek terpenting dalam chatbot curhat. Skor ini ` +
    `${empathy >= 70 ? "menunjukkan bahwa chatbot cukup empatik dalam merespon" : "mengindikasikan bahwa masih perlu peningkatan dalam aspek empati"} ` +
    `kondisi emosional pengguna.\n\n` +
    `3. **Relevansi (${relevance}/100)** — ${kategorikan(relevance)}: ` +
    `Mengukur kesesuaian respons dengan konteks percakapan. Skor ini ` +
    `${relevance >= 70 ? "menunjukkan bahwa respons chatbot relevan" : "menunjukkan bahwa masih ada respons yang kurang relevan"} ` +
    `terhadap input pengguna.\n\n` +
    `4. **Retrieval (${retrieval}/100)** — ${kategorikan(retrieval)}: ` +
    `Mengukur seberapa baik sistem mengambil chunk yang relevan. Ini adalah ` +
    `dimensi kunci karena menentukan kualitas konteks yang diberikan ke LLM.`
  )
}

/**
 * Analisis distribusi label kualitas.
 */
export function analisisDistribusiLabel(
  dist: Record<string, number>
): string {
  const total = Object.values(dist).reduce((a, b) => a + b, 0)
  const good = (dist.GOOD || 0) + (dist.ACCEPTABLE || 0)
  const weak = (dist.WEAK || 0) + (dist.FAILED || 0)
  const goodPct = total > 0 ? ((good / total) * 100).toFixed(1) : "0.0"
  const weakPct = total > 0 ? ((weak / total) * 100).toFixed(1) : "0.0"

  return (
    `Distribusi label kualitas menunjukkan bahwa **${goodPct}%** dari seluruh respons ` +
    `(${good} dari ${total}) berada dalam kategori **GOOD** atau **ACCEPTABLE**, yang berarti ` +
    `sistem berfungsi dengan baik pada sebagian besar skenario. Sementara **${weakPct}%** ` +
    `respons (${weak} dari ${total}) berada dalam kategori **WEAK** atau **FAILED** yang ` +
    `memerlukan perbaikan lebih lanjut.\n\n` +
    `Hasil ini menunjukkan bahwa meskipun sistem secara umum mampu memberikan respons ` +
    `yang memadai, masih terdapat ruang untuk peningkatan, terutama pada skenario ` +
    `dengan tingkat kesulitan tinggi atau kondisi emosional yang kompleks.`
  )
}

/**
 * Analisis performa per kategori.
 */
export function analisisPerKategori(categories: CategoryStats[]): string {
  const parts: string[] = [
    "Analisis performa sistem berdasarkan kategori emosional menunjukkan variasi " +
    "hasil yang cukup beragam. Berikut adalah rincian performa per kategori:",
  ]

  for (const c of categories) {
    const goodCount = (c.distribution.GOOD || 0) + (c.distribution.ACCEPTABLE || 0)
    parts.push(
      `\n**${c.category}** (${c.count} skenario):\n` +
      `Rata-rata skor **${c.avgOverall}/100** dengan ${goodCount} dari ${c.count} ` +
      `respons dalam kategori baik. Similarity: ${c.avgSimilarity}, Empati: ${c.avgEmpathy}, ` +
      `Relevansi: ${c.avgRelevance}, Retrieval: ${c.avgRetrieval}.`
    )
  }

  parts.push(
    "\n\nVariasi performa antar kategori ini dapat disebabkan oleh perbedaan " +
    "kompleksitas kondisi emosional pada masing-masing kategori. Kategori dengan " +
    "skor lebih tinggi cenderung memiliki pola emosional yang lebih umum dan " +
    "memiliki lebih banyak chunk relevan di basis data retrieval."
  )

  return parts.join("")
}

// ================================================================
// KESIMPULAN PENGUJIAN
// ================================================================

export function kesimpulanPengujian(
  stats: ResearchStats,
  ragImprovement?: number
): string {
  const s = stats.averageScores
  const parts: string[] = [
    "Berdasarkan serangkaian pengujian yang telah dilakukan, dapat ditarik " +
    "beberapa kesimpulan sebagai berikut:\n\n" +
    `1. **Kinerja Umum**: Sistem RAG chatbot curhat menunjukkan kinerja ` +
    `${s.overall >= 75 ? "yang baik" : s.overall >= 60 ? "yang cukup baik" : "yang perlu ditingkatkan"} ` +
    `dengan rata-rata skor **${s.overall}/100** dari **${stats.totalScenarios} skenario** ` +
    `pengujian. Success rate sistem mencapai **${stats.successRate}%**.\n\n` +
    `2. **Kekuatan Sistem**: Dimensi **${s.empathy >= s.similarity && s.empathy >= s.relevance ? "Empati" : s.similarity >= s.empathy && s.similarity >= s.relevance ? "Similarity" : "Relevansi"}** ` +
    `menjadi kekuatan utama sistem dengan skor **${Math.max(s.empathy, s.similarity, s.relevance)}/100**, ` +
    `menunjukkan bahwa chatbot mampu ${Math.max(s.empathy, s.similarity, s.relevance) === s.empathy ? "memberikan dukungan emosional yang hangat" : "menghasilkan respons yang relevan"}.\n\n` +
    `3. **Kategori Terbaik**: Kategori **${stats.bestCategory}** menunjukkan performa ` +
    `tertinggi, sementara kategori **${stats.worstCategory}** memerlukan perhatian khusus.`,
  ]

  if (ragImprovement !== undefined) {
    parts.push(
      `\n4. **Efektivitas RAG**: Penerapan RAG memberikan peningkatan kualitas ` +
      `respons sebesar **${ragImprovement}%** dibandingkan sistem tanpa RAG. ` +
      `Hal ini membuktikan bahwa mekanisme retrieval context berkontribusi ` +
      `positif terhadap kualitas respons chatbot.`
    )
  }

  parts.push(
    "\n\nSecara keseluruhan, sistem RAG chatbot curhat ini layak digunakan " +
    "sebagai alat bantu dukungan emosional awal, meskipun masih terdapat " +
    "beberapa keterbatasan yang perlu diperbaiki pada pengembangan selanjutnya."
  )

  return parts.join("")
}

// ================================================================
// PENJELASAN PENINGKATAN PERFORM
// ================================================================

export function penjelasanPeningkatan(
  dimensi: string,
  sebelum: number,
  sesudah: number,
  persen: number
): string {
  return (
    `Penerapan mekanisme Retrieval-Augmented Generation (RAG) memberikan dampak ` +
    `positif terhadap dimensi **${dimensi.toLowerCase()}**. Terjadi peningkatan ` +
    `sebesar **${persen}%** (dari ${sebelum} menjadi ${sesudah}) pada dimensi ini.\n\n` +
    `Peningkatan ini terjadi karena RAG menyediakan konteks tambahan yang relevan ` +
    `dari basis data chunk, sehingga chatbot memiliki lebih banyak informasi untuk ` +
    `menyusun respons yang ${dimensi.toLowerCase() === "empati" ? "empatik dan sesuai dengan kondisi emosional pengguna" : dimensi.toLowerCase() === "similarity" ? "sesuai dengan topik dan kosakata yang digunakan pengguna" : "relevan dengan konteks percakapan"}.\n\n` +
    `Tanpa RAG, chatbot hanya mengandalkan pengetahuan internal model bahasa (Llama ` +
    `3.3 70B) yang bersifat general. Dengan RAG, chatbot dapat mengakses ` +
    `pengetahuan spesifik tentang teknik konseling dan dukungan emosional yang ` +
    `telah dikurasi sebelumnya, sehingga respons menjadi lebih terarah dan ` +
    `berkualitas.`
  )
}

// ================================================================
// PENJELASAN RETRIEVAL
// ================================================================

export function penjelasanEfektivitasRetrieval(
  retrievalScore: number,
  retrievedRelevant: number,
  totalRetrieved: number
): string {
  const pctRelevant = totalRetrieved > 0
    ? ((retrievedRelevant / totalRetrieved) * 100).toFixed(1)
    : "0.0"

  return (
    `Sistem retrieval menunjukkan kinerja ${retrievalScore >= 70 ? "yang baik" : "yang cukup"} ` +
    `dengan rata-rata skor akurasi **${retrievalScore}/100**. Dari total ${totalRetrieved} ` +
    `chunk yang diretrieve, **${retrievedRelevant} chunk** (${pctRelevant}%) di antaranya ` +
    `relevan dengan konteks emosional pengguna.\n\n` +
    `Proses retrieval bekerja dengan menghitung cosine similarity antara embedding ` +
    `query pengguna dengan embedding chunk yang tersimpan di IndexedDB. Chunk ` +
    `dengan similarity score di atas threshold akan diretrieve dan digunakan ` +
    `sebagai konteks tambahan. Konteks ini kemudian digabungkan dengan prompt ` +
    `sistem untuk menghasilkan respons yang lebih personal dan kontekstual.\n\n` +
    `${retrievalScore >= 70
      ? "Tingginya akurasi retrieval ini berkontribusi langsung terhadap kualitas respons akhir chatbot."
      : "Meskipun demikian, masih terdapat ruang untuk peningkatan akurasi retrieval, terutama pada skenario dengan kondisi emosional yang kompleks atau jarang muncul dalam basis data chunk."
    }`
  )
}

// ================================================================
// HELPERS
// ================================================================

function kategorikan(score: number): string {
  if (score >= 85) return "Sangat Baik"
  if (score >= 70) return "Baik"
  if (score >= 55) return "Cukup"
  if (score >= 40) return "Kurang"
  return "Sangat Kurang"
}

function kalimatPembuka(dimensi: string, skor: number): string {
  if (skor >= 80) {
    return `Hasil pengujian pada dimensi **${dimensi}** menunjukkan performa yang sangat memuaskan.`
  }
  if (skor >= 65) {
    return `Dimensi **${dimensi}** menunjukkan hasil yang cukup baik dalam pengujian ini.`
  }
  if (skor >= 50) {
    return `Pengujian pada dimensi **${dimensi}** memberikan hasil yang masih perlu ditingkatkan.`
  }
  return `Dimensi **${dimensi}** menjadi salah satu area yang memerlukan perhatian khusus dalam pengembangan sistem.`
}
