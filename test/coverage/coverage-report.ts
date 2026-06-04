import { ALL_SCENARIOS } from "@test/scenarios"
import { GENERATED_SCENARIOS } from "@test/scenarios/generated-from-chunks"
import { ALL_MOCK_CHUNKS } from "@test/mocks/mock-chunks"
import { Chunk } from "@/lib/rag/promptBuilder"

export interface ChunkCoverage {
  chunkId: string
  topic: string
  category: string
  intensity: string
  testedByLegacy: boolean
  legacyScenarioIds: string[]
  testedByGenerated: boolean
  generatedScenarioId: string | null
  triggerPhrasesCount: number
  userInputSource: string
}

export interface CoverageReport {
  totalChunks: number
  coveredByLegacy: number
  coveredByGenerated: number
  uncoveredChunks: ChunkCoverage[]
  chunks: ChunkCoverage[]
  legacyCoveragePercent: string
  generatedCoveragePercent: string
  overallCoveragePercent: string
  summary: string
  markdown: string
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0,
    normA = 0,
    normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  if (normA === 0 || normB === 0) return 0
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

function simpleTokenSimilarity(a: string, b: string): number {
  const tokenize = (s: string) =>
    new Set(
      s
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 2),
    )
  const setA = tokenize(a)
  const setB = tokenize(b)
  if (setA.size === 0 || setB.size === 0) return 0
  let intersection = 0
  for (const item of setA) {
    if (setB.has(item)) intersection++
  }
  return intersection / Math.max(setA.size, setB.size)
}

export function generateCoverageReport(): CoverageReport {
  const rawChunks = ALL_MOCK_CHUNKS as Chunk[]

  const allLegacyScenarioIds = new Set(ALL_SCENARIOS.map((s) => s.id))

  const legacyRefMap: Record<string, string[]> = {}
  for (const scenario of ALL_SCENARIOS) {
    for (const ctx of scenario.expectedRetrievedContext) {
      if (!legacyRefMap[ctx.chunkId]) legacyRefMap[ctx.chunkId] = []
      legacyRefMap[ctx.chunkId].push(scenario.id)
    }
  }

  const generatedMap: Record<string, string> = {}
  for (const scenario of GENERATED_SCENARIOS) {
    const chunkId = scenario.id.replace("chunk_", "")
    generatedMap[chunkId] = scenario.id
  }

  const chunks: ChunkCoverage[] = rawChunks.map((chunk) => {
    const legacyScenarioIds = legacyRefMap[chunk.id] || []
    const testedByLegacy = legacyScenarioIds.length > 0
    const testedByGenerated = !!generatedMap[chunk.id]

    const matchScore = legacyScenarioIds.length > 0
      ? simpleTokenSimilarity(
          ALL_SCENARIOS.find((s) =>
            s.expectedRetrievedContext.some((c) => c.chunkId === chunk.id),
          )?.userInput || "",
          chunk.scenario.situation,
        )
      : 0

    return {
      chunkId: chunk.id,
      topic: chunk.scenario.topic,
      category: chunk.metadata.topic,
      intensity: chunk.metadata.intensity,
      testedByLegacy,
      legacyScenarioIds,
      testedByGenerated,
      generatedScenarioId: generatedMap[chunk.id] || null,
      triggerPhrasesCount: 0,
      userInputSource: testedByLegacy
        ? `legacy (alignment: ${(matchScore * 100).toFixed(0)}%)`
        : "generated",
    }
  })

  const totalChunks = chunks.length
  const coveredByLegacy = chunks.filter((c) => c.testedByLegacy).length
  const coveredByGenerated = chunks.filter((c) => c.testedByGenerated).length
  const coveredByEither = chunks.filter(
    (c) => c.testedByLegacy || c.testedByGenerated,
  ).length
  const uncoveredChunks = chunks.filter(
    (c) => !c.testedByLegacy && !c.testedByGenerated,
  )

  const legacyCoveragePercent = ((coveredByLegacy / totalChunks) * 100).toFixed(
    1,
  )
  const generatedCoveragePercent = (
    (coveredByGenerated / totalChunks) *
    100
  ).toFixed(1)
  const overallCoveragePercent = ((coveredByEither / totalChunks) * 100).toFixed(
    1,
  )

  const markdown = generateCoverageMarkdown(
    chunks,
    uncoveredChunks,
    totalChunks,
    coveredByLegacy,
    coveredByGenerated,
    coveredByEither,
    legacyCoveragePercent,
    generatedCoveragePercent,
    overallCoveragePercent,
  )

  return {
    totalChunks,
    coveredByLegacy,
    coveredByGenerated,
    uncoveredChunks,
    chunks,
    legacyCoveragePercent: `${legacyCoveragePercent}%`,
    generatedCoveragePercent: `${generatedCoveragePercent}%`,
    overallCoveragePercent: `${overallCoveragePercent}%`,
    summary: `Coverage: ${coveredByEither}/${totalChunks} chunks covered (${overallCoveragePercent}%)`,
    markdown,
  }
}

