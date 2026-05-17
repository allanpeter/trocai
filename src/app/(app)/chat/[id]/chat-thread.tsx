'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { initiateTrade, confirmTrade, cancelTrade } from './actions'

interface Message {
  id: string
  sender_id: string
  content: string
  read: boolean
  created_at: string
  message_type?: string
  metadata?: Record<string, unknown> | null
}

interface OtherUser {
  id: string
  username: string
  avatar_url: string | null
  city: string | null
}

interface TradeSpot {
  id: string
  name: string
  type: string
  address: string | null
  city_name: string
  state_code: string
  lat: number
  lng: number
  distanceKm: number | null
}

const SPOT_TYPE_LABEL: Record<string, string> = {
  shopping: '🛍️', parque: '🌳', praca: '🏛️', cafeteria: '☕',
  universidade: '🎓', biblioteca: '📚', mercado: '🛒', evento: '🎉', outro: '📍',
}

interface Trade {
  id: string
  status: string
  initiator_id: string
  partner_id: string
}

interface Props {
  chatId: string
  currentUserId: string
  otherUser: OtherUser
  initialMessages: Message[]
  hasMore: boolean
  activeTrade: Trade | null
  tradeSpots: TradeSpot[]
}

export function ChatThread({ chatId, currentUserId, otherUser, initialMessages, hasMore: initialHasMore, activeTrade: initialTrade, tradeSpots }: Props) {
  const supabase   = useRef(createClient()).current
  const [messages, setMessages]     = useState<Message[]>(initialMessages)
  const [text, setText]             = useState('')
  const [sending, setSending]       = useState(false)
  const [showSpots, setShowSpots]   = useState(false)
  const [hasMore, setHasMore]         = useState(initialHasMore)
  const [loadingMore, setLoadingMore] = useState(false)
  const [trade, setTrade]             = useState<Trade | null>(initialTrade)
  const [tradeLoading, setTradeLoading] = useState(false)
  const [, startTransition]           = useTransition()
  const bottomRef  = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLInputElement>(null)
  const scrollRef  = useRef<HTMLDivElement>(null)

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, currentUserId])

  async function loadMore() {
    if (loadingMore || !hasMore) return
    const oldest = messages[0]?.created_at
    if (!oldest) return

    setLoadingMore(true)
    try {
      const { data } = await supabase
        .from('messages')
        .select('id, sender_id, content, read, created_at')
        .eq('chat_id', chatId)
        .lt('created_at', oldest)
        .order('created_at', { ascending: false })
        .limit(50)

      if (!data || data.length === 0) { setHasMore(false); return }

      const older = data.slice().reverse()
      const prevScrollHeight = scrollRef.current?.scrollHeight ?? 0

      setMessages(prev => [...older, ...prev])
      setHasMore(data.length === 50)

      // Restore scroll position so viewport doesn't jump
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight - prevScrollHeight
        }
      })
    } finally {
      setLoadingMore(false)
    }
  }

  async function handleInitiateTrade() {
    setTradeLoading(true)
    try {
      const data = await initiateTrade(chatId, otherUser.id)
      if (data) setTrade(data as Trade)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao solicitar troca.')
    } finally {
      setTradeLoading(false)
    }
  }

  async function handleConfirmTrade() {
    if (!trade) return
    setTradeLoading(true)
    try {
      await confirmTrade(trade.id, chatId)
      setTrade(t => t ? { ...t, status: 'completed' } : t)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao confirmar troca.')
    } finally {
      setTradeLoading(false)
    }
  }

  async function handleCancelTrade() {
    if (!trade) return
    setTradeLoading(true)
    try {
      await cancelTrade(trade.id, chatId)
      setTrade(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao cancelar troca.')
    } finally {
      setTradeLoading(false)
    }
  }

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
        .select('id, sender_id, content, read, created_at, message_type, metadata')
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

  async function handleSendSpot(spot: TradeSpot) {
    setShowSpots(false)
    const metadata = { id: spot.id, name: spot.name, type: spot.type, address: spot.address, city_name: spot.city_name, state_code: spot.state_code, lat: spot.lat, lng: spot.lng }
    const optimisticId = `opt-${Date.now()}`
    const optimistic: Message = { id: optimisticId, sender_id: currentUserId, content: spot.name, message_type: 'spot', metadata, read: false, created_at: new Date().toISOString() }
    setMessages(prev => [...prev, optimistic])
    setSending(true)
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({ chat_id: chatId, sender_id: currentUserId, content: spot.name, message_type: 'spot', metadata })
        .select('id, sender_id, content, read, created_at, message_type, metadata')
        .single()
      if (error) throw error
      setMessages(prev => prev.map(m => m.id === optimisticId ? data : m))
    } catch {
      setMessages(prev => prev.filter(m => m.id !== optimisticId))
    } finally {
      setSending(false)
    }
  }

  function parseSpot(msg: Message): TradeSpot | null {
    if (msg.message_type === 'spot' && msg.metadata) return msg.metadata as unknown as TradeSpot
    // Fallback: parse legacy JSON-encoded spots
    try {
      const obj = JSON.parse(msg.content)
      return obj._spot ? obj : null
    } catch { return null }
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
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 space-y-4">
        {hasMore && (
          <div className="flex justify-center pt-2 pb-4">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="text-xs font-semibold text-ink-400 hover:text-green-600 disabled:opacity-50 transition-colors"
            >
              {loadingMore ? 'Carregando…' : '↑ Carregar mensagens anteriores'}
            </button>
          </div>
        )}
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

                const isTradeMsg = msg.message_type === 'trade_initiated' || msg.message_type === 'trade_completed' || msg.message_type === 'trade_cancelled'
                const spot = isTradeMsg ? null : parseSpot(msg)

                if (isTradeMsg) {
                  const icons: Record<string, string> = { trade_initiated: '🤝', trade_completed: '✅', trade_cancelled: '❌' }
                  const labels: Record<string, string> = {
                    trade_initiated: `@${isMe ? 'Você' : otherUser.username} quer confirmar a troca`,
                    trade_completed: `@${isMe ? 'Você' : otherUser.username} confirmou a troca!`,
                    trade_cancelled: `@${isMe ? 'Você' : otherUser.username} cancelou a solicitação`,
                  }
                  return (
                    <div key={msg.id} className="flex justify-center my-2">
                      <div className="flex items-center gap-2 px-4 py-2 bg-cream-200 rounded-full text-xs text-ink-500 font-medium">
                        <span>{icons[msg.message_type!]}</span>
                        <span>{labels[msg.message_type!]}</span>
                        <span className="text-ink-300">· {formatTime(msg.created_at)}</span>
                      </div>
                    </div>
                  )
                }

                return (
                  <div key={msg.id} className={cn('flex', isMe ? 'justify-end' : 'justify-start')}>
                    {!isMe && showTail ? (
                      <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white font-display font-bold text-xs shrink-0 mr-2 self-end mb-0.5">
                        {otherUser.username[0].toUpperCase()}
                      </div>
                    ) : !isMe ? (
                      <div className="w-7 mr-2 shrink-0" />
                    ) : null}

                    <div className={cn('max-w-[75%] flex flex-col', isMe ? 'items-end' : 'items-start')}>
                      {spot ? (
                        <a
                          href={`https://www.google.com/maps?q=${spot.lat},${spot.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            'rounded-2xl overflow-hidden border transition-opacity',
                            isMe ? 'border-green-400 rounded-br-sm' : 'border-[#E7DDC4] rounded-bl-sm',
                            isOpt && 'opacity-60',
                          )}
                        >
                          <div className={cn('px-3.5 pt-2.5 pb-1 text-xs font-semibold uppercase tracking-wide', isMe ? 'bg-green-600 text-green-100' : 'bg-cream-100 text-ink-400')}>
                            Sugestão de encontro
                          </div>
                          <div className={cn('px-3.5 py-2.5', isMe ? 'bg-green-500 text-white' : 'bg-white text-ink-800')}>
                            <div className="flex items-center gap-2">
                              <span className="text-base">{SPOT_TYPE_LABEL[spot.type] ?? '📍'}</span>
                              <span className="font-semibold text-sm">{spot.name}</span>
                            </div>
                            {spot.address && (
                              <p className={cn('text-xs mt-1', isMe ? 'text-green-100' : 'text-ink-400')}>{spot.address}</p>
                            )}
                            <p className={cn('text-xs mt-0.5 font-medium', isMe ? 'text-green-200' : 'text-ink-300')}>
                              {spot.city_name}, {spot.state_code} · Ver no Maps →
                            </p>
                          </div>
                        </a>
                      ) : (
                        <div className={cn(
                          'px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
                          isMe ? 'bg-green-500 text-white rounded-br-sm' : 'bg-white border border-[#E7DDC4] text-ink-800 rounded-bl-sm',
                          isOpt && 'opacity-60',
                        )}>
                          {msg.content}
                        </div>
                      )}
                      <span className="text-[10px] text-ink-300 mt-0.5 px-1">
                        {formatTime(msg.created_at)}
                        {isMe && !isOpt && <span className="ml-1">{msg.read ? '✓✓' : '✓'}</span>}
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

      {/* Trade banner */}
      {trade?.status === 'pending' && trade.partner_id === currentUserId && (
        <div className="bg-gold-50 border-t border-gold-200 px-4 py-3 shrink-0 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-ink-700 font-medium min-w-0">
            <span className="text-xl shrink-0">🤝</span>
            <span className="truncate">@{otherUser.username} quer confirmar a troca</span>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleCancelTrade}
              disabled={tradeLoading}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#E7DDC4] text-ink-600 hover:bg-cream-100 transition-colors disabled:opacity-50"
            >
              Recusar
            </button>
            <button
              onClick={handleConfirmTrade}
              disabled={tradeLoading}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {tradeLoading ? '…' : 'Confirmar'}
            </button>
          </div>
        </div>
      )}

      {trade?.status === 'completed' && (
        <div className="bg-green-50 border-t border-green-200 px-4 py-3 shrink-0 flex items-center gap-3">
          <span className="text-xl shrink-0">✅</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-green-800">Troca confirmada!</p>
            <p className="text-xs text-green-600">
              Avalie sua experiência com{' '}
              <Link href={`/profile/${otherUser.username}`} className="underline font-medium">
                @{otherUser.username}
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* Spot picker */}
      {showSpots && (
        <div className="bg-white border-t border-[#E7DDC4] shrink-0 max-h-64 overflow-y-auto">
          <div className="px-4 py-2 flex items-center justify-between border-b border-[#E7DDC4]">
            <span className="text-xs font-semibold text-ink-600 uppercase tracking-wide">Sugerir local de encontro</span>
            <button onClick={() => setShowSpots(false)} className="text-ink-300 hover:text-ink-600">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          {tradeSpots.length === 0 ? (
            <p className="px-4 py-4 text-sm text-ink-400">Nenhum local cadastrado ainda.</p>
          ) : (
            tradeSpots.map(spot => (
              <button
                key={spot.id}
                onClick={() => handleSendSpot(spot)}
                className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-cream-100 transition-colors border-b border-[#E7DDC4] last:border-0"
              >
                <span className="text-lg shrink-0 mt-0.5">{SPOT_TYPE_LABEL[spot.type] ?? '📍'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink-800 truncate">{spot.name}</p>
                  {spot.address && <p className="text-xs text-ink-400 truncate">{spot.address}</p>}
                  <p className="text-xs text-ink-300">
                    {spot.city_name}, {spot.state_code}
                    {spot.distanceKm != null && <span className="ml-1.5 text-green-600 font-medium">~{spot.distanceKm} km do centro</span>}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {/* Input bar */}
      <div className="px-4 lg:px-6 py-3 bg-white border-t border-[#E7DDC4] shrink-0 flex items-center gap-3">
        <button
          onClick={() => setShowSpots(v => !v)}
          title="Sugerir local de encontro"
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-150',
            showSpots ? 'bg-green-100 text-green-600' : 'text-ink-300 hover:text-ink-600 hover:bg-cream-100',
          )}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
          </svg>
        </button>

        {trade?.status !== 'completed' && (
          <button
            onClick={handleInitiateTrade}
            disabled={tradeLoading || (trade?.status === 'pending' && trade.initiator_id === currentUserId)}
            title={trade?.status === 'pending' && trade.initiator_id === currentUserId ? 'Aguardando confirmação…' : 'Solicitar confirmação de troca'}
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-150',
              trade?.status === 'pending' && trade.initiator_id === currentUserId
                ? 'bg-gold-100 text-gold-400 cursor-default'
                : 'text-ink-300 hover:text-ink-600 hover:bg-cream-100 disabled:opacity-40',
            )}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 3l4 4-4 4"/><path d="M20 7H4"/>
              <path d="M8 21l-4-4 4-4"/><path d="M4 17h16"/>
            </svg>
          </button>
        )}

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
