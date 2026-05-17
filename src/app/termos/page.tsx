import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Termos e condições de uso do trocai.app.',
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

export default function TermosPage() {
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
          Termos de Uso
        </h1>
        <p className="text-sm text-ink-400 mb-12">Última atualização: {UPDATED}</p>

        <Section title="1. Aceitação dos termos">
          <p>
            Ao criar uma conta ou usar o <strong>trocai.app</strong>, você concorda com estes Termos de Uso.
            Se não concordar com algum ponto, não utilize o serviço.
          </p>
        </Section>

        <Section title="2. O que é o trocai.app">
          <p>
            O trocai.app é uma plataforma gratuita que conecta colecionadores de figurinhas no Brasil para facilitar
            trocas entre pessoas próximas. Somos um intermediário — a troca em si acontece diretamente entre os usuários.
          </p>
          <p>
            Não somos responsáveis pela entrega, qualidade ou cumprimento dos acordos firmados entre os usuários.
          </p>
        </Section>

        <Section title="3. Elegibilidade">
          <p>
            Para usar o trocai.app você precisa ter pelo menos 13 anos. Menores de 18 anos devem ter autorização
            de um responsável legal.
          </p>
        </Section>

        <Section title="4. Sua conta">
          <ul className="list-disc list-inside flex flex-col gap-2 pl-2">
            <li>Você é responsável por manter a segurança da sua conta e senha.</li>
            <li>As informações fornecidas no cadastro devem ser verdadeiras.</li>
            <li>Cada pessoa pode ter apenas uma conta ativa.</li>
            <li>Não é permitido vender, transferir ou compartilhar o acesso à sua conta.</li>
          </ul>
        </Section>

        <Section title="5. Uso aceitável">
          <p>Você concorda em usar o trocai.app apenas para:</p>
          <ul className="list-disc list-inside flex flex-col gap-2 pl-2">
            <li>Registrar suas figurinhas de coleção de forma honesta.</li>
            <li>Encontrar outros colecionadores e combinar trocas de figurinhas.</li>
            <li>Conversar com outros usuários de forma respeitosa pelo chat.</li>
          </ul>
        </Section>

        <Section title="6. Condutas proibidas">
          <p>É proibido:</p>
          <ul className="list-disc list-inside flex flex-col gap-2 pl-2">
            <li>Usar o app para fins comerciais sem autorização (venda de figurinhas, spam publicitário etc.).</li>
            <li>Criar contas falsas ou se passar por outra pessoa.</li>
            <li>Assediar, ameaçar ou ofender outros usuários.</li>
            <li>Tentar acessar sistemas ou dados de outros usuários de forma não autorizada.</li>
            <li>Publicar conteúdo ilegal, ofensivo ou que viole direitos de terceiros.</li>
            <li>Usar bots, scripts ou automações para interagir com o serviço.</li>
          </ul>
          <p>
            Violações podem resultar em suspensão ou exclusão permanente da conta, sem aviso prévio em casos graves.
          </p>
        </Section>

        <Section title="7. Conteúdo do usuário">
          <p>
            Ao usar o trocai.app, você pode inserir conteúdo como nome de usuário, foto de perfil, bio e mensagens de chat.
            Você mantém a titularidade desse conteúdo, mas nos concede uma licença para exibi-lo e armazená-lo
            conforme necessário para o funcionamento do serviço.
          </p>
          <p>
            Não nos responsabilizamos pelo conteúdo publicado por usuários. Conteúdo inapropriado pode ser
            removido a qualquer momento.
          </p>
        </Section>

        <Section title="8. Gratuidade e publicidade">
          <p>
            O trocai.app é gratuito para todos os usuários. Para se manter, exibimos anúncios discretos via
            Google AdSense. Não cobramos assinaturas nem taxas por trocas realizadas.
          </p>
        </Section>

        <Section title="9. Disponibilidade do serviço">
          <p>
            Nos esforçamos para manter o serviço disponível, mas não garantimos disponibilidade ininterrupta.
            Podemos realizar manutenções, atualizações ou suspender o serviço temporariamente sem aviso prévio.
          </p>
        </Section>

        <Section title="10. Limitação de responsabilidade">
          <p>
            O trocai.app não se responsabiliza por danos decorrentes de trocas não concluídas, acordos descumpridos
            entre usuários, perda de dados ou indisponibilidade do serviço. O uso é por conta e risco do usuário.
          </p>
        </Section>

        <Section title="11. Encerramento de conta">
          <p>
            Você pode encerrar sua conta a qualquer momento pelo perfil do app. Reservamo-nos o direito de
            suspender ou excluir contas que violem estes termos.
          </p>
        </Section>

        <Section title="12. Alterações nos termos">
          <p>
            Podemos atualizar estes termos periodicamente. Quando houver mudanças relevantes, notificaremos por
            e-mail ou aviso no app. Continuar usando o serviço após a atualização implica aceitação dos novos termos.
          </p>
        </Section>

        <Section title="13. Lei aplicável">
          <p>
            Estes termos são regidos pelas leis brasileiras. Fica eleito o foro da comarca de São Paulo/SP para
            resolução de eventuais conflitos.
          </p>
        </Section>

        <Section title="14. Contato">
          <p>
            Dúvidas sobre estes termos:{' '}
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
