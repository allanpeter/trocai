'use server'

import { createClient } from '@/lib/supabase/server'

export async function initiateTrade(chatId: string, partnerId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  // Upsert: if a trade already exists for this chat, do nothing
  const { data, error } = await supabase
    .from('trades')
    .upsert(
      { chat_id: chatId, initiator_id: user.id, partner_id: partnerId, status: 'pending' },
      { onConflict: 'chat_id', ignoreDuplicates: true }
    )
    .select()
    .single()

  if (error) throw error

  // Send a system message so partner sees the request in chat
  await supabase.from('messages').insert({
    chat_id: chatId,
    sender_id: user.id,
    content: 'quer confirmar a troca',
    message_type: 'trade_initiated',
    metadata: { trade_id: data?.id },
  })

  return data
}

export async function confirmTrade(tradeId: string, chatId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { data: trade, error: fetchError } = await supabase
    .from('trades')
    .select('id, status, initiator_id, partner_id')
    .eq('id', tradeId)
    .single()

  if (fetchError || !trade) throw new Error('Troca não encontrada')
  if (trade.partner_id !== user.id) throw new Error('Só o parceiro pode confirmar')
  if (trade.status !== 'pending') throw new Error('Esta troca já foi processada')

  const { error } = await supabase
    .from('trades')
    .update({ status: 'completed', confirmed_at: new Date().toISOString() })
    .eq('id', tradeId)

  if (error) throw error

  await supabase.from('messages').insert({
    chat_id: chatId,
    sender_id: user.id,
    content: 'confirmou a troca',
    message_type: 'trade_completed',
    metadata: { trade_id: tradeId },
  })
}

export async function suggestSpot(spot: {
  name: string
  type: string
  address: string | null
  city_name: string
  state_code: string
  lat: number
  lng: number
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { error } = await supabase.from('trade_spots').insert({
    ...spot,
    verified:   false,
    created_by: user.id,
  })
  if (error) throw error
}

export async function cancelTrade(tradeId: string, chatId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { error } = await supabase
    .from('trades')
    .update({ status: 'cancelled' })
    .eq('id', tradeId)
    .or(`initiator_id.eq.${user.id},partner_id.eq.${user.id}`)

  if (error) throw error

  await supabase.from('messages').insert({
    chat_id: chatId,
    sender_id: user.id,
    content: 'cancelou a solicitação de troca',
    message_type: 'trade_cancelled',
    metadata: { trade_id: tradeId },
  })
}
