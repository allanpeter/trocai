'use client'

import { useEffect } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[18px] shadow-[var(--sh-1)] border border-[#E7DDC4] p-8 text-center">
          <div className="inline-flex w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="font-display font-bold text-2xl mb-2 text-ink-800">
            Ops, algo deu errado
          </h2>
          <p className="text-ink-500 text-[15px] leading-relaxed mb-6">
            Encontramos um erro enquanto você navegava. Tente novamente ou volte para a página inicial.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => reset()}
              className="flex items-center justify-center gap-2 w-full font-semibold text-base px-6 py-3 rounded-[12px] bg-green-500 text-white shadow-[var(--sh-2)] hover:bg-green-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Tentar novamente
            </button>
            <a
              href="/"
              className="w-full font-semibold text-base px-6 py-3 rounded-[12px] bg-cream-200 text-ink-700 hover:bg-cream-300 transition-colors text-center"
            >
              Voltar para o início
            </a>
          </div>
          <p className="text-xs text-ink-400 mt-6">
            ID do erro: {error.digest || 'desconhecido'}
          </p>
        </div>
      </div>
    </div>
  )
}
