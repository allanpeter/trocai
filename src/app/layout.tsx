import type { Metadata } from 'next'
import Script from 'next/script'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const SITE_URL = 'https://www.trocai.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'trocai.app — Troca figurinhas da Copa 2026',
    template: '%s | trocai.app',
  },
  description: 'Cadastra teu álbum, marca o que tu tem e o que falta. A gente encontra quem mora perto e tem o que tu precisa. Grátis.',
  keywords: ['figurinhas', 'copa do mundo 2026', 'troca figurinhas', 'álbum copa', 'figurinha repetida', 'colecionadores'],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE_URL,
    siteName: 'trocai.app',
    title: 'trocai.app — Bora trocar figurinhas?',
    description: 'Encontra quem mora perto e tem as figurinhas que você precisa. Copa do Mundo 2026.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'trocai.app' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'trocai.app — Bora trocar figurinhas?',
    description: 'Encontra quem mora perto e tem as figurinhas que você precisa.',
    images: ['/og-image.png'],
  },
  alternates: { canonical: SITE_URL },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID
  return (
    <html lang="pt-BR">
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
