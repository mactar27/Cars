import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { VehicleCard } from "@/components/vehicle-card"
import { HeroHome } from "@/components/hero-home"
import { HomeServices, HomeWhyUs, HomeBrands, HomeCTA } from "@/components/home-sections"
import { getFeaturedVehicles } from "@/lib/data"
import Link from "next/link"
import { ArrowRight, CheckCircle2, ShieldCheck, Truck, CreditCard } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const featured = await getFeaturedVehicles()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      
      <main className="flex-1">
        <HeroHome />

        {/* Bande de confiance */}
        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="flex flex-col items-center text-center sm:flex-row sm:text-left gap-4">
                <CheckCircle2 className="size-6 text-foreground/80 shrink-0" />
                <span className="text-sm font-medium text-foreground uppercase tracking-wide">Véhicules<br/>vérifiés</span>
              </div>
              <div className="flex flex-col items-center text-center sm:flex-row sm:text-left gap-4">
                <ShieldCheck className="size-6 text-foreground/80 shrink-0" />
                <span className="text-sm font-medium text-foreground uppercase tracking-wide">Garantie<br/>incluse</span>
              </div>
              <div className="flex flex-col items-center text-center sm:flex-row sm:text-left gap-4">
                <Truck className="size-6 text-foreground/80 shrink-0" />
                <span className="text-sm font-medium text-foreground uppercase tracking-wide">Livraison<br/>disponible</span>
              </div>
              <div className="flex flex-col items-center text-center sm:flex-row sm:text-left gap-4">
                <CreditCard className="size-6 text-foreground/80 shrink-0" />
                <span className="text-sm font-medium text-foreground uppercase tracking-wide">Paiement<br/>sécurisé</span>
              </div>
            </div>
          </div>
        </section>

        <HomeServices />

        <section className="relative mx-auto max-w-7xl px-6 py-32">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-light tracking-tight text-foreground sm:text-4xl md:text-5xl">
                L&apos;Avant-Garde.
              </h2>
              <p className="mt-4 text-base font-light leading-relaxed text-muted-foreground sm:text-lg">
                Une sélection rigoureuse des modèles les plus convoités. Des lignes pures, des performances sans compromis.
              </p>
            </div>
            <Link
              href="/catalogue"
              className="group flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-foreground transition-all hover:text-foreground/70"
            >
              Voir tout
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </section>

        <HomeWhyUs />
        <HomeBrands />
        <HomeCTA />
      </main>

      <SiteFooter />
    </div>
  )
}
