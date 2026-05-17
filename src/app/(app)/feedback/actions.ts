'use server'

import { createClient } from '@/lib/supabase/server'

export async function submitFeedback(type: string, description: string, pageUrl?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { error } = await supabase
    .from('feedback')
    .insert({ user_id: user.id, type, description, page_url: pageUrl })

  if (error) throw error
}
