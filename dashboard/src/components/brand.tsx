import logoFull from '@/assets/brand/logo-full.svg'
import logoMark from '@/assets/brand/logo-mark.svg'
import logoWhite from '@/assets/brand/logo-white.svg'
import { cn } from '@/lib/utils'

/** The Scout mark on the brand gradient, like the app icon. */
export function BrandTile({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'bg-brand-gradient inline-flex size-10 shrink-0 items-center justify-center rounded-xl shadow-md shadow-primary/30',
        className,
      )}
    >
      <img src={logoMark} alt="" className="h-[62%] w-auto" />
    </span>
  )
}

/** Scout wordmark: blue on light backgrounds, white on the brand gradient. */
export function Wordmark({ white, className }: { white?: boolean; className?: string }) {
  return <img src={white ? logoWhite : logoFull} alt="Scout" className={cn('h-9 w-auto', className)} />
}

export { logoMark }
