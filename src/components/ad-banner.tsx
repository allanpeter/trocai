'use client'

import { useEffect } from 'react'
import { cn } from '@/lib/utils'

declare global {
  interface Window { adsbygoogle: object[] }
}

interface Props {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal'
  className?: string
}

const MIN_HEIGHT: Record<NonNullable<Props['format']>, number> = {
  auto:       90,
  horizontal: 90,
  rectangle:  250,
}

export function AdBanner({ slot, format = 'auto', className }: Props) {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID

  useEffect(() => {
    if (!publisherId) return
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [publisherId])

  if (!publisherId) return null

  return (
    <div className={cn('overflow-hidden', className)}>
      <p className="text-[10px] text-ink-300 font-medium tracking-wide uppercase mb-1 select-none">
        Publicidade
      </p>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: MIN_HEIGHT[format] }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
