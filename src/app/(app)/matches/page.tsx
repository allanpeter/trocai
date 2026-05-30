import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MatchesList } from './matches-list'
import { safeStateCode } from '@/lib/utils'

const COPA_ALBUM_ID = '00000000-0000-0000-0000-000000000001'
const VALID_RADII = [10, 30, 100] as const

interface Props {
  searchParams: Promise<{ r?: string }>
}

export default async function MatchesPage({ searchParams }: Props) {
  const { r } = await searchParams
  const radiusKm = VALID_RADII.find(v => String(v) === r) ?? null

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('city, city_name, state_code, lat, lng')
    .eq('id', user.id)
    .single()

  const [{ data: matches, error }, { data: existingChats }, { data: rawNearbySpots }] = await Promise.all([
    supabase.rpc('find_matches_v2', {
      p_user_id:   user.id,
      p_album_id:  COPA_ALBUM_ID,
      p_limit:     50,
      p_radius_km: radiusKm,
    }),
    supabase
      .from('chats')
      .select('id, user1_id, user2_id')
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`),
    profile?.state_code
      ? supabase
          .from('trade_spots')
          .select('id, name, type, city_name, state_code, lat, lng')
          .eq('state_code', profile.state_code)
          .order('verified',  { ascending: false })
          .order('popularity', { ascending: false })
          .limit(20)
      : Promise.resolve({ data: [] as { id: string; name: string; type: string; city_name: string; state_code: string; lat: number; lng: number }[] }),
  ])

  // Map otherUserId → chatId for quick lookup in cards
  const chatByUser = new Map(
    (existingChats ?? []).map(c => [
      c.user1_id === user.id ? c.user2_id : c.user1_id,
      c.id,
    ])
  )

  const userCity  = profile?.city_name ?? profile?.city ?? null
  const userState = safeStateCode(profile?.state_code) ?? null

  // Pick up to 3 spots nearest to the current user
  const userLat = profile?.lat ?? null
  const userLng = profile?.lng ?? null
  const nearbySpots = (rawNearbySpots ?? [])
    .map(s => {
      const distKm = userLat != null && userLng != null
        ? Math.round(Math.sqrt((s.lat - userLat) ** 2 + (s.lng - userLng) ** 2) * 111)
        : null
      return { ...s, distKm }
    })
    .sort((a, b) => (a.distKm ?? 9999) - (b.distKm ?? 9999))
    .slice(0, 3)

  return (
    <MatchesList
      matches={matches ?? []}
      userCity={userCity}
      userState={userState}
      hasError={!!error}
      activeRadius={radiusKm}
      chatByUser={chatByUser}
      nearbySpots={nearbySpots}
    />
  )
}
