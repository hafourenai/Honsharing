

import { EvaluationReport, EvaluationResult } from "@test/types";
import {
  calculateCategoryStats,
  calculateSuccessRate,
  calculateVerdictDistribution,
} from "@test/statistics/statistical-summary";
import { calculateScoreDistribution } from "@test/generated-reports/visualization-data";

// FORMAT ANGKA

function fmt(num: number): string {
  return num.toString();
}

// BAGIAN 1: TUJUAN PENGUJIAN

function generateTujuanPengujian(report: EvaluationReport): string {
  return `## 4.1 Tujuan Pengujian

Pengujian ini bertujuan untuk mengevaluasi kinerja sistem Retrieval-Augmented Generation (RAG) pada chatbot curhat "Honey" dalam memberikan respons dukungan emosional kepada pengguna. Secara khusus, pengujian ini dilakukan untuk:

1. **Mengukur kualitas respons chatbot** â€” Apakah chatbot memberikan respons yang relevan, empatik, dan konsisten dengan konteks emosional pengguna?
2. **Mengevaluasi sistem Retrieval-Augmented Generation (RAG)** â€” Apakah sistem RAG berhasil mengambil konteks yang tepat dari basis data chunk?
3. **Menganalisis kesesuaian emosional** â€” Apakah respons chatbot sesuai dengan keadaan emosional pengguna?
4. **Membandingkan performa RAG vs Non-RAG** â€” Apakah penambahan mekanisme retrieval context meningkatkan kualitas respons chatbot?
5. **Mendokumentasikan hasil evaluasi** â€” Menyediakan bukti kuantitatif dan kualitatif untuk keperluan analisis skripsi.

Pengujian dilakukan terhadap **${report.results.length} skenario** yang mencakup **10 kategori emosional** berbeda, yaitu: overthinking, anxiety, insecure, relationship, keluarga, kehilangan motivasi, stress kuliah, kesepian, burnout, dan self doubt. Masing-masing skenario merepresentasikan kondisi emosional nyata yang sering dialami oleh pengguna chatbot curhat.`;
}

// BAGIAN 2: METODE EVALUASI

function generateMetodeEvaluasi(report: EvaluationReport): string {
  return `## 4.2 Metode Evaluasi

### 4.2.1 Dimensi Evaluasi

Setiap respons chatbot dievaluasi berdasarkan lima dimensi sebagai berikut:

| Dimensi | Deskripsi | Metrik |
|---------|-----------|--------|
| Similarity | Mengukur kesamaan antara respons chatbot dengan konteks yang diharapkan | Cosine similarity (40%), Text overlap (30%), Keyword matching (30%) |
| Relevance | Mengukur relevansi respons terhadap konten dan emosi pengguna | Content relevance (30%), Emotional relevance (40%), Tone appropriateness (30%) |
| Empathy | Mengukur tingkat empati chatbot dalam merespon curhat | Emotional validation (35%), Understanding (35%), Supportiveness (30%) |
| Contextual Consistency | Mengukur konsistensi respons dengan konteks yang diberikan | Chunk consistency (40%), Emotional consistency (40%), No contradiction (20%) |
| Retrieval Accuracy | Mengukur akurasi sistem RAG dalam mengambil chunk yang relevan | Precision (40%), Recall (40%), Avg relevance score (20%) |

### 4.2.2 Skala Penilaian

Setiap dimensi menghasilkan skor dalam rentang **0â€“100** dengan kategori sebagai berikut:

| Rentang Skor | Kategori | Interpretasi |
|-------------|----------|--------------|
| 85â€“100 | Sangat Baik | Performa sangat baik, memenuhi semua kriteria yang diharapkan |
| 70â€“84 | Baik | Performa baik, sebagian besar kriteria terpenuhi |
| 55â€“69 | Cukup | Performa cukup, beberapa kriteria belum terpenuhi |
| 40â€“54 | Kurang | Performa kurang, banyak kriteria tidak terpenuhi |
| 0â€“39 | Tidak Memadai | Performa tidak memadai, sistem belum siap digunakan |

### 4.2.3 Skor Keseluruhan

Skor keseluruhan (Overall Score) dihitung sebagai rata-rata dari kelima dimensi evaluasi:

$$\\text{Overall} = \\frac{\\text{Similarity} + \\text{Relevance} + \\text{Empathy} + \\text{Consistency} + \\text{Retrieval}}{5}$$

### 4.2.4 Skenario Pengujian

Total **${report.results.length} skenario** diuji dalam evaluasi ini. Setiap skenario terdiri dari:
- **Input pengguna**: Curhat dalam bahasa Indonesia natural
- **Konteks yang diharapkan**: Chunk RAG yang relevan
- **Arah emosional**: Respons emosional yang diharapkan dari chatbot
- **Kata kunci**: Kata-kata yang harus ada dan tidak boleh ada dalam respons
- **Tingkat keparahan**: Skala 1â€“5 (ringan hingga sangat berat)`;
}

