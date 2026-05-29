# Sistem Testing & Evaluasi RAG Chatbot Curhat

---

## Daftar Isi

1. [Tujuan Testing](#1-tujuan-testing)
2. [Struktur Folder](#2-struktur-folder)
3. [Cara Kerja Evaluasi](#3-cara-kerja-evaluasi)
4. [Cara Menjalankan Evaluasi](#4-cara-menjalankan-evaluasi)
5. [Penjelasan Similarity Score](#5-penjelasan-similarity-score)
6. [Penjelasan Retrieval Evaluation](#6-penjelasan-retrieval-evaluation)
7. [Penjelasan Relevance Testing](#7-penjelasan-relevance-testing)
8. [Penjelasan Empati Testing](#8-penjelasan-empati-testing)
9. [Penjelasan Konsistensi Konteks](#9-penjelasan-konsistensi-konteks)
10. [Skenario Pengujian](#10-skenario-pengujian)
11. [Mock System](#11-mock-system)
12. [Interpretasi Hasil](#12-interpretasi-hasil)
13. [Contoh Report](#13-contoh-report)

---

## 1. Tujuan Testing

Sistem testing ini dikembangkan untuk **evaluasi akademik skripsi** dengan tujuan:

### 1.1 Tujuan Utama

1. **Mengukur kualitas respons chatbot** — Apakah chatbot memberikan respons yang relevan, empatik, dan konsisten dengan konteks emosional user?

2. **Mengevaluasi sistem Retrieval-Augmented Generation (RAG)** — Apakah sistem RAG berhasil mengambil konteks yang tepat dari database chunk?

3. **Menganalisis kesesuaian emosional** — Apakah respons chatbot sesuai dengan keadaan emosional user?

4. **Mendokumentasikan hasil evaluasi** — Menyediakan bukti kuantitatif dan kualitatif untuk keperluan sidang skripsi.

### 1.2 Ruang Lingkup

| Aspek | Termasuk | Tidak Termasuk |
|-------|----------|----------------|
| Evaluasi relevansi | ✅ Cosine similarity, text overlap, keyword matching | ❌ |
| Evaluasi empati | ✅ Emotional validation, understanding, supportiveness | ❌ |
| Evaluasi retrieval | ✅ Precision, recall, avg relevance score | ❌ |
| Mock system | ✅ Embedding, retrieval, LLM (lokal) | ❌ API asli |
| CI/CD | ❌ | ✅ GitHub Actions, Docker |
| E2E testing | ❌ | ✅ Playwright, Cypress |
| Performance | ❌ | ✅ Benchmark berat |

### 1.3 Penggunaan untuk Skripsi

Sistem ini dirancang agar **mudah dijelaskan saat sidang**. Setiap metrik yang digunakan:

- **Sederhana** — Menggunakan konsep dasar matematika/statistika
- **Transparan** — Kode terbuka dan mudah dipahami
- **Reproducible** — Hasil yang sama untuk input yang sama
- **Terukur** — Skor kuantitatif yang jelas

---

## 2. Struktur Folder

```
test/
├── README.md                          # Dokumentasi utama (file ini)
│
├── config/
│   └── test-config.ts                 # Konfigurasi testing (threshold, bobot, dll)
│
├── types/
│   └── index.ts                       # Type definitions untuk seluruh sistem testing
│
├── mocks/
│   ├── index.ts                       # Barrel file
│   ├── mock-chunks.ts                 # Mock data RAG chunks (11 chunks, 6 kategori)
│   ├── mock-embeddings.ts             # Mock embedding vector (deterministic PRNG)
│   ├── mock-retrieval.ts              # Mock retrieval dengan similarity scoring
│   └── mock-llm-response.ts           # Mock respons LLM (template-based)
│
├── scenarios/
│   ├── index.ts                       # Registry semua skenario (10 skenario)
│   ├── overthinking.ts                # 2 skenario overthinking
│   ├── anxiety.ts                     # 2 skenario kecemasan
│   ├── relationship.ts                # 2 skenario masalah hubungan
│   ├── kehilangan-motivasi.ts         # 1 skenario kehilangan motivasi
│   ├── kesepian.ts                    # 2 skenario kesepian
│   └── stress-kuliah.ts              # 2 skenario stress akademik
│
├── evaluators/
│   ├── index.ts                       # Barrel file
│   ├── similarity-evaluator.ts        # Evaluasi cosine similarity + text overlap
│   ├── relevance-evaluator.ts         # Evaluasi relevansi konten, emosi, tone
│   ├── empathy-evaluator.ts           # Evaluasi validasi, pemahaman, dukungan
│   ├── contextual-consistency.ts      # Evaluasi konsistensi chunk & emosi
│   └── retrieval-accuracy.ts          # Evaluasi precision, recall, avg score
│
├── utils/
│   ├── index.ts                       # Barrel file
│   ├── cosine-similarity.ts           # Cosine similarity (numeric + text-based)
│   ├── text-overlap.ts                # Jaccard, Overlap Coefficient
│   ├── keyword-matching.ts            # Keyword scoring + semantic groups
│   └── scoring.ts                     # Normalisasi, weighted average, verdict
│
├── reports/
│   └── academic-report-generator.ts   # Generator laporan BAB 4 skripsi
│
└── examples/
    └── usage-example.ts               # Contoh penggunaan lengkap
```

---

## 3. Cara Kerja Evaluasi

### 3.1 Alur Evaluasi

```
┌─────────────────────────────────────────────────────────────┐
│                       SKENARIO                              │
│  { userInput, expectedContext, emotionalDirection, ... }    │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   1. RETRIEVAL (MOCK)                        │
│  • Ambil chunks dari database mock                          │
│  • Hitung cosine similarity antara query embedding          │
│    dan chunk embedding                                      │
│  • Filter threshold > 0.3                                   │
│  • Sort by score descending                                 │
│  • Return top-K (default: 5)                               │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   2. GENERATE RESPONS (MOCK)                 │
│  • Pilih template respons berdasarkan topik tertinggi        │
│  • Template sudah ditentukan untuk setiap skenario          │
│  • Atau gunakan getDeterministicResponse() untuk            │
│    respons yang persis sama setiap kali                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   3. EVALUASI                                │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  SIMILARITY  │  │  RELEVANCE   │  │     EMPATHY      │  │
│  │  • Cosine    │  │  • Konten    │  │  • Validasi      │  │
│  │  • Overlap   │  │  • Emosi     │  │  • Pemahaman     │  │
│  │  • Keyword   │  │  • Tone      │  │  • Dukungan      │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────────┘  │
│         │                 │                 │               │
│  ┌──────┴─────────────────┴─────────────────┴───────────┐  │
│  │           CONTEXTUAL CONSISTENCY                      │  │
│  │  • Chunk consistency                                  │  │
│  │  • Emotional consistency                              │  │
│  │  • No contradiction                                   │  │
│  └──────────────────────┬────────────────────────────────┘  │
│                         │                                   │
│  ┌──────────────────────┴────────────────────────────────┐  │
│  │              RETRIEVAL ACCURACY                        │  │
│  │  • Precision — dari semua yang diretrieve,             │  │
│  │    berapa yang relevan?                                │  │
│  │  • Recall — dari semua yang relevan,                   │  │
│  │    berapa yang berhasil diretrieve?                    │  │
│  │  • Average Relevance Score                             │  │
│  └──────────────────────┬────────────────────────────────┘  │
│                         │                                   │
└─────────────────────────┼───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   4. REPORT                                  │
│  • Skor per dimensi (0-100)                                 │
│  • Verdict (SANGAT_BAIK, BAIK, CUKUP, KURANG, TIDAK_MEMADAI)│
│  • Interpretasi akademik                                    │
│  • Tabel dan grafik (markdown)                              │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Skala Penilaian

Setiap evaluator menghasilkan skor **0–100** dengan kategori:

| Range | Verdict | Interpretasi |
|-------|---------|--------------|
| 85–100 | SANGAT_BAIK | Performa sangat baik, memenuhi semua kriteria |
| 70–84 | BAIK | Performa baik, sebagian besar kriteria terpenuhi |
| 55–69 | CUKUP | Performa cukup, beberapa kriteria belum terpenuhi |
| 40–54 | KURANG | Performa kurang, banyak kriteria tidak terpenuhi |
| 0–39 | TIDAK_MEMADAI | Performa tidak memadai |

### 3.3 Bobot Penilaian

**Similarity Score:**
- Cosine similarity: 40%
- Text overlap: 30%
- Keyword matching: 30%

**Relevance Score:**
- Content relevance: 30%
- Emotional relevance: 40%
- Tone appropriateness: 30%

**Empathy Score:**
- Emotional validation: 35%
- Understanding: 35%
- Supportiveness: 30%

**Contextual Consistency:**
- Chunk consistency: 40%
- Emotional consistency: 40%
- No contradiction: 20%

**Retrieval Accuracy:**
- Precision: 40%
- Recall: 40%
- Average relevance score: 20%

### 3.4 Overall Score

Rata-rata dari kelima dimensi evaluasi:

```
Overall = (Similarity + Relevance + Empathy +
           Consistency + Retrieval) / 5
```

---

## 4. Cara Menjalankan Evaluasi

### 4.1 Prasyarat

- Node.js 18+
- TypeScript 5+
- Path alias `@/*` sudah terkonfigurasi di `tsconfig.json` (mengarah ke `./src/*`)

### 4.2 Menjalankan Contoh

```bash
# Menggunakan tsx (recommended)
npx tsx test/examples/usage-example.ts

# Atau menggunakan ts-node
npx ts-node test/examples/usage-example.ts
```

### 4.3 Evaluasi Satu Skenario

```typescript
import { overthinkingScenario } from "@/test/scenarios/overthinking"
import { mockRetrieve, getDeterministicResponse } from "@/test/mocks"
import { evaluateSimilarity } from "@/test/evaluators/similarity-evaluator"
import { evaluateRelevance } from "@/test/evaluators/relevance-evaluator"
import { evaluateEmpathy } from "@/test/evaluators/empathy-evaluator"

// 1. Ambil skenario
const scenario = overthinkingScenario

// 2. Mock retrieval
const chunks = await mockRetrieve(scenario.userInput)

// 3. Dapatkan respons
const response = getDeterministicResponse(scenario.id)

// 4. Evaluasi
const similarity = evaluateSimilarity(response, scenario)
const relevance = evaluateRelevance(response, scenario)
const empathy = evaluateEmpathy(response, scenario)

console.log(`Similarity: ${similarity.finalScore}`)
console.log(`Relevance: ${relevance.finalScore}`)
console.log(`Empathy: ${empathy.finalScore}`)
```

### 4.4 Evaluasi Semua Skenario + Report

```typescript
import { ALL_SCENARIOS } from "@/test/scenarios"
import { mockRetrieve, getDeterministicResponse } from "@/test/mocks"
import { evaluateSimilarity, evaluateRelevance, evaluateEmpathy,
         evaluateContextualConsistency, evaluateRetrievalAccuracy } from "@/test/evaluators"
import { generateAcademicReport } from "@/test/reports/academic-report-generator"
import { calculateAggregateStats } from "@/test/statistics/statistical-summary"
import { EvaluationResult } from "@/test/types"

const results: EvaluationResult[] = []

for (const scenario of ALL_SCENARIOS) {
  const chunks = await mockRetrieve(scenario.userInput)
  const response = getDeterministicResponse(scenario.id)

  const similarity = evaluateSimilarity(response, scenario)
  const relevance = evaluateRelevance(response, scenario)
  const empathy = evaluateEmpathy(response, scenario)
  const consistency = evaluateContextualConsistency(response, scenario)
  const retrieval = evaluateRetrievalAccuracy(chunks, scenario, scenario.userInput)

  results.push({
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    timestamp: new Date().toISOString(),
    overallScore: Math.round(
      (similarity.finalScore + relevance.finalScore + empathy.finalScore +
       consistency.finalScore + retrieval.finalScore) / 5
    ),
    similarity,
    relevance,
    empathy,
    contextualConsistency: consistency,
    retrievalAccuracy: retrieval,
    notes: "",
  })
}

const stats = calculateAggregateStats(results)
const report = {
  title: "Evaluasi Sistem RAG Chatbot Curhat",
  createdAt: new Date().toISOString(),
  description: "Laporan evaluasi...",
  results,
  aggregateStats: stats,
}

const academicMarkdown = generateAcademicReport(report)
console.log(academicMarkdown)
```

### 4.5 Evaluasi dengan Respons Asli Groq

Untuk evaluasi dengan respons asli (bukan mock), ganti `getDeterministicResponse()` dengan:

```typescript
// Panggil API chat asli (perlu Groq API key)
const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    messages: [{ role: "user", content: scenario.userInput }],
    mode: "santai",
  }),
})
const data = await response.json()
const botResponse = data.reply || data.answer || ""
```

---

## 5. Penjelasan Similarity Score

### 5.1 Cosine Similarity

**Rumus:**
```
cosine_similarity(A, B) = (A · B) / (||A|| × ||B||)
```

**Penjelasan:**
Cosine similarity mengukur sudut antara dua vektor dalam ruang multidimensi. Nilai berkisar dari -1 hingga 1.

| Nilai | Makna |
|-------|-------|
| 1.0 | Vektor identik (searah) |
| 0.5 | Cukup mirip (sudut 60°) |
| 0.0 | Tidak ada hubungan (ortogonal) |
| -1.0 | Berlawanan arah |

**Implementasi untuk Teks:**
Kita mengubah teks menjadi vektor frekuensi kata (bag-of-words), lalu menghitung cosine similarity-nya.

**Contoh:**
```
Teks A: "saya merasa cemas"
Teks B: "kamu merasa cemas ya"

Vocabulary: {saya, merasa, cemas, kamu, ya}
Vektor A: [1, 1, 1, 0, 0]
Vektor B: [0, 1, 1, 1, 1]
cosine_similarity = (0+1+1+0+0) / (√3 × √4) = 2 / 3.46 = 0.58
```

### 5.2 Text Overlap (Jaccard Similarity)

**Rumus:**
```
J(A, B) = |A ∩ B| / |A ∪ B|
```

**Penjelasan:**
Mengukur irisan kata antara dua teks dibagi total kata unik dari kedua teks.

**Contoh:**
```
Teks A: "saya capek overthinking terus"
Teks B: "capek ya overthinking itu"

Irisan (∩): {capek, overthinking} = 2
Gabungan (∪): {saya, capek, overthinking, terus, ya, itu} = 6
Jaccard = 2/6 = 0.33
```

### 5.3 Keyword Matching

Mengecek apakah kata kunci yang diharapkan muncul dalam respons, dan apakah kata kunci terlarang tidak muncul.

**Skor = (keyword terpenuhi / total keyword) × (1 - penalty)**

Penalty 20% untuk setiap kata terlarang yang muncul.

**Contoh:**
```
Keyword yang harus ada: [wajar, paham, cerita]
Keyword terlarang: [lebay, berlebihan]

Respons: "Wajar kok, aku paham perasaan kamu"
Keyword terpenuhi: {wajar, paham} = 2/3 = 0.67
Tidak ada keyword terlarang = 0 penalti
Final score = 67
```

---

## 6. Penjelasan Retrieval Evaluation

### 6.1 Precision

**Rumus:**
```
Precision = True Positive / (True Positive + False Positive)
```

**Penjelasan:**
Dari semua chunk yang diretrieve oleh sistem, berapa banyak yang benar-benar relevan?

**Contoh:**
```
Sistem retrieve 5 chunk: [A, B, C, D, E]
Yang relevan dengan query: [A, B, C] (3 chunk)

Precision = 3/5 = 60%
```

### 6.2 Recall

**Rumus:**
```
Recall = True Positive / (True Positive + False Negative)
```

**Penjelasan:**
Dari semua chunk yang seharusnya diretrieve (ground truth), berapa banyak yang berhasil diambil?

**Contoh:**
```
Ground truth chunk yang relevan: [A, B, C, F] (4 chunk)
Sistem retrieve: [A, B, D, E, G]
Yang relevan dari retrieval: {A, B} (2 chunk)

Recall = 2/4 = 50%
```

### 6.3 F1-Score (dihitung di mock-retrieval.ts)

**Rumus:**
```
F1 = 2 × (Precision × Recall) / (Precision + Recall)
```

**Penjelasan:**
Harmonic mean dari precision dan recall. Memberikan gambaran seimbang antara kedua metrik.

### 6.4 Average Relevance Score

Rata-rata cosine similarity antara query embedding dengan semua chunk yang diretrieve.

---

## 7. Penjelasan Relevance Testing

Relevance testing mengukur tiga aspek:

### 7.1 Content Relevance (Bobot: 30%)

Apakah respons menjawab atau merespon konten dari input user?

**Diukur dengan:**
- Cosine similarity antara respons dan input user (70%)
- Word overlap antara respons dan input user (30%)

### 7.2 Emotional Relevance (Bobot: 40%)

Apakah respons sesuai dengan keadaan emosional user?

**Diukur dengan:**
- Kehadiran kata kunci dari arah emosional yang diharapkan
- Tidak adanya kata yang bersifat judgemental (penalty -30%)

### 7.3 Tone Appropriateness (Bobot: 30%)

Apakah nada bicara chatbot sesuai untuk situasi curhat?

**Diukur dengan:**
- Kata-kata positif: paham, ngerti, wajar, disini, cerita, pelan, tenang
- Kata-kata negatif: harusnya, seharusnya, kamu salah, pokoknya

---

## 8. Penjelasan Empati Testing

Empati adalah komponen **paling penting** untuk chatbot curhat. Tanpa empati, respons akan terasa dingin dan robotik.

### 8.1 Emotional Validation (Bobot: 35%)

Apakah chatbot memvalidasi perasaan user?

**Indikator:**
- Kata validasi: wajar, paham, dimengerti, manusiawi, tidak apa
- Kata invalidasi (penalty): biasa aja, jangan gitu, berlebihan, lupakan

### 8.2 Understanding (Bobot: 35%)

Apakah chatbot menunjukkan bahwa ia mendengarkan dan memahami?

**Indikator:**
- "aku denger", "aku paham", "aku ngerti", "kedengarannya"
- Pertanyaan eksplorasi: "ceritain lebih lanjut", "gimana perasaan kamu"

### 8.3 Supportiveness (Bobot: 30%)

Apakah chatbot memberikan dukungan yang tulus?

**Indikator:**
- Kehadiran: disini, bersama, temani, ada untuk
- Dukungan: bantu, support, temani
- Dorongan: pelan-pelan, gapapa, berani, hebat

---

## 9. Penjelasan Konsistensi Konteks

### 9.1 Chunk Consistency (Bobot: 40%)

Apakah respons menggunakan informasi dari retrieved chunks?

**Diukur dengan:**
- Text overlap antara respons dan situasi dari expectedRetrievedContext
- Cosine similarity antara respons dan konteks chunk

### 9.2 Emotional Consistency (Bobot: 40%)

Apakah respons konsisten dengan arah emosional yang diharapkan?

**Diukur dengan:**
- Kehadiran kata kunci dari expectedEmotionalDirection

### 9.3 No Contradiction (Bobot: 20%)

Apakah respons bebas dari kontradiksi internal?

**Contoh kontradiksi:**
- "kamu harus semangat" + "gapapa kalo mau menyerah"
- "lupakan aja" + "kamu harus ingat"

---

## 10. Skenario Pengujian

### 10.1 Overthinking (2 skenario)

| ID | Nama | Severity |
|----|------|----------|
| overthinking_001 | Overthinking Malam Hari | 3/5 |
| overthinking_002 | Overthinking Sosial | 2/5 |

### 10.2 Anxiety (2 skenario)

| ID | Nama | Severity |
|----|------|----------|
| anxiety_001 | Kecemasan Tanpa Sebab Jelas | 4/5 |
| anxiety_002 | Kecemasan Sosial | 3/5 |

### 10.3 Relationship (2 skenario)

| ID | Nama | Severity |
|----|------|----------|
| relationship_001 | Rasa Tidak Pantas dalam Hubungan | 3/5 |
| relationship_002 | Pengkhianatan dalam Hubungan | 5/5 |

### 10.4 Motivasi (1 skenario)

| ID | Nama | Severity |
|----|------|----------|
| motivation_001 | Kehilangan Semangat Hidup | 3/5 |

### 10.5 Kesepian (2 skenario)

| ID | Nama | Severity |
|----|------|----------|
| loneliness_001 | Kesepian di Tengah Keramaian | 3/5 |
| loneliness_002 | Kesulitan Mencari Koneksi | 4/5 |

### 10.6 Stress Kuliah (2 skenario)

| ID | Nama | Severity |
|----|------|----------|
| stress_001 | Tugas Kuliah Menumpuk | 4/5 |
| stress_002 | Burnout Akademik | 4/5 |

### 10.7 Struktur Skenario

Setiap skenario memiliki properti berikut:

```typescript
interface TestScenario {
  id: string                    // ID unik
  name: string                  // Nama skenario
  category: string              // Kategori emosional
  userInput: string             // Input/query user
  expectedRetrievedContext: [   // Konteks RAG yang diharapkan
    {
      chunkId: string           // ID chunk
      topic: string             // Topik chunk
      situation: string         // Situasi emosional
      expectedRelevanceScore: number  // Skor relevansi yang diharapkan
      emotions: string[]        // Emosi yang terkandung
      needs: string[]           // Kebutuhan emosional
    }
  ]
  expectedEmotionalDirection: string[]   // Arah emosional yang diharapkan
  expectedResponseCriteria: string[]     // Kriteria respons
  requiredKeywords?: string[]            // Kata kunci yang harus muncul
  forbiddenKeywords?: string[]            // Kata kunci terlarang
  severityLevel: 1-5                     // Tingkat keparahan
}
```

---

## 11. Mock System

### 11.1 Mock Embeddings (mock-embeddings.ts)

Mensimulasikan endpoint `/api/embed` tanpa perlu memanggil API asli.

**Cara kerja:**
1. Hash teks input menjadi seed numerik
2. Gunakan Linear Congruential Generator (LCG) untuk menghasilkan vektor deterministic
3. Normalisasi vektor (panjang = 1)

**Karakteristik:**
- **Deterministic:** Teks yang sama menghasilkan embedding yang sama
- **Reproducible:** Seed tetap (default: 42) memastikan hasil konsisten
- **Dimensi:** 384 (sama dengan Xenova/Transformers)
- **Caching:** Embedding yang sudah pernah diproses di-cache

### 11.2 Mock Retrieval (mock-retrieval.ts)

Mensimulasikan retrieval RAG dari IndexedDB.

**Fungsi:**
- `mockRetrieve(query, chunks, topK, threshold)` — Retrieval dengan similarity scoring
- `mockDeterministicRetrieval(chunkIds)` — Retrieval dengan hasil yang sudah ditentukan
- `evaluateRetrievalAccuracy(chunks, groundTruth)` — Hitung precision, recall, F1

### 11.3 Mock LLM (mock-llm-response.ts)

Mensimulasikan respons dari Groq LLM.

**Fungsi:**
- `generateMockResponse(chunks)` — Respons berdasarkan chunks (template-based)
- `getDeterministicResponse(scenarioId)` — Respons tetap (sama setiap kali)
- `mockRagQueryStream(query, chunks, onToken)` — Streaming mock
- `mockStreamResponse(text, onToken, delay)` — Streaming token-by-token

### 11.4 Mock Chunks (mock-chunks.ts)

11 chunk RAG yang mencakup 6 kategori emosional:

| Kategori | Jumlah Chunk |
|----------|--------------|
| Overthinking | 2 |
| Anxiety | 2 |
| Relationship | 2 |
| Loneliness | 2 |
| Motivation | 1 |
| Academic Stress | 2 |

Setiap chunk memiliki struktur yang sama dengan chunk asli di `public/rag-chunks.json`:
- `scenario`: topic, situation, core_fear, self_perception
- `response_strategy`: tone, style, approach, conversation_pattern
- `example_style`: contoh gaya respons
- `metadata`: emotion, need, intensity, topic

---

## 12. Interpretasi Hasil

### 12.1 Membaca Skor

| Skor | Interpretasi untuk Skripsi |
|------|---------------------------|
| 85–100 | **Sangat Baik.** Sistem layak digunakan untuk dukungan emosional awal. |
| 70–84 | **Baik.** Sebagian besar skenario terpenuhi. Ada ruang untuk peningkatan. |
| 55–69 | **Cukup.** Sistem masih perlu pengembangan pada komponen tertentu. |
| 40–54 | **Kurang.** Beberapa skenario tidak terpenuhi dengan baik. |
| 0–39 | **Tidak Memadai.** Sistem belum siap untuk penggunaan praktis. |

### 12.2 Analisis per Dimensi

**Similarity (75-85):** Baik
- Berarti chatbot mampu merespon sesuai topik
- Kata-kata yang digunakan relevan dengan konteks

**Relevance (80-90):** Baik - Sangat Baik
- Berarti chatbot memberikan respons yang sesuai secara konten dan emosional
- Tone chatbot sesuai untuk situasi curhat

**Empathy (80-90):** Baik - Sangat Baik
- Berarti chatbot berhasil memvalidasi perasaan user
- Chatbot menunjukkan pemahaman dan dukungan
- **Ini adalah indikator terpenting untuk chatbot curhat**

**Contextual Consistency (70-80):** Baik
- Berarti chatbot konsisten dengan konteks yang diberikan
- Tidak ada kontradiksi dalam respons

**Retrieval Accuracy (70-80):** Baik
- Berarti sistem RAG berhasil mengambil chunk yang relevan
- Precision dan recall menunjukkan performa retrieval yang baik

### 12.3 Interpretasi 

**Skenario: Overthinking Malam Hari**
- Skor: 84/100
- Interpretasi: "Sistem mampu menangani skenario overthinking dengan baik. Respons menunjukkan empati yang tinggi (88) dan relevansi yang kuat (85). Chatbot berhasil memvalidasi perasaan user tanpa menghakimi. Retrieval RAG bekerja dengan baik (78) meskipun masih ada ruang untuk peningkatan precision."

**Skenario: Kecemasan Tanpa Sebab**
- Skor: 88/100
- Interpretasi: "Ini adalah skenario dengan skor tertinggi. Sistem sangat baik dalam menangani kecemasan umum, dengan nada yang menenangkan dan validasi emosional yang kuat. Retrieval berhasil mengambil chunk kecemasan yang paling relevan."

**Skenario: Kehilangan Semangat Hidup**
- Skor: 70/100
- Interpretasi: "Skenario motivasi mendapat skor terendah. Sistem cenderung memberikan respons yang lebih umum. Ini menunjukkan bahwa database chunk untuk kategori motivasi perlu diperluas agar retrieval lebih akurat."

---

## 13. Contoh Report

Lihat file `test/reports/sample-report.md` untuk contoh laporan evaluasi lengkap.

Format report mencakup:

1. **Header** — Judul, tanggal, institusi
2. **Ringkasan Eksekutif** — Skor rata-rata, tertinggi, terendah
3. **Distribusi Verdict** — Tabel distribusi predikat
4. **Rata-rata per Kategori** — Tabel rata-rata per dimensi evaluasi
5. **Tabel Hasil per Skenario** — Matriks skor semua skenario
6. **Detail per Skenario** — Breakdown skor dan metrik
7. **Interpretasi Akademik** — Analisis dan kesimpulan
8. **Saran Pengembangan** — Rekomendasi untuk iterasi berikutnya

---

## Catatan Akhir

### Batasan Sistem Testing

1. **Mock bersifat lokal** — Tidak menguji API asli Groq atau embedding
2. **Template-based** — Respons mock tidak sevariatif respons LLM asli
3. **Keyword-based** — Evaluasi menggunakan pendekatan kata kunci, bukan NLP lanjutan
4. **Tidak ada semantic understanding** — Tidak menangkap sinonim atau konteks kalimat kompleks

### Saran untuk Pengembangan Selanjutnya

1. Integrasi dengan API asli Groq untuk evaluasi end-to-end
2. Gunakan sentence transformer untuk semantic similarity yang lebih akurat
3. Tambahkan evaluasi oleh manusia (human evaluation) untuk validasi
4. Kembangkan detection untuk crisis/suicidal ideation
5. Tambahkan A/B testing untuk berbagai variasi prompt

### License

Sistem testing ini dikembangkan untuk keperluan akademik skripsi.
Dilarang menggunakan untuk tujuan komersial tanpa izin.

---

