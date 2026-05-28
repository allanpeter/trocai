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
    .select('city, city_name, state_code')
    .eq('id', user.id)
    .single()

  const [{ data: matches, error }, { data: existingChats }] = await Promise.all([
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
  ])

  // Map otherUserId → chatId for quick lookup in cards
  const chatByUser = new Map(
    (existingChats ?? []).map(c => [
      c.user1_id === user.id ? c.user2_id : c.user1_id,
      c.id,
    ])
  )

  const userCity = profile?.city_name ?? profile?.city ?? null
  const userState = safeStateCode(profile?.state_code) ?? null

  return (
    <MatchesList
      matches={matches ?? []}
      userCity={userCity}
      userState={userState}
      hasError={!!error}
      activeRadius={radiusKm}
      chatByUser={chatByUser}
    />
  )
}
