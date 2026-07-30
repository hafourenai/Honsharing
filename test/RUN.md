# Cara Menjalankan Testing

## Prasyarat
- Node.js 18+
- `npm install` sudah dijalankan

## 1. Evaluasi Cepat (Contoh Usage)

Jalankan semua contoh evaluasi (single scenario, all scenarios, custom response, real evaluation system):

```bash
npx tsx test/examples/usage-example.ts
```

> **Sebelum jalan:** Buka `test/examples/usage-example.ts`, cari baris:
> ```ts
> // main().catch(console.error)
> ```
> Hapus `//` di depannya jadi:
> ```ts
> main().catch(console.error)
> ```
>
> **Setelah selesai**, comment lagi baris tersebut.

## 2. Evaluasi Semua Skenario + Report

File: `test/examples/full-evaluation-runner.ts`

```bash
npx tsx test/examples/full-evaluation-runner.ts
```

## 3. Evaluasi Satu Skenario Saja

```typescript
import { overthinkingScenario } from "@test/scenarios/overthinking"
import { mockRetrieve, getDeterministicResponse } from "@test/mocks"
import { evaluateSimilarity } from "@test/evaluators/similarity-evaluator"
import { evaluateRelevance } from "@test/evaluators/relevance-evaluator"
import { evaluateEmpathy } from "@test/evaluators/empathy-evaluator"

const scenario = overthinkingScenario
const chunks = await mockRetrieve(scenario.userInput)
const response = getDeterministicResponse(scenario.id)

const similarity = evaluateSimilarity(response, scenario)
const relevance = evaluateRelevance(response, scenario)
const empathy = evaluateEmpathy(response, scenario)

console.log(`Similarity: ${similarity.finalScore}`)
console.log(`Relevance: ${relevance.finalScore}`)
console.log(`Empathy: ${empathy.finalScore}`)
```

## 4. Evaluasi Real (API Asli)

Memanggil chatbot asli via **Gemini 2.0 Flash** (primary) dengan **Groq Llama 3.3-70b** sebagai fallback otomatis jika Gemini kena rate limit.

### Prasyarat
- `GEMINI_API_KEY` dan/atau `GROQ_API_KEY` terisi di `.env`
- `npm install` sudah dijalankan

### Cara Jalankan

**Terminal 1** — Jalankan server Next.js:
```bash
npm run dev     # default: http://localhost:3001
```

**Terminal 2** — Jalankan evaluasi REAL (chunk-driven, 19 skenario):
```bash
npx tsx test/examples/evaluate-chunks-with-groq.ts
```

### Fallback Behavior
| Skenario | Provider |
|----------|----------|
| Gemini available | ✅ `gemini-2.0-flash` |
| Gemini 429 (quota) | ➡️ Fallback ke Groq `llama-3.3-70b-versatile` |
| Keduanya gagal | ❌ Error response |

### Rate Limiting (Built-in)
| Situasi | Penanganan |
|---------|-----------|
| Antar request | Delay **2500ms** (33 skenario ≈ 82 detik) |
| HTTP 429 (rate limited) | Backoff 5s → 10s → 20s |
| Server error (5xx) | Backoff 2s → 4s → 8s |
| Timeout 30s | Retry 3x, skip jika terus gagal |

## Output

- Report tersimpan di: `test/generated-reports/`
- Format: Markdown (`.md`) dan JSON (`.json`)
- Hanya menyisakan report dari sesi terbaru — file lama dihapus otomatis

## Struktur File Penting

| File | Fungsi |
|------|--------|
| `test/examples/usage-example.ts` | Contoh lengkap semua evaluasi |
| `test/examples/full-evaluation-runner.ts` | Runner evaluasi penuh |
| `test/examples/save-reports.ts` | Simpan report ke file |
| `test/runner/evaluation-runner.ts` | Logic evaluasi |
| `test/config/test-config.ts` | Konfigurasi threshold & bobot |
| `test/scenarios/index.ts` | Daftar semua skenario |
