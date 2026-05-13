'use client'

import { useState, useTransition, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'

interface Props {
  currentUserId: string
}

type Result = Pick<Profile, 'id' | 'username' | 'full_name' | 'city' | 'state' | 'avatar_url' | 'rating' | 'trades_count'>

export function SearchClient({ currentUserId }: Props) {
  const supabase = createClient()
  const [query, setQuery]     = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [searched, setSearched] = useState(false)
  const [, startTransition]   = useTransition()

  const search = useCallback((q: string) => {
    const trimmed = q.trim()
    if (!trimmed) { setResults([]); setSearched(false); return }

    startTransition(async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, username, full_name, city, state, avatar_url, rating, trades_count')
        .ilike('username', `%${trimmed}%`)
        .neq('id', currentUserId)
        .order('trades_count', { ascending: false })
        .limit(20)

      setResults(data ?? [])
      setSearched(true)
    })
  }, [supabase, currentUserId])

  function handleChange(value: string) {
    setQuery(value)
    // Debounce: fire after 300ms of no typing
    clearTimeout((window as Window & { _searchTimer?: ReturnType<typeof setTimeout> })._searchTimer)
    ;(window as Window & { _searchTimer?: ReturnType<typeof setTimeout> })._searchTimer =
      setTimeout(() => search(value), 300)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-ink-400 mb-1">
          Descobrir
        </p>
        <h1 className="font-display font-bold text-[28px] tracking-tight text-ink-800">
          Buscar colecionadores
        </h1>
      </div>

      {/* Search input */}
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-300 pointer-events-none"
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="search"
          placeholder="Buscar por nome de usuário…"
          value={query}
          onChange={e => handleChange(e.target.value)}
          autoFocus
          className={cn(
            'w-full pl-11 pr-4 py-3 rounded-xl border border-[#E7DDC4] bg-white',
            'font-body text-sm text-ink-800 placeholder:text-ink-300',
            'outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20',
          )}
        />
      </div>

      {/* Results */}
      {!searched && !query && (
        <p className="text-sm text-ink-300 text-center py-12">
          Digita um nome de usuário para encontrar colecionadores
        </p>
      )}

      {searched && results.length === 0 && (
        <div className="text-center py-16 flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-cream-200 flex items-center justify-center text-2xl">🔍</div>
          <p className="font-display font-bold text-lg text-ink-800">Nenhum resultado</p>
          <p className="text-sm text-ink-400">Tenta um nome diferente.</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="flex flex-col gap-2">
          {results.map(user => (
            <Link
              key={user.id}
              href={`/profile/${user.username}`}
              className={cn(
                'flex items-center gap-4 px-4 py-3.5 bg-white border border-[#E7DDC4] rounded-[14px]',
                'shadow-[var(--sh-1)] transition-all duration-150',
                'hover:border-green-300 hover:shadow-[var(--sh-2)] hover:-translate-y-px'
              )}
            >
              {/* Avatar */}
              {user.avatar_url ? (
                <Image
                  src={user.avatar_url} width={44} height={44} alt=""
                  className="w-11 h-11 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-green-500 flex items-center justify-center text-white font-display font-bold text-base shrink-0">
                  {user.username[0].toUpperCase()}
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[15px] text-ink-800 truncate">
                  {user.username}
                  {user.full_name && (
                    <span className="font-normal text-ink-400"> · {user.full_name}</span>
                  )}
                </div>
                <div className="text-xs text-ink-400 mt-0.5 flex items-center gap-2">
                  {user.city && <span>{user.city}{user.state ? `, ${user.state}` : ''}</span>}
                  {user.city && user.trades_count > 0 && <span className="text-ink-200">·</span>}
                  {user.trades_count > 0 && (
                    <span>{user.trades_count} trocas</span>
                  )}
                  {user.rating > 0 && (
                    <span className="text-gold-600 font-semibold">
                      {'★'.repeat(Math.round(user.rating))} {user.rating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>

              <svg className="text-ink-300 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
