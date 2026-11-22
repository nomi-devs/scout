import { describe, expect, it } from 'vitest'

import ar from '@/locales/ar.json'
import en from '@/locales/en.json'

import i18n from './i18n'

function keyPaths(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' ? keyPaths(v as object, `${prefix}${k}.`) : [`${prefix}${k}`],
  )
}

describe('i18n', () => {
  it('has the same keys in English and Arabic', () => {
    expect(keyPaths(ar).sort()).toEqual(keyPaths(en).sort())
  })

  it('switches the document to RTL for Arabic and back to LTR', async () => {
    await i18n.changeLanguage('ar')
    expect(document.documentElement.dir).toBe('rtl')
    expect(document.documentElement.lang).toBe('ar')

    await i18n.changeLanguage('en')
    expect(document.documentElement.dir).toBe('ltr')
  })
})
