"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Car, CalendarDays, RefreshCw, CheckCircle2, ShieldCheck, HeadphonesIcon, BadgeEuro } from "lucide-react"

export function HomeServices() {
  const services = [
    {
      title: "Acheter un véhicule",
      description: "Trouvez le véhicule de vos rêves parmi notre sélection rigoureuse de modèles premium.",
      icon: Car,
      href: "/catalogue?service=vente"
    },
    {
      title: "Louer un véhicule",
      description: "Profitez d'une flexibilité totale avec nos offres de location courte et longue durée.",
      icon: CalendarDays,
      href: "/catalogue?service=location"
    },
    {
      title: "Reprendre votre véhicule",
      description: "Obtenez une estimation juste et rapide pour la reprise de votre ancien véhicule.",
      icon: RefreshCw,
      href: "/contact"
    }
  ]

  return (
    <section className="bg-muted/30 py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-light tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Nos services
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
            Des solutions adaptées à toutes vos exigences automobiles.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {services.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <Link href={service.href} className="group block h-full rounded-2xl border border-border bg-background p-8 transition-all hover:border-foreground/20 hover:shadow-xl hover:shadow-foreground/5">
                <div className="mb-6 inline-flex size-12 items-center justify-center rounded-xl bg-foreground/5 text-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
                  <service.icon className="size-6" />
                </div>
                <h3 className="mb-3 text-xl font-medium text-foreground">{service.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{service.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function HomeWhyUs() {
  return (
    <section className="overflow-hidden bg-foreground py-32 text-background">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-light tracking-tight sm:text-4xl md:text-5xl">
              Pourquoi Maison Auto ?
            </h2>
            <div className="mt-10 space-y-6">
              {[
                { title: "Plus de 500 véhicules disponibles", icon: Car },
                { title: "Accompagnement personnalisé", icon: HeadphonesIcon },
                { title: "Service après-vente", icon: ShieldCheck },
                { title: "Financement adapté", icon: BadgeEuro },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background/10">
                    <item.icon className="size-5" />
                  </div>
                  <span className="text-lg font-light tracking-wide text-background/90">{item.title}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4 sm:gap-8"
          >
            <div className="flex flex-col items-center justify-center rounded-2xl border border-background/20 bg-background/5 p-8 text-center backdrop-blur-sm">
              <span className="text-5xl font-semibold tracking-tighter">500+</span>
              <span className="mt-2 text-sm font-medium uppercase tracking-widest text-background/60">Véhicules</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-2xl border border-background/20 bg-background/5 p-8 text-center backdrop-blur-sm">
              <span className="text-5xl font-semibold tracking-tighter">98%</span>
              <span className="mt-2 text-sm font-medium uppercase tracking-widest text-background/60">Clients satisfaits</span>
            </div>
            <div className="col-span-2 flex flex-col items-center justify-center rounded-2xl border border-background/20 bg-background/5 p-8 text-center backdrop-blur-sm">
              <span className="text-5xl font-semibold tracking-tighter">24/7</span>
              <span className="mt-2 text-sm font-medium uppercase tracking-widest text-background/60">Support</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export function HomeBrands() {
  const brands = ["Mercedes", "Audi", "BMW", "Peugeot", "Tesla", "Toyota"]
  
  return (
    <section className="border-b border-border bg-background py-20">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <p className="mb-10 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Marques disponibles
        </p>
        <div className="flex flex-wrap items-center justify-center gap-12 opacity-60 grayscale transition-all hover:grayscale-0 sm:gap-20">
          {brands.map((brand) => (
            <span key={brand} className="text-xl font-bold tracking-widest text-foreground transition-colors hover:text-foreground/80 sm:text-2xl">
              {brand.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export function HomeCTA() {
  return (
    <section className="relative overflow-hidden bg-[#F6F6F6] py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-light tracking-tighter text-foreground sm:text-5xl md:text-6xl"
        >
          Trouvez votre prochaine <br className="hidden sm:block" />
          <span className="font-semibold">voiture aujourd&apos;hui.</span>
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          <Link
            href="/catalogue"
            className="inline-flex items-center justify-center rounded-full bg-foreground px-10 py-5 text-base font-medium text-background transition-transform hover:scale-105 hover:shadow-2xl hover:shadow-foreground/20"
          >
            Explorer le catalogue
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
