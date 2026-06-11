import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { VehicleFormEdit } from "@/components/vehicle-form-edit"
import { notFound } from "next/navigation"

export default async function EditVehiculePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/vehicles/${id}`, { cache: "no-store" })
  if (!res.ok) return notFound()
  const vehicle = await res.json()

  return (
    <div className="mx-auto max-w-4xl p-6 py-12">
      <Link href="/espace-admin" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="size-4" />
        Retour au tableau de bord
      </Link>
      <h1 className="mb-8 text-2xl font-semibold">Modifier — {vehicle.brand} {vehicle.model}</h1>
      <VehicleFormEdit vehicle={vehicle} />
    </div>
  )
}
