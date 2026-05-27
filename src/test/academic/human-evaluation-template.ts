/**
 * ============================================================
 * HUMAN EVALUATION TEMPLATE — TEMPLATE EVALUASI MANUSIA
 * ============================================================
 *
 * Menghasilkan template evaluasi manual untuk responden
 * manusia dengan skala Likert 1-5.
 *
 * Digunakan untuk:
 * - Validasi hasil evaluasi otomatis
 * - Mendapatkan feedback kualitatif
 * - Triangulasi data penelitian
 *
 * OUTPUT:
 * - Markdown (siap print)
 * - JSON (untuk pengolahan data)
 *
 * @author  Tim Skripsi
 * @version 1.0
 * ============================================================
 */

import { TestScenario } from "@/test/types"

// ================================================================
// TIPE DATA
// ================================================================

export interface HumanEvaluationQuestion {
  /** ID pertanyaan */
  id: string
  /** Aspek yang dinilai */
  aspek: string
  /** Pertanyaan */
  pertanyaan: string
  /** Skala Likert 1-5 */
  skala: [number, number, number, number, number]
  /** Label untuk setiap skala */
  labelSkala: [string, string, string, string, string]
}

export interface HumanEvaluationForm {
  /** Informasi form */
  metadata: {
    title: string
    purpose: string
    instructions: string
    respondentInfo: string[]
  }
  /** Skenario yang akan dievaluasi */
  scenarios: Array<{
    scenario: TestScenario
    questions: HumanEvaluationQuestion[]
    feedbackField: string
  }>
  /** Pertanyaan tambahan */
  additionalQuestions: HumanEvaluationQuestion[]
  /** Kolom saran */
  suggestionField: string
}

// ================================================================
// KONSTANTA
// ================================================================

const LIKERT_LABELS: [string, string, string, string, string] = [
  "Sangat Tidak Setuju",
  "Tidak Setuju",
  "Netral",
  "Setuju",
  "Sangat Setuju",
]

// ================================================================
// GENERATE TEMPLATE
// ================================================================

/**
 * Menghasilkan template evaluasi manusia untuk responden.
 *
 * @param scenarios - Daftar skenario yang akan dievaluasi
 * @returns HumanEvaluationForm
 */
export function generateHumanEvaluationTemplate(
  scenarios: TestScenario[]
): HumanEvaluationForm {
  const scenarioForms = scenarios.map((scenario) => ({
    scenario,
    questions: generateQuestionsForScenario(scenario),
    feedbackField: `Komentar untuk skenario "${scenario.name}":`,
  }))

  return {
    metadata: {
      title: "Formulir Evaluasi Chatbot Curhat Honey",
      purpose:
        "Formulir ini bertujuan untuk mengevaluasi kualitas respons chatbot curhat " +
        "Honey dari perspektif pengguna manusia. Hasil evaluasi ini akan digunakan " +
        "sebagai data triangulasi untuk memvalidasi hasil evaluasi otomatis dalam " +
        "penelitian skripsi.",
      instructions:
        "Berikut adalah beberapa percakapan antara user (orang yang curhat) dengan " +
        "chatbot Honey. Silakan baca percakapan tersebut dan berikan penilaian Anda " +
        "pada setiap aspek dengan skala 1-5.\n\n" +
        "Skala Penilaian:\n" +
        "1 = Sangat Tidak Setuju\n" +
        "2 = Tidak Setuju\n" +
        "3 = Netral\n" +
        "4 = Setuju\n" +
        "5 = Sangat Setuju\n\n" +
        "Tidak ada jawaban benar atau salah. Berikan penilaian yang jujur sesuai " +
        "dengan perasaan Anda.",
      respondentInfo: [
        "Nama (opsional):",
        "Usia:",
        "Jenis Kelamin:",
        "Pengalaman menggunakan chatbot sebelumnya: (Ya/Tidak)",
        "Frekuensi curhat ke orang lain: (Tidak Pernah/Jarang/Kadang/Sering)",
      ],
    },
    scenarios: scenarioForms,
    additionalQuestions: [
      {
        id: "overall_satisfaction",
        aspek: "Kepuasan Keseluruhan",
        pertanyaan: "Secara keseluruhan, saya puas dengan respons chatbot Honey.",
        skala: [1, 2, 3, 4, 5],
        labelSkala: LIKERT_LABELS,
      },
      {
        id: "would_use",
        aspek: "Minat Penggunaan",
        pertanyaan: "Saya akan menggunakan chatbot Honey jika sedang membutuhkan dukungan emosional.",
        skala: [1, 2, 3, 4, 5],
        labelSkala: LIKERT_LABELS,
      },
      {
        id: "human_like",
        aspek: "Naturalitas",
        pertanyaan: "Respons chatbot terasa alami seperti berbicara dengan manusia.",
        skala: [1, 2, 3, 4, 5],
        labelSkala: LIKERT_LABELS,
      },
      {
        id: "safe",
        aspek: "Kenyamanan",
        pertanyaan: "Saya merasa aman dan nyaman saat curhat dengan chatbot Honey.",
        skala: [1, 2, 3, 4, 5],
        labelSkala: LIKERT_LABELS,
      },
      {
        id: "recommend",
        aspek: "Rekomendasi",
        pertanyaan: "Saya akan merekomendasikan chatbot Honey kepada teman yang membutuhkan dukungan emosional.",
        skala: [1, 2, 3, 4, 5],
        labelSkala: LIKERT_LABELS,
      },
    ],
    suggestionField:
      "Saran dan masukan untuk pengembangan chatbot Honey:",
  }
}

