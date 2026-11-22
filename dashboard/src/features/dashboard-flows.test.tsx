import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import type { AdminSession } from '@/features/auth/session-context'
import { navItems } from '@/app/nav'
import { initialUsers } from '@/mock/data'
import { renderApp } from '@/test/render-app'

const superAdmin: AdminSession = { name: 'Super Admin', email: 'admin@scout.app', role: 'super_admin' }

describe('clickable dashboard', () => {
  it('opens every section with a real screen', async () => {
    for (const item of navItems.filter((n) => n.path !== '/')) {
      const { unmount } = renderApp({ path: item.path, session: superAdmin })
      expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument()
      expect(screen.queryByText('Coming soon', { selector: 'div,h3,p' })).not.toBeInTheDocument()
      unmount()
    }
  })

  it('approves a pending player from the queue', async () => {
    renderApp({ path: '/players', session: superAdmin })
    await userEvent.type(await screen.findByLabelText('Search'), 'Omar Al-Sabah')
    await userEvent.click(await screen.findByText('Omar Al-Sabah'))
    await userEvent.click(await screen.findByRole('button', { name: 'Approve' }))
    expect(await screen.findByText('Approved')).toBeInTheDocument()
  })

  it('requires a reason to reject a profile', async () => {
    renderApp({ path: '/players/p2', session: superAdmin })
    await userEvent.click(await screen.findByRole('button', { name: 'Reject' }))
    const dialog = await screen.findByRole('dialog')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Reject profile' }))
    expect(await within(dialog).findByText('Pick at least one reason.')).toBeInTheDocument()
    await userEvent.click(within(dialog).getByLabelText('Photo is unclear'))
    await userEvent.click(within(dialog).getByRole('button', { name: 'Reject profile' }))
    await waitFor(() => expect(screen.getByText('Rejected')).toBeInTheDocument())
  })

  it('shows a profile locked by another admin as read-only', async () => {
    renderApp({ path: '/players/p3', session: superAdmin })
    expect(await screen.findByRole('button', { name: 'Approve' })).toBeDisabled()
  })

  it('adds a plan only when English and Arabic names are both filled', async () => {
    renderApp({ path: '/plans', session: superAdmin })
    await userEvent.click(await screen.findByRole('button', { name: 'Add plan' }))
    const dialog = await screen.findByRole('dialog')
    await userEvent.type(within(dialog).getByLabelText('Name (EN)'), 'Test plan')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Save' }))
    expect((await within(dialog).findAllByText('Required')).length).toBeGreaterThan(0)
    await userEvent.type(within(dialog).getByLabelText('Name (AR)'), 'باقة')
    await userEvent.type(within(dialog).getByLabelText('Description (EN)'), 'Test description')
    await userEvent.type(within(dialog).getByLabelText('Description (AR)'), 'وصف')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Save' }))
    expect(await screen.findByText('Test plan')).toBeInTheDocument()
  })

  it('approves a pending reel', async () => {
    renderApp({ path: '/reels/rl1', session: superAdmin })
    await userEvent.click(await screen.findByRole('button', { name: 'Approve' }))
    expect(await screen.findByText('Published')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Approve' })).toBeDisabled()
  })

  it('requires a reason to reject a reel', async () => {
    renderApp({ path: '/reels/rl2', session: superAdmin })
    await userEvent.click(await screen.findByRole('button', { name: 'Reject' }))
    const dialog = await screen.findByRole('dialog')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Reject reel' }))
    expect(await within(dialog).findByText('Pick at least one reason.')).toBeInTheDocument()
    await userEvent.click(within(dialog).getByLabelText('Poor video quality'))
    await userEvent.click(within(dialog).getByRole('button', { name: 'Reject reel' }))
    await waitFor(() => expect(screen.getAllByText('Rejected').length).toBeGreaterThan(0))
  })

  it('lists the app prices on the plans screen', async () => {
    renderApp({ path: '/plans', session: superAdmin })
    expect(await screen.findByText('6-Month Subscription')).toBeInTheDocument()
    expect(screen.getByText('36 KWD')).toBeInTheDocument()
    expect(screen.getByText('60 KWD')).toBeInTheDocument()
  })

  it('moves a sport down to change its display order', async () => {
    renderApp({ path: '/sports', session: superAdmin })
    const rows = async () => (await screen.findAllByRole('row')).map((r) => r.textContent ?? '')
    expect((await rows())[1]).toContain('Football')
    await userEvent.click((await screen.findAllByRole('button', { name: 'Move down' }))[0]!)
    await waitFor(async () => expect((await rows())[1]).toContain('Basketball'))
  })

  it('lists nationalities and coaching specializations as their own managed lists', async () => {
    const first = renderApp({ path: '/nationalities', session: superAdmin })
    expect(await screen.findByText('Kuwaiti')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add nationality' })).toBeInTheDocument()
    first.unmount()
    renderApp({ path: '/specializations', session: superAdmin })
    expect(await screen.findByText('Youth development')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add specialization' })).toBeInTheDocument()
  })

  it('shows who deleted an account and that the phone was verified', async () => {
    const deleted = initialUsers.find((u) => u.status === 'deleted')!
    renderApp({ path: `/users/${deleted.id}`, session: superAdmin })
    expect(await screen.findByText(/The user deleted this account from the app/)).toBeInTheDocument()
    expect(screen.getByText(/^Verified /)).toBeInTheDocument()
  })

  it('sends a password reset code and records it in the audit log with readable names', async () => {
    const active = initialUsers.find((u) => u.status === 'active')!
    const { router } = renderApp({ path: `/users/${active.id}`, session: superAdmin })
    await userEvent.click(await screen.findByRole('button', { name: 'Send password reset code' }))
    await userEvent.type(await screen.findByLabelText('Note'), 'User forgot the password')
    await userEvent.click(await screen.findByRole('button', { name: 'Confirm' }))
    await router.navigate('/audit')
    expect(await screen.findByText('User · Password reset sent')).toBeInTheDocument()
    expect(screen.getAllByText(/Plan · Updated/).length).toBeGreaterThan(0)
  })

  it('shows the overview statistics from the SRS', async () => {
    renderApp({ path: '/', session: superAdmin })
    for (const label of [
      'Total users',
      'Players',
      'Trainers',
      'New profiles (7 days)',
      'Active profiles',
      'Expired profiles',
      'Featured profiles',
    ])
      expect((await screen.findAllByText(label)).length).toBeGreaterThan(0)
  })

  it('records admin actions in the audit log', async () => {
    renderApp({ path: '/players/p2', session: superAdmin })
    await userEvent.click(await screen.findByRole('button', { name: 'Approve' }))
    await userEvent.click(screen.getByRole('link', { name: 'Back' }))
    expect(await screen.findByRole('heading', { name: 'Players' })).toBeInTheDocument()
  })

  it('pages large lists 10 rows at a time', async () => {
    renderApp({ path: '/transactions', session: superAdmin })
    expect(await screen.findByText(/^Showing 1–10 of \d{3}$/)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }))
    expect(await screen.findByText(/^Showing 11–20 of/)).toBeInTheDocument()
  })

  it('sorts a column when its header is clicked', async () => {
    renderApp({ path: '/transactions', session: superAdmin })
    await userEvent.click(await screen.findByRole('button', { name: /Amount/ }))
    expect(screen.getByRole('columnheader', { name: /Amount/ })).toHaveAttribute('aria-sort', 'ascending')
  })

  it('hides sections a role may not use', async () => {
    const { router } = renderApp({
      path: '/settings',
      session: { name: 'Sara', email: 's@scout.app', role: 'moderator' },
    })
    await waitFor(() => expect(router.state.location.pathname).toBe('/'))
  })
})
