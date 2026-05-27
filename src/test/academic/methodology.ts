/**
 * ============================================================
 * RESEARCH METHODOLOGY — PENJELASAN METODOLOGI PENELITIAN
 * ============================================================
 *
 * Menghasilkan dokumentasi formal tentang metodologi penelitian
 * yang digunakan dalam evaluasi chatbot curhat.
 *
 * OUTPUT:
 * - Markdown siap copy ke skripsi
 * - Bahasa Indonesia formal
 * - Cocok untuk BAB 3 (Metodologi Penelitian)
 *
 * @author  Tim Skripsi
 * @version 1.0
 * ============================================================
 */

import { TestScenario } from "@/test/types"

// ================================================================
// GENERATE METODOLOGI LENGKAP
// ================================================================

export function generateMetodologiPenelitian(
  scenarios: TestScenario[]
): string {
  const categories = new Set(scenarios.map((s) => s.category))
  const categoryList = Array.from(categories)

  return (
    `# Metodologi Penelitian\n\n` +
    `## 1. Metode Pengujian\n\n` +
    `Penelitian ini menggunakan metode **evaluasi otomatis berbasis skenario** ` +
    `(scenario-based automated evaluation) untuk mengukur kualitas respons ` +
    `chatbot curhat. Metode ini dipilih karena beberapa alasan:\n\n` +
    `1. **Reproduktibilitas**: Hasil evaluasi dapat direproduksi karena ` +
    `menggunakan input yang terstandarisasi dan algoritma yang konsisten.\n` +
    `2. **Objektivitas**: Evaluasi otomatis menghilangkan bias subjektif ` +
    `yang mungkin muncul pada evaluasi manual.\n` +
    `3. **Efisiensi**: Dengan 33 skenario pengujian, evaluasi otomatis ` +
    `dapat dilakukan dalam hitungan menit.\n` +
    `4. **Konsistensi**: Setiap skenario diuji dengan kriteria yang sama ` +
    `tanpa variasi antar penguji.\n\n` +
    `Evaluasi dilakukan dengan membandingkan respons yang dihasilkan chatbot ` +
    `dengan kriteria yang telah ditentukan untuk setiap skenario. Kriteria ` +
    `tersebut mencakup arah emosional yang diharapkan, kata kunci yang harus ` +
    `muncul, dan konteks retrieval yang sesuai.\n\n` +
    `## 2. Metode Evaluasi Similarity\n\n` +
    `Evaluasi similarity mengukur seberapa mirip respons chatbot dengan input ` +
    `pengguna dalam hal konten dan konteks. Metode yang digunakan adalah:\n\n` +
    `### 2.1 Cosine Similarity\n\n` +
    `Cosine similarity mengukur kesamaan arah vektor antara dua teks. Semakin ` +
    `kecil sudut antara vektor, semakin tinggi nilai cosine similarity-nya. ` +
    `Rumus cosine similarity adalah:\n\n` +
    `$$\\text{cos}(\\theta) = \\frac{A \\cdot B}{\\|A\\| \\|B\\|}$$\n\n` +
    `di mana A dan B adalah vektor representasi dari input pengguna dan respons ` +
    `chatbot. Nilai cosine similarity berkisar antara 0 (tidak mirip) hingga ` +
    `1 (sangat mirip).\n\n` +
    `### 2.2 Text Overlap Analysis\n\n` +
    `Text overlap mengukur persentase kata yang sama antara input dan respons. ` +
    `Metode ini digunakan untuk memvalidasi bahwa chatbot menggunakan kosakata ` +
    `yang relevan dengan topik yang dibicarakan.\n\n` +
    `### 2.3 Keyword Matching\n\n` +
    `Keyword matching mendeteksi keberadaan kata kunci emosional dalam respons. ` +
    `Kata kunci dikelompokkan berdasarkan kategori emosional (cemas, sedih, ` +
    `marah, dll.) dan digunakan untuk memastikan bahwa respons menyentuh aspek ` +
    `emosional yang sesuai.\n\n` +
    `## 3. Metode Evaluasi Empati\n\n` +
    `Evaluasi empati mengukur sejauh mana chatbot menunjukkan pemahaman dan ` +
    `dukungan emosional. Tiga sub-dimensi yang diukur:\n\n` +
    `1. **Emotional Validation** (Validasi Emosi): Mengukur apakah chatbot ` +
    `mengakui dan memvalidasi perasaan pengguna melalui frasa seperti ` +
    `"wajar", "paham", "dimengerti".\n\n` +
    `2. **Understanding** (Pemahaman): Mengukur apakah chatbot menunjukkan ` +
    `pemahaman terhadap situasi pengguna melalui frasa seperti "kedengarannya ` +
    `berat", "aku bisa bayangin".\n\n` +
    `3. **Supportiveness** (Dukungan): Mengukur apakah chatbot menawarkan ` +
    `dukungan dan kehadiran melalui frasa seperti "aku disini", "kamu ga ` +
    `sendiri", "aku temani".\n\n` +
    `Masing-masing sub-dimensi dihitung menggunakan keyword matching ` +
    `dan text pattern analysis. Skor akhir adalah rata-rata dari ketiga ` +
    `sub-dimensi.\n\n` +
    `## 4. Metode Evaluasi Retrieval RAG\n\n` +
    `Evaluasi retrieval RAG mengukur seberapa baik sistem mengambil chunk ` +
    `yang relevan dari basis data. Metrik yang digunakan:\n\n` +
    `### 4.1 Precision\n\n` +
    `Precision mengukur proporsi chunk yang relevan dari seluruh chunk yang ` +
    `diretrieve. Precision tinggi berarti sistem tidak mengambil chunk yang ` +
    `tidak relevan.\n\n` +
    `$$\\text{Precision} = \\frac{\\text{Chunk Relevan}}{\\text{Total Chunk Directrieve}}$$\n\n` +
    `### 4.2 Recall\n\n` +
    `Recall mengukur proporsi chunk relevan yang berhasil diretrieve dari ` +
    `seluruh chunk relevan yang ada di basis data.\n\n` +
    `### 4.3 Relevansi Rata-rata\n\n` +
    `Rata-rata skor cosine similarity dari semua chunk yang diretrieve. ` +
    `Ini memberikan gambaran tentang kualitas keseluruhan hasil retrieval.\n\n` +
    `## 5. Dataset Pengujian\n\n` +
    `Dataset pengujian terdiri dari **${scenarios.length} skenario** yang ` +
    `tersebar dalam **${categoryList.length} kategori emosional**:\n\n` +
    `${categoryList.map((c) => `- **${c}**: ${scenarios.filter((s) => s.category === c).length} skenario`).join("\n")}\n\n` +
    `Setiap skenario mencakup:\n` +
    `- Input pengguna (user query)\n` +
    `- Konteks RAG yang diharapkan\n` +
    `- Arah emosional yang diharapkan\n` +
    `- Kriteria respons yang harus dipenuhi\n` +
    `- Tingkat keparahan emosional (1-5)\n\n` +
    `Dataset ini dirancang untuk mencakup berbagai kondisi emosional yang umum ` +
    `ditemui dalam konteks curhat mahasiswa, mulai dari kecemasan ringan ` +
    `hingga tekanan keluarga yang berat.\n\n` +
    `## 6. Skala Penilaian\n\n` +
    `Setiap dimensi evaluasi menghasilkan skor 0-100 yang dikelompokkan ` +
    `ke dalam lima kategori:\n\n` +
    `| Rentang Skor | Kategori | Interpretasi |\n` +
    `|-------------|----------|--------------|\n` +
    `| 85-100 | Sangat Baik | Sistem menunjukkan kinerja optimal |\n` +
    `| 70-84 | Baik | Sistem berfungsi dengan baik |\n` +
    `| 55-69 | Cukup | Sistem cukup berfungsi, perlu peningkatan |\n` +
    `| 40-54 | Kurang | Sistem perlu perbaikan signifikan |\n` +
    `| 0-39 | Sangat Kurang | Sistem tidak berfungsi dengan baik |` +
    `\n\n` +
    `## 7. Alat dan Bahan\n\n` +
    `| Komponen | Spesifikasi |\n` +
    `|----------|-------------|\n` +
    `| Model Bahasa | Groq Llama 3.3 70B |\n` +
    `| Framework | Next.js 15 (TypeScript) |\n` +
    `| Embedding | Local embedding (Xenova/Transformers) |\n` +
    `| Basis Data Vektor | IndexedDB (Browser) |\n` +
    `| Bahasa Pemrograman | TypeScript |\n` +
    `| Lingkungan Uji | Node.js Runtime |`
  )
}

