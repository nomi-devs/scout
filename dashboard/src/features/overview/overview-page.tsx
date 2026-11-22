import { CalendarX, CheckCircle2, Film, Flag, Hourglass, Receipt, Star, UserPlus, Users, Wallet } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { hoursSince } from '@/lib/format'
import { revenueByMonth, transactions } from '@/mock/data'
import { useMockStore } from '@/mock/store'

import { isPending } from '../profiles/profile-status'

const tones = {
  primary: 'bg-secondary text-primary',
  warning: 'bg-warning-bg text-amber-700',
  danger: 'bg-danger-bg text-destructive',
  success: 'bg-emerald-50 text-emerald-600',
} as const

function Stat({
  icon: Icon,
  label,
  value,
  to,
  tone = 'primary',
}: {
  icon: typeof Users
  label: string
  value: string | number
  to?: string
  tone?: keyof typeof tones
}) {
  const body = (
    <Card
      className={`h-full border-0 shadow-sm transition duration-200 ${to ? 'hover:-translate-y-0.5 hover:shadow-md active:translate-y-0' : ''}`}
    >
      <CardContent className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl sm:size-11 ${tones[tone]}`}>
          <Icon className="size-5 sm:size-6" />
        </span>
        <div>
          <p className="text-muted-foreground text-xs sm:text-sm">{label}</p>
          <p className="font-heading text-2xl font-bold sm:text-2xl">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
  return to ? (
    <Link to={to} className="block rounded-xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
      {body}
    </Link>
  ) : (
    body
  )
}

const WEEK = 7 * 86_400_000

export function OverviewPage() {
  const { t } = useTranslation()
  const { profiles, reports, reels, users } = useMockStore()
  const now = Date.now()
  const pending = profiles.filter((p) => isPending(p.status))
  const overdue = pending.filter((p) => hoursSince(p.submittedAt) > 24).length
  const openReports = reports.filter((r) => r.status === 'open').length
  const pendingReels = reels.filter((r) => r.status === 'pending').length
  const live = users.filter((u) => u.status !== 'deleted')
  const activeProfiles = users.filter((u) => u.subscriptionEndsAt && u.subscriptionEndsAt > now).length
  const expiredProfiles = users.filter((u) => u.subscriptionEndsAt && u.subscriptionEndsAt <= now).length
  const featured = profiles.filter((p) => p.featuredUntil && p.featuredUntil > now).length
  const paid = transactions.filter((x) => x.status === 'paid').length
  const last = revenueByMonth.at(-1)?.revenue ?? 0

  return (
    <section>
      <PageHeader title={t('nav.overview')} description={t('overview.description')} />
      <div className="stagger mb-3 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Stat
          icon={Hourglass}
          label={t('overview.pendingPlayers')}
          value={pending.filter((p) => p.role === 'player').length}
          to="/players"
        />
        <Stat
          icon={Hourglass}
          label={t('overview.pendingTrainers')}
          value={pending.filter((p) => p.role === 'trainer').length}
          to="/trainers"
        />
        <Stat tone="warning" icon={Film} label={t('overview.pendingReels')} value={pendingReels} to="/reels" />
        <Stat tone="danger" icon={Flag} label={t('overview.openReports')} value={openReports} to="/reports" />
      </div>
      <div className="stagger mb-3 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Stat icon={Users} label={t('overview.totalUsers')} value={live.length} to="/users" />
        <Stat icon={Users} label={t('overview.players')} value={live.filter((u) => u.role === 'player').length} />
        <Stat icon={Users} label={t('overview.trainers')} value={live.filter((u) => u.role === 'trainer').length} />
        <Stat
          icon={UserPlus}
          label={t('overview.newProfiles')}
          value={profiles.filter((p) => now - p.submittedAt < WEEK).length}
        />
      </div>
      <div className="stagger mb-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Stat
          tone="success"
          icon={CheckCircle2}
          label={t('overview.activeProfiles')}
          value={activeProfiles}
          to="/subscriptions"
        />
        <Stat
          tone="warning"
          icon={CalendarX}
          label={t('overview.expiredProfiles')}
          value={expiredProfiles}
          to="/subscriptions"
        />
        <Stat icon={Star} label={t('overview.featuredProfiles')} value={featured} to="/featured" />
        <Stat icon={Receipt} label={t('overview.payments')} value={paid} to="/transactions" />
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('overview.revenueTrend')}</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-3">
          <Stat icon={Wallet} label={t('overview.revenueMonth')} value={`${last} KWD`} to="/revenue" />
          <Stat tone="warning" icon={Hourglass} label={t('overview.overdue')} value={overdue} />
        </div>
      </div>
    </section>
  )
}
