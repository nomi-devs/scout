import { TriangleAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { isRouteErrorResponse, useRouteError } from 'react-router'

import { Button } from '@/components/ui/button'

/** Shown when a screen throws, so the admin sees a calm page with a way out instead of a blank screen. */
export function RouteError() {
  const { t } = useTranslation()
  const error = useRouteError()
  const detail = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : ''

  return (
    <main className="bg-page-wash page-enter grid min-h-svh place-items-center p-6">
      <div className="bg-card max-w-md rounded-2xl border p-8 text-center shadow-sm">
        <span className="bg-danger-bg text-destructive mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl">
          <TriangleAlert className="size-7" />
        </span>
        <h1 className="font-heading text-2xl font-bold uppercase">{t('error.title')}</h1>
        <p className="text-muted-foreground mt-2 text-sm">{t('error.body')}</p>
        {detail && (
          <p className="bg-muted text-muted-foreground mt-4 rounded-md p-2 text-xs break-words" role="status">
            {detail}
          </p>
        )}
        <div className="mt-6 flex justify-center gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            {t('error.retry')}
          </Button>
          <Button asChild>
            <a href="/">{t('notFound.back')}</a>
          </Button>
        </div>
      </div>
    </main>
  )
}
