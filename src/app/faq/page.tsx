import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Perguntas frequentes — trocai',
  description: 'Tire suas dúvidas sobre o trocai: como funciona, como trocar figurinhas, reportar bugs e enviar sugestões.',
  alternates: { canonical: 'https://www.trocai.app/faq' },
}

const FAQS = [
  {
    q: 'Como funciona o trocai?',
    a: 'O trocai cruza o seu álbum com o de outros colecionadores. Quando você tem uma figurinha repetida que alguém precisa — e essa pessoa tem uma que você precisa — aparece um match. É só combinar a troca no chat.',
  },
  {
    q: 'Preciso cadastrar todas as figurinhas do meu álbum?',
    a: 'Sim. Quanto mais completo for o seu álbum, mais matches o app consegue gerar. Você pode marcar figurinhas como "tenho", "preciso" ou "repetida" direto na grade do álbum.',
  },
  {
    q: 'O trocai é gratuito?',
    a: 'Totalmente. Não há plano pago, assinatura ou cobrança de nenhum tipo.',
  },
  {
    q: 'Meus dados ficam seguros?',
    a: 'Sim. Usamos Supabase com autenticação segura e não compartilhamos seus dados com terceiros. Veja nossa Política de Privacidade para mais detalhes.',
    link: { href: '/privacidade', label: 'Política de Privacidade' },
  },
  {
    q: 'Encontrei um bug — como reporto?',
    a: 'Se você estiver logado no app, clique em "Feedback" na barra lateral (desktop) ou no menu inferior (celular), selecione "Bug" e descreva o problema. Lemos todos os relatos e priorizamos as correções com base neles.',
  },
  {
    q: 'Tenho uma sugestão ou ideia de melhoria. Como envio?',
    a: 'Também pelo botão "Feedback" no app — escolha "Sugestão" ou "Melhoria". Se preferir, mande um e-mail diretamente para a gente.',
    link: { href: '/contato', label: 'Fale com a gente' },
  },
  {
    q: 'Não estou logado. Onde posso reportar um problema?',
    a: 'Manda uma mensagem para o nosso e-mail na página de contato. A resposta costuma vir em até 2 dias úteis.',
    link: { href: '/contato', label: 'Página de contato' },
  },
  {
    q: 'O app tem app nativo para iOS ou Android?',
    a: 'Ainda não. O trocai funciona pelo navegador e é otimizado para mobile. Estamos avaliando o desenvolvimento de um app nativo no futuro.',
  },
]

export default function FaqPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <div className="min-h-screen bg-cream-100 text-ink-800 font-body">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <header className="sticky top-0 z-20 bg-cream-100/85 backdrop-blur-md border-b border-[#E7DDC4]">
        <div className="max-w-[1180px] mx-auto px-8 h-[60px] flex items-center gap-8">
          <Link href="/" className="shrink-0">
            <Image src="/logo/trocai-logo.svg" width={160} height={48} alt="trocai" priority />
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-ink-500 ml-auto">
            <Link href="/contato" className="hover:text-ink-800 transition-colors">Contato</Link>
            <Link href="/login" className="hover:text-ink-800 transition-colors">Entrar</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-[760px] mx-auto px-8 py-16">
        <p className="text-xs font-bold tracking-[0.08em] uppercase text-green-600 mb-2">Dúvidas</p>
        <h1 className="font-display font-extrabold text-[clamp(36px,5vw,60px)] leading-[1.05] tracking-tight mb-4">
          Perguntas frequentes
        </h1>
        <p className="text-lg text-ink-500 mb-12 max-w-[520px]">
          Não achou o que procurava?{' '}
          <Link href="/contato" className="text-green-600 underline hover:text-green-700">
            Entre em contato
          </Link>{' '}
          e a gente responde.
        </p>

        <div className="flex flex-col gap-3">
          {FAQS.map(({ q, a, link }) => (
            <details
              key={q}
              className="group bg-white border border-[#E7DDC4] rounded-[18px] shadow-[var(--sh-1)] overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 px-7 py-5 cursor-pointer list-none font-semibold text-ink-800 hover:text-green-700 transition-colors select-none">
                {q}
                <span className="shrink-0 text-ink-300 group-open:rotate-45 transition-transform duration-200 text-xl leading-none">
                  +
                </span>
              </summary>
              <div className="px-7 pb-6 text-sm text-ink-500 leading-relaxed flex flex-col gap-2">
                <p>{a}</p>
                {link && (
                  <Link href={link.href} className="text-green-600 underline hover:text-green-700 w-fit">
                    {link.label} →
                  </Link>
                )}
              </div>
            </details>
          ))}
        </div>

        {/* Feedback CTA */}
        <div className="mt-12 bg-green-50 border border-green-200 rounded-[18px] p-8 flex flex-col gap-3">
          <p className="font-display font-bold text-xl text-ink-800">Ainda tem dúvidas?</p>
          <p className="text-sm text-ink-500">
            Se você está logado no app, use o botão <strong>Feedback</strong> na barra lateral para reportar bugs ou enviar sugestões diretamente.
            Caso contrário, mande um e-mail — lemos tudo.
          </p>
          <Link
            href="/contato"
            className="inline-flex items-center gap-2 mt-1 px-5 py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors w-fit"
          >
            Fale com a gente
          </Link>
        </div>
      </main>

      <footer className="bg-ink-900 text-cream-200 px-8 py-8 mt-8">
        <div className="max-w-[1180px] mx-auto flex flex-col sm:flex-row justify-between gap-2 text-xs text-ink-300">
          <span>© 2026 trocai — feito no Brasil</span>
          <div className="flex gap-4">
            <Link href="/privacidade" className="hover:text-white transition-colors">Privacidade</Link>
            <Link href="/termos" className="hover:text-white transition-colors">Termos</Link>
            <Link href="/contato" className="hover:text-white transition-colors">Contato</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
