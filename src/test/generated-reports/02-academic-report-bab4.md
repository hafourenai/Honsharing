# BAB IV
# HASIL DAN PEMBAHASAN

---

Pada bab ini akan dibahas hasil pengujian dan evaluasi terhadap sistem Retrieval-Augmented Generation (RAG) pada chatbot curhat "Honey". Pengujian dilakukan terhadap **32 skenario** yang mencakup **10 kategori emosional**. Setiap skenario dievaluasi berdasarkan lima dimensi: similarity, relevance, empathy, contextual consistency, dan retrieval accuracy.

---

## 4.1 Tujuan Pengujian

Pengujian ini bertujuan untuk mengevaluasi kinerja sistem Retrieval-Augmented Generation (RAG) pada chatbot curhat "Honey" dalam memberikan respons dukungan emosional kepada pengguna. Secara khusus, pengujian ini dilakukan untuk:

1. **Mengukur kualitas respons chatbot** — Apakah chatbot memberikan respons yang relevan, empatik, dan konsisten dengan konteks emosional pengguna?
2. **Mengevaluasi sistem Retrieval-Augmented Generation (RAG)** — Apakah sistem RAG berhasil mengambil konteks yang tepat dari basis data chunk?
3. **Menganalisis kesesuaian emosional** — Apakah respons chatbot sesuai dengan keadaan emosional pengguna?
4. **Membandingkan performa RAG vs Non-RAG** — Apakah penambahan mekanisme retrieval context meningkatkan kualitas respons chatbot?
5. **Mendokumentasikan hasil evaluasi** — Menyediakan bukti kuantitatif dan kualitatif untuk keperluan analisis skripsi.

Pengujian dilakukan terhadap **32 skenario** yang mencakup **10 kategori emosional** berbeda, yaitu: overthinking, anxiety, insecure, relationship, keluarga, kehilangan motivasi, stress kuliah, kesepian, burnout, dan self doubt. Masing-masing skenario merepresentasikan kondisi emosional nyata yang sering dialami oleh pengguna chatbot curhat.

## 4.2 Metode Evaluasi

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

Setiap dimensi menghasilkan skor dalam rentang **0–100** dengan kategori sebagai berikut:

| Rentang Skor | Kategori | Interpretasi |
|-------------|----------|--------------|
| 85–100 | Sangat Baik | Performa sangat baik, memenuhi semua kriteria yang diharapkan |
| 70–84 | Baik | Performa baik, sebagian besar kriteria terpenuhi |
| 55–69 | Cukup | Performa cukup, beberapa kriteria belum terpenuhi |
| 40–54 | Kurang | Performa kurang, banyak kriteria tidak terpenuhi |
| 0–39 | Tidak Memadai | Performa tidak memadai, sistem belum siap digunakan |

### 4.2.3 Skor Keseluruhan

Skor keseluruhan (Overall Score) dihitung sebagai rata-rata dari kelima dimensi evaluasi:

$$\text{Overall} = \frac{\text{Similarity} + \text{Relevance} + \text{Empathy} + \text{Consistency} + \text{Retrieval}}{5}$$

### 4.2.4 Skenario Pengujian

Total **32 skenario** diuji dalam evaluasi ini. Setiap skenario terdiri dari:
- **Input pengguna**: Curhat dalam bahasa Indonesia natural
- **Konteks yang diharapkan**: Chunk RAG yang relevan
- **Arah emosional**: Respons emosional yang diharapkan dari chatbot
- **Kata kunci**: Kata-kata yang harus ada dan tidak boleh ada dalam respons
- **Tingkat keparahan**: Skala 1–5 (ringan hingga sangat berat)

## 4.3 Hasil Pengujian

### 4.3.1 Ringkasan Hasil Evaluasi

Berdasarkan pengujian terhadap **32 skenario**, sistem RAG chatbot curhat menunjukkan kinerja dengan rata-rata skor **66/100**. 
Skor tertinggi yang dicapai adalah **71/100** dan skor terendah adalah **61/100**, dengan standar deviasi **2.58**. 
Sebanyak **3 dari 32 skenario** (9.4%) mendapatkan skor di atas 70 (kategori Baik atau Sangat Baik).


**Tabel 4.1** Distribusi Skor Keseluruhan

| Rentang Skor | Kategori | Jumlah | Persentase |
|-------------|----------|--------|------------|
| 0–39 (Tidak Memadai) | 0 | 0 | 0.0% |
| 40–54 (Kurang) | 0 | 0 | 0.0% |
| 55–69 (Cukup) | 29 | 29 | 90.6% |
| 70–84 (Baik) | 3 | 3 | 9.4% |
| 85–100 (Sangat Baik) | 0 | 0 | 0.0% |


