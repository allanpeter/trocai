import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Guia completo para trocar figurinhas da Copa do Mundo 2026 — trocai',
  description:
    'Aprenda como organizar seu álbum Panini da Copa 2026, identificar suas figurinhas repetidas e encontrar colecionadores próximos para trocar. Dicas práticas e seguras.',
  alternates: { canonical: 'https://www.trocai.app/guia' },
  openGraph: {
    title: 'Guia: como trocar figurinhas da Copa 2026',
    description:
      'Dicas práticas para organizar seu álbum Panini, encontrar colecionadores na sua cidade e fechar trocas com segurança.',
    type: 'article',
  },
}

const guiaSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Guia completo para trocar figurinhas da Copa do Mundo 2026',
  description:
    'Como organizar seu álbum, identificar repetidas e encontrar colecionadores próximos para trocar figurinhas com segurança.',
  author: { '@type': 'Organization', name: 'trocai' },
  publisher: { '@type': 'Organization', name: 'trocai', url: 'https://www.trocai.app' },
  url: 'https://www.trocai.app/guia',
}

const sections = [
  {
    id: 'organizar',
    title: '1. Organize seu álbum antes de tudo',
    content: [
      'O primeiro passo para trocar bem é saber exatamente o que você tem. Separe suas figurinhas em três pilhas: as que já estão coladas no álbum, as repetidas (duplicatas) e as que ainda faltam. Quanto mais organizado você estiver, mais rápido vai conseguir fechar trocas vantajosas.',
      'Dica: anote os números das figurinhas que faltam em um papel ou salve no celular. Quando encontrar alguém para trocar, você vai saber na hora o que precisa — sem ficar folheando o álbum inteiro.',
    ],
  },
  {
    id: 'repetidas',
    title: '2. Saiba o valor das suas repetidas',
    content: [
      'Nem toda repetida vale o mesmo. Figurinhas de jogadores famosos (Messi, Mbappé, Vini Jr, Haaland) costumam ser mais disputadas e podem valer duas ou três repetidas comuns. Figurinhas douradas, brilhantes ou de escudo de seleção também têm mais valor no mercado de trocas.',
      'Antes de propor uma troca, avalie o que você está oferecendo. Uma figurinha rara por uma comum pode não ser o negócio mais justo — a menos que você já tenha várias cópias daquela rara e precise muito da comum.',
    ],
  },
  {
    id: 'encontrar',
    title: '3. Como encontrar pessoas para trocar',
    content: [
      'A forma mais eficiente de encontrar colecionadores é usar uma plataforma que cruza seu álbum com o de outras pessoas. O trocai faz exatamente isso: você marca quais figurinhas tem, quais faltam e quais estão repetidas — e o sistema mostra quem na sua cidade tem o que você precisa e precisa do que você tem.',
      'Grupos de WhatsApp também são populares, mas têm a desvantagem de não cruzar automaticamente as coleções. Você precisa publicar sua lista, esperar alguém responder e torcer para que a troca funcione. Com uma plataforma, o match já chega pronto.',
    ],
  },
  {
    id: 'seguranca',
    title: '4. Segurança na hora da troca presencial',
    content: [
      'Seja qual for a plataforma que você usar, a troca presencial exige alguns cuidados básicos. Marque sempre em local público e movimentado: shopping, praça, escola, café. Evite encontros em locais desconhecidos ou em horários noturnos, especialmente se for a primeira troca com aquela pessoa.',
      'Antes de sair de casa, confirme os detalhes da troca pelo chat: quais figurinhas vão entrar, em que quantidade e qual a condição delas (sem rasura, sem dobra). Isso evita mal-entendidos na hora do encontro.',
    ],
  },
  {
    id: 'qualidade',
    title: '5. Cuidados com a qualidade das figurinhas',
    content: [
      'Figurinha dobrada, rasgada ou com marcas de caneta não costuma ser aceita em trocas — e por boas razões. Guarde suas repetidas em envelope plástico ou dentro do próprio álbum em uma aba separada. Evite deixá-las soltas na carteira ou no fundo da mochila.',
      'Na hora de conferir uma figurinha recebida, olhe contra a luz para verificar marcas de cola (sinal de que a figurinha foi colada e depois retirada do álbum). Esse tipo de figurinha geralmente não cola bem novamente.',
    ],
  },
  {
    id: 'fechar',
    title: '6. Como fechar uma boa troca',
    content: [
      'Uma troca justa é aquela em que os dois lados saem satisfeitos. Se você está oferecendo mais figurinhas do que vai receber, certifique-se de que isso está sendo compensado pelo valor das figurinhas — não apenas pela quantidade.',
      'Combine tudo por escrito (pelo chat) antes do encontro. Assim, se houver algum imprevisto, você tem o registro da combinação. Após a troca, deixe uma avaliação para a outra pessoa — isso ajuda a construir uma comunidade de colecionadores confiáveis.',
    ],
  },
  {
    id: 'app',
    title: '7. Como usar o trocai para trocar mais rápido',
    content: [
      'O trocai foi criado para eliminar o trabalho manual de cruzar listas. Você acessa o app, marca cada figurinha como "tenho", "repetida" ou "preciso" — e em segundos vê quem na sua cidade tem o que você precisa e precisa do que você tem.',
      'O sistema calcula automaticamente um "match score": quanto mais complementares forem os álbuns, maior a pontuação. Você pode filtrar por distância (10 km, 30 km, 100 km) para encontrar alguém perto de casa. Depois é só abrir o chat, combinar os detalhes e ir para a troca.',
    ],
  },
]

