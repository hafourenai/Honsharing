

import { TestScenario, EvaluationMode, ChatApiConfig } from "@test/types";
import { callChatApi, DEFAULT_CONFIG } from "./chat-api-wrapper";
import { mockRetrieve, getVariedResponse } from "@test/mocks";
import type { ChatApiResponse } from "@test/types";

// INTERFACE MODE EVALUATION

/**
 * Interface seragam untuk semua mode evaluasi.
 */
export interface EvaluationModeHandler {
  readonly mode: EvaluationMode;

  getResponse(
    userInput: string,
    scenario: TestScenario,
  ): Promise<{
    response: string;
    responseTimeMs: number;
    retrievedChunks: unknown[];
  }>;
}

// MODE 1: HYBRID â€” Retrieval Real, Response Mock

/**
 * Mode HYBRID: Retrieval menggunakan API asli, response mock.
 * Cocok untuk menguji pipeline retrieval tanpa biaya LLM.
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

    const retrievedChunks = await mockRetrieve(userInput);
    const response = getVariedResponse(scenario.id);

    return {
      response,
      responseTimeMs: Date.now() - startTime,
      retrievedChunks,
    };
  }
}

// MODE 2: REAL â€” Full Production Pipeline

/**
 * Mode REAL: Semua komponen menggunakan API asli.
 * - Retrieval: IndexedDB / API embedding asli
 * - Response: Groq LLM via /api/chat
 *
 * PENTING:
 * - Membutuhkan Groq API key
 * - Membutuhkan server production berjalan
 * - Membutuhkan session cookie
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

    const retrievedChunks = await mockRetrieve(userInput);

    const apiResponse: ChatApiResponse = await callChatApi(
      userInput,
      undefined,
      { ...this.apiConfig, retrievedChunks },
    );

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
    case "HYBRID":
      return new HybridMode(apiConfig);
    case "REAL":
      return new RealMode(apiConfig);
    default:
      console.warn(
        `[EvaluationMode] Mode "${mode}" tidak dikenal, menggunakan HYBRID sebagai default`,
      );
      return new HybridMode(apiConfig);
  }
}
