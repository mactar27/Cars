"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function AuthForm() {
  const router = useRouter()
  const [tab, setTab] = useState<"connexion" | "inscription">("connexion")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const endpoint = tab === "connexion" ? "/api/auth/login" : "/api/auth/register"
    const body =
      tab === "connexion"
        ? { email, password }
        : { email, password, firstName, lastName, address }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.")
        return
      }

      // Redirection basée sur le rôle renvoyé par le serveur
      router.push(data.redirectTo ?? "/")
      router.refresh()
    } catch {
      setError("Impossible de contacter le serveur.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 flex gap-1 rounded-full bg-muted p-1">
        {(["connexion", "inscription"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setTab(t); setError(null) }}
            className={cn(
              "flex-1 rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors",
              tab === t
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {tab === "inscription" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Prénom">
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="auth-input"
                />
              </Field>
              <Field label="Nom">
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="auth-input"
                />
              </Field>
            </div>
            <Field label="Adresse postale">
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="auth-input"
                placeholder="Almadies, Dakar"
              />
            </Field>
          </>
        )}
        <Field label="Email">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            placeholder="vous@exemple.com"
          />
        </Field>
        <Field label="Mot de passe">
          <input
            type="password"
            required
            minLength={tab === "inscription" ? 8 : 1}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            placeholder="••••••••"
          />
        </Field>

        {/* Indication dynamique du domaine admin */}
        <p className="text-xs text-muted-foreground">
          {tab === "inscription" && email.endsWith("@admin.com") && (
            <span className="font-medium text-foreground">
              ✓ Compte administrateur détecté
            </span>
          )}
        </p>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-full bg-foreground py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading
            ? "Connexion…"
            : tab === "connexion"
              ? "Se connecter"
              : "Créer mon compte"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        En continuant, vous acceptez nos conditions générales et notre politique
        de confidentialité.
      </p>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  )
}