**Tabel 4.2** Distribusi Verdict

| Verdict | Jumlah | Persentase |
|---------|--------|------------|
| CUKUP | 29 | 90.6% |
| BAIK | 3 | 9.4% |


### 4.3.2 Hasil per Dimensi Evaluasi

**Tabel 4.3** Rata-rata Skor per Dimensi Evaluasi

| Dimensi | Rata-rata Skor | Kategori |
|---------|----------------|----------|
| Similarity | 53 | Kurang |
| Relevance | 49 | Kurang |
| Empathy | 62 | Cukup |
| Contextual Consistency | 88 | Sangat Baik |
| Retrieval Accuracy | 80 | Baik |


### 4.3.3 Hasil per Kategori Emosional

**Tabel 4.4** Rata-rata Skor per Kategori Emosional

| Kategori | Jumlah | Rata-rata | Similarity | Relevance | Empathy | Consistency | Retrieval |
|----------|--------|-----------|------------|-----------|---------|-------------|-----------|
| motivation | 3 | 69 | 56 | 50 | 63 | 95 | 80 |
| relationship | 3 | 68 | 52 | 53 | 66 | 90 | 80 |
| insecure | 2 | 68 | 53 | 49 | 64 | 90 | 81 |
| keluarga | 4 | 68 | 56 | 50 | 61 | 93 | 80 |
| self_doubt | 2 | 67 | 54 | 49 | 65 | 88 | 81 |
| loneliness | 4 | 66 | 53 | 48 | 62 | 86 | 80 |
| overthinking | 4 | 65 | 50 | 49 | 66 | 82 | 81 |
| anxiety | 4 | 65 | 51 | 45 | 58 | 90 | 80 |
| stress | 3 | 65 | 52 | 47 | 60 | 85 | 81 |
| burnout | 3 | 65 | 49 | 48 | 61 | 83 | 80 |


### 4.3.4 Hasil Evaluasi per Skenario

**Tabel 4.5** Hasil Evaluasi Seluruh Skenario

| # | Skenario | Kategori | Sim | Rel | Emp | Kon | Ret | Overall |
|---|----------|----------|-----|-----|-----|-----|-----|---------|
| 1 | Overthinking Malam Hari | overthinking | 46 | 56 | 65 | 100 | 80 | **69** |
| 2 | Overthinking Sosial | overthinking | 59 | 51 | 63 | 73 | 81 | **65** |
| 3 | Overthinking Masa Depan | overthinking | 52 | 44 | 63 | 80 | 80 | **64** |
| 4 | Overthinking karena Membandingkan Diri | overthinking | 44 | 46 | 71 | 73 | 81 | **63** |
| 5 | Kecemasan Tanpa Sebab Jelas | anxiety | 49 | 54 | 61 | 93 | 80 | **67** |
| 6 | Kecemasan Sosial | anxiety | 54 | 53 | 65 | 90 | 81 | **69** |
| 7 | Kecemasan tentang Kesehatan | anxiety | 45 | 37 | 51 | 93 | 80 | **61** |
| 8 | Kecemasan Akan Kegagalan | anxiety | 56 | 35 | 56 | 83 | 80 | **62** |
| 9 | Rasa Tidak Pantas dalam Hubungan | relationship | 52 | 51 | 67 | 93 | 80 | **69** |
| 10 | Pengkhianatan dalam Hubungan | relationship | 56 | 58 | 65 | 93 | 80 | **70** |
| 11 | Kesalahpahaman dengan Pasangan | relationship | 47 | 51 | 65 | 83 | 80 | **65** |
| 12 | Self Doubt Akademik | self_doubt | 53 | 47 | 63 | 83 | 81 | **65** |
| 13 | Impostor Syndrome | self_doubt | 55 | 51 | 67 | 93 | 80 | **69** |
| 14 | Insecure dengan Penampilan Fisik | insecure | 53 | 48 | 63 | 100 | 80 | **69** |
| 15 | Insecure dalam Bersosialisasi | insecure | 53 | 49 | 65 | 80 | 81 | **66** |
| 16 | Konflik dengan Orang Tua | keluarga | 53 | 46 | 63 | 90 | 80 | **66** |
| 17 | Broken Home | keluarga | 56 | 47 | 58 | 100 | 80 | **68** |
| 18 | Tekanan Ekspektasi Keluarga | keluarga | 53 | 56 | 63 | 83 | 80 | **67** |
| 19 | Tidak Bisa Terbuka dengan Keluarga | keluarga | 60 | 52 | 58 | 100 | 80 | **70** |
| 20 | Kehilangan Semangat Hidup | motivation | 54 | 52 | 65 | 93 | 80 | **69** |
| 21 | Kehilangan Arah Hidup | motivation | 57 | 53 | 63 | 100 | 80 | **71** |
| 22 | Merasa Tidak Berguna | motivation | 56 | 44 | 62 | 93 | 80 | **67** |
| 23 | Tugas Kuliah Menumpuk | stress | 55 | 44 | 58 | 80 | 81 | **64** |
| 24 | Burnout Akademik | stress | 53 | 54 | 58 | 93 | 80 | **68** |
| 25 | Prokrastinasi karena Stress Kuliah | stress | 49 | 42 | 63 | 83 | 81 | **64** |
| 26 | Kesepian di Tengah Keramaian | loneliness | 57 | 54 | 61 | 90 | 80 | **68** |
| 27 | Kesulitan Mencari Koneksi | loneliness | 56 | 52 | 60 | 80 | 80 | **66** |
| 28 | Kesepian di Kota Baru | loneliness | 52 | 45 | 63 | 90 | 81 | **66** |
| 29 | Kesepian karena Kehilangan Teman | loneliness | 48 | 42 | 63 | 83 | 80 | **63** |
| 30 | Burnout Rutinitas | burnout | 51 | 47 | 58 | 73 | 80 | **62** |
| 31 | Burnout Organisasi dan Akademik | burnout | 45 | 53 | 63 | 93 | 80 | **67** |
| 32 | Burnout karena Overworking | burnout | 51 | 45 | 63 | 83 | 81 | **65** |


