import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MatchesList } from './matches-list'

const COPA_ALBUM_ID = '00000000-0000-0000-0000-000000000001'

export default async function MatchesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('city, city_name, state_code')
    .eq('id', user.id)
    .single()

  const { data: matches, error } = await supabase.rpc('find_matches_v2', {
    p_user_id:  user.id,
    p_album_id: COPA_ALBUM_ID,
    p_limit:    50,
  })

  const userCity = profile?.city_name ?? profile?.city ?? null
  const userState = profile?.state_code ?? null

  return (
    <MatchesList
      matches={matches ?? []}
      userCity={userCity}
      userState={userState}
      hasError={!!error}
    />
  )
}
