'use client'

import { useState, useTransition, useMemo, Fragment } from 'react'
// radiusIdx derived from activeRadius prop; radius changes navigate via URL
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { MatchCard } from '@/components/match-card'
import { AdBanner } from '@/components/ad-banner'
import { startChat } from './actions'
import type { MatchResultV2 } from '@/lib/types'

const AD_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT_MATCHES ?? ''
const AD_EVERY = 5

const RADIUS_OPTIONS = [
  { label: '10 km',    value: 10 },
  { label: '30 km',    value: 30 },
  { label: '100 km',   value: 100 },
  { label: 'Qualquer', value: null },
]

type SortKey = 'score' | 'distance' | 'overlap'

type NearbySpot = { id: string; name: string; type: string; city_name: string; distKm: number | null }

const SPOT_EMOJI: Record<string, string> = {
  shopping: '🛍️', parque: '🌳', praca: '🏛️', cafeteria: '☕',
  universidade: '🎓', biblioteca: '📚', mercado: '🛒', outro: '📍',
}

interface Props {
  matches:      MatchResultV2[]
  userCity:     string | null
  userState:    string | null
  hasError:     boolean
  activeRadius: number | null
  chatByUser:   Map<string, string>
  nearbySpots?: NearbySpot[]
}

export function MatchesList({ matches, userCity, userState, hasError, activeRadius, chatByUser, nearbySpots = [] }: Props) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [sortKey, setSortKey] = useState<SortKey>('score')
  const [pendingId, setPendingId] = useState<string | null>(null)

  function setRadius(value: number | null) {
    const url = value !== null ? `?r=${value}` : '/matches'
    router.push(url)
  }

  const radiusIdx = RADIUS_OPTIONS.findIndex(o => o.value === activeRadius)

  const filtered = useMemo(() => {
    const list = [...matches]
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
    return list
  }, [matches, sortKey])

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

      {/* Nearby spots hint */}
      {nearbySpots.length > 0 && (
        <div className="bg-cream-200 rounded-xl px-4 py-3 flex items-start gap-3">
          <svg className="shrink-0 text-green-600 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-ink-600 mb-1.5">Bons locais de encontro perto de você</p>
            <div className="flex flex-wrap gap-2">
              {nearbySpots.map(s => (
                <span key={s.id} className="inline-flex items-center gap-1 text-xs bg-white border border-[#E7DDC4] rounded-lg px-2.5 py-1 text-ink-700">
                  {SPOT_EMOJI[s.type] ?? '📍'} {s.name}
                  {s.distKm != null && <span className="text-ink-300 ml-0.5">· {s.distKm} km</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

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
                onClick={() => setRadius(opt.value)}
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
                onClick={() => setRadius(null)}
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
          {filtered.map((match, i) => (
            <Fragment key={match.user_id}>
              <MatchCard
                match={match}
                isPending={pendingId === match.user_id}
                existingChatId={chatByUser.get(match.user_id)}
                onInitiateChat={() => handleChat(match.user_id)}
              />
              {(i + 1) % AD_EVERY === 0 && (
                <AdBanner slot={AD_SLOT} format="horizontal" className="rounded-xl overflow-hidden" />
              )}
            </Fragment>
          ))}
        </div>
      )}
    </div>
  )
}
