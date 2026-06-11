import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { query } from "@/lib/db"
import { signToken } from "@/lib/auth"
import { z } from "zod"

const ADMIN_DOMAIN = process.env.ADMIN_EMAIL_DOMAIN || "admin.com"

const RegisterSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  address: z.string().min(5),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = RegisterSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { email, password, firstName, lastName, address } = parsed.data

    // Vérifier si l'email existe déjà
    const existing = await query<{ id: number }>(
      "SELECT id FROM users WHERE email = ?",
      [email]
    )
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé." },
        { status: 409 }
      )
    }

    // Déterminer le rôle
    const role: "admin" | "client" = email.endsWith(`@${ADMIN_DOMAIN}`)
      ? "admin"
      : "client"

    // Hacher le mot de passe
    const passwordHash = await bcrypt.hash(password, 12)

    // Créer l'utilisateur
    const result = await query<{ insertId: number }>(
      "INSERT INTO users (email, password_hash, role, first_name, last_name, address) VALUES (?, ?, ?, ?, ?, ?)",
      [email, passwordHash, role, firstName, lastName, address]
    )

    const userId = (result as unknown as { insertId: number }).insertId

    // Générer le token
    const token = signToken({ userId, email, role })

    const redirectTo = role === "admin" ? "/espace-admin" : "/"

    const response = NextResponse.json({ success: true, role, redirectTo })
    response.cookies.set("maison-auto-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: "/",
    })
    return response
  } catch (err) {
    console.error("[register]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
