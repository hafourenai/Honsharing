import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Rate limiting for middleware (IP-based, in-memory)
interface RateLimitEntry {
  count: number
  resetAt: number
}

const midRlMap = new Map<string, RateLimitEntry>()

function midRlCheck(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = midRlMap.get(key)
  if (!entry || now > entry.resetAt) {
    midRlMap.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= limit) return false
  entry.count++
  return true
}

// Periodic cleanup every 5 minutes to prevent memory leak
const MID_RL_CLEAN_INTERVAL = 300_000
let midRlLastCleanup = Date.now()
function midRlCleanup() {
  const now = Date.now()
  if (now - midRlLastCleanup < MID_RL_CLEAN_INTERVAL) return
  midRlLastCleanup = now
  for (const [key, entry] of midRlMap) {
    if (now > entry.resetAt) midRlMap.delete(key)
  }
}

// Base64 helpers compatible with hmac.ts (Node.js Buffer)
function toBase64(str: string): string {
  const bytes = new TextEncoder().encode(str)
  let binary = ""
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function fromBase64(base64: string): string {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new TextDecoder().decode(bytes)
}

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

async function verifyToken(secret: string, token: string): Promise<boolean> {
  try {
    const dot = token.indexOf(".")
    if (dot === -1) return false

    const base64 = token.slice(0, dot)
    const sig = token.slice(dot + 1)
    if (!base64 || !sig) return false

    const json = fromBase64(base64)
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
  midRlCleanup()

  const secret = process.env.SESSION_SECRET
  if (!secret) return NextResponse.next()

  // Rate limit middleware requests per IP
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown"
  if (!midRlCheck(`mid:${ip}`, 60, 60_000)) {
    return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    })
  }

  const existing = request.cookies.get("hon_session")?.value
  const isValid = existing ? await verifyToken(secret, existing) : false
  if (isValid) return NextResponse.next()

  // Generate new session token
  const payload = {
    token: crypto.randomUUID(),
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
  }
  const json = JSON.stringify(payload)
  const base64 = toBase64(json)
  const sig = await hmacSign(secret, json)
  const token = `${base64}.${sig}`

  const response = NextResponse.next()
  response.cookies.set("hon_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
