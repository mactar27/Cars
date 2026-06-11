import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ContactForm } from "./contact-form"
import { type Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact — MAISON AUTO",
  description:
    "Contactez l'équipe Maison Auto pour toute demande de reprise, achat, location ou financement de véhicule.",
}

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Nous contacter
            </p>
            <h1 className="mt-3 text-4xl font-light tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Parlons de votre{" "}
              <span className="font-semibold">projet automobile.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground">
              Notre équipe est à votre disposition pour tout renseignement sur
              nos véhicules, nos offres de reprise ou nos services de
              financement.
            </p>
          </div>
        </section>

        {/* Formulaire + infos (Client Component) */}
        <ContactForm />
      </main>

      <SiteFooter />
    </div>
  )
}
