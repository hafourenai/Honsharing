# Hasil Evaluasi Sistem RAG Chatbot Curhat

## Ringkasan

| Metrik | Nilai |
|--------|-------|
| Rata-rata Skor | 66/100 |
| Skor Tertinggi | 71/100 |
| Skor Terendah | 61/100 |
| Standar Deviasi | 2.58 |
| Jumlah Skenario | 32 |
| Skenario Lulus (>=70) | 3/32 |
| RAG Improvement | 19 poin (108.7%) |
| RAG Wins | 31/32 |

## Rata-rata per Dimensi

| Dimensi | Skor |
|---------|------|
| Similarity | 53 |
| Relevance | 49 |
| Empathy | 62 |
| Contextual Consistency | 88 |
| Retrieval Accuracy | 80 |
| **Overall** | **66** |

## Ringkasan Statistik

### Statistik Umum

| Metrik | Nilai |
|--------|-------|
| Jumlah Skenario | 32 |
| Rata-rata Skor | 66/100 |
| Skor Tertinggi | 71/100 |
| Skor Terendah | 61/100 |
| Standar Deviasi | 2.58 |
| Skenario Lulus (>=70) | 3/32 (9.4%) |
| Skenario Sangat Baik (>=85) | 0.0% |
| Skenario Kurang (<55) | 0.0% |


### Distribusi Verdict

| Verdict | Jumlah | Persentase |
|---------|--------|------------|
| CUKUP | 29 | 90.6% |
| BAIK | 3 | 9.4% |


### Statistik per Kategori

| Kategori | Jumlah | Rata-rata | Tertinggi | Terendah | Sim | Rel | Emp | Kon | Ret |
|----------|--------|-----------|-----------|----------|-----|-----|-----|-----|-----|
| motivation | 3 | 69 | 71 | 67 | 56 | 50 | 63 | 95 | 80 |
| relationship | 3 | 68 | 70 | 65 | 52 | 53 | 66 | 90 | 80 |
| insecure | 2 | 68 | 69 | 66 | 53 | 49 | 64 | 90 | 81 |
| keluarga | 4 | 68 | 70 | 66 | 56 | 50 | 61 | 93 | 80 |
| self_doubt | 2 | 67 | 69 | 65 | 54 | 49 | 65 | 88 | 81 |
| loneliness | 4 | 66 | 68 | 63 | 53 | 48 | 62 | 86 | 80 |
| overthinking | 4 | 65 | 69 | 63 | 50 | 49 | 66 | 82 | 81 |
| anxiety | 4 | 65 | 69 | 61 | 51 | 45 | 58 | 90 | 80 |
| stress | 3 | 65 | 68 | 64 | 52 | 47 | 60 | 85 | 81 |
| burnout | 3 | 65 | 67 | 62 | 49 | 48 | 61 | 83 | 80 |


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

## Data Visualisasi (JSON)