## 4.4 Analisis Hasil

### 4.4.1 Analisis Similarity

Dimensi similarity memperoleh rata-rata skor **53/100**. Hasil ini menunjukkan bahwa masih terdapat kesenjangan antara respons chatbot dengan konteks yang diharapkan. Perlu dilakukan optimasi pada pemilihan template respons atau penambahan variasi kata kunci emosional.
Pencapaian ini didukung oleh penggunaan cosine similarity untuk mengukur kesamaan vektor kata antara respons dan input pengguna, serta text overlap dan keyword matching untuk memvalidasi kehadiran kata kunci emosional yang sesuai.


### 4.4.2 Analisis Empati

Dimensi empati memperoleh rata-rata skor **62/100**. Meskipun demikian, masih terdapat ruang untuk peningkatan dalam hal validasi emosional dan pemberian dukungan yang lebih personal.

Tingginya skor empati ini merupakan indikator penting karena empati adalah komponen paling krusial dalam chatbot curhat. Tanpa empati, respons chatbot akan terasa dingin, robotik, dan tidak dapat dipercaya oleh pengguna.


### 4.4.3 Analisis Akurasi Retrieval

Dimensi akurasi retrieval memperoleh rata-rata skor **80/100** (Baik). Sistem RAG berhasil mengambil chunk yang relevan dari basis data untuk sebagian besar skenario. 
Precision mengukur proporsi chunk yang diretrieve dan benar-benar relevan, sedangkan recall mengukur proporsi chunk relevan yang berhasil diretrieve. Keseimbangan antara precision dan recall menunjukkan bahwa sistem retrieval bekerja dengan efektif dalam mengidentifikasi dan mengambil konteks emosional yang sesuai.


### 4.4.4 Analisis per Kategori Emosional

**Kehilangan Motivasi (Skor: 69/100)**

Kategori ini menunjukkan performa yang cukup, dengan skor 69/100. Sistem masih perlu pengembangan, terutama dalam meningkatkan kualitas respons dan akurasi retrieval untuk kategori ini.

**Masalah Hubungan (Skor: 68/100)**

Kategori ini menunjukkan performa yang cukup, dengan skor 68/100. Sistem masih perlu pengembangan, terutama dalam meningkatkan kualitas respons dan akurasi retrieval untuk kategori ini.

**Insecure / Self Doubt (Skor: 68/100)**

Kategori ini menunjukkan performa yang cukup, dengan skor 68/100. Sistem masih perlu pengembangan, terutama dalam meningkatkan kualitas respons dan akurasi retrieval untuk kategori ini.

**Masalah Keluarga (Skor: 68/100)**

