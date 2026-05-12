'use client'

import { useState, useMemo, useTransition } from 'react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { StickerStatus } from '@/lib/types'

interface StickerData {
  id: string
  number: number
  code: string | null
  name: string | null
  team: string | null
  is_rare: boolean
  status: StickerStatus | null
  quantity: number
}

interface AlbumData {
  id: string
  name: string
  year: number
  total_stickers: number
}

type Filter = 'all' | 'have' | 'duplicate' | 'need'

const NEXT_STATUS: Record<string, StickerStatus> = {
  'null':      'have',
  'need':      'have',
  'have':      'duplicate',
  'duplicate': 'need',
}

interface Props {
  album: AlbumData
  stickers: StickerData[]
  userId: string
}

export function AlbumGrid({ album, stickers, userId }: Props) {
  const supabase = createClient()
  const [, startTransition] = useTransition()

  // Local status map for optimistic updates
  const [overrides, setOverrides] = useState<Map<string, { status: StickerStatus; quantity: number }>>(
    new Map()
  )
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')

  function getStatus(s: StickerData): StickerStatus | null {
    return overrides.get(s.id)?.status ?? s.status
  }
  function getQty(s: StickerData): number {
    return overrides.get(s.id)?.quantity ?? s.quantity
  }

  function handleTap(sticker: StickerData) {
    const current = getStatus(sticker)
    const next = NEXT_STATUS[current ?? 'null']
    const nextQty = next === 'duplicate' ? Math.max(getQty(sticker), 2) : 1

    // Optimistic update
    setOverrides(prev => {
      const next_ = new Map(prev)
      next_.set(sticker.id, { status: next, quantity: nextQty })
      return next_
    })

    // Async persist (fire and forget — failure just means stale state on reload)
    startTransition(async () => {
      await supabase.from('user_stickers').upsert(
        { user_id: userId, sticker_id: sticker.id, status: next, quantity: nextQty },
        { onConflict: 'user_id,sticker_id' }
      )
    })
  }

  // Derived stats
  const stats = useMemo(() => {
    let have = 0, dupe = 0, need = 0, unmarked = 0
    for (const s of stickers) {
      const st = getStatus(s)
      if (st === 'have')      have++
      else if (st === 'duplicate') dupe++
      else if (st === 'need') need++
      else unmarked++
    }
    return { have, dupe, need, unmarked }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stickers, overrides])

  const pct = Math.round(((stats.have + stats.dupe) / album.total_stickers) * 100)

  // Filtered + searched stickers
  const filtered = useMemo(() => {
    let list = stickers
    if (filter !== 'all') {
      list = list.filter(s => {
        const st = getStatus(s)
        if (filter === 'need') return st === 'need' || st === null
        return st === filter
      })
    }
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(s =>
        String(s.number).includes(q) ||
        s.name?.toLowerCase().includes(q) ||
        s.team?.toLowerCase().includes(q)
      )
    }
    return list
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stickers, filter, search, overrides])

  // Group by team
  const grouped = useMemo(() => {
    const map = new Map<string, StickerData[]>()
    for (const s of filtered) {
      const team = s.team ?? 'Outros'
      const arr = map.get(team) ?? []
      arr.push(s)
      map.set(team, arr)
    }
    return Array.from(map.entries())
  }, [filtered])

  const FILTERS: { key: Filter; label: string; count: number }[] = [
    { key: 'all',       label: 'Todas',      count: stickers.length },
    { key: 'have',      label: 'Tenho',       count: stats.have },
    { key: 'duplicate', label: 'Duplicadas',  count: stats.dupe },
    { key: 'need',      label: 'Precisando',  count: stats.need + stats.unmarked },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-ink-400 mb-1">
          {album.year}
        </p>
        <h1 className="font-display font-bold text-[28px] tracking-tight text-ink-800">
          {album.name}
        </h1>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-sm text-ink-500 font-medium">
              {stats.have + stats.dupe} / {album.total_stickers} figurinhas
            </span>
            <span className="t-num text-sm font-bold text-green-600">{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-[#E7DDC4] overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex gap-3 mt-3 text-xs">
          <span className="text-green-700 font-semibold">
            {stats.have} tenho
          </span>
          <span className="text-gold-700 font-semibold">
            {stats.dupe} duplicadas
          </span>
          <span className="text-rare-500 font-semibold">
            {stats.need + stats.unmarked} precisando
          </span>
        </div>
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          placeholder="Buscar figurinha ou time…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={cn(
            'flex-1 px-4 py-2.5 rounded-xl border border-[#E7DDC4] bg-white',
            'font-body text-sm text-ink-800 placeholder:text-ink-300',
            'outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20',
          )}
        />
        <div className="flex gap-1.5 bg-[#EEE7D7] p-1 rounded-xl">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-semibold transition-all duration-120',
                filter === f.key
                  ? 'bg-white text-ink-800 shadow-[var(--sh-1)]'
                  : 'text-ink-500 hover:text-ink-700'
              )}
            >
              {f.label}
              <span className={cn(
                'font-mono text-[10px] px-1 rounded-md',
                filter === f.key ? 'text-green-600' : 'text-ink-400'
              )}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tap hint */}
      <p className="text-xs text-ink-300 -mt-2">
        Toca numa figurinha para marcar: <span className="text-green-600">tenho</span> → <span className="text-gold-600">duplicada</span> → <span className="text-rare-400">precisando</span>
      </p>

      {/* Sticker groups */}
      {grouped.length === 0 ? (
        <div className="text-center py-16 text-ink-400 font-body">
          Nenhuma figurinha encontrada.
        </div>
      ) : (
        grouped.map(([team, teamStickers]) => (
          <section key={team}>
            <h2 className="text-[11px] font-semibold tracking-[0.08em] uppercase text-ink-400 mb-3">
              {team} <span className="font-mono text-ink-300 normal-case">({teamStickers.length})</span>
            </h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
              {teamStickers.map(s => {
                const st = getStatus(s)
                const qty = getQty(s)
                return (
                  <MiniStickerCard
                    key={s.id}
                    label={s.code ?? String(s.number)}
                    isRare={s.is_rare}
                    status={st}
                    quantity={qty}
                    onClick={() => handleTap(s)}
                  />
                )
              })}
            </div>
          </section>
        ))
      )}
    </div>
  )
}