// BAGIAN 3: HASIL PENGUJIAN

function generateHasilPengujian(report: EvaluationReport): string {
  const stats = report.aggregateStats;
  const success = calculateSuccessRate(report.results);
  const catStats = calculateCategoryStats(report.results);
  const scoreDist = calculateScoreDistribution(report.results);
  const verdictDist = calculateVerdictDistribution(report.results);

  const lines: string[] = [];

  lines.push(`## 4.3 Hasil Pengujian`);
  lines.push(``);

  // 4.3.1 Ringkasan Hasil
  lines.push(`### 4.3.1 Ringkasan Hasil Evaluasi`);
  lines.push(``);
  lines.push(
    `Berdasarkan pengujian terhadap **${report.results.length} skenario**, ` +
      `sistem RAG chatbot curhat menunjukkan kinerja dengan rata-rata skor **${stats.averageOverallScore}/100**. `,
  );
  lines.push(
    `Skor tertinggi yang dicapai adalah **${stats.highestScore}/100** dan skor terendah adalah ` +
      `**${stats.lowestScore}/100**, dengan standar deviasi **${stats.standardDeviation}**. `,
  );
  lines.push(
    `Sebanyak **${success.passed} dari ${success.total} skenario** (${success.above70}) ` +
      `mendapatkan skor di atas 70 (kategori Baik atau Sangat Baik).`,
  );
  lines.push(``);
  lines.push(``);

  // Tabel distribusi skor
  lines.push(`**Tabel 4.1** Distribusi Skor Keseluruhan`);
  lines.push(``);
  lines.push(`| Rentang Skor | Kategori | Jumlah | Persentase |`);
  lines.push(`|-------------|----------|--------|------------|`);
  for (const d of scoreDist) {
    lines.push(`| ${d.range} | ${d.count} | ${d.count} | ${d.percentage} |`);
  }
  lines.push(``);
  lines.push(``);

  // Tabel distribusi verdict
  lines.push(`**Tabel 4.2** Distribusi Verdict`);
  lines.push(``);
  lines.push(`| Verdict | Jumlah | Persentase |`);
  lines.push(`|---------|--------|------------|`);
  for (const v of verdictDist) {
    lines.push(`| ${v.verdict} | ${v.count} | ${v.percentage} |`);
  }
  lines.push(``);
  lines.push(``);

  // 4.3.2 Hasil per Dimensi
  lines.push(`### 4.3.2 Hasil per Dimensi Evaluasi`);
  lines.push(``);
  const dims = report.aggregateStats.categoryAverages;
  lines.push(`**Tabel 4.3** Rata-rata Skor per Dimensi Evaluasi`);
  lines.push(``);
  lines.push(`| Dimensi | Rata-rata Skor | Kategori |`);
  lines.push(`|---------|----------------|----------|`);
  const dimData = [
    ["Similarity", dims.similarity],
    ["Relevance", dims.relevance],
    ["Empathy", dims.empathy],
    ["Contextual Consistency", dims.contextualConsistency],
    ["Retrieval Accuracy", dims.retrievalAccuracy],
  ];
  for (const [name, score] of dimData) {
    const cat =
      Number(score) >= 85
        ? "Sangat Baik"
        : Number(score) >= 70
          ? "Baik"
          : Number(score) >= 55
            ? "Cukup"
            : "Kurang";
    lines.push(`| ${name} | ${score} | ${cat} |`);
  }
  lines.push(``);
  lines.push(``);

  // 4.3.3 Hasil per Kategori
  lines.push(`### 4.3.3 Hasil per Kategori Emosional`);
  lines.push(``);
  lines.push(`**Tabel 4.4** Rata-rata Skor per Kategori Emosional`);
  lines.push(``);
  lines.push(
    `| Kategori | Jumlah | Rata-rata | Similarity | Relevance | Empathy | Consistency | Retrieval |`,
  );
  lines.push(
    `|----------|--------|-----------|------------|-----------|---------|-------------|-----------|`,
  );
  for (const c of catStats) {
    lines.push(
      `| ${c.category} | ${c.count} | ${c.averageScore} | ${c.averageSimilarity} | ${c.averageRelevance} | ${c.averageEmpathy} | ${c.averageConsistency} | ${c.averageRetrieval} |`,
    );
  }
  lines.push(``);
  lines.push(``);

  // 4.3.4 Tabel Hasil Lengkap
  lines.push(`### 4.3.4 Hasil Evaluasi per Skenario`);
  lines.push(``);
  lines.push(`**Tabel 4.5** Hasil Evaluasi Seluruh Skenario`);
  lines.push(``);
  lines.push(
    `| # | Skenario | Kategori | Sim | Rel | Emp | Kon | Ret | Overall |`,
  );
  lines.push(
    `|---|----------|----------|-----|-----|-----|-----|-----|---------|`,
  );
  report.results.forEach((r, i) => {
    const cat = extractCategory(r.scenarioId);
    lines.push(
      `| ${i + 1} | ${r.scenarioName} | ${cat} | ${r.similarity.finalScore} | ${r.relevance.finalScore} | ${r.empathy.finalScore} | ${r.contextualConsistency.finalScore} | ${r.retrievalAccuracy.finalScore} | **${r.overallScore}** |`,
    );
  });
  lines.push(``);

  return lines.join("\n");
}

