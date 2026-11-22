import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

import { useSession } from '@/features/auth/session-context'

import {
  initialProfiles,
  initialReels,
  initialReports,
  initialUsers,
  type ProfileRec,
  type ReelRec,
  type ReportRec,
  type UserRec,
} from './data'

export interface AuditEntry {
  id: string
  at: number
  admin: string
  action: string
  target: string
  before: string
  after: string
}

interface MockStore {
  profiles: ProfileRec[]
  users: UserRec[]
  reports: ReportRec[]
  reels: ReelRec[]
  audit: AuditEntry[]
  updateProfile: (id: string, patch: Partial<ProfileRec>) => void
  updateUser: (id: string, patch: Partial<UserRec>) => void
  updateReport: (id: string, patch: Partial<ReportRec>) => void
  updateReel: (id: string, patch: Partial<ReelRec>) => void
  logAudit: (entry: Omit<AuditEntry, 'id' | 'at'>) => void
}

const seedAudit: AuditEntry[] = [
  {
    id: 'a1',
    at: Date.now() - 2 * 3_600_000,
    admin: 'Hamad (Finance)',
    action: 'plan.update',
    target: '1-Year Subscription',
    before: 'price 55 KWD',
    after: 'price 60 KWD',
  },
  {
    id: 'a2',
    at: Date.now() - 26 * 3_600_000,
    admin: 'Sara (Moderator)',
    action: 'profile.approve',
    target: 'Khalid Al-Rashid',
    before: 'pending',
    after: 'approved',
  },
  {
    id: 'a3',
    at: Date.now() - 50 * 3_600_000,
    admin: 'Mariam (Content)',
    action: 'banner.create',
    target: 'Pitch Lab campaign',
    before: '—',
    after: 'active',
  },
]

const StoreContext = createContext<MockStore | null>(null)

/** In-memory state shared by the moderation screens so actions show up everywhere (and in the audit log). */
export function MockStoreProvider({ children }: { children: ReactNode }) {
  const { session } = useSession()
  const adminName = session?.name ?? 'Admin'
  const [profiles, setProfiles] = useState(initialProfiles)
  const [users, setUsers] = useState(initialUsers)
  const [reports, setReports] = useState(initialReports)
  const [reels, setReels] = useState(initialReels)
  const [audit, setAudit] = useState(seedAudit)

  const updateProfile = useCallback(
    (id: string, patch: Partial<ProfileRec>) =>
      setProfiles((all) => all.map((p) => (p.id === id ? { ...p, ...patch } : p))),
    [],
  )
  const updateUser = useCallback(
    (id: string, patch: Partial<UserRec>) => setUsers((all) => all.map((u) => (u.id === id ? { ...u, ...patch } : u))),
    [],
  )
  const updateReport = useCallback(
    (id: string, patch: Partial<ReportRec>) =>
      setReports((all) => all.map((r) => (r.id === id ? { ...r, ...patch } : r))),
    [],
  )
  const updateReel = useCallback(
    (id: string, patch: Partial<ReelRec>) => setReels((all) => all.map((r) => (r.id === id ? { ...r, ...patch } : r))),
    [],
  )
  const logAudit = useCallback(
    (entry: Omit<AuditEntry, 'id' | 'at'>) =>
      setAudit((all) => [
        { ...entry, admin: entry.admin || adminName, id: `a${all.length + 1}`, at: Date.now() },
        ...all,
      ]),
    [adminName],
  )

  const value = useMemo(
    () => ({ profiles, users, reports, reels, audit, updateProfile, updateUser, updateReport, updateReel, logAudit }),
    [profiles, users, reports, reels, audit, updateProfile, updateUser, updateReport, updateReel, logAudit],
  )
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useMockStore(): MockStore {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useMockStore must be used inside <MockStoreProvider>')
  return ctx
}
