

import { ChatApiConfig, ChatApiResponse } from "@test/types";

// DEFAULT CONFIGURATION

const DEFAULT_CONFIG: ChatApiConfig = {
  baseUrl: "http://localhost:3000",
  timeout: 30000, // 30 detik
  maxRetries: 3,
  retryDelay: 1000, // 1 detik
  mode: "santai",
};

// Session cookie cache — dipakai ulang untuk semua request dalam satu sesi evaluasi
let cachedSessionCookie: string | null = null;

// CREATE SESSION

/**
 * Membuat sesi baru untuk autentikasi.
 * Memanggil POST /api/auth/session.
 *
 * @param config - Konfigurasi API
 * @returns Session cookie string, atau null jika gagal
 */
export async function createSession(
  config: ChatApiConfig = DEFAULT_CONFIG,
  forceFresh = false,
): Promise<string | null> {
  if (!forceFresh && cachedSessionCookie) {
    return cachedSessionCookie;
  }

  try {
    const response = await fetch(`${config.baseUrl}/api/auth/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.warn(`[ChatAPI] Gagal membuat session: ${response.status}`);
      return null;
    }

    // Ambil cookie dari response headers
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      cachedSessionCookie = setCookie.split(";")[0]; // Ambil cookie name=value saja
      return cachedSessionCookie;
    }

    return null;
  } catch (error) {
    console.warn(`[ChatAPI] Error membuat session: ${error}`);
    return null;
  }
}

// PARSE SSE STREAM

/**
 * Parse Server-Sent Events stream dari response endpoint chat.
 * Endpoint /api/chat mengirim response dalam format:
 *   data: {"content":"..."}       — token teks
 *   data: [DONE]                  — sinyal selesai
 *   data: {"error":"..."}         — error dari server
 *
 * @param response - Fetch Response object
 * @param onToken - Callback untuk setiap token (opsional)
 * @returns Teks respons lengkap
 */
async function parseSSEStream(
  response: Response,
  onToken?: (token: string) => void,
): Promise<string> {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let fullText = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || ""; // Sisakan buffer yang belum lengkap

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data: ")) continue;

      const raw = trimmed.slice(6);

      // Skip [DONE] — bukan konten respons
      if (raw === "[DONE]") continue;

      try {
        const data = JSON.parse(raw);
        if (typeof data.content === "string" && data.content) {
          fullText += data.content;
          if (onToken) onToken(data.content);
        }
        if (data.error) {
          console.error(`[ChatAPI] Error dari server:`, data.error);
        }
      } catch {
        // Fallback: teks biasa (non-JSON selain [DONE])
        if (raw) {
          fullText += raw;
          if (onToken) onToken(raw);
        }
      }
    }
  }

  return fullText;
}

// CALL CHAT API

/**
 * Memanggil endpoint /api/chat dengan pesan user.
 *
 * ALUR:
 * 1. Buat session jika perlu
 * 2. Kirim POST ke /api/chat
 * 3. Parse SSE stream
 * 4. Kembalikan respons lengkap
 *
 * @param userMessage - Pesan user
 * @param history - Riwayat percakapan (opsional)
 * @param config - Konfigurasi
 * @param onToken - Callback streaming (opsional)
 * @returns ChatApiResponse
 */
export async function callChatApi(
  userMessage: string,
  history?: Array<{ role: string; content: string }>,
  config: ChatApiConfig = DEFAULT_CONFIG,
  onToken?: (token: string) => void,
): Promise<ChatApiResponse> {
  const startTime = Date.now();
  let retryCount = 0;
  let lastError: string | null = null;

  // Dapatkan session cookie
  let sessionCookie: string | undefined | null = config.sessionCookie;
  if (!sessionCookie) {
    sessionCookie = await createSession(config);
  }

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      // Bangun pesan
      const messages = history
        ? [...history, { role: "user", content: userMessage }]
        : [{ role: "user", content: userMessage }];

      // Header
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (sessionCookie) {
        headers["Cookie"] = sessionCookie;
      }

      // Kirim request
      const response = await fetch(`${config.baseUrl}/api/chat`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          messages,
          mode: config.mode || "santai",
        }),
        signal: AbortSignal.timeout(config.timeout),
      });

      // Cek status
      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        lastError = `HTTP ${response.status}: ${errorText}`;

        if (response.status === 429) {
          // Rate limited â€” tunggu lebih lama
          const delay = config.retryDelay * Math.pow(2, attempt) * 2;
          console.warn(
            `[ChatAPI] Rate limited, menunggu ${delay}ms... (percobaan ${attempt + 1}/${config.maxRetries + 1})`,
          );
          await new Promise((r) => setTimeout(r, delay));
          retryCount++;
          continue;
        }

        if (response.status === 401) {
          // Session expired — buat session baru dan retry
          console.warn(
            `[ChatAPI] Session expired, buat session baru... (percobaan ${attempt + 1}/${config.maxRetries + 1})`,
          );
          cachedSessionCookie = null; // Hapus cache
          sessionCookie = await createSession(config, true);
          await new Promise((r) =>
            setTimeout(r, config.retryDelay),
          );
          retryCount++;
          continue;
        }

        if (response.status >= 500) {
          // Server error â€” retry
          console.warn(
            `[ChatAPI] Server error, retry... (percobaan ${attempt + 1}/${config.maxRetries + 1})`,
          );
          await new Promise((r) =>
            setTimeout(r, config.retryDelay * Math.pow(2, attempt)),
          );
          retryCount++;
          continue;
        }

        // Client error lainnya (400, 422, dll) â€” jangan retry
        return {
          response: "",
          responseTimeMs: Date.now() - startTime,
          retryCount,
          error: lastError,
          status: response.status,
          timestamp: new Date().toISOString(),
        };
      }

      // Parse SSE stream
      const fullResponse = await parseSSEStream(response, onToken);

      return {
        response: fullResponse,
        responseTimeMs: Date.now() - startTime,
        retryCount,
        error: null,
        status: response.status,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      retryCount++;

      if (error instanceof DOMException && error.name === "TimeoutError") {
        console.warn(
          `[ChatAPI] Timeout, retry... (percobaan ${attempt + 1}/${config.maxRetries + 1})`,
        );
      } else {
        console.warn(
          `[ChatAPI] Error: ${lastError}, retry... (percobaan ${attempt + 1}/${config.maxRetries + 1})`,
        );
      }

      if (attempt < config.maxRetries) {
        await new Promise((r) =>
          setTimeout(r, config.retryDelay * Math.pow(2, attempt)),
        );
      }
    }
  }

  // Semua percobaan gagal
  return {
    response: "",
    responseTimeMs: Date.now() - startTime,
    retryCount,
    error: lastError || "Max retries exceeded",
    status: 0,
    timestamp: new Date().toISOString(),
  };
}

// CALL EMBED API

/**
 * Memanggil endpoint /api/embed untuk mendapatkan embedding.
 *
 * @param text - Teks yang akan di-embed
 * @param config - Konfigurasi API
 * @returns Array embedding atau null jika gagal
 */
export async function callEmbedApi(
  text: string,
  config: ChatApiConfig = DEFAULT_CONFIG,
): Promise<number[] | null> {
  try {
    const response = await fetch(`${config.baseUrl}/api/embed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.warn(`[ChatAPI] Embed API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.embedding || data.embeddings || null;
  } catch (error) {
    console.warn(`[ChatAPI] Embed API error: ${error}`);
    return null;
  }
}

// CALL TITLE API

/**
 * Memanggil endpoint /api/title untuk generate judul percakapan.
 *
 * @param message - Pesan pertama user
 * @param config - Konfigurasi API
 * @returns Judul atau null jika gagal
 */
export async function callTitleApi(
  message: string,
  config: ChatApiConfig = DEFAULT_CONFIG,
): Promise<string | null> {
  try {
    const response = await fetch(`${config.baseUrl}/api/title`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.title || data.judul || null;
  } catch {
    return null;
  }
}

// PING â€” CEK APLIKASI BERJALAN

/**
 * Mengecek apakah aplikasi sedang berjalan.
 *
 * @param config - Konfigurasi API
 * @returns true jika aplikasi berjalan
 */
export async function pingAPI(
  config: ChatApiConfig = DEFAULT_CONFIG,
): Promise<boolean> {
  try {
    const response = await fetch(config.baseUrl, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export { DEFAULT_CONFIG };
