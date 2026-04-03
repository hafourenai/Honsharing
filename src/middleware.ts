import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

async function hmacSign(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

async function generateToken(secret: string): Promise<string> {
  const payload = {
    token: crypto.randomUUID(), 
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  }
  const json = JSON.stringify(payload)
  const base64 = btoa(json)
  const sig = await hmacSign(secret, json)
  return `${base64}.${sig}`
}

async function verifyToken(secret: string, token: string): Promise<boolean> {
  try {
    const dot = token.indexOf(".")
    if (dot === -1) return false

    const base64 = token.slice(0, dot)
    const sig = token.slice(dot + 1)
    if (!base64 || !sig) return false

    const json = atob(base64)
    const expectedSig = await hmacSign(secret, json)

    if (sig.length !== expectedSig.length) return false
    let diff = 0
    for (let i = 0; i < sig.length; i++) {
      diff |= sig.charCodeAt(i) ^ expectedSig.charCodeAt(i)
    }
    if (diff !== 0) return false

    const payload = JSON.parse(json)
    if (Date.now() > payload.exp) return false

    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const secret = process.env.SESSION_SECRET
  if (!secret) return NextResponse.next()

  const existing = request.cookies.get("hon_session")?.value
  const isValid = existing ? await verifyToken(secret, existing) : false

  // If cookie is already valid, pass through without touching anything
  if (isValid) return NextResponse.next()

  const token = await generateToken(secret)
  const response = NextResponse.next()

  response.cookies.set("hon_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })

  return response
}
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
