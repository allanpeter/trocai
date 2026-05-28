import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { startChat } from '../../matches/actions'
import { RatingForm } from '@/components/rating-form'
import { AdBanner } from '@/components/ad-banner'
import { cn } from '@/lib/utils'

interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?username=eq.${username}&select=username,full_name,city,city_name,state,state_code,bio,rating,trades_count`,
    {
      headers: {
        apikey:        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
      },
      next: { revalidate: 3600 },
    }
  )
  const profiles = await res.json()
  const p = profiles[0]
  if (!p) return { title: 'Perfil não encontrado' }

  const title = `@${p.username} · trocai`
  const description = p.bio
    || `${p.full_name || '@' + p.username} troca figurinhas da Copa 2026${(p.city_name ?? p.city) ? ` em ${p.city_name ?? p.city}` : ''}. ${p.trades_count} troca${p.trades_count !== 1 ? 's' : ''} concluída${p.trades_count !== 1 ? 's' : ''}.`

  return {
    title,
    description,
    alternates: { canonical: `https://www.trocai.app/profile/${p.username}` },
    openGraph: { title, description, type: 'profile' },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, full_name, city, state, city_name, state_code, avatar_url, bio, rating, trades_count, created_at')
    .eq('username', username)
    .single()

  if (!profile) notFound()

  // Redirect own profile to /profile
  if (user && profile.id === user.id) {
    const { redirect } = await import('next/navigation')
    redirect('/profile')
  }

  const [{ data: userStickers }, { data: rawRatings }, alreadyRatedResult] = await Promise.all([
    supabase
      .from('user_stickers')
      .select('status, quantity')
      .eq('user_id', profile.id),
    supabase
      .from('ratings')
      .select('id, score, comment, created_at, rater_id, profiles!rater_id(id, username, avatar_url)')
      .eq('rated_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(10),
    user
      ? supabase.from('ratings').select('id').eq('rater_id', user.id).eq('rated_id', profile.id).is('trade_id', null).maybeSingle()
      : Promise.resolve({ data: null }),
  ])

  const stats = (userStickers ?? []).reduce(
    (acc, us) => {
      if (us.status === 'have')      acc.have++
      if (us.status === 'duplicate') acc.dupe += us.quantity
      if (us.status === 'need')      acc.need++
      return acc
    },
    { have: 0, dupe: 0, need: 0 }
  )

  const ratings = (rawRatings ?? []) as Array<NonNullable<typeof rawRatings>[number] & { profiles: { id: string; username: string; avatar_url: string | null } | null }>

  const alreadyRated = !!(alreadyRatedResult as { data: unknown }).data

  const stars = Math.round(profile.rating ?? 0)
  const memberSince = new Date(profile.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.full_name || `@${profile.username}`,
    url: `https://www.trocai.app/profile/${profile.username}`,
    ...(profile.city_name ?? profile.city
      ? { homeLocation: { '@type': 'Place', name: `${profile.city_name ?? profile.city}${profile.state_code ?? profile.state ? `, ${profile.state_code ?? profile.state}` : ''}` } }
      : {}),
    ...(profile.bio ? { description: profile.bio } : {}),
  }

  return (
    <div className="flex flex-col gap-6 max-w-[600px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <Link href="/search" className="flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-700 transition-colors w-fit -mb-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Voltar
      </Link>

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-[#E7DDC4] shadow-[var(--sh-1)] p-6">
        <div className="flex items-start gap-5">
          {profile.avatar_url ? (
            <Image src={profile.avatar_url} width={72} height={72} alt="" className="w-[72px] h-[72px] rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-[72px] h-[72px] rounded-full bg-green-500 flex items-center justify-center text-white font-display font-extrabold text-3xl shrink-0">
              {profile.username[0].toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-2xl text-ink-800 tracking-tight">@{profile.username}</h1>
            {profile.full_name && <p className="text-ink-500 text-sm mt-0.5">{profile.full_name}</p>}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm text-ink-400">
              {(profile.city_name ?? profile.city) && (
                <span className="flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {profile.city_name ?? profile.city}
                  {(profile.state_code ?? profile.state) ? `, ${profile.state_code ?? profile.state}` : ''}
                </span>
              )}
              <span>Membro desde {memberSince}</span>
            </div>
            {profile.rating > 0 && (
              <div className="mt-2 text-sm text-gold-600 font-semibold">
                {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}{' '}
                <span className="text-ink-500 font-normal">{profile.rating.toFixed(1)} · {profile.trades_count} troca{profile.trades_count !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>
        {profile.bio && (
          <p className="mt-4 text-sm text-ink-600 leading-relaxed border-t border-[#E7DDC4] pt-4">{profile.bio}</p>
        )}
      </div>

      {/* Sticker stats */}
      {(stats.have + stats.dupe + stats.need) > 0 && (
        <div className="bg-white rounded-2xl border border-[#E7DDC4] shadow-[var(--sh-1)] p-5">
          <h2 className="font-semibold text-base text-ink-800 mb-4">Copa do Mundo 2026</h2>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-green-50 rounded-xl p-3">
              <div className="t-num font-bold text-2xl text-green-700">{stats.have}</div>
              <div className="text-xs text-green-600 font-medium mt-0.5">Tem</div>
            </div>
            <div className="bg-gold-50 rounded-xl p-3">
              <div className="t-num font-bold text-2xl text-gold-700">{stats.dupe}</div>
              <div className="text-xs text-gold-600 font-medium mt-0.5">Duplicadas</div>
            </div>
            <div className="bg-cream-100 rounded-xl p-3">
              <div className="t-num font-bold text-2xl text-ink-500">{stats.need}</div>
              <div className="text-xs text-ink-400 font-medium mt-0.5">Precisa</div>
            </div>
          </div>
        </div>
      )}

      {/* Ad only when profile has meaningful content — avoids thin-content+ad penalty */}
      {(profile.bio || stats.have + stats.dupe + stats.need > 0 || profile.trades_count > 0) && (
        <AdBanner slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_PROFILE ?? ''} format="rectangle" />
      )}

      {/* Chat CTA — only for logged in users */}
      {user ? (
        <form action={startChat.bind(null, profile.id)}>
          <button
            type="submit"
            className={cn(
              'w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl',
              'bg-green-500 text-white font-semibold text-base',
              'shadow-[var(--sh-2)] hover:bg-green-600 active:bg-green-700 transition-all duration-150',
            )}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Conversar com @{profile.username}
          </button>
        </form>
      ) : (
        <Link
          href="/signup"
          className={cn(
            'w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl',
            'bg-green-500 text-white font-semibold text-base text-center',
            'shadow-[var(--sh-2)] hover:bg-green-600 transition-all duration-150',
          )}
        >
          Criar conta para conversar
        </Link>
      )}

      {/* Rating */}
      {user && (
        <div className="bg-white rounded-2xl border border-[#E7DDC4] shadow-[var(--sh-1)] p-5">
          <h2 className="font-semibold text-base text-ink-800 mb-1">
            {alreadyRated ? 'Sua avaliação' : 'Avaliar troca'}
          </h2>
          {alreadyRated ? (
            <p className="text-sm text-ink-400 py-3">Você já avaliou @{profile.username}.</p>
          ) : (
            <>
              <p className="text-sm text-ink-400 mb-4">Você trocou figurinhas com @{profile.username}? Deixe sua avaliação.</p>
              <RatingForm ratedId={profile.id} ratedUsername={profile.username} />
            </>
          )}
        </div>
      )}

      {/* Ratings list */}
      {ratings.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E7DDC4] shadow-[var(--sh-1)] p-5">
          <h2 className="font-semibold text-base text-ink-800 mb-4">
            Avaliações <span className="text-ink-400 font-normal">({ratings.length})</span>
          </h2>
          <div className="flex flex-col divide-y divide-[#E7DDC4]">
            {ratings.map(r => (
              <div key={r.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-start gap-3">
                  {r.profiles?.avatar_url ? (
                    <Image src={r.profiles.avatar_url} width={32} height={32} alt="" unoptimized className="w-8 h-8 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-display font-bold text-sm shrink-0">
                      {r.profiles?.username?.[0]?.toUpperCase() ?? '?'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm text-ink-700">@{r.profiles?.username ?? 'anônimo'}</span>
                      <span className="text-[11px] text-ink-300 shrink-0">{formatDate(r.created_at)}</span>
                    </div>
                    <div className="text-gold-400 text-sm mt-0.5">
                      {'★'.repeat(r.score)}<span className="text-ink-200">{'★'.repeat(5 - r.score)}</span>
                    </div>
                    {r.comment && <p className="text-sm text-ink-600 mt-1.5 leading-relaxed">{r.comment}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
