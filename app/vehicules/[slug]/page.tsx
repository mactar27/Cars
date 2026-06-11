import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Fuel, Gauge, Settings2, Users } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BookingPanel } from "@/components/booking-panel"
import { VehicleCard } from "@/components/vehicle-card"
import { VehicleGallery } from "@/components/vehicle-gallery"
import { getVehicleBySlug, getAllVehicles, categories } from "@/lib/data"

export async function generateStaticParams() {
  // En mode statique, on retourne une liste vide pour forcer le rendu dynamique
  return []
}

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const vehicle = await getVehicleBySlug(slug)
  if (!vehicle) return { title: "Véhicule introuvable — MAISON AUTO" }
  return {
    title: `${vehicle.brand} ${vehicle.model} — MAISON AUTO`,
    description: vehicle.tagline,
  }
}

export default async function VehiclePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const vehicle = await getVehicleBySlug(slug)
  if (!vehicle) notFound()

  const category = categories.find((c) => c.slug === vehicle.category)
  const allVehicles = await getAllVehicles()
  const related = allVehicles
    .filter((v) => v.category === vehicle.category && v.id !== vehicle.id)
    .slice(0, 3)

  const specs = [
    { icon: Fuel,     label: "Carburant", value: vehicle.fuel },
    { icon: Settings2, label: "Boîte",    value: vehicle.transmission },
    { icon: Users,    label: "Places",    value: `${vehicle.seats}` },
    { icon: Gauge,    label: "Puissance", value: `${vehicle.power} ch` },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 pt-8">
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
            Retour au catalogue
          </Link>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {category?.name}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground text-balance md:text-4xl">
              {vehicle.brand} {vehicle.model}
            </h1>
            <p className="mt-3 text-base text-muted-foreground">{vehicle.tagline}</p>

            <div className="mt-8">
              <VehicleGallery
                images={vehicle.gallery}
                alt={`${vehicle.brand} ${vehicle.model}`}
              />
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="rounded-xl border border-border p-4"
                >
                  <spec.icon className="size-5 text-muted-foreground" />
                  <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">
                    {spec.label}
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <BookingPanel vehicle={vehicle} />
        </div>

        {related.length > 0 && (
          <section className="mx-auto max-w-7xl px-6 py-16">
            <h2 className="text-xl font-medium tracking-tight text-foreground">
              Dans la même catégorie
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
