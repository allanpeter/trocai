import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ChatThread } from './chat-thread'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ChatThreadPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Verify this user is a participant
  const { data: chat } = await supabase
    .from('chats')
    .select('id, user1_id, user2_id')
    .eq('id', id)
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
    .single()

  if (!chat) notFound()

  const otherId = chat.user1_id === user.id ? chat.user2_id : chat.user1_id

  const { data: otherProfile } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, city')
    .eq('id', otherId)
    .single()

  // Initial messages (last 50)
  const { data: messages } = await supabase
    .from('messages')
    .select('id, sender_id, content, read, created_at')
    .eq('chat_id', id)
    .order('created_at', { ascending: true })
    .limit(50)

  // Mark messages from the other user as read
  await supabase
    .from('messages')
    .update({ read: true })
    .eq('chat_id', id)
    .eq('read', false)
    .neq('sender_id', user.id)

  return (
    <ChatThread
      chatId={id}
      currentUserId={user.id}
      otherUser={otherProfile ?? { id: otherId, username: 'Utilizador', avatar_url: null, city: null }}
      initialMessages={messages ?? []}
    />
  )
}
