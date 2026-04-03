import { createHmac, timingSafeEqual, randomUUID } from "crypto"

type Payload = {
  token: string
  exp: number
}
function sign(data: string, secret: string): string {
  return createHmac("sha256", secret).update(data).digest("hex")
}

export function generateSessionToken(secret: string): string {
  const payload: Payload = {
    token: randomUUID(),
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  }

  const json = JSON.stringify(payload)
  const base64 = Buffer.from(json).toString("base64")
  const signature = sign(json, secret)

  return `${base64}.${signature}`
}

export function verifySessionToken(secret: string, token: string): boolean {
  try {
    const dotIndex = token.indexOf(".")
    if (dotIndex === -1) return false

    const base64 = token.slice(0, dotIndex)
    const signature = token.slice(dotIndex + 1)

    if (!base64 || !signature) return false

    const json = Buffer.from(base64, "base64").toString()
    const expectedSig = sign(json, secret)

    const validSig = timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSig, "hex")
    )

    if (!validSig) return false

    const payload: Payload = JSON.parse(json)

    // Check expiry
    if (Date.now() > payload.exp) return false

    return true
  } catch {
    return false
  }
}
