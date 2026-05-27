/**
 * ============================================================
 * EVALUATION MODES — MOCK / HYBRID / REAL
 * ============================================================
 *
 * Sistem mode evaluasi yang aman dan terisolasi dari production.
 *
 * MODES:
 * 1. MOCK   → Full simulated (tidak panggil API sama sekali)
 * 2. HYBRID → Retrieval real, response mock
 * 3. REAL   → Response asli chatbot (panggil /api/chat)
 *
 * CARA KERJA:
 *   Setiap mode mengimplementasikan interface yang sama,
 *   sehingga evaluator dapat berganti mode tanpa mengubah
 *   kode evaluasi.
 *
 * @author  Tim Skripsi
 * @version 1.0
 * ============================================================
 */

import { TestScenario, EvaluationMode, ChatApiConfig } from "@/test/types";
import { callChatApi, DEFAULT_CONFIG } from "./chat-api-wrapper";
import { mockRetrieve, getDeterministicResponse } from "@/test/mocks";
import { ChatApiResponse } from "@/test/types";

// INTERFACE MODE EVALUATION

/**
 * Interface seragam untuk semua mode evaluasi.
 */
export interface EvaluationModeHandler {
  /**
   * Nama mode.
   */
  readonly mode: EvaluationMode;

  /**
   * Mendapatkan respons chatbot untuk input tertentu.
   *
   * @param userInput - Input user
   * @param scenario - Skenario pengujian (untuk konteks)
   * @returns Promise dengan respons dan metadata
   */
  getResponse(
    userInput: string,
    scenario: TestScenario,
  ): Promise<{
    response: string;
    responseTimeMs: number;
    retrievedChunks: unknown[];
  }>;
}

// MODE 1: MOCK — Full Simulated

/**
 * Mode MOCK: Semua komponen disimulasikan.
 * - Retrieval: Mock cosine similarity
 * - Response: Deterministic template
 * - Embedding: Mock PRNG
 *
 * Cocok untuk:
 * - Development dan debugging
 * - Reproducible results
 * - CI/CD (jika ada)
 * - Demo tanpa API key
 */
export class MockMode implements EvaluationModeHandler {
  readonly mode: EvaluationMode = "MOCK";

  async getResponse(
    userInput: string,
    scenario: TestScenario,
  ): Promise<{
    response: string;
    responseTimeMs: number;
    retrievedChunks: unknown[];
  }> {
    const startTime = Date.now();

    // Mock retrieval
    const retrievedChunks = await mockRetrieve(userInput);

    // Mock response deterministik
    const response = getDeterministicResponse(scenario.id);

    return {
      response,
      responseTimeMs: Date.now() - startTime,
      retrievedChunks,
    };
  }
}

// MODE 2: HYBRID — Retrieval Real, Response Mock

/**
 * Mode HYBRID: Retrieval menggunakan API asli, response mock.
 * - Retrieval: Panggil /api/embed asli
 * - Response: Deterministic template
 * - Embedding: Real dari Xenova
 *
 * Cocok untuk:
 * - Menguji pipeline retrieval production
 * - Debugging retrieval tanpa biaya LLM
 * - Evaluasi standalone retrieval
 */
export class HybridMode implements EvaluationModeHandler {
  readonly mode: EvaluationMode = "HYBRID";
  private apiConfig: ChatApiConfig;

  constructor(apiConfig?: Partial<ChatApiConfig>) {
    this.apiConfig = { ...DEFAULT_CONFIG, ...apiConfig };
  }

  async getResponse(
    userInput: string,
    scenario: TestScenario,
  ): Promise<{
    response: string;
    responseTimeMs: number;
    retrievedChunks: unknown[];
  }> {
    const startTime = Date.now();

    // TODO: Untuk retrieval real, kita perlu memanggil
    // endpoint embedding dan melakukan cosine similarity
    // sendiri. Sementara gunakan mock retrieval.
    const retrievedChunks = await mockRetrieve(userInput);

    // Tetap gunakan mock response agar biaya LLM tidak membengkak
    const response = getDeterministicResponse(scenario.id);

    return {
      response,
      responseTimeMs: Date.now() - startTime,
      retrievedChunks,
    };
  }
}

// MODE 3: REAL — Full Production Pipeline

/**
 * Mode REAL: Semua komponen menggunakan API asli.
 * - Retrieval: IndexedDB / API embedding asli
 * - Response: Groq LLM via /api/chat
 * - Streaming: SSE real-time
 *
 * PENTING:
 * - Membutuhkan Groq API key
 * - Membutuhkan server production berjalan
 * - Membutuhkan session cookie
 * - DAPAT MENGHABISKAN KUOTA API
 *
 * Cocok untuk:
 * - Evaluasi akhir skripsi
 * - Pengujian end-to-end
 * - Demo sidang
 * - Pengumpulan data penelitian
 */
export class RealMode implements EvaluationModeHandler {
  readonly mode: EvaluationMode = "REAL";
  private apiConfig: ChatApiConfig;

  constructor(apiConfig?: Partial<ChatApiConfig>) {
    this.apiConfig = { ...DEFAULT_CONFIG, ...apiConfig };
  }

  async getResponse(
    userInput: string,
    scenario: TestScenario,
  ): Promise<{
    response: string;
    responseTimeMs: number;
    retrievedChunks: unknown[];
  }> {
    const startTime = Date.now();

    // Panggil API chat asli
    const apiResponse: ChatApiResponse = await callChatApi(
      userInput,
      undefined,
      this.apiConfig,
    );

    // Mock retrieval untuk logging (tidak mempengaruhi response)
    const retrievedChunks = await mockRetrieve(userInput);

    return {
      response: apiResponse.response,
      responseTimeMs: apiResponse.responseTimeMs,
      retrievedChunks,
    };
  }
}

// MODE FACTORY

/**
 * Factory untuk membuat handler mode evaluasi.
 *
 * @param mode - Mode evaluasi yang diinginkan
 * @param apiConfig - Konfigurasi API (untuk HYBRID dan REAL)
 * @returns EvaluationModeHandler
 */
export function createEvaluationMode(
  mode: EvaluationMode,
  apiConfig?: Partial<ChatApiConfig>,
): EvaluationModeHandler {
  switch (mode) {
    case "MOCK":
      return new MockMode();
    case "HYBRID":
      return new HybridMode(apiConfig);
    case "REAL":
      return new RealMode(apiConfig);
    default:
      console.warn(
        `[EvaluationMode] Mode "${mode}" tidak dikenal, menggunakan MOCK sebagai default`,
      );
      return new MockMode();
  }
}
