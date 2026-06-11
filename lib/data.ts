import { query } from "./db"
import type { Category, Vehicle, CategorySlug, ServiceType } from "./types"

// ──────────────────────────────────────────────────────────────
// Types DB raw (tels que retournés par MySQL)
// ──────────────────────────────────────────────────────────────
interface VehicleRow {
  id: number
  slug: string
  brand: string
  model: string
  category_slug: string
  fuel: string
  transmission: string
  seats: number
  power: number
  image: string | null
  gallery: string | null
  tagline: string | null
  // location
  price_per_day: number | null
  included_km: number | null
  available: number | null
  // vente
  price: number | null
  model_year: number | null
  mileage: number | null
  condition: string | null
  // services (agrégat)
  services: string | null
}

function rowToVehicle(row: VehicleRow): Vehicle {
  const services: ServiceType[] = row.services
    ? (row.services.split(",") as ServiceType[])
    : []

  let gallery: string[] = []
  try {
    gallery = row.gallery ? JSON.parse(row.gallery) : []
  } catch {
    gallery = row.image ? [row.image] : []
  }

  return {
    id: String(row.id),
    slug: row.slug,
    brand: row.brand,
    model: row.model,
    category: row.category_slug as CategorySlug,
    fuel: row.fuel as Vehicle["fuel"],
    transmission: row.transmission as Vehicle["transmission"],
    seats: row.seats,
    power: row.power,
    image: row.image ?? "/cars/hero-car.svg",
    gallery: gallery.length > 0 ? gallery : [row.image ?? "/cars/hero-car.svg"],
    tagline: row.tagline ?? "",
    services,
    rental:
      row.price_per_day != null
        ? {
            pricePerDay: Number(row.price_per_day),
            includedKm: row.included_km ?? 200,
            available: Boolean(row.available),
          }
        : undefined,
    sale:
      row.price != null
        ? {
            price: Number(row.price),
            modelYear: row.model_year ?? new Date().getFullYear(),
            mileage: row.mileage ?? 0,
            condition: (row.condition ?? "Occasion") as "Neuf" | "Occasion",
          }
        : undefined,
  }
}

// SQL de base pour récupérer un véhicule complet avec ses infos
const BASE_SQL = `
  SELECT
    v.*,
    GROUP_CONCAT(DISTINCT sv.service_type) AS services,
    ANY_VALUE(li.price_per_day) AS price_per_day,
    ANY_VALUE(li.included_km) AS included_km,
    ANY_VALUE(li.available) AS available,
    ANY_VALUE(vi.price) AS price,
    ANY_VALUE(vi.model_year) AS model_year,
    ANY_VALUE(vi.mileage) AS mileage,
    ANY_VALUE(vi.condition) AS \`condition\`
  FROM vehicules v
  LEFT JOIN services_vehicule sv ON sv.vehicule_id = v.id
  LEFT JOIN location_info li ON li.vehicule_id = v.id
  LEFT JOIN vente_info vi ON vi.vehicule_id = v.id
`

export async function getAllVehicles(): Promise<Vehicle[]> {
  const rows = await query<VehicleRow>(
    `${BASE_SQL} GROUP BY v.id ORDER BY v.id`
  )
  return rows.map(rowToVehicle)
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | undefined> {
  const rows = await query<VehicleRow>(
    `${BASE_SQL} WHERE v.slug = ? GROUP BY v.id`,
    [slug]
  )
  return rows.length > 0 ? rowToVehicle(rows[0]) : undefined
}

export async function getAllBrands(): Promise<string[]> {
  const rows = await query<{ brand: string }>(
    "SELECT DISTINCT brand FROM vehicules ORDER BY brand"
  )
  return rows.map((r) => r.brand)
}

export async function getCategories(): Promise<Category[]> {
  return query<Category>("SELECT * FROM categories ORDER BY slug")
}

export async function getFeaturedVehicles(): Promise<Vehicle[]> {
  const rows = await query<VehicleRow>(
    `${BASE_SQL} WHERE v.slug IN ('tesla-model-3','audi-q5','peugeot-208','porsche-macan') GROUP BY v.id`
  )
  return rows.map(rowToVehicle)
}

export interface VehicleFilters {
  category?: CategorySlug | "all"
  service?: ServiceType | "all"
  brand?: string | "all"
  maxBudget?: number
  query?: string
}

export async function filterVehicles(filters: VehicleFilters): Promise<Vehicle[]> {
  const conditions: string[] = []
  const params: unknown[] = []

  if (filters.category && filters.category !== "all") {
    conditions.push("v.category_slug = ?")
    params.push(filters.category)
  }
  if (filters.brand && filters.brand !== "all") {
    conditions.push("v.brand = ?")
    params.push(filters.brand)
  }
  if (filters.query) {
    conditions.push("(v.brand LIKE ? OR v.model LIKE ?)")
    params.push(`%${filters.query}%`, `%${filters.query}%`)
  }

  const having: string[] = []
  if (filters.service && filters.service !== "all") {
    having.push("FIND_IN_SET(?, services) > 0")
    params.push(filters.service)
  }
  if (filters.maxBudget != null) {
    having.push("(vi.price <= ? OR li.price_per_day * 30 <= ?)")
    params.push(filters.maxBudget, filters.maxBudget)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""
  const havingClause = having.length > 0 ? `HAVING ${having.join(" AND ")}` : ""

  const rows = await query<VehicleRow>(
    `${BASE_SQL} ${whereClause} GROUP BY v.id ${havingClause} ORDER BY v.id`,
    params
  )
  return rows.map(rowToVehicle)
}

// ──────────────────────────────────────────────────────────────
// Export des catégories statiques (fallback si DB vide)
// ──────────────────────────────────────────────────────────────
export const categories: Category[] = [
  { slug: "citadines",   name: "Citadines",      description: "Compactes, agiles et économiques pour la ville." },
  { slug: "berlines",    name: "Berlines",        description: "Confort et élégance pour les longs trajets." },
  { slug: "suv",         name: "SUV / Crossover", description: "Position de conduite haute et polyvalence." },
  { slug: "utilitaires", name: "Utilitaires",     description: "Volume de chargement pour les professionnels." },
]
