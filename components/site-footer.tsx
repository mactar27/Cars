import Link from "next/link"
import Image from "next/image"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-xs">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Maison Auto" width={150} height={50} className="h-16 w-auto object-contain" />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Vente et location de véhicules sélectionnés avec soin. L&apos;exigence
              du haut de gamme, la simplicité en plus.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <FooterColumn
              title="Véhicules"
              items={[
                { href: "/catalogue?category=citadines", label: "Citadines" },
                { href: "/catalogue?category=berlines", label: "Berlines" },
                { href: "/catalogue?category=suv", label: "SUV" },
                { href: "/catalogue?category=utilitaires", label: "Utilitaires" },
              ]}
            />
            <FooterColumn
              title="Services"
              items={[
                { href: "/catalogue?service=location", label: "Location" },
                { href: "/catalogue?service=vente", label: "Achat" },
                { href: "/connexion", label: "Espace client" },
              ]}
            />
            <FooterColumn
              title="Maison"
              items={[
                { href: "/", label: "À propos" },
                { href: "/contact", label: "Contact" },
                { href: "/", label: "Mentions légales" },
              ]}
            />
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-center border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p className="text-center sm:text-left">© {new Date().getFullYear()} Maison Auto. Tous droits réservés. <span className="hidden sm:inline">|</span> <span className="block sm:inline mt-2 sm:mt-0">Réalisé par <a href="https://wockytech.xyz" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">WockyTech</a></span></p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  items,
}: {
  title: string
  items: { href: string; label: string }[]
}) {
  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-widest text-foreground">
        {title}
      </h3>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
