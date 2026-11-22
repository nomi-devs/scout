import { Languages } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'

/** Toggles English ⇄ Arabic. The document direction follows via i18n's languageChanged hook. */
export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.resolvedLanguage === 'ar'
  const next = isArabic ? 'en' : 'ar'

  return (
    <Button variant="outline" size="sm" onClick={() => void i18n.changeLanguage(next)} aria-label={t('app.language')}>
      <Languages />
      {isArabic ? t('app.english') : t('app.arabic')}
    </Button>
  )
}
