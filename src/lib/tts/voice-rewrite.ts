const EMOJI_PATTERN =
  /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2700}-\u{27BF}\u{2600}-\u{26FF}\u{FE00}-\u{FE0F}]/gu

const MARKDOWN_PATTERNS: [RegExp, string][] = [
  [/```[\s\S]*?```/g, ""],
  [/`([^`]+)`/g, "$1"],
  [/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1"],
  [/~~([^~]+)~~/g, "$1"],
  [/^#{1,6}\s+/gm, ""],
  [/\[([^\]]+)\]\([^)]+\)/g, "$1"],
  [/^>\s+/gm, ""],
  [/^[-*+]\s+/gm, ""],
  [/^\d+\.\s+/gm, ""],
  [/\n{3,}/g, "\n\n"],
]

const SHORT_TEXT_MIN_CHARS = 4
const SHORT_TEXTS = new Set([
  "hmm", "mmm", "uhm", "hm", "uh", "ah", "oh", "eh",
  "...", "..", ".", "ok", "oke", "okay", "ya", "yeah",
  "yep", "nope", "no", "yes", "hai", "hi", "hey", "halo",
  "iya", "tidak", "enggak", "gak",
])

const MAX_SPOKEN_CHARS = 2000

function stripMarkdown(text: string): string {
  let result = text
  for (const [pattern, replacement] of MARKDOWN_PATTERNS) {
    result = result.replace(pattern, replacement)
  }
  return result.trim()
}

function stripEmoji(text: string): string {
  return text.replace(EMOJI_PATTERN, "").trim()
}

function stripUrls(text: string): string {
  return text.replace(/https?:\/\/\S+/g, "").trim()
}

function truncateLongText(text: string): string {
  if (text.length <= MAX_SPOKEN_CHARS) return text
  const lastSentence = text.slice(0, MAX_SPOKEN_CHARS).lastIndexOf(".")
  const cutAt = lastSentence > MAX_SPOKEN_CHARS * 0.7 ? lastSentence + 1 : MAX_SPOKEN_CHARS
  return text.slice(0, cutAt).trim()
}

export function shouldSkipTTS(text: string): boolean {
  const cleaned = text.trim().toLowerCase()
  if (!cleaned || cleaned.length < SHORT_TEXT_MIN_CHARS) return true
  if (SHORT_TEXTS.has(cleaned)) return true
  return false
}

export function rewriteForSpeech(text: string): string {
  let result = text
  result = stripUrls(result)
  result = stripMarkdown(result)
  result = stripEmoji(result)
  result = result.replace(/\s+/g, " ").trim()
  result = truncateLongText(result)
  return result
}