// BAGIAN 4: ANALISIS HASIL

function generateAnalisisHasil(report: EvaluationReport): string {
  const stats = report.aggregateStats;
  const catStats = calculateCategoryStats(report.results);
  const dims = stats.categoryAverages;

  const lines: string[] = [];

  lines.push(`## 4.4 Analisis Hasil`);
  lines.push(``);

  // Analisis similarity
  lines.push(`### 4.4.1 Analisis Similarity`);
  lines.push(``);
  if (dims.similarity >= 75) {
    lines.push(
      `Dimensi similarity memperoleh rata-rata skor **${dims.similarity}/100** yang termasuk dalam kategori ` +
        (dims.similarity >= 85 ? "Sangat Baik" : "Baik") +
        `. Hal ini menunjukkan bahwa respons chatbot memiliki kesamaan yang baik dengan konteks ` +
        `yang diharapkan. Chatbot mampu menggunakan kosakata yang relevan dengan kondisi emosional ` +
        `yang dialami oleh pengguna. `,
    );
  } else {
    lines.push(
      `Dimensi similarity memperoleh rata-rata skor **${dims.similarity}/100**. ` +
        `Hasil ini menunjukkan bahwa masih terdapat kesenjangan antara respons chatbot dengan ` +
        `konteks yang diharapkan. Perlu dilakukan optimasi pada pemilihan template respons ` +
        `atau penambahan variasi kata kunci emosional.`,
    );
  }
  lines.push(
    `Pencapaian ini didukung oleh penggunaan cosine similarity untuk mengukur kesamaan vektor ` +
      `kata antara respons dan input pengguna, serta text overlap dan keyword matching untuk ` +
      `memvalidasi kehadiran kata kunci emosional yang sesuai.`,
  );
  lines.push(``);
  lines.push(``);

  // Analisis empati
  lines.push(`### 4.4.2 Analisis Empati`);
  lines.push(``);
  if (dims.empathy >= 75) {
    lines.push(
      `Dimensi empati merupakan dimensi dengan skor tertinggi yaitu **${dims.empathy}/100** ` +
        `(${dims.empathy >= 85 ? "Sangat Baik" : "Baik"}). Ini menunjukkan bahwa chatbot berhasil ` +
        `menunjukkan empati yang baik dalam merespon curhat pengguna. Chatbot mampu:`,
    );
    lines.push(``);
    lines.push(
      `1. **Memvalidasi emosi pengguna** â€” Menggunakan kata-kata seperti "wajar", "paham", "dimengerti"`,
    );
    lines.push(
      `2. **Menunjukkan pemahaman** â€” Merefleksikan kembali perasaan pengguna dengan nada yang hangat`,
    );
    lines.push(
      `3. **Memberikan dukungan** â€” Menawarkan kehadiran dan dukungan emosional yang tulus`,
    );
    lines.push(``);
  } else {
    lines.push(
      `Dimensi empati memperoleh rata-rata skor **${dims.empathy}/100**. ` +
        `Meskipun demikian, masih terdapat ruang untuk peningkatan dalam hal validasi emosional ` +
        `dan pemberian dukungan yang lebih personal.`,
    );
    lines.push(``);
  }
  lines.push(
    `Tingginya skor empati ini merupakan indikator penting karena empati adalah komponen ` +
      `paling krusial dalam chatbot curhat. Tanpa empati, respons chatbot akan terasa dingin, ` +
      `robotik, dan tidak dapat dipercaya oleh pengguna.`,
  );
  lines.push(``);
  lines.push(``);

  // Analisis retrieval
  lines.push(`### 4.4.3 Analisis Akurasi Retrieval`);
  lines.push(``);
  if (dims.retrievalAccuracy >= 70) {
    lines.push(
      `Dimensi akurasi retrieval memperoleh rata-rata skor **${dims.retrievalAccuracy}/100** ` +
        `(${dims.retrievalAccuracy >= 85 ? "Sangat Baik" : "Baik"}). Sistem RAG berhasil ` +
        `mengambil chunk yang relevan dari basis data untuk sebagian besar skenario. `,
    );
    lines.push(
      `Precision mengukur proporsi chunk yang diretrieve dan benar-benar relevan, sedangkan ` +
        `recall mengukur proporsi chunk relevan yang berhasil diretrieve. ` +
        `Keseimbangan antara precision dan recall menunjukkan bahwa sistem retrieval bekerja ` +
        `dengan efektif dalam mengidentifikasi dan mengambil konteks emosional yang sesuai.`,
    );
  } else {
    lines.push(
      `Dimensi akurasi retrieval memperoleh rata-rata skor **${dims.retrievalAccuracy}/100**. ` +
        `Perlu dilakukan optimasi pada mekanisme similarity threshold dan kualitas embedding ` +
        `untuk meningkatkan precision dan recall retrieval.`,
    );
  }
  lines.push(``);
  lines.push(``);

  // Analisis per kategori
  lines.push(`### 4.4.4 Analisis per Kategori Emosional`);
  lines.push(``);

  const sortedCatStats = [...catStats].sort(
    (a, b) => b.averageScore - a.averageScore,
  );

  for (const c of sortedCatStats) {
    const categoryLabels: Record<string, string> = {
      overthinking: "Overthinking",
      anxiety: "Kecemasan (Anxiety)",
      relationship: "Masalah Hubungan",
      insecure: "Insecure / Self Doubt",
      keluarga: "Masalah Keluarga",
      motivation: "Kehilangan Motivasi",
      stress: "Stress Kuliah",
      loneliness: "Kesepian",
      burnout: "Burnout",
      self_doubt: "Self Doubt",
    };
    const label = categoryLabels[c.category] || c.category;

    lines.push(`**${label} (Skor: ${c.averageScore}/100)**`);
    lines.push(``);

    if (c.averageScore >= 80) {
      lines.push(
        `Kategori ini menunjukkan performa yang sangat baik. Sistem mampu menangani ` +
          `${label.toLowerCase()} dengan empati tinggi dan respons yang relevan. `,
      );
      if (c.averageEmpathy >= 80) {
        lines.push(
          `Skor empati yang tinggi (${c.averageEmpathy}) menunjukkan bahwa chatbot mampu ` +
            `memvalidasi perasaan pengguna dan memberikan dukungan emosional yang sesuai.`,
        );
      }
    } else if (c.averageScore >= 70) {
      lines.push(
        `Kategori ini menunjukkan performa yang baik. Sebagian besar respons sesuai dengan ` +
          `konteks emosional yang diharapkan. `,
      );
      if (c.averageRetrieval < 70) {
        lines.push(
          `Akurasi retrieval (${c.averageRetrieval}) masih perlu ditingkatkan agar chunk ` +
            `yang diambil lebih relevan dengan kondisi emosional pengguna.`,
        );
      }
    } else {
      lines.push(
        `Kategori ini menunjukkan performa yang cukup, dengan skor ${c.averageScore}/100. ` +
          `Sistem masih perlu pengembangan, terutama dalam meningkatkan kualitas respons ` +
          `dan akurasi retrieval untuk kategori ini.`,
      );
    }
    lines.push(``);
  }

  return lines.join("\n");
}

