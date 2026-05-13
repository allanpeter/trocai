'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface Message {
  id: string
  sender_id: string
  content: string
  read: boolean
  created_at: string
}

interface OtherUser {
  id: string
  username: string
  avatar_url: string | null
  city: string | null
}

interface Props {
  chatId: string
  currentUserId: string
  otherUser: OtherUser
  initialMessages: Message[]
}

export function ChatThread({ chatId, currentUserId, otherUser, initialMessages }: Props) {
  const supabase   = createClient()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [text, setText]         = useState('')
  const [sending, setSending]   = useState(false)
  const [, startTransition]     = useTransition()
  const bottomRef  = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLInputElement>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Supabase Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`chat:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          const msg = payload.new as Message
          setMessages(prev => {
            // Avoid duplicates from optimistic insert
            if (prev.some(m => m.id === msg.id)) return prev
            return [...prev, msg]
          })
          // Mark as read if it's from the other user
          if (msg.sender_id !== currentUserId) {
            startTransition(async () => {
              await supabase
                .from('messages')
                .update({ read: true })
                .eq('id', msg.id)
            })
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [chatId, currentUserId, supabase, startTransition])

  async function handleSend() {
    const content = text.trim()
    if (!content || sending) return

    const optimisticId = `opt-${Date.now()}`
    const optimistic: Message = {
      id: optimisticId,
      sender_id: currentUserId,
      content,
      read: false,
      created_at: new Date().toISOString(),
    }

    setText('')
    setMessages(prev => [...prev, optimistic])
    setSending(true)

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({ chat_id: chatId, sender_id: currentUserId, content })
        .select('id, sender_id, content, read, created_at')
        .single()

      if (error) throw error

      // Replace optimistic with real
      setMessages(prev => prev.map(m => m.id === optimisticId ? data : m))
    } catch {
      // Rollback optimistic on failure
      setMessages(prev => prev.filter(m => m.id !== optimisticId))
      setText(content)
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  function groupByDate(msgs: Message[]) {
    const groups: { label: string; messages: Message[] }[] = []
    let lastLabel = ''
    for (const m of msgs) {
      const d   = new Date(m.created_at)
      const now = new Date()
      let label: string
      if (d.toDateString() === now.toDateString()) {
        label = 'Hoje'
      } else {
        const yesterday = new Date(now)
        yesterday.setDate(now.getDate() - 1)
        label = d.toDateString() === yesterday.toDateString()
          ? 'Ontem'
          : d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
      }
      if (label !== lastLabel) {
        groups.push({ label, messages: [] })
        lastLabel = label
      }
      groups.at(-1)!.messages.push(m)
    }
    return groups
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  const groups = groupByDate(messages)

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] lg:h-[calc(100vh-2rem)] -mx-5 lg:-mx-10 -my-8">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 lg:px-6 py-3.5 bg-white border-b border-[#E7DDC4] shrink-0">
        <Link
          href="/chat"
          className="p-1.5 rounded-lg text-ink-400 hover:text-ink-800 hover:bg-cream-100 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </Link>

        {otherUser.avatar_url ? (
          <Image src={otherUser.avatar_url} width={36} height={36} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white font-display font-bold text-sm shrink-0">
            {otherUser.username[0].toUpperCase()}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <Link href={`/profile/${otherUser.username}`} className="font-semibold text-[15px] text-ink-800 hover:underline truncate block">
            {otherUser.username}
          </Link>
          {otherUser.city && (
            <p className="text-xs text-ink-400 truncate">{otherUser.city}</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-cream-200 flex items-center justify-center text-2xl">👋</div>
            <p className="text-sm text-ink-400">
              Início da conversa com <span className="font-semibold text-ink-600">{otherUser.username}</span>.<br/>Pergunta quais figurinhas ele quer trocar!
            </p>
          </div>
        )}

        {groups.map(group => (
          <div key={group.label}>
            {/* Date divider */}
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-[#E7DDC4]" />
              <span className="text-[11px] font-medium text-ink-300">{group.label}</span>
              <div className="flex-1 h-px bg-[#E7DDC4]" />
            </div>

            <div className="space-y-1.5">
              {group.messages.map((msg, i) => {
                const isMe  = msg.sender_id === currentUserId
                const isOpt = msg.id.startsWith('opt-')
                const prev  = group.messages[i - 1]
                const showTail = !prev || prev.sender_id !== msg.sender_id

                return (
                  <div key={msg.id} className={cn('flex', isMe ? 'justify-end' : 'justify-start')}>
                    {/* Other user avatar on first message of a run */}
                    {!isMe && showTail ? (
                      <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white font-display font-bold text-xs shrink-0 mr-2 self-end mb-0.5">
                        {otherUser.username[0].toUpperCase()}
                      </div>
                    ) : !isMe ? (
                      <div className="w-7 mr-2 shrink-0" />
                    ) : null}

                    <div className={cn(
                      'max-w-[75%] flex flex-col',
                      isMe ? 'items-end' : 'items-start'
                    )}>
                      <div className={cn(
                        'px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
                        isMe
                          ? 'bg-green-500 text-white rounded-br-sm'
                          : 'bg-white border border-[#E7DDC4] text-ink-800 rounded-bl-sm',
                        isOpt && 'opacity-60',
                      )}>
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-ink-300 mt-0.5 px-1">
                        {formatTime(msg.created_at)}
                        {isMe && !isOpt && (
                          <span className="ml-1">{msg.read ? '✓✓' : '✓'}</span>
                        )}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="px-4 lg:px-6 py-3 bg-white border-t border-[#E7DDC4] shrink-0 flex items-center gap-3">
        <input
          ref={inputRef}
          type="text"
          placeholder="Escreve uma mensagem…"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          className={cn(
            'flex-1 px-4 py-2.5 rounded-xl border border-[#E7DDC4] bg-cream-50',
            'font-body text-sm text-ink-800 placeholder:text-ink-300',
            'outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20',
          )}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || sending}
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
            'bg-green-500 text-white transition-all duration-150',
            'hover:bg-green-600 active:bg-green-700',
            'disabled:opacity-40 disabled:cursor-not-allowed',
          )}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
