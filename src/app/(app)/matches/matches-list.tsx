'use client'

import { useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { MatchCard } from '@/components/match-card'
import { startChat } from './actions'
import type { MatchResult } from '@/lib/types'

interface Props {
  matches: MatchResult[]
  userCity: string | null
  hasError: boolean
}

export function MatchesList({ matches, userCity, hasError }: Props) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [cityOnly, setCityOnly]   = useState(false)
  const [pendingId, setPendingId] = useState<string | null>(null)

  const filtered = useMemo(
    () => cityOnly && userCity
      ? matches.filter(m => m.city?.toLowerCase() === userCity.toLowerCase())
      : matches,
    [matches, cityOnly, userCity]
  )

  function handleChat(userId: string) {
    setPendingId(userId)
    startTransition(async () => {
      await startChat(userId)
      router.refresh()
    })
  }

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
        <p className="font-display font-bold text-xl text-ink-800">Algo deu errado</p>
        <p className="text-sm text-ink-400">Não conseguimos buscar os matches. Tenta recarregar.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-ink-400 mb-1">
            Copa do Mundo 2026
          </p>
          <h1 className="font-display font-bold text-[28px] tracking-tight text-ink-800">
            Matches
          </h1>
          {matches.length > 0 && (
            <p className="text-sm text-ink-400 mt-1">
              {matches.length} colecionador{matches.length !== 1 ? 'es' : ''} com figurinhas para trocar
            </p>
          )}
        </div>

        {/* City filter toggle */}
        {userCity && matches.length > 0 && (
          <button
            onClick={() => setCityOnly(v => !v)}
            className={cn(
              'flex items-center gap-2 px-3.5 py-2 rounded-[10px] text-sm font-semibold transition-all duration-150 shrink-0',
              cityOnly
                ? 'bg-green-500 text-white shadow-[var(--sh-2)]'
                : 'bg-white border border-[#E7DDC4] text-ink-600 hover:border-ink-300'
            )}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {userCity}
          </button>
        )}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-cream-200 flex items-center justify-center text-3xl">
            🔍
          </div>
          {matches.length === 0 ? (
            <>
              <p className="font-display font-bold text-xl text-ink-800">Nenhum match ainda</p>
              <p className="text-sm text-ink-400 max-w-[300px]">
                Marca as figurinhas que tens e as que precisas no teu álbum — assim encontramos quem troca contigo.
              </p>
              <a
                href={`/album/00000000-0000-0000-0000-000000000001`}
                className="mt-2 px-5 py-2.5 rounded-xl bg-green-500 text-white font-semibold text-sm hover:bg-green-600 transition-colors"
              >
                Ir para o álbum
              </a>
            </>
          ) : (
            <>
              <p className="font-display font-bold text-xl text-ink-800">Nenhum match em {userCity}</p>
              <button
                onClick={() => setCityOnly(false)}
                className="text-sm text-green-600 font-semibold hover:underline"
              >
                Ver todos os matches
              </button>
            </>
          )}
        </div>
      )}

      {/* Match cards */}
      {filtered.length > 0 && (
        <div className="flex flex-col gap-3">
          {filtered.map(match => (
            <MatchCard
              key={match.user_id}
              match={match}
              isPending={pendingId === match.user_id}
              onInitiateChat={() => handleChat(match.user_id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
