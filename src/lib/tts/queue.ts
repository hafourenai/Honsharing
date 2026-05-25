import type { TTSProvider } from "./types"
import { ttsLogger } from "./logger"

interface QueueItem {
  id: string
  sessionId: string
  text: string
  resolve: (stream: ReadableStream<Uint8Array>) => void
  reject: (error: Error) => void
}

class TTSQueue {
  private queue: QueueItem[] = []
  private processing = false
  private activeSessions = new Set<string>()

  enqueue(
    text: string,
    sessionId: string,
  ): Promise<ReadableStream<Uint8Array>> {
    if (this.activeSessions.has(sessionId)) {
      ttsLogger.warn("Queue blocked duplicate session", { sessionId })
      return Promise.reject(
        new Error("Active TTS request already in progress for this session"),
      )
    }

    return new Promise((resolve, reject) => {
      const item: QueueItem = {
        id: crypto.randomUUID(),
        sessionId,
        text,
        resolve,
        reject,
      }
      this.queue.push(item)
      ttsLogger.info("Queue enqueued", {
        queueSize: this.queue.length,
        sessionId,
      })
      this.processNext()
    })
  }

  cancelSession(sessionId: string): void {
    this.queue = this.queue.filter((item) => {
      if (item.sessionId === sessionId) {
        item.reject(new Error("TTS cancelled"))
        return false
      }
      return true
    })
    this.activeSessions.delete(sessionId)
    ttsLogger.info("Queue cancelled session", { sessionId })
  }

  cancelAll(): void {
    for (const item of this.queue) {
      item.reject(new Error("TTS cancelled"))
    }
    this.queue = []
    this.activeSessions.clear()
    this.processing = false
    ttsLogger.info("Queue cancelled all")
  }

  get size(): number {
    return this.queue.length
  }

  private async processNext(): Promise<void> {
    if (this.processing || this.queue.length === 0) return

    this.processing = true
    const item = this.queue.shift()!
    this.activeSessions.add(item.sessionId)

    ttsLogger.info("Queue processing item", {
      queueSize: this.queue.length,
      sessionId: item.sessionId,
    })

    try {
      const stream = await this.generateWithProvider(item.text)
      item.resolve(stream)
    } catch (error) {
      item.reject(
        error instanceof Error ? error : new Error(String(error)),
      )
    } finally {
      this.activeSessions.delete(item.sessionId)
      this.processing = false
      ttsLogger.info("Queue processed item", {
        queueSize: this.queue.length,
        sessionId: item.sessionId,
      })
      this.processNext()
    }
  }

  private provider: TTSProvider | null = null

  setProvider(provider: TTSProvider): void {
    this.provider = provider
  }

  private async generateWithProvider(text: string): Promise<ReadableStream<Uint8Array>> {
    if (!this.provider) {
      throw new Error("TTS provider not set")
    }
    return this.provider.generateSpeech(text)
  }
}

export const ttsQueue = new TTSQueue()
