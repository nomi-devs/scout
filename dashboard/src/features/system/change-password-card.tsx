import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { changePassword } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useMockStore } from '@/mock/store'
import { changePasswordRequestSchema, type ChangePasswordRequest } from '@/schemas/auth'

const fields = [
  { name: 'currentPassword', label: 'password.current', autoComplete: 'current-password' },
  { name: 'newPassword', label: 'password.new', autoComplete: 'new-password' },
  { name: 'confirmPassword', label: 'password.confirm', autoComplete: 'new-password' },
] as const

/** Lets the signed-in admin change their own password. Recorded in the audit log. */
export function ChangePasswordCard() {
  const { t } = useTranslation()
  const { logAudit } = useMockStore()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordRequest>({
    resolver: zodResolver(changePasswordRequestSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  const onSubmit = async (values: ChangePasswordRequest) => {
    await changePassword(values)
    logAudit({ admin: '', action: 'auth.changePassword', target: t('password.title'), before: '—', after: '—' })
    toast.success(t('password.changed'))
    reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('password.title')}</CardTitle>
        <CardDescription>{t('password.hint')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form noValidate onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
          <FieldGroup>
            {fields.map(({ name, label, autoComplete }) => (
              <Field key={name} data-invalid={!!errors[name]}>
                <FieldLabel htmlFor={name}>{t(label)}</FieldLabel>
                <Input
                  id={name}
                  type="password"
                  autoComplete={autoComplete}
                  aria-invalid={!!errors[name]}
                  {...register(name)}
                />
                {errors[name]?.message && <FieldError>{t(errors[name].message)}</FieldError>}
              </Field>
            ))}
            <div>
              <Button type="submit" disabled={isSubmitting}>
                {t('password.submit')}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
