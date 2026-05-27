# Laporan Evaluasi Sistem RAG Chatbot Curhat

**Judul Penelitian:** Evaluasi Sistem Retrieval-Augmented Generation (RAG) pada Chatbot Curhat Berbasis Emotional Context
**Tanggal:** 2026-05-27T06:47:58.526Z
**Institusi:** Universitas — Program Studi Ilmu Komputer

---

## Deskripsi

Laporan ini menyajikan hasil evaluasi terhadap sistem RAG chatbot curhat "Honey" menggunakan 32 skenario pengujian yang mencakup 10 kategori emosional: overthinking, anxiety, relationship, insecure, keluarga, kehilangan motivasi, stress kuliah, kesepian, burnout, dan self doubt. Setiap skenario dievaluasi berdasarkan similarity, relevansi, empati, konsistensi konteks, dan akurasi retrieval.

## Ringkasan Eksekutif

Rata-rata skor keseluruhan: **66/100**
Skor tertinggi: **71/100**
Skor terendah: **61/100**
Standar deviasi: **2.58**

### Distribusi Verdict

| Verdict | Jumlah |
|---------|--------|
| CUKUP | 31 |
| RELEVAN | 1 |

### Rata-rata Skor per Kategori

| Kategori | Rata-rata |
|----------|-----------|
| Similarity | 53 |
| Relevance | 49 |
| Empathy | 62 |
| Contextual Consistency | 88 |
| Retrieval Accuracy | 80 |

## Hasil Evaluasi per Skenario

| # | Skenario | Similarity | Relevance | Empathy | Consistency | Retrieval | Overall |
|---|----------|------------|-----------|---------|-------------|-----------|---------|
| 1 | Overthinking Malam Hari | 46 | 56 | 65 | 100 | 80 | **69** |
| 2 | Overthinking Sosial | 59 | 51 | 63 | 73 | 81 | **65** |
| 3 | Overthinking Masa Depan | 52 | 44 | 63 | 80 | 80 | **64** |
| 4 | Overthinking karena Membandingkan Diri | 44 | 46 | 71 | 73 | 81 | **63** |
| 5 | Kecemasan Tanpa Sebab Jelas | 49 | 54 | 61 | 93 | 80 | **67** |
| 6 | Kecemasan Sosial | 54 | 53 | 65 | 90 | 81 | **69** |
| 7 | Kecemasan tentang Kesehatan | 45 | 37 | 51 | 93 | 80 | **61** |
| 8 | Kecemasan Akan Kegagalan | 56 | 35 | 56 | 83 | 80 | **62** |
| 9 | Rasa Tidak Pantas dalam Hubungan | 52 | 51 | 67 | 93 | 80 | **69** |
| 10 | Pengkhianatan dalam Hubungan | 56 | 58 | 65 | 93 | 80 | **70** |
| 11 | Kesalahpahaman dengan Pasangan | 47 | 51 | 65 | 83 | 80 | **65** |
| 12 | Self Doubt Akademik | 53 | 47 | 63 | 83 | 81 | **65** |
| 13 | Impostor Syndrome | 55 | 51 | 67 | 93 | 80 | **69** |
| 14 | Insecure dengan Penampilan Fisik | 53 | 48 | 63 | 100 | 80 | **69** |
| 15 | Insecure dalam Bersosialisasi | 53 | 49 | 65 | 80 | 81 | **66** |
| 16 | Konflik dengan Orang Tua | 53 | 46 | 63 | 90 | 80 | **66** |
| 17 | Broken Home | 56 | 47 | 58 | 100 | 80 | **68** |
| 18 | Tekanan Ekspektasi Keluarga | 53 | 56 | 63 | 83 | 80 | **67** |
| 19 | Tidak Bisa Terbuka dengan Keluarga | 60 | 52 | 58 | 100 | 80 | **70** |
| 20 | Kehilangan Semangat Hidup | 54 | 52 | 65 | 93 | 80 | **69** |
| 21 | Kehilangan Arah Hidup | 57 | 53 | 63 | 100 | 80 | **71** |
| 22 | Merasa Tidak Berguna | 56 | 44 | 62 | 93 | 80 | **67** |
| 23 | Tugas Kuliah Menumpuk | 55 | 44 | 58 | 80 | 81 | **64** |
| 24 | Burnout Akademik | 53 | 54 | 58 | 93 | 80 | **68** |
| 25 | Prokrastinasi karena Stress Kuliah | 49 | 42 | 63 | 83 | 81 | **64** |
| 26 | Kesepian di Tengah Keramaian | 57 | 54 | 61 | 90 | 80 | **68** |
| 27 | Kesulitan Mencari Koneksi | 56 | 52 | 60 | 80 | 80 | **66** |
| 28 | Kesepian di Kota Baru | 52 | 45 | 63 | 90 | 81 | **66** |
| 29 | Kesepian karena Kehilangan Teman | 48 | 42 | 63 | 83 | 80 | **63** |
| 30 | Burnout Rutinitas | 51 | 47 | 58 | 73 | 80 | **62** |
| 31 | Burnout Organisasi dan Akademik | 45 | 53 | 63 | 93 | 80 | **67** |
| 32 | Burnout karena Overworking | 51 | 45 | 63 | 83 | 81 | **65** |

