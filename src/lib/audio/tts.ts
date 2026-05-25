/*
 * TTS playback — disabled.
 * Uncomment the implementation below when a TTS provider is available.
 *
 * let currentAudio: HTMLAudioElement | null = null
 * let currentUrl: string | null = null
 * const queue: string[] = []
 * let playing = false
 * let generation = 0
 * let sessionId: string | null = null
 *
 * function getSessionId(): string {
 *   if (sessionId) return sessionId
 *   sessionId = crypto.randomUUID()
 *   return sessionId
 * }
 *
 * async function fetchAudio(text: string): Promise<Blob | null> {
 *   const gen = generation
 *   try {
 *     const response = await fetch("/api/tts", {
 *       method: "POST",
 *       headers: { "Content-Type": "application/json" },
 *       body: JSON.stringify({ text, sessionId: getSessionId() }),
 *     })
 *     if (gen !== generation) return null
 *     if (response.status === 503) return null
 *     if (response.ok) return await response.blob()
 *     const data = await response.json().catch(() => ({}))
 *     if (data?.skipped) return null
 *     return null
 *   } catch { return null }
 * }
 *
 * async function playChunk(text: string): Promise<void> {
 *   const gen = generation
 *   const blob = await fetchAudio(text)
 *   if (!blob || gen !== generation) return
 *   const url = URL.createObjectURL(blob)
 *   currentUrl = url
 *   const audio = new Audio()
 *   currentAudio = audio
 *   audio.src = url
 *   await new Promise<void>((resolve) => {
 *     audio.onended = () => resolve()
 *     audio.onerror = () => resolve()
 *     audio.play().catch(() => resolve())
 *   })
 * }
 *
 * async function processQueue(): Promise<void> {
 *   const gen = generation
 *   if (playing || queue.length === 0) return
 *   playing = true
 *   while (queue.length > 0) {
 *     if (gen !== generation) break
 *     const text = queue.shift()!
 *     await playChunk(text)
 *   }
 *   playing = false
 * }
 *
 * function sentenceChunk(text: string): string[] {
 *   const trimmed = text.trim()
 *   if (!trimmed) return []
 *   const sentences = trimmed
 *     .split(/(?<=[.!?])\s+/)
 *     .map((s) => s.trim())
 *     .filter((s) => s.length >= 3)
 *   if (sentences.length === 0) return trimmed.length >= 3 ? [trimmed] : []
 *   return sentences
 * }
 *
 * export function speakSentence(text: string): void {
 *   if (!text.trim()) return
 *   const chunks = sentenceChunk(text)
 *   if (chunks.length === 0) return
 *   for (const chunk of chunks) { queue.push(chunk) }
 *   processQueue()
 * }
 *
 * export function stopSpeaking(): void {
 *   generation++
 *   if (currentAudio) { currentAudio.pause(); currentAudio.src = ""; currentAudio = null }
 *   if (currentUrl) { URL.revokeObjectURL(currentUrl); currentUrl = null }
 *   queue.length = 0; playing = false
 * }
 */

export function speakSentence(text?: string): void {
  void text
  /* TTS disabled */
}

export function stopSpeaking(): void {
  /* TTS disabled */
}