// ================================================================
// GENERATE RINGKASAN METODE
// ================================================================

export function generateRingkasanMetode(): string {
  return (
    `Penelitian ini menggunakan pendekatan evaluasi otomatis berbasis skenario ` +
    `untuk mengukur kualitas sistem Retrieval-Augmented Generation (RAG) pada ` +
    `chatbot curhat. Terdapat empat dimensi evaluasi utama yang diukur: ` +
    `(1) Similarity, (2) Empati, (3) Relevansi, dan (4) Akurasi Retrieval.\n\n` +
    `Evaluasi dilakukan dengan membandingkan respons chatbot terhadap ` +
    `kriteria yang telah ditentukan untuk setiap skenario pengujian. ` +
    `Metrik yang digunakan meliputi cosine similarity untuk mengukur ` +
    `kesamaan teks, keyword matching untuk mendeteksi empati, dan ` +
    `precision-recall analysis untuk mengukur akurasi retrieval.\n\n` +
    `Selain evaluasi otomatis, penelitian ini juga menyertakan template ` +
    `evaluasi manual untuk responden manusia sebagai data triangulasi. ` +
    `Evaluasi manual menggunakan skala Likert 1-5 untuk mengukur aspek ` +
    `relevansi, empati, kenyamanan, naturalitas, dan kebermanfaatan ` +
    `respons chatbot.`
  )
}

