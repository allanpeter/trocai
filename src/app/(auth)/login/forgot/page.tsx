'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export default function ForgotPasswordPage() {
  const [email, setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)

  const supabase = createClient()

  async function handleSubmit() {
    if (!email.trim()) {
      toast.error('Digite seu email.')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${location.origin}/auth/callback?next=/login/reset`,
      })
      if (error) {
        toast.error('Não conseguimos enviar o email. Tenta de novo.')
        return
      }
      setSent(true)
    } catch {
      toast.error('Algo deu errado. Tenta de novo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[440px]">
      <div className="bg-white rounded-3xl shadow-[var(--sh-3)] px-8 py-10">
        <div className="text-center mb-8">
          <Image src="/logo/trocai-mark.svg" width={48} height={48} alt="trocai" className="mx-auto mb-5" />
          <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-green-600 mb-2">
            RECUPERAR ACESSO
          </p>
          <h1 className="font-display font-bold text-[28px] tracking-tight text-ink-800">
            Esqueceu a senha?
          </h1>
          <p className="text-sm text-ink-400 mt-2">
            {sent
              ? 'Verifique sua caixa de entrada.'
              : 'Digite seu email e enviamos um link para redefinir.'}
          </p>
        </div>

        {sent ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-3xl">📬</div>
            <p className="text-sm text-ink-600 text-center">
              Enviamos um link para <span className="font-semibold text-ink-800">{email}</span>.<br/>
              Clique no link para criar uma nova senha.
            </p>
            <Link
              href="/login"
              className="text-sm text-green-600 font-semibold hover:underline mt-2"
            >
              Voltar para o login
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-ink-600 mb-1.5 tracking-wide">Email</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  autoComplete="email"
                  className={cn(
                    'w-full px-4 py-3 rounded-xl border border-[#E7DDC4] bg-cream-50',
                    'font-body text-sm text-ink-800 placeholder:text-ink-300',
                    'outline-none transition-all duration-150',
                    'focus:border-green-500 focus:ring-4 focus:ring-green-500/20',
                  )}
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={cn(
                'mt-5 w-full flex items-center justify-center py-3 rounded-xl',
                'bg-green-500 text-white font-semibold text-sm',
                'shadow-[var(--sh-2)] hover:bg-green-600 active:bg-green-700',
                'transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
              )}
            >
              {loading ? 'Enviando…' : 'Enviar link'}
            </button>

            <p className="text-center text-sm text-ink-400 mt-6">
              Lembrou a senha?{' '}
              <Link href="/login" className="text-green-600 font-semibold hover:underline">
                Voltar para o login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
