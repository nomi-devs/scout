import { useTranslation } from 'react-i18next'

import { StatusBadge } from '@/components/status-badge'
import { CrudPage, type Row } from '@/features/shared/crud-page'
import { formatKwd } from '@/lib/format'

/** In the app, RENEW10 takes 10% off the subscription only, not the Featured add-on. */
const coupons: Row[] = [
  {
    id: 'c1',
    code: 'RENEW10',
    discountType: 'percent',
    value: 10,
    appliesTo: 'subscription',
    maxUses: 500,
    used: 132,
    startsAt: '2026-01-01',
    expiresAt: '2027-12-31',
    active: true,
  },
  {
    id: 'c2',
    code: 'WELCOME10',
    discountType: 'percent',
    value: 10,
    appliesTo: 'subscription',
    maxUses: 500,
    used: 98,
    startsAt: '2026-01-01',
    expiresAt: '2027-03-31',
    active: true,
  },
  {
    id: 'c3',
    code: 'RAMADAN20',
    discountType: 'percent',
    value: 20,
    appliesTo: 'both',
    maxUses: 200,
    used: 200,
    startsAt: '2026-02-15',
    expiresAt: '2026-04-30',
    active: false,
  },
  {
    id: 'c4',
    code: 'SAVE5',
    discountType: 'fixed',
    value: 5,
    appliesTo: 'featured',
    maxUses: 100,
    used: 17,
    startsAt: '2026-10-01',
    expiresAt: '2027-01-15',
    active: true,
  },
]

export function CouponsPage() {
  const { t } = useTranslation()
  const discount = (r: Row) => (r.discountType === 'percent' ? `${r.value}%` : formatKwd(Number(r.value)))
  return (
    <CrudPage
      config={{
        title: t('nav.coupons'),
        description: t('coupons.description'),
        addLabel: t('coupons.add'),
        rows: coupons,
        auditKey: 'coupon',
        rowName: (r) => String(r.code),
        searchText: (r) => String(r.code),
        blank: {
          code: '',
          discountType: 'percent',
          value: 10,
          appliesTo: 'subscription',
          maxUses: 100,
          used: 0,
          startsAt: '',
          expiresAt: '',
          active: true,
        },
        fields: [
          { key: 'code', label: 'f.code', type: 'text' },
          {
            key: 'discountType',
            label: 'f.discountType',
            type: 'select',
            options: (['percent', 'fixed'] as const).map((v) => ({ value: v, label: t(`coupons.type.${v}`) })),
          },
          { key: 'value', label: 'f.discountValue', type: 'number' },
          {
            key: 'appliesTo',
            label: 'f.appliesTo',
            type: 'select',
            options: (['subscription', 'featured', 'both'] as const).map((v) => ({
              value: v,
              label: t(`coupons.appliesTo.${v}`),
            })),
          },
          { key: 'maxUses', label: 'f.maxUses', type: 'number' },
          { key: 'startsAt', label: 'f.startsAt', type: 'date' },
          { key: 'expiresAt', label: 'f.expiresAt', type: 'date' },
          { key: 'active', label: 'f.active', type: 'checkbox' },
        ],
        columns: () => [
          { key: 'code', header: t('col.code'), cell: (r) => <span className="font-mono font-medium">{r.code}</span> },
          { key: 'off', header: t('col.discount'), cell: discount },
          { key: 'applies', header: t('col.appliesTo'), cell: (r) => t(`coupons.appliesTo.${r.appliesTo}`) },
          { key: 'used', header: t('col.used'), cell: (r) => `${r.used} / ${r.maxUses}` },
          { key: 'valid', header: t('col.validity'), cell: (r) => `${r.startsAt} → ${r.expiresAt}` },
          {
            key: 'status',
            header: t('col.status'),
            cell: (r) => (
              <StatusBadge tone={r.active ? 'success' : 'neutral'}>
                {r.active ? t('status.active') : t('status.inactive')}
              </StatusBadge>
            ),
          },
        ],
      }}
    />
  )
}