// ================================================================
// GENERATE PENJELASAN TEKNIK
// ================================================================

export function generatePenjelasanTeknik(): string {
  return (
    `### Cosine Similarity\n\n` +
    `Cosine similarity adalah metrik yang digunakan untuk mengukur kesamaan ` +
    `antara dua vektor dalam ruang multidimensi. Dalam konteks penelitian ini, ` +
    `cosine similarity digunakan untuk mengukur kesamaan antara representasi ` +
    `vektor (embedding) dari input pengguna dan respons chatbot.\n\n` +
    `Proses perhitungan cosine similarity:\n` +
    `1. Teks input dan respons diubah menjadi vektor embedding\n` +
    `2. Hitung dot product antara kedua vektor\n` +
    `3. Bagi dengan hasil kali magnitudo kedua vektor\n` +
    `4. Hasil akhir berupa nilai antara 0 (tidak mirip) hingga 1 (sangat mirip)\n\n` +
    `### Keyword Matching untuk Empati\n\n` +
    `Keyword matching digunakan untuk mendeteksi keberadaan frasa-frasa ` +
    `empatik dalam respons chatbot. Frasa-frasa ini dikelompokkan ke dalam ` +
    `tiga kategori:\n\n` +
    `1. **Validasi**: "wajar", "paham", "dimengerti", "manusiawi", "natural"\n` +
    `2. **Pemahaman**: "kedengarannya", "aku bisa bayangin", "pasti berat"\n` +
    `3. **Dukungan**: "aku disini", "ga sendiri", "aku temani", "bareng"\n\n` +
    `Semakin banyak frasa empatik yang muncul, semakin tinggi skor empati ` +
    `yang diberikan.\n\n` +
    `### Evaluasi Retrieval\n\n` +
    `Evaluasi retrieval mengukur seberapa baik sistem mengambil chunk yang ` +
    `relevan dari basis data vektor. Metrik precision dan recall digunakan ` +
    `untuk mengukur akurasi retrieval:\n\n` +
    `- **Precision**: Dari semua chunk yang diretrieve, berapa banyak yang relevan?\n` +
    `- **Recall**: Dari semua chunk relevan yang ada, berapa banyak yang terambil?`
  )
}
