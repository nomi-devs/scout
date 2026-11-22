import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import { ActionDialog } from '@/components/action-dialog'
import { DataTable, type Column } from '@/components/data-table'
import { PageHeader } from '@/components/page-header'
import { StatusBadge, type Tone } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSession } from '@/features/auth/session-context'
import { daysLeft, formatDate, formatKwd } from '@/lib/format'
import { transactions, type UserRec } from '@/mock/data'
import { useMockStore } from '@/mock/store'

const tones: Record<UserRec['status'], Tone> = { active: 'success', suspended: 'danger', deleted: 'neutral' }

export function UsersPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { users } = useMockStore()
  const columns: Column<UserRec>[] = [
    {
      key: 'name',
      header: t('col.name'),
      sort: (u) => u.name,
      cell: (u) => <span className="font-medium">{u.name}</span>,
    },
    { key: 'email', header: t('col.email'), cell: (u) => u.email },
    { key: 'role', header: t('col.type'), cell: (u) => t(`userRole.${u.role}`) },
    {
      key: 'joined',
      header: t('col.joined'),
      sort: (u) => u.joinedAt,
      cell: (u) => formatDate(u.joinedAt, i18n.language),
    },
    {
      key: 'status',
      header: t('col.status'),
      cell: (u) => <StatusBadge tone={tones[u.status]}>{t(`userStatus.${u.status}`)}</StatusBadge>,
    },
  ]
  return (
    <section>
      <PageHeader title={t('nav.users')} description={t('users.description')} />
      <DataTable
        columns={columns}
        rows={users}
        getKey={(u) => u.id}
        searchText={(u) => `${u.name} ${u.email} ${u.phone}`}
        onRowClick={(u) => navigate(`/users/${u.id}`)}
        filters={[
          {
            key: 'role',
            label: t('filters.allTypes'),
            options: (['player', 'trainer'] as const).map((r) => ({ value: r, label: t(`userRole.${r}`) })),
            value: (u) => u.role,
          },
          {
            key: 'status',
            label: t('filters.allStatuses'),
            options: (['active', 'suspended', 'deleted'] as const).map((s) => ({
              value: s,
              label: t(`userStatus.${s}`),
            })),
            value: (u) => u.status,
          },
        ]}
      />
    </section>
  )
}

type Action = 'suspend' | 'unsuspend' | 'delete' | 'extend'