function generateCoverageMarkdown(
  chunks: ChunkCoverage[],
  uncoveredChunks: ChunkCoverage[],
  totalChunks: number,
  coveredByLegacy: number,
  coveredByGenerated: number,
  coveredByEither: number,
  legacyCoveragePercent: string,
  generatedCoveragePercent: string,
  overallCoveragePercent: string,
): string {
  const lines: string[] = []

  lines.push("# Coverage Report — RAG Chunks vs Test Scenarios")
  lines.push("")
  lines.push(`**Generated:** ${new Date().toISOString()}`)
  lines.push("")
  lines.push("## Summary")
  lines.push("")
  lines.push(`| Metrik | Nilai |`)
  lines.push(`|--------|-------|`)
  lines.push(`| Total Chunks di rag-chunks.json | ${totalChunks} |`)
  lines.push(`| Covered by Legacy Scenarios | ${coveredByLegacy}/${totalChunks} (${legacyCoveragePercent}) |`)
  lines.push(`| Covered by Generated Scenarios | ${coveredByGenerated}/${totalChunks} (${generatedCoveragePercent}) |`)
  lines.push(`| Overall Coverage | ${coveredByEither}/${totalChunks} (${overallCoveragePercent}) |`)
  lines.push(`| Uncovered Chunks | ${uncoveredChunks.length} |`)
  lines.push("")
  lines.push("## Per-Chunk Coverage")
  lines.push("")
  lines.push("| Chunk ID | Topic | Category | Intensity | Legacy | Generated | Input Source |")
  lines.push("|----------|-------|----------|-----------|--------|-----------|-------------|")

  for (const c of chunks) {
    const legacyStatus = c.testedByLegacy ? `✅ (${c.legacyScenarioIds.length} skenario)` : "❌"
    const genStatus = c.testedByGenerated ? "✅" : "❌"
    lines.push(
      `| ${c.chunkId} | ${c.topic} | ${c.category} | ${c.intensity} | ${legacyStatus} | ${genStatus} | ${c.userInputSource} |`,
    )
  }

  if (uncoveredChunks.length > 0) {
    lines.push("")
    lines.push("## Uncovered Chunks")
    lines.push("")
    lines.push("Chunk berikut **tidak memiliki** test scenario sama sekali:")
    lines.push("")
    for (const c of uncoveredChunks) {
      lines.push(`- **${c.chunkId}** — ${c.topic} (${c.category}, ${c.intensity})`)
    }
    lines.push("")
    lines.push("> ✅ **Chunk-Driven mode** secara otomatis menutupi celah ini dengan generate scenario dari setiap chunk.")
  }

  lines.push("")
  lines.push("## Topic Mapping (Legacy Scenarios)")
  lines.push("")
  lines.push("Tabel berikut menunjukkan mapping antara chunk topic dan kategori skenario legacy:")
  lines.push("")
  lines.push("| Chunk Topic | Chunk ID | Scenario Category | Scenario IDs |")
  lines.push("|-------------|----------|-------------------|-------------|")

  for (const c of chunks) {
    if (c.legacyScenarioIds.length > 0) {
      const scenarioCategories = [
        ...new Set(
          c.legacyScenarioIds
            .map((id) => ALL_SCENARIOS.find((s) => s.id === id))
            .filter(Boolean)
            .map((s) => s!.category),
        ),
      ].join(", ")
      lines.push(
        `| ${c.topic} | ${c.chunkId} | ${scenarioCategories} | ${c.legacyScenarioIds.join(", ")} |`,
      )
    } else {
      lines.push(`| ${c.topic} | ${c.chunkId} | _(no legacy)_ | — |`)
    }
  }

  lines.push("")
  lines.push("---")
  lines.push("")
  lines.push(
    "_Report generated by coverage-report.ts — part of the automated evaluation system._",
  )

  return lines.join("\n")
}
