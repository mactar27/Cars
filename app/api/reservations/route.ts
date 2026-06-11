import { NextRequest, NextResponse } from "next/server"
import { query, execute } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

function getToken(request: NextRequest) {
  const token = request.cookies.get("maison-auto-token")?.value
  if (!token) return null
  return verifyToken(token)
}

// POST /api/reservations — Créer une réservation
export async function POST(request: NextRequest) {
  const payload = getToken(request)
  if (!payload) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { vehiculeId, serviceType, dateDebut, dateFin, message } = body

    if (!vehiculeId || !serviceType) {
      return NextResponse.json({ error: "Données manquantes." }, { status: 400 })
    }

    let totalAmount = null
    
    if (serviceType === "vente") {
      const vi = await query<any>("SELECT price FROM vente_info WHERE vehicule_id = ?", [vehiculeId])
      if (vi.length > 0) totalAmount = vi[0].price
    } else if (serviceType === "location" && dateDebut && dateFin) {
      const li = await query<any>("SELECT price_per_day FROM location_info WHERE vehicule_id = ?", [vehiculeId])
      if (li.length > 0) {
        const d1 = new Date(dateDebut)
        const d2 = new Date(dateFin)
        const diffTime = Math.abs(d2.getTime() - d1.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        // Minimum 1 jour facturé
        const days = diffDays > 0 ? diffDays : 1
        totalAmount = days * li[0].price_per_day
      }
    }

    const res = await execute(
      `INSERT INTO reservations (user_id, vehicule_id, service_type, date_debut, date_fin, total_amount, message)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [payload.userId, vehiculeId, serviceType, dateDebut ?? null, dateFin ?? null, totalAmount, message ?? null]
    )

    return NextResponse.json({ success: true, id: res.insertId }, { status: 201 })
  } catch (err) {
    console.error("[POST /api/reservations]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}

// GET /api/reservations — Liste des réservations (admin: tout, client: les siennes)
export async function GET(request: NextRequest) {
  const payload = getToken(request)
  if (!payload) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 })
  }

  try {
    const sql =
      payload.role === "admin"
        ? `SELECT r.*, v.brand, v.model, u.email, u.first_name, u.last_name
           FROM reservations r
           JOIN vehicules v ON v.id = r.vehicule_id
           JOIN users u ON u.id = r.user_id
           ORDER BY r.created_at DESC`
        : `SELECT r.*, v.brand, v.model
           FROM reservations r
           JOIN vehicules v ON v.id = r.vehicule_id
           WHERE r.user_id = ?
           ORDER BY r.created_at DESC`

    const params = payload.role === "admin" ? [] : [payload.userId]
    const reservations = await query(sql, params)

    return NextResponse.json({ reservations })
  } catch (err) {
    console.error("[GET /api/reservations]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
