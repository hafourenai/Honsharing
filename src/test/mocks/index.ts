/**
 * ============================================================
 * BARREL FILE — MOCK SYSTEM
 * ============================================================
 *
 * Re-export semua mock untuk kemudahan import.
 *
 * @author  Tim Skripsi
 * @version 1.0
 * ============================================================
 */

export {
  ALL_MOCK_CHUNKS,
  getMockChunksByTopic,
  getMockChunksByEmotion,
  overthinkingChunk1,
  overthinkingChunk2,
  anxietyChunk1,
  anxietyChunk2,
  relationshipChunk1,
  relationshipChunk2,
  lonelinessChunk1,
  lonelinessChunk2,
  motivationChunk1,
  stressChunk1,
  stressChunk2,
} from "./mock-chunks"

export {
  generateMockEmbedding,
  getMockEmbedding,
  clearEmbeddingCache,
  SCENARIO_EMBEDDINGS,
  mockEmbedText,
} from "./mock-embeddings"

export {
  mockRetrieve,
  mockDeterministicRetrieval,
  evaluateRetrievalAccuracy,
} from "./mock-retrieval"

export {
  generateMockResponse,
  mockStreamResponse,
  mockRagQueryStream,
  getDeterministicResponse,
} from "./mock-llm-response"
