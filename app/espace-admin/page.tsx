import Link from "next/link"
import Image from "next/image"
import { Banknote, Car, LogOut, Plus, TrendingUp, Users, Trash2, ShoppingBag, Calendar, Package, Home } from "lucide-react"
import { getAllVehicles } from "@/lib/data"
import { query } from "@/lib/db"
import { formatEUR } from "@/lib/format"
import { AdminActions } from "./admin-actions"
import { ReservationDetailModal } from "./reservation-detail-modal"
import { LogoutButton } from "@/components/logout-button"

export const metadata = {
  title: "Administration — MAISON AUTO",
}

export const dynamic = "force-dynamic"

export default async function EspaceAdminPage() {
  const vehicles = await getAllVehicles()
  const forRent = vehicles.filter((v) => v.services.includes("location")).length
  const forSale = vehicles.filter((v) => v.services.includes("vente")).length

  // Nouveaux KPIs financiers
  const stockResult = await query<any>("SELECT SUM(price) as total FROM vente_info")
  const stockValue = stockResult[0]?.total || 0

  const salesResult = await query<any>(`
    SELECT COUNT(*) as total 
    FROM reservations 
    WHERE service_type = 'vente' AND statut IN ('confirmee', 'terminee')
  `)
  const totalSales = salesResult[0]?.total || 0

  const revenueResult = await query<any>(`
    SELECT 
      SUM(CASE WHEN MONTH(created_at) = MONTH(NOW()) AND YEAR(created_at) = YEAR(NOW()) THEN total_amount ELSE 0 END) as monthly,
      SUM(CASE WHEN YEAR(created_at) = YEAR(NOW()) THEN total_amount ELSE 0 END) as annual
    FROM reservations
    WHERE statut IN ('confirmee', 'terminee')
  `)
  const monthlyRevenue = revenueResult[0]?.monthly || 0
  const annualRevenue = revenueResult[0]?.annual || 0

  const reservations = await query<any>(`
    SELECT r.*, v.brand, v.model, v.image as vehicle_image, u.email, u.first_name, u.last_name, u.address, u.phone
    FROM reservations r
    JOIN vehicules v ON v.id = r.vehicule_id
    JOIN users u ON u.id = r.user_id
    ORDER BY r.created_at DESC
  `)

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Maison Auto" width={180} height={60} className="h-12 w-auto object-contain scale-[1.3] origin-left" />
            </Link>
            <span className="ml-4 rounded-full bg-foreground px-2.5 py-0.5 text-xs text-background">
              Admin
            </span>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#stats" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Stats
            </Link>
            <Link href="#vehicles" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Véhicules
            </Link>
            <Link href="#reservations" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Réservations
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-2 text-sm text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              <Home className="size-4" />
              <span className="hidden sm:inline">Accueil</span>
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Tableau de bord
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Gestion du parc automobile, suivi des ventes et des réservations de Maison Auto.
            </p>
          </div>
          <Link href="/espace-admin/vehicule/nouveau" className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-all hover:bg-foreground/90 hover:shadow-md self-start sm:self-auto">
            <Plus className="size-4" />
            Ajouter un véhicule
          </Link>
        </div>

        {/* Stats Grid */}
        <div id="stats" className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 scroll-mt-20">
          <AdminStat icon={Car} label="Total Produits" value={`${vehicles.length}`} colorClass="bg-blue-50 text-blue-600 border border-blue-100" />
          <AdminStat icon={Package} label="Valeur Stock" value={formatEUR(stockValue)} colorClass="bg-emerald-50 text-emerald-600 border border-emerald-100" />
          <AdminStat icon={ShoppingBag} label="Ventes" value={`${totalSales}`} colorClass="bg-indigo-50 text-indigo-600 border border-indigo-100" />
          <AdminStat icon={Calendar} label="Revenus (Mois)" value={formatEUR(monthlyRevenue)} colorClass="bg-amber-50 text-amber-600 border border-amber-100" />
          <AdminStat icon={TrendingUp} label="Revenus (Année)" value={formatEUR(annualRevenue)} colorClass="bg-violet-50 text-violet-600 border border-violet-100" />
        </div>

        {/* Parc Automobile */}
        <div id="vehicles" className="mt-12 overflow-hidden rounded-2xl border border-black/[0.06] bg-background shadow-sm scroll-mt-20">
          <div className="flex items-center justify-between border-b border-border bg-slate-50/50 px-6 py-4">
            <h2 className="text-lg font-semibold text-foreground">
              Parc automobile
            </h2>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {vehicles.length} véhicules
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead className="bg-slate-50/30 text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Véhicule</th>
                  <th className="hidden px-6 py-4 font-medium md:table-cell">Catégorie</th>
                  <th className="px-6 py-4 font-medium">Services</th>
                  <th className="hidden px-6 py-4 font-medium sm:table-cell">Location /j</th>
                  <th className="px-6 py-4 text-right font-medium">Prix vente</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {vehicles.map((v) => (
                  <tr key={v.id} className="transition-colors hover:bg-slate-50/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded bg-muted border border-border">
                          <img src={v.image || "/cars/hero-car.svg"} alt={`${v.brand} ${v.model}`} className="h-full w-full object-cover" />
                        </div>
                        <span className="font-semibold text-foreground">
                          {v.brand} {v.model}
                        </span>
                      </div>
                    </td>
                    <td className="hidden px-6 py-4 capitalize text-muted-foreground md:table-cell">
                      {v.category}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1.5">
                        {v.services.includes("location") && (
                          <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                            Location
                          </span>
                        )}
                        {v.services.includes("vente") && (
                          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                            Vente
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="hidden px-6 py-4 font-medium text-muted-foreground sm:table-cell">
                      {v.rental ? formatEUR(v.rental.pricePerDay) : "—"}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-foreground">
                      {v.sale ? formatEUR(v.sale.price) : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <AdminActions type="vehicle" id={v.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Demandes de Réservation */}
        <div id="reservations" className="mt-12 overflow-hidden rounded-2xl border border-black/[0.06] bg-background shadow-sm scroll-mt-20">
          <div className="flex items-center justify-between border-b border-border bg-slate-50/50 px-6 py-4">
            <h2 className="text-lg font-semibold text-foreground">Demandes de Réservation & Achats</h2>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {reservations.length} demande(s)
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead className="bg-slate-50/30 text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Client</th>
                  <th className="px-6 py-4 font-medium">Véhicule</th>
                  <th className="px-6 py-4 font-medium">Service</th>
                  <th className="px-6 py-4 font-medium">Dates / Info</th>
                  <th className="px-6 py-4 font-medium">Statut</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reservations.map((r) => {
                  const badgeColors: Record<string, string> = {
                    en_attente: "bg-amber-50 text-amber-700 border-amber-200",
                    confirmee: "bg-green-50 text-green-700 border-green-200",
                    annulee: "bg-red-50 text-red-700 border-red-200",
                    terminee: "bg-slate-100 text-slate-700 border-slate-200",
                  }
                  const badgeClass = badgeColors[r.statut] || "bg-muted text-muted-foreground border-border"
                  const statutLabel = r.statut === "en_attente" ? "En attente" : r.statut === "confirmee" ? "Confirmée" : r.statut === "annulee" ? "Annulée" : "Terminée"

                  return (
                    <tr key={r.id} className="transition-colors hover:bg-slate-50/30">
                      <td className="px-6 py-4 font-semibold text-foreground">
                        <ReservationDetailModal reservation={r} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded bg-muted border border-border">
                            <img src={r.vehicle_image || "/cars/hero-car.svg"} alt={`${r.brand} ${r.model}`} className="h-full w-full object-cover" />
                          </div>
                          <span className="font-medium text-foreground">
                            {r.brand} {r.model}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                          r.service_type === "location" ? "border-blue-200 bg-blue-50 text-blue-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"
                        }`}>
                          {r.service_type === "location" ? "Location" : "Vente"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {r.date_debut ? new Date(r.date_debut).toLocaleDateString("fr-FR") : "—"} 
                        {r.date_fin ? " au " + new Date(r.date_fin).toLocaleDateString("fr-FR") : ""}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}>
                          {statutLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <AdminActions type="reservation" id={r.id} currentStatus={r.statut} />
                      </td>
                    </tr>
                  )
                })}
                {reservations.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Aucune réservation.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

function AdminStat({
  icon: Icon,
  label,
  value,
  colorClass = "bg-primary/10 text-primary",
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  colorClass?: string
}) {
  return (
    <div className="rounded-2xl border border-black/[0.06] bg-gradient-to-br from-white to-slate-50/50 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <div className={`flex size-10 items-center justify-center rounded-xl ${colorClass}`}>
          <Icon className="size-5" />
        </div>
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-foreground">{value}</p>
    </div>
  )
}
