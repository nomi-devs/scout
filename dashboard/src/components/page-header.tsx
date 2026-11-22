import type { ReactNode } from 'react'

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div className="flex gap-3">
        <span className="bg-brand-gradient mt-1 w-1.5 shrink-0 self-stretch rounded-full" aria-hidden />
        <div>
          <h1 className="text-foreground text-2xl font-bold uppercase">{title}</h1>
          {description && <p className="text-muted-foreground mt-0.5 text-sm">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}
