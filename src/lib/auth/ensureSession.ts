import { cookies } from "next/headers"
import { generateSessionToken, verifySessionToken } from "./hmac"

export async function ensureSession(): Promise<void> {
  const secret = process.env.SESSION_SECRET
  if (!secret) return

  const cookieStore = await cookies()
  const session = cookieStore.get("hon_session")?.value

  if (!session || !verifySessionToken(secret, session)) {
    const token = generateSessionToken(secret)

    cookieStore.set("hon_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })
  }
}
