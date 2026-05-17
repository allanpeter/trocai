'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { FeedbackModal } from '@/components/feedback-modal'

const TABS = [
  { href: '/matches',  label: 'Matches',  icon: '/icons/match.svg'  },
  { href: '/album/00000000-0000-0000-0000-000000000001', label: 'Álbum', icon: '/icons/album.svg' },
  { href: '/search',   label: 'Buscar',   icon: '/icons/sticker.svg'},
  { href: '/chat',     label: 'Chat',     icon: '/icons/swap.svg'   },
  { href: '/profile',  label: 'Perfil',   icon: '/icons/trophy.svg' },
]

export function NavBar() {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-ink-800 border-t border-white/10 flex">
      {TABS.map(tab => {
        const active = pathname.startsWith(tab.href.split('/').slice(0, 2).join('/'))
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-semibold transition-colors',
              active ? 'text-green-400' : 'text-ink-300'
            )}
          >
            <Image
              src={tab.icon}
              width={20}
              height={20}
              alt=""
              className={cn('transition-opacity invert', active ? 'opacity-100' : 'opacity-40')}
            />
            {tab.label}
          </Link>
        )
      })}

      {/* Feedback tab */}
      <FeedbackModal variant="mobile" />

      {/* Logout tab */}
      <button
        onClick={handleLogout}
        className="flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-semibold text-ink-300 transition-colors hover:text-cream-50"
      >
        <LogOut size={20} className="opacity-40" />
        Sair
      </button>
    </nav>
  )
}
