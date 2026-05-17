import { Sidebar } from '@/components/sidebar'
import { NavBar } from '@/components/nav-bar'
import { NotificationsBell } from '@/components/notifications-bell'
import { createClient } from '@/lib/supabase/server'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let username: string | null = null
  let avatarUrl: string | null = null
  let notifCount = 0
  let notifList: Parameters<typeof NotificationsBell>[0]['initialNotifs'] = []

  if (user) {
    const [{ data: profile }, { data: notifs }] = await Promise.all([
      supabase.from('profiles').select('username, avatar_url').eq('id', user.id).single(),
      supabase.from('notifications').select('id, type, title, body, data, read, created_at')
        .eq('user_id', user.id).order('created_at', { ascending: false }).limit(30),
    ])
    username  = profile?.username ?? null
    avatarUrl = profile?.avatar_url ?? null
    notifList  = (notifs ?? []) as typeof notifList
    notifCount = notifList.filter(n => !n.read).length
  }

  const initial = username?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? '?'

  if (!user) {
    return (
      <div className="min-h-screen bg-cream-100">
        <main className="max-w-[1180px] mx-auto px-5 lg:px-10 py-8">
          {children}
        </main>
      </div>
    )
  }

  const bell = (
    <NotificationsBell
      userId={user.id}
      initialCount={notifCount}
      initialNotifs={notifList}
    />
  )

  return (
    <div className="flex min-h-screen bg-cream-100">
      <Sidebar username={username} avatarUrl={avatarUrl} initial={initial} notifBell={bell} />
      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        {/* Mobile-only top bar with bell */}
        <div className="lg:hidden flex items-center justify-end px-5 pt-4 pb-0">
          {bell}
        </div>
        <div className="max-w-[1180px] px-5 lg:px-10 py-8">
          {children}
        </div>
      </main>
      <NavBar />
    </div>
  )
}
