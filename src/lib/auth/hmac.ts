import { createHmac, timingSafeEqual } from "crypto"

const MESSAGE = "hon_session_v1"

export function generateSessionToken(secret: string): string {
  return createHmac("sha256", secret)
    .update(MESSAGE)
    .digest("hex")
}

export function verifySessionToken(secret: string, token: string): boolean {
  const expected = generateSessionToken(secret)
  try {
    return timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(token, "hex")
    )
  } catch {
    return false
  }
}