## Detail Evaluasi per Skenario

### Overthinking Malam Hari

**ID Skenario:** overthinking_001
**Timestamp:** 2026-05-27T06:47:58.505Z
**Skor Keseluruhan:** 69/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 46 | CUKUP |
| Relevance | 56 | CUKUP |
| Empathy | 65 | CUKUP |
| Contextual Consistency | 100 | SANGAT_KONSISTEN |
| Retrieval Accuracy | 80 | AKURAT |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.257 |
| Text Overlap | 0.185 |
| Keyword Match | 1 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 100% |
| Recall | 100% |
| Avg Relevance Score | 1 |

**Catatan:** Kategori: overthinking, Severity: 3

---

### Overthinking Sosial

**ID Skenario:** overthinking_002
**Timestamp:** 2026-05-27T06:47:58.506Z
**Skor Keseluruhan:** 65/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 59 | CUKUP |
| Relevance | 51 | KURANG |
| Empathy | 63 | CUKUP |
| Contextual Consistency | 73 | KONSISTEN |
| Retrieval Accuracy | 81 | AKURAT |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.379 |
| Text Overlap | 0.467 |
| Keyword Match | 1 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 100% |
| Recall | 100% |
| Avg Relevance Score | 3 |

**Catatan:** Kategori: overthinking, Severity: 2

---

### Overthinking Masa Depan

**ID Skenario:** overthinking_003
**Timestamp:** 2026-05-27T06:47:58.507Z
**Skor Keseluruhan:** 64/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 52 | CUKUP |
| Relevance | 44 | KURANG |
| Empathy | 63 | CUKUP |
| Contextual Consistency | 80 | KONSISTEN |
| Retrieval Accuracy | 80 | AKURAT |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.288 |
| Text Overlap | 0.542 |
| Keyword Match | 0.8 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 100% |
| Recall | 100% |
| Avg Relevance Score | 1 |

**Catatan:** Kategori: overthinking, Severity: 3

---

### Overthinking karena Membandingkan Diri

**ID Skenario:** overthinking_004
**Timestamp:** 2026-05-27T06:47:58.508Z
**Skor Keseluruhan:** 63/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 44 | CUKUP |
| Relevance | 46 | KURANG |
| Empathy | 71 | EMPATIK |
| Contextual Consistency | 73 | KONSISTEN |
| Retrieval Accuracy | 81 | AKURAT |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.354 |
| Text Overlap | 0.18 |
| Keyword Match | 0.8 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 100% |
| Recall | 100% |
| Avg Relevance Score | 5 |

**Catatan:** Kategori: overthinking, Severity: 3

