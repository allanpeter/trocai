import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Sobre trocai',
  description: 'Conheça a história do trocai, a plataforma que conecta colecionadores de figurinhas da Copa do Mundo 2026.',
  openGraph: {
    title: 'Sobre trocai',
    description: 'Conheça a história do trocai',
  },
  alternates: {
    canonical: 'https://www.trocai.app/about',
  },
}

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'trocai',
  url: 'https://www.trocai.app',
  logo: 'https://www.trocai.app/logo/trocai-logo.svg',
  description: 'Plataforma gratuita que conecta colecionadores de figurinhas da Copa do Mundo 2026.',
  foundingDate: '2024',
  areaServed: 'BR',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Support',
    email: 'contato@trocai.app',
  },
  sameAs: [
    'https://discord.gg/trocai',
  ],
}

export default async function AboutPage() {
  const supabase = await createClient()

  const [
    { count: usersCount },
    { data: profileStats },
  ] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('trades_count').gt('trades_count', 0),
  ])

  const totalUsers = usersCount ?? 0
  const totalTrades = (profileStats ?? []).reduce((s, p) => s + (p.trades_count ?? 0), 0)

  return (
    <div className="min-h-screen bg-cream-100 text-ink-800 font-body">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-cream-100/85 backdrop-blur-md border-b border-[#E7DDC4]">
        <div className="max-w-[1180px] mx-auto px-4 md:px-8 h-[60px] flex items-center gap-8">
          <Link href="/" className="shrink-0 font-display font-bold text-lg">
            trocai
          </Link>
          <nav className="hidden md:flex items-center gap-6 ml-6">
            <Link href="/" className="text-sm font-medium text-ink-700 hover:text-green-600 transition-colors">Início</Link>
            <Link href="/guia" className="text-sm font-medium text-ink-700 hover:text-green-600 transition-colors">Guia</Link>
            <Link href="/blog" className="text-sm font-medium text-ink-700 hover:text-green-600 transition-colors">Blog</Link>
            <Link href="/faq" className="text-sm font-medium text-ink-700 hover:text-green-600 transition-colors">FAQ</Link>
          </nav>
          <div className="ml-auto">
            <Link href="/login" className="text-sm font-semibold px-4 py-2 rounded-[10px] text-ink-700 hover:bg-cream-200 transition-colors">
              Entrar
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="max-w-[1180px] mx-auto px-8 py-24">
        <div className="max-w-[760px]">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.08em] uppercase text-green-600 bg-green-50 px-3 py-1 rounded-full mb-4">
            Nossa história
          </span>
          <h1 className="font-display font-extrabold text-[clamp(48px,7vw,64px)] leading-[1.02] tracking-[-0.025em] mb-6">
            A gente nasceu para conectar colecionadores
          </h1>
          <p className="text-[19px] text-ink-500 leading-relaxed max-w-[600px]">
            trocai existe porque colecionar figurinhas é mais divertido quando você tem alguém para trocar. Criamos uma plataforma simples que cruza tuas necessidades com as de pessoas próximas a você.
          </p>
        </div>
      </section>

      {/* ── Mission/Vision/Values ──────────────────────────────────────── */}
      <section className="max-w-[1180px] mx-auto px-8 py-20 grid md:grid-cols-3 gap-8 mb-12">
        <div>
          <h3 className="font-display font-bold text-2xl mb-4 text-green-600">Missão</h3>
          <p className="text-ink-500 leading-relaxed">
            Conectar colecionadores de figurinhas, eliminando a frustração de procurar peças raras e aproximando pessoas através de um hobby compartilhado.
          </p>
        </div>
        <div>
          <h3 className="font-display font-bold text-2xl mb-4 text-green-600">Visão</h3>
          <p className="text-ink-500 leading-relaxed">
            Ser a plataforma número um para colecionadores brasileiros, onde cada figurinha te conecta com novos amigos e oportunidades.
          </p>
        </div>
        <div>
          <h3 className="font-display font-bold text-2xl mb-4 text-green-600">Valores</h3>
          <p className="text-ink-500 leading-relaxed">
            Transparência, segurança, simplicidade e comunidade. Você merece confiar em quem usa, e nós nos comprometemos com isso.
          </p>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      {(totalUsers > 0 || totalTrades > 0) && (
        <section className="max-w-[1180px] mx-auto px-8 py-20 mb-12">
          <h2 className="font-display font-bold text-[clamp(32px,4.5vw,56px)] tracking-tight leading-[1.08] mb-12 text-center">
            Já conectamos
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-[18px] p-12 shadow-[var(--sh-1)] border border-[#E7DDC4] text-center">
              <div className="font-display font-extrabold text-[56px] text-green-600 mb-2">
                {totalUsers.toLocaleString('pt-BR')}
              </div>
              <p className="text-lg text-ink-500">colecionadores cadastrados</p>
            </div>
            <div className="bg-white rounded-[18px] p-12 shadow-[var(--sh-1)] border border-[#E7DDC4] text-center">
              <div className="font-display font-extrabold text-[56px] text-gold-400 mb-2">
                {totalTrades.toLocaleString('pt-BR')}
              </div>
              <p className="text-lg text-ink-500">trocas realizadas</p>
            </div>
          </div>
        </section>
      )}

      {/* ── How It Started ────────────────────────────────────────────── */}
      <section className="max-w-[1180px] mx-auto px-8 py-20">
        <h2 className="font-display font-bold text-[clamp(32px,4.5vw,56px)] tracking-tight leading-[1.08] mb-8">
          Como começou
        </h2>
        <div className="bg-white rounded-[18px] p-8 md:p-12 shadow-[var(--sh-1)] border border-[#E7DDC4] max-w-[760px]">
          <p className="text-ink-500 text-lg leading-relaxed mb-6">
            A ideia nasceu da frustração pessoal. O álbum da Copa 2026 saiu, as figurinhas estavam nas prateleiras das lojas, mas encontrar aquela peça específica que faltava era quase impossível.
          </p>
          <p className="text-ink-500 text-lg leading-relaxed mb-6">
            Percebemos que o problema real não era a disponibilidade de figurinhas — era a falta de um jeito fácil de conectar pessoas que tinha aquilo que você precisava.
          </p>
          <p className="text-ink-500 text-lg leading-relaxed">
            Assim nasceu trocai. Uma plataforma simples, gratuita, que respeita sua privacidade e facilita o encontro entre colecionadores próximos a você.
          </p>
        </div>
      </section>

      {/* ── Trust/Safety ──────────────────────────────────────────────── */}
      <section className="max-w-[1180px] mx-auto px-8 py-20">
        <h2 className="font-display font-bold text-[clamp(32px,4.5vw,56px)] tracking-tight leading-[1.08] mb-8">
          Segurança e confiança
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-[18px] p-8 shadow-[var(--sh-1)] border border-[#E7DDC4]">
            <h3 className="font-display font-bold text-2xl mb-4">Avaliações e histórico</h3>
            <p className="text-ink-500 leading-relaxed">
              Todo colecionador tem um perfil com histórico de trocas e avaliações de outros usuários. Você sabe com quem está negociando.
            </p>
          </div>
          <div className="bg-white rounded-[18px] p-8 shadow-[var(--sh-1)] border border-[#E7DDC4]">
            <h3 className="font-display font-bold text-2xl mb-4">Encontros em locais públicos</h3>
            <p className="text-ink-500 leading-relaxed">
              Sugerimos sempre fazer os primeiros encontros em locais públicos (escolas, praças, cafés). A troca é entre vocês — a gente só conecta.
            </p>
          </div>
          <div className="bg-white rounded-[18px] p-8 shadow-[var(--sh-1)] border border-[#E7DDC4]">
            <h3 className="font-display font-bold text-2xl mb-4">Dados privados</h3>
            <p className="text-ink-500 leading-relaxed">
              Seus dados pessoais são seus. Nunca compartilhamos sem consentimento. Leia nossa política de privacidade para saber mais.
            </p>
          </div>
          <div className="bg-white rounded-[18px] p-8 shadow-[var(--sh-1)] border border-[#E7DDC4]">
            <h3 className="font-display font-bold text-2xl mb-4">Suporte rápido</h3>
            <p className="text-ink-500 leading-relaxed">
              Encontrou um problema? Queremos saber. Entre em contato pelo feedback in-app ou por email — respondemos rápido.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className="max-w-[1180px] mx-auto px-8 py-20 text-center">
        <h2 className="font-display font-bold text-[clamp(32px,4.5vw,56px)] tracking-tight leading-[1.08] mb-8">
          Pronto para começar?
        </h2>
        <p className="text-lg text-ink-500 mb-8 max-w-[600px] mx-auto">
          Cadastre seu álbum e encontre pessoas próximas que têm as figurinhas que você precisa.
        </p>
        <Link
          href="/signup"
          className="inline-block font-semibold text-base px-6 py-3.5 rounded-[14px] bg-green-500 text-white shadow-[var(--sh-3)] hover:bg-green-600 hover:-translate-y-0.5 transition-all duration-200"
        >
          Bora trocar
        </Link>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#E7DDC4] bg-white mt-20">
        <div className="max-w-[1180px] mx-auto px-8 py-12 grid md:grid-cols-4 gap-8 text-sm text-ink-500">
          <div>
            <p className="font-display font-bold text-ink-800 mb-2">trocai</p>
            <p>Conectando colecionadores desde 2024.</p>
          </div>
          <div>
            <p className="font-semibold text-ink-800 mb-2">Links</p>
            <div className="flex flex-col gap-1">
              <Link href="/" className="hover:text-green-600">Início</Link>
              <Link href="/about" className="hover:text-green-600">Sobre</Link>
              <Link href="/faq" className="hover:text-green-600">FAQ</Link>
              <Link href="/guia" className="hover:text-green-600">Guia</Link>
            </div>
          </div>
          <div>
            <p className="font-semibold text-ink-800 mb-2">Legal</p>
            <div className="flex flex-col gap-1">
              <Link href="/privacidade" className="hover:text-green-600">Privacidade</Link>
              <Link href="/termos" className="hover:text-green-600">Termos</Link>
              <Link href="/cookies" className="hover:text-green-600">Cookies</Link>
            </div>
          </div>
          <div>
            <p className="font-semibold text-ink-800 mb-2">Contato</p>
            <div className="flex flex-col gap-1">
              <a href="mailto:contato@trocai.app" className="hover:text-green-600">contato@trocai.app</a>
              <a href="https://discord.gg/trocai" className="hover:text-green-600" target="_blank" rel="noopener noreferrer">Discord</a>
            </div>
          </div>
        </div>
        <div className="max-w-[1180px] mx-auto px-8 py-6 border-t border-[#E7DDC4] text-center text-xs text-ink-400">
          <p>© 2024 trocai. Feito com ❤️ para colecionadores.</p>
        </div>
      </footer>
    </div>
  )
}
