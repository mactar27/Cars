import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { query } from "@/lib/db"
import { signToken } from "@/lib/auth"
import { z } from "zod"

const LoginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
})

interface UserRow {
  id: number
  email: string
  password_hash: string
  role: "admin" | "client"
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = LoginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides." },
        { status: 400 }
      )
    }

    const { email, password } = parsed.data

    const users = await query<UserRow>(
      "SELECT id, email, password_hash, role FROM users WHERE email = ?",
      [email]
    )

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect." },
        { status: 401 }
      )
    }

    const user = users[0]
    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect." },
        { status: 401 }
      )
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role })
    const redirectTo = user.role === "admin" ? "/espace-admin" : "/"

    const response = NextResponse.json({ success: true, role: user.role, redirectTo })
    response.cookies.set("maison-auto-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })
    return response
  } catch (err) {
    console.error("[login]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
