import { useState, useEffect } from "react"
import { isIngested, ingestChunks, getExistingChunkIds, clearAllChunks } from "@/lib/rag/indexeddb-store"

export function useRAG() {
  const [ingesting, setIngesting] = useState(false)
  const [ingestProgress, setIngestProgress] = useState({ current: 0, total: 0 })
  const [ingestError, setIngestError] = useState<string | null>(null)

  useEffect(() => {
    isIngested().then(async (ingested) => {
      if (!ingested) {
        setIngestError(null)
        const existingIds = await getExistingChunkIds()
        
        if (existingIds.size < 100) {
          await clearAllChunks()
        }

        setIngesting(true)

        ingestChunks({
          onProgress: (current: number, total: number) => {
            setIngestProgress({ current, total })
          }
        })
        .catch((err) => {
          console.error("[useRAG] Ingestion failed:", err)
          setIngestError(err instanceof Error ? err.message : "Gagal memuat data pendukung")
        })
        .finally(() => {
          setIngesting(false)
        })
      } else {
        const existingIds = await getExistingChunkIds()
      }
    })
  }, [])

  return { ingesting, ingestProgress, ingestError }
}
