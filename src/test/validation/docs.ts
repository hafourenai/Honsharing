/**
 * ============================================================
 * DOKUMENTASI — SISTEM VALIDASI UNTUK SKRIPSI
 * ============================================================
 *
 * Sistem validasi ini digunakan untuk memvalidasi hasil evaluasi
 * chatbot RAG berbasis emosi sebelum digunakan dalam skripsi.
 *
 * ## Cara Penggunaan
 *
 * ```typescript
 * import { runFinalValidation } from "./validation"
 *
 * const result = runFinalValidation(session, scenarios, failures, comparison)
 * console.log(result.markdown)         // Laporan lengkap dalam markdown
 * console.log(result.overallGrade)     // SANGAT BAIK / BAIK / CUKUP / KURANG
 * console.log(result.passed)           // true/false
 * ```
 *
 * ## Modul Validasi
 *
 * 1. **Validation Runner** (validation-runner.ts)
 *    - Entry point utama
 *    - Memanggil semua validator dan menggabungkan hasil
 *
 * 2. **Consistency Checker** (consistency-checker.ts)
 *    - Mendeteksi inkonsistensi antar skor dimensi
 *    - Contoh: similarity tinggi + relevance rendah
 *    - Menghasilkan Consistency Score (0-100)
 *
 * 3. **Sanity Check** (sanity-check.ts)
 *    - Memeriksa apakah hasil realistis/tidak fabricated
 *    - Mendeteksi: semua skor tinggi, tidak ada failure, variasi rendah
 *    - Menghasilkan Realism Score (0-100)
 *
 * 4. **Outlier Detector** (outlier-detector.ts)
 *    - Mendeteksi skor abnormal dengan z-score
 *    - Mendeteksi ketimpangan ekstrim antar dimensi
 *    - Label: NORMAL / WARNING / CRITICAL
 *
 * 5. **Dataset Validator** (dataset-validator.ts)
 *    - Memeriksa kelengkapan field skenario
 *    - Mengecek keseimbangan kategori
 *    - Mendeteksi duplikasi ID
 *
 * 6. **Reliability Summary** (reliability-summary.ts)
 *    - Menghitung keandalan sistem berdasarkan distribusi label
 *    - Label: TINGGI / SEDANG / RENDAH
 *
 * 7. **RAG Effectiveness Validator** (rag-effectiveness-validator.ts)
 *    - Mengukur peningkatan RAG vs Non-RAG
 *    - Signifikan jika improvement > 15%
 *
 * 8. **Distribution Generator** (distribution-generator.ts)
 *    - Memvalidasi distribusi skor terhadap distribusi natural
 *    - Distribusi natural: kurva condong kiri (left-skewed)
 *
 * 9. **Final Interpretation** (final-interpretation.ts)
 *    - Menghasilkan narasi interpretasi dalam Bahasa Indonesia formal
 *    - Siap digunakan untuk BAB 4 dan BAB 5 skripsi
 *
 * 10. **Final Recommendations** (final-recommendations.ts)
 *     - Rekomendasi pengembangan sistem dan penelitian selanjutnya
 *
 * ## Interpretasi Grade
 *
 * - **SANGAT BAIK**: Semua seksi PASS
 * - **BAIK**: Tidak ada FAIL, beberapa WARNING
 * - **CUKUP**: 1-2 seksi FAIL
 * - **KURANG**: >2 seksi FAIL
 *
 * ## Catatan Penting
 *
 * 1. Validasi ini untuk hasil evaluasi OTOMATIS saja.
 *    Human evaluation tetap diperlukan untuk validasi akhir.
 *
 * 2. Outlier CRITICAL perlu diinvestigasi manual.
 *    Ini mungkin menunjukkan bug atau kelemahan serius.
 *
 * 3. Jika Sanity Check FAIL, hasil mungkin tidak realistis.
 *    Periksa threshold evaluasi dan metode penilaian.
 *
 * 4. Reliability RENDAH berarti sistem tidak siap produksi.
 *    Gunakan untuk justifikasi pengembangan selanjutnya.
 *
 * @author  Tim Skripsi
 * @version 2.0 (Final)
 */
export const validationDocs = "Lihat file ini untuk dokumentasi lengkap."
