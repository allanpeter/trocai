import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ChatThread } from './chat-thread'

interface Props {
  params: Promise<{ id: string }>
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
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

  const [{ data: myProfile }, { data: otherProfile }, { data: messages }, { data: activeTrade }] = await Promise.all([
    supabase.from('profiles').select('lat, lng, state_code').eq('id', user.id).single(),
    supabase.from('profiles').select('id, username, avatar_url, city, lat, lng, state_code').eq('id', otherId).single(),
    supabase.from('messages').select('id, sender_id, content, read, created_at, message_type, metadata').eq('chat_id', id).order('created_at', { ascending: false }).limit(50),
    supabase.from('trades').select('id, status, initiator_id, partner_id').eq('chat_id', id).not('status', 'eq', 'cancelled').maybeSingle(),
  ])

  const stateFilter = [myProfile?.state_code, otherProfile?.state_code].filter((s): s is string => !!s)
  const spotsQuery = supabase
    .from('trade_spots')
    .select('id, name, type, address, city_name, state_code, lat, lng, verified')
    .order('verified', { ascending: false })
    .order('popularity',  { ascending: false })
    .limit(30)
  const { data: rawSpots } = stateFilter.length > 0
    ? await spotsQuery.in('state_code', stateFilter)
    : await spotsQuery

  // Mark messages from the other user as read
  await supabase
    .from('messages')
    .update({ read: true })
    .eq('chat_id', id)
    .eq('read', false)
    .neq('sender_id', user.id)

  // OSM fallback: when no pre-seeded spots exist for this city pair, fetch live from Overpass
  type RawSpot = { id: string; name: string; type: string; address: string | null; city_name: string; state_code: string; lat: number; lng: number; verified: boolean }
  let spotsSource: RawSpot[] = (rawSpots ?? []) as RawSpot[]

  if (spotsSource.length === 0) {
    const myLat0 = myProfile?.lat
    const myLng0 = myProfile?.lng
    const otherLat0 = otherProfile?.lat
    const otherLng0 = otherProfile?.lng
    if (myLat0 != null && myLng0 != null) {
      const midLat = otherLat0 != null ? (myLat0 + otherLat0) / 2 : myLat0
      const midLng = otherLng0 != null ? (myLng0 + otherLng0) / 2 : myLng0
      const osmQuery = `[out:json][timeout:8];(node["amenity"~"cafe|library"]["name"](around:5000,${midLat},${midLng});node["leisure"="park"]["name"](around:5000,${midLat},${midLng});way["shop"="mall"]["name"](around:5000,${midLat},${midLng}););out center 6;`
      try {
        const res = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          body: `data=${encodeURIComponent(osmQuery)}`,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'trocai/1.0' },
          signal: AbortSignal.timeout(8000),
        })
        if (res.ok) {
          const json = await res.json()
          const amenityToType: Record<string, string> = { cafe: 'cafeteria', library: 'biblioteca' }
          spotsSource = ((json.elements ?? []) as Array<{ id: number; lat?: number; lon?: number; center?: { lat: number; lon: number }; tags: Record<string, string> }>)
            .filter(el => el.tags?.name && (el.lat ?? el.center?.lat))
            .slice(0, 6)
            .map(el => ({
              id: `osm-${el.id}`,
              name: el.tags.name,
              type: amenityToType[el.tags.amenity] ?? (el.tags.leisure === 'park' ? 'parque' : 'shopping'),
              address: null,
              city_name: otherProfile?.city ?? '',
              state_code: otherProfile?.state_code ?? '',
              lat: el.lat ?? el.center!.lat,
              lng: el.lon ?? el.center!.lon,
              verified: false,
            }))
        }
      } catch { /* silent — chat still works without spots */ }
    }
  }

  // Sort spots by distance from midpoint between the two users (fallback: popularity order)
  const myLat = myProfile?.lat
  const myLng = myProfile?.lng
  const otherLat = otherProfile?.lat
  const otherLng = otherProfile?.lng

  const tradeSpots = spotsSource.map(spot => {
    let distanceKm: number | null = null
    if (myLat != null && myLng != null && otherLat != null && otherLng != null) {
      const midLat = (myLat + otherLat) / 2
      const midLng = (myLng + otherLng) / 2
      distanceKm = Math.round(haversineKm(midLat, midLng, spot.lat, spot.lng))
    } else if (myLat != null && myLng != null) {
      distanceKm = Math.round(haversineKm(myLat, myLng, spot.lat, spot.lng))
    }
    return { ...spot, distanceKm }
  }).sort((a, b) => {
    if (a.distanceKm == null && b.distanceKm == null) return 0
    if (a.distanceKm == null) return 1
    if (b.distanceKm == null) return -1
    return a.distanceKm - b.distanceKm
  })

  const orderedMessages = (messages ?? []).slice().reverse()

  return (
    <ChatThread
      chatId={id}
      currentUserId={user.id}
      otherUser={otherProfile ?? { id: otherId, username: 'Usuário', avatar_url: null, city: null }}
      initialMessages={orderedMessages}
      hasMore={(messages ?? []).length === 50}
      activeTrade={activeTrade ?? null}
      tradeSpots={tradeSpots}
    />
  )
}