---

### Kecemasan Tanpa Sebab Jelas

**ID Skenario:** anxiety_001
**Timestamp:** 2026-05-27T06:47:58.509Z
**Skor Keseluruhan:** 67/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 49 | CUKUP |
| Relevance | 54 | KURANG |
| Empathy | 61 | CUKUP |
| Contextual Consistency | 93 | SANGAT_KONSISTEN |
| Retrieval Accuracy | 80 | AKURAT |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.357 |
| Text Overlap | 0.368 |
| Keyword Match | 0.8 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 100% |
| Recall | 100% |
| Avg Relevance Score | 0 |

**Catatan:** Kategori: anxiety, Severity: 4

---

### Kecemasan Sosial

**ID Skenario:** anxiety_002
**Timestamp:** 2026-05-27T06:47:58.510Z
**Skor Keseluruhan:** 69/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 54 | CUKUP |
| Relevance | 53 | KURANG |
| Empathy | 65 | CUKUP |
| Contextual Consistency | 90 | SANGAT_KONSISTEN |
| Retrieval Accuracy | 81 | AKURAT |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.296 |
| Text Overlap | 0.403 |
| Keyword Match | 1 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 100% |
| Recall | 100% |
| Avg Relevance Score | 3 |

**Catatan:** Kategori: anxiety, Severity: 3

---

### Kecemasan tentang Kesehatan

**ID Skenario:** anxiety_003
**Timestamp:** 2026-05-27T06:47:58.511Z
**Skor Keseluruhan:** 61/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 45 | CUKUP |
| Relevance | 37 | TIDAK_RELEVAN |
| Empathy | 51 | KURANG |
| Contextual Consistency | 93 | SANGAT_KONSISTEN |
| Retrieval Accuracy | 80 | AKURAT |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.368 |
| Text Overlap | 0.223 |
| Keyword Match | 0.8 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 100% |
| Recall | 100% |
| Avg Relevance Score | 0 |

**Catatan:** Kategori: anxiety, Severity: 4

---

### Kecemasan Akan Kegagalan

**ID Skenario:** anxiety_004
**Timestamp:** 2026-05-27T06:47:58.512Z
**Skor Keseluruhan:** 62/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 56 | CUKUP |
| Relevance | 35 | TIDAK_RELEVAN |
| Empathy | 56 | CUKUP |
| Contextual Consistency | 83 | KONSISTEN |
| Retrieval Accuracy | 80 | AKURAT |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.354 |
| Text Overlap | 0.396 |
| Keyword Match | 1 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 100% |
| Recall | 100% |
| Avg Relevance Score | 1 |

**Catatan:** Kategori: anxiety, Severity: 3

---

### Rasa Tidak Pantas dalam Hubungan

**ID Skenario:** relationship_001
**Timestamp:** 2026-05-27T06:47:58.513Z
**Skor Keseluruhan:** 69/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 52 | CUKUP |
| Relevance | 51 | KURANG |
| Empathy | 67 | CUKUP |
| Contextual Consistency | 93 | SANGAT_KONSISTEN |
| Retrieval Accuracy | 80 | AKURAT |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.334 |
| Text Overlap | 0.303 |
| Keyword Match | 1 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 100% |
| Recall | 100% |
| Avg Relevance Score | 0 |

**Catatan:** Kategori: relationship, Severity: 3

---

### Pengkhianatan dalam Hubungan

**ID Skenario:** relationship_002
**Timestamp:** 2026-05-27T06:47:58.514Z
**Skor Keseluruhan:** 70/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 56 | CUKUP |
| Relevance | 58 | CUKUP |
| Empathy | 65 | CUKUP |
| Contextual Consistency | 93 | SANGAT_KONSISTEN |
| Retrieval Accuracy | 80 | AKURAT |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.407 |
| Text Overlap | 0.332 |
| Keyword Match | 1 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 100% |
| Recall | 100% |
| Avg Relevance Score | 0 |

