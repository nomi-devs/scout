import { createContext, useContext } from 'react'

import type { AdminRole } from '@/app/nav'

export interface AdminSession {
  name: string
  email: string
  role: AdminRole
}

export interface SessionContextValue {
  session: AdminSession | null
  signIn: (session: AdminSession) => void
  signOut: () => void
}

export const SessionContext = createContext<SessionContextValue | null>(null)

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>')
  return ctx
}
