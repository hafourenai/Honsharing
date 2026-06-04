import { TestScenario } from "@test/types"
import rawChunks from "@/../public/rag-chunks.json"

interface RawChunk {
  id: string
  scenario: {
    topic: string
    situation: string
    core_fear: string
    self_perception: string
  }
  trigger_phrases: string[]
  response_strategy: {
    tone: string
    style: string
    approach: string[]
    conversation_pattern: string[]
  }
  example_style: string[]
  example_dialog: Array<{ user: string; bot: string }>
  metadata: {
    emotion: string[]
    need: string[]
    intensity: string
    topic: string
  }
}

const STOP_WORDS = new Set([
  "dengan", "tidak", "sudah", "belum", "kalian", "mereka", "karena",
  "namun", "tetapi", "sedang", "untuk", "adalah", "bukan", "iya",
  "tapi", "ada", "akan", "dapat", "dari", "dalam", "sama", "kamu",
  "aku", "ini", "itu", "dia", "yang", "dan", "atau", "juga",
])

function extractKeywords(
  styles: string[],
  dialogs: Array<{ user: string; bot: string }>,
): string[] {
  const allText = [...styles, ...dialogs.map((d) => d.bot)].join(" ")
  const words = allText
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w))

  const freq: Record<string, number> = {}
  words.forEach((w) => {
    freq[w] = (freq[w] || 0) + 1
  })

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([w]) => w)
}

function intensityToSeverity(intensity: string): 1 | 2 | 3 | 4 | 5 {
  switch (intensity) {
    case "low":
      return 1
    case "medium":
      return 2
    case "medium-high":
      return 3
    case "high":
      return 4
    case "very high":
      return 5
    default:
      return 3
  }
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function pickUserInput(chunk: RawChunk): string {
  if (chunk.trigger_phrases && chunk.trigger_phrases.length > 0) {
    return chunk.trigger_phrases[0]
  }
  if (chunk.example_dialog && chunk.example_dialog.length > 0) {
    return chunk.example_dialog[0].user
  }
  return `Aku sedang mengalami ${chunk.scenario.topic}`
}

function generateScenarioFromChunk(chunk: RawChunk): TestScenario {
  const userInput = pickUserInput(chunk)

  const expectedResponseCriteria = [
    `Menggunakan nada bicara yang ${chunk.response_strategy.tone}`,
    `Gaya berbicara seperti ${chunk.response_strategy.style}`,
    ...chunk.response_strategy.approach.map((a) => capitalize(a)),
  ]

  const expectedEmotionalDirection = [
    ...chunk.response_strategy.approach.map((a) => capitalize(a) + "."),
    ...chunk.response_strategy.conversation_pattern.map((a) =>
      capitalize(a) + ".",
    ),
  ]

  return {
    id: `chunk_${chunk.id}`,
    name: capitalize(chunk.scenario.topic),
    category: chunk.metadata.topic,
    userInput,
    expectedRetrievedContext: [
      {
        chunkId: chunk.id,
        topic: chunk.scenario.topic,
        situation: chunk.scenario.situation,
        expectedRelevanceScore: 0.85,
        emotions: chunk.metadata.emotion,
        needs: chunk.metadata.need,
      },
    ],
    expectedEmotionalDirection,
    expectedResponseCriteria,
    requiredKeywords: extractKeywords(
      chunk.example_style,
      chunk.example_dialog,
    ),
    severityLevel: intensityToSeverity(chunk.metadata.intensity),
  }
}

const rawArray = rawChunks as RawChunk[]

export const GENERATED_SCENARIOS: TestScenario[] = rawArray.map(
  (chunk) => generateScenarioFromChunk(chunk),
)

export function getGeneratedScenarios(): TestScenario[] {
  return [...GENERATED_SCENARIOS]
}

export function getGeneratedScenarioByChunkId(
  chunkId: string,
): TestScenario | undefined {
  return GENERATED_SCENARIOS.find((s) => s.id === `chunk_${chunkId}`)
}
