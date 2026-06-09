import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AlbumGrid } from '@/components/album-grid'

interface Props {
  params: Promise<{ id: string }>
}

interface RawSticker {
  id: string
  number: number
  code: string | null
  name: string | null
  team: string | null
  is_rare: boolean
}

export default async function AlbumPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch album metadata
  const { data: album } = await supabase
    .from('albums')
    .select('id, name, year, total_stickers')
    .eq('id', id)
    .single()

  if (!album) notFound()

  // Fetch all stickers for this album
  const { data: stickers } = await supabase
    .from('stickers')
    .select('id, number, code, name, team, is_rare')
    .eq('album_id', id)
    .order('number', { ascending: true })

  // Fetch user's sticker statuses for this album
  const { data: userStickers } = await supabase
    .from('user_stickers')
    .select('sticker_id, status, quantity')
    .eq('user_id', user.id)

  const statusMap = new Map(
    (userStickers ?? []).map(us => [us.sticker_id, { status: us.status, quantity: us.quantity }])
  )

  const stickerList = (stickers ?? [] as RawSticker[]).map(s => ({
    id:       s.id,
    number:   s.number,
    code:     s.code,
    name:     s.name,
    team:     s.team,
    is_rare:  s.is_rare,
    status:   statusMap.get(s.id)?.status ?? null,
    quantity: statusMap.get(s.id)?.quantity ?? 1,
  }))

  return (
    <AlbumGrid
      album={album}
      stickers={stickerList}
      userId={user.id}
    />
  )
}
