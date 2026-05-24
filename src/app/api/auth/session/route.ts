import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { generateSessionToken } from "@/lib/auth/hmac"
import { checkRateLimit, extractIp } from "@/lib/rate-limiter"

export async function POST(request: NextRequest) {
  const ip = extractIp(request)
  if (!checkRateLimit(`session:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: "Terlalu banyak permintaan." }, { status: 429 })
  }

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

export async function DELETE(request: NextRequest) {
  const ip = extractIp(request)
  if (!checkRateLimit(`session:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: "Terlalu banyak permintaan." }, { status: 429 })
  }

  const cookieStore = await cookies()
  cookieStore.set("hon_session", "", {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
    secure: process.env.NODE_ENV === "production",
  })
  return NextResponse.json({ ok: true })
}
