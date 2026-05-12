import Image from 'next/image'
import Link from 'next/link'

/* ── Sticker card used in hero collage ─────────────────────────────── */
function HeroCard({
  initial, number, name, variant, style,
}: {
  initial: string; number: string; name: string
  variant: 'green' | 'missing' | 'gold' | 'rare'
  style?: React.CSSProperties
}) {
  return (
    <div
      className={`absolute w-[160px] rounded-[14px] overflow-hidden shadow-[var(--sh-3)] border ${
        variant === 'rare'
          ? 'border-2 border-gold-400 animate-shimmer bg-[length:200%_200%]'
          : 'border-[#E7DDC4] bg-white'
      }`}
      style={style}
    >
      <div
        className={`flex items-center justify-center font-display font-extrabold text-[60px] aspect-[3/4] ${
          variant === 'green'   ? 'bg-green-600 text-white'       :
          variant === 'missing' ? 'bg-rare-50 text-rare-400'     :
          variant === 'gold'    ? 'bg-gold-100 text-gold-700'    :
                                  'bg-white/60 text-ink-700'
        }`}
      >
        {initial}
      </div>
      <div className={`flex justify-between items-center px-3 py-2.5 ${variant === 'rare' ? 'bg-white/90' : 'bg-white'}`}>
        <span className={`t-num text-xs ${variant === 'missing' ? 'text-rare-400' : variant === 'gold' ? 'text-gold-700' : 'text-green-600'}`}>
          {number}
        </span>
        <span className="font-semibold text-xs text-ink-800">{name}</span>
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream-100 text-ink-800 font-body">

      {/* ── Nav ───────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-cream-100/85 backdrop-blur-md border-b border-[#E7DDC4]">
        <div className="max-w-[1180px] mx-auto px-8 h-[60px] flex items-center gap-8">
          <Link href="/" className="shrink-0">
            <Image src="/logo/trocai-logo.svg" width={160} height={48} alt="trocai.app" priority />
          </Link>
          <nav className="hidden md:flex items-center gap-6 ml-6">
            <a href="#como" className="text-sm font-medium text-ink-700 hover:text-green-600 transition-colors">Como funciona</a>
            <a href="#numeros" className="text-sm font-medium text-ink-700 hover:text-green-600 transition-colors">Números</a>
            <a href="#faq" className="text-sm font-medium text-ink-700 hover:text-green-600 transition-colors">FAQ</a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/login" className="text-sm font-semibold px-4 py-2 rounded-[10px] text-ink-700 hover:bg-cream-200 transition-colors">
              Entrar
            </Link>
            <Link href="/signup" className="text-sm font-semibold px-4 py-2.5 rounded-[10px] bg-green-500 text-white shadow-[var(--sh-2)] hover:bg-green-600 transition-colors">
              Bora trocar
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="max-w-[1180px] mx-auto px-8 py-20 md:py-24 grid md:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <div>
          <span className="inline-block text-xs font-bold tracking-[0.08em] uppercase text-green-600 bg-green-50 px-3 py-1 rounded-full mb-4">
            Copa do Mundo 2026 · grátis
          </span>
          <h1 className="font-display font-extrabold text-[clamp(48px,7vw,88px)] leading-[1.02] tracking-[-0.025em] mb-5">
            Tu sabe quem{' '}
            <em className="not-italic text-green-500 relative">
              tem a #387.
              <span
                className="absolute left-0 bottom-2 w-full h-2 bg-gold-400 -z-10 rounded"
                aria-hidden
              />
            </em>
          </h1>
          <p className="text-[19px] text-ink-500 max-w-[480px] leading-relaxed mb-8">
            Cadastra teu álbum, marca o que tu tem e o que falta. A gente encontra quem mora perto e tem o que tu precisa. Combinou pelo chat, fechou troca.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <Link
              href="/signup"
              className="inline-flex items-center font-semibold text-base px-6 py-3.5 rounded-[14px] bg-green-500 text-white shadow-[var(--sh-3)] hover:bg-green-600 hover:-translate-y-0.5 transition-all duration-200"
            >
              Bora trocar
            </Link>
            <span className="text-sm text-ink-400">grátis, sem cadastro pra ver</span>
          </div>
        </div>

        {/* Sticker collage */}
        <div className="relative h-[480px] hidden md:block">
          <HeroCard initial="M" number="#387" name="Marquinhos" variant="green"
            style={{ top: 0, left: '20%', transform: 'rotate(-5deg)' }} />
          <HeroCard initial="?" number="#412" name="—" variant="missing"
            style={{ top: 80, left: 0, transform: 'rotate(8deg)' }} />
          <HeroCard initial="N" number="#205" name="Neymar" variant="gold"
            style={{ top: 140, right: 0, transform: 'rotate(-3deg)' }} />
          <div
            className="absolute flex items-center justify-center w-16 h-16 rounded-full bg-ink-800 text-gold-400 font-display font-extrabold text-3xl shadow-[var(--sh-3)] z-10"
            style={{ top: 300, left: '18%', transform: 'rotate(-12deg)' }}
          >
            ⇄
          </div>
          <HeroCard initial="V" number="#001 ★" name="Vini Jr" variant="rare"
            style={{ top: 240, left: '40%', transform: 'rotate(6deg)' }} />
        </div>
      </section>

      {/* ── Como funciona ─────────────────────────────────────────────── */}
      <section id="como" className="max-w-[1180px] mx-auto px-8 py-20">
        <p className="text-xs font-bold tracking-[0.08em] uppercase text-green-600 mb-2">COMO FUNCIONA</p>
        <h2 className="font-display font-bold text-[clamp(32px,4.5vw,56px)] tracking-tight leading-[1.08] mb-4">
          Três passos. Sem mistério.
        </h2>
        <p className="text-lg text-ink-500 max-w-[600px] mb-12">
          Não precisa abrir conta pra ver se vale a pena. Tu marca tuas figurinhas em 5 minutos e já vê quem tem o que tu precisa.
        </p>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { n: '1', icon: '/icons/album.svg',   title: 'Cadastra teu álbum',   body: 'A gente já tem todas as 640 figurinhas da Copa pré-cadastradas. Tu só escolhe o álbum.' },
            { n: '2', icon: '/icons/sticker.svg', title: 'Marca o que tu tem',   body: 'Toca em cada figurinha pra marcar como tenho, falta ou repetida. Vai rápido.' },
            { n: '3', icon: '/icons/swap.svg',    title: 'Encontra e troca',     body: 'A gente cruza tudo e mostra gente perto de ti com o que falta — e que precisa do que tu sobra.' },
          ].map(step => (
            <div key={step.n} className="relative bg-white border border-[#E7DDC4] rounded-[18px] p-7 shadow-[var(--sh-1)] overflow-hidden">
              <span className="absolute top-[-8px] right-4 font-display font-extrabold text-[80px] leading-none text-green-100 select-none">
                {step.n}
              </span>
              <div className="relative z-10">
                <div className="inline-flex w-12 h-12 bg-green-500 rounded-xl items-center justify-center mb-4">
                  <Image src={step.icon} width={22} height={22} alt="" className="invert brightness-[2]" />
                </div>
                <h3 className="font-display font-bold text-2xl tracking-tight mb-2">{step.title}</h3>
                <p className="text-ink-500 text-[15px] leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats banner ──────────────────────────────────────────────── */}
      <section id="numeros" className="max-w-[1180px] mx-auto px-8 py-12">
        <div className="bg-ink-800 rounded-3xl px-12 py-12 grid md:grid-cols-3 gap-8 text-center">
          {[
            { val: '147k', lbl: 'colecionadores ativos' },
            { val: '2.1M', lbl: 'trocas combinadas' },
            { val: '96%',  lbl: 'encontros confirmados' },
          ].map(s => (
            <div key={s.lbl}>
              <div className="font-display font-extrabold text-[64px] leading-none text-gold-400 tracking-tight">
                {s.val}
              </div>
              <div className="text-sm text-ink-200 mt-2">{s.lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonial ───────────────────────────────────────────────── */}
      <section className="max-w-[1180px] mx-auto px-8 py-12">
        <div className="bg-green-500 text-white rounded-3xl p-14 grid md:grid-cols-[auto_1fr] gap-8 items-center">
          <div className="w-24 h-24 bg-ink-800 rounded-full flex items-center justify-center font-display font-extrabold text-4xl text-gold-400 mx-auto md:mx-0 shrink-0">
            J
          </div>
          <div>
            <p className="font-display font-semibold text-[28px] leading-snug tracking-tight mb-4 text-balance">
              "Fechei o álbum em 3 semanas. Achei a #001 do Vini Jr com uma pessoa do bairro — o app simplesmente avisou. Meu filho tava em choque."
            </p>
            <p className="text-sm opacity-85">Juliana · São Paulo · completou Copa 2026</p>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section id="faq" className="max-w-[1180px] mx-auto px-8 py-20">
        <p className="text-xs font-bold tracking-[0.08em] uppercase text-green-600 mb-2">FAQ</p>
        <h2 className="font-display font-bold text-[clamp(32px,4.5vw,56px)] tracking-tight leading-[1.08] mb-8">
          As 5 dúvidas que sempre rolam.
        </h2>
        <div className="flex flex-col gap-2 max-w-[760px]">
          {[
            { q: 'É grátis mesmo?',
              a: 'É. Pra usar o app inteiro, pra sempre. A gente sustenta com banner discreto e patrocínio dos álbuns. Sem assinatura escondida.' },
            { q: 'Como sei que a pessoa do outro lado é de confiança?',
              a: 'Todo perfil tem histórico de trocas e avaliação. A gente também sugere o primeiro encontro em local público — escola, praça, café.' },
            { q: 'Preciso pagar pra trocar?',
              a: 'Não. A troca é entre as duas pessoas — figurinha por figurinha. A gente só conecta.' },
            { q: 'Funciona em outras coleções, ou só na Copa?',
              a: 'Começamos com a Copa 2026 porque é o mais procurado. Já tá rolando Brasileirão 2026 também. Outras coleções entram conforme demanda.' },
            { q: 'E se eu mudar de cidade?',
              a: 'Beleza. Tu atualiza tua cidade e a busca de matches já considera quem tá perto. Tua coleção e teu histórico ficam.' },
          ].map(item => (
            <details
              key={item.q}
              className="bg-white border border-[#E7DDC4] rounded-[14px] px-6 py-5 group cursor-pointer"
            >
              <summary className="font-display font-semibold text-lg list-none flex justify-between items-center [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="font-mono text-green-500 text-2xl transition-transform duration-200 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-ink-500 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="bg-ink-900 text-cream-200 px-8 pt-16 pb-8 mt-20">
        <div className="max-w-[1180px] mx-auto grid md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-12 mb-12">
          <div>
            <Image src="/logo/trocai-logo-dark.svg" width={160} height={48} alt="trocai.app" className="mb-4" />
            <p className="text-sm text-ink-200 max-w-[280px] leading-relaxed">
              O álbum de figurinhas, modernizado. Brasileiro, gratuito, feito pra quem ainda lembra do barulhinho do pacotinho.
            </p>
          </div>
          {[
            { title: 'Produto', links: ['Como funciona', 'Álbuns', 'App mobile', 'Status'] },
            { title: 'Comunidade', links: ['Discord', 'Blog', 'Histórias', 'Embaixadores'] },
            { title: 'Legal', links: ['Termos', 'Privacidade', 'Cookies', 'Contato'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-xs font-bold tracking-[0.08em] uppercase text-white mb-4">{col.title}</h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" className="text-sm text-ink-200 hover:text-white transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1180px] mx-auto border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-ink-300">
          <span>© 2026 trocai.app — feito no Brasil</span>
          <span>v1.0 · made with verde-amarelo (mas, tipo, com bom senso)</span>
        </div>
      </footer>

    </div>
  )
}
