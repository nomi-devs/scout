import { describe, expect, it } from 'vitest'

import { navForRole, navItems } from './nav'

const keysFor = (role: Parameters<typeof navForRole>[0]) =>
  navForRole(role).flatMap(({ items }) => items.map((i) => i.key))

describe('navForRole', () => {
  it('gives super admins every section', () => {
    expect(keysFor('super_admin')).toHaveLength(navItems.length)
  })

  it('limits moderators to moderation sections', () => {
    expect(keysFor('moderator')).toEqual(['overview', 'players', 'trainers', 'reels', 'reports', 'users'])
  })

  it('limits finance to finance sections plus users (view only)', () => {
    const keys = keysFor('finance')
    expect(keys).toContain('transactions')
    expect(keys).toContain('users')
    expect(keys).not.toContain('players')
    expect(keys).not.toContain('settings')
  })

  it('limits content managers to content sections and broadcasts', () => {
    const keys = keysFor('content_manager')
    expect(keys).toContain('banners')
    expect(keys).toContain('notifications')
    expect(keys).not.toContain('plans')
    expect(keys).not.toContain('audit')
  })

  it('drops groups with no visible items', () => {
    expect(navForRole('content_manager').map((g) => g.group)).toEqual(['general', 'content'])
  })
})
