"use client"

import { useState } from "react"
import { X, User, Car, Calendar, MapPin, Mail, Phone, CreditCard } from "lucide-react"
import { formatEUR } from "@/lib/format"

type Reservation = {
  id: number
  brand: string
  model: string
  service_type: "location" | "vente"
  date_debut: string | null
  date_fin: string | null
  statut: string
  message: string | null
  total_amount: number | null
  email: string
  first_name: string | null
  last_name: string | null
  address: string | null
  created_at: string
}

export function ReservationDetailModal({ reservation }: { reservation: Reservation }) {
  const [open, setOpen] = useState(false)

  const statusLabel: Record<string, { label: string; color: string }> = {
    en_attente:  { label: "En attente",  color: "border-amber-300 bg-amber-50 text-amber-700" },
    confirmee:   { label: "Confirmée",   color: "border-green-300 bg-green-50 text-green-700" },
    annulee:     { label: "Annulée",     color: "border-red-300 bg-red-50 text-red-700" },
    terminee:    { label: "Terminée",    color: "border-gray-300 bg-gray-50 text-gray-700" },
  }
  const status = statusLabel[reservation.statut] ?? { label: reservation.statut, color: "border-border" }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-left w-full hover:underline underline-offset-2"
      >
        {[reservation.first_name, reservation.last_name].filter(Boolean).join(" ") || reservation.email}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-background shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4 sticky top-0 bg-background z-10">
              <h2 className="text-base font-semibold text-foreground">Détails de la réservation #{reservation.id}</h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-5 p-6">
              {/* Statut */}
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider ${status.color}`}>
                {status.label}
              </span>

              {/* Client */}
              <section>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Client</p>
                <div className="space-y-2 rounded-xl border border-border p-4">
                  <Row icon={User} label={[reservation.first_name, reservation.last_name].filter(Boolean).join(" ") || "—"} />
                  <Row icon={Mail} label={reservation.email} />
                  {reservation.address && <Row icon={MapPin} label={reservation.address} />}
                </div>
              </section>

              {/* Véhicule & Service */}
              <section>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Commande</p>
                <div className="space-y-2 rounded-xl border border-border p-4">
                  <Row icon={Car} label={`${reservation.brand} ${reservation.model}`} />
                  <Row
                    icon={CreditCard}
                    label={reservation.service_type === "vente" ? "Achat" : "Location"}
                  />
                  {(reservation.date_debut || reservation.date_fin) && (
                    <Row
                      icon={Calendar}
                      label={[
                        reservation.date_debut ? new Date(reservation.date_debut).toLocaleDateString("fr-FR") : null,
                        reservation.date_fin ? new Date(reservation.date_fin).toLocaleDateString("fr-FR") : null,
                      ].filter(Boolean).join(" → ")}
                    />
                  )}
                  {reservation.total_amount != null && (
                    <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                      <span className="text-sm text-muted-foreground">Total</span>
                      <span className="text-base font-semibold text-foreground">{formatEUR(reservation.total_amount)}</span>
                    </div>
                  )}
                </div>
              </section>

              {/* Message */}
              {reservation.message && (
                <section>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Message</p>
                  <p className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground">
                    {reservation.message}
                  </p>
                </section>
              )}

              {/* Date de création */}
              <p className="text-xs text-muted-foreground">
                Soumis le {new Date(reservation.created_at).toLocaleString("fr-FR")}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function Row({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <span className="text-sm text-foreground">{label}</span>
    </div>
  )
}
