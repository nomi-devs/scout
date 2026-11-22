import { useCallback, useMemo, useState, type ReactNode } from 'react'

import { SessionContext, type AdminSession } from './session-context'

const STORAGE_KEY = 'scout.dashboard.session'

function readStoredSession(): AdminSession | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AdminSession) : null
  } catch {
    return null
  }
}

function writeStoredSession(session: AdminSession | null): void {
  try {
    if (session) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    else sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage can be unavailable (private mode); the session then lives in memory only.
  }
}

/**
 * Mock admin session for the clickable build.
 * Replaced by real API auth (httpOnly refresh cookie + in-memory access token) during integration.
 */
export function SessionProvider({
  children,
  initialSession,
}: {
  children: ReactNode
  initialSession?: AdminSession | null
}) {
  const [session, setSession] = useState<AdminSession | null>(() =>
    initialSession !== undefined ? initialSession : readStoredSession(),
  )

  const signIn = useCallback((next: AdminSession) => {
    writeStoredSession(next)
    setSession(next)
  }, [])

  const signOut = useCallback(() => {
    writeStoredSession(null)
    setSession(null)
  }, [])

  const value = useMemo(() => ({ session, signIn, signOut }), [session, signIn, signOut])
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}
