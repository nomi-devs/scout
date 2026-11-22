import type { Row } from './crud-page'

/** Reads the English or Arabic half of a bilingual field stored as `<key>En` / `<key>Ar`. */
export function bi(row: Row, key: string, lang: string): string {
  return String(row[`${key}${lang === 'ar' ? 'Ar' : 'En'}`] ?? '')
}
