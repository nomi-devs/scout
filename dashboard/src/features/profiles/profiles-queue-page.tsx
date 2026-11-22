import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { DataTable, type Column } from '@/components/data-table'
import { PageHeader } from '@/components/page-header'
import { StatusBadge } from '@/components/status-badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate, hoursSince } from '@/lib/format'
import type { ProfileRec, ProfileRole } from '@/mock/data'
import { useMockStore } from '@/mock/store'

import { isPending, ProfileStatusBadge } from './profile-status'

const sports = ['football', 'basketball', 'volleyball', 'tennis', 'cricket']

type Filter = 'pending' | 'approved' | 'rejected' | 'hidden' | 'all'

const matches = (filter: Filter, p: ProfileRec) =>
  filter === 'all' ||
  (filter === 'pending' && isPending(p.status)) ||
  (filter === 'rejected' && (p.status === 'rejected' || p.status === 'rejectedFinal')) ||
  p.status === filter

/** Review queue for players or trainers: oldest pending first, over 24 h in red (flow B). */
export function ProfilesQueuePage({ role }: { role: ProfileRole }) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { profiles } = useMockStore()
  const [filter, setFilter] = useState<Filter>('pending')

  const rows = profiles
    .filter((p) => p.role === role && matches(filter, p))
    .sort((a, b) => a.submittedAt - b.submittedAt)

  const columns: Column<ProfileRec>[] = [
    {
      key: 'name',
      header: t('col.name'),
      sort: (p) => p.name,
      cell: (p) => <span className="font-medium">{p.name}</span>,
    },
    { key: 'sport', header: t('col.sport'), sort: (p) => p.sport, cell: (p) => t(`sportNames.${p.sport}`) },
    { key: 'spec', header: t('col.specialization'), cell: (p) => p.specialization },
    { key: 'loc', header: t('col.location'), sort: (p) => p.city, cell: (p) => p.city },
    {
      key: 'submitted',
      header: t('col.submitted'),
      sort: (p) => p.submittedAt,
      cell: (p) => {
        const late = isPending(p.status) && hoursSince(p.submittedAt) > 24
        return (
          <span className={late ? 'text-destructive font-medium' : undefined}>
            {formatDate(p.submittedAt, i18n.language)}
            {late && ` · ${t('profiles.overdue')}`}
          </span>
        )
      },
    },
    { key: 'status', header: t('col.status'), cell: (p) => <ProfileStatusBadge status={p.status} /> },
    {
      key: 'lock',
      header: '',
      cell: (p) =>
        p.lockedBy ? (
          <StatusBadge tone="warning">{t('profiles.beingReviewed', { name: p.lockedBy })}</StatusBadge>
        ) : null,
    },
  ]

  return (
    <section>
      <PageHeader
        title={t(role === 'player' ? 'nav.players' : 'nav.trainers')}
        description={t('profiles.queueDescription')}
      />
      <DataTable
        columns={columns}
        rows={rows}
        getKey={(p) => p.id}
        searchText={(p) => `${p.name} ${p.specialization} ${p.city}`}
        onRowClick={(p) => navigate(`/${role}s/${p.id}`)}
        filters={[
          {
            key: 'sport',
            label: t('filters.allSports'),
            options: sports.map((s) => ({ value: s, label: t(`sportNames.${s}`) })),
            value: (p) => p.sport,
          },
          {
            key: 'location',
            label: t('filters.allLocations'),
            options: [...new Set(profiles.map((p) => p.location))].map((l) => ({ value: l, label: l })),
            value: (p) => p.location,
          },
        ]}
        toolbar={
          <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
            <TabsList variant="line">
              {(['pending', 'approved', 'rejected', 'hidden', 'all'] as const).map((f) => (
                <TabsTrigger key={f} value={f}>
                  {t(`profiles.filter.${f}`)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        }
      />
    </section>
  )
}
