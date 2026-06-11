import Link from "next/link"
import { Calendar, Car, FileText, Heart, LogOut, User } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { query } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { cookies } from "next/headers"
import { formatEUR } from "@/lib/format"

export const metadata = {
  title: "Mon espace — MAISON AUTO",
}

export const dynamic = "force-dynamic"

export default async function EspaceClientPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("maison-auto-token")?.value
  if (!token) return null
  const payload = verifyToken(token)
  if (!payload) return null

  const reservations = await query<any>(`
    SELECT r.*, v.brand, v.model, v.slug, v.image
    FROM reservations r
    JOIN vehicules v ON v.id = r.vehicule_id
    WHERE r.user_id = ?
    ORDER BY r.created_at DESC
  `, [payload.userId])

  const user = await query<any>(`SELECT first_name, last_name FROM users WHERE id = ?`, [payload.userId])
  const fullName = [user[0]?.first_name, user[0]?.last_name].filter(Boolean).join(" ") || payload.email

  const favorites: any[] = []

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="border-b border-border bg-muted/40">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-foreground">
                <User className="size-6 text-background" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Espace client
                </p>
                <h1 className="text-xl font-semibold text-foreground">
                  Bonjour, {fullName}
                </h1>
              </div>
            </div>
            <Link
              href="/connexion"
              className="inline-flex items-center gap-2 self-start rounded-full border border-foreground/15 px-5 py-2 text-sm text-foreground transition-colors hover:bg-foreground hover:text-background sm:self-auto"
            >
              <LogOut className="size-4" />
              Déconnexion
            </Link>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard icon={Calendar} label="Réservations" value={String(reservations.length)} />
            <StatCard icon={Car} label="Essais à venir" value={String(reservations.filter((r: any) => r.service_type === "vente" && r.statut !== "annulee").length)} />
            <StatCard icon={Heart} label="Favoris" value="0" />
            <StatCard icon={FileText} label="Documents" value="0" />
          </div>

          <h2 className="mb-6 mt-14 text-lg font-medium text-foreground">
            Mes réservations
          </h2>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Véhicule</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="hidden px-5 py-3 font-medium sm:table-cell">Dates</th>
                  <th className="px-5 py-3 font-medium">Statut</th>
                  <th className="px-5 py-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reservations.map((r: any) => (
                  <tr key={r.id}>
                    <td className="px-5 py-4 font-medium text-foreground">
                      {r.brand} {r.model}
                    </td>
                    <td className="px-5 py-4 capitalize text-muted-foreground">{r.service_type}</td>
                    <td className="hidden px-5 py-4 text-muted-foreground sm:table-cell">
                      {r.date_debut ? new Date(r.date_debut).toLocaleDateString() : "—"} 
                      {r.date_fin ? " au " + new Date(r.date_fin).toLocaleDateString() : ""}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={
                          r.statut === "confirmee"
                            ? "rounded-full bg-foreground px-2.5 py-1 text-xs text-background"
                            : r.statut === "annulee"
                            ? "rounded-full bg-red-100 px-2.5 py-1 text-xs text-red-600"
                            : "rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
                        }
                      >
                        {r.statut.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right text-foreground">
                      {/* Le total nécessiterait le prix et le nb de jours stockés dans réservation, ou calculé ici */}
                      —
                    </td>
                  </tr>
                ))}
                {reservations.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">Aucune réservation pour le moment.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <h2 className="mb-6 mt-14 text-lg font-medium text-foreground">
            Mes favoris
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {favorites.map((v) => (
              <Link
                key={v.id}
                href={`/vehicules/${v.slug}`}
                className="flex items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:bg-muted/40"
              >
                <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={v.image || "/placeholder.svg"}
                    alt={`${v.brand} ${v.model}`}
                    className="size-full object-contain p-1"
                  />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {v.brand} {v.model}
                  </p>
                  <p className="text-sm text-muted-foreground">{v.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-border p-5">
      <Icon className="size-5 text-muted-foreground" />
      <p className="mt-4 text-2xl font-semibold text-foreground">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  )
}