// ================================================================
// QUESTIONS PER SKENARIO
// ================================================================

function generateQuestionsForScenario(
  scenario: TestScenario
): HumanEvaluationQuestion[] {
  return [
    {
      id: `${scenario.id}_relevance`,
      aspek: "Relevansi",
      pertanyaan: `Respons chatbot relevan dengan masalah yang disampaikan user ("${truncate(scenario.userInput, 50)}").`,
      skala: [1, 2, 3, 4, 5],
      labelSkala: LIKERT_LABELS,
    },
    {
      id: `${scenario.id}_empathy`,
      aspek: "Empati",
      pertanyaan: "Chatbot menunjukkan empati dan memahami perasaan user.",
      skala: [1, 2, 3, 4, 5],
      labelSkala: LIKERT_LABELS,
    },
    {
      id: `${scenario.id}_comfort`,
      aspek: "Kenyamanan",
      pertanyaan: "Saya merasa nyaman dengan cara chatbot merespon curhat ini.",
      skala: [1, 2, 3, 4, 5],
      labelSkala: LIKERT_LABELS,
    },
    {
      id: `${scenario.id}_naturalness`,
      aspek: "Naturalitas",
      pertanyaan: "Respons chatbot terdengar alami, tidak seperti robot.",
      skala: [1, 2, 3, 4, 5],
      labelSkala: LIKERT_LABELS,
    },
    {
      id: `${scenario.id}_helpfulness`,
      aspek: "Kebermanfaatan",
      pertanyaan: "Respons chatbot membantu meringankan beban emosional user.",
      skala: [1, 2, 3, 4, 5],
      labelSkala: LIKERT_LABELS,
    },
  ]
}

// ================================================================
// GENERATE MARKDOWN (PRINTABLE)
// ================================================================

export function generateHumanEvalMarkdown(
  form: HumanEvaluationForm
): string {
  const lines: string[] = []
  const m = form.metadata

  lines.push(`# ${m.title}`)
  lines.push("")
  lines.push(`**Tujuan:** ${m.purpose}`)
  lines.push("")
  lines.push("---")
  lines.push("")
  lines.push("## Petunjuk Pengisian")
  lines.push("")
  lines.push(m.instructions)
  lines.push("")
  lines.push("## Data Responden")
  lines.push("")
  for (const info of m.respondentInfo) {
    lines.push(`- ${info} _____________`)
  }
  lines.push("")
  lines.push("---")
  lines.push("")

  // Per skenario
  for (let i = 0; i < form.scenarios.length; i++) {
    const sf = form.scenarios[i]
    const sc = sf.scenario

    lines.push(`## Skenario ${i + 1}: ${sc.name}`)
    lines.push("")
    lines.push(`**Kategori:** ${sc.category}`)
    lines.push(`**Tingkat Keparahan:** ${sc.severityLevel}/5`)
    lines.push("")
    lines.push("### Percakapan:")
    lines.push("")
    lines.push(`**User:** "${sc.userInput}"`)
    lines.push("")
    lines.push("### Penilaian")
    lines.push("")

    for (const q of sf.questions) {
      lines.push(`**${q.aspek}**`)
      lines.push("")
      lines.push(q.pertanyaan)
      lines.push("")
      const skalaStr = q.skala.map((s, i) => `  [${s}] ${q.labelSkala[i]}`).join("\n")
      lines.push(skalaStr)
      lines.push("")
      lines.push(`Jawaban: ___`)
      lines.push("")
    }

    lines.push("### Komentar")
    lines.push("")
    lines.push(`${sf.feedbackField}`)
    lines.push("")
    lines.push("_____________")
    lines.push("")
    lines.push("---")
    lines.push("")
  }

  // Additional questions
  lines.push("## Pertanyaan Tambahan")
  lines.push("")
  for (const q of form.additionalQuestions) {
    lines.push(`**${q.aspek}**`)
    lines.push("")
    lines.push(q.pertanyaan)
    lines.push("")
    const skalaStr = q.skala.map((s, i) => `  [${s}] ${q.labelSkala[i]}`).join("\n")
    lines.push(skalaStr)
    lines.push("")
    lines.push(`Jawaban: ___`)
    lines.push("")
  }

  // Suggestion
  lines.push("## Saran dan Masukan")
  lines.push("")
  lines.push(form.suggestionField)
  lines.push("")
  lines.push("_____________")
  lines.push("")
  lines.push("---")
  lines.push("")
  lines.push("*Terima kasih atas partisipasi Anda dalam penelitian ini.*")

  return lines.join("\n")
}

// ================================================================
// GENERATE JSON
// ================================================================

export function generateHumanEvalJSON(
  form: HumanEvaluationForm
): string {
  return JSON.stringify(form, null, 2)
}

// ================================================================
// HELPERS
// ================================================================

function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return text.substring(0, max) + "..."
}
