import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 })
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/avif"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Format non supporté. Utilisez PNG, JPG ou WebP." }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Sanitize filename
    const ext = file.name.split(".").pop()?.toLowerCase() || "png"
    const baseName = file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 60)
    const filename = `${baseName}.${ext}`

    const carsDir = path.join(process.cwd(), "public", "cars")
    await mkdir(carsDir, { recursive: true })
    await writeFile(path.join(carsDir, filename), buffer)

    return NextResponse.json({ url: `/cars/${filename}` })
  } catch (err) {
    console.error("[upload]", err)
    return NextResponse.json({ error: "Erreur lors de l'upload." }, { status: 500 })
  }
}
