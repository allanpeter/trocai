'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function startChat(otherUserId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const myId = user.id

  // Canonical ordering: smaller UUID first (avoids duplicate chats)
  const [u1, u2] = myId < otherUserId ? [myId, otherUserId] : [otherUserId, myId]

  // Find existing chat
  const { data: existing } = await supabase
    .from('chats')
    .select('id')
    .eq('user1_id', u1)
    .eq('user2_id', u2)
    .maybeSingle()

  if (existing) {
    redirect(`/chat/${existing.id}`)
  }

  // Create new chat
  const { data: created, error } = await supabase
    .from('chats')
    .insert({ user1_id: u1, user2_id: u2 })
    .select('id')
    .single()

  if (error || !created) redirect('/chat')

  redirect(`/chat/${created.id}`)
}
