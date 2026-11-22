import type { ReactNode } from 'react'
import { Navigate } from 'react-router'

import { useSession } from '@/features/auth/session-context'

import { canAccess, navItems } from './nav'

/** Sends a role away from a section its menu does not show (A1 role table). */
export function RequireRole({ path, children }: { path: string; children: ReactNode }) {
  const { session } = useSession()
  const item = navItems.find((n) => n.path === path)
  if (session && item && !canAccess(item, session.role)) return <Navigate to="/" replace />
  return <>{children}</>
}
