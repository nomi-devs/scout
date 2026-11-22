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
import { formatDate, hoursSince } from '@/lib/format'
import type { ReportRec } from '@/mock/data'
import { useMockStore } from '@/mock/store'

const tones: Record<ReportRec['status'], Tone> = {
  open: 'warning',
  dismissed: 'neutral',
  hidden: 'danger',
  suspended: 'danger',
}

export function ReportsPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { reports, profiles } = useMockStore()
  const name = (r: ReportRec) => profiles.find((p) => p.id === r.profileId)?.name ?? ''

  const columns: Column<ReportRec>[] = [
    {
      key: 'item',
      header: t('col.reportedProfile'),
      sort: (r) => name(r),
      cell: (r) => <span className="font-medium">{name(r)}</span>,
    },
    { key: 'reasons', header: t('col.reasons'), cell: (r) => r.reasons.join(', ') },
    { key: 'count', header: t('col.reporters'), sort: (r) => r.reporters.length, cell: (r) => r.reporters.length },
    {
      key: 'at',
      header: t('col.reported'),
      sort: (r) => r.createdAt,
      cell: (r) => {
        const late = r.status === 'open' && hoursSince(r.createdAt) > 24
        return (
          <span className={late ? 'text-destructive font-medium' : undefined}>
            {formatDate(r.createdAt, i18n.language)}
            {late && ` · ${t('profiles.overdue')}`}
          </span>
        )
      },
    },
    {
      key: 'status',
      header: t('col.status'),
      cell: (r) => <StatusBadge tone={tones[r.status]}>{t(`reports.status.${r.status}`)}</StatusBadge>,
    },
  ]

  return (
    <section>
      <PageHeader title={t('nav.reports')} description={t('reports.description')} />
      <DataTable
        columns={columns}
        rows={[...reports].sort(
          (a, b) => Number(b.status === 'open') - Number(a.status === 'open') || a.createdAt - b.createdAt,
        )}
        getKey={(r) => r.id}
        searchText={(r) => `${name(r)} ${r.reasons.join(' ')}`}
        onRowClick={(r) => navigate(`/reports/${r.id}`)}
        filters={[
          {
            key: 'status',
            label: t('filters.allStatuses'),
            options: (['open', 'dismissed', 'hidden', 'suspended'] as const).map((s) => ({
              value: s,
              label: t(`reports.status.${s}`),
            })),
            value: (r) => r.status,
          },
          {
            key: 'reason',
            label: t('filters.allReasons'),
            options: [...new Set(reports.flatMap((r) => r.reasons))].map((v) => ({ value: v, label: v })),
            value: (r) => r.reasons[0] ?? '',
          },
        ]}
      />
    </section>
  )
}

type Action = 'dismiss' | 'hide' | 'suspend'

export function ReportDetailPage() {
  const { t, i18n } = useTranslation()
  const { id } = useParams()
  const { reports, profiles, updateReport, updateProfile, updateUser, logAudit } = useMockStore()
  const [action, setAction] = useState<Action | null>(null)
  const report = reports.find((r) => r.id === id)
  const profile = profiles.find((p) => p.id === report?.profileId)
  if (!report || !profile) return <p>{t('notFound.title')}</p>
  const isOpen = report.status === 'open'

  function apply(a: Action, note: string) {
    if (!report || !profile) return
    if (a === 'hide') updateProfile(profile.id, { status: 'hidden' })
    if (a === 'suspend') {
      updateProfile(profile.id, { status: 'hidden' })
      updateUser(profile.userId, { status: 'suspended' })
    }
    const status = a === 'dismiss' ? 'dismissed' : a === 'hide' ? 'hidden' : 'suspended'
    updateReport(report.id, { status, resolutionNote: note })
    logAudit({ admin: '', action: `report.${a}`, target: profile.name, before: 'open', after: `${status}: ${note}` })
    toast.success(t('reports.doneToast'))
  }

  return (
    <section>
      <Button asChild variant="ghost" size="sm" className="mb-2">
        <Link to="/reports">
          <ArrowLeft className="rtl:rotate-180" data-icon="inline-start" />
          {t('common.back')}
        </Link>
      </Button>
      <PageHeader
        title={profile.name}
        description={t('reports.detailDescription')}
        actions={<StatusBadge tone={tones[report.status]}>{t(`reports.status.${report.status}`)}</StatusBadge>}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('col.reasons')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {report.reasons.map((r) => (
                <StatusBadge key={r} tone="danger">
                  {r}
                </StatusBadge>
              ))}
            </div>
            {report.note && <p className="text-sm">“{report.note}”</p>}
            <p className="text-muted-foreground text-sm">
              {t('col.reporters')}: {report.reporters.join(', ')} · {formatDate(report.createdAt, i18n.language)}
            </p>
            {report.resolutionNote && (
              <p className="text-sm">
                <span className="font-medium">{t('reports.resolution')}:</span> {report.resolutionNote}
              </p>
            )}
            <Button asChild variant="outline" size="sm">
              <Link to={`/${profile.role}s/${profile.id}`}>{t('reports.viewProfile')}</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('review.decision')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button variant="outline" disabled={!isOpen} onClick={() => setAction('dismiss')}>
              {t('reports.dismiss')}
            </Button>
            <Button variant="outline" disabled={!isOpen} onClick={() => setAction('hide')}>
              {t('reports.hide')}
            </Button>
            <Button variant="destructive" disabled={!isOpen} onClick={() => setAction('suspend')}>
              {t('reports.suspend')}
            </Button>
          </CardContent>
        </Card>
      </div>
      <ActionDialog
        open={action !== null}
        onOpenChange={(o) => !o && setAction(null)}
        title={action ? t(`reports.${action}`) : ''}
        description={action ? t(`reports.${action}Hint`) : undefined}
        confirmLabel={t('common.confirm')}
        destructive={action === 'suspend'}
        noteLabel={t('review.note')}
        onConfirm={(note) => action && apply(action, note)}
      />
    </section>
  )
}
