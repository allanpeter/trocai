import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AlbumGrid } from '@/components/album-grid'

interface Props {
  params: Promise<{ id: string }>
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stickerList = (stickers ?? []).map((s: any) => ({
    id:       s.id as string,
    number:   s.number as number,
    code:     (s.code ?? null) as string | null,
    name:     s.name as string | null,
    team:     s.team as string | null,
    is_rare:  s.is_rare as boolean,
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
