'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { FeedbackModal } from '@/components/feedback-modal'

const NAV_ITEMS = [
  { href: '/matches',  label: 'Matches',   icon: '/icons/match.svg'  },
  { href: '/album/00000000-0000-0000-0000-000000000001', label: 'Meu álbum', icon: '/icons/album.svg' },
  { href: '/search',   label: 'Buscar',    icon: '/icons/sticker.svg'},
  { href: '/chat',     label: 'Chat',      icon: '/icons/swap.svg'   },
  { href: '/profile',  label: 'Perfil',    icon: '/icons/trophy.svg' },
]

interface SidebarProps {
  username?: string | null
  avatarUrl?: string | null
  initial?: string
  notifBell?: React.ReactNode
}

export function Sidebar({ username, avatarUrl, initial = '?', notifBell }: SidebarProps) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="hidden lg:flex flex-col w-[260px] shrink-0 bg-ink-800 text-cream-50 sticky top-0 h-screen p-4 gap-1">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 px-2 pb-6 pt-1">
        <Image src="/logo/trocai-mark.svg" width={36} height={36} alt="trocai" />
        <span className="font-display font-extrabold text-2xl tracking-tight">
          trocai<em className="not-italic text-green-400">.app</em>
        </span>
      </Link>

      {/* Nav items */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {NAV_ITEMS.map(item => {
          const active = pathname.startsWith(item.href.split('/').slice(0, 2).join('/'))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-all duration-120',
                active
                  ? 'bg-green-500 text-white font-semibold'
                  : 'text-cream-200 hover:bg-white/[0.06] hover:text-white'
              )}
            >
              <Image
                src={item.icon}
                width={20}
                height={20}
                alt=""
                className={cn('transition-opacity', active ? 'opacity-100 invert brightness-[2]' : 'opacity-65 invert brightness-90')}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Feedback */}
      <FeedbackModal />

      {/* User footer */}
      <div className="flex items-center gap-2.5 px-3 py-3 bg-white/[0.04] rounded-xl mt-3">
        {avatarUrl ? (
          <Image src={avatarUrl} width={36} height={36} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-ink-600 flex items-center justify-center shrink-0 text-cream-50 font-display font-bold text-sm">
            {initial}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold truncate">{username ?? 'Conta'}</div>
        </div>
        {notifBell && <div className="shrink-0">{notifBell}</div>}
        <button
          onClick={handleLogout}
          className="p-1.5 rounded-lg text-ink-300 hover:text-cream-50 hover:bg-white/10 transition-colors shrink-0"
          title="Sair"
        >
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  )
}
