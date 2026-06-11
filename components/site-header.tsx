import { cookies } from "next/headers"
import { Suspense } from "react"
import { verifyToken } from "@/lib/auth"
import { SiteHeaderClient } from "./site-header-client"

export async function SiteHeader() {
  const cookieStore = await cookies()
  const token = cookieStore.get("maison-auto-token")?.value
  
  let isLoggedIn = false
  let role = "client"
  
  if (token) {
    const payload = verifyToken(token)
    if (payload) {
      isLoggedIn = true
      role = payload.role
    }
  }

  return (
    <Suspense fallback={<header className="sticky top-0 z-50 h-16 border-b border-border bg-background/80 backdrop-blur-md" />}>
      <SiteHeaderClient isLoggedIn={isLoggedIn} role={role} />
    </Suspense>
  )
}
