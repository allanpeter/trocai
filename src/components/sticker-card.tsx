'use client'

import { cn } from '@/lib/utils'
import type { StickerStatus } from '@/lib/types'

interface StickerCardProps {
  number: string
  name: string
  teamColor?: string
  status: StickerStatus
  quantity?: number
  isRare?: boolean
  onClick?: () => void
}

export function StickerCard({
  number,
  name,
  teamColor,
  status,
  quantity = 0,
  isRare = false,
  onClick,
}: StickerCardProps) {
  return (
    <button
      onClick={onClick}
      title={`#${number} ${name}`}
      className={cn(
        'group relative flex flex-col rounded-[14px] border overflow-hidden',
        'bg-white shadow-[var(--sh-2)] transition-all duration-200',
        'cursor-pointer focus-visible:outline-none focus-visible:shadow-[var(--sh-glow-green)]',
        'hover:-translate-y-0.5 hover:-rotate-1 hover:shadow-[var(--sh-3)]',
        isRare && 'border-2 border-gold-400',
        !isRare && 'border-[#E7DDC4]'
      )}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* Foil overlay for rare cards */}
      {isRare && (
        <div
          className="absolute inset-0 animate-shimmer opacity-40 pointer-events-none rounded-[12px] z-0"
          aria-hidden
        />
      )}

      {/* Card face */}
      <div
        className={cn(
          'relative z-[1] aspect-[3/4] flex items-center justify-center',
          status === 'have'      && 'bg-green-50',
          status === 'duplicate' && 'bg-gold-50',
          status === 'need'      && 'bg-[repeating-linear-gradient(45deg,#F5EDD9_0_8px,#ECDFBE_8px_16px)]',
          isRare && status !== 'need' && '!bg-white/60',
        )}
        style={
          (status === 'have' || status === 'duplicate') && teamColor
            ? { color: teamColor }
            : undefined
        }
      >
        {status === 'need' ? (
          <span className="font-display font-extrabold text-5xl text-ink-300">?</span>
        ) : (
          <span className="font-display font-extrabold text-5xl">{name[0]}</span>
        )}

        {/* Dupe quantity badge */}
        {status === 'duplicate' && quantity > 1 && (
          <span className="absolute top-1.5 right-1.5 bg-gold-400 text-ink-800 font-mono font-bold text-[10px] px-1.5 py-0.5 rounded-[6px]">
            ×{quantity}
          </span>
        )}

        {/* Foil corner triangle */}
        {isRare && (
          <span
            className="absolute top-0 right-0 w-0 h-0 border-solid border-transparent border-gold-400 z-10"
            style={{ borderWidth: '0 16px 16px 0' }}
            aria-hidden
          />
        )}
      </div>

      {/* Bottom bar */}
      <div
        className={cn(
          'relative z-[1] flex items-center justify-between px-2.5 py-2',
          isRare ? 'bg-white/92' : 'bg-white'
        )}
      >
        <span
          className={cn(
            't-num text-[11px]',
            status === 'have'      && 'text-green-600',
            status === 'duplicate' && 'text-gold-700',
            status === 'need'      && 'text-rare-400',
            !['have','duplicate','need'].includes(status) && 'text-ink-800'
          )}
        >
          #{number}
        </span>
        <span className="font-body font-semibold text-[11px] text-ink-700 max-w-[80px] truncate">
          {status === 'need' ? '—' : name}
        </span>
      </div>
    </button>
  )
}
