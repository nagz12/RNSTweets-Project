import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this"
const JWT_EXPIRY = "7d"
export interface JWTPayload {
  userId: string
  email: string
  role: "user" | "admin"
}
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY })
}
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  })
}
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get("auth-token")?.value || null
}
export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
}
export async function getAuthUser(): Promise<JWTPayload | null> {
  const token = await getAuthToken()
  if (!token) return null
  return verifyToken(token)
}
