import { NextRequest, NextResponse } from "next/server"
import { query, execute } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { z } from "zod"

const VehicleSchema = z.object({
  slug:         z.string().min(2),
  brand:        z.string().min(1),
  model:        z.string().min(1),
  category_slug:z.enum(["citadines","berlines","suv","utilitaires"]),
  fuel:         z.enum(["Essence","Diesel","Électrique","Hybride"]),
  transmission: z.enum(["Manuelle","Automatique"]),
  seats:        z.number().int().min(1).max(9),
  power:        z.number().int().min(1),
  image:        z.string().optional(),
  tagline:      z.string().optional(),
  services:     z.array(z.enum(["location","vente"])),
  rental: z.object({
    pricePerDay: z.number().positive(),
    includedKm:  z.number().int().positive(),
    available:   z.boolean(),
  }).optional(),
  sale: z.object({
    price:      z.number().positive(),
    modelYear:  z.number().int(),
    mileage:    z.number().int().min(0),
    condition:  z.enum(["Neuf","Occasion"]),
  }).optional(),
})

function isAdmin(request: NextRequest): boolean {
  const token = request.cookies.get("maison-auto-token")?.value
  if (!token) return false
  const payload = verifyToken(token)
  return payload?.role === "admin"
}

// POST /api/vehicles — Ajouter un véhicule (admin)
export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 })
  }

  try {
    const body = await request.json()
    const parsed = VehicleSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides.", details: parsed.error.flatten() }, { status: 400 })
    }

    const d = parsed.data

    // Insérer le véhicule
    const res = await execute(
      `INSERT INTO vehicules (slug, brand, model, category_slug, fuel, transmission, seats, power, image, tagline)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [d.slug, d.brand, d.model, d.category_slug, d.fuel, d.transmission, d.seats, d.power, d.image ?? null, d.tagline ?? null]
    )
    const vehicleId = res.insertId

    // Insérer les services
    for (const svc of d.services) {
      await execute("INSERT INTO services_vehicule (vehicule_id, service_type) VALUES (?, ?)", [vehicleId, svc])
    }

    // Infos location
    if (d.rental) {
      await execute(
        "INSERT INTO location_info (vehicule_id, price_per_day, included_km, available) VALUES (?, ?, ?, ?)",
        [vehicleId, d.rental.pricePerDay, d.rental.includedKm, d.rental.available]
      )
    }

    // Infos vente
    if (d.sale) {
      await execute(
        "INSERT INTO vente_info (vehicule_id, price, model_year, mileage, `condition`) VALUES (?, ?, ?, ?, ?)",
        [vehicleId, d.sale.price, d.sale.modelYear, d.sale.mileage, d.sale.condition]
      )
    }

    return NextResponse.json({ success: true, id: vehicleId }, { status: 201 })
  } catch (err: any) {
    console.error("[POST /api/vehicles]", err)
    return NextResponse.json({ error: err?.message || "Erreur serveur." }, { status: 500 })
  }
}
