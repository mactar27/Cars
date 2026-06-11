"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/connexion")
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-2 text-sm text-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
    >
      <LogOut className="size-4" />
      Déconnexion
    </button>
  )
}
