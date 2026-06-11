import { NextRequest, NextResponse } from "next/server"
import { filterVehicles, getAllBrands } from "@/lib/data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const category  = searchParams.get("category")  || "all"
    const service   = searchParams.get("service")   || "all"
    const brand     = searchParams.get("brand")     || "all"
    const maxBudget = searchParams.get("maxBudget")
    const q         = searchParams.get("q")         || undefined

    const vehicles = await filterVehicles({
      category:  category  !== "all" ? (category as import("@/lib/types").CategorySlug)  : "all",
      service:   service   !== "all" ? (service  as import("@/lib/types").ServiceType)   : "all",
      brand:     brand     !== "all" ? brand : "all",
      maxBudget: maxBudget ? Number(maxBudget) : undefined,
      query:     q,
    })

    const brands = await getAllBrands()

    return NextResponse.json({ vehicles, brands })
  } catch (err) {
    console.error("[GET /api/vehicles]", err)
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 })
  }
}
