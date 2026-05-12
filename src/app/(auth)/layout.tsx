import Image from 'next/image'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      {/* Minimal nav */}
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/">
          <Image src="/logo/trocai-logo.svg" width={120} height={36} alt="trocai.app" />
        </Link>
      </header>

      {/* Centered content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>
    </div>
  )
}
