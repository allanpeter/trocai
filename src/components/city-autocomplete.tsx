'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { City } from '@/lib/types'

export interface CitySelection {
  city_id: string
  city_name: string
  state_code: string
  state_name: string
  lat: number
  lng: number
}

interface Props {
  defaultValue?: string
  placeholder?: string
  onSelect: (city: CitySelection | null) => void
  className?: string
}

const DEBOUNCE_MS = 250

export function CityAutocomplete({ defaultValue = '', placeholder = 'Ex: São Paulo, Curitiba…', onSelect, className }: Props) {
  const supabase = createClient()

  const [query, setQuery]         = useState(defaultValue)
  const [results, setResults]     = useState<City[]>([])
  const [open, setOpen]           = useState(false)
  const [loading, setLoading]     = useState(false)
  const [selected, setSelected]   = useState(!!defaultValue)
  const debounceRef               = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef              = useRef<HTMLDivElement>(null)
  const inputRef                  = useRef<HTMLInputElement>(null)

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); setOpen(false); return }

    setLoading(true)
    const { data, error } = await supabase
      .from('cities')
      .select('id, name, state_code, state_name, lat, lng, is_capital')
      .ilike('name', `%${q}%`)
      .order('is_capital', { ascending: false })
      .order('name', { ascending: true })
      .limit(8)

    if (error) console.error('[CityAutocomplete] search error:', error)
    setResults((data as City[]) ?? [])
    setOpen(true)
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    if (selected) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(query), DEBOUNCE_MS)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, selected, search])

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(city: City) {
    setQuery(`${city.name}, ${city.state_code}`)
    setSelected(true)
    setOpen(false)
    setResults([])
    onSelect({
      city_id:    city.id,
      city_name:  city.name,
      state_code: city.state_code,
      state_name: city.state_name,
      lat:        city.lat,
      lng:        city.lng,
    })
  }

  function handleClear() {
    setQuery('')
    setSelected(false)
    setResults([])
    setOpen(false)
    onSelect(null)
  }

  function handleChange(value: string) {
    setQuery(value)
    setSelected(false)
    if (!value) onSelect(null)
  }

  const inputCls = cn(
    'w-full px-4 py-3 pr-10 rounded-xl border border-[#E7DDC4] bg-white',
    'font-body text-sm text-ink-800 placeholder:text-ink-300',
    'outline-none transition-all duration-150',
    'focus:border-green-500 focus:ring-4 focus:ring-green-500/20',
    selected && 'border-green-400 bg-green-50',
    className
  )

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        {/* Pin icon */}
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300 pointer-events-none"
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>

        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => {
            if (selected) {
              inputRef.current?.select()
            } else if (results.length > 0) {
              setOpen(true)
            }
          }}
          className={cn(inputCls, 'pl-9')}
          autoComplete="off"
        />

        {/* Loading spinner or clear button */}
        {loading ? (
          <svg
            className="absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-ink-300"
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
        ) : query ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-600 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        ) : null}
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <ul className="absolute z-50 w-full mt-1.5 bg-white border border-[#E7DDC4] rounded-xl shadow-[var(--sh-2)] overflow-hidden">
          {results.map(city => (
            <li key={city.id}>
              <button
                type="button"
                onMouseDown={e => { e.preventDefault(); handleSelect(city) }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-cream-100 transition-colors"
              >
                <svg className="shrink-0 text-ink-300" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span className="flex-1 text-sm text-ink-800 font-medium">{city.name}</span>
                <span className="shrink-0 text-xs text-ink-400 font-mono">{city.state_code}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
