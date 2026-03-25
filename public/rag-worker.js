// public/rag-worker.js

function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] ** 2
    normB += b[i] ** 2
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

self.onmessage = function (e) {
  const { chunks, queryEmbedding, topK, threshold } = e.data

  const scored = chunks
    .filter((c) => c.embedding && c.embedding.length > 0)
    .map((c) => ({
      ...c,
      score: cosineSimilarity(queryEmbedding, c.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .filter((c) => c.score > threshold)
    .slice(0, topK)

  self.postMessage({ scored })
}
