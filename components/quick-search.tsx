"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ServiceType } from "@/lib/types"

const categoryOptions = [
  { value: "all", label: "Toutes catégories" },
  { value: "citadines", label: "Citadines" },
  { value: "berlines", label: "Berlines" },
  { value: "suv", label: "SUV" },
  { value: "utilitaires", label: "Utilitaires" },
]

export function QuickSearch() {
  const router = useRouter()
  const [service, setService] = useState<ServiceType>("location")
  const [category, setCategory] = useState("all")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    params.set("service", service)
    if (category !== "all") params.set("category", category)
    router.push(`/catalogue?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-2xl rounded-2xl border border-border bg-card p-2 shadow-sm"
    >
      <div className="flex items-center gap-1 p-1">
        <button
          type="button"
          onClick={() => setService("location")}
          className={cn(
            "flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            service === "location"
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Louer
        </button>
        <button
          type="button"
          onClick={() => setService("vente")}
          className={cn(
            "flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors",
            service === "vente"
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Acheter
        </button>
      </div>

      <div className="flex flex-col gap-2 p-1 sm:flex-row sm:items-center">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex-1 rounded-xl bg-muted px-4 py-3 text-sm text-foreground outline-none"
          aria-label="Catégorie"
        >
          {categoryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          <Search className="size-4" />
          Rechercher
        </button>
      </div>
    </form>
  )
}
