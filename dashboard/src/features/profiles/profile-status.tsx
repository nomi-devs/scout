import { useTranslation } from 'react-i18next'

import { StatusBadge, type Tone } from '@/components/status-badge'
import type { ProfileStatus } from '@/mock/data'

const tones: Record<ProfileStatus, Tone> = {
  pending: 'warning',
  resubmitted: 'info',
  approved: 'success',
  rejected: 'danger',
  rejectedFinal: 'danger',
  hidden: 'neutral',
}

export function ProfileStatusBadge({ status }: { status: ProfileStatus }) {
  const { t } = useTranslation()
  return <StatusBadge tone={tones[status]}>{t(`profileStatus.${status}`)}</StatusBadge>
}

export const isPending = (s: ProfileStatus) => s === 'pending' || s === 'resubmitted'
