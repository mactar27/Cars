import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import './globals.css'
import { SplashScreen } from '@/components/splash-screen'
import { PwaRegistrar } from '@/components/pwa-registrar'
import type { Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: '#000000',
}

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'MAISON AUTO — Vente & Location de véhicules',
  description:
    'Plateforme premium de vente et location de véhicules. Citadines, berlines, SUV et utilitaires sélectionnés avec soin.',
  generator: 'v0.app',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased">
        <PwaRegistrar />
        <SplashScreen />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