```json
{
  "barChartPerScenario": {
    "labels": [
      "Overthinking Malam Hari",
      "Overthinking Sosial",
      "Overthinking Masa Depan",
      "Overthinking karena Membandingkan Diri",
      "Kecemasan Tanpa Sebab Jelas",
      "Kecemasan Sosial",
      "Kecemasan tentang Kesehatan",
      "Kecemasan Akan Kegagalan",
      "Rasa Tidak Pantas dalam Hubungan",
      "Pengkhianatan dalam Hubungan",
      "Kesalahpahaman dengan Pasangan",
      "Self Doubt Akademik",
      "Impostor Syndrome",
      "Insecure dengan Penampilan Fisik",
      "Insecure dalam Bersosialisasi",
      "Konflik dengan Orang Tua",
      "Broken Home",
      "Tekanan Ekspektasi Keluarga",
      "Tidak Bisa Terbuka dengan Keluarga",
      "Kehilangan Semangat Hidup",
      "Kehilangan Arah Hidup",
      "Merasa Tidak Berguna",
      "Tugas Kuliah Menumpuk",
      "Burnout Akademik",
      "Prokrastinasi karena Stress Kuliah",
      "Kesepian di Tengah Keramaian",
      "Kesulitan Mencari Koneksi",
      "Kesepian di Kota Baru",
      "Kesepian karena Kehilangan Teman",
      "Burnout Rutinitas",
      "Burnout Organisasi dan Akademik",
      "Burnout karena Overworking"
    ],
    "datasets": [
      {
        "label": "Skor Keseluruhan",
        "data": [
          69,
          65,
          64,
          63,
          67,
          69,
          61,
          62,
          69,
          70,
          65,
          65,
          69,
          69,
          66,
          66,
          68,
          67,
          70,
          69,
          71,
          67,
          64,
          68,
          64,
          68,
          66,
          66,
          63,
          62,
          67,
          65
        ],
        "backgroundColor": [
          "#3B82F6",
          "#3B82F6",
          "#3B82F6",
          "#3B82F6",
          "#EF4444",
          "#EF4444",
          "#EF4444",
          "#EF4444",
          "#EC4899",
          "#EC4899",
          "#EC4899",
          "#6B7280",
          "#6B7280",
          "#8B5CF6",
          "#8B5CF6",
          "#F97316",
          "#F97316",
          "#F97316",
          "#F97316",
          "#F59E0B",
          "#F59E0B",
          "#F59E0B",
          "#14B8A6",
          "#14B8A6",
          "#14B8A6",
          "#6366F1",
          "#6366F1",
          "#6366F1",
          "#6366F1",
          "#06B6D4",
          "#06B6D4",
          "#06B6D4"
        ]
      }
    ]
  },
  "barChartPerCategory": {
    "labels": [
      "motivation",
      "relationship",
      "insecure",
      "keluarga",
      "self_doubt",
      "loneliness",
      "overthinking",
      "anxiety",
      "stress",
      "burnout"
    ],
    "datasets": [
      {
        "label": "Rata-rata Skor",
        "data": [
          69,
          68,
          68,
          68,
          67,
          66,
          65,
          65,
          65,
          65
        ],
        "backgroundColor": [
          "#F59E0B",
          "#EC4899",
          "#8B5CF6",
          "#F97316",
          "#6B7280",
          "#6366F1",
          "#3B82F6",
          "#EF4444",
          "#14B8A6",
          "#06B6D4"
        ]
      }
    ]
  },
  "barChartPerDimension": {
    "labels": [
      "Similarity",
      "Relevance",
      "Empathy",
      "Consistency",
      "Retrieval"
    ],
    "datasets": [
      {
        "label": "Rata-rata Skor",
        "data": [
          53,
          49,
          62,
          88,
          80
        ],
        "backgroundColor": [
          "#3B82F6",
          "#10B981",
          "#8B5CF6",
          "#F59E0B",
          "#EF4444"
        ]
      }
    ]
  },
  "pieChartVerdict": {
    "labels": [
      "BAIK",
      "CUKUP"
    ],
    "data": [
      3,
      29
    ],
    "backgroundColor": [
      "#3B82F6",
      "#F59E0B"
    ]
  },
  "scoreDistribution": [
    {
      "range": "0–39 (Tidak Memadai)",
      "count": 0,
      "percentage": "0.0%"
    },
    {
      "range": "40–54 (Kurang)",
      "count": 0,
      "percentage": "0.0%"
    },
    {
      "range": "55–69 (Cukup)",
      "count": 29,
      "percentage": "90.6%"
    },
    {
      "range": "70–84 (Baik)",
      "count": 3,
      "percentage": "9.4%"
    },
    {
      "range": "85–100 (Sangat Baik)",
      "count": 0,
      "percentage": "0.0%"
    }
  ],
  "metadata": {
    "totalScenarios": 32,
    "averageScore": 66,
    "date": "2026-05-27T06:47:58.526Z"
  }
}
```

## Ringkasan Statistik (JSON)

