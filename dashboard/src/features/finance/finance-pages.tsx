import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { DataTable, type Column } from '@/components/data-table'
import { PageHeader } from '@/components/page-header'
import { StatusBadge, type Tone } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { daysLeft, formatDate, formatKwd } from '@/lib/format'
import { revenueByMonth, transactions, type ProfileRec, type TransactionRec, type UserRec } from '@/mock/data'
import { useMockStore } from '@/mock/store'

const txTone: Record<TransactionRec['status'], Tone> = { paid: 'success', failed: 'danger', refunded: 'neutral' }

export function TransactionsPage() {
  const { t, i18n } = useTranslation()
  const columns: Column<TransactionRec>[] = [
    {
      key: 'inv',
      header: t('col.invoice'),
      sort: (x) => x.invoice,
      cell: (x) => <span className="font-mono">{x.invoice}</span>,
    },
    { key: 'user', header: t('col.name'), sort: (x) => x.userName, cell: (x) => x.userName },
    { key: 'kind', header: t('col.type'), cell: (x) => t(`txKind.${x.kind}`) },
    { key: 'amount', header: t('col.amount'), sort: (x) => x.amount, cell: (x) => formatKwd(x.amount) },
    { key: 'method', header: t('col.method'), cell: (x) => x.method },
    {
      key: 'coupon',
      header: t('col.coupon'),
      cell: (x) =>
        x.coupon ? (
          <span>
            <span className="font-mono">{x.coupon}</span> · −{formatKwd(x.discount ?? 0)}
          </span>
        ) : (
          '—'
        ),
    },
    {
      key: 'validity',
      header: t('col.validity'),
      cell: (x) =>
        x.status === 'paid'
          ? `${formatDate(x.paidAt, i18n.language)} → ${formatDate(x.paidAt + x.months * 30 * 86_400_000, i18n.language)}`
          : '—',
    },
    { key: 'date', header: t('col.date'), sort: (x) => x.paidAt, cell: (x) => formatDate(x.paidAt, i18n.language) },
    {
      key: 'status',
      header: t('col.status'),
      cell: (x) => <StatusBadge tone={txTone[x.status]}>{t(`txStatus.${x.status}`)}</StatusBadge>,
    },
    {
      key: 'dl',
      header: '',
      cell: (x) =>
        x.status === 'paid' && (
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label={`${t('transactions.invoice')} ${x.invoice}`}
            onClick={() => toast.success(t('transactions.invoiceToast', { invoice: x.invoice }))}
          >
            <Download />
          </Button>
        ),
    },
  ]
  return (
    <section>
      <PageHeader title={t('nav.transactions')} description={t('transactions.description')} />
      <DataTable
        columns={columns}
        rows={[...transactions].sort((a, b) => b.paidAt - a.paidAt)}
        getKey={(x) => x.id}
        searchText={(x) => `${x.invoice} ${x.userName} ${x.method}`}
        filters={[
          {
            key: 'kind',
            label: t('filters.allTypes'),
            options: (['subscription', 'renewal', 'featured'] as const).map((k) => ({
              value: k,
              label: t(`txKind.${k}`),
            })),
            value: (x) => x.kind,
          },
          {
            key: 'status',
            label: t('filters.allStatuses'),
            options: (['paid', 'failed', 'refunded'] as const).map((k) => ({ value: k, label: t(`txStatus.${k}`) })),
            value: (x) => x.status,
          },
          {
            key: 'method',
            label: t('filters.allMethods'),
            options: ['KNET', 'Apple Pay', 'Visa', 'Mastercard'].map((m) => ({ value: m, label: m })),
            value: (x) => x.method,
          },
        ]}
      />
    </section>
  )
}

