import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Como o trocai.app usa cookies e tecnologias similares.',
}

const UPDATED = '17 de maio de 2026'
const CONTACT = 'allanpeter565@gmail.com'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-display font-bold text-2xl tracking-tight text-ink-800 mb-4">{title}</h2>
      <div className="text-ink-500 leading-relaxed flex flex-col gap-3">{children}</div>
    </section>
  )
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-cream-100 text-ink-800 font-body">
      <header className="sticky top-0 z-20 bg-cream-100/85 backdrop-blur-md border-b border-[#E7DDC4]">
        <div className="max-w-[1180px] mx-auto px-8 h-[60px] flex items-center gap-8">
          <Link href="/" className="shrink-0">
            <Image src="/logo/trocai-logo.svg" width={160} height={48} alt="trocai.app" priority />
          </Link>
        </div>
      </header>

      <main className="max-w-[760px] mx-auto px-8 py-16">
        <p className="text-xs font-bold tracking-[0.08em] uppercase text-green-600 mb-2">Legal</p>
        <h1 className="font-display font-extrabold text-[clamp(36px,5vw,60px)] leading-[1.05] tracking-tight mb-4">
          Política de Cookies
        </h1>
        <p className="text-sm text-ink-400 mb-12">Última atualização: {UPDATED}</p>

        <Section title="1. O que são cookies">
          <p>
            Cookies são pequenos arquivos de texto armazenados no seu navegador quando você visita um site.
            Eles permitem que o site reconheça seu dispositivo em visitas futuras e funcionem como uma memória
            de curto prazo para manter sua sessão ativa e personalizar sua experiência.
          </p>
        </Section>

        <Section title="2. Cookies que usamos">
          <p>O trocai.app utiliza dois tipos de cookies:</p>

          <div className="bg-white border border-[#E7DDC4] rounded-[14px] p-5 flex flex-col gap-2">
            <p className="font-semibold text-ink-700">Cookies essenciais</p>
            <p>Necessários para o funcionamento do serviço. Sem eles, o login não funciona e você não consegue
            acessar sua conta. Não podem ser desativados.</p>
            <p className="text-xs text-ink-300">Exemplos: token de sessão do Supabase, preferências de autenticação.</p>
          </div>

          <div className="bg-white border border-[#E7DDC4] rounded-[14px] p-5 flex flex-col gap-2">
            <p className="font-semibold text-ink-700">Cookies de publicidade</p>
            <p>
              Usados pelo <strong>Google AdSense</strong> para exibir anúncios relevantes com base nas suas
              preferências e histórico de navegação. Esses cookies podem rastrear sua atividade em outros sites.
            </p>
            <p className="text-xs text-ink-300">Fornecedor: Google LLC. Você pode gerenciá-los pelas configurações abaixo.</p>
          </div>
        </Section>

        <Section title="3. Cookies de terceiros">
          <p>
            O Google AdSense pode instalar cookies de terceiros para personalizar os anúncios exibidos.
            Esses cookies são gerenciados pelo Google e estão sujeitos à{' '}
            <a href="https://policies.google.com/privacy" className="text-green-600 underline" target="_blank" rel="noopener noreferrer">
              Política de Privacidade do Google
            </a>.
          </p>
        </Section>

        <Section title="4. Como gerenciar seus cookies">
          <p>Você tem várias opções para controlar o uso de cookies:</p>
          <ul className="list-disc list-inside flex flex-col gap-2 pl-2">
            <li>
              <strong>Configurações do navegador:</strong> a maioria dos navegadores permite bloquear ou excluir
              cookies nas configurações de privacidade.
            </li>
            <li>
              <strong>Publicidade personalizada do Google:</strong> acesse{' '}
              <a href="https://adssettings.google.com" className="text-green-600 underline" target="_blank" rel="noopener noreferrer">
                adssettings.google.com
              </a>{' '}
              para ajustar suas preferências.
            </li>
            <li>
              <strong>Opt-out de redes de anúncios:</strong> acesse{' '}
              <a href="https://optout.aboutads.info" className="text-green-600 underline" target="_blank" rel="noopener noreferrer">
                optout.aboutads.info
              </a>{' '}
              para se descadastrar da publicidade baseada em interesse.
            </li>
          </ul>
          <p>
            Desativar cookies essenciais impede o funcionamento do login. Desativar cookies de publicidade
            não afeta o uso do app, mas os anúncios exibidos serão menos relevantes.
          </p>
        </Section>

        <Section title="5. Alterações nesta política">
          <p>
            Podemos atualizar esta política periodicamente. A data de atualização no topo desta página sempre
            reflete a versão vigente.
          </p>
        </Section>

        <Section title="6. Mais informações">
          <p>
            Para mais detalhes sobre como tratamos seus dados pessoais, consulte nossa{' '}
            <Link href="/privacidade" className="text-green-600 underline">Política de Privacidade</Link>.
            Dúvidas:{' '}
            <a href={`mailto:${CONTACT}`} className="text-green-600 underline">{CONTACT}</a>.
          </p>
        </Section>
      </main>

      <footer className="bg-ink-900 text-cream-200 px-8 py-8 mt-8">
        <div className="max-w-[1180px] mx-auto flex flex-col sm:flex-row justify-between gap-2 text-xs text-ink-300">
          <span>© 2026 trocai.app — feito no Brasil</span>
          <Link href="/" className="hover:text-white transition-colors">Voltar ao início</Link>
        </div>
      </footer>
    </div>
  )
}