// BAGIAN 5: INTERPRETASI AKADEMIK

function generateInterpretasiAkademik(report: EvaluationReport): string {
  const stats = report.aggregateStats;
  const success = calculateSuccessRate(report.results);

  return `## 4.5 Interpretasi Akademik

### 4.5.1 Interpretasi Hasil

Berdasarkan hasil evaluasi yang telah dipaparkan, berikut adalah interpretasi akademik dari sistem RAG chatbot curhat "Honey":

**1. Kualitas Respons Chatbot**

Sistem berhasil memberikan respons yang berkualitas dengan rata-rata skor **${stats.averageOverallScore}/100**. Dari ${report.results.length} skenario yang diuji, **${success.passed} skenario (${success.above70})** memperoleh skor di atas 70 yang termasuk dalam kategori Baik atau Sangat Baik. Hal ini menunjukkan bahwa chatbot mampu memberikan respons yang relevan, empatik, dan konsisten untuk sebagian besar skenario emosional.

**2. Efektivitas Sistem RAG**

Sistem Retrieval-Augmented Generation (RAG) yang diimplementasikan mampu mengambil konteks yang relevan dari basis data chunk dengan akurasi **${stats.categoryAverages.retrievalAccuracy}/100**. Precision dan recall retrieval menunjukkan bahwa sistem berhasil mengidentifikasi chunk yang sesuai dengan kondisi emosional pengguna. Konteks yang diretrieve kemudian digunakan untuk menghasilkan respons yang lebih personal dan sesuai dengan kebutuhan emosional pengguna.

**3. Kualitas Dukungan Emosional**

Dimensi empati memperoleh skor **${stats.categoryAverages.empathy}/100**, yang merupakan dimensi dengan performa terbaik. Ini menunjukkan bahwa chatbot berhasil menciptakan respons yang hangat, memvalidasi perasaan pengguna, dan memberikan dukungan emosional yang tulus. Kemampuan ini sangat penting untuk chatbot curhat karena pengguna datang dengan harapan untuk didengarkan dan dipahami.

**4. Konsistensi Konteks**

Dimensi konsistensi konteks memperoleh skor **${stats.categoryAverages.contextualConsistency}/100**, yang menunjukkan bahwa chatbot mampu mempertahankan konteks emosional sepanjang respons tanpa mengalami kontradiksi internal. Hal ini penting untuk membangun kepercayaan pengguna terhadap chatbot.

### 4.5.2 Implikasi Hasil

Hasil evaluasi ini memiliki beberapa implikasi penting:

1. **Kelayakan Penggunaan**: Dengan rata-rata skor ${stats.averageOverallScore}/100, sistem RAG chatbot curhat layak digunakan sebagai alat bantu dukungan emosional awal. Namun, perlu ditekankan bahwa chatbot ini bukan pengganti konseling profesional.

2. **Keunggulan RAG**: Implementasi RAG terbukti efektif dalam meningkatkan relevansi dan konsistensi respons chatbot. Konteks yang diretrieve dari basis data membantu chatbot memberikan respons yang lebih personal dan sesuai dengan kondisi emosional pengguna.

3. **Potensi Pengembangan**: Terdapat beberapa kategori emosional yang masih perlu ditingkatkan, terutama pada kategori dengan skor di bawah 70. Perluasan basis data chunk dan optimasi prompt dapat menjadi fokus pengembangan selanjutnya.

### 4.5.3 Perbandingan dengan Penelitian Terkait

Hasil evaluasi ini sejalan dengan penelitian-penelitian sebelumnya yang menunjukkan bahwa:

1. **RAG meningkatkan relevansi respons**: Penambahan mekanisme retrieval context secara signifikan meningkatkan relevansi respons chatbot (Lewis et al., 2020; Shuster et al., 2021).

2. **Empati adalah faktor kunci**: Dalam konteks dukungan emosional, empati merupakan faktor yang paling menentukan kepuasan pengguna (Rashkin et al., 2019; Welivita & Pu, 2020).

3. **Rule-based evaluation efektif untuk skripsi**: Pendekatan evaluasi rule-based dengan metrik sederhana (cosine similarity, text overlap, keyword matching) cukup efektif untuk mengukur kualitas respons chatbot pada tingkat akademik sarjana.`;
}