export default function GuiaPage() {
  return (
    <div className="min-h-screen bg-cream-100 text-ink-800 font-body">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guiaSchema) }}
      />

      <header className="sticky top-0 z-20 bg-cream-100/85 backdrop-blur-md border-b border-[#E7DDC4]">
        <div className="max-w-[1180px] mx-auto px-8 h-[60px] flex items-center gap-8">
          <Link href="/" className="shrink-0">
            <Image src="/logo/trocai-logo.svg" width={160} height={48} alt="trocai" priority />
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-ink-500 ml-auto">
            <Link href="/blog" className="hover:text-ink-800 transition-colors">Blog</Link>
            <Link href="/faq" className="hover:text-ink-800 transition-colors">FAQ</Link>
            <Link href="/login" className="hover:text-ink-800 transition-colors">Entrar</Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-[10px] bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
            >
              Começar grátis
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-[800px] mx-auto px-8 py-16">
        {/* Breadcrumb */}
        <nav className="text-xs text-ink-400 mb-8">
          <Link href="/" className="hover:text-ink-700 transition-colors">trocai</Link>
          <span className="mx-2">/</span>
          <span>Guia de trocas</span>
        </nav>

        {/* Header */}
        <p className="text-xs font-bold tracking-[0.08em] uppercase text-green-600 mb-3">Guia prático</p>
        <h1 className="font-display font-extrabold text-[clamp(32px,5vw,56px)] leading-[1.05] tracking-tight mb-4">
          Como trocar figurinhas da Copa 2026 sem estresse
        </h1>
        <p className="text-lg text-ink-500 leading-relaxed mb-4 max-w-[640px]">
          Guia completo para organizar sua coleção, encontrar colecionadores próximos e fechar trocas com segurança — seja pelo app ou pessoalmente.
        </p>

        {/* Table of contents */}
        <nav className="bg-white border border-[#E7DDC4] rounded-2xl p-6 mb-12 shadow-[var(--sh-1)]">
          <p className="text-xs font-bold tracking-[0.08em] uppercase text-ink-400 mb-3">Neste guia</p>
          <ol className="flex flex-col gap-2">
            {sections.map(s => (
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

        {/* Sections */}
        <div className="flex flex-col gap-12">
          {sections.map(s => (
            <section key={s.id} id={s.id} className="scroll-mt-20">
              <h2 className="font-display font-bold text-2xl tracking-tight text-ink-800 mb-4">
                {s.title}
              </h2>
              <div className="flex flex-col gap-4">
                {s.content.map((p, i) => (
                  <p key={i} className="text-[16px] text-ink-600 leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Leia mais */}
        <section className="mt-16">
          <h2 className="font-display font-bold text-2xl tracking-tight mb-6">Continue aprendendo</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <Link href="/blog/quanto-custa-completar-album-copa-2026" className="bg-white border border-[#E7DDC4] rounded-2xl p-5 shadow-[var(--sh-1)] hover:shadow-[var(--sh-3)] hover:-translate-y-0.5 transition-all duration-200">
              <p className="font-display font-bold text-lg leading-snug">Quanto custa completar o álbum da Copa 2026?</p>
            </Link>
            <Link href="/blog/figurinhas-mais-raras-album-copa-2026" className="bg-white border border-[#E7DDC4] rounded-2xl p-5 shadow-[var(--sh-1)] hover:shadow-[var(--sh-3)] hover:-translate-y-0.5 transition-all duration-200">
              <p className="font-display font-bold text-lg leading-snug">As figurinhas mais raras do álbum</p>
            </Link>
            <Link href="/blog/seguranca-trocas-presenciais" className="bg-white border border-[#E7DDC4] rounded-2xl p-5 shadow-[var(--sh-1)] hover:shadow-[var(--sh-3)] hover:-translate-y-0.5 transition-all duration-200">
              <p className="font-display font-bold text-lg leading-snug">Segurança em trocas presenciais</p>
            </Link>
            <Link href="/blog" className="bg-white border border-[#E7DDC4] rounded-2xl p-5 shadow-[var(--sh-1)] hover:shadow-[var(--sh-3)] hover:-translate-y-0.5 transition-all duration-200 flex items-center">
              <p className="font-display font-bold text-lg leading-snug text-green-700">Ver todos os artigos →</p>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <div className="mt-16 bg-green-500 text-white rounded-3xl p-10 text-center">
          <h2 className="font-display font-extrabold text-[32px] tracking-tight mb-3">
            Pronto para começar?
          </h2>
          <p className="text-base opacity-90 mb-6 max-w-[400px] mx-auto">
            Cadastre seu álbum gratuitamente e encontre colecionadores na sua cidade em minutos.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-green-700 font-bold rounded-[14px] text-base hover:bg-cream-100 transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
          >
            Criar conta — é grátis
          </Link>
        </div>
      </main>

      <footer className="bg-ink-900 text-cream-200 px-8 py-8 mt-8">
        <div className="max-w-[1180px] mx-auto flex flex-col sm:flex-row justify-between gap-2 text-xs text-ink-300">
          <span>© 2026 trocai — feito no Brasil</span>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-white transition-colors">Início</Link>
            <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
            <Link href="/privacidade" className="hover:text-white transition-colors">Privacidade</Link>
            <Link href="/termos" className="hover:text-white transition-colors">Termos</Link>
            <Link href="/contato" className="hover:text-white transition-colors">Contato</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
