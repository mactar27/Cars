"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatEUR, formatKm } from "@/lib/format"
import type { Vehicle } from "@/lib/types"
import { DayPicker } from "react-day-picker"
import { format, differenceInDays } from "date-fns"
import "react-day-picker/dist/style.css"

export function BookingPanel({ vehicle }: { vehicle: Vehicle }) {
  const hasRental = vehicle.services.includes("location") && vehicle.rental
  const hasSale = vehicle.services.includes("vente") && vehicle.sale
  const router = useRouter()

  const [mode, setMode] = useState<"location" | "vente">(
    hasRental ? "location" : "vente",
  )
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [showCalendar, setShowCalendar] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const days = dateRange.from && dateRange.to ? differenceInDays(dateRange.to, dateRange.from) + 1 : 0
  const rentalTotal = vehicle.rental && days > 0 ? vehicle.rental.pricePerDay * days : 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    
    if (mode === "location" && (!dateRange.from || !dateRange.to)) {
      setError("Veuillez sélectionner des dates de location.")
      return
    }

    if (mode === "location" && dateRange.from && dateRange.from < today) {
      setError("La date de début doit être aujourd'hui ou dans le futur.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehiculeId: vehicle.id,
          serviceType: mode,
          dateDebut: mode === "location" && dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
          dateFin: mode === "location" && dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
        }),
      })

      if (res.status === 401) {
        router.push(`/connexion?redirect=/vehicules/${vehicle.slug}`)
        return
      }

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Une erreur est survenue.")
        return
      }

      setSubmitted(true)
    } catch {
      setError("Impossible de contacter le serveur.")
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
      {hasRental && hasSale && (
        <div className="mb-6 flex gap-1 rounded-full bg-muted p-1">
          <button
            type="button"
            onClick={() => setMode("location")}
            className={cn(
              "flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              mode === "location"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Location
          </button>
          <button
            type="button"
            onClick={() => setMode("vente")}
            className={cn(
              "flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              mode === "vente"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Achat
          </button>
        </div>
      )}

      {submitted ? (
        <div className="flex flex-col items-center py-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-foreground">
            <Check className="size-6 text-background" />
          </div>
          <p className="mt-4 text-base font-medium text-foreground">
            Demande envoyée
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "location"
              ? "Un conseiller vous contacte pour confirmer votre location."
              : "Un conseiller vous recontacte pour finaliser votre achat."}
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-6 text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Nouvelle demande
          </button>
        </div>
      ) : mode === "location" && vehicle.rental ? (
        <form onSubmit={handleSubmit}>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-semibold text-foreground">
              {formatEUR(vehicle.rental.pricePerDay)}
            </span>
            <span className="text-sm text-muted-foreground">par jour</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {vehicle.rental.includedKm} km inclus / jour
          </p>

          <div className="mt-6">
            <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">
              Dates de location
            </label>
            <button
              type="button"
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground hover:border-foreground/30"
            >
              <span className="flex items-center gap-2">
                <CalendarIcon className="size-4 text-muted-foreground" />
                {dateRange.from && dateRange.to
                  ? `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}`
                  : "Sélectionner des dates"}
              </span>
            </button>
            
            {showCalendar && (
              <div className="mt-2 flex justify-center rounded-lg border border-border bg-background p-3">
                <DayPicker
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => {
                    setDateRange(range || {})
                  }}
                  disabled={{ before: today }}
                  className="!m-0"
                  classNames={{
                    day_selected: "bg-foreground text-background hover:bg-foreground/90",
                    day_today: "font-bold",
                  }}
                />
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm text-muted-foreground">Total estimé ({days} jour{days > 1 ? "s" : ""})</span>
            <span className="text-lg font-semibold text-foreground">
              {formatEUR(rentalTotal)}
            </span>
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={!vehicle.rental.available || loading}
            className="mt-6 w-full rounded-full bg-foreground py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Envoi..." : vehicle.rental.available ? "Réserver" : "Indisponible"}
          </button>
        </form>
      ) : vehicle.sale ? (
        <form onSubmit={handleSubmit}>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-semibold text-foreground">
              {formatEUR(vehicle.sale.price)}
            </span>
            <span className="text-sm text-muted-foreground">prix ferme</span>
          </div>

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Année</dt>
              <dd className="text-foreground">{vehicle.sale.modelYear}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Kilométrage</dt>
              <dd className="text-foreground">{formatKm(vehicle.sale.mileage)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">État</dt>
              <dd className="text-foreground">{vehicle.sale.condition}</dd>
            </div>
          </dl>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-full bg-foreground py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Envoi..." : "Demander un essai"}
          </button>
        </form>
      ) : null}
    </div>
  )
}