**Catatan:** Kategori: relationship, Severity: 5

---

### Kesalahpahaman dengan Pasangan

**ID Skenario:** relationship_003
**Timestamp:** 2026-05-27T06:47:58.514Z
**Skor Keseluruhan:** 65/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 47 | CUKUP |
| Relevance | 51 | KURANG |
| Empathy | 65 | CUKUP |
| Contextual Consistency | 83 | KONSISTEN |
| Retrieval Accuracy | 80 | AKURAT |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.288 |
| Text Overlap | 0.199 |
| Keyword Match | 1 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 100% |
| Recall | 100% |
| Avg Relevance Score | 0 |

**Catatan:** Kategori: relationship, Severity: 3

---

### Self Doubt Akademik

**ID Skenario:** self_doubt_001
**Timestamp:** 2026-05-27T06:47:58.515Z
**Skor Keseluruhan:** 65/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 53 | CUKUP |
| Relevance | 47 | KURANG |
| Empathy | 63 | CUKUP |
| Contextual Consistency | 83 | KONSISTEN |
| Retrieval Accuracy | 81 | AKURAT |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.298 |
| Text Overlap | 0.368 |
| Keyword Match | 1 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 100% |
| Recall | 100% |
| Avg Relevance Score | 4 |

**Catatan:** Kategori: insecure, Severity: 3

---

### Impostor Syndrome

**ID Skenario:** self_doubt_002
**Timestamp:** 2026-05-27T06:47:58.516Z
**Skor Keseluruhan:** 69/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 55 | CUKUP |
| Relevance | 51 | KURANG |
| Empathy | 67 | CUKUP |
| Contextual Consistency | 93 | SANGAT_KONSISTEN |
| Retrieval Accuracy | 80 | AKURAT |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.377 |
| Text Overlap | 0.332 |
| Keyword Match | 1 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 100% |
| Recall | 100% |
| Avg Relevance Score | 0 |

**Catatan:** Kategori: insecure, Severity: 3

---

### Insecure dengan Penampilan Fisik

**ID Skenario:** insecure_001
**Timestamp:** 2026-05-27T06:47:58.516Z
**Skor Keseluruhan:** 69/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 53 | CUKUP |
| Relevance | 48 | KURANG |
| Empathy | 63 | CUKUP |
| Contextual Consistency | 100 | SANGAT_KONSISTEN |
| Retrieval Accuracy | 80 | AKURAT |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.354 |
| Text Overlap | 0.303 |
| Keyword Match | 1 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 100% |
| Recall | 100% |
| Avg Relevance Score | 0 |

**Catatan:** Kategori: insecure, Severity: 4

---

### Insecure dalam Bersosialisasi

**ID Skenario:** insecure_002
**Timestamp:** 2026-05-27T06:47:58.517Z
**Skor Keseluruhan:** 66/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 53 | CUKUP |
| Relevance | 49 | KURANG |
| Empathy | 65 | CUKUP |
| Contextual Consistency | 80 | KONSISTEN |
| Retrieval Accuracy | 81 | AKURAT |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.336 |
| Text Overlap | 0.307 |
| Keyword Match | 1 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 100% |
| Recall | 100% |
| Avg Relevance Score | 4 |

**Catatan:** Kategori: insecure, Severity: 3

---

### Konflik dengan Orang Tua

**ID Skenario:** keluarga_001
**Timestamp:** 2026-05-27T06:47:58.518Z
**Skor Keseluruhan:** 66/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 53 | CUKUP |
| Relevance | 46 | KURANG |
| Empathy | 63 | CUKUP |
| Contextual Consistency | 90 | SANGAT_KONSISTEN |
| Retrieval Accuracy | 80 | AKURAT |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.327 |
| Text Overlap | 0.335 |
| Keyword Match | 1 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 100% |
| Recall | 100% |
| Avg Relevance Score | 0 |

**Catatan:** Kategori: keluarga, Severity: 4