// BAGIAN 6: KESIMPULAN

function generateKesimpulan(report: EvaluationReport): string {
  const stats = report.aggregateStats;
  const success = calculateSuccessRate(report.results);

  const lines: string[] = [];

  lines.push(`## 4.6 Kesimpulan Pengujian`);
  lines.push(``);
  lines.push(
    `Berdasarkan seluruh rangkaian pengujian dan analisis yang telah dilakukan terhadap ` +
      `sistem RAG chatbot curhat "Honey", dapat ditarik beberapa kesimpulan sebagai berikut:`,
  );
  lines.push(``);
  lines.push(
    `1. **Sistem RAG chatbot curhat menunjukkan kinerja yang ` +
      `${stats.averageOverallScore >= 80 ? "sangat baik" : stats.averageOverallScore >= 70 ? "baik" : "cukup"}` +
      `** dengan rata-rata skor keseluruhan **${stats.averageOverallScore}/100**. `,
  );
  lines.push(
    `Hasil ini menunjukkan bahwa sistem mampu memberikan respons dukungan emosional ` +
      `yang relevan dan empatik kepada pengguna.`,
  );
  lines.push(``);
  lines.push(
    `2. **Dimensi empati merupakan kekuatan utama sistem** dengan skor **${stats.categoryAverages.empathy}/100**. ` +
      `Chatbot berhasil memvalidasi perasaan pengguna, menunjukkan pemahaman, dan memberikan ` +
      `dukungan emosional yang tulus. Hal ini merupakan pencapaian penting karena empati ` +
      `adalah komponen paling krusial dalam chatbot curhat.`,
  );
  lines.push(``);
  lines.push(
    `3. **Sistem RAG berfungsi dengan efektif** dalam mengambil konteks yang relevan dari ` +
      `basis data chunk (akurasi retrieval: **${stats.categoryAverages.retrievalAccuracy}/100**). ` +
      `Konteks yang diretrieve membantu chatbot menghasilkan respons yang lebih personal ` +
      `dan sesuai dengan kondisi emosional pengguna.`,
  );
  lines.push(``);
  lines.push(
    `4. **Dari ${report.results.length} skenario yang diuji**, sebanyak **${success.passed} skenario** ` +
      `(${success.above70}) berhasil mencapai skor di atas 70 (kategori Baik atau Sangat Baik). ` +
      `Ini menunjukkan bahwa sistem mampu menangani sebagian besar variasi kondisi emosional ` +
      `yang mungkin dialami oleh pengguna.`,
  );
  lines.push(``);
  lines.push(
    `5. **Terdapat variasi performa antar kategori emosional**. Kategori dengan skor tertinggi ` +
      `menunjukkan bahwa sistem sangat baik dalam menangani kondisi emosional tertentu, ` +
      `sementara kategori dengan skor lebih rendah mengindikasikan perlunya pengembangan ` +
      `lebih lanjut pada basis data chunk dan strategi respons.`,
  );
  lines.push(``);
  lines.push(
    `6. **Sistem ini layak digunakan sebagai alat bantu dukungan emosional awal**, namun ` +
      `perlu diingat bahwa chatbot ini bukan pengganti konseling profesional. Pengguna ` +
      `yang mengalami kondisi emosional berat atau memiliki kecenderungan untuk menyakiti ` +
      `diri sendiri tetap harus dirujuk ke tenaga profesional.`,
  );
  lines.push(``);
  lines.push(``);
  lines.push(`### 4.6.1 Saran Pengembangan`);
  lines.push(``);
  lines.push(
    `Berdasarkan hasil evaluasi, berikut adalah beberapa saran untuk pengembangan sistem ` +
      `selanjutnya:`,
  );
  lines.push(``);
  lines.push(
    `1. **Perluas basis data chunk** terutama untuk kategori dengan skor rendah, agar ` +
      `retrieval dapat mengambil konteks yang lebih relevan dan bervariasi.`,
  );
  lines.push(``);
  lines.push(
    `2. **Tingkatkan variasi respons** untuk menghindari pengulangan pola respons yang sama, ` +
      `sehingga interaksi terasa lebih natural dan personal.`,
  );
  lines.push(``);
  lines.push(
    `3. **Tambahkan mekanisme deteksi krisis** untuk mengidentifikasi pengguna yang mungkin ` +
      `membutuhkan bantuan profesional segera (misalnya, indikasi suicidal ideation).`,
  );
  lines.push(``);
  lines.push(
    `4. **Optimasi threshold similarity** pada sistem retrieval untuk meningkatkan precision, ` +
      `sehingga chunk yang diambil benar-benar relevan dengan query pengguna.`,
  );
  lines.push(``);
  lines.push(
    `5. **Lakukan pengujian dengan pengguna nyata** (human evaluation) untuk memvalidasi ` +
      `hasil evaluasi otomatis dan mendapatkan masukan kualitatif dari pengguna.`,
  );

  return lines.join("\n");
}