export function UserDetailPage() {
  const { t, i18n } = useTranslation()
  const { id } = useParams()
  const { session } = useSession()
  const { users, profiles, reports, updateUser, updateProfile, logAudit } = useMockStore()
  const [action, setAction] = useState<Action | null>(null)
  const [days, setDays] = useState(30)
  const user = users.find((u) => u.id === id)
  const profile = profiles.find((p) => p.id === user?.profileId)
  if (!user || !profile) return <p>{t('notFound.title')}</p>

  // Finance can view users but not act on them (A1 role table).
  const canAct = session?.role !== 'finance'
  const userTx = transactions.filter((x) => x.userId === user.id)
  const userReports = reports.filter((r) => r.profileId === profile.id)
  const featured = !!profile.featuredUntil && profile.featuredUntil > Date.now()

  function apply(a: Action, note: string) {
    if (!user || !profile) return
    if (a === 'extend') {
      const base = Math.max(user.subscriptionEndsAt ?? Date.now(), Date.now())
      updateUser(user.id, { subscriptionEndsAt: base + days * 86_400_000 })
      logAudit({
        admin: '',
        action: 'user.extend',
        target: user.name,
        before: String(user.subscriptionEndsAt ?? '—'),
        after: `+${days}d: ${note}`,
      })
    } else {
      const status = a === 'delete' ? 'deleted' : a === 'suspend' ? 'suspended' : 'active'
      updateUser(user.id, { status })
      if (a !== 'unsuspend') updateProfile(profile.id, { status: 'hidden' })
      logAudit({ admin: '', action: `user.${a}`, target: user.name, before: user.status, after: `${status}: ${note}` })
    }
    toast.success(t('users.doneToast'))
  }

  function toggleFeatured() {
    if (!profile || !user) return
    updateProfile(profile.id, { featuredUntil: featured ? undefined : Date.now() + 30 * 86_400_000 })
    logAudit({
      admin: '',
      action: 'user.featured',
      target: user.name,
      before: featured ? 'on' : 'off',
      after: featured ? 'off' : 'on',
    })
    toast.success(t('users.doneToast'))
  }

  return (
    <section>
      <Button asChild variant="ghost" size="sm" className="mb-2">
        <Link to="/users">
          <ArrowLeft className="rtl:rotate-180" data-icon="inline-start" />
          {t('common.back')}
        </Link>
      </Button>
      <PageHeader
        title={user.name}
        description={user.email}
        actions={<StatusBadge tone={tones[user.status]}>{t(`userStatus.${user.status}`)}</StatusBadge>}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('users.history')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              {t('col.phone')}: {user.phone} · {t('col.joined')}: {formatDate(user.joinedAt, i18n.language)}
            </p>
            <p>
              {t('users.subscription')}:{' '}
              {user.subscriptionEndsAt
                ? `${user.subscriptionPlan ? `${t(`subscriptions.plan.${user.subscriptionPlan}`)} · ` : ''}${
                    user.subscriptionStartedAt ? `${formatDate(user.subscriptionStartedAt, i18n.language)} → ` : ''
                  }${formatDate(user.subscriptionEndsAt, i18n.language)} (${t('users.daysLeft', { count: daysLeft(user.subscriptionEndsAt) })})`
                : t('users.noSubscription')}
            </p>
            <p>
              {t('users.featured')}: {featured ? formatDate(profile.featuredUntil ?? 0, i18n.language) : t('common.no')}{' '}
              · {t('users.blocks')}: {user.blocks}
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to={`/${profile.role}s/${profile.id}`}>{t('users.viewProfile')}</Link>
            </Button>
            <div>
              <p className="mb-1 font-medium">{t('nav.transactions')}</p>
              {userTx.length === 0 && <p className="text-muted-foreground">{t('common.empty')}</p>}
              {userTx.map((x) => (
                <p key={x.id} className="text-muted-foreground">
                  {x.invoice} · {t(`txKind.${x.kind}`)} · {formatKwd(x.amount)} · {t(`txStatus.${x.status}`)}
                </p>
              ))}
            </div>
            <div>
              <p className="mb-1 font-medium">{t('nav.reports')}</p>
              {userReports.length === 0 && <p className="text-muted-foreground">{t('common.empty')}</p>}
              {userReports.map((r) => (
                <p key={r.id}>
                  <Link className="text-primary underline" to={`/reports/${r.id}`}>
                    {r.reasons.join(', ')}
                  </Link>{' '}
                  · {t(`reports.status.${r.status}`)}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('users.actions')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {!canAct && <p className="text-muted-foreground text-xs">{t('users.viewOnly')}</p>}
            <Button
              variant="outline"
              disabled={!canAct || user.status === 'deleted'}
              onClick={() => setAction('extend')}
            >
              {t('users.extend')}
            </Button>
            <Button variant="outline" disabled={!canAct || user.status === 'deleted'} onClick={toggleFeatured}>
              {featured ? t('users.featuredOff') : t('users.featuredOn')}
            </Button>
            {user.status === 'suspended' ? (
              <Button variant="outline" disabled={!canAct} onClick={() => setAction('unsuspend')}>
                {t('users.unsuspend')}
              </Button>
            ) : (
              <Button
                variant="outline"
                disabled={!canAct || user.status === 'deleted'}
                onClick={() => setAction('suspend')}
              >
                {t('users.suspend')}
              </Button>
            )}
            <Button
              variant="destructive"
              disabled={!canAct || user.status === 'deleted'}
              onClick={() => setAction('delete')}
            >
              {t('users.delete')}
            </Button>
          </CardContent>
        </Card>
      </div>
      <ActionDialog
        open={action !== null}
        onOpenChange={(o) => !o && setAction(null)}
        title={action ? t(`users.${action}`) : ''}
        confirmLabel={t('common.confirm')}
        destructive={action === 'delete' || action === 'suspend'}
        noteLabel={action === 'extend' ? t('users.extendReason') : t('review.note')}
        onConfirm={(note) => action && apply(action, note)}
      >
        {action === 'extend' && (
          <div className="space-y-1">
            <Label htmlFor="extend-days">{t('users.extendDays')}</Label>
            <Input
              id="extend-days"
              type="number"
              min={1}
              value={days}
              onChange={(e) => setDays(Math.max(1, Number(e.target.value)))}
            />
          </div>
        )}
      </ActionDialog>
    </section>
  )
}
