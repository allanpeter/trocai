'use client'

import { useState } from 'react'
import { Bug, Lightbulb, Sparkles, MessageSquarePlus } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { submitFeedback } from '@/app/(app)/feedback/actions'

const TYPES = [
  { value: 'bug',      label: 'Bug',      Icon: Bug      },
  { value: 'sugestao', label: 'Sugestão', Icon: Lightbulb },
  { value: 'melhoria', label: 'Melhoria', Icon: Sparkles  },
] as const

type FeedbackType = typeof TYPES[number]['value']

interface FeedbackModalProps {
  variant?: 'sidebar' | 'mobile'
}

export function FeedbackModal({ variant = 'sidebar' }: FeedbackModalProps) {
  const [open, setOpen]               = useState(false)
  const [type, setType]               = useState<FeedbackType>('sugestao')
  const [description, setDescription] = useState('')
  const [loading, setLoading]         = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!description.trim()) return

    setLoading(true)
    try {
      await submitFeedback(type, description.trim(), window.location.pathname)
      toast.success('Feedback enviado! Obrigado.')
      setOpen(false)
      setDescription('')
      setType('sugestao')
    } catch {
      toast.error('Algo deu errado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const isMobile = variant === 'mobile'

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          isMobile
            ? 'flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-semibold text-ink-300 transition-colors hover:text-cream-50'
            : 'flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-all duration-120 text-cream-200 hover:bg-white/[0.06] hover:text-white w-full',
        )}
      >
        <MessageSquarePlus size={20} className={isMobile ? 'opacity-40' : 'opacity-65 shrink-0'} />
        Feedback
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-cream-50 border-[#E7DDC4] p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-ink-800">
              Enviar feedback
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-1">
            {/* Type selector */}
            <div className="flex gap-2">
              {TYPES.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setType(value)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold border transition-all',
                    type === value
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-white text-ink-600 border-[#E7DDC4] hover:border-green-400 hover:text-green-600',
                  )}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>

            {/* Description */}
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={
                type === 'bug'
                  ? 'Descreva o bug que encontrou...'
                  : type === 'sugestao'
                  ? 'Qual é a sua sugestão?'
                  : 'O que poderia ser melhorado?'
              }
              rows={4}
              maxLength={1000}
              required
              className={cn(
                'w-full px-4 py-3 rounded-xl border border-[#E7DDC4] bg-white',
                'font-body text-sm text-ink-800 placeholder:text-ink-300 resize-none',
                'outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20',
              )}
            />

            <button
              type="submit"
              disabled={loading || !description.trim()}
              className={cn(
                'w-full py-3 rounded-xl text-sm font-semibold transition-all',
                'bg-green-500 text-white hover:bg-green-600',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
