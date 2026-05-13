'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function rateUser(ratedId: string, score: number, comment: string) {
  if (score < 1 || score > 5) throw new Error('Pontuação inválida')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')
  if (user.id === ratedId) throw new Error('Não podes avaliar-te a ti mesmo')

  // One rating per pair (trade_id = null) — check before inserting
  const { data: existing } = await supabase
    .from('ratings')
    .select('id')
    .eq('rater_id', user.id)
    .eq('rated_id', ratedId)
    .is('trade_id', null)
    .maybeSingle()

  if (existing) throw new Error('Já avaliaste este utilizador')

  const { error } = await supabase
    .from('ratings')
    .insert({
      rater_id: user.id,
      rated_id: ratedId,
      score,
      comment: comment.trim() || null,
      trade_id: null,
    })

  if (error) throw error

  // Trigger update_profile_rating fires automatically via DB trigger
  revalidatePath(`/profile`)
}
