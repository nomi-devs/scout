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

/** Age and experience are filtered in bands, as in the app's filter sheet. */
const ageBands = [
  { key: 'u18', test: (n: number) => n < 18 },
  { key: '18-25', test: (n: number) => n >= 18 && n <= 25 },
  { key: '26-35', test: (n: number) => n >= 26 && n <= 35 },
  { key: '36+', test: (n: number) => n >= 36 },
]
const expBands = [
  { key: '0-2', test: (n: number) => n <= 2 },
  { key: '3-5', test: (n: number) => n >= 3 && n <= 5 },
  { key: '6-10', test: (n: number) => n >= 6 && n <= 10 },
  { key: '10+', test: (n: number) => n > 10 },
]
const bandOf = (bands: typeof ageBands, n: number) => bands.find((b) => b.test(n))?.key ?? ''

const unique = (values: string[]) =>
  [...new Set(values)].sort().map((v) => ({ value: v, label: v }))

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

  const roleProfiles = profiles.filter((p) => p.role === role)
  const rows = roleProfiles
    .filter((p) => matches(filter, p))
    .sort((a, b) => a.submittedAt - b.submittedAt)

  const columns: Column<ProfileRec>[] = [
    {
      key: 'name',
      header: t('col.name'),
      sort: (p) => p.name,
      cell: (p) => (
        <div>
          <span className="font-medium">{p.name}</span>
          <span className="text-muted-foreground block text-xs">{p.nationality}</span>
        </div>
      ),
    },
    { key: 'sport', header: t('col.sport'), sort: (p) => p.sport, cell: (p) => t(`sportNames.${p.sport}`) },
    { key: 'spec', header: t('col.specialization'), cell: (p) => p.specialization },
    { key: 'age', header: t('col.age'), sort: (p) => p.age, cell: (p) => p.age },
    { key: 'exp', header: t('col.experience'), sort: (p) => p.years, cell: (p) => t('profiles.yearsShort', { n: p.years }) },
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
        searchText={(p) => `${p.name} ${p.specialization} ${p.city} ${p.nationality}`}
        onRowClick={(p) => navigate(`/${role}s/${p.id}`)}
        filters={[
          {
            key: 'sport',
            label: t('filters.allSports'),
            options: sports.map((s) => ({ value: s, label: t(`sportNames.${s}`) })),
            value: (p) => p.sport,
          },
          {
            key: 'nationality',
            label: t('filters.allNationalities'),
            options: unique(roleProfiles.map((p) => p.nationality)),
            value: (p) => p.nationality,
          },
          {
            key: 'specialization',
            label: t('filters.allSpecializations'),
            options: unique(roleProfiles.map((p) => p.specialization)),
            value: (p) => p.specialization,
          },
          {
            key: 'age',
            label: t('filters.allAges'),
            options: ageBands.map((b) => ({ value: b.key, label: t(`filters.age.${b.key}`) })),
            value: (p) => bandOf(ageBands, p.age),
          },
          {
            key: 'experience',
            label: t('filters.allExperience'),
            options: expBands.map((b) => ({ value: b.key, label: t(`filters.exp.${b.key}`) })),
            value: (p) => bandOf(expBands, p.years),
          },
          {
            key: 'location',
            label: t('filters.allLocations'),
            options: unique(roleProfiles.map((p) => p.location)),
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
