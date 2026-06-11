"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Menu, X, User } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const links = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/catalogue?service=location", label: "Louer" },
  { href: "/catalogue?service=vente", label: "Acheter" },
]

export function SiteHeaderClient({ isLoggedIn, role }: { isLoggedIn: boolean, role: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)

  const espaceUrl = role === "admin" ? "/espace-admin" : "/espace-client"

  function isActive(href: string) {
    if (href === "/catalogue") {
      return pathname === "/catalogue" && !searchParams.get("service")
    }
    if (href.includes("?service=")) {
      const service = href.split("=")[1]
      return pathname === "/catalogue" && searchParams.get("service") === service
    }
    return pathname === href
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Image src="/logo.png" alt="Maison Auto" width={150} height={50} className="h-12 w-auto object-contain scale-[1.8] origin-left" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "text-sm tracking-wide text-muted-foreground transition-colors hover:text-foreground",
                isActive(link.href) && "text-foreground font-medium",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex">
          {isLoggedIn ? (
            <Link
              href={espaceUrl}
              className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-5 py-2 text-sm tracking-wide text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              <User className="size-4" />
              Mon espace
            </Link>
          ) : (
            <Link
              href="/connexion"
              className="rounded-full border border-foreground/15 px-5 py-2 text-sm tracking-wide text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              Connexion
            </Link>
          )}
        </div>

        <button
          type="button"
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "text-sm tracking-wide transition-colors",
                  isActive(link.href) ? "text-foreground font-medium" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn ? (
              <Link
                href={espaceUrl}
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-foreground/15 px-5 py-2 text-center text-sm tracking-wide text-foreground"
              >
                <User className="size-4" />
                Mon espace
              </Link>
            ) : (
              <Link
                href="/connexion"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full border border-foreground/15 px-5 py-2 text-center text-sm tracking-wide text-foreground"
              >
                Connexion
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
