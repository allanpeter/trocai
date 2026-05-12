import { cn } from '@/lib/utils'
import type { MatchResult } from '@/lib/types'

interface MatchCardProps {
  match: MatchResult
  isPending?: boolean
  onInitiateChat?: () => void
}

function AvatarCircle({ name, color, online = false }: { name: string; color?: string; online?: boolean }) {
  return (
    <div className="relative shrink-0">
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center text-white font-display font-bold text-base"
        style={{ background: color ?? '#0FA958' }}
      >
        {name[0].toUpperCase()}
      </div>
      {online && (
        <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-cream-100" />
      )}
    </div>
  )
}

export function MatchCard({ match, isPending = false, onInitiateChat }: MatchCardProps) {
  const stars = Math.round(match.rating)
  return (
    <div
      className={cn(
        'flex items-center gap-4 px-4 py-3.5 bg-white border border-[#E7DDC4] rounded-[14px]',
        'shadow-[var(--sh-1)] cursor-pointer transition-all duration-200',
        'hover:border-green-300 hover:shadow-[var(--sh-2)] hover:-translate-y-px'
      )}
    >
      <AvatarCircle name={match.username} online />

      <div className="flex-1 min-w-0">
        <div className="font-semibold text-[15px] text-ink-800 truncate">
          {match.username}
          {match.city && (
            <span className="font-normal text-ink-400"> · {match.city}</span>
          )}
        </div>
        <div className="text-xs text-ink-400 mt-0.5">
          {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}{' '}
          {match.trades_count} trocas ·{' '}
          <span className="text-green-600 font-medium">
            tem {match.they_have_you_need} que você precisa
          </span>
          {' · '}
          <span className="text-gold-600 font-medium">
            precisa de {match.you_have_they_need} que você tem
          </span>
        </div>
      </div>

      {/* Give/get pill */}
      <div className="hidden sm:flex items-center gap-2 font-mono font-bold text-[13px] bg-cream-100 px-2.5 py-1.5 rounded-[10px] shrink-0">
        <span className="text-gold-700">+{match.they_have_you_need}</span>
        <span className="text-ink-300">⇄</span>
        <span className="text-green-700">+{match.you_have_they_need}</span>
      </div>

      <button
        onClick={onInitiateChat}
        disabled={isPending}
        className="shrink-0 bg-green-500 text-white font-semibold text-[13px] px-3.5 py-2 rounded-[10px] hover:bg-green-600 active:bg-green-700 transition-colors duration-120 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? '…' : 'Conversar'}
      </button>
    </div>
  )
}
