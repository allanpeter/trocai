import { Sidebar } from '@/components/sidebar'
import { NavBar } from '@/components/nav-bar'
import { createClient } from '@/lib/supabase/server'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let username: string | null = null
  let avatarUrl: string | null = null

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', user.id)
      .single()
    username  = profile?.username ?? null
    avatarUrl = profile?.avatar_url ?? null
  }

  const initial = username?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="flex min-h-screen bg-cream-100">
      <Sidebar username={username} avatarUrl={avatarUrl} initial={initial} />
      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        <div className="max-w-[1180px] px-5 lg:px-10 py-8">
          {children}
        </div>
      </main>
      <NavBar />
    </div>
  )
}
