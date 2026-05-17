import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Como o trocai coleta, usa e protege seus dados pessoais.',
}

const UPDATED = '13 de maio de 2026'
const CONTACT = 'allanpeter565@gmail.com'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-display font-bold text-2xl tracking-tight text-ink-800 mb-4">{title}</h2>
      <div className="text-ink-500 leading-relaxed flex flex-col gap-3">{children}</div>
    </section>
  )
}

export default function PrivacidadePage() {
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
        <p className="text-xs font-bold tracking-[0.08em] uppercase text-green-600 mb-2">Legal</p>
        <h1 className="font-display font-extrabold text-[clamp(36px,5vw,60px)] leading-[1.05] tracking-tight mb-4">
          Política de Privacidade
        </h1>
        <p className="text-sm text-ink-400 mb-12">Última atualização: {UPDATED}</p>

        <Section title="1. Quem somos">
          <p>
            O <strong>trocai</strong> é um serviço brasileiro de troca de figurinhas da Copa do Mundo 2026,
            operado por pessoa física com sede no Brasil. Para dúvidas, entre em contato pelo e-mail{' '}
            <a href={`mailto:${CONTACT}`} className="text-green-600 underline">{CONTACT}</a>.
          </p>
        </Section>

        <Section title="2. Dados que coletamos">
          <p>Coletamos apenas o necessário para o funcionamento do serviço:</p>
          <ul className="list-disc list-inside flex flex-col gap-2 pl-2">
            <li><strong>Dados de conta:</strong> nome e e-mail fornecidos pelo login via Google.</li>
            <li><strong>Dados de perfil:</strong> nome de usuário, cidade/estado e foto de perfil (opcionais, informados por você).</li>
            <li><strong>Dados do álbum:</strong> quais figurinhas você marcou como tendo, faltando ou repetidas.</li>
            <li><strong>Dados de uso:</strong> páginas visitadas, interações e logs de acesso, coletados automaticamente para segurança e melhoria do serviço.</li>
            <li><strong>Cookies e tecnologias similares:</strong> utilizados para manter a sessão ativa e exibir publicidade personalizada (detalhes na seção 5).</li>
          </ul>
          <p>Não coletamos documentos de identidade, dados bancários ou localização em tempo real.</p>
        </Section>

        <Section title="3. Como usamos seus dados">
          <ul className="list-disc list-inside flex flex-col gap-2 pl-2">
            <li>Criar e manter sua conta no trocai.</li>
            <li>Encontrar outros usuários próximos com figurinhas compatíveis para troca.</li>
            <li>Enviar notificações relacionadas ao serviço (novos matches, mensagens no chat).</li>
            <li>Melhorar a plataforma por meio de análise de uso agregada e anônima.</li>
            <li>Exibir publicidade relevante por meio do Google AdSense (veja seção 5).</li>
            <li>Cumprir obrigações legais e prevenir fraudes.</li>
          </ul>
        </Section>

        <Section title="4. Compartilhamento com terceiros">
          <p>Seus dados são compartilhados apenas com os seguintes parceiros, todos indispensáveis para o funcionamento do serviço:</p>
          <ul className="list-disc list-inside flex flex-col gap-2 pl-2">
            <li>
              <strong>Supabase</strong> — banco de dados e autenticação. Armazena sua conta, álbum e mensagens.
              Saiba mais em <a href="https://supabase.com/privacy" className="text-green-600 underline" target="_blank" rel="noopener noreferrer">supabase.com/privacy</a>.
            </li>
            <li>
              <strong>Google LLC</strong> — login via Google OAuth e publicidade via AdSense.
              Saiba mais em <a href="https://policies.google.com/privacy" className="text-green-600 underline" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>.
            </li>
          </ul>
          <p>Não vendemos seus dados pessoais a terceiros.</p>
        </Section>

        <Section title="5. Publicidade e cookies">
          <p>
            Utilizamos o <strong>Google AdSense</strong> para exibir anúncios. O Google pode usar cookies para
            personalizar os anúncios com base nas suas visitas a este e a outros sites.
          </p>
          <p>
            Você pode desativar a publicidade personalizada acessando as{' '}
            <a href="https://adssettings.google.com" className="text-green-600 underline" target="_blank" rel="noopener noreferrer">
              configurações de anúncios do Google
            </a>{' '}
            ou por meio do{' '}
            <a href="https://optout.aboutads.info" className="text-green-600 underline" target="_blank" rel="noopener noreferrer">
              opt-out da Digital Advertising Alliance
            </a>.
          </p>
          <p>
            Além dos cookies de publicidade, usamos cookies essenciais para manter sua sessão autenticada. Sem eles,
            o login não funciona.
          </p>
        </Section>

        <Section title="6. Seus direitos (LGPD)">
          <p>
            Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a:
          </p>
          <ul className="list-disc list-inside flex flex-col gap-2 pl-2">
            <li>Acessar os dados pessoais que temos sobre você.</li>
            <li>Corrigir dados incompletos ou incorretos.</li>
            <li>Solicitar a exclusão dos seus dados e conta.</li>
            <li>Revogar o consentimento para tratamento de dados não essenciais.</li>
            <li>Solicitar a portabilidade dos seus dados.</li>
          </ul>
          <p>
            Para exercer qualquer um desses direitos, entre em contato pelo e-mail{' '}
            <a href={`mailto:${CONTACT}`} className="text-green-600 underline">{CONTACT}</a>.
            Respondemos em até 15 dias úteis.
          </p>
        </Section>

        <Section title="7. Retenção de dados">
          <p>
            Mantemos seus dados enquanto sua conta estiver ativa. Após a exclusão da conta, removemos seus dados
            pessoais em até 30 dias, salvo quando a retenção for exigida por lei.
          </p>
        </Section>

        <Section title="8. Segurança">
          <p>
            Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo comunicação criptografada
            (HTTPS), controle de acesso e armazenamento seguro via Supabase. Nenhum sistema é 100% inviolável;
            em caso de incidente, notificaremos os afetados conforme exigido pela LGPD.
          </p>
        </Section>

        <Section title="9. Alterações nesta política">
          <p>
            Podemos atualizar esta política periodicamente. Quando houver mudanças relevantes, notificaremos por
            e-mail ou por aviso no próprio app. A data de atualização no topo desta página sempre reflete a versão vigente.
          </p>
        </Section>

        <Section title="10. Contato">
          <p>
            Dúvidas, solicitações ou reclamações relacionadas à privacidade:{' '}
            <a href={`mailto:${CONTACT}`} className="text-green-600 underline">{CONTACT}</a>.
          </p>
        </Section>
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