interface MiniCardProps {
  label: string
  isRare: boolean
  status: StickerStatus | null
  quantity: number
  onClick: () => void
}

function MiniStickerCard({ label, isRare, status, quantity, onClick }: MiniCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex flex-col rounded-[10px] border overflow-hidden',
        'transition-all duration-150 active:scale-95',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500',
        'hover:-translate-y-0.5 hover:shadow-[var(--sh-2)]',
        isRare ? 'border-2 border-gold-400' : 'border-[#E7DDC4]',
        status === 'have'      && 'bg-green-50',
        status === 'duplicate' && 'bg-gold-50',
        status === 'need'      && 'bg-[#F9F3E8]',
        status === null        && 'bg-[repeating-linear-gradient(45deg,#F5EDD9_0_6px,#ECDFBE_6px_12px)]',
      )}
      style={{ WebkitTapHighlightColor: 'transparent' }}
      title={`Figurinha ${label}`}
    >
      {/* Foil shimmer for rare */}
      {isRare && (
        <div className="absolute inset-0 animate-shimmer opacity-30 pointer-events-none z-0" aria-hidden />
      )}

      <div className="relative z-[1] flex flex-col items-center justify-center py-2.5 px-1 gap-0.5">
        <span className={cn(
          't-num font-bold text-[10px] leading-none text-center break-all',
          status === 'have'      && 'text-green-600',
          status === 'duplicate' && 'text-gold-700',
          (status === 'need' || status === null) && 'text-ink-400',
        )}>
          {label}
        </span>

        {/* Status dot */}
        <span className={cn(
          'w-1.5 h-1.5 rounded-full mt-0.5',
          status === 'have'      && 'bg-green-500',
          status === 'duplicate' && 'bg-gold-400',
          status === 'need'      && 'bg-rare-400',
          status === null        && 'bg-ink-200',
        )} />
      </div>

      {/* Duplicate badge */}
      {status === 'duplicate' && quantity > 1 && (
        <span className="absolute top-0.5 right-0.5 bg-gold-400 text-ink-800 font-mono font-bold text-[8px] px-1 py-px rounded-[4px] z-10">
          ×{quantity}
        </span>
      )}
    </button>
  )
}
