import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader, SiteFooter } from '@/components/site-chrome'
import { ARTICLES } from './_data/articles'

export const metadata: Metadata = {
  title: 'Blog — dicas e guias para colecionadores da Copa 2026',
  description:
    'Artigos sobre figurinhas da Copa do Mundo 2026: quanto custa completar o álbum, figurinhas raras e douradas, como trocar com segurança e identificar falsas.',
  alternates: { canonical: 'https://www.trocai.app/blog' },
  openGraph: {
    title: 'Blog trocai — dicas para colecionadores da Copa 2026',
    description:
      'Guias práticos sobre completar o álbum, trocar figurinhas e colecionar com segurança.',
    type: 'website',
  },
}

const SITE = 'https://www.trocai.app'

const sortedArticles = [...ARTICLES].sort(
  (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)
)

const blogSchema = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Blog trocai',
  url: `${SITE}/blog`,
  description:
    'Dicas e guias para colecionadores de figurinhas da Copa do Mundo 2026.',
  blogPost: sortedArticles.map(a => ({
    '@type': 'BlogPosting',
    headline: a.title,
    description: a.description,
    datePublished: a.publishedAt,
    url: `${SITE}/blog/${a.slug}`,
    author: { '@type': 'Organization', name: 'trocai' },
  })),
}

export default function BlogIndexPage() {
  const [featured, ...rest] = sortedArticles

  return (
    <div className="min-h-screen bg-cream-100 text-ink-800 font-body">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <SiteHeader />

      <main className="max-w-[1100px] mx-auto px-6 md:px-8 py-16">
        <nav className="text-xs text-ink-400 mb-8">
          <Link href="/" className="hover:text-ink-700 transition-colors">trocai</Link>
          <span className="mx-2">/</span>
          <span>Blog</span>
        </nav>

        <p className="text-xs font-bold tracking-[0.08em] uppercase text-green-600 mb-2">Blog</p>
        <h1 className="font-display font-extrabold text-[clamp(36px,5vw,60px)] leading-[1.05] tracking-tight mb-4">
          Dicas e guias para colecionadores
        </h1>
        <p className="text-lg text-ink-500 leading-relaxed mb-12 max-w-[620px]">
          Tudo o que você precisa para completar o álbum da Copa 2026 gastando menos:
          como funcionam as trocas, quais figurinhas são raras e como colecionar com segurança.
        </p>

        {/* Destaque */}
        <Link
          href={`/blog/${featured.slug}`}
          className="block bg-white border border-[#E7DDC4] rounded-3xl p-8 md:p-10 shadow-[var(--sh-1)] hover:shadow-[var(--sh-3)] hover:-translate-y-0.5 transition-all duration-200 mb-10"
        >
          <span className="text-xs font-bold tracking-[0.08em] uppercase text-green-600">
            {featured.category} · {featured.readingMinutes} min de leitura
          </span>
          <h2 className="font-display font-extrabold text-[clamp(24px,3vw,36px)] tracking-tight mt-3 mb-3 leading-tight">
            {featured.title}
          </h2>
          <p className="text-ink-500 leading-relaxed max-w-[640px]">{featured.excerpt}</p>
          <span className="inline-flex items-center gap-1 mt-5 text-green-700 font-semibold text-sm">
            Ler artigo →
          </span>
        </Link>

        {/* Grade */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map(a => (
            <Link
              key={a.slug}
              href={`/blog/${a.slug}`}
              className="flex flex-col bg-white border border-[#E7DDC4] rounded-2xl p-6 shadow-[var(--sh-1)] hover:shadow-[var(--sh-3)] hover:-translate-y-0.5 transition-all duration-200"
            >
              <span className="text-xs font-bold tracking-[0.08em] uppercase text-green-600 mb-2">
                {a.category} · {a.readingMinutes} min
              </span>
              <h3 className="font-display font-bold text-xl tracking-tight leading-snug mb-2">
                {a.title}
              </h3>
              <p className="text-sm text-ink-500 leading-relaxed">{a.excerpt}</p>
              <span className="mt-auto pt-4 text-green-700 font-semibold text-sm">Ler →</span>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-green-500 text-white rounded-3xl p-10 text-center">
          <h2 className="font-display font-extrabold text-[clamp(24px,3vw,32px)] tracking-tight mb-3">
            Bora completar teu álbum?
          </h2>
          <p className="text-base opacity-90 mb-6 max-w-[420px] mx-auto">
            Cadastra teu álbum de graça e encontra colecionadores na tua cidade que têm o que falta pra ti.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-green-700 font-bold rounded-[14px] text-base hover:bg-cream-100 transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
          >
            Criar conta — é grátis
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
