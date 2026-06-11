import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "maison-auto-secret"
const JWT_EXPIRES_IN = "7d"

export interface JWTPayload {
  userId: number
  email: string
  role: "client" | "admin"
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}
