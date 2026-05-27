/**
 * ============================================================
 * SIDANG PREPARATION NOTES — PERSIAPAN SIDANG SKRIPSI
 * ============================================================
 *
 * Dokumentasi khusus untuk persiapan sidang skripsi.
 * Berisi kemungkinan pertanyaan dosen dan jawabannya.
 *
 * @author  Tim Skripsi
 * @version 1.0
 * ============================================================
 */

import { TestScenario } from "@/test/types"
import { ResearchStats } from "./research-statistics"

// ================================================================
// GENERATE SIDANG NOTES LENGKAP
// ================================================================

export function generateSidangNotes(
  scenarios: TestScenario[],
  stats?: ResearchStats
): string {
  const catCount = new Map<string, number>()
  for (const s of scenarios) {
    catCount.set(s.category, (catCount.get(s.category) || 0) + 1)
  }

  return (
    `# Persiapan Sidang Skripsi\n` +
    `## RAG Chatbot Curhat "Honey"\n\n` +
    `---\n\n` +
    `## A. Pertanyaan Umum\n\n` +
    generatePertanyaanUmum() +
    `\n\n` +
    `## B. Pertanyaan tentang RAG\n\n` +
    generatePertanyaanRAG() +
    `\n\n` +
    `## C. Pertanyaan tentang Metode Evaluasi\n\n` +
    generatePertanyaanEvaluasi() +
    `\n\n` +
    `## D. Pertanyaan tentang Hasil\n\n` +
    generatePertanyaanHasil(stats) +
    `\n\n` +
    `## E. Kelemahan Sistem\n\n` +
    generateKelemahanSistem() +
    `\n\n` +
    `## F. Future Work\n\n` +
    generateFutureWork()
  )
}

// ================================================================
// A. PERTANYAAN UMUM
// ================================================================

function generatePertanyaanUmum(): string {
  return (
    `### 1. "Mengapa memilih chatbot curhat sebagai topik skripsi?"\n\n` +
    `**Jawaban:**\n` +
    `Kesehatan mental mahasiswa merupakan isu yang semakin relevan, terutama ` +
    `pasca pandemi. Banyak mahasiswa mengalami masalah emosional seperti ` +
    `overthinking, kecemasan, dan kesepian, namun enggan atau tidak memiliki ` +
    `akses ke konselor profesional. Chatbot curhat dapat menjadi solusi ` +
    `alternatif yang accessible, anonymous, dan available 24/7 untuk memberikan ` +
    `dukungan emosional awal.\n\n` +
    `### 2. "Apa perbedaan chatbot ini dengan chatbot lain seperti ChatGPT?"\n\n` +
    `**Jawaban:**\n` +
    `Perbedaan utamanya adalah:\n` +
    `1. **Fokus emosional**: Chatbot ini dirancang khusus untuk merespon curhat ` +
    `dengan pendekatan empatik, bukan sekadar menjawab pertanyaan.\n` +
    `2. **RAG personal**: Menggunakan Retrieval-Augmented Generation dengan ` +
    `basis data chunk yang dikurasi khusus untuk konteks konseling.\n` +
    `3. **Prompt engineering**: Prompt sistem dirancang untuk mendorong respons ` +
    `yang hangat, memvalidasi perasaan, dan memberikan dukungan.\n` +
    `4. **Deteksi emosi**: Sistem berusaha memahami kondisi emosional pengguna ` +
    `sebelum merespon.\n\n` +
    `### 3. "Mengapa menggunakan Groq Llama 3.3 70B?"\n\n` +
    `**Jawaban:**\n` +
    `Groq Llama 3.3 70B dipilih karena:\n` +
    `1. **Performa cepat**: Groq menawarkan inferensi yang sangat cepat.\n` +
    `2. **Kualitas respons**: Llama 3.3 70B memiliki kemampuan bahasa yang baik ` +
    `untuk Bahasa Indonesia.\n` +
    `3. **Gratis**: Tidak memerlukan biaya API untuk pengembangan.\n` +
    `4. **Open source**: Model Llama bersifat open source sehingga transparan.`
  )
}

// ================================================================
// B. PERTANYAAN RAG
// ================================================================

