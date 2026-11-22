import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info'

const toneClass: Record<Tone, string> = {
  neutral: 'bg-secondary text-secondary-foreground',
  success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  danger: 'bg-destructive/10 text-destructive',
  info: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
}

export function StatusBadge({ tone = 'neutral', children }: { tone?: Tone; children: React.ReactNode }) {
  return <Badge className={cn(toneClass[tone])}>{children}</Badge>
}