---

### Broken Home

**ID Skenario:** keluarga_002
**Timestamp:** 2026-05-27T06:47:58.518Z
**Skor Keseluruhan:** 68/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 56 | CUKUP |
| Relevance | 47 | KURANG |
| Empathy | 58 | CUKUP |
| Contextual Consistency | 100 | SANGAT_KONSISTEN |
| Retrieval Accuracy | 80 | AKURAT |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.404 |
| Text Overlap | 0.333 |
| Keyword Match | 1 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 100% |
| Recall | 100% |
| Avg Relevance Score | 0 |

**Catatan:** Kategori: keluarga, Severity: 5

---

### Tekanan Ekspektasi Keluarga

**ID Skenario:** keluarga_003
**Timestamp:** 2026-05-27T06:47:58.519Z
**Skor Keseluruhan:** 67/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 53 | CUKUP |
| Relevance | 56 | CUKUP |
| Empathy | 63 | CUKUP |
| Contextual Consistency | 83 | KONSISTEN |
| Retrieval Accuracy | 80 | AKURAT |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.327 |
| Text Overlap | 0.331 |
| Keyword Match | 1 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 100% |
| Recall | 100% |
| Avg Relevance Score | 1 |

**Catatan:** Kategori: keluarga, Severity: 4

---

### Tidak Bisa Terbuka dengan Keluarga

**ID Skenario:** keluarga_004
**Timestamp:** 2026-05-27T06:47:58.520Z
**Skor Keseluruhan:** 70/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 60 | RELEVAN |
| Relevance | 52 | KURANG |
| Empathy | 58 | CUKUP |
| Contextual Consistency | 100 | SANGAT_KONSISTEN |
| Retrieval Accuracy | 80 | AKURAT |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.42 |
| Text Overlap | 0.43 |
| Keyword Match | 1 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 100% |
| Recall | 100% |
| Avg Relevance Score | 2 |

**Catatan:** Kategori: keluarga, Severity: 3

---

### Kehilangan Semangat Hidup

**ID Skenario:** motivation_001
**Timestamp:** 2026-05-27T06:47:58.520Z
**Skor Keseluruhan:** 69/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 54 | CUKUP |
| Relevance | 52 | KURANG |
| Empathy | 65 | CUKUP |
| Contextual Consistency | 93 | SANGAT_KONSISTEN |
| Retrieval Accuracy | 80 | AKURAT |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.314 |
| Text Overlap | 0.367 |
| Keyword Match | 1 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 100% |
| Recall | 100% |
| Avg Relevance Score | 0 |

**Catatan:** Kategori: motivation, Severity: 3

---

### Kehilangan Arah Hidup

**ID Skenario:** motivation_002
**Timestamp:** 2026-05-27T06:47:58.521Z
**Skor Keseluruhan:** 71/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 57 | CUKUP |
| Relevance | 53 | KURANG |
| Empathy | 63 | CUKUP |
| Contextual Consistency | 100 | SANGAT_KONSISTEN |
| Retrieval Accuracy | 80 | AKURAT |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.291 |
| Text Overlap | 0.519 |
| Keyword Match | 1 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 100% |
| Recall | 100% |
| Avg Relevance Score | 1 |

**Catatan:** Kategori: motivation, Severity: 3

---

### Merasa Tidak Berguna

**ID Skenario:** motivation_003
**Timestamp:** 2026-05-27T06:47:58.521Z
**Skor Keseluruhan:** 67/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 56 | CUKUP |
| Relevance | 44 | KURANG |
| Empathy | 62 | CUKUP |
| Contextual Consistency | 93 | SANGAT_KONSISTEN |
| Retrieval Accuracy | 80 | AKURAT |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.29 |
| Text Overlap | 0.47 |
| Keyword Match | 1 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 100% |
| Recall | 100% |
| Avg Relevance Score | 0 |

**Catatan:** Kategori: motivation, Severity: 4

---

