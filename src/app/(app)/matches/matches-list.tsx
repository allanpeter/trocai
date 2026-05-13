'use client'

import { useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { MatchCard } from '@/components/match-card'
import { startChat } from './actions'
import type { MatchResultV2 } from '@/lib/types'

const RADIUS_OPTIONS = [
  { label: '10 km',    value: 10 },
  { label: '30 km',    value: 30 },
  { label: '100 km',   value: 100 },
  { label: 'Qualquer', value: null },
]

type SortKey = 'score' | 'distance' | 'overlap'

interface Props {
  matches: MatchResultV2[]
  userCity:  string | null
  userState: string | null
  hasError:  boolean
}

export function MatchesList({ matches, userCity, userState, hasError }: Props) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [radiusIdx, setRadiusIdx]   = useState(3)          // default: Qualquer
  const [sortKey, setSortKey]       = useState<SortKey>('score')
  const [pendingId, setPendingId]   = useState<string | null>(null)

  const radiusKm = RADIUS_OPTIONS[radiusIdx].value

  const filtered = useMemo(() => {
    let list = [...matches]

    // Radius filter (client-side — all matches were fetched without radius)
    if (radiusKm !== null) {
      list = list.filter(m => m.distance_km === null || m.distance_km <= radiusKm)
    }

    // Sort
    if (sortKey === 'distance') {
      list.sort((a, b) => {
        if (a.distance_km === null && b.distance_km === null) return 0
        if (a.distance_km === null) return 1
        if (b.distance_km === null) return -1
        return a.distance_km - b.distance_km
      })
    } else if (sortKey === 'overlap') {
      list.sort((a, b) => b.overlap_score - a.overlap_score)
    }
    // 'score' → already sorted by match_score from DB

    return list
  }, [matches, radiusKm, sortKey])

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

  const hasLocation = matches.some(m => m.distance_km !== null)

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
          {userCity && (
            <div className="flex items-center gap-1 mt-1 text-sm text-ink-400">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              {userCity}{userState ? `, ${userState}` : ''}
            </div>
          )}
          {matches.length > 0 && (
            <p className="text-sm text-ink-400 mt-1">
              {filtered.length} de {matches.length} colecionador{matches.length !== 1 ? 'es' : ''} com figurinhas para trocar
            </p>
          )}
        </div>

        {/* Sort toggle */}
        {matches.length > 0 && (
          <div className="flex items-center gap-1.5 p-1 bg-cream-200 rounded-[10px] shrink-0">
            {([
              { key: 'score',    label: 'Melhor match' },
              { key: 'distance', label: 'Mais próximos' },
              { key: 'overlap',  label: 'Mais trocas' },
            ] as { key: SortKey; label: string }[]).map(opt => (
              <button
                key={opt.key}
                onClick={() => setSortKey(opt.key)}
                disabled={opt.key === 'distance' && !hasLocation}
                className={cn(
                  'px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-all duration-120',
                  sortKey === opt.key
                    ? 'bg-white text-ink-800 shadow-[var(--sh-1)]'
                    : 'text-ink-400 hover:text-ink-600 disabled:opacity-40 disabled:cursor-not-allowed'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Radius filter — only show when user has location data */}
      {hasLocation && matches.length > 0 && (
        <div className="flex items-center gap-2">
          <svg className="shrink-0 text-ink-300" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
          </svg>
          <span className="text-xs text-ink-400 font-medium shrink-0">Raio:</span>
          <div className="flex items-center gap-1">
            {RADIUS_OPTIONS.map((opt, i) => (
              <button
                key={i}
                onClick={() => setRadiusIdx(i)}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-120',
                  radiusIdx === i
                    ? 'bg-green-500 text-white'
                    : 'bg-cream-200 text-ink-500 hover:bg-cream-300'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

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
                Marque as figurinhas que você tem e as que precisa no seu álbum — assim encontramos quem troca com você.
              </p>
              <a
                href="/album/00000000-0000-0000-0000-000000000001"
                className="mt-2 px-5 py-2.5 rounded-xl bg-green-500 text-white font-semibold text-sm hover:bg-green-600 transition-colors"
              >
                Ir para o álbum
              </a>
            </>
          ) : (
            <>
              <p className="font-display font-bold text-xl text-ink-800">
                Nenhum match em {RADIUS_OPTIONS[radiusIdx].label}
              </p>
              <button
                onClick={() => setRadiusIdx(3)}
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
