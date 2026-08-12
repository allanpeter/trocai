'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { CityAutocomplete } from '@/components/city-autocomplete'
import type { CitySelection } from '@/components/city-autocomplete'
import type { Album } from '@/lib/types'
import { trackEvent } from '@/lib/analytics'

interface Props {
  userId: string
  albums: Pick<Album, 'id' | 'name' | 'year' | 'total_stickers'>[]
}

export function OnboardingClient({ userId, albums }: Props) {
  const router  = useRouter()
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(
    albums.length === 1 ? albums[0].id : null
  )
  const [citySelection, setCitySelection] = useState<CitySelection | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleStart() {
    if (!selectedAlbum) {
      toast.error('Escolha um álbum para começar.')
      return
    }
    setLoading(true)
    try {
      if (citySelection) {
        const { error } = await supabase
          .from('profiles')
          .update({
            city:       citySelection.city_name,
            state:      citySelection.state_code,
            city_id:    citySelection.city_id,
            city_name:  citySelection.city_name,
            state_code: citySelection.state_code,
            state_name: citySelection.state_name,
            lat:        citySelection.lat,
            lng:        citySelection.lng,
          })
          .eq('id', userId)
        if (error) throw error
      }
      trackEvent('onboarding_completed')
      router.push(`/album/${selectedAlbum}`)
      router.refresh()
    } catch {
      toast.error('Algo deu errado. Tenta de novo.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-[520px]">

        {/* Header */}
        <div className="text-center mb-10">
          <Image
            src="/logo/trocai-mark.svg"
            width={56} height={56}
            alt="trocai"
            className="mx-auto mb-5"
          />
          <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-green-600 mb-2">
            BORA COMEÇAR
          </p>
          <h1 className="font-display font-bold text-[32px] tracking-tight text-ink-800">
            Qual álbum você vai colecionar?
          </h1>
          <p className="text-ink-400 text-sm mt-2">
            Escolha o álbum e comece a registrar suas figurinhas.
          </p>
        </div>

        {/* Album list */}
        <div className="flex flex-col gap-3 mb-8">
          {albums.map(album => {
            const active = selectedAlbum === album.id
            return (
              <button
                key={album.id}
                onClick={() => setSelectedAlbum(album.id)}
                className={cn(
                  'flex items-center gap-4 w-full p-4 rounded-2xl border-2 text-left',
                  'transition-all duration-150',
                  active
                    ? 'border-green-500 bg-green-50 shadow-[var(--sh-glow-green)]'
                    : 'border-[#E7DDC4] bg-white hover:border-ink-200 shadow-[var(--sh-1)]'
                )}
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shrink-0">
                  <span className="text-white font-display font-extrabold text-xl">
                    {album.year.toString().slice(2)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    'font-display font-bold text-[17px] tracking-tight',
                    active ? 'text-green-800' : 'text-ink-800'
                  )}>
                    {album.name}
                  </div>
                  <div className="text-sm text-ink-400 mt-0.5">
                    {album.total_stickers} figurinhas · {album.year}
                  </div>
                </div>
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 shrink-0 transition-all',
                  active ? 'border-green-500 bg-green-500' : 'border-[#E7DDC4]'
                )}>
                  {active && (
                    <svg viewBox="0 0 20 20" fill="white" className="w-full h-full p-0.5">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* City autocomplete */}
        <div className="mb-8">
          <label className="block text-xs font-semibold text-ink-600 mb-1.5 tracking-wide">
            Cidade <span className="font-normal text-ink-300">(opcional — melhora os matches)</span>
          </label>
          <CityAutocomplete onSelect={setCitySelection} />
          <p className="text-xs text-ink-400 mt-1.5">
            Usamos a cidade para encontrar pessoas próximas. Nunca mostramos sua localização exata.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={handleStart}
          disabled={loading || !selectedAlbum}
          className={cn(
            'w-full flex items-center justify-center py-3.5 rounded-xl',
            'bg-green-500 text-white font-semibold text-base',
            'shadow-[var(--sh-2)] hover:bg-green-600 active:bg-green-700',
            'transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          {loading ? 'Preparando…' : 'Começar a colecionar'}
        </button>
      </div>
    </div>
  )
}
