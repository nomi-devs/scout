import { ArrowLeft, Check, EyeOff, Play, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import { DataTable, type Column } from '@/components/data-table'
import { PageHeader } from '@/components/page-header'
import { StatusBadge, type Tone } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { formatDate, hoursSince } from '@/lib/format'
import { REEL_MAX_PER_MONTH, REEL_MAX_SECONDS, type ReelRec, type ReelStatus } from '@/mock/data'
import { useMockStore } from '@/mock/store'

const sports = ['football', 'basketball', 'volleyball', 'tennis', 'cricket']
const reasonKeys = ['inappropriate', 'quality', 'misleading', 'notSports'] as const

const tones: Record<ReelStatus, Tone> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  hidden: 'neutral',
}

type Filter = ReelStatus | 'all'

const duration = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`
const views = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}K` : String(n))

function ReelStatusBadge({ status }: { status: ReelStatus }) {
  const { t } = useTranslation()
  return <StatusBadge tone={tones[status]}>{t(`reels.status.${status}`)}</StatusBadge>
}

/** Reels uploaded from the app's "Create Reel" screen. Each one is reviewed before it is published. */
export function ReelsPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { reels } = useMockStore()
  const [filter, setFilter] = useState<Filter>('pending')

  const rows = reels
    .filter((r) => filter === 'all' || r.status === filter)
    .sort((a, b) => a.submittedAt - b.submittedAt)

  const columns: Column<ReelRec>[] = [
    {
      key: 'title',
      header: t('col.title'),
      sort: (r) => r.title,
      cell: (r) => <span className="font-medium">{r.title}</span>,
    },
    { key: 'owner', header: t('col.name'), sort: (r) => r.ownerName, cell: (r) => r.ownerName },
    { key: 'sport', header: t('col.sport'), sort: (r) => r.sport, cell: (r) => t(`sportNames.${r.sport}`) },
    { key: 'length', header: t('col.duration'), cell: (r) => duration(r.durationSec) },
    {
      key: 'submitted',
      header: t('col.submitted'),
      sort: (r) => r.submittedAt,
      cell: (r) => {
        const late = r.status === 'pending' && hoursSince(r.submittedAt) > 24
        return (
          <span className={late ? 'text-destructive font-medium' : undefined}>
            {formatDate(r.submittedAt, i18n.language)}
            {late && ` · ${t('profiles.overdue')}`}
          </span>
        )
      },
    },
    { key: 'views', header: t('col.views'), sort: (r) => r.views, cell: (r) => views(r.views) },
    { key: 'status', header: t('col.status'), cell: (r) => <ReelStatusBadge status={r.status} /> },
  ]

  return (
    <section>
      <PageHeader title={t('nav.reels')} description={`${t('reels.description')} ${t('reels.noExpiry')}`} />
      <DataTable
        columns={columns}
        rows={rows}
        getKey={(r) => r.id}
        searchText={(r) => `${r.title} ${r.ownerName} ${r.location}`}
        onRowClick={(r) => navigate(`/reels/${r.id}`)}
        filters={[
          {
            key: 'sport',
            label: t('filters.allSports'),
            options: sports.map((s) => ({ value: s, label: t(`sportNames.${s}`) })),
            value: (r) => r.sport,
          },
          {
            key: 'type',
            label: t('filters.allTypes'),
            options: (['player', 'trainer'] as const).map((r) => ({ value: r, label: t(`userRole.${r}`) })),
            value: (r) => r.role,
          },
        ]}
        toolbar={
          <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
            <TabsList variant="line">
              {(['pending', 'approved', 'rejected', 'hidden', 'all'] as const).map((f) => (
                <TabsTrigger key={f} value={f}>
                  {t(`reels.filter.${f}`)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        }
      />
    </section>
  )
}

/** Review screen for one reel: the video, what the user typed in the upload form, and approve / reject / hide. */
export function ReelDetailPage() {
  const { t, i18n } = useTranslation()
  const { id } = useParams()
  const { reels, updateReel, logAudit } = useMockStore()
  const reel = reels.find((r) => r.id === id)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [reasons, setReasons] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [error, setError] = useState(false)

  if (!reel) return <p>{t('notFound.title')}</p>
  const r: ReelRec = reel

  function setStatus(status: ReelStatus, action: string, extra: Partial<ReelRec> = {}) {
    logAudit({ admin: '', action, target: r.title, before: r.status, after: status })
    updateReel(r.id, { status, ...extra })
  }

  function reject() {
    if (reasons.length === 0) {
      setError(true)
      return
    }
    const reason = [...reasons.map((k) => t(`reels.reasons.${k}`)), note.trim()].filter(Boolean).join(' · ')
    setStatus('rejected', 'reel.reject', { rejectionReason: reason })
    toast.success(t('reels.rejectedToast'))
    setRejectOpen(false)
    setReasons([])
    setNote('')
    setError(false)
  }

  const pending = r.status === 'pending'
  const now = new Date()
  const sameMonth = (ms: number) => {
    const d = new Date(ms)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  }
  const uploadedThisMonth = reels.filter((x) => x.profileId === r.profileId && sameMonth(x.submittedAt)).length

  return (
    <section>
      <Button asChild variant="ghost" size="sm" className="mb-2">
        <Link to="/reels">
          <ArrowLeft className="rtl:rotate-180" data-icon="inline-start" />
          {t('common.back')}
        </Link>
      </Button>
      <PageHeader
        title={r.title}
        description={`${r.ownerName} · ${t(`userRole.${r.role}`)}`}
        actions={
          <>
            <ReelStatusBadge status={r.status} />
            {r.status === 'approved' && (
              <Button
                variant="outline"
                onClick={() => {
                  setStatus('hidden', 'reel.hide')
                  toast.success(t('reels.hiddenToast'))
                }}
              >
                <EyeOff data-icon="inline-start" />
                {t('reels.hide')}
              </Button>
            )}
            {r.status === 'hidden' && (
              <Button
                variant="outline"
                onClick={() => {
                  setStatus('approved', 'reel.unhide')
                  toast.success(t('reels.unhiddenToast'))
                }}
              >
                {t('reels.unhide')}
              </Button>
            )}
          </>
        }
      />

      {r.status === 'rejected' && r.rejectionReason && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{t('reels.rejectionReason')}</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusBadge tone="danger">{r.rejectionReason}</StatusBadge>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardContent>
            <div
              className="bg-muted text-muted-foreground relative flex aspect-[9/16] max-h-[28rem] w-full items-center justify-center rounded-xl"
              role="img"
              aria-label={t('reels.video')}
            >
              <span className="bg-background/80 flex size-14 items-center justify-center rounded-full shadow">
                <Play className="size-6" />
              </span>
              <span className="absolute bottom-2 end-2 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white">
                {duration(r.durationSec)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{t('reels.details')}</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground text-xs">{t('col.title')}</dt>
                <dd className="font-medium">{r.title}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">{t('col.location')}</dt>
                <dd className="font-medium">{r.location}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">{t('reels.descriptionLabel')}</dt>
                <dd className="font-medium">{r.description}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">{t('col.sport')}</dt>
                <dd className="font-medium">{t(`sportNames.${r.sport}`)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">{t('col.submitted')}</dt>
                <dd className="font-medium">{formatDate(r.submittedAt, i18n.language)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">{t('col.views')}</dt>
                <dd className="font-medium">{views(r.views)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">{t('col.duration')}</dt>
                <dd className={`font-medium ${r.durationSec > REEL_MAX_SECONDS ? 'text-destructive' : ''}`}>
                  {duration(r.durationSec)} / {duration(REEL_MAX_SECONDS)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">{t('reels.thisMonth')}</dt>
                <dd className="font-medium">
                  {uploadedThisMonth} / {REEL_MAX_PER_MONTH}
                </dd>
              </div>
            </dl>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link to={`/${r.role}s/${r.profileId}`}>{t('users.viewProfile')}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('review.decision')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button
              disabled={!pending}
              onClick={() => {
                setStatus('approved', 'reel.approve', { rejectionReason: undefined })
                toast.success(t('reels.approvedToast'))
              }}
            >
              <Check data-icon="inline-start" />
              {t('review.approve')}
            </Button>
            <Button variant="destructive" disabled={!pending} onClick={() => setRejectOpen(true)}>
              <X data-icon="inline-start" />
              {t('review.reject')}
            </Button>
            {!pending && <p className="text-muted-foreground text-xs">{t('reels.noDecision')}</p>}
          </CardContent>
        </Card>
      </div>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('reels.rejectTitle', { title: r.title })}</DialogTitle>
            <DialogDescription>{t('reels.rejectHint')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {reasonKeys.map((k) => (
              <label key={k} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="accent-primary size-4"
                  checked={reasons.includes(k)}
                  onChange={(e) => setReasons((all) => (e.target.checked ? [...all, k] : all.filter((x) => x !== k)))}
                />
                {t(`reels.reasons.${k}`)}
              </label>
            ))}
            {error && <p className="text-destructive text-xs">{t('review.reasonRequired')}</p>}
            <Label htmlFor="reel-note">{t('review.note')}</Label>
            <Textarea id="reel-note" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={reject}>
              {t('reels.confirmReject')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
