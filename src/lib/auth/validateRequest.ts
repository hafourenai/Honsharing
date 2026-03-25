import { cookies } from "next/headers"
import { verifySessionToken } from "./hmac"

export async function validateRequest(): Promise<{ valid: boolean }> {
  const secret = process.env.SESSION_SECRET
  const cookieStore = await cookies()
  const session = cookieStore.get("hon_session")?.value

  if (!secret || !session) {
    return { valid: false }
  }

  const valid = verifySessionToken(secret, session)
  return { valid }
}