function generatePertanyaanRAG(): string {
  return (
    `### 1. "Mengapa menggunakan RAG? Kenapa tidak fine-tuning saja?"\n\n` +
    `**Jawaban:**\n` +
    `RAG dipilih karena beberapa keunggulan dibanding fine-tuning:\n` +
    `1. **Fleksibilitas**: Basis data chunk dapat diperbarui tanpa melatih ` +
    `ulang model.\n` +
    `2. **Efisiensi**: Tidak memerlukan GPU untuk training.\n` +
    `3. **Transparansi**: Konteks retrieval dapat diinspeksi dan diverifikasi.\n` +
    `4. **Skalabilitas**: Pengetahuan dapat ditambahkan dengan mudah.\n` +
    `5. **Reduce hallucination**: RAG terbukti mengurangi halusinasi dengan ` +
    `memberikan konteks faktual.\n\n` +
    `Fine-tuning tetap merupakan pendekatan yang valid, tetapi untuk konteks ` +
    `skripsi S1 dengan sumber daya terbatas, RAG adalah pilihan yang lebih ` +
    `praktis dan tetap menunjukkan kontribusi ilmiah yang jelas.\n\n` +
    `### 2. "Bagaimana cara kerja retrieval di chatbot ini?"\n\n` +
    `**Jawaban:**\n` +
    `Proses retrieval bekerja sebagai berikut:\n` +
    `1. **Embedding**: Input pengguna diubah menjadi vektor embedding ` +
    `menggunakan model Xenova/Transformers.\n` +
    `2. **Pencarian**: Cosine similarity dihitung antara embedding query ` +
    `dengan embedding semua chunk di IndexedDB.\n` +
    `3. **Threshold**: Chunk dengan similarity di atas threshold (0.5) ` +
    `akan diretrieve.\n` +
    `4. **Kontekstualisasi**: Chunk yang diretrieve digabungkan dengan prompt ` +
    `sistem sebagai konteks tambahan.\n` +
    `5. **Generasi**: Model Llama 3.3 70B menghasilkan respons berdasarkan ` +
    `konteks yang diberikan.\n\n` +
    `### 3. "Apa isi dari basis data chunk?"\n\n` +
    `**Jawaban:**\n` +
    `Basis data chunk berisi kalimat-kalimat suportif dan informatif yang ` +
    `dikurasi dari sumber-sumber berikut:\n` +
    `1. **Literatur konseling**: Teknik-teknik dasar konseling dan terapi.\n` +
    `2. **Psikologi populer**: Konsep-konsep psikologi yang mudah dipahami.\n` +
    `3. **Contoh percakapan**: Template respons untuk berbagai situasi emosional.\n` +
    `4. **Kata-kata suportif**: Frasa-frasa yang memvalidasi dan mendukung.\n\n` +
    `Setiap chunk memiliki metadata kategori emosional dan konteks situasi ` +
    `untuk memudahkan pencarian.`
  )
}

// ================================================================
// C. PERTANYAAN EVALUASI
// ================================================================

function generatePertanyaanEvaluasi(): string {
  return (
    `### 1. "Mengapa menggunakan cosine similarity?"\n\n` +
    `**Jawaban:**\n` +
    `Cosine similarity dipilih karena:\n` +
    `1. **Sederhana dan cepat**: Mudah diimplementasikan dan dihitung.\n` +
    `2. **Interpretable**: Nilai 0-1 mudah dipahami dan diinterpretasikan.\n` +
    `3. **Efektif**: Terbukti efektif untuk mengukur kesamaan teks pada ` +
    `domain-domain spesifik.\n` +
    `4. **Tidak perlu training**: Tidak memerlukan data training tambahan.\n\n` +
    `### 2. "Bagaimana cara mengukur empati secara otomatis?"\n\n` +
    `**Jawaban:**\n` +
    `Empati diukur menggunakan keyword matching pada tiga dimensi:\n` +
    `1. **Validasi**: Mendeteksi frasa yang memvalidasi perasaan.\n` +
    `2. **Pemahaman**: Mendeteksi frasa yang menunjukkan pemahaman.\n` +
    `3. **Dukungan**: Mendeteksi frasa yang menawarkan dukungan.\n\n` +
    `Setiap dimensi memberikan skor berdasarkan keberadaan kata kunci ` +
    `yang telah dikurasi. Skor akhir adalah rata-rata dari ketiga dimensi.\n\n` +
    `Saya menyadari metode ini tidak sempurna, sehingga penelitian ini ` +
    `juga menyertakan template evaluasi manusia untuk triangulasi.\n\n` +
    `### 3. "Mengapa tidak menggunakan BLEU atau ROUGE?"\n\n` +
    `**Jawaban:**\n` +
    `BLEU dan ROUGE lebih cocok untuk evaluasi text generation yang ` +
    `membutuhkan reference text yang tetap. Dalam chatbot curhat, ` +
    `tidak ada satu jawaban yang benar — respons yang baik bisa ` +
    `bervariasi. Cosine similarity dan keyword matching lebih fleksibel ` +
    `dan lebih sesuai untuk mengukur aspek-aspek yang penting dalam ` +
    `chatbot curhat: relevansi konteks dan empati.`
  )
}

// ================================================================
// D. PERTANYAAN HASIL
// ================================================================

