"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import type { Vehicle, ServiceType } from "@/lib/types"
import { formatEUR } from "@/lib/format"

export function VehicleCard({ vehicle, serviceFilter = "all" }: { vehicle: Vehicle; serviceFilter?: ServiceType | "all" }) {
  const hasRental = vehicle.services.includes("location")
  const hasSale = vehicle.services.includes("vente")

  const showRentalPrice = hasRental && (serviceFilter === "all" || serviceFilter === "location")
  const showSalePrice = hasSale && (serviceFilter === "all" || serviceFilter === "vente")

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/vehicules/${vehicle.slug}`}
        className="group flex flex-col block w-full"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted/50 border border-border/50">
          <Image
            src={vehicle.image || "/placeholder.svg"}
            alt={`${vehicle.brand} ${vehicle.model}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-contain p-4 transition-all duration-700 ease-out group-hover:scale-110 group-hover:-translate-y-2"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          
          <div className="absolute left-4 top-4 flex gap-2">
            {hasRental && (
              <span className="rounded-full bg-background/80 px-3 py-1 text-[11px] font-medium tracking-wide text-foreground backdrop-blur-md shadow-sm border border-border/50 transition-colors group-hover:bg-background">
                Location
              </span>
            )}
            {hasSale && (
              <span className="rounded-full bg-foreground/90 px-3 py-1 text-[11px] font-medium tracking-wide text-background backdrop-blur-md shadow-sm transition-colors group-hover:bg-foreground">
                Vente
              </span>
            )}
          </div>
        </div>

        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-foreground/80">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{vehicle.tagline}</p>
          </div>
          <div className="shrink-0 text-right">
            {showRentalPrice && vehicle.rental && (
              <p className="text-sm font-medium text-foreground">
                {formatEUR(vehicle.rental.pricePerDay)}
                <span className="text-xs text-muted-foreground font-normal">/j</span>
              </p>
            )}
            {showSalePrice && vehicle.sale && (
              <p className="text-sm text-muted-foreground">
                dès <span className="font-medium text-foreground">{formatEUR(vehicle.sale.price)}</span>
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
