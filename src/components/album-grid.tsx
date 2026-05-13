'use client'

import { useState, useMemo, useTransition } from 'react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { StickerStatus } from '@/lib/types'

// ── Types ────────────────────────────────────────────────────

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

// ── Team colours ─────────────────────────────────────────────
// [gradientTop, gradientBottom]
const TEAM_COLORS: Record<string, readonly [string, string]> = {
  'FWC':            ['#065f46', '#047857'],
  'Brasil':         ['#065f46', '#16a34a'],
  'Argentina':      ['#1e40af', '#3b82f6'],
  'França':         ['#1e3a8a', '#1d4ed8'],
  'Alemanha':       ['#1c1917', '#374151'],
  'Espanha':        ['#7f1d1d', '#dc2626'],
  'Portugal':       ['#14532d', '#b91c1c'],
  'Inglaterra':     ['#1e3a8a', '#2563eb'],
  'Itália':         ['#1d4ed8', '#3b82f6'],
  'Países Baixos':  ['#9a3412', '#ea580c'],
  'Bélgica':        ['#7f1d1d', '#b91c1c'],
  'Croácia':        ['#7f1d1d', '#dc2626'],
  'Suíça':          ['#7f1d1d', '#dc2626'],
  'Dinamarca':      ['#881337', '#be123c'],
  'Sérvia':         ['#7f1d1d', '#b91c1c'],
  'Polônia':        ['#7f1d1d', '#dc2626'],
  'Marrocos':       ['#14532d', '#b91c1c'],
  'Senegal':        ['#14532d', '#ca8a04'],
  'Nigéria':        ['#14532d', '#065f46'],
  'Camarões':       ['#14532d', '#b91c1c'],
  'Gana':           ['#111827', '#92400e'],
  'Egito':          ['#7f1d1d', '#dc2626'],
  'Japão':          ['#1e3a8a', '#b91c1c'],
  'Coreia do Sul':  ['#1e40af', '#b91c1c'],
  'Arábia Saudita': ['#14532d', '#065f46'],
  'Irã':            ['#14532d', '#7f1d1d'],
  'Austrália':      ['#1d4ed8', '#92400e'],
  'Estados Unidos': ['#1e3a8a', '#7f1d1d'],
  'México':         ['#14532d', '#7f1d1d'],
  'Colômbia':       ['#713f12', '#ca8a04'],
  'Uruguai':        ['#1d4ed8', '#2563eb'],
  'Equador':        ['#713f12', '#ca8a04'],
  'Chile':          ['#7f1d1d', '#1e40af'],
  'Venezuela':      ['#7f1d1d', '#14532d'],
  'Peru':           ['#7f1d1d', '#dc2626'],
  'Paraguai':       ['#7f1d1d', '#dc2626'],
  'Costa Rica':     ['#1e3a8a', '#dc2626'],
  'Panamá':         ['#1e3a8a', '#dc2626'],
  'Honduras':       ['#1d4ed8', '#3b82f6'],
}
const DEFAULT_COLORS: readonly [string, string] = ['#3b0764', '#581c87']

function teamColors(team: string | null): readonly [string, string] {
  return (team && TEAM_COLORS[team]) || DEFAULT_COLORS
}

// ── Silhouette SVGs ───────────────────────────────────────────

function JerseyIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 50"
      className={className}
      aria-hidden
      fill="currentColor"
    >
      {/* Jersey shape: sleeves + body, V-neck collar */}
      <path d="M16 2 C14 6 12 7 8 6 L0 10 L4 24 L12 21 L12 48 L28 48 L28 21 L36 24 L40 10 L32 6 C28 7 26 6 24 2 C22 5 18 5 16 2Z" />
    </svg>
  )
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 48"
      className={className}
      aria-hidden
      fill="currentColor"
    >
      <path d="M20 3 L37 10 L37 26 C37 38 20 45 20 45 C20 45 3 38 3 26 L3 10Z" />
      {/* inner inset */}
      <path
        d="M20 9 L31 14 L31 26 C31 34 20 40 20 40 C20 40 9 34 9 26 L9 14Z"
        opacity="0.25"
      />
    </svg>
  )
}

// ── Main component ────────────────────────────────────────────

interface Props {
  album: AlbumData
  stickers: StickerData[]
  userId: string
}

