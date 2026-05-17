'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [loading, setLoading]     = useState(false)

  const supabase = createClient()

  async function handleSubmit() {
    if (!password || password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (password !== confirm) {
      toast.error('As senhas não coincidem.')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        toast.error('Não foi possível atualizar a senha. O link pode ter expirado.')
        return
      }
      toast.success('Senha atualizada!')
      router.push('/matches')
    } catch {
      toast.error('Algo deu errado. Tenta de novo.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = cn(
    'w-full px-4 py-3 rounded-xl border border-[#E7DDC4] bg-cream-50',
    'font-body text-sm text-ink-800 placeholder:text-ink-300',
    'outline-none transition-all duration-150',
    'focus:border-green-500 focus:ring-4 focus:ring-green-500/20',
  )

  return (
    <div className="w-full max-w-[440px]">
      <div className="bg-white rounded-3xl shadow-[var(--sh-3)] px-8 py-10">
        <div className="text-center mb-8">
          <Image src="/logo/trocai-mark.svg" width={48} height={48} alt="trocai" className="mx-auto mb-5" />
          <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-green-600 mb-2">
            NOVA SENHA
          </p>
          <h1 className="font-display font-bold text-[28px] tracking-tight text-ink-800">
            Redefinir senha
          </h1>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1.5 tracking-wide">Nova senha</label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={inputCls}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1.5 tracking-wide">Confirmar senha</label>
            <input
              type="password"
              placeholder="Repita a senha"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              className={inputCls}
              autoComplete="new-password"
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
          {loading ? 'Salvando…' : 'Salvar nova senha'}
        </button>
      </div>
    </div>
  )
}
