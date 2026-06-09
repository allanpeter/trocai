'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, RefreshCw } from 'lucide-react'

export default function ChatError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Chat error:', error)
  }, [error])

  return (
    <div className="max-w-[1180px] mx-auto px-8 py-12">
      <div className="bg-white rounded-[18px] shadow-[var(--sh-1)] border border-[#E7DDC4] p-12 text-center max-w-md mx-auto">
        <div className="inline-flex w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="font-display font-bold text-2xl mb-2 text-ink-800">
          Erro ao carregar chat
        </h2>
        <p className="text-ink-500 text-[15px] leading-relaxed mb-6">
          Não conseguimos carregar essa conversa no momento. Tente novamente em alguns segundos.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 w-full font-semibold text-base px-6 py-3 rounded-[12px] bg-green-500 text-white shadow-[var(--sh-2)] hover:bg-green-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Tentar novamente
          </button>
          <Link
            href="/matches"
            className="w-full font-semibold text-base px-6 py-3 rounded-[12px] bg-cream-200 text-ink-700 hover:bg-cream-300 transition-colors text-center"
          >
            Voltar para matches
          </Link>
        </div>
      </div>
    </div>
  )
}