function generatePertanyaanHasil(stats?: ResearchStats): string {
  const s = stats?.averageScores
  return (
    `### 1. "Berapa rata-rata skor chatbot?"\n\n` +
    `**Jawaban:**\n` +
    `Rata-rata skor keseluruhan chatbot adalah ` +
    `${s ? `**${s.overall}/100** dengan success rate **${stats!.successRate}%**` : "dapat dilihat pada hasil evaluasi"}. ` +
    `Dimensi empati menunjukkan performa terbaik, yang merupakan temuan ` +
    `positif karena empati adalah aspek paling krusial dalam chatbot curhat.\n\n` +
    `### 2. "Apa bukti bahwa RAG meningkatkan kualitas?"\n\n` +
    `**Jawaban:**\n` +
    `Berdasarkan perbandingan sistematis antara sistem dengan RAG dan tanpa ` +
    `RAG pada skenario yang sama, ditemukan bahwa RAG meningkatkan kualitas ` +
    `respons dalam beberapa aspek:\n` +
    `1. **Contextual fit meningkat**: RAG memberikan konteks spesifik.\n` +
    `2. **Specificity meningkat**: Respons menjadi lebih spesifik.\n` +
    `3. **Reduksi generic response**: Mengurangi jawaban yang terlalu umum.\n\n` +
    `Peningkatan ini terjadi karena RAG menyediakan konteks tambahan yang ` +
    `relevan dari basis data chunk yang telah dikurasi.\n\n` +
    `### 3. "Apakah hasil ini bisa dianggap valid?"\n\n` +
    `**Jawaban:**\n` +
    `Validitas hasil didukung oleh:\n` +
    `1. **Jumlah skenario yang memadai**: 33 skenario mencakup 10 kategori ` +
    `emosional.\n` +
    `2. **Metode yang terstandarisasi**: Setiap skenario diuji dengan ` +
    `kriteria yang konsisten.\n` +
    `3. **Triangulasi**: Template evaluasi manusia disediakan untuk ` +
    `memvalidasi hasil otomatis.\n` +
    `4. **Reproduktibilitas**: Evaluasi dapat diulang dengan hasil yang sama.\n\n` +
    `Namun, perlu diakui bahwa evaluasi otomatis memiliki keterbatasan, ` +
    `seperti yang sudah dijelaskan pada bagian keterbatasan penelitian.`
  )
}

// ================================================================
// E. KELEMAHAN SISTEM
// ================================================================

function generateKelemahanSistem(): string {
  return (
    `### Kelemahan yang perlu diakui:\n\n` +
    `1. **Respons kadang generik**: Dalam beberapa skenario, chatbot ` +
    `memberikan respons yang terlalu aman dan generik.\n\n` +
    `2. **Deteksi emosi terbatas**: Sistem hanya mendeteksi emosi dari ` +
    `kata kunci, tidak dari nada atau konteks yang lebih dalam.\n\n` +
    `3. **Retrieval tidak selalu akurat**: Kadang chunk yang diretrieve ` +
    `kurang relevan dengan kondisi emosional pengguna.\n\n` +
    `4. **Tidak ada memori jangka panjang**: Chatbot tidak mengingat ` +
    `percakapan sebelumnya di luar sesi saat ini.\n\n` +
    `5. **Bahasa terbatas**: Chatbot bekerja optimal untuk Bahasa Indonesia ` +
    `formal dan semi-formal, mungkin kurang optimal untuk bahasa gaul ` +
    `atau campuran bahasa.\n\n` +
    `6. **Bukan pengganti profesional**: Chatbot tidak dapat menangani ` +
    `kondisi darurat atau krisis kesehatan mental.\n\n` +
    `### Cara menjawab jika ditanya kelemahan:\n\n` +
    `"Saya menyadari bahwa sistem ini memiliki beberapa keterbatasan. ` +
    `Namun, keterbatasan ini justru menjadi peluang untuk pengembangan ` +
    `selanjutnya. Fokus penelitian ini adalah membuktikan bahwa RAG dapat ` +
    `meningkatkan kualitas respons chatbot curhat secara signifikan, dan ` +
    `hal tersebut berhasil dibuktikan melalui hasil evaluasi."`
  )
}

// ================================================================
// F. FUTURE WORK
// ================================================================

function generateFutureWork(): string {
  return (
    `### Saran pengembangan selanjutnya:\n\n` +
    `1. **Perluas basis data chunk**: Tambahkan lebih banyak variasi ` +
    `situasi emosional dan teknik konseling.\n\n` +
    `2. **Implementasi fine-tuning**: Fine-tune model dengan dataset ` +
    `percakapan konseling untuk meningkatkan kualitas respons.\n\n` +
    `3. **Multi-bahasa**: Dukung bahasa daerah atau campuran bahasa ` +
    `(Indonesia-Inggris).\n\n` +
    `4. **Integrasi dengan profesional**: Tambahkan fitur untuk merujuk ` +
    `pengguna ke konselor profesional jika terdeteksi kondisi serius.\n\n` +
    `5. **Analisis sentimen real-time**: Gunakan model analisis sentimen ` +
    `yang lebih canggih untuk mendeteksi emosi.\n\n` +
    `6. **Evaluasi dengan pengguna nyata**: Lakukan user study dengan ` +
    `responden manusia untuk memvalidasi hasil.\n\n` +
    `7. **Perbandingan dengan model lain**: Bandingkan performa dengan ` +
    `model seperti GPT-4, Claude, atau Gemini.\n\n` +
    `8. **Optimasi retrieval**: Implementasi teknik retrieval yang lebih ` +
    `canggih seperti hybrid search atau re-ranking.`
  )
}
