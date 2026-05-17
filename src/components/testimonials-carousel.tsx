'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const TESTIMONIALS = [
  {
    initial: 'J',
    quote: 'Fechei o álbum em 3 semanas!! A figurinha do Vini Jr eu achei com uma pessoa do bairro mesmo, o app avisou. Meu filho nao acreditou kkk',
    author: 'Juliana · São Paulo · completou Copa 2026',
  },
  {
    initial: 'C',
    quote: 'Tinha mais de 80 repetidas guardada ha meses. Em uma semana troquei quase todas. Nem acreditei quantas pessoas do bairro tambem coleciona.',
    author: 'Carlos · Belo Horizonte · 214 trocas realizadas',
  },
  {
    initial: 'M',
    quote: 'Tentei grupo de zap pra trocar mas so bagunça. Aqui o sistema ja indica quem tem o que eu preciso. Muito mais facil, recomendo pra todo mundo!',
    author: 'Marina · Curitiba · completou Brasileirão 2026',
  },
]

export function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0)

  function prev() {
    setCurrent(i => (i === 0 ? TESTIMONIALS.length - 1 : i - 1))
  }

  function next() {
    setCurrent(i => (i === TESTIMONIALS.length - 1 ? 0 : i + 1))
  }

  const t = TESTIMONIALS[current]

  return (
    <div className="bg-green-500 text-white rounded-3xl p-10 md:p-14">
      <div className="grid md:grid-cols-[auto_1fr] gap-8 items-center mb-8">
        <div className="w-24 h-24 bg-ink-800 rounded-full flex items-center justify-center font-display font-extrabold text-4xl text-gold-400 mx-auto md:mx-0 shrink-0">
          {t.initial}
        </div>
        <div>
          <p className="font-display font-semibold text-[26px] md:text-[28px] leading-snug tracking-tight mb-4 text-balance">
            "{t.quote}"
          </p>
          <p className="text-sm opacity-85">{t.author}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Dots */}
        <div className="flex gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-200',
                i === current ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/70'
              )}
              aria-label={`Depoimento ${i + 1}`}
            />
          ))}
        </div>

        {/* Arrows */}
        <div className="flex gap-2">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
            aria-label="Anterior"
          >
            ←
          </button>
          <button
            onClick={next}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
            aria-label="Próximo"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}
