import { ArrowDown, ArrowUp, ImageIcon, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { DataTable, type Column, type TableFilter } from '@/components/data-table'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useMockStore } from '@/mock/store'

export type Row = { id: string } & Record<string, string | number | boolean>

export interface Field {
  key: string
  /** Translation key for the label. */
  label: string
  type: 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'bilingual' | 'bilingualArea' | 'date' | 'image'
  options?: { value: string; label: string }[]
  required?: boolean
}

export interface CrudConfig {
  title: string
  description?: string
  addLabel: string
  rows: Row[]
  columns: (helpers: {
    lang: string
    edit: (row: Row) => void
    remove: (row: Row) => void
    setRow: (id: string, patch: Partial<Row>) => void
  }) => Column<Row>[]
  fields: Field[]
  /** Defaults for a new row. */
  blank: Omit<Row, 'id'>
  /** Audit-log action prefix, e.g. "plan". */
  auditKey: string
  /** Name shown in the audit log for a row. */
  rowName: (row: Row) => string
  searchText?: (row: Row) => string
  filters?: TableFilter<Row>[]
  canDelete?: boolean
  /** Numeric field that sets the display order in the app. Adds move up / down buttons. */
  orderKey?: string
  header?: ReactNode
  /** Extra toolbar buttons next to "Add". */
  extra?: ReactNode
}

/** Bilingual fields are stored as `<key>En` and `<key>Ar`. Both are required, as in the admin flows doc. */
export function CrudPage({ config }: { config: CrudConfig }) {
  const { t, i18n } = useTranslation()
  const { logAudit } = useMockStore()
  const [rows, setRows] = useState<Row[]>(config.rows)
  const [editing, setEditing] = useState<Row | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [deleting, setDeleting] = useState<Row | null>(null)

  const { orderKey } = config
  const ordered = orderKey ? [...rows].sort((a, b) => Number(a[orderKey]) - Number(b[orderKey])) : rows

  function move(row: Row, delta: -1 | 1) {
    if (!orderKey) return
    const i = ordered.findIndex((r) => r.id === row.id)
    const other = ordered[i + delta]
    if (!other) return
    setRows((all) =>
      all.map((r) =>
        r.id === row.id
          ? { ...r, [orderKey]: other[orderKey] as number }
          : r.id === other.id
            ? { ...r, [orderKey]: row[orderKey] as number }
            : r,
      ),
    )
    logAudit({
      admin: '',
      action: `${config.auditKey}.reorder`,
      target: config.rowName(row),
      before: String(row[orderKey]),
      after: String(other[orderKey]),
    })
  }

  function startAdd() {
    const next = orderKey ? Math.max(0, ...rows.map((r) => Number(r[orderKey]) || 0)) + 1 : undefined
    setEditing({ id: `n${Date.now()}`, ...config.blank, ...(orderKey ? { [orderKey]: next } : {}) } as Row)
    setIsNew(true)
    setErrors({})
  }
  function startEdit(row: Row) {
    setEditing({ ...row })
    setIsNew(false)
    setErrors({})
  }
  function setRow(id: string, patch: Partial<Row>) {
    setRows((all) => all.map((r) => (r.id === id ? ({ ...r, ...patch } as Row) : r)))
  }

  function save() {
    if (!editing) return
    const missing: Record<string, boolean> = {}
    for (const f of config.fields) {
      if (f.type === 'bilingual' || f.type === 'bilingualArea') {
        if (!String(editing[`${f.key}En`] ?? '').trim()) missing[`${f.key}En`] = true
        if (!String(editing[`${f.key}Ar`] ?? '').trim()) missing[`${f.key}Ar`] = true
      } else if (
        f.required !== false &&
        f.type !== 'checkbox' &&
        f.type !== 'number' &&
        !String(editing[f.key] ?? '').trim()
      ) {
        missing[f.key] = true
      } else if (f.type === 'number' && f.required !== false && Number(editing[f.key]) < 0) {
        missing[f.key] = true
      }
    }
    setErrors(missing)
    if (Object.keys(missing).length) return
    const before = rows.find((r) => r.id === editing.id)
    setRows((all) => (isNew ? [editing, ...all] : all.map((r) => (r.id === editing.id ? editing : r))))
    logAudit({
      admin: '',
      action: `${config.auditKey}.${isNew ? 'create' : 'update'}`,
      target: config.rowName(editing),
      before: before ? config.rowName(before) : '—',
      after: config.rowName(editing),
    })
    toast.success(t('common.saved'))
    setEditing(null)
  }

  function confirmDelete() {
    if (!deleting) return
    setRows((all) => all.filter((r) => r.id !== deleting.id))
    logAudit({
      admin: '',
      action: `${config.auditKey}.delete`,
      target: config.rowName(deleting),
      before: config.rowName(deleting),
      after: '—',
    })
    toast.success(t('common.deleted'))
    setDeleting(null)
  }

  const columns = config.columns({ lang: i18n.language, edit: startEdit, remove: setDeleting, setRow })
  columns.push({
    key: 'actions',
    header: '',
    className: 'w-24 text-end',
    cell: (row) => (
      <div className="flex justify-end gap-1">
        {orderKey && (
          <>
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label={t('common.moveUp')}
              disabled={ordered[0]?.id === row.id}
              onClick={() => move(row, -1)}
            >
              <ArrowUp />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label={t('common.moveDown')}
              disabled={ordered.at(-1)?.id === row.id}
              onClick={() => move(row, 1)}
            >
              <ArrowDown />
            </Button>
          </>
        )}
        <Button size="icon-sm" variant="ghost" aria-label={t('common.edit')} onClick={() => startEdit(row)}>
          <Pencil />
        </Button>
        {config.canDelete !== false && (
          <Button size="icon-sm" variant="ghost" aria-label={t('common.delete')} onClick={() => setDeleting(row)}>
            <Trash2 />
          </Button>
        )}
      </div>
    ),
  })

  return (
    <section>
      <PageHeader
        title={config.title}
        description={config.description}
        actions={
          <>
            {config.extra}
            <Button onClick={startAdd}>
              <Plus data-icon="inline-start" />
              {config.addLabel}
            </Button>
          </>
        }
      />
      {config.header}
      <DataTable
        columns={columns}
        rows={ordered}
        getKey={(r) => r.id}
        searchText={config.searchText}
        filters={config.filters}
      />

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isNew ? config.addLabel : t('common.edit')}</DialogTitle>
            <DialogDescription>{t('common.bilingualHint')}</DialogDescription>
          </DialogHeader>
          {editing && (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                save()
              }}
            >
              {config.fields.map((f) => (
                <FieldInput
                  key={f.key}
                  field={f}
                  row={editing}
                  errors={errors}
                  onChange={(patch) => setEditing({ ...editing, ...patch } as Row)}
                />
              ))}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit">{t('common.save')}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('common.deleteTitle')}</DialogTitle>
            <DialogDescription>{deleting ? config.rowName(deleting) : ''}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}

