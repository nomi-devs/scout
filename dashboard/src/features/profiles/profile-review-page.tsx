import { ArrowLeft, Check, EyeOff, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router'
import { toast } from 'sonner'

import { PageHeader } from '@/components/page-header'
import { StatusBadge } from '@/components/status-badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useSession } from '@/features/auth/session-context'
import { formatDate } from '@/lib/format'
import { reviewReasons, type CertStatus, type ProfileRec } from '@/mock/data'
import { useMockStore } from '@/mock/store'

import { isPending, ProfileStatusBadge } from './profile-status'

const initials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')

function Info({ label, value, changed }: { label: string; value: React.ReactNode; changed?: boolean }) {
  const { t } = useTranslation()
  return (
    <div className={changed ? 'rounded-md bg-amber-50 p-1.5 dark:bg-amber-950/40' : 'p-1.5'}>
      <dt className="text-muted-foreground text-xs">
        {label}
        {changed && (
          <span className="ms-2 font-medium text-amber-700 dark:text-amber-300">{t('profiles.changed')}</span>
        )}
      </dt>
      <dd className="text-sm font-medium">{value}</dd>
    </div>
  )
}

/** Full review screen (A3): all fields, certificates, approve / reject with reasons. */
export function ProfileReviewPage() {
  const { t, i18n } = useTranslation()
  const { id } = useParams()
  const { session } = useSession()
  const { profiles, users, updateProfile, logAudit } = useMockStore()
  const profile = profiles.find((p) => p.id === id)
  const owner = users.find((u) => u.id === profile?.userId)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [reasons, setReasons] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [rejectError, setRejectError] = useState(false)

  if (!profile) return <p>{t('notFound.title')}</p>
  const p: ProfileRec = profile
  const lockedByOther = !!p.lockedBy && p.lockedBy !== session?.name
  const canReview = isPending(p.status) && !lockedByOther
  const back = `/${p.role}s`
  const changed = (f: string) => p.changedFields?.includes(f)

  function setStatus(status: ProfileRec['status'], action: string, extra: Partial<ProfileRec> = {}) {
    logAudit({ admin: '', action, target: p.name, before: p.status, after: status })
    updateProfile(p.id, { status, ...extra })
  }

  function approve() {
    setStatus('approved', 'profile.approve', { rejectionReasons: undefined })
    toast.success(t('review.approvedToast'))
  }

  function reject() {
    if (reasons.length === 0) {
      setRejectError(true)
      return
    }
    const final = p.status === 'resubmitted'
    setStatus(final ? 'rejectedFinal' : 'rejected', 'profile.reject', { rejectionReasons: reasons })
    toast.success(t('review.rejectedToast'))
    setRejectOpen(false)
    setReasons([])
    setNote('')
    setRejectError(false)
  }

  function markCert(index: number, status: CertStatus) {
    updateProfile(p.id, { certificates: p.certificates.map((c, i) => (i === index ? { ...c, status } : c)) })
  }

  return (
    <section>
      <Button asChild variant="ghost" size="sm" className="mb-2">
        <Link to={back}>
          <ArrowLeft className="rtl:rotate-180" data-icon="inline-start" />
          {t('common.back')}
        </Link>
      </Button>
      <PageHeader
        title={p.name}
        description={t(p.role === 'player' ? 'nav.players' : 'nav.trainers')}
        actions={
          <>
            <ProfileStatusBadge status={p.status} />
            {p.status === 'approved' && (
              <Button
                variant="outline"
                onClick={() => {
                  setStatus('hidden', 'profile.hide')
                  toast.success(t('review.hiddenToast'))
                }}
              >
                <EyeOff data-icon="inline-start" />
                {t('review.hide')}
              </Button>
            )}
            {p.status === 'hidden' && (
              <Button
                variant="outline"
                onClick={() => {
                  setStatus('approved', 'profile.unhide')
                  toast.success(t('review.unhiddenToast'))
                }}
              >
                {t('review.unhide')}
              </Button>
            )}
          </>
        }
      />

      {lockedByOther && (
        <Card className="mb-4 border-amber-300 bg-amber-50 dark:bg-amber-950/30">
          <CardContent>
            {t('profiles.beingReviewed', { name: p.lockedBy })} · {t('review.readOnly')}
          </CardContent>
        </Card>
      )}
      {p.status === 'resubmitted' && (
        <p className="text-muted-foreground mb-4 text-sm">{t('review.resubmittedHint')}</p>
      )}
      {p.rejectionReasons && (p.status === 'rejected' || p.status === 'rejectedFinal') && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{t('review.rejectionReasons')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {p.rejectionReasons.map((r) => (
              <StatusBadge key={r} tone="danger">
                {r}
              </StatusBadge>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center gap-3">
            <Avatar className="size-14">
              <AvatarFallback>{initials(p.name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{p.name}</CardTitle>
              <p className="text-muted-foreground text-sm">
                {t(`sportNames.${p.sport}`)} · {p.specialization}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-2 md:grid-cols-3">
              <Info label={t('review.dob')} value={p.dob ? `${formatDate(p.dob, i18n.language)} (${p.age})` : p.age} />
              <Info label={t('review.gender')} value={t(`review.genders.${p.gender}`)} />
              <Info label={t('review.nationality')} value={p.nationality} />
              <Info label={t('col.location')} value={p.location} />
              <Info label={t('review.years')} value={p.years} />
              <Info label={t('review.submitted')} value={formatDate(p.submittedAt, i18n.language)} />
              {p.role === 'player' && <Info label={t('review.weight')} value={`${p.weightKg} kg`} />}
              {p.role === 'player' && <Info label={t('review.height')} value={`${p.heightCm} cm`} />}
              <Info label={t('review.views')} value={p.views.toLocaleString(i18n.language)} />
              <Info label={t('review.contactConsent')} value={p.contactConsent ? t('common.yes') : t('common.no')} />
              <Info label={t('review.phone')} value={p.phone} />
              <Info label={t('review.email')} value={p.email} />
            </dl>
            <div className="mt-4 space-y-3">
              <Info label={t('review.bio')} value={p.bio} changed={changed('Bio')} />
              <Info
                label={t('review.photos')}
                changed={changed('Photo')}
                value={
                  <div className="mt-1 flex flex-wrap gap-2">
                    {Array.from({ length: p.galleryCount }, (_, i) => (
                      <div
                        key={i}
                        className="bg-muted text-muted-foreground flex size-20 items-center justify-center rounded-md text-xs"
                      >
                        {t('review.photo', { n: i + 1 })}
                      </div>
                    ))}
                  </div>
                }
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {p.role === 'trainer' && (
            <Card>
              <CardHeader>
                <CardTitle>{t('review.certificates')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {p.certificates.length === 0 && <p className="text-muted-foreground text-sm">{t('common.empty')}</p>}
                {p.certificates.map((c, i) => (
                  <div key={c.name} className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-medium">{c.name}</span>
                    <div className="flex items-center gap-1">
                      <StatusBadge
                        tone={c.status === 'reviewed' ? 'success' : c.status === 'rejected' ? 'danger' : 'warning'}
                      >
                        {t(`review.cert.${c.status}`)}
                      </StatusBadge>
                      {canReview && (
                        <>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            aria-label={`${t('review.cert.reviewed')} ${c.name}`}
                            onClick={() => markCert(i, 'reviewed')}
                          >
                            <Check />
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            aria-label={`${t('review.cert.rejected')} ${c.name}`}
                            onClick={() => markCert(i, 'rejected')}
                          >
                            <X />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle>{t('review.subscription')}</CardTitle>
            </CardHeader>
            <CardContent>
              {owner?.subscriptionEndsAt ? (
                <dl className="grid grid-cols-2 gap-2">
                  <Info
                    label={t('col.plan')}
                    value={owner.subscriptionPlan ? t(`subscriptions.plan.${owner.subscriptionPlan}`) : '—'}
                  />
                  <Info
                    label={t('col.status')}
                    value={owner.subscriptionEndsAt > Date.now() ? t('status.active') : t('subscriptions.expired')}
                  />
                  <Info
                    label={t('col.started')}
                    value={owner.subscriptionStartedAt ? formatDate(owner.subscriptionStartedAt, i18n.language) : '—'}
                  />
                  <Info label={t('col.expires')} value={formatDate(owner.subscriptionEndsAt, i18n.language)} />
                  <Info
                    label={t('col.featuredUntil')}
                    value={
                      p.featuredUntil && p.featuredUntil > Date.now() ? formatDate(p.featuredUntil, i18n.language) : '—'
                    }
                  />
                </dl>
              ) : (
                <p className="text-muted-foreground text-sm">{t('review.noSubscription')}</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('review.decision')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button disabled={!canReview} onClick={approve}>
                <Check data-icon="inline-start" />
                {t('review.approve')}
              </Button>
              <Button variant="destructive" disabled={!canReview} onClick={() => setRejectOpen(true)}>
                <X data-icon="inline-start" />
                {t('review.reject')}
              </Button>
              {!canReview && <p className="text-muted-foreground text-xs">{t('review.noDecision')}</p>}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('review.rejectTitle', { name: p.name })}</DialogTitle>
            <DialogDescription>
              {p.status === 'resubmitted' ? t('review.rejectFinalHint') : t('review.rejectHint')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {reviewReasons.map((r) => (
              <div key={r} className="flex items-center gap-2">
                <Checkbox
                  id={`reason-${r}`}
                  checked={reasons.includes(r)}
                  onCheckedChange={(v) => setReasons((all) => (v === true ? [...all, r] : all.filter((x) => x !== r)))}
                />
                <Label htmlFor={`reason-${r}`}>{r}</Label>
              </div>
            ))}
            {rejectError && <p className="text-destructive text-xs">{t('review.reasonRequired')}</p>}
            <Label htmlFor="reject-note">{t('review.note')}</Label>
            <Textarea id="reject-note" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={reject}>
              {t('review.confirmReject')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
