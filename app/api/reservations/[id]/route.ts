import { NextRequest, NextResponse } from "next/server"
import { execute } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

function isAdmin(request: NextRequest): boolean {
  const token = request.cookies.get("maison-auto-token")?.value
  if (!token) return false
  const payload = verifyToken(token)
  return payload?.role === "admin"
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const { statut } = body

    if (!["en_attente", "confirmee", "annulee", "terminee"].includes(statut)) {
      return NextResponse.json({ error: "Statut invalide." }, { status: 400 })
    }

    await execute("UPDATE reservations SET statut = ? WHERE id = ?", [statut, id])
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(`[PUT /api/reservations/${id}]`, err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
