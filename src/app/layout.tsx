import type { Metadata } from 'next'
import Script from 'next/script'
import { Bricolage_Grotesque, DM_Sans, JetBrains_Mono } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const SITE_URL = 'https://www.trocai.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'trocai — Troca figurinhas da Copa 2026',
    template: '%s | trocai',
  },
  description: 'Cadastra teu álbum, marca o que tu tem e o que falta. A gente encontra quem mora perto e tem o que tu precisa. Grátis.',
  keywords: ['figurinhas', 'copa do mundo 2026', 'troca figurinhas', 'álbum copa', 'figurinha repetida', 'colecionadores'],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE_URL,
    siteName: 'trocai',
    title: 'trocai — Bora trocar figurinhas?',
    description: 'Encontra quem mora perto e tem as figurinhas que você precisa. Copa do Mundo 2026.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'trocai' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'trocai — Bora trocar figurinhas?',
    description: 'Encontra quem mora perto e tem as figurinhas que você precisa.',
    images: ['/og-image.png'],
  },
  alternates: { canonical: SITE_URL },
  icons: {
    icon: [
      { url: '/logo/trocai-mark.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
    apple: '/logo/trocai-mark.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID
  return (
    <html lang="pt-BR" className={`${bricolage.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        {children}
        <Toaster richColors position="top-right" />
        {adsenseId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        )}
      </body>
    </html>
  )
}
