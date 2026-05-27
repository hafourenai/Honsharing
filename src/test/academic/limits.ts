/**
 * ============================================================
 * RESEARCH LIMITATIONS — KETERBATASAN PENELITIAN
 * ============================================================
 *
 * Mendokumentasikan keterbatasan penelitian secara formal
 * untuk menjawab pertanyaan dosen penguji.
 *
 * OUTPUT:
 * - Markdown siap copy ke skripsi
 * - Bahasa Indonesia formal
 * - Jawaban potensial untuk sidang
 *
 * @author  Tim Skripsi
 * @version 1.0
 * ============================================================
 */

// ================================================================
// GENERATE LIMITATION DOKUMENTASI
// ================================================================

export function generateResearchLimitations(): string {
  return (
    `# Keterbatasan Penelitian\n\n` +
    `Setiap penelitian pasti memiliki keterbatasan. Bagian ini mendokumentasikan ` +
    `keterbatasan-keterbatasan yang ada dalam penelitian ini secara transparan, ` +
    `sekaligus memberikan konteks untuk interpretasi hasil penelitian.\n\n` +
    `## 1. Keterbatasan Dataset\n\n` +
    `Dataset pengujian terdiri dari 33 skenario yang mencakup 10 kategori ` +
    `emosional. Meskipun sudah mencakup berbagai kondisi yang umum ditemui, ` +
    `dataset ini memiliki beberapa keterbatasan:\n\n` +
    `- **Jumlah terbatas**: 33 skenario mungkin belum cukup untuk ` +
    `menggeneralisasi performa sistem pada semua kondisi emosional.\n` +
    `- **Sumber data**: Skenario dibuat berdasarkan literatur dan observasi, ` +
    `bukan dari data percakapan nyata.\n` +
    `- **Variasi budaya**: Kondisi emosional yang diuji mungkin tidak ` +
    `sepenuhnya mewakili keragaman budaya Indonesia.\n` +
    `- **Bias peneliti**: Pemilihan dan perumusan skenario mungkin ` +
    `dipengaruhi oleh perspektif peneliti.\n\n` +
    `**Dampak:** Hasil evaluasi mungkin tidak sepenuhnya mewakili performa ` +
    `sistem pada kondisi dunia nyata yang lebih kompleks dan beragam.\n\n` +
    `## 2. Keterbatasan Evaluasi Otomatis\n\n` +
    `Evaluasi otomatis menggunakan metode keyword matching dan cosine ` +
    `similarity memiliki keterbatasan inherent:\n\n` +
    `- **Keyword matching tidak sempurna**: Kata kunci yang sama bisa ` +
    `memiliki makna berbeda dalam konteks yang berbeda.\n` +
    `- **Cosine similarity terbatas**: Cosine similarity hanya mengukur ` +
    `kesamaan permukaan teks, bukan kedalaman makna.\n` +
    `- **Tidak ada pemahaman semantik**: Sistem tidak benar-benar ` +
    `"memahami" konten emosional, hanya mencocokkan pola.\n` +
    `- **False positive/negative**: Deteksi empati bisa salah mengidentifikasi ` +
    `respons yang kebetulan mengandung kata kunci.\n` +
    `- **Evaluasi terstruktur**: Evaluasi tidak dapat menangkap nuansa ` +
    `percakapan yang tidak terstruktur.\n\n` +
    `**Dampak:** Skor evaluasi mungkin tidak sepenuhnya mencerminkan kualitas ` +
    `respons dari perspektif pengguna manusia. Inilah mengapa triangulasi ` +
    `dengan evaluasi manusia sangat penting.\n\n` +
    `## 3. Keterbatasan Emotional AI\n\n` +
    `Teknologi AI saat ini masih memiliki keterbatasan dalam memahami dan ` +
    `merespon emosi manusia:\n\n` +
    `- **Empati simulasi**: Chatbot tidak benar-benar memiliki empati, ` +
    `hanya mensimulasikannya berdasarkan pola yang dipelajari.\n` +
    `- **Kurangnya konteks hidup**: Chatbot tidak memiliki pengalaman ` +
    `hidup nyata untuk benar-benar memahami penderitaan pengguna.\n` +
    `- **Respons repetitif**: Dalam percakapan panjang, chatbot cenderung ` +
    `mengulang pola respons yang sama.\n` +
    `- **Krisis deteksi terbatas**: Sistem mungkin tidak dapat mendeteksi ` +
    `kondisi darurat seperti ide bunuh diri dengan akurat.\n` +
    `- **Tidak ada tindak lanjut**: Chatbot tidak dapat melakukan tindak ` +
    `lanjut atau merujuk ke profesional.\n\n` +
    `**Dampak:** Chatbot ini hanya dapat menjadi alat bantu awal, bukan ` +
    `pengganti konseling profesional. Pengguna dengan kondisi serius tetap ` +
    `harus dirujuk ke tenaga profesional.\n\n` +
    `## 4. Keterbatasan Retrieval Lokal\n\n` +
    `Sistem retrieval menggunakan IndexedDB di browser yang memiliki ` +
    `keterbatasan:\n\n` +
    `- **Penyimpanan terbatas**: IndexedDB memiliki batas penyimpanan ` +
    `yang bervariasi antar browser.\n` +
    `- **Kinerja client-side**: Semua komputasi embedding dan similarity ` +
    `dilakukan di sisi klien, tergantung pada perangkat pengguna.\n` +
    `- **Sinkronisasi**: Basis data chunk tersimpan lokal dan tidak ` +
    `tersinkronisasi antar perangkat.\n` +
    `- **Ukuran basis data**: Basis data chunk yang digunakan masih ` +
    `terbatas dibandingkan dengan solusi retrieval enterprise.\n\n` +
    `**Dampak:** Kualitas retrieval sangat bergantung pada kuantitas dan ` +
    `kualitas chunk dalam basis data lokal. Semakin banyak chunk berkualitas, ` +
    `semakin baik hasil retrieval.\n\n` +
    `## 5. Potensi Bias Respons\n\n` +
    `Model bahasa Large Language Model memiliki potensi bias:\n\n` +
    `- **Bias data training**: Model dilatih pada data internet yang mungkin ` +
    `mengandung bias gender, budaya, atau sosial.\n` +
    `- **Bias prompt**: Cara prompt ditulis dapat memengaruhi arah respons.\n` +
    `- **Bias aman (safe bias)**: Model cenderung memberikan respons yang aman ` +
    `dan generik daripada respons yang berani tapi relevan.\n` +
    `- **Bias bahasa**: Model mungkin lebih baik dalam merespon bahasa ` +
    `Indonesia formal daripada bahasa sehari-hari.\n\n` +
    `**Dampak:** Respons chatbot mungkin tidak selalu sesuai untuk semua ` +
    `demografi pengguna. Diperlukan kurasi dan monitoring berkelanjutan ` +
    `untuk memastikan respons tetap sesuai.\n\n` +
    `## Ringkasan untuk Sidang\n\n` +
    `**Jika dosen bertanya: "Apa kelemahan penelitian ini?"**\n\n` +
    `Jawab:\n` +
    `"Penelitian ini memiliki beberapa keterbatasan yang perlu diakui. ` +
    `Pertama, dataset pengujian yang terbatas (33 skenario) mungkin belum ` +
    `sepenuhnya mewakili keragaman kondisi emosional di dunia nyata. Kedua, ` +
    `evaluasi otomatis menggunakan keyword matching dan cosine similarity ` +
    `memiliki keterbatasan dalam menangkap nuansa semantik yang lebih dalam. ` +
    `Ketiga, chatbot ini hanyalah simulasi empati, bukan empati sungguhan, ` +
    `sehingga tidak dapat menggantikan konseling profesional. Meskipun ` +
    `demikian, hasil evaluasi menunjukkan bahwa sistem layak digunakan ` +
    `sebagai alat bantu dukungan emosional awal."`
  )
}

// ================================================================
// GENERATE LIMITATION SINGKAT
// ================================================================

export function generateLimitationSummary(): string {
  return (
    `Penelitian ini memiliki lima keterbatasan utama:\n\n` +
    `1. **Dataset terbatas**: 33 skenario belum cukup untuk generalisasi penuh.\n` +
    `2. **Evaluasi otomatis**: Keyword matching dan cosine similarity memiliki ` +
    `keterbatasan dalam memahami makna.\n` +
    `3. **Emotional AI terbatas**: Chatbot hanya mensimulasikan empati, tidak ` +
    `memilikinya secara genuine.\n` +
    `4. **Retrieval lokal**: IndexedDB memiliki keterbatasan penyimpanan dan ` +
    `kinerja yang bergantung pada perangkat.\n` +
    `5. **Potensi bias**: Model LLM dapat memiliki bias dari data training.\n\n` +
    `Keterbatasan-keterbatasan ini menjadi peluang untuk penelitian selanjutnya ` +
    `dan tidak mengurangi validitas temuan utama penelitian.`
  )
}
