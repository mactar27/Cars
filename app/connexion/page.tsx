import Link from "next/link"
import Image from "next/image"
import { AuthForm } from "@/components/auth-form"

export const metadata = {
  title: "Connexion — MAISON AUTO",
  description: "Connectez-vous à votre espace MAISON AUTO.",
}

export default function ConnexionPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/cars/hero-car.png"
          alt="Véhicule premium MAISON AUTO"
          fill
          className="object-contain p-16"
          priority
        />
        <Link
          href="/"
          className="absolute left-10 top-10 flex items-center gap-2"
        >
          <Image src="/logo.png" alt="Maison Auto" width={150} height={50} className="h-12 w-auto object-contain scale-[1.8] origin-left" />
        </Link>
        <p className="absolute bottom-10 left-10 max-w-xs text-sm text-muted-foreground">
          La sélection automobile premium, en vente comme en location.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-12">
        <Link href="/" className="mb-10 flex items-center gap-2 lg:hidden">
          <Image src="/logo.png" alt="Maison Auto" width={150} height={50} className="h-12 w-auto object-contain scale-[1.8] origin-left" />
        </Link>
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Bienvenue
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Accédez à votre espace personnel ou à l&apos;administration.
          </p>
        </div>
        <div className="mt-8 flex w-full justify-center">
          <AuthForm />
        </div>
      </div>
    </div>
  )
}
