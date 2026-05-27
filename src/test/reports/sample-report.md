# Laporan Evaluasi Sistem RAG Chatbot Curhat

**Judul Penelitian:** Evaluasi Sistem Retrieval-Augmented Generation (RAG) pada Chatbot Curhat Berbasis Emotional Context
**Tanggal:** 2026-05-27 10:00:00
**Institusi:** Universitas — Program Studi Ilmu Komputer

---

## Deskripsi

Laporan ini menyajikan hasil evaluasi terhadap sistem RAG chatbot curhat "Honey" menggunakan 10 skenario pengujian yang mencakup 6 kategori emosional: overthinking, anxiety, relationship problem, kehilangan motivasi, kesepian, dan stress kuliah. Setiap skenario dievaluasi berdasarkan similarity, relevansi, empati, konsistensi konteks, dan akurasi retrieval.

## Ringkasan Eksekutif

Rata-rata skor keseluruhan: **78/100**
Skor tertinggi: **92/100**
Skor terendah: **58/100**
Standar deviasi: **9.45**

### Distribusi Verdict

| Verdict | Jumlah |
|---------|--------|
| SANGAT_RELEVAN | 3 |
| RELEVAN | 5 |
| CUKUP | 2 |
| KURANG | 0 |
| TIDAK_RELEVAN | 0 |

### Rata-rata Skor per Kategori

| Kategori | Rata-rata |
|----------|-----------|
| Similarity | 75 |
| Relevance | 80 |
| Empathy | 82 |
| Contextual Consistency | 76 |
| Retrieval Accuracy | 74 |

## Hasil Evaluasi per Skenario

| # | Skenario | Similarity | Relevance | Empathy | Consistency | Retrieval | Overall |
|---|----------|------------|-----------|---------|-------------|-----------|---------|
| 1 | Overthinking Malam Hari | 82 | 85 | 88 | 80 | 78 | **84** |
| 2 | Overthinking Sosial | 75 | 78 | 80 | 74 | 72 | **76** |
| 3 | Kecemasan Tanpa Sebab | 88 | 90 | 92 | 85 | 82 | **88** |
| 4 | Kecemasan Sosial | 72 | 76 | 78 | 70 | 68 | **73** |
| 5 | Rasa Tidak Pantas | 80 | 84 | 86 | 78 | 76 | **81** |
| 6 | Pengkhianatan Hubungan | 85 | 88 | 90 | 82 | 80 | **85** |
| 7 | Kehilangan Semangat Hidup | 70 | 72 | 74 | 68 | 66 | **70** |
| 8 | Kesepian di Tengah Keramaian | 78 | 82 | 84 | 76 | 74 | **79** |
| 9 | Kesulitan Mencari Koneksi | 74 | 76 | 78 | 72 | 70 | **74** |
| 10 | Tugas Kuliah Menumpuk | 76 | 80 | 82 | 76 | 72 | **77** |

## Detail Evaluasi per Skenario

### Overthinking Malam Hari

**ID Skenario:** overthinking_001
**Timestamp:** 2026-05-27 10:00:00
**Skor Keseluruhan:** 84/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 82 | RELEVAN |
| Relevance | 85 | SANGAT_RELEVAN |
| Empathy | 88 | SANGAT_EMPATIK |
| Contextual Consistency | 80 | BAIK |
| Retrieval Accuracy | 78 | BAIK |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.72 |
| Text Overlap | 0.45 |
| Keyword Match | 0.68 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 80% |
| Recall | 75% |
| Avg Relevance Score | 76 |

---

### Kecemasan Tanpa Sebab

**ID Skenario:** anxiety_001
**Timestamp:** 2026-05-27 10:05:00
**Skor Keseluruhan:** 88/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 88 | SANGAT_RELEVAN |
| Relevance | 90 | SANGAT_RELEVAN |
| Empathy | 92 | SANGAT_EMPATIK |
| Contextual Consistency | 85 | SANGAT_KONSISTEN |
| Retrieval Accuracy | 82 | BAIK |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.78 |
| Text Overlap | 0.52 |
| Keyword Match | 0.75 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 85% |
| Recall | 80% |
| Avg Relevance Score | 82 |

---

### Pengkhianatan Hubungan

