import { Chunk } from "@/lib/rag/promptBuilder";
import rawChunks from "@/../public/rag-chunks.json";

function castToChunk(data: unknown): Chunk {
  const d = data as Record<string, unknown>;
  const s = d.scenario as Record<string, string>;
  const r = d.response_strategy as Record<string, unknown>;
  const m = d.metadata as Record<string, unknown>;
  return {
    id: d.id as string,
    scenario: {
      topic: s.topic,
      situation: s.situation,
      core_fear: s.core_fear,
      self_perception: s.self_perception,
    },
    response_strategy: {
      tone: r.tone as string,
      style: r.style as string,
      approach: r.approach as string[],
      conversation_pattern: r.conversation_pattern as string[],
    },
    example_style: d.example_style as string[],
    metadata: {
      emotion: m.emotion as string[],
      need: m.need as string[],
      intensity: m.intensity as string,
      topic: m.topic as string,
    },
  };
}

const rawArray = rawChunks as unknown[];
export const ALL_MOCK_CHUNKS: Chunk[] = rawArray.map(castToChunk);

export function getMockChunksByTopic(topic: string): Chunk[] {
  return ALL_MOCK_CHUNKS.filter((chunk) => chunk.metadata.topic === topic);
}

export function getMockChunksByEmotion(emotion: string): Chunk[] {
  return ALL_MOCK_CHUNKS.filter((chunk) =>
    chunk.metadata.emotion.includes(emotion),
  );
}
