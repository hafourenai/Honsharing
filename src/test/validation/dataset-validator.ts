import { TestScenario } from "@/test/types"
import { ValidationIssue, DatasetValidationResult, CategoryBalanceInfo } from "./types"

/**
 * Final Dataset Validation — memvalidasi kelengkapan dan
 * keseimbangan dataset penelitian.
 *
 * Memeriksa:
 * - Semua skenario memiliki data lengkap
 * - Distribusi kategori seimbang
 * - Semua field terisi
 * - Tidak ada duplikasi
 */
export function validateDataset(
  scenarios: TestScenario[]
): DatasetValidationResult {
  const issues: ValidationIssue[] = []

  // 1. Cek jumlah skenario
  if (scenarios.length === 0) {
    issues.push({
      id: "dataset_empty",
      type: "EMPTY_DATASET",
      level: "CRITICAL",
      message: "Dataset kosong! Tidak ada skenario pengujian.",
      source: "dataset-validator",
    })
    return {
      passed: false,
      totalScenarios: 0,
      categories: [],
      issues,
      categoryBalance: [],
      completeness: false,
      summary: "Dataset kosong — validasi gagal total.",
    }
  }

  // 2. Cek duplikasi ID
  const ids = scenarios.map((s) => s.id)
  const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i)
  if (duplicates.length > 0) {
    issues.push({
      id: "dataset_duplicates",
      type: "DUPLICATE_IDS",
      level: "CRITICAL",
      message: `Ditemukan ${duplicates.length} ID duplikat: ${[...new Set(duplicates)].join(", ")}`,
      source: "dataset-validator",
    })
  }

  // 3. Cek kelengkapan field
  for (const s of scenarios) {
    const missingFields: string[] = []
    if (!s.id) missingFields.push("id")
    if (!s.name) missingFields.push("name")
    if (!s.category) missingFields.push("category")
    if (!s.userInput) missingFields.push("userInput")
    if (!s.expectedRetrievedContext || s.expectedRetrievedContext.length === 0) {
      missingFields.push("expectedRetrievedContext")
    }
    if (!s.expectedEmotionalDirection || s.expectedEmotionalDirection.length === 0) {
      missingFields.push("expectedEmotionalDirection")
    }
    if (!s.expectedResponseCriteria || s.expectedResponseCriteria.length === 0) {
      missingFields.push("expectedResponseCriteria")
    }

    if (missingFields.length > 0) {
      issues.push({
        id: `dataset_missing_${s.id}`,
        type: "MISSING_FIELDS",
        level: "WARNING",
        message: `Skenario "${s.name}" (${s.id})缺少 field: ${missingFields.join(", ")}`,
        source: "dataset-validator",
      })
    }
  }

  // 4. Distribusi kategori
  const catMap = new Map<string, number>()
  for (const s of scenarios) {
    catMap.set(s.category, (catMap.get(s.category) || 0) + 1)
  }

  const total = scenarios.length
  const categories = Array.from(catMap.keys())
  const idealPerCategory = total / categories.length
  const categoryBalance: CategoryBalanceInfo[] = []

  for (const [cat, count] of catMap) {
    const percent = (count / total) * 100
    const diff = Math.abs(count - idealPerCategory)
    let status: "SEIMBANG" | "KURANG" | "BERLEBIH" = "SEIMBANG"
    if (diff >= 2) {
      status = count < idealPerCategory ? "KURANG" : "BERLEBIH"
    }

    if (status !== "SEIMBANG") {
      issues.push({
        id: `dataset_balance_${cat}`,
        type: "CATEGORY_IMBALANCE",
        level: "WARNING",
        message: `Kategori "${cat}" ${status} (${count} skenario, ideal ${idealPerCategory.toFixed(0)})`,
        source: "dataset-validator",
      })
    }

    categoryBalance.push({ category: cat, count, percent: Math.round(percent), status })
  }

  // 5. Severity distribution
  const severityMap = new Map<number, number>()
  for (const s of scenarios) {
    severityMap.set(s.severityLevel, (severityMap.get(s.severityLevel) || 0) + 1)
  }
  const severityEntries = Array.from(severityMap.entries()).sort((a, b) => a[0] - b[0])
  const hasLight = severityEntries.some(([k]) => k <= 2)
  const hasHeavy = severityEntries.some(([k]) => k >= 4)

  if (!hasLight || !hasHeavy) {
    issues.push({
      id: "dataset_severity_range",
      type: "SEVERITY_IMBALANCE",
      level: "WARNING",
      message: `Distribusi severity tidak merata: ${severityEntries.map(([k, v]) => `${k}=${v}`).join(", ")}`,
      details: "Idealnya ada variasi dari ringan (1-2) hingga berat (4-5).",
      source: "dataset-validator",
    })
  }

  const passed = issues.filter((i) => i.level === "CRITICAL").length === 0
  const completeness = issues.filter((i) => i.type === "MISSING_FIELDS").length === 0

  let summary: string
  if (passed && completeness) {
    summary = `Dataset valid: ${total} skenario dalam ${categories.length} kategori. Semua field lengkap, distribusi seimbang.`
  } else if (passed) {
    summary = `Dataset valid dengan catatan: ${issues.length} issue non-kritis ditemukan.`
  } else {
    summary = `Dataset TIDAK valid: ${issues.length} issue kritis ditemukan.`
  }

  return {
    passed,
    totalScenarios: total,
    categories,
    issues,
    categoryBalance,
    completeness,
    summary,
  }
}

/**
 * Menghasilkan markdown dataset validation.
 */
export function generateDatasetValidationMarkdown(
  result: DatasetValidationResult
): string {
  const lines: string[] = []
  lines.push("## Dataset Validation")
  lines.push("")
  lines.push(`**Status:** ${result.passed ? "✅ VALID" : "❌ INVALID"}`)
  lines.push(`**Total Skenario:** ${result.totalScenarios}`)
  lines.push(`**Jumlah Kategori:** ${result.categories.length}`)
  lines.push(`**Kelengkapan:** ${result.completeness ? "✅ Lengkap" : "❌ Tidak Lengkap"}`)
  lines.push("")
  lines.push(`**Ringkasan:** ${result.summary}`)
  lines.push("")

  if (result.categoryBalance.length > 0) {
    lines.push("### Keseimbangan Kategori")
    lines.push("")
    lines.push("| Kategori | Jumlah | Persentase | Status |")
    lines.push("|----------|--------|------------|--------|")
    for (const cb of result.categoryBalance) {
      const emoji = cb.status === "SEIMBANG" ? "✅" : "⚠️"
      lines.push(`| ${cb.category} | ${cb.count} | ${cb.percent}% | ${emoji} ${cb.status} |`)
    }
    lines.push("")
  }

  if (result.issues.length > 0) {
    lines.push("### Issues")
    lines.push("")
    for (const issue of result.issues) {
      lines.push(`- **${issue.level}**: ${issue.message}`)
    }
    lines.push("")
  }

  return lines.join("\n")
}
