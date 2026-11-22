import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import ar from '@/locales/ar.json'
import en from '@/locales/en.json'

export const supportedLanguages = ['en', 'ar'] as const
export type Language = (typeof supportedLanguages)[number]

/** Keeps <html lang> and <html dir> in sync with the active language. */
export function applyDocumentLanguage(language: string): void {
  const lang: Language = language.startsWith('ar') ? 'ar' : 'en'
  document.documentElement.lang = lang
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, ar: { translation: ar } },
    supportedLngs: supportedLanguages,
    nonExplicitSupportedLngs: true,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'scout.dashboard.language',
      caches: ['localStorage'],
    },
  })

applyDocumentLanguage(i18n.resolvedLanguage ?? 'en')
i18n.on('languageChanged', applyDocumentLanguage)

export default i18n