```json
{
  "judul": "Evaluasi Sistem Retrieval-Augmented Generation (RAG) pada Chatbot Curhat Berbasis Emotional Context",
  "tanggal": "2026-05-27T06:47:58.526Z",
  "jumlahSkenario": 32,
  "statistikUmum": {
    "rataRata": 66,
    "tertinggi": 71,
    "terendah": 61,
    "standarDeviasi": 2.58,
    "persentaseKeberhasilan": {
      "above70": "9.4%",
      "above85": "0.0%",
      "below55": "0.0%",
      "averageScore": 66,
      "passed": 3,
      "total": 32
    }
  },
  "rataRataPerDimensi": {
    "similarity": 53,
    "relevance": 49,
    "empathy": 62,
    "konsistensiKonteks": 88,
    "akurasiRetrieval": 80
  },
  "distribusiVerdict": [
    {
      "verdict": "CUKUP",
      "count": 29,
      "percentage": "90.6%"
    },
    {
      "verdict": "BAIK",
      "count": 3,
      "percentage": "9.4%"
    }
  ],
  "statistikPerKategori": [
    {
      "category": "motivation",
      "count": 3,
      "averageScore": 69,
      "highest": 71,
      "lowest": 67,
      "averageSimilarity": 56,
      "averageRelevance": 50,
      "averageEmpathy": 63,
      "averageConsistency": 95,
      "averageRetrieval": 80
    },
    {
      "category": "relationship",
      "count": 3,
      "averageScore": 68,
      "highest": 70,
      "lowest": 65,
      "averageSimilarity": 52,
      "averageRelevance": 53,
      "averageEmpathy": 66,
      "averageConsistency": 90,
      "averageRetrieval": 80
    },
    {
      "category": "insecure",
      "count": 2,
      "averageScore": 68,
      "highest": 69,
      "lowest": 66,
      "averageSimilarity": 53,
      "averageRelevance": 49,
      "averageEmpathy": 64,
      "averageConsistency": 90,
      "averageRetrieval": 81
    },
    {
      "category": "keluarga",
      "count": 4,
      "averageScore": 68,
      "highest": 70,
      "lowest": 66,
      "averageSimilarity": 56,
      "averageRelevance": 50,
      "averageEmpathy": 61,
      "averageConsistency": 93,
      "averageRetrieval": 80
    },
    {
      "category": "self_doubt",
      "count": 2,
      "averageScore": 67,
      "highest": 69,
      "lowest": 65,
      "averageSimilarity": 54,
      "averageRelevance": 49,
      "averageEmpathy": 65,
      "averageConsistency": 88,
      "averageRetrieval": 81
    },
    {
      "category": "loneliness",
      "count": 4,
      "averageScore": 66,
      "highest": 68,
      "lowest": 63,
      "averageSimilarity": 53,
      "averageRelevance": 48,
      "averageEmpathy": 62,
      "averageConsistency": 86,
      "averageRetrieval": 80
    },
    {
      "category": "overthinking",
      "count": 4,
      "averageScore": 65,
      "highest": 69,
      "lowest": 63,
      "averageSimilarity": 50,
      "averageRelevance": 49,
      "averageEmpathy": 66,
      "averageConsistency": 82,
      "averageRetrieval": 81
    },
    {
      "category": "anxiety",
      "count": 4,
      "averageScore": 65,
      "highest": 69,
      "lowest": 61,
      "averageSimilarity": 51,
      "averageRelevance": 45,
      "averageEmpathy": 58,
      "averageConsistency": 90,
      "averageRetrieval": 80
    },
    {
      "category": "stress",
      "count": 3,
      "averageScore": 65,
      "highest": 68,
      "lowest": 64,
      "averageSimilarity": 52,
      "averageRelevance": 47,
      "averageEmpathy": 60,
      "averageConsistency": 85,
      "averageRetrieval": 81
    },
    {
      "category": "burnout",
      "count": 3,
      "averageScore": 65,
      "highest": 67,
      "lowest": 62,
      "averageSimilarity": 49,
      "averageRelevance": 48,
      "averageEmpathy": 61,
      "averageConsistency": 83,
      "averageRetrieval": 80
    }
  ]
}
```

## Data CSV

