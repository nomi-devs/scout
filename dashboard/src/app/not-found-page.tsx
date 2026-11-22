import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <section className="flex flex-col items-start gap-4">
      <h1 className="text-3xl font-medium uppercase">{t('notFound.title')}</h1>
      <Button asChild>
        <Link to="/">{t('notFound.back')}</Link>
      </Button>
    </section>
  )
}
