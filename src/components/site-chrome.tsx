import Image from 'next/image'
import Link from 'next/link'

const NAV = [
  { href: '/guia', label: 'Guia' },
  { href: '/blog', label: 'Blog' },
  { href: '/faq', label: 'FAQ' },
  { href: '/about', label: 'Sobre' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 bg-cream-100/85 backdrop-blur-md border-b border-[#E7DDC4]">
      <div className="max-w-[1180px] mx-auto px-4 md:px-8 h-[60px] flex items-center gap-8">
        <Link href="/" className="shrink-0">
          <Image src="/logo/trocai-logo.svg" width={150} height={45} alt="trocai" priority />
        </Link>
        <nav className="hidden md:flex items-center gap-6 ml-2">
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink-700 hover:text-green-600 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-semibold px-4 py-2 rounded-[10px] text-ink-700 hover:bg-cream-200 transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/signup"
            className="hidden sm:inline-flex px-4 py-2 rounded-[10px] bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors"
          >
            Começar grátis
          </Link>
        </div>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-[#E7DDC4] bg-white mt-20">
      <div className="max-w-[1180px] mx-auto px-8 py-12 grid md:grid-cols-4 gap-8 text-sm text-ink-500">
        <div>
          <p className="font-display font-bold text-ink-800 mb-2">trocai</p>
          <p>Conectando colecionadores de figurinhas da Copa 2026 no Brasil.</p>
        </div>
        <div>
          <p className="font-semibold text-ink-800 mb-2">Conteúdo</p>
          <div className="flex flex-col gap-1">
            <Link href="/" className="hover:text-green-600">Início</Link>
            <Link href="/guia" className="hover:text-green-600">Guia de trocas</Link>
            <Link href="/blog" className="hover:text-green-600">Blog</Link>
            <Link href="/faq" className="hover:text-green-600">FAQ</Link>
            <Link href="/about" className="hover:text-green-600">Sobre</Link>
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
            <Link href="/contato" className="hover:text-green-600">Fale com a gente</Link>
            <a href="mailto:contato@trocai.app" className="hover:text-green-600">contato@trocai.app</a>
            <a href="https://discord.gg/trocai" className="hover:text-green-600" target="_blank" rel="noopener noreferrer">Discord</a>
          </div>
        </div>
      </div>
      <div className="max-w-[1180px] mx-auto px-8 py-6 border-t border-[#E7DDC4] text-center text-xs text-ink-400">
        <p>© 2026 trocai — feito no Brasil para colecionadores.</p>
      </div>
    </footer>
  )
}