export function AlbumGrid({ album, stickers, userId }: Props) {
  const supabase = createClient()
  const [, startTransition] = useTransition()

  const [overrides, setOverrides] = useState<Map<string, { status: StickerStatus; quantity: number }>>(new Map())
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch]   = useState('')

  function getStatus(s: StickerData): StickerStatus | null {
    return overrides.get(s.id)?.status ?? s.status
  }
  function getQty(s: StickerData): number {
    return overrides.get(s.id)?.quantity ?? s.quantity
  }

  function handleTap(sticker: StickerData) {
    const current = getStatus(sticker)
    const next    = NEXT_STATUS[current ?? 'null']
    const nextQty = next === 'duplicate' ? Math.max(getQty(sticker), 2) : 1

    setOverrides(prev => {
      const m = new Map(prev)
      m.set(sticker.id, { status: next, quantity: nextQty })
      return m
    })

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
      if (st === 'have')           have++
      else if (st === 'duplicate') dupe++
      else if (st === 'need')      need++
      else                         unmarked++
    }
    return { have, dupe, need, unmarked }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stickers, overrides])

  const pct = Math.round(((stats.have + stats.dupe) / album.total_stickers) * 100)

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

  const grouped = useMemo(() => {
    const map = new Map<string, StickerData[]>()
    for (const s of filtered) {
      const team = s.team ?? 'Outros'
      const arr  = map.get(team) ?? []
      arr.push(s)
      map.set(team, arr)
    }
    return Array.from(map.entries())
  }, [filtered])

  const FILTERS: { key: Filter; label: string; count: number }[] = [
    { key: 'all',       label: 'Todas',     count: stickers.length },
    { key: 'have',      label: 'Tenho',      count: stats.have },
    { key: 'duplicate', label: 'Duplicadas', count: stats.dupe },
    { key: 'need',      label: 'Precisando', count: stats.need + stats.unmarked },
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
          <span className="text-green-700 font-semibold">{stats.have} tenho</span>
          <span className="text-gold-700 font-semibold">{stats.dupe} duplicadas</span>
          <span className="text-rare-500 font-semibold">{stats.need + stats.unmarked} precisando</span>
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
        <div className="flex gap-1.5 bg-[#EEE7D7] p-1 rounded-xl shrink-0">
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
        Toque numa figurinha para marcar:{' '}
        <span className="text-green-600">tenho</span>{' → '}
        <span className="text-gold-600">duplicada</span>{' → '}
        <span className="text-rare-400">precisando</span>
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
              {team}{' '}
              <span className="font-mono text-ink-300 normal-case">({teamStickers.length})</span>
            </h2>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {teamStickers.map(s => (
                <StickerMiniCard
                  key={s.id}
                  sticker={s}
                  status={getStatus(s)}
                  quantity={getQty(s)}
                  onClick={() => handleTap(s)}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  )
}

// ── Sticker mini card ─────────────────────────────────────────

interface StickerMiniCardProps {
  sticker:  StickerData
  status:   StickerStatus | null
  quantity: number
  onClick:  () => void
}

function shortName(name: string | null, code: string | null, number: number): string {
  if (name) {
    const parts = name.trim().split(/\s+/)
    // Last word is usually surname for players; keep it
    return parts[parts.length - 1]
  }
  return code ?? `#${number}`
}

function StickerMiniCard({ sticker, status, quantity, onClick }: StickerMiniCardProps) {
  const [from, to] = teamColors(sticker.team)
  const isUnmarked = status === null
  const label      = sticker.code ?? String(sticker.number)

  return (
    <button
      onClick={onClick}
      title={`${label}${sticker.name ? ' — ' + sticker.name : ''}`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
      className={cn(
        'group relative flex flex-col rounded-[10px] overflow-hidden',
        'aspect-[2/3] border transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500',
        'active:scale-95 hover:-translate-y-0.5',
        sticker.is_rare
          ? 'border-2 border-gold-400 shadow-[0_0_0_1px_rgba(245,197,24,0.3),var(--sh-2)]'
          : 'border-[#D4CAB0] shadow-[var(--sh-1)] hover:shadow-[var(--sh-2)]',
      )}
    >
      {/* ── Photo area ─────────────────────────────────── */}
      <div
        className={cn(
          'relative flex-1 flex items-end justify-center overflow-hidden',
          isUnmarked && 'grayscale'
        )}
        style={{
          background: `linear-gradient(170deg, ${from} 0%, ${to} 100%)`,
        }}
      >
        {/* Sticker code — top-left corner */}
        <span className="absolute top-1 left-1 text-white/60 font-mono font-bold text-[7px] leading-none z-10 select-none">
          {label}
        </span>

        {/* Duplicate quantity badge — top-right */}
        {status === 'duplicate' && quantity > 1 && (
          <span className="absolute top-1 right-1 bg-gold-400 text-ink-900 font-mono font-bold text-[7px] px-1 py-px rounded-[3px] z-10 leading-none">
            ×{quantity}
          </span>
        )}

        {/* Foil shimmer for rare */}
        {sticker.is_rare && (
          <div className="absolute inset-0 animate-shimmer opacity-25 pointer-events-none z-0" aria-hidden />
        )}

        {/* Silhouette — bleeds slightly into footer */}
        <div className={cn(
          'relative z-[1] w-[58%] mb-[-6%] pointer-events-none select-none',
          isUnmarked ? 'text-white/20' : 'text-white/30',
        )}>
          {sticker.is_rare
            ? <ShieldIcon className="w-full h-full drop-shadow-sm" />
            : <JerseyIcon className="w-full h-full drop-shadow-sm" />
          }
        </div>

        {/* "?" overlay for unmarked */}
        {isUnmarked && (
          <span className="absolute inset-0 flex items-center justify-center text-white/25 font-display font-extrabold text-2xl select-none pointer-events-none z-[2]">
            ?
          </span>
        )}
      </div>

      {/* ── Status footer ──────────────────────────────── */}
      <div className={cn(
        'shrink-0 flex items-center justify-center px-1 py-[5px]',
        status === 'have'      && 'bg-green-500',
        status === 'duplicate' && 'bg-gold-400',
        status === 'need'      && 'bg-rare-400',
        status === null        && 'bg-ink-400',
      )}>
        <span className={cn(
          'font-semibold truncate leading-none select-none',
          'text-[8px] sm:text-[9px]',
          status === 'duplicate' ? 'text-ink-900' : 'text-white',
          isUnmarked && 'text-white/60',
        )}>
          {isUnmarked ? '—' : shortName(sticker.name, sticker.code, sticker.number)}
        </span>
      </div>
    </button>
  )
}
