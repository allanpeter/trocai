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
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'trocai — Troca figurinhas da Copa 2026',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'trocai — Bora trocar figurinhas?',
    description: 'Encontra quem mora perto e tem as figurinhas que você precisa.',
    images: '/twitter-image.png',
  },
  icons: {
    icon: [
      { url: '/logo/trocai-mark.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
    apple: '/logo/trocai-mark.svg',
  },
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'trocai',
  url: 'https://www.trocai.app',
  description: 'Plataforma gratuita de troca de figurinhas da Copa do Mundo 2026. Encontre colecionadores próximos e complete seu álbum.',
  applicationCategory: 'SocialApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' },
  inLanguage: 'pt-BR',
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'trocai',
  url: 'https://www.trocai.app',
  logo: 'https://www.trocai.app/logo/trocai-logo.svg',
  description: 'Plataforma que conecta colecionadores de figurinhas da Copa 2026.',
  areaServed: 'BR',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Support',
    email: 'contato@trocai.app',
  },
  sameAs: ['https://discord.gg/trocai'],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://www.trocai.app' },
    { '@type': 'ListItem', position: 2, name: 'Sobre', item: 'https://www.trocai.app/about' },
    { '@type': 'ListItem', position: 3, name: 'FAQ', item: 'https://www.trocai.app/faq' },
    { '@type': 'ListItem', position: 4, name: 'Guia', item: 'https://www.trocai.app/guia' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID
  return (
    <html lang="pt-BR" className={`${bricolage.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
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
