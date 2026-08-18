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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Tableau de bord
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Vue d&apos;ensemble du parc et de l&apos;activité.
            </p>
          </div>
          <Link href="/espace-admin/vehicule/nouveau" className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 self-start sm:self-auto">
            <Plus className="size-4" />
            Ajouter un véhicule
          </Link>
        </div>

        <div id="stats" className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 scroll-mt-20">
          <AdminStat icon={Car} label="Total Produits" value={`${vehicles.length}`} />
          <AdminStat icon={Package} label="Valeur Stock" value={formatEUR(stockValue)} />
          <AdminStat icon={ShoppingBag} label="Ventes" value={`${totalSales}`} />
          <AdminStat icon={Calendar} label="Revenus (Mois)" value={formatEUR(monthlyRevenue)} />
          <AdminStat icon={TrendingUp} label="Revenus (Année)" value={formatEUR(annualRevenue)} />
        </div>

        <div id="vehicles" className="mt-12 overflow-hidden rounded-xl border border-border bg-background scroll-mt-20">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="text-base font-medium text-foreground">
              Parc automobile
            </h2>
            <span className="text-sm text-muted-foreground">
              {vehicles.length} véhicules
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Véhicule</th>
                  <th className="hidden px-6 py-3 font-medium md:table-cell">Catégorie</th>
                  <th className="px-6 py-3 font-medium">Services</th>
                  <th className="hidden px-6 py-3 font-medium sm:table-cell">Location /j</th>
                  <th className="px-6 py-3 text-right font-medium">Prix vente</th>
                  <th className="px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {vehicles.map((v) => (
                  <tr key={v.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-6 py-4 font-medium text-foreground">
                      {v.brand} {v.model}
                    </td>
                    <td className="hidden px-6 py-4 capitalize text-muted-foreground md:table-cell">
                      {v.category}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1.5">
                        {v.services.includes("location") && (
                          <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                            Loc.
                          </span>
                        )}
                        {v.services.includes("vente") && (
                          <span className="rounded-full bg-foreground px-2 py-0.5 text-xs text-background">
                            Vente
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="hidden px-6 py-4 text-muted-foreground sm:table-cell">
                      {v.rental ? formatEUR(v.rental.pricePerDay) : "—"}
                    </td>
                    <td className="px-6 py-4 text-right text-foreground">
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

        <div id="reservations" className="mt-12 overflow-hidden rounded-xl border border-border bg-background scroll-mt-20">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="text-base font-medium text-foreground">Demandes de Réservation</h2>
            <span className="text-sm text-muted-foreground">{reservations.length} demande(s)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Client</th>
                  <th className="px-6 py-3 font-medium">Véhicule</th>
                  <th className="px-6 py-3 font-medium">Service</th>
                  <th className="px-6 py-3 font-medium">Dates / Info</th>
                  <th className="px-6 py-3 font-medium">Statut</th>
                  <th className="px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reservations.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-6 py-4 font-medium">
                      <ReservationDetailModal reservation={r} />
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{r.brand} {r.model}</td>
                    <td className="px-6 py-4 capitalize text-muted-foreground">{r.service_type}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {r.date_debut ? new Date(r.date_debut).toLocaleDateString() : "—"} 
                      {r.date_fin ? " au " + new Date(r.date_fin).toLocaleDateString() : ""}
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground uppercase tracking-wider">
                        {r.statut.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <AdminActions type="reservation" id={r.id} currentStatus={r.statut} />
                    </td>
                  </tr>
                ))}
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
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <div className="flex items-center justify-between">
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <p className="mt-4 text-2xl font-semibold text-foreground">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  )
}
