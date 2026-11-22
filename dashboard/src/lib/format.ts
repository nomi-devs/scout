const DAY = 86_400_000

export function formatDate(ms: number, lang: string): string {
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-KW-u-nu-latn' : 'en-GB', { dateStyle: 'medium' }).format(ms)
}

export function formatKwd(amount: number): string {
  return `${Number(amount.toFixed(3))} KWD`
}

export function daysLeft(ms: number): number {
  return Math.max(0, Math.ceil((ms - Date.now()) / DAY))
}

export function hoursSince(ms: number): number {
  return Math.floor((Date.now() - ms) / 3_600_000)
}
