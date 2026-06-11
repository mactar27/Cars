import { Suspense } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CatalogClient } from "@/components/catalog-client"
import { getAllBrands } from "@/lib/data"

export const metadata = {
  title: "Catalogue — MAISON AUTO",
  description: "Parcourez notre sélection de véhicules en vente et en location.",
}

export default async function CataloguePage() {
  const brands = await getAllBrands()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Suspense fallback={<div className="mx-auto max-w-7xl px-6 py-20 text-muted-foreground">Chargement…</div>}>
          <CatalogClient brands={brands} />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  )
}
