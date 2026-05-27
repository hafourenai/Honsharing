## Perbandingan RAG vs Non-RAG

**Jumlah Skenario:** 32

### Ringkasan

| Metrik | Non-RAG | RAG | Peningkatan |
|--------|---------|-----|-------------|
| Rata-rata Skor | 17 | 36 | **+19** (108.7%) |
| RAG Menang | - | 31/32 | - |
| Non-RAG Menang | 1/32 | - | - |


### Rata-rata per Dimensi

| Dimensi | Non-RAG | RAG | Peningkatan |
|---------|---------|-----|-------------|
| Similarity | 7 | 26 | **+19** (271.4%) |
| Relevance | 7 | 20 | **+13** (185.7%) |
| Empathy | 13 | 16 | **+3** (23.1%) |
| Consistency | 42 | 81 | **+39** (92.9%) |


### Detail per Skenario

| # | Skenario | Kategori | Non-RAG | RAG | Peningkatan |
|---|----------|----------|---------|-----|-------------|
| 1 | Overthinking Malam Hari | overthinking | 19 | 24 | ▲ +5 (26.3%) |
| 2 | Overthinking Sosial | overthinking | 23 | 24 | ▲ +1 (4.3%) |
| 3 | Overthinking Masa Depan | overthinking | 20 | 34 | ▲ +14 (70.0%) |
| 4 | Overthinking karena Membandingkan Diri | overthinking | 20 | 35 | ▲ +15 (75.0%) |
| 5 | Kecemasan Tanpa Sebab Jelas | anxiety | 13 | 38 | ▲ +25 (192.3%) |
| 6 | Kecemasan Sosial | anxiety | 20 | 16 | ▼ -4 (-20.0%) |
| 7 | Kecemasan tentang Kesehatan | anxiety | 12 | 35 | ▲ +23 (191.7%) |
| 8 | Kecemasan Akan Kegagalan | anxiety | 12 | 39 | ▲ +27 (225.0%) |
| 9 | Rasa Tidak Pantas dalam Hubungan | relationship | 14 | 34 | ▲ +20 (142.9%) |
| 10 | Pengkhianatan dalam Hubungan | relationship | 20 | 32 | ▲ +12 (60.0%) |
| 11 | Kesalahpahaman dengan Pasangan | relationship | 11 | 45 | ▲ +34 (309.1%) |
| 12 | Self Doubt Akademik | insecure | 23 | 34 | ▲ +11 (47.8%) |
| 13 | Impostor Syndrome | insecure | 15 | 41 | ▲ +26 (173.3%) |
| 14 | Insecure dengan Penampilan Fisik | insecure | 27 | 40 | ▲ +13 (48.1%) |
| 15 | Insecure dalam Bersosialisasi | insecure | 9 | 31 | ▲ +22 (244.4%) |
| 16 | Konflik dengan Orang Tua | keluarga | 8 | 43 | ▲ +35 (437.5%) |
| 17 | Broken Home | keluarga | 8 | 39 | ▲ +31 (387.5%) |
| 18 | Tekanan Ekspektasi Keluarga | keluarga | 12 | 44 | ▲ +32 (266.7%) |
| 19 | Tidak Bisa Terbuka dengan Keluarga | keluarga | 26 | 44 | ▲ +18 (69.2%) |
| 20 | Kehilangan Semangat Hidup | motivation | 20 | 38 | ▲ +18 (90.0%) |
| 21 | Kehilangan Arah Hidup | motivation | 11 | 46 | ▲ +35 (318.2%) |
| 22 | Merasa Tidak Berguna | motivation | 14 | 38 | ▲ +24 (171.4%) |
| 23 | Tugas Kuliah Menumpuk | stress | 26 | 29 | ▲ +3 (11.5%) |
| 24 | Burnout Akademik | stress | 17 | 35 | ▲ +18 (105.9%) |
| 25 | Prokrastinasi karena Stress Kuliah | stress | 27 | 40 | ▲ +13 (48.1%) |
| 26 | Kesepian di Tengah Keramaian | loneliness | 14 | 35 | ▲ +21 (150.0%) |
| 27 | Kesulitan Mencari Koneksi | loneliness | 21 | 32 | ▲ +11 (52.4%) |
| 28 | Kesepian di Kota Baru | loneliness | 13 | 45 | ▲ +32 (246.2%) |
| 29 | Kesepian karena Kehilangan Teman | loneliness | 25 | 39 | ▲ +14 (56.0%) |
| 30 | Burnout Rutinitas | burnout | 13 | 38 | ▲ +25 (192.3%) |
| 31 | Burnout Organisasi dan Akademik | burnout | 23 | 38 | ▲ +15 (65.2%) |
| 32 | Burnout karena Overworking | burnout | 15 | 25 | ▲ +10 (66.7%) |


### Analisis

Berdasarkan hasil perbandingan di atas, sistem dengan RAG menunjukkan peningkatan skor rata-rata sebesar **108.7%** dibandingkan sistem tanpa RAG. 
Peningkatan paling signifikan terjadi pada dimensi **Similarity** dan **Contextual Consistency**, yang menunjukkan bahwa RAG berhasil memberikan konteks yang relevan sehingga respons chatbot lebih sesuai dengan kondisi emosional user.

Dari 32 skenario yang diuji, RAG unggul dalam 31 skenario (97%), yang membuktikan bahwa penambahan mekanisme retrieval context secara signifikan meningkatkan kualitas respons chatbot curhat.