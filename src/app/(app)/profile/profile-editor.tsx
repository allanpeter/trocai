'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { CityAutocomplete } from '@/components/city-autocomplete'
import type { CitySelection } from '@/components/city-autocomplete'
import type { Profile } from '@/lib/types'

type EditableProfile = Pick<
  Profile,
  'id' | 'username' | 'full_name' | 'city' | 'state' | 'city_name' | 'state_code' | 'avatar_url' | 'bio' | 'rating' | 'trades_count'
>

export function ProfileEditor({ profile }: { profile: EditableProfile }) {
  const router   = useRouter()
  const supabase = createClient()

  const [fullName, setFullName]   = useState(profile.full_name ?? '')
  const [bio, setBio]             = useState(profile.bio ?? '')
  const [citySel, setCitySel]     = useState<CitySelection | null>(null)
  const [saving, setSaving]       = useState(false)
  const [dirty, setDirty]         = useState(false)

  function markDirty(setter: (v: string) => void) {
    return (v: string) => { setter(v); setDirty(true) }
  }

  function handleCitySelect(city: CitySelection | null) {
    setCitySel(city)
    setDirty(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const update: Record<string, unknown> = {
        full_name: fullName.trim() || null,
        bio:       bio.trim()      || null,
      }

      if (citySel) {
        update.city       = citySel.city_name
        update.state      = citySel.state_code
        update.city_id    = citySel.city_id
        update.city_name  = citySel.city_name
        update.state_code = citySel.state_code
        update.state_name = citySel.state_name
        update.lat        = citySel.lat
        update.lng        = citySel.lng
      } else if (citySel === null && dirty) {
        // User cleared the city field explicitly
        update.city       = null
        update.state      = null
        update.city_id    = null
        update.city_name  = null
        update.state_code = null
        update.state_name = null
        update.lat        = null
        update.lng        = null
      }

      const { error } = await supabase
        .from('profiles')
        .update(update)
        .eq('id', profile.id)

      if (error) throw error
      toast.success('Perfil atualizado!')
      setDirty(false)
      router.refresh()
    } catch {
      toast.error('Não foi possível salvar. Tente de novo.')
    } finally {
      setSaving(false)
    }
  }

  const stars = Math.round(profile.rating ?? 0)

  const inputCls = cn(
    'w-full px-4 py-3 rounded-xl border border-[#E7DDC4] bg-white',
    'font-body text-sm text-ink-800 placeholder:text-ink-300',
    'outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20',
  )

  const currentCity = profile.city_name ?? profile.city
  const currentState = profile.state_code ?? profile.state

  return (
    <div className="flex flex-col gap-6 max-w-[600px]">
      {/* Header */}
      <div>
        <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-ink-400 mb-1">
          Conta
        </p>
        <h1 className="font-display font-bold text-[28px] tracking-tight text-ink-800">
          Meu perfil
        </h1>
      </div>

      {/* Avatar + stats card */}
      <div className="flex items-center gap-5 p-5 bg-white rounded-2xl border border-[#E7DDC4] shadow-[var(--sh-1)]">
        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white font-display font-extrabold text-2xl shrink-0">
          {profile.username[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display font-bold text-xl text-ink-800">@{profile.username}</div>
          {profile.rating > 0 && (
            <div className="text-sm text-gold-600 font-semibold mt-0.5">
              {'★'.repeat(stars)}{'☆'.repeat(5 - stars)} {profile.rating.toFixed(1)}
            </div>
          )}
          <div className="text-xs text-ink-400 mt-1">
            {profile.trades_count} troca{profile.trades_count !== 1 ? 's' : ''} concluída{profile.trades_count !== 1 ? 's' : ''}
          </div>
          {currentCity && (
            <div className="flex items-center gap-1 mt-1 text-xs text-ink-400">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              {currentCity}{currentState ? `, ${currentState}` : ''}
            </div>
          )}
        </div>
      </div>

      {/* Edit form */}
      <div className="bg-white rounded-2xl border border-[#E7DDC4] shadow-[var(--sh-1)] p-5 flex flex-col gap-4">
        <h2 className="font-semibold text-base text-ink-800">Editar informações</h2>

        <div>
          <label className="block text-xs font-semibold text-ink-600 mb-1.5 tracking-wide">Nome completo</label>
          <input
            type="text"
            placeholder="Seu nome"
            value={fullName}
            onChange={e => markDirty(setFullName)(e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-600 mb-1.5 tracking-wide">
            Cidade{' '}
            <span className="font-normal text-ink-300">(melhora os matches por proximidade)</span>
          </label>
          <CityAutocomplete
            defaultValue={currentCity ? `${currentCity}${currentState ? `, ${currentState}` : ''}` : ''}
            onSelect={handleCitySelect}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-600 mb-1.5 tracking-wide">Bio</label>
          <textarea
            placeholder="Fale um pouco sobre você e suas trocas..."
            value={bio}
            onChange={e => markDirty(setBio)(e.target.value)}
            rows={3}
            className={cn(inputCls, 'resize-none')}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !dirty}
          className={cn(
            'w-full py-3 rounded-xl font-semibold text-sm transition-all duration-150',
            'bg-green-500 text-white hover:bg-green-600 active:bg-green-700',
            'disabled:opacity-40 disabled:cursor-not-allowed',
          )}
        >
          {saving ? 'Salvando…' : 'Salvar alterações'}
        </button>
      </div>

      {/* Public profile link */}
      <p className="text-xs text-ink-400 text-center">
        Perfil público:{' '}
        <a
          href={`/profile/${profile.username}`}
          className="text-green-600 font-semibold hover:underline"
        >
          trocai.app/profile/{profile.username}
        </a>
      </p>
    </div>
  )
}
