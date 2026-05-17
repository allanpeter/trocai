import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Entre em contato com a equipe do trocai.',
}

const CONTACT = 'allanpeter565@gmail.com'

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-cream-100 text-ink-800 font-body">
      <header className="sticky top-0 z-20 bg-cream-100/85 backdrop-blur-md border-b border-[#E7DDC4]">
        <div className="max-w-[1180px] mx-auto px-8 h-[60px] flex items-center gap-8">
          <Link href="/" className="shrink-0">
            <Image src="/logo/trocai-logo.svg" width={160} height={48} alt="trocai" priority />
          </Link>
        </div>
      </header>

      <main className="max-w-[760px] mx-auto px-8 py-16">
        <p className="text-xs font-bold tracking-[0.08em] uppercase text-green-600 mb-2">Fale com a gente</p>
        <h1 className="font-display font-extrabold text-[clamp(36px,5vw,60px)] leading-[1.05] tracking-tight mb-4">
          Contato
        </h1>
        <p className="text-lg text-ink-500 mb-12 max-w-[520px]">
          Tem uma dúvida, sugestão ou encontrou algum problema? A gente lê tudo e responde.
        </p>

        <div className="flex flex-col gap-4">
          {/* In-app feedback */}
          <div className="bg-green-50 border border-green-200 rounded-[18px] p-7 flex flex-col gap-2 shadow-[var(--sh-1)]">
            <p className="text-xs font-bold tracking-[0.08em] uppercase text-green-600">Dentro do app</p>
            <p className="font-display font-bold text-2xl text-ink-800">Botão Feedback</p>
            <p className="text-sm text-ink-500">
              Se você está logado, o jeito mais rápido é usar o botão <strong>Feedback</strong> na barra lateral (desktop) ou no menu inferior (celular). Você pode reportar bugs, enviar sugestões e pedir melhorias diretamente por lá.
            </p>
          </div>

          {/* Email */}
          <div className="bg-white border border-[#E7DDC4] rounded-[18px] p-7 flex flex-col gap-2 shadow-[var(--sh-1)]">
            <p className="text-xs font-bold tracking-[0.08em] uppercase text-ink-400">E-mail</p>
            <a
              href={`mailto:${CONTACT}`}
              className="font-display font-bold text-2xl text-green-600 hover:text-green-700 transition-colors"
            >
              {CONTACT}
            </a>
            <p className="text-sm text-ink-400">Respondemos em até 2 dias úteis.</p>
          </div>

          {/* Discord */}
          <div className="bg-white border border-[#E7DDC4] rounded-[18px] p-7 flex flex-col gap-2 shadow-[var(--sh-1)]">
            <p className="text-xs font-bold tracking-[0.08em] uppercase text-ink-400">Comunidade</p>
            <a
              href="https://discord.gg/uTB2MBEk"
              target="_blank"
              rel="noopener noreferrer"
              className="font-display font-bold text-2xl text-green-600 hover:text-green-700 transition-colors"
            >
              Discord trocai
            </a>
            <p className="text-sm text-ink-400">
              Para sugestões, bugs e papo sobre figurinha — a resposta costuma ser mais rápida por lá.
            </p>
          </div>

          {/* Legal */}
          <div className="bg-cream-200 rounded-[18px] p-6 flex flex-col gap-3">
            <p className="text-sm font-semibold text-ink-700">Assuntos específicos</p>
            <ul className="flex flex-col gap-2 text-sm text-ink-500">
              <li>
                Dúvidas gerais →{' '}
                <Link href="/faq" className="text-green-600 underline">Perguntas frequentes</Link>
              </li>
              <li>
                Privacidade e LGPD →{' '}
                <Link href="/privacidade" className="text-green-600 underline">Política de Privacidade</Link>
              </li>
              <li>
                Cookies →{' '}
                <Link href="/cookies" className="text-green-600 underline">Política de Cookies</Link>
              </li>
              <li>
                Termos e condições →{' '}
                <Link href="/termos" className="text-green-600 underline">Termos de Uso</Link>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="bg-ink-900 text-cream-200 px-8 py-8 mt-8">
        <div className="max-w-[1180px] mx-auto flex flex-col sm:flex-row justify-between gap-2 text-xs text-ink-300">
          <span>© 2026 trocai — feito no Brasil</span>
          <Link href="/" className="hover:text-white transition-colors">Voltar ao início</Link>
        </div>
      </footer>
    </div>
  )
}
