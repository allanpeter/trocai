import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileEditor } from './profile-editor'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, full_name, city, state, city_name, state_code, avatar_url, bio, rating, trades_count')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/onboarding')

  return <ProfileEditor profile={profile} />
}
