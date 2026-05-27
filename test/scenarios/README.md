# Scenarios — Skenario Pengujian Chatbot Curhat

## Apa itu Scenarios?

Scenarios adalah kumpulan **data uji berbentuk percakapan** yang mensimulasikan berbagai kondisi emosional user. Setiap skenario berisi:

- **Input user** — kalimat yang mungkin diucapkan user
- **Konteks RAG yang diharapkan** — chunk mana yang relevan, skor relevansi
- **Arah emosi yang diharapkan** — bagaimana chatbot harus merespon secara emosional
- **Kriteria respons** — syarat kualitas respons
- **Kata kunci wajib & terlarang** — untuk validasi otomatis
- **Tingkat keparahan** (1–5)

## Kenapa Scenarios Diperlukan?

| Alasan | Penjelasan |
|--------|-----------|
| **Evaluasi konsisten** | Semua skenario diuji dengan input yang sama setiap kali eval dijalankan, hasilnya reproducible |
| **Cakupan emosional luas** | 32 skenario single-turn + 10 multi-turn mencakup 9 kategori (overthinking, anxiety, relationship, insecure, keluarga, motivasi, stress, kesepian, burnout) |
| **Deteksi regresi** | Setelah perubahan kode, jalankan ulang seluruh skenario untuk memastikan kualitas tidak turun |
| **Validasi RAG** | Setiap skenario punya `expectedRetrievedContext` yang menguji apakah RAG mengambil chunk yang tepat |
| **Basis data akademik** | Skenario adalah dataset terstruktur untuk analisis kuantitatif di skripsi |
| **Mock & Real mode** | Skenario yang sama bisa diuji dalam mode mock (tanpa API) maupun real (dengan Groq API) |

## Daftar File

### Single-Turn (32 skenario)

| File | Kategori | Jumlah | Contoh Skenario |
|------|----------|--------|-----------------|
| `overthinking.ts` | Overthinking | 4 | Overthinking malam hari, sosial, masa depan, perbandingan diri |
| `anxiety.ts` | Kecemasan | 4 | Kecemasan umum, sosial, kesehatan, kegagalan |
| `relationship.ts` | Hubungan | 3 | Rasa tidak pantas, pengkhianatan, kesalahpahaman |
| `insecure.ts` | Rasa tidak aman | 4 | Self doubt akademik, impostor syndrome, fisik, sosial |
| `keluarga.ts` | Keluarga | 4 | Konflik ortu, broken home, tekanan ekspektasi, komunikasi |
| `kehilangan-motivasi.ts` | Motivasi | 3 | Kehilangan semangat, arah hidup, merasa tidak berguna |
| `stress-kuliah.ts` | Stress akademik | 3 | Tugas menumpuk, burnout akademik, prokrastinasi |
| `kesepian.ts` | Kesepian | 4 | Di keramaian, isolasi, kota baru, kehilangan teman |
| `burnout.ts` | Burnout | 3 | Rutinitas, organisasi, overworking |

### Multi-Turn (10 percakapan)

| File | Kategori | Jumlah Percakapan |
|------|----------|-------------------|
| `multi-turn/index.ts` | Multi-turn | 10 percakapan (4–8 pesan per percakapan) |

Multi-turn menguji **context retention** dan **memory consistency** chatbot dalam percakapan berkelanjutan.

## Cara Scenarios Dipakai

```
usage-example.ts / full-evaluation-runner.ts / save-reports.ts
        |
        v
runner/evaluation-runner.ts     — iterasi ALL_SCENARIOS, panggil mock/real
runner/rag-vs-non-rag.ts        — bandingkan performa RAG vs Non-RAG
real-evaluation/*               — evaluasi real dengan Groq API
        |
        v
evaluators/*                     — hitung similarity, relevance, empathy, dll
        |
        v
reports/*                        — generate laporan markdown & statistik
```

## Catatan

- Scenarios **BUKAN RAG data**. RAG chunks di `public/rag-chunks.json` adalah basis pengetahuan chatbot. Scenarios adalah **test case input** untuk mengevaluasi kualitas respons chatbot.
- Karena sudah ada data riil di `rag-chunks.json`, scenarios tetap diperlukan sebagai **test specification** yang mendefinisikan seperti apa respons yang baik untuk setiap situasi emosional.
