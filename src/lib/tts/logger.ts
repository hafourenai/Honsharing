type LogLevel = "info" | "warn" | "error"

const sensitiveKeys = ["apiKey", "api_key", "key", "secret", "token", "authorization"]

function sanitize(data: Record<string, unknown>): Record<string, unknown> {
  const safe: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(data)) {
    if (sensitiveKeys.some((sk) => k.toLowerCase().includes(sk.toLowerCase()))) continue
    safe[k] = v
  }
  return safe
}

function writeLog(level: LogLevel, event: string, data?: Record<string, unknown>): void {
  const timestamp = new Date().toISOString()
  const prefix = `[TTS] ${timestamp} [${level.toUpperCase()}]`
  const safe = data ? sanitize(data) : {}
  const extras = Object.keys(safe).length > 0 ? " " + JSON.stringify(safe) : ""
  const message = `${prefix} ${event}${extras}`

  switch (level) {
    case "error":
      console.error(message)
      break
    case "warn":
      console.warn(message)
      break
    default:
      console.log(message)
  }
}

export const ttsLogger = {
  info: (event: string, data?: Record<string, unknown>) => writeLog("info", event, data),
  warn: (event: string, data?: Record<string, unknown>) => writeLog("warn", event, data),
  error: (event: string, data?: Record<string, unknown>) => writeLog("error", event, data),
}