### Tugas Kuliah Menumpuk

**ID Skenario:** stress_001
**Timestamp:** 2026-05-27T06:47:58.522Z
**Skor Keseluruhan:** 64/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 55 | CUKUP |
| Relevance | 44 | KURANG |
| Empathy | 58 | CUKUP |
| Contextual Consistency | 80 | KONSISTEN |
| Retrieval Accuracy | 81 | AKURAT |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.358 |
| Text Overlap | 0.369 |
| Keyword Match | 1 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 100% |
| Recall | 100% |
| Avg Relevance Score | 3 |

**Catatan:** Kategori: stress, Severity: 4

---

### Burnout Akademik

**ID Skenario:** stress_002
**Timestamp:** 2026-05-27T06:47:58.522Z
**Skor Keseluruhan:** 68/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 53 | CUKUP |
| Relevance | 54 | KURANG |
| Empathy | 58 | CUKUP |
| Contextual Consistency | 93 | SANGAT_KONSISTEN |
| Retrieval Accuracy | 80 | AKURAT |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.339 |
| Text Overlap | 0.303 |
| Keyword Match | 1 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 100% |
| Recall | 100% |
| Avg Relevance Score | 2 |

**Catatan:** Kategori: stress, Severity: 4

---

### Prokrastinasi karena Stress Kuliah

**ID Skenario:** stress_003
**Timestamp:** 2026-05-27T06:47:58.522Z
**Skor Keseluruhan:** 64/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 49 | CUKUP |
| Relevance | 42 | KURANG |
| Empathy | 63 | CUKUP |
| Contextual Consistency | 83 | KONSISTEN |
| Retrieval Accuracy | 81 | AKURAT |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.242 |
| Text Overlap | 0.304 |
| Keyword Match | 1 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 100% |
| Recall | 100% |
| Avg Relevance Score | 5 |

**Catatan:** Kategori: stress, Severity: 3

---

### Kesepian di Tengah Keramaian

**ID Skenario:** loneliness_001
**Timestamp:** 2026-05-27T06:47:58.523Z
**Skor Keseluruhan:** 68/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 57 | CUKUP |
| Relevance | 54 | KURANG |
| Empathy | 61 | CUKUP |
| Contextual Consistency | 90 | SANGAT_KONSISTEN |
| Retrieval Accuracy | 80 | AKURAT |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.487 |
| Text Overlap | 0.248 |
| Keyword Match | 1 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 100% |
| Recall | 100% |
| Avg Relevance Score | 1 |

**Catatan:** Kategori: loneliness, Severity: 3

---

### Kesulitan Mencari Koneksi

**ID Skenario:** loneliness_002
**Timestamp:** 2026-05-27T06:47:58.523Z
**Skor Keseluruhan:** 66/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 56 | CUKUP |
| Relevance | 52 | KURANG |
| Empathy | 60 | CUKUP |
| Contextual Consistency | 80 | KONSISTEN |
| Retrieval Accuracy | 80 | AKURAT |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.425 |
| Text Overlap | 0.293 |
| Keyword Match | 1 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 100% |
| Recall | 100% |
| Avg Relevance Score | 1 |

**Catatan:** Kategori: loneliness, Severity: 4

---

### Kesepian di Kota Baru

**ID Skenario:** loneliness_003
**Timestamp:** 2026-05-27T06:47:58.524Z
**Skor Keseluruhan:** 66/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 52 | CUKUP |
| Relevance | 45 | KURANG |
| Empathy | 63 | CUKUP |
| Contextual Consistency | 90 | SANGAT_KONSISTEN |
| Retrieval Accuracy | 81 | AKURAT |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.249 |
| Text Overlap | 0.398 |
| Keyword Match | 1 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 100% |
| Recall | 100% |
| Avg Relevance Score | 6 |

**Catatan:** Kategori: loneliness, Severity: 3

---

### Kesepian karena Kehilangan Teman

