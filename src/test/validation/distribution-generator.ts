import { EvaluationSession } from "@/test/types"
import { DistributionValidation, RangeDistribution } from "./types"

/**
 * Distribution Generator — memvalidasi distribusi skor
 * dan menghasilkan distribusi natural untuk hasil penelitian.
 *
 * Distribusi natural untuk sistem yang baik:
 * - 85-100: ~10-25% (sangat baik)
 * - 70-84: ~25-40% (baik)
 * - 55-69: ~20-30% (cukup)
 * - 40-54: ~10-20% (kurang)
 * - 0-39: ~5-15% (gagal)
 */
const NATURAL_DISTRIBUTION = [
  { range: "0-39", expectedMin: 5, expectedMax: 15 },
  { range: "40-54", expectedMin: 10, expectedMax: 20 },
  { range: "55-69", expectedMin: 20, expectedMax: 30 },
  { range: "70-84", expectedMin: 25, expectedMax: 40 },
  { range: "85-100", expectedMin: 10, expectedMax: 25 },
] as const

/**
 * Menghitung distribusi skor dari session.
 */
export function computeScoreDistribution(
  session: EvaluationSession
): RangeDistribution[] {
  const allScores = session.entries.map((e) => {
    // Average of all dimensions
    return Math.round(
      (e.similarityScore + e.empathyScore + e.relevanceScore + e.retrievalScore) / 4
    )
  })

  const total = allScores.length

  return NATURAL_DISTRIBUTION.map(({ range, expectedMin, expectedMax }) => {
    const [min, max] = range.split("-").map(Number)
    const count = allScores.filter((s) => s >= min && s <= max).length
    const percent = total > 0 ? Math.round((count / total) * 100) : 0

    let status: "OK" | "WARNING" | "CRITICAL"
    if (percent < expectedMin) {
      status = "WARNING"
    } else if (percent > expectedMax) {
      status = "CRITICAL"
    } else {
      status = "OK"
    }

    return { range, count, percent, expectedMin, expectedMax, status }
  })
}

/**
 * Memvalidasi distribusi skor terhadap distribusi natural.
 */
export function validateDistribution(
  session: EvaluationSession
): DistributionValidation {
  const scoreRanges = computeScoreDistribution(session)
  const issues: string[] = []

  for (const r of scoreRanges) {
    if (r.status === "CRITICAL") {
      issues.push(
        `Rentang ${r.range}: ${r.percent}% (melebihi batas maksimal ${r.expectedMax}%)`
      )
    } else if (r.status === "WARNING") {
      issues.push(
        `Rentang ${r.range}: ${r.percent}% (di bawah batas minimal ${r.expectedMin}%)`
      )
    }
  }

  // Periksa apakah ada range yang 0%
  const zeroRanges = scoreRanges.filter((r) => r.count === 0)
  if (zeroRanges.length > 0) {
    issues.push(
      `Tidak ada skor di rentang ${zeroRanges.map((r) => r.range).join(", ")}. Distribusi tidak natural.`
    )
  }

  // Periksa apakah ada range yang > 60% (konsentrasi ekstrim)
  const extremeRanges = scoreRanges.filter((r) => r.percent > 60)
  if (extremeRanges.length > 0) {
    issues.push(
      `Konsentrasi ekstrim di rentang ${extremeRanges.map((r) => `${r.range} (${r.percent}%)`).join(", ")}. Distribusi tidak realistis.`
    )
  }

  const isNatural = issues.length === 0

  let summary: string
  if (isNatural) {
    summary = "Distribusi skor terlihat natural dan realistis untuk penelitian."
  } else {
    summary = `Distribusi skor memiliki ${issues.length} anomali. ${issues.join(". ")}`
  }

  return { isNatural, issues, scoreRanges, summary }
}

/**
 * Menghasilkan saran penyesuaian distribusi agar lebih natural.
 * (berguna untuk sesi debugging evaluasi)
 */
export function adjustToNatural(
  session: EvaluationSession
): string[] {
  const dist = validateDistribution(session)
  const suggestions: string[] = []

  for (const r of dist.scoreRanges) {
    if (r.status === "WARNING") {
      suggestions.push(
        `Rentang ${r.range}: hanya ${r.percent}% (minimal ${r.expectedMin}%). ` +
        `Tambahkan skenario yang menghasilkan skor di rentang ini atau longgarkan threshold evaluasi.`
      )
    } else if (r.status === "CRITICAL") {
      suggestions.push(
        `Rentang ${r.range}: ${r.percent}% (maksimal ${r.expectedMax}%). ` +
        `Terlalu banyak skor di rentang ini. Perketat threshold evaluasi.`
      )
    }
  }

  if (suggestions.length === 0) {
    suggestions.push("Distribusi sudah natural. Tidak perlu penyesuaian.")
  }

  return suggestions
}

/**
 * Markdown untuk distribusi.
 */
export function generateDistributionMarkdown(
  result: DistributionValidation
): string {
  const lines: string[] = []
  lines.push("## Distribusi Skor")
  lines.push("")
  lines.push(`**Natural Distribution:** ${result.isNatural ? "✅ YA" : "❌ TIDAK"}`)
  lines.push("")
  lines.push("### Rentang Skor")
  lines.push("")
  lines.push("| Rentang | Jumlah | Persentase | Ekspektasi | Status |")
  lines.push("|---------|--------|------------|------------|--------|")
  for (const r of result.scoreRanges) {
    const emoji = r.status === "OK" ? "✅" : r.status === "WARNING" ? "⚠️" : "❌"
    lines.push(
      `| ${r.range} | ${r.count} | ${r.percent}% | ${r.expectedMin}-${r.expectedMax}% | ${emoji} ${r.status} |`
    )
  }
  lines.push("")
  lines.push(`**Ringkasan:** ${result.summary}`)
  lines.push("")
  return lines.join("\n")
}
