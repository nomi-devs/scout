import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { REEL_MAX_PER_MONTH, REEL_MAX_SECONDS } from '@/mock/data'
import { useMockStore } from '@/mock/store'

type TextKey = 'supportEmail' | 'emailAvailability' | 'phone' | 'phoneAvailability' | 'minIos' | 'minAndroid'
type FlagKey = 'featuredEnabled' | 'reelsEnabled' | 'guestBrowsing'

/** Global config the app reads on launch (A11): payment provider, feature flags, support contacts. */
export function SettingsPage() {
  const { t } = useTranslation()
  const { logAudit } = useMockStore()
  const [s, setS] = useState({
    provider: 'myfatoorah',
    featuredEnabled: true,
    reelsEnabled: true,
    guestBrowsing: true,
    supportEmail: 'Inquiry@scout.com',
    emailAvailability: 'Response within 2 hrs',
    phone: '+965 1234 5678',
    phoneAvailability: 'Available 24/7',
    minIos: '1.0.0',
    minAndroid: '1.0.0',
  })
  const set = (patch: Partial<typeof s>) => setS((cur) => ({ ...cur, ...patch }))

  const text = (key: TextKey, label: string) => (
    <div className="space-y-1">
      <Label htmlFor={key}>{label}</Label>
      <Input id={key} value={s[key]} onChange={(e) => set({ [key]: e.target.value })} />
    </div>
  )
  const flag = (key: FlagKey, label: string) => (
    <div className="flex items-center gap-2">
      <Checkbox id={key} checked={s[key]} onCheckedChange={(v) => set({ [key]: v === true })} />
      <Label htmlFor={key}>{label}</Label>
    </div>
  )

  return (
    <section>
      <PageHeader title={t('nav.settings')} description={t('settings.description')} />
      <form
        className="grid gap-4 lg:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault()
          logAudit({ admin: '', action: 'settings.update', target: t('nav.settings'), before: '—', after: s.provider })
          toast.success(t('common.saved'))
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.payments')}</CardTitle>
            <CardDescription>{t('settings.paymentsHint')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>{t('settings.provider')}</Label>
              <Input value="MyFatoorah" readOnly aria-label={t('settings.provider')} />
              <p className="text-muted-foreground text-xs">{t('settings.methods')}</p>
            </div>
            {flag('featuredEnabled', t('settings.featuredEnabled'))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.features')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {flag('reelsEnabled', t('settings.reelsEnabled'))}
            <p className="text-muted-foreground text-xs">
              {t('settings.reelRules', { perMonth: REEL_MAX_PER_MONTH, minutes: REEL_MAX_SECONDS / 60 })}
            </p>
            {flag('guestBrowsing', t('settings.guestBrowsing'))}
            {text('minIos', t('settings.minIos'))}
            {text('minAndroid', t('settings.minAndroid'))}
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('settings.contact')}</CardTitle>
            <CardDescription>{t('settings.contactHint')}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {text('supportEmail', t('settings.supportEmail'))}
            {text('emailAvailability', t('settings.emailAvailability'))}
            {text('phone', t('settings.phone'))}
            {text('phoneAvailability', t('settings.phoneAvailability'))}
          </CardContent>
        </Card>
        <div>
          <Button type="submit">{t('common.save')}</Button>
        </div>
      </form>
    </section>
  )
}