**ID Skenario:** loneliness_004
**Timestamp:** 2026-05-27T06:47:58.524Z
**Skor Keseluruhan:** 63/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 48 | CUKUP |
| Relevance | 42 | KURANG |
| Empathy | 63 | CUKUP |
| Contextual Consistency | 83 | KONSISTEN |
| Retrieval Accuracy | 80 | AKURAT |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.294 |
| Text Overlap | 0.223 |
| Keyword Match | 1 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 100% |
| Recall | 100% |
| Avg Relevance Score | 1 |

**Catatan:** Kategori: loneliness, Severity: 3

---

### Burnout Rutinitas

**ID Skenario:** burnout_001
**Timestamp:** 2026-05-27T06:47:58.525Z
**Skor Keseluruhan:** 62/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 51 | CUKUP |
| Relevance | 47 | KURANG |
| Empathy | 58 | CUKUP |
| Contextual Consistency | 73 | KONSISTEN |
| Retrieval Accuracy | 80 | AKURAT |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.362 |
| Text Overlap | 0.207 |
| Keyword Match | 1 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 100% |
| Recall | 100% |
| Avg Relevance Score | 0 |

**Catatan:** Kategori: burnout, Severity: 4

---

### Burnout Organisasi dan Akademik

**ID Skenario:** burnout_002
**Timestamp:** 2026-05-27T06:47:58.525Z
**Skor Keseluruhan:** 67/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 45 | CUKUP |
| Relevance | 53 | KURANG |
| Empathy | 63 | CUKUP |
| Contextual Consistency | 93 | SANGAT_KONSISTEN |
| Retrieval Accuracy | 80 | AKURAT |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.304 |
| Text Overlap | 0.304 |
| Keyword Match | 0.8 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 100% |
| Recall | 100% |
| Avg Relevance Score | 0 |

**Catatan:** Kategori: burnout, Severity: 5

---

### Burnout karena Overworking

**ID Skenario:** burnout_003
**Timestamp:** 2026-05-27T06:47:58.526Z
**Skor Keseluruhan:** 65/100

| Dimensi | Skor | Verdict |
|---------|------|---------|
| Similarity | 51 | CUKUP |
| Relevance | 45 | KURANG |
| Empathy | 63 | CUKUP |
| Contextual Consistency | 83 | KONSISTEN |
| Retrieval Accuracy | 81 | AKURAT |

#### Detail Similarity

| Metrik | Nilai |
|--------|-------|
| Cosine Similarity | 0.36 |
| Text Overlap | 0.222 |
| Keyword Match | 1 |

#### Detail Retrieval Accuracy

| Metrik | Nilai |
|--------|-------|
| Precision | 100% |
| Recall | 100% |
| Avg Relevance Score | 6 |

**Catatan:** Kategori: burnout, Severity: 4

---

## Interpretasi Akademik

Berdasarkan hasil evaluasi terhadap 32 skenario pengujian, sistem RAG chatbot curhat menunjukkan performa yang **baik** dengan rata-rata skor 66/100. Sebagian besar respons sesuai dengan konteks emosional, meskipun masih terdapat beberapa area yang perlu ditingkatkan.### Analisis per Dimensi**Similarity (53):** Perlu peningkatan dalam kesesuaian respons dengan konteks query user.**Empati (62):** Perlu peningkatan dalam aspek empati, terutama dalam validasi emosional dan dukungan.**Akurasi Retrieval (80):** Sistem RAG berfungsi dengan baik dalam mengambil konteks yang relevan dari database chunk.### KesimpulanSistem RAG chatbot curhat masih memerlukan pengembangan lebih lanjut sebelum dapat digunakan secara luas. Disarankan untuk melakukan iterasi perbaikan pada komponen retrieval dan prompt engineering untuk meningkatkan kualitas respons.

---

_Laporan ini digenerate secara otomatis oleh sistem evaluasi RAG Chatbot Curhat._
_Digunakan untuk keperluan akademik skripsi._
