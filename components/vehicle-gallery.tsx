"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function VehicleGallery({
  images,
  alt,
}: {
  images: string[]
  alt: string
}) {
  const [active, setActive] = useState(0)
  const total = images.length

  const go = (next: number) => setActive((next + total) % total)

  return (
    <div>
      <div className="group relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
        {images.map((src, i) => (
          <Image
            key={src}
            src={src || "/placeholder.svg"}
            alt={`${alt} — vue ${i + 1}`}
            fill
            priority={i === 0}
            sizes="(max-width: 1024px) 100vw, 60vw"
            className={cn(
              "object-contain p-8 transition-opacity duration-500 ease-out",
              i === active ? "opacity-100" : "opacity-0",
            )}
          />
        ))}

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(active - 1)}
              aria-label="Image précédente"
              className="absolute left-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 shadow-sm backdrop-blur transition-opacity duration-300 hover:bg-background group-hover:opacity-100"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(active + 1)}
              aria-label="Image suivante"
              className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 shadow-sm backdrop-blur transition-opacity duration-300 hover:bg-background group-hover:opacity-100"
            >
              <ChevronRight className="size-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Aller à l'image ${i + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === active ? "w-6 bg-foreground" : "w-1.5 bg-foreground/30",
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Vue ${i + 1}`}
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-xl bg-muted transition-all duration-300",
                i === active
                  ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                  : "opacity-70 hover:opacity-100",
              )}
            >
              <Image
                src={src || "/placeholder.svg"}
                alt={`${alt} — miniature ${i + 1}`}
                fill
                sizes="20vw"
                className="object-contain p-2"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
