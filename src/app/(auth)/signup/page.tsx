'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { trackEvent } from '@/lib/analytics'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  )
}

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading]   = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [usernameError, setUsernameError] = useState('')

  const supabase = createClient()

  function sanitizeUsername(raw: string) {
    return raw.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 20)
  }

  async function checkUsername(value: string): Promise<boolean> {
    if (!value) return false
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', value)
      .maybeSingle()
    return data !== null
  }

  async function handleSignup() {
    const trimEmail = email.trim()
    const trimUser  = username.trim()

    if (!trimEmail || !password || !trimUser) {
      toast.error('Preenche todos os campos.')
      return
    }
    if (password.length < 6) {
      toast.error('A senha precisa ter pelo menos 6 caracteres.')
      return
    }
    if (!/^[a-z0-9_]{3,20}$/.test(trimUser)) {
      setUsernameError('Use letras minúsculas, números ou _ (3–20 caracteres).')
      return
    }

    setLoading(true)
    setUsernameError('')
    try {
      const taken = await checkUsername(trimUser)
      if (taken) {
        setUsernameError('Esse nome de usuário já está em uso.')
        return
      }

      const { data, error } = await supabase.auth.signUp({
        email: trimEmail,
        password,
        options: {
          data: { username: trimUser },
        },
      })

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('Esse email já tem uma conta. Tenta entrar.')
        } else {
          toast.error('Algo deu errado. Tenta de novo.')
        }
        return
      }

      if (data.session) {
        trackEvent('signup_completed')
        router.push('/onboarding')
        router.refresh()
      } else {
        toast.success('Quase lá! Verifique seu email para confirmar a conta.')
        router.push('/login')
      }
    } catch {
      toast.error('Algo deu errado. Tenta de novo.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      })
      if (error) toast.error('Não conseguimos conectar com o Google. Tenta de novo.')
    } catch {
      toast.error('Algo deu errado. Tenta de novo.')
    } finally {
      setGoogleLoading(false)
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

        {/* Header */}
        <div className="text-center mb-8">
          <Image
            src="/logo/trocai-mark.svg"
            width={48} height={48}
            alt="trocai"
            className="mx-auto mb-5"
          />
          <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-green-600 mb-2">
            COMEÇA A TROCAR
          </p>
          <h1 className="font-display font-bold text-[28px] tracking-tight text-ink-800">
            Crie sua conta
          </h1>
        </div>

        {/* Google OAuth */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          className={cn(
            'w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl',
            'border border-[#E7DDC4] bg-white font-semibold text-sm text-ink-800',
            'hover:bg-cream-50 hover:border-ink-200 transition-all duration-150',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          <GoogleIcon />
          {googleLoading ? 'Redirecionando…' : 'Continuar com Google'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#E7DDC4]" />
          <span className="text-xs text-ink-300 font-medium">ou</span>
          <div className="flex-1 h-px bg-[#E7DDC4]" />
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1.5 tracking-wide">
              Email
            </label>
            <input
              type="email"
              placeholder="tu@exemplo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSignup()}
              className={inputCls}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1.5 tracking-wide">
              Nome de usuário
            </label>
            <input
              type="text"
              placeholder="seunome"
              value={username}
              onChange={e => {
                const val = sanitizeUsername(e.target.value)
                setUsername(val)
                setUsernameError('')
              }}
              onKeyDown={e => e.key === 'Enter' && handleSignup()}
              className={cn(inputCls, usernameError && 'border-rare-400 focus:border-rare-400 focus:ring-rare-400/20')}
              autoComplete="username"
              spellCheck={false}
            />
            {usernameError ? (
              <p className="mt-1.5 text-xs text-rare-500">{usernameError}</p>
            ) : (
              <p className="mt-1.5 text-xs text-ink-300">Letras minúsculas, números e _ (3–20 caracteres)</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1.5 tracking-wide">
              Senha
            </label>
            <input
              type="password"
              placeholder="mínimo 6 caracteres"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSignup()}
              className={inputCls}
              autoComplete="new-password"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className={cn(
            'mt-5 w-full flex items-center justify-center py-3 rounded-xl',
            'bg-green-500 text-white font-semibold text-sm',
            'shadow-[var(--sh-2)] hover:bg-green-600 active:bg-green-700',
            'transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          {loading ? 'Criando conta…' : 'Criar conta'}
        </button>

        {/* Terms */}
        <p className="text-center text-xs text-ink-300 mt-4 leading-relaxed">
          Ao criar uma conta, você concorda com nossos{' '}
          <Link href="/terms" className="text-ink-500 hover:underline">Termos</Link>
          {' '}e{' '}
          <Link href="/privacy" className="text-ink-500 hover:underline">Privacidade</Link>.
        </p>

        {/* Switch to login */}
        <p className="text-center text-sm text-ink-400 mt-5">
          Já tem conta?{' '}
          <Link href="/login" className="text-green-600 font-semibold hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
