import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { REEL_MAX_PER_MONTH, REEL_MAX_SECONDS } from '@/mock/data'
import { useMockStore } from '@/mock/store'

import { ChangePasswordCard } from './change-password-card'
import { ForceUpdateCard } from './force-update-card'

type TextKey = 'supportEmail' | 'emailAvailability' | 'phone' | 'phoneAvailability'
type FlagKey = 'featuredEnabled' | 'reelsEnabled' | 'guestBrowsing'

/** Global config the app reads on launch (A11): feature flags, support contacts. */
export function SettingsPage() {
  const { t } = useTranslation()
  const { logAudit } = useMockStore()
  const [s, setS] = useState({
    featuredEnabled: true,
    reelsEnabled: true,
    guestBrowsing: true,
    supportEmail: 'Inquiry@scout.com',
    emailAvailability: 'Response within 2 hrs',
    phone: '+965 1234 5678',
    phoneAvailability: 'Available 24/7',
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

  const save = (e: FormEvent) => {
    e.preventDefault()
    logAudit({ admin: '', action: 'settings.update', target: t('nav.settings'), before: '—', after: '—' })
    toast.success(t('common.saved'))
  }
  const saveButton = (
    <div>
      <Button type="submit">{t('common.save')}</Button>
    </div>
  )

  return (
    <section>
      <PageHeader title={t('nav.settings')} description={t('settings.description')} />
      <Tabs defaultValue="features">
        <TabsList>
          <TabsTrigger value="features">{t('settings.features')}</TabsTrigger>
          <TabsTrigger value="contact">{t('settings.contact')}</TabsTrigger>
          <TabsTrigger value="version">{t('settings.version')}</TabsTrigger>
          <TabsTrigger value="security">{t('settings.security')}</TabsTrigger>
        </TabsList>
        <TabsContent value="features">
          <form onSubmit={save} className="max-w-2xl space-y-3">
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.features')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {flag('featuredEnabled', t('settings.featuredEnabled'))}
                {flag('reelsEnabled', t('settings.reelsEnabled'))}
                <p className="text-muted-foreground text-xs">
                  {t('settings.reelRules', { perMonth: REEL_MAX_PER_MONTH, minutes: REEL_MAX_SECONDS / 60 })}
                </p>
                {flag('guestBrowsing', t('settings.guestBrowsing'))}
              </CardContent>
            </Card>
            {saveButton}
          </form>
        </TabsContent>
        <TabsContent value="contact">
          <form onSubmit={save} className="max-w-3xl space-y-3">
            <Card>
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
            {saveButton}
          </form>
        </TabsContent>
        <TabsContent value="version">
          <ForceUpdateCard />
        </TabsContent>
        <TabsContent value="security" className="max-w-xl">
          <ChangePasswordCard />
        </TabsContent>
      </Tabs>
    </section>
  )
}
