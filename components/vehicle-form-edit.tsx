"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, ImageIcon } from "lucide-react"
import Image from "next/image"

type VehicleData = {
  id: number
  slug: string
  brand: string
  model: string
  category_slug: string
  fuel: string
  transmission: string
  seats: number
  power: number
  tagline: string | null
  image: string | null
  services: string | null
  price_per_day: number | null
  included_km: number | null
  available: number | null
  price: number | null
  model_year: number | null
  mileage: number | null
  condition: string | null
}

export function VehicleFormEdit({ vehicle }: { vehicle: VehicleData }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const initialServices = vehicle.services ? vehicle.services.split(",") : []
  const [services, setServices] = useState<string[]>(initialServices)

  const [imageUrl, setImageUrl] = useState<string | null>(vehicle.image ?? null)
  const [imageUploading, setImageUploading] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageUploading(true)
    setImageError(null)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const json = await res.json()
      if (!res.ok) { setImageError(json.error || "Erreur upload"); return }
      setImageUrl(json.url)
    } catch {
      setImageError("Impossible d'uploader l'image.")
    } finally {
      setImageUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const data = {
      slug: formData.get("slug"),
      brand: formData.get("brand"),
      model: formData.get("model"),
      category_slug: formData.get("category_slug"),
      fuel: formData.get("fuel"),
      transmission: formData.get("transmission"),
      seats: Number(formData.get("seats")),
      power: Number(formData.get("power")),
      tagline: formData.get("tagline"),
      image: imageUrl,
      services,
      rental: services.includes("location") ? {
        pricePerDay: Number(formData.get("pricePerDay")),
        includedKm: Number(formData.get("includedKm")),
        available: true,
      } : undefined,
      sale: services.includes("vente") ? {
        price: Number(formData.get("price")),
        modelYear: Number(formData.get("modelYear")),
        mileage: Number(formData.get("mileage")),
        condition: formData.get("condition"),
      } : undefined,
    }

    try {
      const res = await fetch(`/api/vehicles/${vehicle.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error || "Une erreur est survenue."); return }
      setSuccess(true)
      router.refresh()
    } catch {
      setError("Impossible de contacter le serveur.")
    } finally {
      setLoading(false)
    }
  }

  function toggleService(service: string) {
    setServices((prev) => prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service])
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 rounded-2xl border border-border bg-card p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Marque">
          <input type="text" name="brand" required defaultValue={vehicle.brand} className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
        </Field>
        <Field label="Modèle">
          <input type="text" name="model" required defaultValue={vehicle.model} className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
        </Field>
        <Field label="Identifiant (slug)">
          <input type="text" name="slug" required defaultValue={vehicle.slug} className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
        </Field>
        <Field label="Catégorie">
          <select name="category_slug" required defaultValue={vehicle.category_slug} className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20">
            <option value="citadines">Citadine</option>
            <option value="berlines">Berline</option>
            <option value="suv">SUV</option>
            <option value="utilitaires">Utilitaire</option>
          </select>
        </Field>
        <Field label="Carburant">
          <select name="fuel" required defaultValue={vehicle.fuel} className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20">
            <option value="Essence">Essence</option>
            <option value="Diesel">Diesel</option>
            <option value="Électrique">Électrique</option>
            <option value="Hybride">Hybride</option>
          </select>
        </Field>
        <Field label="Transmission">
          <select name="transmission" required defaultValue={vehicle.transmission} className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20">
            <option value="Manuelle">Manuelle</option>
            <option value="Automatique">Automatique</option>
          </select>
        </Field>
        <Field label="Nombre de places">
          <input type="number" name="seats" defaultValue={vehicle.seats} min={1} max={9} required className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
        </Field>
        <Field label="Puissance (ch)">
          <input type="number" name="power" defaultValue={vehicle.power} required className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
        </Field>
      </div>

      <Field label="Accroche (Tagline)">
        <input type="text" name="tagline" defaultValue={vehicle.tagline ?? ""} className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
      </Field>

      {/* Image */}
      <div className="border-t border-border pt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Photo du véhicule</p>
        <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/webp,image/avif" className="hidden" onChange={handleImageChange} />
        {imageUrl ? (
          <div className="relative h-48 w-full overflow-hidden rounded-xl border border-border bg-muted">
            <Image src={imageUrl} alt="Aperçu" fill className="object-contain p-2" />
            <button type="button" onClick={() => { setImageUrl(null); if (fileInputRef.current) fileInputRef.current.value = "" }} className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 text-foreground backdrop-blur hover:bg-background">
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={imageUploading} className="flex h-48 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/30 text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-muted/60 disabled:opacity-50">
            {imageUploading ? (
              <><div className="size-8 animate-spin rounded-full border-2 border-border border-t-foreground" /><span className="text-sm">Upload en cours…</span></>
            ) : (
              <>
                <div className="flex size-12 items-center justify-center rounded-full bg-muted"><ImageIcon className="size-6" /></div>
                <div className="text-center"><p className="text-sm font-medium text-foreground">Cliquer pour sélectionner une image</p><p className="mt-1 text-xs">PNG, JPG, WebP</p></div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground"><Upload className="size-3.5" />Choisir un fichier</div>
              </>
            )}
          </button>
        )}
        {imageError && <p className="mt-2 text-xs text-red-600">{imageError}</p>}
      </div>

      {/* Services */}
      <div className="space-y-4 border-t border-border pt-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Services proposés</p>
        <div className="flex gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input type="checkbox" checked={services.includes("location")} onChange={() => toggleService("location")} className="rounded" />
            Location
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input type="checkbox" checked={services.includes("vente")} onChange={() => toggleService("vente")} className="rounded" />
            Vente
          </label>
        </div>
      </div>

      {services.includes("location") && (
        <div className="space-y-4 border-t border-border pt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Détails Location</p>
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Prix par jour (€)">
              <input type="number" name="pricePerDay" defaultValue={vehicle.price_per_day ?? ""} required className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            </Field>
            <Field label="Km inclus / jour">
              <input type="number" name="includedKm" defaultValue={vehicle.included_km ?? 200} required className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            </Field>
          </div>
        </div>
      )}

      {services.includes("vente") && (
        <div className="space-y-4 border-t border-border pt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Détails Vente</p>
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Prix de vente (€)">
              <input type="number" name="price" defaultValue={vehicle.price ?? ""} required className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            </Field>
            <Field label="Année du modèle">
              <input type="number" name="modelYear" defaultValue={vehicle.model_year ?? new Date().getFullYear()} required className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            </Field>
            <Field label="Kilométrage">
              <input type="number" name="mileage" defaultValue={vehicle.mileage ?? 0} required className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            </Field>
            <Field label="État">
              <select name="condition" defaultValue={vehicle.condition ?? "Occasion"} required className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20">
                <option value="Occasion">Occasion</option>
                <option value="Neuf">Neuf</option>
              </select>
            </Field>
          </div>
        </div>
      )}

      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
      {success && <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">✓ Véhicule mis à jour avec succès.</p>}

      <div className="flex items-center gap-4">
        <button type="submit" disabled={loading} className="rounded-full bg-foreground px-8 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50">
          {loading ? "Enregistrement…" : "Sauvegarder les modifications"}
        </button>
        <button type="button" onClick={() => router.push("/espace-admin")} className="rounded-full border border-border px-6 py-2.5 text-sm text-muted-foreground hover:text-foreground">
          Annuler
        </button>
      </div>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}
