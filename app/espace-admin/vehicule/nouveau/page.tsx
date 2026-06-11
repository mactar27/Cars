import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { VehicleForm } from "@/components/vehicle-form"

export default function NouveauVehiculePage() {
  return (
    <div className="mx-auto max-w-4xl p-6 py-12">
      <Link href="/espace-admin" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="size-4" />
        Retour au tableau de bord
      </Link>
      <h1 className="mb-8 text-2xl font-semibold">Ajouter un véhicule</h1>
      <VehicleForm />
    </div>
  )
}
