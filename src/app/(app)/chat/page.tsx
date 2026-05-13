import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export default async function ChatListPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch all chats for this user, joining other user's profile + last message
  const { data: chats } = await supabase
    .from('chats')
    .select(`
      id,
      user1_id,
      user2_id,
      last_message_at,
      messages (
        content,
        created_at,
        sender_id,
        read
      )
    `)
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
    .order('last_message_at', { ascending: false })
    .limit(50)

  // Collect the other user's IDs
  const otherIds = (chats ?? []).map(c =>
    c.user1_id === user.id ? c.user2_id : c.user1_id
  )

  const { data: profiles } = otherIds.length > 0
    ? await supabase
        .from('profiles')
        .select('id, username, avatar_url, city')
        .in('id', otherIds)
    : { data: [] }

  const profileMap = new Map((profiles ?? []).map(p => [p.id, p]))

  // For each chat, get last message and unread count
  interface ChatRow {
    id: string
    user1_id: string
    user2_id: string
    last_message_at: string
    messages: Array<{ content: string; created_at: string; sender_id: string; read: boolean }>
  }

  const enriched = (chats as ChatRow[] ?? []).map(c => {
    const otherId = c.user1_id === user.id ? c.user2_id : c.user1_id
    const other   = profileMap.get(otherId)
    const msgs    = [...(c.messages ?? [])].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    const lastMsg  = msgs[0] ?? null
    const unread   = msgs.filter(m => !m.read && m.sender_id !== user.id).length
    return { ...c, other, lastMsg, unread }
  })

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1)   return 'agora'
    if (m < 60)  return `${m}m`
    const h = Math.floor(m / 60)
    if (h < 24)  return `${h}h`
    return `${Math.floor(h / 24)}d`
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-ink-400 mb-1">
          Mensagens
        </p>
        <h1 className="font-display font-bold text-[28px] tracking-tight text-ink-800">
          Conversas
        </h1>
      </div>

      {enriched.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-cream-200 flex items-center justify-center text-3xl">💬</div>
          <p className="font-display font-bold text-xl text-ink-800">Nenhuma conversa ainda</p>
          <p className="text-sm text-ink-400 max-w-[280px]">
            Encontra os teus matches e começa a negociar figurinhas.
          </p>
          <Link
            href="/matches"
            className="mt-1 px-5 py-2.5 rounded-xl bg-green-500 text-white font-semibold text-sm hover:bg-green-600 transition-colors"
          >
            Ver matches
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {enriched.map(chat => (
            <Link
              key={chat.id}
              href={`/chat/${chat.id}`}
              className={cn(
                'flex items-center gap-4 px-4 py-3.5 rounded-[14px]',
                'transition-all duration-150 hover:-translate-y-px',
                chat.unread > 0
                  ? 'bg-green-50 border border-green-200 shadow-[var(--sh-1)]'
                  : 'bg-white border border-[#E7DDC4] hover:border-ink-200 hover:shadow-[var(--sh-1)]'
              )}
            >
              {/* Avatar */}
              {chat.other?.avatar_url ? (
                <Image
                  src={chat.other.avatar_url} width={44} height={44} alt=""
                  className="w-11 h-11 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-green-500 flex items-center justify-center text-white font-display font-bold text-base shrink-0">
                  {chat.other?.username?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={cn(
                    'text-[15px] truncate',
                    chat.unread > 0 ? 'font-bold text-ink-800' : 'font-semibold text-ink-700'
                  )}>
                    {chat.other?.username ?? 'Utilizador'}
                  </span>
                  <span className="text-xs text-ink-300 shrink-0">
                    {chat.lastMsg ? timeAgo(chat.lastMsg.created_at) : ''}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p className={cn(
                    'text-sm truncate',
                    chat.unread > 0 ? 'text-ink-600 font-medium' : 'text-ink-400'
                  )}>
                    {chat.lastMsg?.content ?? 'Nenhuma mensagem ainda'}
                  </p>
                  {chat.unread > 0 && (
                    <span className="shrink-0 w-5 h-5 rounded-full bg-green-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {chat.unread > 9 ? '9+' : chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