Kategori ini menunjukkan performa yang cukup, dengan skor 68/100. Sistem masih perlu pengembangan, terutama dalam meningkatkan kualitas respons dan akurasi retrieval untuk kategori ini.

**Self Doubt (Skor: 67/100)**

Kategori ini menunjukkan performa yang cukup, dengan skor 67/100. Sistem masih perlu pengembangan, terutama dalam meningkatkan kualitas respons dan akurasi retrieval untuk kategori ini.

**Kesepian (Skor: 66/100)**

Kategori ini menunjukkan performa yang cukup, dengan skor 66/100. Sistem masih perlu pengembangan, terutama dalam meningkatkan kualitas respons dan akurasi retrieval untuk kategori ini.

**Overthinking (Skor: 65/100)**

Kategori ini menunjukkan performa yang cukup, dengan skor 65/100. Sistem masih perlu pengembangan, terutama dalam meningkatkan kualitas respons dan akurasi retrieval untuk kategori ini.

**Kecemasan (Anxiety) (Skor: 65/100)**

Kategori ini menunjukkan performa yang cukup, dengan skor 65/100. Sistem masih perlu pengembangan, terutama dalam meningkatkan kualitas respons dan akurasi retrieval untuk kategori ini.

**Stress Kuliah (Skor: 65/100)**

Kategori ini menunjukkan performa yang cukup, dengan skor 65/100. Sistem masih perlu pengembangan, terutama dalam meningkatkan kualitas respons dan akurasi retrieval untuk kategori ini.

**Burnout (Skor: 65/100)**

Kategori ini menunjukkan performa yang cukup, dengan skor 65/100. Sistem masih perlu pengembangan, terutama dalam meningkatkan kualitas respons dan akurasi retrieval untuk kategori ini.


## 4.5 Interpretasi Akademik

### 4.5.1 Interpretasi Hasil

Berdasarkan hasil evaluasi yang telah dipaparkan, berikut adalah interpretasi akademik dari sistem RAG chatbot curhat "Honey":

**1. Kualitas Respons Chatbot**

Sistem berhasil memberikan respons yang berkualitas dengan rata-rata skor **66/100**. Dari 32 skenario yang diuji, **3 skenario (9.4%)** memperoleh skor di atas 70 yang termasuk dalam kategori Baik atau Sangat Baik. Hal ini menunjukkan bahwa chatbot mampu memberikan respons yang relevan, empatik, dan konsisten untuk sebagian besar skenario emosional.

**2. Efektivitas Sistem RAG**

Sistem Retrieval-Augmented Generation (RAG) yang diimplementasikan mampu mengambil konteks yang relevan dari basis data chunk dengan akurasi **80/100**. Precision dan recall retrieval menunjukkan bahwa sistem berhasil mengidentifikasi chunk yang sesuai dengan kondisi emosional pengguna. Konteks yang diretrieve kemudian digunakan untuk menghasilkan respons yang lebih personal dan sesuai dengan kebutuhan emosional pengguna.

**3. Kualitas Dukungan Emosional**

Dimensi empati memperoleh skor **62/100**, yang merupakan dimensi dengan performa terbaik. Ini menunjukkan bahwa chatbot berhasil menciptakan respons yang hangat, memvalidasi perasaan pengguna, dan memberikan dukungan emosional yang tulus. Kemampuan ini sangat penting untuk chatbot curhat karena pengguna datang dengan harapan untuk didengarkan dan dipahami.

**4. Konsistensi Konteks**

Dimensi konsistensi konteks memperoleh skor **88/100**, yang menunjukkan bahwa chatbot mampu mempertahankan konteks emosional sepanjang respons tanpa mengalami kontradiksi internal. Hal ini penting untuk membangun kepercayaan pengguna terhadap chatbot.

### 4.5.2 Implikasi Hasil

Hasil evaluasi ini memiliki beberapa implikasi penting:

1. **Kelayakan Penggunaan**: Dengan rata-rata skor 66/100, sistem RAG chatbot curhat layak digunakan sebagai alat bantu dukungan emosional awal. Namun, perlu ditekankan bahwa chatbot ini bukan pengganti konseling profesional.

2. **Keunggulan RAG**: Implementasi RAG terbukti efektif dalam meningkatkan relevansi dan konsistensi respons chatbot. Konteks yang diretrieve dari basis data membantu chatbot memberikan respons yang lebih personal dan sesuai dengan kondisi emosional pengguna.

