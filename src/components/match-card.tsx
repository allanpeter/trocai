import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { MatchResultV2 } from '@/lib/types'

interface MatchCardProps {
  match: MatchResultV2
  isPending?: boolean
  existingChatId?: string
  onInitiateChat?: () => void
}

function AvatarCircle({ name, color }: { name: string; color?: string }) {
  return (
    <div
      className="w-11 h-11 rounded-full flex items-center justify-center text-white font-display font-bold text-base shrink-0"
      style={{ background: color ?? '#0FA958' }}
    >
      {name[0].toUpperCase()}
    </div>
  )
}

function formatDistance(km: number | null): string | null {
  if (km === null) return null
  if (km < 1) return '< 1 km'
  if (km < 10) return `${km.toFixed(1)} km`
  return `${Math.round(km)} km`
}

export function MatchCard({ match, isPending = false, existingChatId, onInitiateChat }: MatchCardProps) {
  const stars = Math.round(match.rating)
  const dist  = formatDistance(match.distance_km)

  return (
    <div
      className={cn(
        'flex items-center gap-4 px-4 py-3.5 bg-white border border-[#E7DDC4] rounded-[14px]',
        'shadow-[var(--sh-1)] cursor-pointer transition-all duration-200',
        'hover:border-green-300 hover:shadow-[var(--sh-2)] hover:-translate-y-px'
      )}
    >
      {match.avatar_url ? (
        <Image
          src={match.avatar_url}
          width={44} height={44}
          alt=""
          unoptimized
          className="w-11 h-11 rounded-full object-cover shrink-0"
        />
      ) : (
        <AvatarCircle name={match.username} />
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-[15px] text-ink-800 truncate">
            {match.username}
          </span>
          {match.city_name && (
            <span className="flex items-center gap-1 text-xs text-ink-400 shrink-0">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              {match.city_name}{match.state_code ? `, ${match.state_code}` : ''}
              {dist && <span className="text-green-600 font-medium"> · {dist}</span>}
            </span>
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

      {existingChatId ? (
        <Link
          href={`/chat/${existingChatId}`}
          className="shrink-0 border border-green-500 text-green-600 font-semibold text-[13px] px-3.5 py-2 rounded-[10px] hover:bg-green-50 transition-colors duration-120"
        >
          Ver conversa
        </Link>
      ) : (
        <button
          onClick={onInitiateChat}
          disabled={isPending}
          className="shrink-0 bg-green-500 text-white font-semibold text-[13px] px-3.5 py-2 rounded-[10px] hover:bg-green-600 active:bg-green-700 transition-colors duration-120 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? '…' : 'Conversar'}
        </button>
      )}
    </div>
  )
}
