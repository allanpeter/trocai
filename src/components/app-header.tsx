import { ReactNode } from 'react'

interface AppHeaderProps {
  title: ReactNode
  eyebrow?: string
  actions?: ReactNode
}

export function AppHeader({ title, eyebrow, actions }: AppHeaderProps) {
  return (
    <header className="flex items-end justify-between gap-4 mb-6">
      <div>
        {eyebrow && (
          <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-ink-400 mb-1.5">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display font-bold text-[36px] tracking-tight leading-tight text-ink-800">
          {title}
        </h1>
      </div>
      {actions && (
        <div className="flex items-center gap-2.5 shrink-0">{actions}</div>
      )}
    </header>
  )
}
