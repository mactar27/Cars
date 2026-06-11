import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/auth"

// Routes protégées et leur rôle requis
const PROTECTED: Record<string, "admin" | "client" | "any"> = {
  "/espace-admin": "admin",
  "/espace-client": "any",
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Trouver si la route est protégée
  const matchedRoute = Object.keys(PROTECTED).find((route) =>
    pathname.startsWith(route)
  )
  if (!matchedRoute) return NextResponse.next()

  const requiredRole = PROTECTED[matchedRoute]

  // Lire le token dans les cookies
  const token = request.cookies.get("maison-auto-token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/connexion", request.url))
  }

  const payload = verifyToken(token)

  if (!payload) {
    return NextResponse.redirect(new URL("/connexion", request.url))
  }

  if (requiredRole !== "any" && payload.role !== requiredRole) {
    // Client tente d'accéder à l'admin → redirection espace client
    if (payload.role === "client") {
      return NextResponse.redirect(new URL("/espace-client", request.url))
    }
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/espace-admin/:path*", "/espace-client/:path*"],
}
