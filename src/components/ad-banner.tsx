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
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