**ID Skenario:** relationship_002
**Timestamp:** 2026-05-27 10:15:00
**Skor Keseluruhan:** 85/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 85 | SANGAT_RELEVAN |
| Relevance | 88 | SANGAT_RELEVAN |
| Empathy | 90 | SANGAT_EMPATIK |
| Contextual Consistency | 82 | BAIK |
| Retrieval Accuracy | 80 | BAIK |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.75 |
| Text Overlap | 0.48 |
| Keyword Match | 0.72 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 82% |
| Recall | 78% |
| Avg Relevance Score | 80 |

---

### Kehilangan Semangat Hidup

**ID Skenario:** motivation_001
**Timestamp:** 2026-05-27 10:20:00
**Skor Keseluruhan:** 70/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 70 | RELEVAN |
| Relevance | 72 | RELEVAN |
| Empathy | 74 | EMPATIK |
| Contextual Consistency | 68 | CUKUP |
| Retrieval Accuracy | 66 | CUKUP |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.58 |
| Text Overlap | 0.35 |
| Keyword Match | 0.55 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 70% |
| Recall | 65% |
| Avg Relevance Score | 62 |

---

## Interpretasi Akademik

Berdasarkan hasil evaluasi terhadap 10 skenario pengujian, sistem RAG chatbot curhat menunjukkan performa yang **baik** dengan rata-rata skor 78/100. Sistem mampu merespon curhat user secara relevan, empatik, dan konsisten dengan konteks emosional yang diberikan.

### Analisis per Dimensi

**Similarity (75):** Respons chatbot memiliki kesamaan yang baik dengan konteks query, menunjukkan bahwa sistem mampu memahami dan merespon sesuai topik.

**Relevance (80):** Sistem menunjukkan relevansi yang baik secara konten dan emosional. Respons sesuai dengan kondisi emosional user.

**Empati (82):** Chatbot menunjukkan tingkat empati yang baik, mampu memvalidasi perasaan user dan memberikan dukungan emosional yang sesuai. Ini adalah skor tertinggi, menunjukkan bahwa pendekatan RAG dengan emotional context berhasil menciptakan respons yang hangat.

**Konsistensi Konteks (76):** Sistem cukup konsisten dalam mempertahankan konteks emosional sepanjang respons. Masih ada ruang untuk peningkatan dalam menjaga konsistensi dengan retrieved chunks.

**Akurasi Retrieval (74):** Sistem RAG berfungsi dengan cukup baik dalam mengambil konteks yang relevan. Precision dan recall menunjukkan bahwa sebagian besar chunk yang diretrieve memang relevan, namun masih ada beberapa chunk kurang relevan yang terambil.

### Analisis per Kategori

1. **Overthinking (skor 76-84):** Sistem sangat baik dalam menangani overthinking, dengan empati tinggi dan validasi yang tepat.

2. **Anxiety (skor 73-88):** Kecemasan umum mendapat skor tertinggi, menunjukkan bahwa sistem sangat baik dalam merespon kecemasan. Social anxiety sedikit lebih rendah karena kompleksitasnya.

3. **Relationship (skor 81-85):** Sistem menunjukkan empati yang dalam untuk masalah hubungan, terutama untuk kasus pengkhianatan.

4. **Motivasi (skor 70):** Kategori ini mendapat skor terendah. Sistem cenderung memberikan respons yang lebih umum untuk kehilangan motivasi.

5. **Kesepian (skor 74-79):** Sistem cukup baik dalam merespon kesepian, dengan nada yang hangat dan companionable.

6. **Stress Kuliah (skor 77):** Sistem merespon stress akademik dengan validasi yang baik, namun bisa ditingkatkan dalam memberikan perspektif.

### Kesimpulan

Sistem RAG chatbot curhat layak digunakan untuk memberikan dukungan emosional awal kepada user. Sistem mampu menunjukkan empati dan konsistensi yang baik dalam merespon berbagai skenario emosional. Namun, perlu diingat bahwa chatbot ini bukan pengganti konseling profesional dan hanya berfungsi sebagai alat bantu dukungan emosional.

### Saran Pengembangan

1. **Perluas database chunk** untuk kategori motivasi dan stress agar retrieval lebih akurat.
2. **Tingkatkan variasi respons** untuk menghindari pengulangan pola yang sama.
3. **Tambahkan mekanisme deteksi krisis** untuk kasus dengan severity level tinggi.
4. **Optimasi threshold similarity** untuk meningkatkan precision retrieval.

---

_Laporan ini digenerate secara otomatis oleh sistem evaluasi RAG Chatbot Curhat._
_Digunakan untuk keperluan akademik skripsi._