function FieldInput({
  field,
  row,
  errors,
  onChange,
}: {
  field: Field
  row: Row
  errors: Record<string, boolean>
  onChange: (patch: Partial<Row>) => void
}) {
  const { t } = useTranslation()
  const label = t(field.label)
  const err = (k: string) => (errors[k] ? <p className="text-destructive text-xs">{t('common.required')}</p> : null)

  if (field.type === 'bilingual' || field.type === 'bilingualArea') {
    const Control = field.type === 'bilingual' ? Input : Textarea
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        {(['En', 'Ar'] as const).map((suffix) => {
          const k = `${field.key}${suffix}`
          return (
            <div key={k} className="space-y-1">
              <Control
                aria-label={`${label} (${suffix === 'En' ? 'EN' : 'AR'})`}
                placeholder={suffix === 'En' ? 'English' : 'العربية'}
                dir={suffix === 'Ar' ? 'rtl' : 'ltr'}
                value={String(row[k] ?? '')}
                aria-invalid={errors[k] || undefined}
                onChange={(e) => onChange({ [k]: e.target.value })}
              />
              {err(k)}
            </div>
          )
        })}
      </div>
    )
  }
  if (field.type === 'image') {
    const url = String(row[field.key] ?? '')
    return (
      <div className="space-y-1">
        <Label htmlFor={field.key}>{label}</Label>
        <div className="flex items-center gap-3">
          <ImagePreview url={url} className="size-14" />
          <Input
            id={field.key}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) return
              const preview = typeof URL.createObjectURL === 'function' ? URL.createObjectURL(file) : file.name
              onChange({ [field.key]: preview })
            }}
          />
        </div>
        {err(field.key)}
      </div>
    )
  }
  if (field.type === 'checkbox') {
    return (
      <div className="flex items-center gap-2">
        <Checkbox
          id={field.key}
          checked={!!row[field.key]}
          onCheckedChange={(v) => onChange({ [field.key]: v === true })}
        />
        <Label htmlFor={field.key}>{label}</Label>
      </div>
    )
  }
  if (field.type === 'select') {
    return (
      <div className="space-y-1">
        <Label>{label}</Label>
        <Select value={String(row[field.key] ?? '')} onValueChange={(v) => onChange({ [field.key]: v })}>
          <SelectTrigger className="w-full" aria-label={label}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {err(field.key)}
      </div>
    )
  }
  const Control = field.type === 'textarea' ? Textarea : Input
  return (
    <div className="space-y-1">
      <Label htmlFor={field.key}>{label}</Label>
      <Control
        id={field.key}
        type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
        value={String(row[field.key] ?? '')}
        aria-invalid={errors[field.key] || undefined}
        onChange={(e) => onChange({ [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value })}
      />
      {err(field.key)}
    </div>
  )
}

/** Small preview of an uploaded image. Seed data only has file names, so those show a placeholder. */
export function ImagePreview({ url, className = 'size-10' }: { url: string; className?: string }) {
  const real = url.startsWith('blob:') || url.startsWith('http') || url.startsWith('data:')
  return real ? (
    <img src={url} alt="" className={`${className} rounded-md object-cover`} />
  ) : (
    <span className={`${className} bg-muted text-muted-foreground flex items-center justify-center rounded-md`}>
      <ImageIcon className="size-1/2" />
    </span>
  )
}
