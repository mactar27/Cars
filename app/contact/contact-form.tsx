"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock, Send, Check } from "lucide-react"

const infos = [
  {
    icon: MapPin,
    label: "Adresse",
    value: "Rufisque Bargny\nDakar, Sénégal",
  },
  {
    icon: Phone,
    label: "Téléphone",
    value: "+221 77 351 91 28",
  },
  {
    icon: Mail,
    label: "Email",
    value: "contact@maisonauto.sn",
  },
  {
    icon: Clock,
    label: "Horaires",
    value: "Lun – Sam : 9h00 – 19h00\nDimanche : Fermé",
  },
]

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "reprise",
    message: "",
  })

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid gap-16 lg:grid-cols-[1fr_1.4fr]">
        {/* Left — Informations de contact */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-10"
        >
          <div>
            <h2 className="text-xl font-medium tracking-tight text-foreground">
              Informations de contact
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Venez nous rendre visite ou écrivez-nous directement.
            </p>
          </div>

          <ul className="space-y-8">
            {infos.map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-foreground/5 text-foreground">
                  <Icon className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-1 whitespace-pre-line text-sm text-foreground">
                    {value}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <a
            href="https://www.google.com/maps?q=14.735108,-17.289063"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-56 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted/40 transition-colors hover:bg-muted/60"
          >
            <div className="text-center">
              <MapPin className="mx-auto size-8 text-muted-foreground/40" />
              <p className="mt-2 text-xs font-medium text-muted-foreground">
                Rufisque Bargny, Dakar
              </p>
              <p className="mt-1 text-xs text-muted-foreground/60">
                Voir sur Google Maps ↗
              </p>
            </div>
          </a>
        </motion.div>

        {/* Right — Formulaire */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            {submitted ? (
              <div className="flex flex-col items-center py-16 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-foreground">
                  <Check className="size-7 text-background" />
                </div>
                <p className="mt-5 text-lg font-medium text-foreground">
                  Message envoyé !
                </p>
                <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                  Nous avons bien reçu votre demande. Un conseiller vous
                  recontactera dans les plus brefs délais.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setForm({
                      name: "",
                      email: "",
                      phone: "",
                      subject: "reprise",
                      message: "",
                    })
                  }}
                  className="mt-8 text-sm text-muted-foreground underline-offset-4 hover:underline"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-lg font-medium tracking-tight text-foreground">
                  Envoyer un message
                </h2>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground"
                    >
                      Nom complet
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      className="auth-input"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground"
                    >
                      Adresse email
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="votre@email.sn"
                      className="auth-input"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground"
                    >
                      Téléphone
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+221 77 000 00 00"
                      className="auth-input"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground"
                    >
                      Sujet
                    </label>
                    <select
                      id="contact-subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="auth-input"
                    >
                      <option value="reprise">Reprise de véhicule</option>
                      <option value="achat">Achat de véhicule</option>
                      <option value="location">Location de véhicule</option>
                      <option value="financement">Financement</option>
                      <option value="autre">Autre demande</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Décrivez votre demande..."
                    className="auth-input resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-3.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? (
                    "Envoi en cours…"
                  ) : (
                    <>
                      <Send className="size-4" />
                      Envoyer le message
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-muted-foreground">
                  Vos données sont traitées conformément à notre politique de
                  confidentialité.
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
