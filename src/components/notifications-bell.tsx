'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { markAllNotificationsRead } from '@/app/(app)/notifications/actions'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  type: string
  title: string
  body: string | null
  data: Record<string, unknown> | null
  read: boolean
  created_at: string
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'agora'
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}

function notifHref(n: Notification): string {
  if (n.type === 'new_message' && n.data?.chat_id) return `/chat/${n.data.chat_id}`
  if (n.type === 'new_rating' && n.data?.from_username) return `/profile/${n.data.from_username}`
  if (n.type === 'trade_completed' && n.data?.chat_id) return `/chat/${n.data.chat_id}`
  return '#'
}

function notifIcon(type: string) {
  if (type === 'new_message')    return '💬'
  if (type === 'new_rating')     return '⭐'
  if (type === 'trade_completed') return '🤝'
  return '🔔'
}

interface Props {
  userId: string
  initialCount: number
  initialNotifs: Notification[]
}

export function NotificationsBell({ userId, initialCount, initialNotifs }: Props) {
  const supabase  = useRef(createClient()).current
  const panelRef  = useRef<HTMLDivElement>(null)
  const mountId   = useRef(Math.random())
  const [open, setOpen]         = useState(false)
  const [notifs, setNotifs]     = useState<Notification[]>(initialNotifs)
  const [unread, setUnread]     = useState(initialCount)
  const [, startTransition]     = useTransition()

  // Realtime: new notifications
  // Channel name includes a per-mount ID to avoid Supabase's singleton client
  // reusing an already-subscribed channel on Strict Mode double-invoke.
  useEffect(() => {
    const channel = supabase
      .channel(`notifs:${userId}:${mountId.current}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        (payload) => {
          const n = payload.new as Notification
          setNotifs(prev => [n, ...prev].slice(0, 30))
          setUnread(c => c + 1)
        }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  function handleOpen() {
    setOpen(v => !v)
    if (!open && unread > 0) {
      setUnread(0)
      setNotifs(prev => prev.map(n => ({ ...n, read: true })))
      startTransition(async () => { await markAllNotificationsRead() })
    }
  }

  return (
    <div ref={panelRef} className="relative">
      <button
        onClick={handleOpen}
        className={cn(
          'relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors',
          open ? 'bg-green-100 text-green-600' : 'text-ink-400 hover:text-ink-700 hover:bg-cream-200'
        )}
        aria-label="Notificações"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-0.5 rounded-full bg-rare-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-[320px] bg-white border border-[#E7DDC4] rounded-2xl shadow-[var(--sh-3)] z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E7DDC4] flex items-center justify-between">
            <span className="font-semibold text-sm text-ink-800">Notificações</span>
            {notifs.length > 0 && (
              <span className="text-xs text-ink-400">{notifs.length} recentes</span>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {notifs.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-center">
                <span className="text-3xl">🔔</span>
                <p className="text-sm text-ink-400">Nenhuma notificação ainda.</p>
              </div>
            ) : (
              notifs.map(n => (
                <Link
                  key={n.id}
                  href={notifHref(n)}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-start gap-3 px-4 py-3 border-b border-[#E7DDC4] last:border-0',
                    'hover:bg-cream-50 transition-colors',
                    !n.read && 'bg-green-50'
                  )}
                >
                  <span className="text-lg shrink-0 mt-0.5">{notifIcon(n.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm leading-snug', !n.read ? 'font-semibold text-ink-800' : 'text-ink-600')}>
                      {n.title}
                    </p>
                    {n.body && <p className="text-xs text-ink-400 mt-0.5 truncate">{n.body}</p>}
                  </div>
                  <span className="text-[10px] text-ink-300 shrink-0 mt-0.5">{timeAgo(n.created_at)}</span>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
