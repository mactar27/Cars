"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Check, X, Pencil } from "lucide-react"
import Link from "next/link"

export function AdminActions({
  type,
  id,
  currentStatus,
}: {
  type: "vehicle" | "reservation"
  id: string | number
  currentStatus?: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDeleteVehicle() {
    if (!confirm("Voulez-vous vraiment supprimer ce véhicule ?")) return
    setLoading(true)
    try {
      await fetch(`/api/vehicles/${id}`, { method: "DELETE" })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateReservation(status: string) {
    setLoading(true)
    try {
      await fetch(`/api/reservations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: status }),
      })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  if (type === "vehicle") {
    return (
      <div className="flex items-center justify-end gap-1">
        <Link
          href={`/espace-admin/vehicule/${id}`}
          className="inline-flex items-center gap-1 rounded-full p-2 text-muted-foreground hover:bg-blue-50 hover:text-blue-600"
          title="Modifier"
        >
          <Pencil className="size-4" />
        </Link>
        <button
          onClick={handleDeleteVehicle}
          disabled={loading}
          className="inline-flex items-center gap-1 rounded-full p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          title="Supprimer"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    )
  }

  if (type === "reservation") {
    if (currentStatus !== "en_attente") {
      return null
    }

    return (
      <div className="flex justify-end gap-2">
        <button
          onClick={() => handleUpdateReservation("confirmee")}
          disabled={loading}
          className="inline-flex items-center gap-1 rounded-full p-2 text-muted-foreground hover:bg-green-50 hover:text-green-600 disabled:opacity-50"
          title="Confirmer"
        >
          <Check className="size-4" />
        </button>
        <button
          onClick={() => handleUpdateReservation("annulee")}
          disabled={loading}
          className="inline-flex items-center gap-1 rounded-full p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          title="Annuler"
        >
          <X className="size-4" />
        </button>
      </div>
    )
  }

  return null
}
