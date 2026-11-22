import { useTranslation } from 'react-i18next'

import { adminRoles } from '@/app/nav'
import { StatusBadge } from '@/components/status-badge'
import { CrudPage, type Row } from '@/features/shared/crud-page'

const admins: Row[] = [
  { id: 'ad1', name: 'Super Admin', email: 'admin@scout.app', role: 'super_admin', active: true },
  { id: 'ad2', name: 'Sara', email: 'sara@scout.app', role: 'moderator', active: true },
  { id: 'ad3', name: 'Hamad', email: 'hamad@scout.app', role: 'finance', active: true },
  { id: 'ad4', name: 'Mariam', email: 'mariam@scout.app', role: 'content_manager', active: false },
]

export function AdminsPage() {
  const { t } = useTranslation()
  return (
    <CrudPage
      config={{
        title: t('nav.admins'),
        description: t('admins.description'),
        addLabel: t('admins.add'),
        rows: admins,
        auditKey: 'admin',
        rowName: (r) => String(r.email),
        searchText: (r) => `${r.name} ${r.email}`,
        blank: { name: '', email: '', role: 'moderator', active: true },
        fields: [
          { key: 'name', label: 'f.fullName', type: 'text' },
          { key: 'email', label: 'f.email', type: 'text' },
          {
            key: 'role',
            label: 'f.role',
            type: 'select',
            options: adminRoles.map((r) => ({ value: r, label: t(`roles.${r}`) })),
          },
          { key: 'active', label: 'f.active', type: 'checkbox' },
        ],
        columns: () => [
          { key: 'name', header: t('col.name'), cell: (r) => <span className="font-medium">{r.name}</span> },
          { key: 'email', header: t('col.email'), cell: (r) => r.email },
          { key: 'role', header: t('col.role'), cell: (r) => t(`roles.${r.role}`) },
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
