import { ImageResponse } from 'next/og'
import { safeStateCode } from '@/lib/utils'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface Props {
  params: Promise<{ username: string }>
}

type Profile = {
  username: string
  full_name: string | null
  city_name: string | null
  city: string | null
  state_code: string | null
  state: string | null
  bio: string | null
  rating: number
  trades_count: number
}

function Stars({ score, total = 5 }: { score: number; total?: number }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            fontSize: 28,
            color: i < score ? '#F5C518' : 'rgba(255,255,255,0.2)',
            display: 'flex',
          }}
        >
          ★
        </div>
      ))}
    </div>
  )
}

export default async function ProfileOgImage({ params }: Props) {
  const { username } = await params

  const fontData = await fetch(
    'https://fonts.gstatic.com/s/bricolagegrotesque/v9/3y9U6as8bTXq_nANBjzKo3IeZx8z6up3BsBajLIAK4UwBZQUhqwCFRSHRBOkjS7lgQ.woff2'
  ).then(r => r.arrayBuffer()).catch(() => null)

  let profile: Profile | null = null
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?username=eq.${encodeURIComponent(username)}&select=username,full_name,city_name,city,state_code,state,bio,rating,trades_count`,
      {
        headers: {
          apikey:        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        },
        next: { revalidate: 3600 },
      }
    )
    const data = await res.json()
    profile = data?.[0] ?? null
  } catch {
    // fallback to generic image
  }

  const displayName  = profile?.full_name || `@${username}`
  const handle       = `@${profile?.username ?? username}`
  const city         = profile?.city_name ?? profile?.city ?? null
  const state        = safeStateCode(profile?.state_code ?? profile?.state) ?? null
  const location     = city ? `${city}${state ? `, ${state}` : ''}` : null
  const trades       = profile?.trades_count ?? 0
  const rating       = Math.round(profile?.rating ?? 0)
  const fontFamily   = fontData ? 'Bricolage' : 'sans-serif'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#1C3B2A',
          display: 'flex',
          flexDirection: 'column',
          padding: '72px 96px',
          position: 'relative',
          overflow: 'hidden',
          fontFamily,
        }}
      >
        {/* Background decorations */}
        <div style={{
          position: 'absolute', top: -200, right: -200,
          width: 560, height: 560, borderRadius: '50%',
          background: 'rgba(61,185,106,0.1)', display: 'flex',
        }} />
        <div style={{
          position: 'absolute', bottom: -100, left: 700,
          width: 360, height: 360, borderRadius: '50%',
          background: 'rgba(245,197,24,0.06)', display: 'flex',
        }} />

        {/* Avatar circle */}
        <div style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: '#3DB96A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 32,
          flexShrink: 0,
          border: '3px solid rgba(255,255,255,0.15)',
        }}>
          <span style={{
            fontSize: 52,
            fontWeight: 900,
            color: 'white',
            display: 'flex',
            lineHeight: 1,
          }}>
            {(profile?.username?.[0] ?? username[0]).toUpperCase()}
          </span>
        </div>

        {/* Name + handle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          <div style={{
            fontSize: 64,
            fontWeight: 900,
            color: '#F5F0E8',
            letterSpacing: '-2px',
            lineHeight: 1,
            display: 'flex',
          }}>
            {displayName}
          </div>
          <div style={{
            fontSize: 28,
            color: '#7AC99B',
            fontWeight: 500,
            display: 'flex',
          }}>
            {handle}
          </div>
        </div>

        {/* Location */}
        {location && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 28,
          }}>
            <div style={{ fontSize: 22, display: 'flex' }}>📍</div>
            <div style={{ fontSize: 26, color: 'rgba(255,255,255,0.55)', display: 'flex' }}>
              {location}
            </div>
          </div>
        )}

        {/* Stats row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginTop: 'auto' }}>
          {trades > 0 && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}>
              <div style={{ fontSize: 42, fontWeight: 900, color: '#F5C518', display: 'flex' }}>
                {trades}
              </div>
              <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.4)', display: 'flex' }}>
                trocas concluídas
              </div>
            </div>
          )}

          {rating > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Stars score={rating} />
              <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.4)', display: 'flex' }}>
                avaliação
              </div>
            </div>
          )}
        </div>

        {/* trocai branding — bottom right */}
        <div style={{
          position: 'absolute',
          bottom: 52,
          right: 96,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 4,
        }}>
          <div style={{
            fontSize: 36,
            fontWeight: 900,
            color: 'rgba(255,255,255,0.18)',
            letterSpacing: '-1px',
            display: 'flex',
          }}>
            trocai
          </div>
          <div style={{
            fontSize: 16,
            color: 'rgba(255,255,255,0.18)',
            display: 'flex',
          }}>
            trocai.app
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [{ name: 'Bricolage', data: fontData, style: 'normal', weight: 900 }]
        : [],
    }
  )
}
