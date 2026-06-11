"use client"

import { useEffect, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { VehicleCard } from "@/components/vehicle-card"
import { formatEUR } from "@/lib/format"
import type { CategorySlug, ServiceType, Vehicle } from "@/lib/types"

const categoryOptions: { value: CategorySlug | "all"; label: string }[] = [
  { value: "all",        label: "Toutes" },
  { value: "citadines",  label: "Citadines" },
  { value: "berlines",   label: "Berlines" },
  { value: "suv",        label: "SUV" },
  { value: "utilitaires",label: "Utilitaires" },
]

const serviceOptions: { value: ServiceType | "all"; label: string }[] = [
  { value: "all",      label: "Tous" },
  { value: "location", label: "Location" },
  { value: "vente",    label: "Vente" },
]

export function CatalogClient({ brands }: { brands: string[] }) {
  const searchParams = useSearchParams()

  const [category, setCategory] = useState<CategorySlug | "all">(
    (searchParams.get("category") as CategorySlug) || "all",
  )
  const [service, setService] = useState<ServiceType | "all">(
    (searchParams.get("service") as ServiceType) || "all",
  )
  const [brand, setBrand]       = useState<string>("all")
  const [maxBudget, setMaxBudget] = useState<number>(100000000)
  const [query, setQuery]         = useState("")
  const [results, setResults]     = useState<Vehicle[]>([])
  const [loading, setLoading]     = useState(true)

  // Sync state when URL searchParams change (e.g. clicking header links)
  useEffect(() => {
    const newCat = searchParams.get("category") as CategorySlug
    const newSrv = searchParams.get("service") as ServiceType
    setCategory(newCat || "all")
    setService(newSrv || "all")
  }, [searchParams])

  const isRental = service === "location"
  const defaultBudget = isRental ? 200000 : 100000000
  const minBudget = isRental ? 10000 : 1000000
  const stepBudget = isRental ? 5000 : 1000000

  // Adjust maxBudget when switching service types
  useEffect(() => {
    setMaxBudget(defaultBudget)
  }, [service])

  const fetchVehicles = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (category  !== "all") params.set("category",  category)
    if (service   !== "all") params.set("service",   service)
    if (brand     !== "all") params.set("brand",     brand)
    if (maxBudget < defaultBudget)  params.set("maxBudget", String(maxBudget))
    if (query)               params.set("q",         query)

    try {
      const res  = await fetch(`/api/vehicles?${params}`)
      const data = await res.json()
      setResults(data.vehicles ?? [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [category, service, brand, maxBudget, query, defaultBudget])

  useEffect(() => { fetchVehicles() }, [fetchVehicles])

  const hasActiveFilters =
    category !== "all" || service !== "all" || brand !== "all" ||
    maxBudget < defaultBudget || query !== ""

  function reset() {
    setCategory("all"); setService("all"); setBrand("all")
    setMaxBudget(100000000); setQuery("")
  }

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-[260px_1fr]">
      {/* Filters */}
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-widest text-foreground">
            Filtres
          </h2>
          {hasActiveFilters && (
            <button
              onClick={reset}
              className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-3" /> Réinitialiser
            </button>
          )}
        </div>

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Marque ou modèle…"
          className="mt-6 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground/30"
        />

        <FilterGroup label="Contrat">
          <PillRow>
            {serviceOptions.map((opt) => (
              <Pill key={opt.value} active={service === opt.value} onClick={() => setService(opt.value)}>
                {opt.label}
              </Pill>
            ))}
          </PillRow>
        </FilterGroup>

        <FilterGroup label="Catégorie">
          <PillRow>
            {categoryOptions.map((opt) => (
              <Pill key={opt.value} active={category === opt.value} onClick={() => setCategory(opt.value)}>
                {opt.label}
              </Pill>
            ))}
          </PillRow>
        </FilterGroup>

        <FilterGroup label="Marque">
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/30"
          >
            <option value="all">Toutes les marques</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </FilterGroup>

        <FilterGroup label={`Budget — jusqu'à ${formatEUR(maxBudget)}${isRental ? "/j" : ""}`}>
          <input
            type="range"
            min={minBudget}
            max={defaultBudget}
            step={stepBudget}
            value={maxBudget}
            onChange={(e) => setMaxBudget(Number(e.target.value))}
            className="w-full accent-foreground"
          />
        </FilterGroup>
      </aside>

      {/* Results */}
      <div>
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-sm text-muted-foreground animate-pulse">Chargement…</div>
          </div>
        ) : (
          <>
            <p className="mb-8 text-sm text-muted-foreground">
              {results.length} véhicule{results.length > 1 ? "s" : ""} disponible{results.length > 1 ? "s" : ""}
            </p>

            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24 text-center">
                <p className="text-sm text-muted-foreground">
                  Aucun véhicule ne correspond à vos critères.
                </p>
                <button
                  onClick={reset}
                  className="mt-4 rounded-full border border-foreground/15 px-5 py-2 text-sm text-foreground transition-colors hover:bg-foreground hover:text-background"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} serviceFilter={service} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</h3>
      {children}
    </div>
  )
}

function PillRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs transition-colors",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
      )}
    >
      {children}
    </button>
  )
}
