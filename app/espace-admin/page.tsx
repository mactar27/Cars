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

  const clients = await query<any>(`
    SELECT id, email, first_name, last_name, phone, address, created_at
    FROM users
    WHERE role = 'client'
    ORDER BY created_at DESC
  `)

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Sidebar - Desktop */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-border bg-background flex-col justify-between md:flex">
        <div className="flex flex-col">
          {/* Logo & Brand */}
          <div className="flex h-16 items-center gap-3 border-b border-border px-6">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Maison Auto" width={140} height={45} className="h-10 w-auto object-contain scale-[1.3] origin-left" />
            </Link>
            <span className="rounded-full bg-foreground px-2 py-0.5 text-[10px] text-background font-semibold">
              Admin
            </span>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-1 p-4">
            <Link href="#stats" className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground">
              <TrendingUp className="size-4" />
              Tableau de bord
            </Link>
            <Link href="#vehicles" className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground">
              <Car className="size-4" />
              Produits
            </Link>
            <Link href="#reservations" className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground">
              <ShoppingBag className="size-4" />
              Commandes
            </Link>
            <Link href="#clients" className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground">
              <Users className="size-4" />
              Clients
            </Link>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-2 border-t border-border p-4">
          <Link href="/" className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground">
            <Home className="size-4" />
            Aller à l&apos;accueil
          </Link>
          <div className="w-full">
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex flex-1 flex-col md:pl-64">
        {/* Mobile Header / Navbar */}
        <header className="sticky top-0 z-10 border-b border-border bg-background px-6 py-4 md:hidden flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Maison Auto" width={120} height={40} className="h-8 w-auto object-contain" />
            <span className="rounded-full bg-foreground px-2 py-0.5 text-[10px] text-background font-semibold">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="#stats" title="Dashboard" className="p-2 text-muted-foreground hover:text-foreground"><TrendingUp className="size-4" /></Link>
            <Link href="#vehicles" title="Produits" className="p-2 text-muted-foreground hover:text-foreground"><Car className="size-4" /></Link>
            <Link href="#reservations" title="Commandes" className="p-2 text-muted-foreground hover:text-foreground"><ShoppingBag className="size-4" /></Link>
            <Link href="#clients" title="Clients" className="p-2 text-muted-foreground hover:text-foreground"><Users className="size-4" /></Link>
            <LogoutButton />
          </div>
        </header>

        <main className="w-full px-6 py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border pb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Tableau de bord
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Gestion du parc automobile, suivi des ventes, des réservations et des clients de Maison Auto.
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

          {/* Liste des Clients */}
          <div id="clients" className="mt-12 overflow-hidden rounded-2xl border border-black/[0.06] bg-background shadow-sm scroll-mt-20">
            <div className="flex items-center justify-between border-b border-border bg-slate-50/50 px-6 py-4">
              <h2 className="text-lg font-semibold text-foreground">Liste des Clients</h2>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {clients.length} client(s)
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead className="bg-slate-50/30 text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium">Nom complet</th>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium">Téléphone</th>
                    <th className="px-6 py-4 font-medium">Adresse</th>
                    <th className="px-6 py-4 font-medium">Inscription</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {clients.map((c) => {
                    const fullName = [c.first_name, c.last_name].filter(Boolean).join(" ") || "—"
                    return (
                      <tr key={c.id} className="transition-colors hover:bg-slate-50/30">
                        <td className="px-6 py-4 font-semibold text-foreground">{fullName}</td>
                        <td className="px-6 py-4 text-muted-foreground">{c.email}</td>
                        <td className="px-6 py-4 text-muted-foreground">{c.phone || "—"}</td>
                        <td className="px-6 py-4 text-muted-foreground">{c.address || "—"}</td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {c.created_at ? new Date(c.created_at).toLocaleDateString("fr-FR") : "—"}
                        </td>
                      </tr>
                    )
                  })}
                  {clients.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Aucun client inscrit.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
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
