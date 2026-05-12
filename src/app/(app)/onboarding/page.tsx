import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OnboardingClient } from './onboarding-client'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: albums } = await supabase
    .from('albums')
    .select('id, name, year, total_stickers')
    .order('year', { ascending: false })

  return <OnboardingClient userId={user.id} albums={albums ?? []} />
}