```
ID,Nama,Kategori,Overall,Similarity,Cosine_Similarity,Text_Overlap,Keyword_Match,Relevance,Content_Relevance,Emotional_Relevance,Tone,Empathy,Emotional_Validation,Understanding,Supportiveness,Consistency,Chunk_Consistency,Emotional_Consistency,No_Contradiction,Retrieval,Precision,Recall,Avg_Relevance_Score
overthinking_001,"Overthinking Malam Hari",overthinking,69,46,0.257,0.185,1,56,27,55,86,65,68,32,100,100,100,100,100,80,100,100,1
overthinking_002,"Overthinking Sosial",overthinking,65,59,0.379,0.467,1,51,43,31,86,63,63,32,100,73,100,50,67,81,100,100,3
overthinking_003,"Overthinking Masa Depan",overthinking,64,52,0.288,0.542,0.8,44,28,35,72,63,63,32,100,80,100,50,100,80,100,100,1
overthinking_004,"Overthinking karena Membandingkan Diri",overthinking,63,44,0.354,0.18,0.8,46,34,24,86,71,63,54,100,73,100,50,67,81,100,100,5
anxiety_001,"Kecemasan Tanpa Sebab Jelas",anxiety,67,49,0.357,0.368,0.8,54,37,53,71,61,47,42,100,93,100,100,67,80,100,100,0
anxiety_002,"Kecemasan Sosial",anxiety,69,54,0.296,0.403,1,53,34,47,79,65,68,32,100,90,100,75,100,81,100,100,3
anxiety_003,"Kecemasan tentang Kesehatan",anxiety,61,45,0.368,0.223,0.8,37,35,14,71,51,27,32,100,93,100,100,67,80,100,100,0
anxiety_004,"Kecemasan Akan Kegagalan",anxiety,62,56,0.354,0.396,1,35,35,1,79,56,43,32,100,83,100,75,67,80,100,100,1
relationship_001,"Rasa Tidak Pantas dalam Hubungan",relationship,69,52,0.334,0.303,1,51,36,37,86,67,73,32,100,93,100,100,67,80,100,100,0
relationship_002,"Pengkhianatan dalam Hubungan",relationship,70,56,0.407,0.332,1,58,40,50,86,65,68,32,100,93,100,100,67,80,100,100,0
relationship_003,"Kesalahpahaman dengan Pasangan",relationship,65,47,0.288,0.199,1,51,30,46,79,65,68,32,100,83,100,75,67,80,100,100,0
self_doubt_001,"Self Doubt Akademik",self_doubt,65,53,0.298,0.368,1,47,29,31,86,63,63,32,100,83,100,75,67,81,100,100,4
self_doubt_002,"Impostor Syndrome",self_doubt,69,55,0.377,0.332,1,51,38,35,86,67,73,32,100,93,100,100,67,80,100,100,0
insecure_001,"Insecure dengan Penampilan Fisik",insecure,69,53,0.354,0.303,1,48,32,36,79,63,63,32,100,100,100,100,100,80,100,100,0
insecure_002,"Insecure dalam Bersosialisasi",insecure,66,53,0.336,0.307,1,49,33,33,86,65,68,32,100,80,100,50,100,81,100,100,4
keluarga_001,"Konflik dengan Orang Tua",keluarga,66,53,0.327,0.335,1,46,31,33,79,63,63,32,100,90,100,75,100,80,100,100,0
keluarga_002,"Broken Home",keluarga,68,56,0.404,0.333,1,47,40,33,71,58,47,32,100,100,100,100,100,80,100,100,0
keluarga_003,"Tekanan Ekspektasi Keluarga",keluarga,67,53,0.327,0.331,1,56,37,48,86,63,63,32,100,83,100,75,67,80,100,100,1
keluarga_004,"Tidak Bisa Terbuka dengan Keluarga",keluarga,70,60,0.42,0.43,1,52,42,44,71,58,47,32,100,100,100,100,100,80,100,100,2
motivation_001,"Kehilangan Semangat Hidup",motivation,69,54,0.314,0.367,1,52,31,48,79,65,68,32,100,93,100,100,67,80,100,100,0
motivation_002,"Kehilangan Arah Hidup",motivation,71,57,0.291,0.519,1,53,33,43,86,63,63,32,100,100,100,100,100,80,100,100,1
motivation_003,"Merasa Tidak Berguna",motivation,67,56,0.29,0.47,1,44,30,35,71,62,47,44,100,93,100,100,67,80,100,100,0
stress_001,"Tugas Kuliah Menumpuk",stress,64,55,0.358,0.369,1,44,37,28,71,58,47,32,100,80,100,50,100,81,100,100,3
stress_002,"Burnout Akademik",stress,68,53,0.339,0.303,1,54,37,53,71,58,47,32,100,93,100,100,67,80,100,100,2
stress_003,"Prokrastinasi karena Stress Kuliah",stress,64,49,0.242,0.304,1,42,26,22,86,63,63,32,100,83,100,75,67,81,100,100,5
loneliness_001,"Kesepian di Tengah Keramaian",loneliness,68,57,0.487,0.248,1,54,53,37,79,61,47,42,100,90,100,75,100,80,100,100,1
loneliness_002,"Kesulitan Mencari Koneksi",loneliness,66,56,0.425,0.293,1,52,45,44,71,60,53,32,100,80,100,50,100,80,100,100,1
loneliness_003,"Kesepian di Kota Baru",loneliness,66,52,0.249,0.398,1,45,25,35,79,63,63,32,100,90,100,75,100,81,100,100,6
loneliness_004,"Kesepian karena Kehilangan Teman",loneliness,63,48,0.294,0.223,1,42,29,25,79,63,63,32,100,83,100,75,67,80,100,100,1
burnout_001,"Burnout Rutinitas",burnout,62,51,0.362,0.207,1,47,38,36,71,58,47,32,100,73,100,50,67,80,100,100,0
burnout_002,"Burnout Organisasi dan Akademik",burnout,67,45,0.304,0.304,0.8,53,32,44,86,63,63,32,100,93,100,100,67,80,100,100,0
burnout_003,"Burnout karena Overworking",burnout,65,51,0.36,0.222,1,45,34,23,86,63,63,32,100,83,100,75,67,81,100,100,6
```