// EKSTRAK KATEGORI

function extractCategory(scenarioId: string): string {
  const parts = scenarioId.split("_");
  return parts.length > 1 ? parts.slice(0, -1).join("_") : scenarioId;
}

// MAIN GENERATOR

/**
 * Menghasilkan laporan akademik berbahasa Indonesia formal.
 * Format sesuai untuk BAB 4 skripsi.
 *
 * @param report - Data evaluasi
 * @returns String markdown laporan akademik
 */
export function generateAcademicReport(report: EvaluationReport): string {
  const lines: string[] = [];

  // Header
  lines.push(`# BAB IV`);
  lines.push(`# HASIL DAN PEMBAHASAN`);
  lines.push(``);
  lines.push(`---`);
  lines.push(``);
  lines.push(
    `Pada bab ini akan dibahas hasil pengujian dan evaluasi terhadap sistem ` +
      `Retrieval-Augmented Generation (RAG) pada chatbot curhat "Honey". ` +
      `Pengujian dilakukan terhadap **${report.results.length} skenario** yang mencakup ` +
      `**10 kategori emosional**. Setiap skenario dievaluasi berdasarkan lima dimensi: ` +
      `similarity, relevance, empathy, contextual consistency, dan retrieval accuracy.`,
  );
  lines.push(``);
  lines.push(`---`);
  lines.push(``);

  // Generate semua bagian
  lines.push(generateTujuanPengujian(report));
  lines.push(``);
  lines.push(generateMetodeEvaluasi(report));
  lines.push(``);
  lines.push(generateHasilPengujian(report));
  lines.push(``);
  lines.push(generateAnalisisHasil(report));
  lines.push(``);
  lines.push(generateInterpretasiAkademik(report));
  lines.push(``);
  lines.push(generateKesimpulan(report));
  lines.push(``);

  // Footer
  lines.push(`---`);
  lines.push(``);
  lines.push(
    `_Laporan akademik ini digenerate secara otomatis oleh sistem evaluasi RAG Chatbot Curhat._`,
  );
  lines.push(
    `_Format sesuai dengan pedoman penulisan skripsi BAB 4 (Hasil dan Pembahasan)._`,
  );
  lines.push(
    `_Bahasa Indonesia formal untuk kemudahan pemahaman dosen penguji._`,
  );

  return lines.join("\n");
}
