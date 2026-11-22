import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  X,
} from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

export interface Column<T> {
  key: string
  header: string
  cell: (row: T) => ReactNode
  className?: string
  /** Value to sort by. Columns without it are not sortable. */
  sort?: (row: T) => string | number
}

export interface TableFilter<T> {
  key: string
  /** Shown as the "all" option, e.g. "All statuses". */
  label: string
  options: { value: string; label: string }[]
  value: (row: T) => string
}

interface Props<T> {
  columns: Column<T>[]
  rows: T[]
  getKey: (row: T) => string
  /** Text the search box matches against. Omit to hide the search box. */
  searchText?: (row: T) => string
  /** Dropdown filters shown next to the search box. */
  filters?: TableFilter<T>[]
  onRowClick?: (row: T) => void
  rowClassName?: (row: T) => string | undefined
  /** Extra controls shown next to the search box. */
  toolbar?: ReactNode
  pageSize?: number
}

const PAGE_SIZES = [10, 25, 50, 100]
const ALL = '__all__'

/** Page numbers to show: always first and last, a window around the current page, gaps as null. */
function pageList(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set([1, total, current - 1, current, current + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const out: (number | null)[] = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - (sorted[i - 1] ?? p) > 1) out.push(null)
    out.push(p)
  })
  return out
}

/**
 * Table with search, dropdown filters, column sorting and pagination.
 * Works on the rows it is given; with the API the same props map to query params (page, size, sort, filters).
 */
export function DataTable<T>({
  columns,
  rows,
  getKey,
  searchText,
  filters = [],
  onRowClick,
  rowClassName,
  toolbar,
  pageSize: initialPageSize = 10,
}: Props<T>) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' } | null>(null)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [page, setPage] = useState(1)

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    let out = rows.filter(
      (r) =>
        (!q || !searchText || searchText(r).toLowerCase().includes(q)) &&
        filters.every((f) => {
          const v = filterValues[f.key]
          return !v || v === ALL || f.value(r) === v
        }),
    )
    const col = sort && columns.find((c) => c.key === sort.key)
    if (sort && col?.sort) {
      const get = col.sort
      const dir = sort.dir === 'asc' ? 1 : -1
      out = [...out].sort((a, b) => {
        const x = get(a)
        const y = get(b)
        return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y))) * dir
      })
    }
    return out
  }, [rows, query, searchText, filters, filterValues, sort, columns])

  const pageCount = Math.max(1, Math.ceil(visible.length / pageSize))
  const current = Math.min(page, pageCount)
  const start = (current - 1) * pageSize
  const pageRows = visible.slice(start, start + pageSize)
  const activeFilters = Object.values(filterValues).filter((v) => v && v !== ALL).length + (query ? 1 : 0)

  function toggleSort(key: string) {
    setSort((s) => (s?.key !== key ? { key, dir: 'asc' } : s.dir === 'asc' ? { key, dir: 'desc' } : null))
    setPage(1)
  }

  return (
    <div className="space-y-3">
      {(searchText || filters.length > 0 || toolbar) && (
        <div className="flex flex-wrap items-center gap-2">
          {searchText && (
            <div className="relative w-full sm:max-w-xs">
              <Search className="text-muted-foreground pointer-events-none absolute start-2.5 top-2.5 size-4" />
              <Input
                aria-label={t('common.search')}
                placeholder={t('common.search')}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setPage(1)
                }}
                className="bg-card ps-8"
              />
            </div>
          )}
          {filters.map((f) => (
            <Select
              key={f.key}
              value={filterValues[f.key] ?? ALL}
              onValueChange={(v) => {
                setFilterValues((all) => ({ ...all, [f.key]: v }))
                setPage(1)
              }}
            >
              <SelectTrigger className="bg-card w-auto min-w-36" aria-label={f.label}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>{f.label}</SelectItem>
                {f.options.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
          {activeFilters > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery('')
                setFilterValues({})
                setPage(1)
              }}
            >
              <X data-icon="inline-start" />
              {t('table.clear')}
            </Button>
          )}
          {toolbar}
        </div>
      )}

      <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-secondary/60">
              <TableRow className="hover:bg-transparent">
                {columns.map((c) => {
                  const dir = sort?.key === c.key ? sort.dir : null
                  return (
                    <TableHead
                      key={c.key}
                      className={cn('text-xs font-semibold tracking-wide uppercase', c.className)}
                      aria-sort={dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : undefined}
                    >
                      {c.sort ? (
                        <button
                          type="button"
                          onClick={() => toggleSort(c.key)}
                          className={cn(
                            'hover:text-primary inline-flex items-center gap-1 uppercase',
                            dir && 'text-primary',
                          )}
                        >
                          {c.header}
                          {dir === 'asc' ? (
                            <ArrowUp className="size-3.5" />
                          ) : dir === 'desc' ? (
                            <ArrowDown className="size-3.5" />
                          ) : (
                            <ArrowUpDown className="size-3.5 opacity-40" />
                          )}
                        </button>
                      ) : (
                        c.header
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-muted-foreground h-24 text-center">
                    {t('common.empty')}
                  </TableCell>
                </TableRow>
              )}
              {pageRows.map((row) => (
                <TableRow
                  key={getKey(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(onRowClick && 'hover:bg-secondary/50 cursor-pointer', rowClassName?.(row))}
                >
                  {columns.map((c) => (
                    <TableCell key={c.key} className={c.className}>
                      {c.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm">
          <p className="text-muted-foreground">
            {t('table.showing', {
              from: visible.length ? start + 1 : 0,
              to: start + pageRows.length,
              total: visible.length,
            })}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{t('table.rowsPerPage')}</span>
              <Select
                value={String(pageSize)}
                onValueChange={(v) => {
                  setPageSize(Number(v))
                  setPage(1)
                }}
              >
                <SelectTrigger size="sm" className="w-20" aria-label={t('table.rowsPerPage')}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZES.map((s) => (
                    <SelectItem key={s} value={String(s)}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <nav className="flex items-center gap-1" aria-label={t('table.pagination')}>
              <Button
                size="icon-sm"
                variant="outline"
                disabled={current === 1}
                onClick={() => setPage(1)}
                aria-label={t('table.first')}
              >
                <ChevronsLeft className="rtl:rotate-180" />
              </Button>
              <Button
                size="icon-sm"
                variant="outline"
                disabled={current === 1}
                onClick={() => setPage(current - 1)}
                aria-label={t('table.prev')}
              >
                <ChevronLeft className="rtl:rotate-180" />
              </Button>
              {pageList(current, pageCount).map((p, i) =>
                p === null ? (
                  <span key={`gap-${i}`} className="text-muted-foreground px-1">
                    …
                  </span>
                ) : (
                  <Button
                    key={p}
                    size="icon-sm"
                    variant={p === current ? 'default' : 'ghost'}
                    className={p === current ? 'bg-brand-gradient' : undefined}
                    aria-current={p === current ? 'page' : undefined}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                ),
              )}
              <Button
                size="icon-sm"
                variant="outline"
                disabled={current === pageCount}
                onClick={() => setPage(current + 1)}
                aria-label={t('table.next')}
              >
                <ChevronRight className="rtl:rotate-180" />
              </Button>
              <Button
                size="icon-sm"
                variant="outline"
                disabled={current === pageCount}
                onClick={() => setPage(pageCount)}
                aria-label={t('table.last')}
              >
                <ChevronsRight className="rtl:rotate-180" />
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
