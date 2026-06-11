"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, ShieldCheck, Award, HeadphonesIcon } from "lucide-react"

export function HeroHome() {
  return (
    <section className="relative flex min-h-[90vh] w-full items-center overflow-hidden bg-[#F6F6F6]">
      {/* Diagonal Background Split */}
      <div 
        className="absolute bottom-0 right-0 top-0 w-[65%] bg-white"
        style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}
      />
      
      <div className="relative mx-auto w-full max-w-7xl px-6 py-24 lg:flex lg:items-center lg:justify-between lg:py-32">
        {/* Left Content */}
        <div className="z-10 max-w-xl flex-shrink-0 lg:w-1/2">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
          >
            VOTRE PROCHAINE VOITURE, EN TOUTE CONFIANCE
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-5xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-6xl md:text-[5rem]"
          >
            L&apos;excellence<br />
            automobile à<br />
            portée de main.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Vente, location et accompagnement personnalisé pour votre prochaine voiture.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/catalogue"
              className="group flex items-center justify-center gap-2 rounded-full bg-foreground px-8 py-4 text-sm font-medium text-background transition-all hover:scale-105 hover:bg-foreground/90 hover:shadow-xl hover:shadow-foreground/10"
            >
              Explorer la collection
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/espace-client"
              className="flex items-center justify-center rounded-full border border-border bg-transparent px-8 py-4 text-sm font-medium text-foreground transition-all hover:bg-background hover:shadow-sm"
            >
              Espace membre
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            className="mt-20 flex flex-wrap items-start gap-8 border-t border-border/60 pt-8 sm:flex-nowrap"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-8 stroke-[1.5] text-muted-foreground" />
              <div>
                <p className="text-xs font-semibold text-foreground">Véhicules</p>
                <p className="text-xs text-muted-foreground">sélectionnés</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Award className="size-8 stroke-[1.5] text-muted-foreground" />
              <div>
                <p className="text-xs font-semibold text-foreground">Garantie</p>
                <p className="text-xs text-muted-foreground">jusqu&apos;à 24 mois</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <HeadphonesIcon className="size-8 stroke-[1.5] text-muted-foreground" />
              <div>
                <p className="text-xs font-semibold text-foreground">Accompagnement</p>
                <p className="text-xs text-muted-foreground">personnalisé</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Image Container */}
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-16 w-full lg:absolute lg:right-0 lg:top-1/2 lg:mt-0 lg:w-[65%] lg:-translate-y-1/2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-car-clean.jpg"
            alt="Véhicule d'excellence"
            className="w-full object-cover mix-blend-darken scale-110 translate-x-12"
            style={{ filter: "contrast(1.1) brightness(1.05)" }}
          />
        </motion.div>
      </div>
    </section>
  )
}
