import { NextRequest, NextResponse } from "next/server"
import { query, execute } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

function isAdmin(request: NextRequest): boolean {
  const token = request.cookies.get("maison-auto-token")?.value
  if (!token) return false
  const payload = verifyToken(token)
  return payload?.role === "admin"
}

// GET /api/vehicles/[id] — Récupérer un véhicule complet
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const rows = await query<any>(`
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
      WHERE v.id = ?
      GROUP BY v.id
    `, [id])
    if (rows.length === 0) return NextResponse.json({ error: "Introuvable." }, { status: 404 })
    return NextResponse.json(rows[0])
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

// PUT /api/vehicles/[id] — Mettre à jour un véhicule
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(request)) return NextResponse.json({ error: "Non autorisé." }, { status: 403 })
  const { id } = await params

  try {
    const body = await request.json()
    const { slug, brand, model, category_slug, fuel, transmission, seats, power, tagline, image, services, rental, sale } = body

    await execute(
      `UPDATE vehicules SET slug=?, brand=?, model=?, category_slug=?, fuel=?, transmission=?, seats=?, power=?, tagline=?, image=? WHERE id=?`,
      [slug, brand, model, category_slug, fuel, transmission, seats, power, tagline ?? null, image ?? null, id]
    )

    // Services — reset & re-insert
    await execute("DELETE FROM services_vehicule WHERE vehicule_id = ?", [id])
    for (const svc of (services || [])) {
      await execute("INSERT INTO services_vehicule (vehicule_id, service_type) VALUES (?, ?)", [id, svc])
    }

    // Location info — upsert
    await execute("DELETE FROM location_info WHERE vehicule_id = ?", [id])
    if (rental) {
      await execute(
        "INSERT INTO location_info (vehicule_id, price_per_day, included_km, available) VALUES (?, ?, ?, ?)",
        [id, rental.pricePerDay, rental.includedKm, rental.available ?? true]
      )
    }

    // Vente info — upsert
    await execute("DELETE FROM vente_info WHERE vehicule_id = ?", [id])
    if (sale) {
      await execute(
        "INSERT INTO vente_info (vehicule_id, price, model_year, mileage, `condition`) VALUES (?, ?, ?, ?, ?)",
        [id, sale.price, sale.modelYear, sale.mileage, sale.condition]
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(`[PUT /api/vehicles/${id}]`, err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 })
  }

  const { id } = await params

  try {
    await execute("DELETE FROM vehicules WHERE id = ?", [id])
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(`[DELETE /api/vehicles/${id}]`, err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