export function SubscriptionsPage() {
  const { t, i18n } = useTranslation()
  const { users, profiles } = useMockStore()
  const rows = users.filter((u) => u.subscriptionEndsAt)
  const columns: Column<UserRec>[] = [
    {
      key: 'name',
      header: t('col.name'),
      sort: (u) => u.name,
      cell: (u) => <span className="font-medium">{u.name}</span>,
    },
    { key: 'type', header: t('col.type'), cell: (u) => t(`userRole.${u.role}`) },
    {
      key: 'plan',
      header: t('col.plan'),
      cell: (u) => (u.subscriptionPlan ? t(`subscriptions.plan.${u.subscriptionPlan}`) : '—'),
    },
    {
      key: 'started',
      header: t('col.started'),
      sort: (u) => u.subscriptionStartedAt ?? 0,
      cell: (u) => (u.subscriptionStartedAt ? formatDate(u.subscriptionStartedAt, i18n.language) : '—'),
    },
    {
      key: 'ends',
      header: t('col.expires'),
      sort: (u) => u.subscriptionEndsAt ?? 0,
      cell: (u) => formatDate(u.subscriptionEndsAt!, i18n.language),
    },
    { key: 'left', header: t('col.daysLeft'), cell: (u) => daysLeft(u.subscriptionEndsAt!) },
    {
      key: 'status',
      header: t('col.status'),
      cell: (u) => {
        const active = u.subscriptionEndsAt! > Date.now()
        const soon = active && daysLeft(u.subscriptionEndsAt!) <= 7
        return (
          <StatusBadge tone={!active ? 'neutral' : soon ? 'warning' : 'success'}>
            {!active ? t('subscriptions.expired') : soon ? t('subscriptions.expiringSoon') : t('status.active')}
          </StatusBadge>
        )
      },
    },
    {
      key: 'feat',
      header: t('col.featuredUntil'),
      cell: (u) => {
        const until = profiles.find((p) => p.id === u.profileId)?.featuredUntil
        return until && until > Date.now() ? formatDate(until, i18n.language) : '—'
      },
    },
  ]
  return (
    <section>
      <PageHeader title={t('nav.subscriptions')} description={t('subscriptions.description')} />
      <DataTable
        columns={columns}
        rows={[...rows].sort((a, b) => (a.subscriptionEndsAt ?? 0) - (b.subscriptionEndsAt ?? 0))}
        getKey={(u) => u.id}
        searchText={(u) => u.name}
        filters={[
          {
            key: 'role',
            label: t('filters.allTypes'),
            options: (['player', 'trainer'] as const).map((r) => ({ value: r, label: t(`userRole.${r}`) })),
            value: (u) => u.role,
          },
          {
            key: 'state',
            label: t('filters.allStatuses'),
            options: [
              { value: 'active', label: t('status.active') },
              { value: 'soon', label: t('subscriptions.expiringSoon') },
              { value: 'expired', label: t('subscriptions.expired') },
            ],
            value: (u) => {
              const left = daysLeft(u.subscriptionEndsAt ?? 0)
              return (u.subscriptionEndsAt ?? 0) <= Date.now() ? 'expired' : left <= 7 ? 'soon' : 'active'
            },
          },
        ]}
      />
    </section>
  )
}

export function FeaturedPage() {
  const { t, i18n } = useTranslation()
  const { profiles, updateProfile, logAudit } = useMockStore()
  const rows = profiles.filter((p) => p.featuredUntil)
  const columns: Column<ProfileRec>[] = [
    {
      key: 'name',
      header: t('col.name'),
      sort: (p) => p.name,
      cell: (p) => <span className="font-medium">{p.name}</span>,
    },
    { key: 'role', header: t('col.type'), cell: (p) => t(`userRole.${p.role}`) },
    { key: 'sport', header: t('col.sport'), cell: (p) => t(`sportNames.${p.sport}`) },
    {
      key: 'ends',
      header: t('col.expires'),
      sort: (p) => p.featuredUntil ?? 0,
      cell: (p) => formatDate(p.featuredUntil!, i18n.language),
    },
    { key: 'left', header: t('col.daysLeft'), cell: (p) => daysLeft(p.featuredUntil!) },
    {
      key: 'act',
      header: '',
      cell: (p) => (
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              updateProfile(p.id, { featuredUntil: (p.featuredUntil ?? Date.now()) + 30 * 86_400_000 })
              logAudit({
                admin: '',
                action: 'featured.extend',
                target: p.name,
                before: String(p.featuredUntil ?? '—'),
                after: '+30d',
              })
              toast.success(t('users.doneToast'))
            }}
          >
            {t('featured.extend')}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              updateProfile(p.id, { featuredUntil: undefined })
              logAudit({ admin: '', action: 'featured.remove', target: p.name, before: 'on', after: 'off' })
              toast.success(t('users.doneToast'))
            }}
          >
            {t('featured.remove')}
          </Button>
        </div>
      ),
    },
  ]
  return (
    <section>
      <PageHeader title={t('nav.featured')} description={t('featured.description')} />
      <DataTable
        columns={columns}
        rows={rows}
        getKey={(p) => p.id}
        searchText={(p) => p.name}
        filters={[
          {
            key: 'role',
            label: t('filters.allTypes'),
            options: (['player', 'trainer'] as const).map((r) => ({ value: r, label: t(`userRole.${r}`) })),
            value: (p) => p.role,
          },
        ]}
      />
    </section>
  )
}

export function RevenuePage() {
  const { t } = useTranslation()
  const sum = (key: 'revenue' | 'subscriptions' | 'featured') => revenueByMonth.reduce((s, m) => s + m[key], 0)
  return (
    <section>
      <PageHeader title={t('nav.revenue')} description={t('revenue.description')} />
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        {(['revenue', 'subscriptions', 'featured'] as const).map((k) => (
          <Card key={k}>
            <CardHeader>
              <CardTitle className="text-muted-foreground text-sm">
                {t(k === 'revenue' ? 'revenue.total' : `revenue.${k}`)}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">{sum(k)} KWD</CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t('revenue.byMonth')}</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="subscriptions" name={t('revenue.subscriptions')} stackId="a" fill="var(--color-primary)" />
              <Bar dataKey="featured" name={t('revenue.featured')} stackId="a" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </section>
  )
}
