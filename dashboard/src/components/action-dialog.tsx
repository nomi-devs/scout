import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
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

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  confirmLabel: string
  destructive?: boolean
  /** Admin actions need a note or reason (flows C and the audit log). */
  noteLabel?: string
  children?: ReactNode
  onConfirm: (note: string) => void
}

export function ActionDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  destructive,
  noteLabel,
  children,
  onConfirm,
}: Props) {
  const { t } = useTranslation()
  const [note, setNote] = useState('')
  const [error, setError] = useState(false)

  function submit() {
    if (noteLabel && !note.trim()) {
      setError(true)
      return
    }
    onConfirm(note.trim())
    setNote('')
    setError(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        {noteLabel && (
          <div className="space-y-1">
            <Label htmlFor="action-note">{noteLabel}</Label>
            <Textarea
              id="action-note"
              value={note}
              aria-invalid={error || undefined}
              onChange={(e) => setNote(e.target.value)}
            />
            {error && <p className="text-destructive text-xs">{t('common.required')}</p>}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button variant={destructive ? 'destructive' : 'default'} onClick={submit}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
