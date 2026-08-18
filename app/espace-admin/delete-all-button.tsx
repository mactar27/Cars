"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"

export function DeleteAllReservationsButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDeleteAll() {
    if (!confirm("Voulez-vous vraiment supprimer toutes les demandes de réservation ? Cette action est irréversible.")) return
    setLoading(true)
    try {
      const res = await fetch("/api/reservations", { method: "DELETE" })
      if (res.ok) {
        router.refresh()
      } else {
        alert("Erreur lors de la suppression.")
      }
    } catch {
      alert("Impossible de contacter le serveur.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDeleteAll}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-medium text-red-700 transition-all hover:bg-red-100 hover:shadow-sm disabled:opacity-50 self-start sm:self-auto"
    >
      <Trash2 className="size-4" />
      {loading ? "Suppression..." : "Tout supprimer"}
    </button>
  )
}