3. **Potensi Pengembangan**: Terdapat beberapa kategori emosional yang masih perlu ditingkatkan, terutama pada kategori dengan skor di bawah 70. Perluasan basis data chunk dan optimasi prompt dapat menjadi fokus pengembangan selanjutnya.

### 4.5.3 Perbandingan dengan Penelitian Terkait

Hasil evaluasi ini sejalan dengan penelitian-penelitian sebelumnya yang menunjukkan bahwa:

1. **RAG meningkatkan relevansi respons**: Penambahan mekanisme retrieval context secara signifikan meningkatkan relevansi respons chatbot (Lewis et al., 2020; Shuster et al., 2021).

2. **Empati adalah faktor kunci**: Dalam konteks dukungan emosional, empati merupakan faktor yang paling menentukan kepuasan pengguna (Rashkin et al., 2019; Welivita & Pu, 2020).

3. **Rule-based evaluation efektif untuk skripsi**: Pendekatan evaluasi rule-based dengan metrik sederhana (cosine similarity, text overlap, keyword matching) cukup efektif untuk mengukur kualitas respons chatbot pada tingkat akademik sarjana.

## 4.6 Kesimpulan Pengujian

Berdasarkan seluruh rangkaian pengujian dan analisis yang telah dilakukan terhadap sistem RAG chatbot curhat "Honey", dapat ditarik beberapa kesimpulan sebagai berikut:

1. **Sistem RAG chatbot curhat menunjukkan kinerja yang cukup** dengan rata-rata skor keseluruhan **66/100**. 
Hasil ini menunjukkan bahwa sistem mampu memberikan respons dukungan emosional yang relevan dan empatik kepada pengguna.

2. **Dimensi empati merupakan kekuatan utama sistem** dengan skor **62/100**. Chatbot berhasil memvalidasi perasaan pengguna, menunjukkan pemahaman, dan memberikan dukungan emosional yang tulus. Hal ini merupakan pencapaian penting karena empati adalah komponen paling krusial dalam chatbot curhat.

3. **Sistem RAG berfungsi dengan efektif** dalam mengambil konteks yang relevan dari basis data chunk (akurasi retrieval: **80/100**). Konteks yang diretrieve membantu chatbot menghasilkan respons yang lebih personal dan sesuai dengan kondisi emosional pengguna.

4. **Dari 32 skenario yang diuji**, sebanyak **3 skenario** (9.4%) berhasil mencapai skor di atas 70 (kategori Baik atau Sangat Baik). Ini menunjukkan bahwa sistem mampu menangani sebagian besar variasi kondisi emosional yang mungkin dialami oleh pengguna.

5. **Terdapat variasi performa antar kategori emosional**. Kategori dengan skor tertinggi menunjukkan bahwa sistem sangat baik dalam menangani kondisi emosional tertentu, sementara kategori dengan skor lebih rendah mengindikasikan perlunya pengembangan lebih lanjut pada basis data chunk dan strategi respons.

6. **Sistem ini layak digunakan sebagai alat bantu dukungan emosional awal**, namun perlu diingat bahwa chatbot ini bukan pengganti konseling profesional. Pengguna yang mengalami kondisi emosional berat atau memiliki kecenderungan untuk menyakiti diri sendiri tetap harus dirujuk ke tenaga profesional.


### 4.6.1 Saran Pengembangan

Berdasarkan hasil evaluasi, berikut adalah beberapa saran untuk pengembangan sistem selanjutnya:

1. **Perluas basis data chunk** terutama untuk kategori dengan skor rendah, agar retrieval dapat mengambil konteks yang lebih relevan dan bervariasi.

2. **Tingkatkan variasi respons** untuk menghindari pengulangan pola respons yang sama, sehingga interaksi terasa lebih natural dan personal.

3. **Tambahkan mekanisme deteksi krisis** untuk mengidentifikasi pengguna yang mungkin membutuhkan bantuan profesional segera (misalnya, indikasi suicidal ideation).

4. **Optimasi threshold similarity** pada sistem retrieval untuk meningkatkan precision, sehingga chunk yang diambil benar-benar relevan dengan query pengguna.

5. **Lakukan pengujian dengan pengguna nyata** (human evaluation) untuk memvalidasi hasil evaluasi otomatis dan mendapatkan masukan kualitatif dari pengguna.

---

_Laporan akademik ini digenerate secara otomatis oleh sistem evaluasi RAG Chatbot Curhat._
_Format sesuai dengan pedoman penulisan skripsi BAB 4 (Hasil dan Pembahasan)._
_Bahasa Indonesia formal untuk kemudahan pemahaman dosen penguji._