import { useTranslation } from 'react-i18next'

import { StatusBadge } from '@/components/status-badge'
import { formatKwd } from '@/lib/format'
import { CrudPage, type Row } from '@/features/shared/crud-page'
import { bi } from '@/features/shared/helpers'

/** Same packages and prices as the approved app: Subscription Plan screen. */
const plans: Row[] = [
  {
    id: 'pl1',
    nameEn: '6-Month Subscription',
    nameAr: 'اشتراك 6 أشهر',
    descEn: 'Profile visibility for 6 months.',
    descAr: 'ظهور الملف لمدة 6 أشهر.',
    kind: 'membership',
    months: 6,
    price: 36,
    bestValue: false,
    active: true,
  },
  {
    id: 'pl2',
    nameEn: '1-Year Subscription',
    nameAr: 'اشتراك سنة',
    descEn: 'Profile visibility for 1 year.',
    descAr: 'ظهور الملف لمدة سنة.',
    kind: 'membership',
    months: 12,
    price: 60,
    bestValue: true,
    active: true,
  },
  {
    id: 'pl3',
    nameEn: 'Featured · 1 month',
    nameAr: 'مميز · شهر',
    descEn: 'Active for 1 month from successful payment.',
    descAr: 'فعّال لمدة شهر من تاريخ الدفع.',
    kind: 'featured',
    months: 1,
    price: 5,
    bestValue: false,
    active: true,
  },
  {
    id: 'pl4',
    nameEn: 'Featured · 3 months',
    nameAr: 'مميز · 3 أشهر',
    descEn: 'Active for 3 months from successful payment.',
    descAr: 'فعّال لمدة 3 أشهر من تاريخ الدفع.',
    kind: 'featured',
    months: 3,
    price: 20,
    bestValue: true,
    active: true,
  },
]

export function PlansPage() {
  const { t } = useTranslation()
  return (
    <CrudPage
      config={{
        title: t('nav.plans'),
        description: t('plans.description'),
        addLabel: t('plans.add'),
        rows: plans,
        auditKey: 'plan',
        rowName: (r) => String(r.nameEn),
        searchText: (r) => `${r.nameEn} ${r.nameAr}`,
        filters: [
          {
            key: 'kind',
            label: t('filters.allTypes'),
            options: [
              { value: 'membership', label: t('plans.membership') },
              { value: 'featured', label: t('plans.featured') },
            ],
            value: (r) => String(r.kind),
          },
        ],
        blank: {
          nameEn: '',
          nameAr: '',
          descEn: '',
          descAr: '',
          kind: 'membership',
          months: 1,
          price: 0,
          bestValue: false,
          active: true,
        },
        fields: [
          { key: 'name', label: 'f.name', type: 'bilingual' },
          { key: 'desc', label: 'f.description', type: 'bilingual' },
          {
            key: 'kind',
            label: 'f.kind',
            type: 'select',
            options: [
              { value: 'membership', label: t('plans.membership') },
              { value: 'featured', label: t('plans.featured') },
            ],
          },
          { key: 'months', label: 'f.months', type: 'number' },
          { key: 'price', label: 'f.price', type: 'number' },
          { key: 'bestValue', label: 'f.bestValue', type: 'checkbox' },
          { key: 'active', label: 'f.active', type: 'checkbox' },
        ],
        columns: ({ lang }) => [
          {
            key: 'name',
            header: t('col.name'),
            cell: (r) => <span className="font-medium">{bi(r, 'name', lang)}</span>,
          },
          { key: 'kind', header: t('col.type'), cell: (r) => t(`plans.${r.kind}`) },
          { key: 'months', header: t('col.months'), cell: (r) => r.months },
          { key: 'price', header: t('col.price'), cell: (r) => formatKwd(Number(r.price)) },
          {
            key: 'status',
            header: t('col.status'),
            cell: (r) => (
              <div className="flex gap-1">
                <StatusBadge tone={r.active ? 'success' : 'neutral'}>
                  {r.active ? t('status.active') : t('status.inactive')}
                </StatusBadge>
                {r.bestValue && <StatusBadge tone="info">{t('plans.bestValue')}</StatusBadge>}
              </div>
            ),
          },
        ],
      }}
    />
  )
}
