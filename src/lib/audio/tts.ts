let currentAudio: HTMLAudioElement | null = null
let currentUrl: string | null = null

const queue: string[] = []
let playing = false
let generation = 0

async function playChunk(text: string): Promise<void> {
  const gen = generation
  try {
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })

    if (!response.ok || gen !== generation) return

    const blob = await response.blob()
    if (gen !== generation) return

    const url = URL.createObjectURL(blob)
    currentUrl = url

    const audio = new Audio()
    currentAudio = audio
    audio.src = url

    await new Promise<void>((resolve) => {
      audio.onended = () => resolve()
      audio.onerror = () => resolve()
      audio.play().catch(() => resolve())
    })
  } catch {
    // silent fail
  } finally {
    if (currentUrl) {
      URL.revokeObjectURL(currentUrl)
      currentUrl = null
    }
  }
}

async function processQueue(): Promise<void> {
  const gen = generation
  if (playing || queue.length === 0) return
  playing = true

  while (queue.length > 0) {
    if (gen !== generation) break
    const text = queue.shift()!
    await playChunk(text)
  }

  playing = false
}

export function speakSentence(text: string): void {
  if (!text.trim()) return
  queue.push(text.trim())
  processQueue()
}

export function stopSpeaking(): void {
  generation++
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.src = ""
    currentAudio = null
  }
  if (currentUrl) {
    URL.revokeObjectURL(currentUrl)
    currentUrl = null
  }
  queue.length = 0
  playing = false
}
