"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, ImageIcon } from "lucide-react"
import Image from "next/image"

export function VehicleForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [services, setServices] = useState<string[]>([])
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")

  function toSlug(str: string) {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  }
  const autoSlug = [toSlug(brand), toSlug(model)].filter(Boolean).join("-")

  // Image upload state
  const [imageUrl, setImageUrl] = useState<string | null>(null)
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
    const formData = new FormData(e.currentTarget);
        // Basic client‑side validation
    const requiredFields = [
      "brand",
      "model",
      "category_slug",
      "fuel",
      "transmission",
      "seats",
      "power",
      "tagline",
    ];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        setError(`Le champ "${field}" est obligatoire.`);
        setLoading(false);
        return;
      }
    }
    // Validate numeric fields
    const pricePerDay = Number(formData.get("pricePerDay"));
    const includedKm = Number(formData.get("includedKm"));
    if (services.includes("location")) {
      if (isNaN(pricePerDay) || pricePerDay <= 0) {
        setError("Prix par jour doit être un nombre positif.");
        setLoading(false);
        return;
      }
      if (isNaN(includedKm) || includedKm < 0) {
        setError("Km inclus doit être un nombre positif ou zéro.");
        setLoading(false);
        return;
      }
    }
    // Validate sale fields if "vente" service selected
    if (services.includes("vente")) {
      const price = Number(formData.get("price"));
      const modelYear = Number(formData.get("modelYear"));
      const mileage = Number(formData.get("mileage"));
      const condition = formData.get("condition");
      if (isNaN(price) || price <= 0) {
        setError("Prix de vente doit être un nombre positif.");
        setLoading(false);
        return;
      }
      if (isNaN(modelYear) || modelYear <= 0) {
        setError("Année du modèle doit être un nombre positif.");
        setLoading(false);
        return;
      }
      if (isNaN(mileage) || mileage < 0) {
        setError("Kilométrage doit être un nombre positif ou zéro.");
        setLoading(false);
        return;
      }
      if (!condition) {
        setError("Le champ \"condition\" est obligatoire.");
        setLoading(false);
        return;
      }
    }
    // Ensure an image is uploaded
    if (!imageUrl) {
      setError('Veuillez sélectionner une photo du véhicule.');
      setLoading(false);
      return;
    }
    const data = {
      slug: formData.get("slug")?.toString() || autoSlug,
      brand: formData.get("brand")?.toString(),
      model: formData.get("model")?.toString(),
      category_slug: formData.get("category_slug"),
      fuel: formData.get("fuel"),
      transmission: formData.get("transmission"),
      seats: Number(formData.get("seats")),
      power: Number(formData.get("power")),
      tagline: formData.get("tagline"),
      image: imageUrl,
      services,
      rental: services.includes("location")
        ? {
            pricePerDay: Number(formData.get("pricePerDay")),
            includedKm: Number(formData.get("includedKm")),
            available: true,
          }
        : undefined,
      sale: services.includes("vente")
        ? {
            price: Number(formData.get("price")),
            modelYear: Number(formData.get("modelYear")),
            mileage: Number(formData.get("mileage")),
            condition: formData.get("condition"),
          }
        : undefined,
    }

    try {
      const res = await fetch("/api/vehicles/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const json = await res.json()
      if (!res.ok) {
        console.error("Backend error details:", json.details)
        const detailedError = json.details?.fieldErrors 
          ? Object.entries(json.details.fieldErrors).map(([k, v]) => `${k}: ${v}`).join(", ") 
          : "";
        setError(detailedError ? `${json.error} (${detailedError})` : json.error || "Une erreur est survenue.")
        return
      }

      router.push("/espace-admin")
      router.refresh()
    } catch {
      setError("Impossible de contacter le serveur.")
    } finally {
      setLoading(false)
    }
  }

  function toggleService(service: string) {
    setServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 rounded-2xl border border-border bg-card p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Marque">
          <input type="text" name="brand" required className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
        </Field>
        <Field label="Modèle">
          <input type="text" name="model" required className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
        </Field>
        <Field label="Identifiant (slug)">
          <input type="text" name="slug" required className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" placeholder="ex: peugeot-208" />
        </Field>
        <Field label="Catégorie">
          <select name="category_slug" required className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20">
            <option value="citadines">Citadine</option>
            <option value="berlines">Berline</option>
            <option value="suv">SUV</option>
            <option value="utilitaires">Utilitaire</option>
          </select>
        </Field>
        <Field label="Carburant">
          <select name="fuel" required className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20">
            <option value="Essence">Essence</option>
            <option value="Diesel">Diesel</option>
            <option value="Électrique">Électrique</option>
            <option value="Hybride">Hybride</option>
          </select>
        </Field>
        <Field label="Transmission">
          <select name="transmission" required className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20">
            <option value="Manuelle">Manuelle</option>
            <option value="Automatique">Automatique</option>
          </select>
        </Field>
        <Field label="Nombre de places">
          <input type="number" name="seats" defaultValue={5} min={1} max={9} required className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
        </Field>
        <Field label="Puissance (ch)">
          <input type="number" name="power" required className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
        </Field>
      </div>

      <Field label="Accroche (Tagline)">
        <input type="text" name="tagline" className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
      </Field>

      {/* ── Image Upload ─────────────────────────── */}
      <div className="border-t border-border pt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Photo du véhicule</p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp,image/avif"
          className="hidden"
          onChange={handleImageChange}
        />

        {imageUrl ? (
          <div className="relative h-48 w-full overflow-hidden rounded-xl border border-border bg-muted">
            <Image src={imageUrl} alt="Aperçu" fill className="object-contain p-2" />
            <button
              type="button"
              onClick={() => { setImageUrl(null); if (fileInputRef.current) fileInputRef.current.value = "" }}
              className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 text-foreground backdrop-blur hover:bg-background"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={imageUploading}
            className="flex h-48 w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/30 text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-muted/60 disabled:opacity-50"
          >
            {imageUploading ? (
              <>
                <div className="size-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
                <span className="text-sm">Upload en cours…</span>
              </>
            ) : (
              <>
                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <ImageIcon className="size-6" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">Cliquer pour sélectionner une image</p>
                  <p className="mt-1 text-xs">PNG, JPG, WebP — max 10 Mo</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground">
                  <Upload className="size-3.5" />
                  Choisir un fichier
                </div>
              </>
            )}
          </button>
        )}
        {imageError && <p className="mt-2 text-xs text-red-600">{imageError}</p>}
      </div>

      {/* ── Services ─────────────────────────────── */}
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
            <Field label="Prix par jour (F CFA)">
              <input type="number" name="pricePerDay" required className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            </Field>
            <Field label="Km inclus / jour">
              <input type="number" name="includedKm" defaultValue={200} required className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            </Field>
          </div>
        </div>
      )}

      {services.includes("vente") && (
        <div className="space-y-4 border-t border-border pt-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Détails Vente</p>
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Prix de vente (F CFA)">
              <input type="number" name="price" required className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            </Field>
            <Field label="Année du modèle">
              <input type="number" name="modelYear" defaultValue={new Date().getFullYear()} required className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            </Field>
            <Field label="Kilométrage">
              <input type="number" name="mileage" defaultValue={0} required className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20" />
            </Field>
            <Field label="État">
              <select name="condition" required className="w-full rounded-md border border-border bg-background p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20">
                <option value="Occasion">Occasion</option>
                <option value="Neuf">Neuf</option>
              </select>
            </Field>
          </div>
        </div>
      )}

      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-foreground px-8 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Enregistrement…" : "Enregistrer le véhicule"}
      </button>
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
