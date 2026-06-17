import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteHeader, SiteFooter } from '@/components/site-chrome'
import { ARTICLES, getArticle, getRelated } from '../_data/articles'

const SITE = 'https://www.trocai.app'

export function generateStaticParams() {
  return ARTICLES.map(a => ({ slug: a.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) return {}

  const url = `${SITE}/blog/${article.slug}`
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      url,
      publishedTime: article.publishedAt,
    },
  }
}

export default async function ArticlePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  const related = getRelated(slug)
  const url = `${SITE}/blog/${article.slug}`

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: { '@type': 'Organization', name: 'trocai', url: SITE },
    publisher: {
      '@type': 'Organization',
      name: 'trocai',
      url: SITE,
      logo: { '@type': 'ImageObject', url: `${SITE}/logo/trocai-logo.svg` },
    },
    mainEntityOfPage: url,
    url,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog` },
      { '@type': 'ListItem', position: 3, name: article.title, item: url },
    ],
  }

  const publishedLabel = new Date(article.publishedAt).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-cream-100 text-ink-800 font-body">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SiteHeader />

      <main className="max-w-[760px] mx-auto px-6 md:px-8 py-16">
        {/* Breadcrumb */}
        <nav className="text-xs text-ink-400 mb-8">
          <Link href="/" className="hover:text-ink-700 transition-colors">trocai</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-ink-700 transition-colors">Blog</Link>
        </nav>

        {/* Header */}
        <p className="text-xs font-bold tracking-[0.08em] uppercase text-green-600 mb-3">
          {article.category} · {article.readingMinutes} min de leitura
        </p>
        <h1 className="font-display font-extrabold text-[clamp(30px,5vw,52px)] leading-[1.06] tracking-tight mb-4">
          {article.title}
        </h1>
        <p className="text-lg text-ink-500 leading-relaxed mb-4">{article.description}</p>
        <p className="text-xs text-ink-400 mb-10">Publicado em {publishedLabel}</p>

        {/* Índice */}
        <nav className="bg-white border border-[#E7DDC4] rounded-2xl p-6 mb-12 shadow-[var(--sh-1)]">
          <p className="text-xs font-bold tracking-[0.08em] uppercase text-ink-400 mb-3">Neste artigo</p>
          <ol className="flex flex-col gap-2">
            {article.sections.map(s => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-sm text-green-700 hover:text-green-900 hover:underline transition-colors"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Conteúdo */}
        <article className="flex flex-col gap-12">
          {article.sections.map(s => (
            <section key={s.id} id={s.id} className="scroll-mt-20">
              <h2 className="font-display font-bold text-2xl tracking-tight text-ink-800 mb-4">
                {s.title}
              </h2>
              <div className="flex flex-col gap-4">
                {s.content.map((p, i) => (
                  <p key={i} className="text-[16px] text-ink-600 leading-relaxed">{p}</p>
                ))}
              </div>
            </section>
          ))}
        </article>

        {/* CTA */}
        <div className="mt-16 bg-green-500 text-white rounded-3xl p-10 text-center">
          <h2 className="font-display font-extrabold text-[28px] tracking-tight mb-3">
            Pronto para trocar?
          </h2>
          <p className="text-base opacity-90 mb-6 max-w-[420px] mx-auto">
            Cadastra teu álbum gratuitamente e encontra colecionadores na tua cidade em minutos.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-green-700 font-bold rounded-[14px] text-base hover:bg-cream-100 transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
          >
            Criar conta — é grátis
          </Link>
        </div>

        {/* Relacionados */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display font-bold text-2xl tracking-tight mb-6">Continue lendo</h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {related.map(r => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="flex flex-col bg-white border border-[#E7DDC4] rounded-2xl p-5 shadow-[var(--sh-1)] hover:shadow-[var(--sh-3)] hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span className="text-[11px] font-bold tracking-[0.08em] uppercase text-green-600 mb-2">
                    {r.category}
                  </span>
                  <h3 className="font-display font-bold text-base leading-snug">{r.title}</h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
