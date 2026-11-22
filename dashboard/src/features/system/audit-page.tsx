import { useTranslation } from 'react-i18next'

import { DataTable, type Column } from '@/components/data-table'
import { PageHeader } from '@/components/page-header'
import { StatusBadge } from '@/components/status-badge'
import { useMockStore, type AuditEntry } from '@/mock/store'

export function AuditPage() {
  const { t, i18n } = useTranslation()
  const { audit } = useMockStore()
  const fmt = new Intl.DateTimeFormat(i18n.language === 'ar' ? 'ar-KW-u-nu-latn' : 'en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
  const columns: Column<AuditEntry>[] = [
    { key: 'at', header: t('col.date'), sort: (a) => a.at, cell: (a) => fmt.format(a.at) },
    { key: 'admin', header: t('col.admin'), sort: (a) => a.admin, cell: (a) => a.admin },
    { key: 'action', header: t('col.action'), cell: (a) => <StatusBadge tone="info">{a.action}</StatusBadge> },
    { key: 'target', header: t('col.target'), cell: (a) => <span className="font-medium">{a.target}</span> },
    { key: 'before', header: t('col.before'), cell: (a) => <span className="text-muted-foreground">{a.before}</span> },
    { key: 'after', header: t('col.after'), cell: (a) => a.after },
  ]
  return (
    <section>
      <PageHeader title={t('nav.audit')} description={t('audit.description')} />
      <DataTable
        columns={columns}
        rows={audit}
        getKey={(a) => a.id}
        searchText={(a) => `${a.admin} ${a.action} ${a.target}`}
        filters={[
          {
            key: 'area',
            label: t('filters.allAreas'),
            options: [...new Set(audit.map((a) => a.action.split('.')[0] ?? ''))].map((v) => ({ value: v, label: v })),
            value: (a) => a.action.split('.')[0] ?? '',
          },
        ]}
      />
    </section>
  )
}
