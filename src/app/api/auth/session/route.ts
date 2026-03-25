import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { generateSessionToken } from "@/lib/auth/hmac"

export async function POST() {
  const secret = process.env.SESSION_SECRET
  if (!secret) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
  }

  const token = generateSessionToken(secret)

  const cookieStore = await cookies()
  cookieStore.set("hon_session", token, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
  })

  return NextResponse.json({ ok: true })
}
