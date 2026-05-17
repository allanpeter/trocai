'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { rateUser } from '@/app/(app)/profile/actions'

interface Props {
  ratedId: string
  ratedUsername: string
}

export function RatingForm({ ratedId, ratedUsername }: Props) {
  const [score, setScore]     = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)

  async function handleSubmit() {
    if (!score) { toast.error('Escolhe uma pontuação.'); return }
    setLoading(true)
    try {
      await rateUser(ratedId, score, comment)
      setDone(true)
      toast.success('Avaliação enviada! Obrigado.')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Algo deu errado.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <span className="text-3xl">🎉</span>
        <p className="font-semibold text-ink-700">Avaliação enviada!</p>
        <p className="text-sm text-ink-400">Obrigado por avaliar @{ratedUsername}.</p>
      </div>
    )
  }

  const display = hovered || score

  return (
    <div className="flex flex-col gap-4">
      {/* Stars */}
      <div>
        <p className="text-xs font-semibold text-ink-600 mb-3 tracking-wide uppercase">
          Pontuação
        </p>
        <div
          className="flex gap-2"
          onMouseLeave={() => setHovered(0)}
        >
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              onClick={() => setScore(n)}
              onMouseEnter={() => setHovered(n)}
              className={cn(
                'text-3xl leading-none transition-all duration-100',
                'hover:scale-125 active:scale-110',
                n <= display ? 'text-gold-400' : 'text-ink-200'
              )}
              title={LABELS[n]}
            >
              ★
            </button>
          ))}
          {display > 0 && (
            <span className="ml-2 text-sm text-ink-500 self-center font-medium">
              {LABELS[display]}
            </span>
          )}
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="block text-xs font-semibold text-ink-600 mb-1.5 tracking-wide uppercase">
          Comentário <span className="font-normal text-ink-300 normal-case">(opcional)</span>
        </label>
        <textarea
          placeholder={`Como foi a troca com @${ratedUsername}?`}
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={3}
          maxLength={300}
          className={cn(
            'w-full px-4 py-3 rounded-xl border border-[#E7DDC4] bg-cream-50',
            'font-body text-sm text-ink-800 placeholder:text-ink-300 resize-none',
            'outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20',
          )}
        />
        {comment.length > 0 && (
          <p className="text-[10px] text-ink-300 mt-1 text-right">{comment.length}/300</p>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !score}
        className={cn(
          'w-full py-3 rounded-xl font-semibold text-sm transition-all duration-150',
          'bg-gold-400 text-ink-800 hover:bg-gold-500 active:bg-gold-600',
          'shadow-[var(--sh-2)]',
          'disabled:opacity-40 disabled:cursor-not-allowed',
        )}
      >
        {loading ? 'Enviando…' : 'Enviar avaliação'}
      </button>
    </div>
  )
}

const LABELS: Record<number, string> = {
  1: 'Péssimo',
  2: 'Ruim',
  3: 'Ok',
  4: 'Bom',
  5: 'Excelente!',
}
