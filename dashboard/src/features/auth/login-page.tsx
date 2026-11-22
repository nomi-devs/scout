import { zodResolver } from '@hookform/resolvers/zod'
import { Megaphone, ShieldCheck, WalletCards } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Navigate, useNavigate } from 'react-router'

import { LanguageSwitcher } from '@/app/layout/language-switcher'
import { BrandTile, logoMark, Wordmark } from '@/components/brand'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

import { loginSchema, type LoginValues } from './login-schema'
import { useSession } from './session-context'

const highlights = [
  { key: 'review', icon: ShieldCheck },
  { key: 'money', icon: WalletCards },
  { key: 'content', icon: Megaphone },
] as const

export function LoginPage() {
  const { t } = useTranslation()
  const { session, signIn } = useSession()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } })

  if (session) return <Navigate to="/" replace />

  const onSubmit = (values: LoginValues) => {
    // Clickable build: any valid email signs in as a super admin.
    signIn({ name: 'Scout Admin', email: values.email, role: 'super_admin' })
    void navigate('/', { replace: true })
  }

  return (
    <main className="bg-background grid min-h-svh lg:grid-cols-[1.1fr_1fr]">
      {/* Brand panel: the app's splash gradient and logo */}
      <aside className="bg-brand-gradient relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="bg-dots absolute inset-0" aria-hidden />
        <div className="absolute -top-24 -start-24 size-80 rounded-full bg-white/10 blur-3xl" aria-hidden />
        <div className="absolute -bottom-32 end-10 size-96 rounded-full bg-sky-300/20 blur-3xl" aria-hidden />
        <img src={logoMark} alt="" aria-hidden className="absolute -end-16 bottom-10 h-[70%] w-auto opacity-[0.08]" />

        <Wordmark white className="relative h-11 self-start" />

        <div className="relative max-w-lg space-y-6">
          <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide uppercase backdrop-blur">
            {t('login.badge')}
          </span>
          <h2 className="font-heading text-5xl leading-tight font-bold uppercase">{t('login.brandTitle')}</h2>
          <p className="text-lg text-white/80">{t('login.brandBody')}</p>
          <ul className="space-y-3">
            {highlights.map(({ key, icon: Icon }) => (
              <li
                key={key}
                className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-white/15">
                  <Icon className="size-5" />
                </span>
                <span className="text-sm font-medium">{t(`login.highlights.${key}`)}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-white/60">{t('login.footer')}</p>
      </aside>

      {/* Form side */}
      <section className="bg-page-wash relative flex flex-col p-6 md:p-10">
        <div className="flex items-center justify-between">
          <Wordmark className="lg:invisible" />
          <LanguageSwitcher />
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <Card className="w-full max-w-md rounded-2xl border-0 shadow-xl shadow-primary/10">
            <CardHeader className="space-y-3">
              <BrandTile className="size-14" />
              <div>
                <CardTitle className="font-heading text-3xl uppercase">{t('login.title')}</CardTitle>
                <CardDescription className="mt-1">{t('login.subtitle')}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form noValidate onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
                <FieldGroup>
                  <Field data-invalid={!!errors.email}>
                    <FieldLabel htmlFor="email">{t('login.email')}</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="username"
                      placeholder="admin@scout.app"
                      className="h-11"
                      aria-invalid={!!errors.email}
                      {...register('email')}
                    />
                    {errors.email?.message && <FieldError>{t(errors.email.message)}</FieldError>}
                  </Field>
                  <Field data-invalid={!!errors.password}>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor="password">{t('login.password')}</FieldLabel>
                      <Button type="button" variant="link" className="h-auto p-0 text-xs">
                        {t('login.forgot')}
                      </Button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      className="h-11"
                      aria-invalid={!!errors.password}
                      {...register('password')}
                    />
                    {errors.password?.message && <FieldError>{t(errors.password.message)}</FieldError>}
                  </Field>
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-brand-gradient h-11 text-base shadow-md shadow-primary/30"
                    disabled={isSubmitting}
                  >
                    {t('login.submit')}
                  </Button>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
        <p className="text-muted-foreground text-center text-xs lg:hidden">{t('login.footer')}</p>
      </section>
    </main>
  )
}
