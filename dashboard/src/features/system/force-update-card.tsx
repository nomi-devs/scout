import { zodResolver } from '@hookform/resolvers/zod'
import { Smartphone } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useMockStore } from '@/mock/store'
import { forceUpdateSchema, type ForceUpdateValues } from '@/schemas/settings'

const defaults: ForceUpdateValues = {
  enabled: false,
  androidVersion: '1.0.2+7',
  androidLink: 'https://play.google.com/store/apps/details?id=com.scout.app',
  iosVersion: '1.0.2+7',
  iosLink: 'https://apps.apple.com/us/app/scout/id0000000000',
  messageEn: 'A new version is available. Please update to continue.',
  messageAr: 'يتوفر إصدار جديد. يرجى التحديث للمتابعة.',
}

const label = 'text-muted-foreground text-xs font-semibold tracking-wide uppercase'

/** "App Version & Force Update": the app blocks users on a version older than the latest until they update. */
export function ForceUpdateCard() {
  const { t } = useTranslation()
  const { logAudit } = useMockStore()
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ForceUpdateValues>({
    resolver: zodResolver(forceUpdateSchema),
    defaultValues: defaults,
    mode: 'onChange',
  })
  const enabled = watch('enabled')

  const onSubmit = async (values: ForceUpdateValues) => {
    logAudit({
      admin: '',
      action: 'settings.update',
      target: t('forceUpdate.title'),
      before: '—',
      after: values.enabled ? `Android ${values.androidVersion} · iOS ${values.iosVersion}` : t('forceUpdate.disabled'),
    })
    toast.success(t('common.saved'))
  }

  const text = (name: 'androidVersion' | 'androidLink' | 'iosVersion' | 'iosLink', title: string, hint?: string) => (
    <Field data-invalid={!!errors[name]}>
      <FieldLabel htmlFor={name} className={label}>
        {title}
      </FieldLabel>
      <Input id={name} dir="ltr" aria-invalid={!!errors[name]} {...register(name)} />
      {errors[name]?.message ? (
        <FieldError>{t(errors[name].message)}</FieldError>
      ) : (
        hint && <p className="text-muted-foreground text-xs">{hint}</p>
      )}
    </Field>
  )

  const platform = (key: 'android' | 'ios') => (
    <div className="space-y-3 border-t pt-4">
      <h3 className="font-heading text-lg font-medium">{t(`forceUpdate.${key}`)}</h3>
      <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
        {text(`${key}Version`, t('forceUpdate.latestVersion'), t('forceUpdate.versionFormat'))}
        {text(`${key}Link`, t('forceUpdate.storeLink'))}
      </div>
    </div>
  )

  const message = (name: 'messageEn' | 'messageAr', title: string, dir: 'ltr' | 'rtl') => (
    <Field data-invalid={!!errors[name]}>
      <FieldLabel htmlFor={name} className={label}>
        {title}
      </FieldLabel>
      <Textarea id={name} dir={dir} rows={3} aria-invalid={!!errors[name]} {...register(name)} />
      {errors[name]?.message && <FieldError>{t(errors[name].message)}</FieldError>}
    </Field>
  )

  return (
    <Card>
      <form noValidate onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="contents">
        <div className="flex items-center gap-3 px-(--card-spacing)">
          <span className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-full">
            <Smartphone className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <CardTitle>{t('forceUpdate.title')}</CardTitle>
            <CardDescription>{t('forceUpdate.description')}</CardDescription>
          </div>
          <label className="flex items-center gap-2 text-xs">
            <span className="bg-muted rounded-full px-2.5 py-1">
              {enabled ? t('forceUpdate.enabled') : t('forceUpdate.disabled')}
            </span>
            <Switch
              checked={enabled}
              aria-label={t('forceUpdate.title')}
              onCheckedChange={(v) => {
                setValue('enabled', v)
                void trigger()
              }}
            />
          </label>
        </div>
        <CardContent className="space-y-4">
          <p className="bg-muted rounded-xl px-4 py-2.5 text-sm" role="status">
            {enabled ? t('forceUpdate.onNote') : t('forceUpdate.offNote')}
          </p>
          {!enabled && <p className="text-muted-foreground text-sm">{t('forceUpdate.beforeEnabling')}</p>}
          {platform('android')}
          {platform('ios')}
          <div className="grid gap-4 border-t pt-4 md:grid-cols-2">
            {message('messageEn', t('forceUpdate.messageEn'), 'ltr')}
            {message('messageAr', t('forceUpdate.messageAr'), 'rtl')}
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {t('common.save')}
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}
