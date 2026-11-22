import { describe, expect, it } from 'vitest'
import type { z } from 'zod'

import { initialProfiles, initialReels, initialUsers, transactions } from '@/mock/data'

import { profileSchema, reelSchema, transactionSchema, userSchema } from './entities'

function problems(schema: z.ZodType, rows: { id: string }[]) {
  return rows.flatMap((row) => {
    const r = schema.safeParse(row)
    return r.success ? [] : [`${row.id}: ${r.error.issues.map((i) => `${i.path.join('.')} ${i.message}`).join('; ')}`]
  })
}

describe('mock data follows the entity schemas', () => {
  it('profiles', () => expect(problems(profileSchema, initialProfiles)).toEqual([]))
  it('reels', () => expect(problems(reelSchema, initialReels)).toEqual([]))
  it('transactions', () => expect(problems(transactionSchema, transactions)).toEqual([]))
  it('users', () => expect(problems(userSchema, initialUsers)).toEqual([]))
})
