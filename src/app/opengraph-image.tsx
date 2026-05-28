import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'trocai — Troca figurinhas da Copa 2026'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage() {
  const fontData = await fetch(
    'https://fonts.gstatic.com/s/bricolagegrotesque/v9/3y9U6as8bTXq_nANBjzKo3IeZx8z6up3BsBajLIAK4UwBZQUhqwCFRSHRBOkjS7lgQ.woff2'
  ).then(r => r.arrayBuffer()).catch(() => null)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#1C3B2A',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px 96px',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: fontData ? 'Bricolage' : 'sans-serif',
        }}
      >
        {/* Background decoration — large faded circles */}
        <div style={{
          position: 'absolute',
          top: -180,
          right: -180,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'rgba(61,185,106,0.12)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -140,
          left: 600,
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: 'rgba(245,197,24,0.07)',
          display: 'flex',
        }} />

        {/* Sticker cards decoration — top right */}
        {[
          { top: 60, right: 180, rotate: '-8deg', bg: '#006847' },
          { top: 30, right: 80,  rotate: '4deg',  bg: '#003DA5' },
          { top: 90, right: 300, rotate: '-14deg', bg: '#C60C30' },
        ].map((card, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: card.top,
              right: card.right,
              width: 110,
              height: 154,
              borderRadius: 12,
              background: `linear-gradient(160deg, ${card.bg} 0%, #0a0a0a 100%)`,
              transform: `rotate(${card.rotate})`,
              opacity: 0.55,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingBottom: 8,
              boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex',
            }} />
          </div>
        ))}

        {/* Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 32,
        }}>
          <div style={{
            background: '#3DB96A',
            color: 'white',
            fontSize: 18,
            fontWeight: 700,
            padding: '6px 18px',
            borderRadius: 100,
            letterSpacing: '0.06em',
            display: 'flex',
          }}>
            Copa do Mundo 2026
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            color: '#7AC99B',
            fontSize: 18,
            fontWeight: 600,
            padding: '6px 18px',
            borderRadius: 100,
            display: 'flex',
          }}>
            Grátis
          </div>
        </div>

        {/* Logo / wordmark */}
        <div style={{
          fontSize: 108,
          fontWeight: 900,
          color: '#F5F0E8',
          letterSpacing: '-5px',
          lineHeight: 0.95,
          marginBottom: 28,
          display: 'flex',
        }}>
          trocai
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: 30,
          color: '#A8C8B8',
          fontWeight: 400,
          lineHeight: 1.45,
          maxWidth: 620,
          display: 'flex',
        }}>
          Encontra quem mora perto e tem as figurinhas que você precisa. Cadastra, marca, troca.
        </div>

        {/* URL */}
        <div style={{
          position: 'absolute',
          bottom: 48,
          left: 96,
          fontSize: 20,
          color: 'rgba(255,255,255,0.3)',
          display: 'flex',
          letterSpacing: '0.02em',
        }}>
          trocai.app
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
