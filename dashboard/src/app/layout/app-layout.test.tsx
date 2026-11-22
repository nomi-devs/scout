import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { renderApp } from '@/test/render-app'

describe('AppLayout', () => {
  it('shows only the sections the role allows', async () => {
    renderApp({ session: { name: 'Mona', email: 'm@scout.app', role: 'moderator' } })
    expect(await screen.findByRole('link', { name: 'Players' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Plans/ })).not.toBeInTheDocument()
  })

  it('navigates when a menu item is clicked', async () => {
    const { router } = renderApp({ session: { name: 'Sam', email: 's@scout.app', role: 'super_admin' } })
    await userEvent.click(await screen.findByRole('link', { name: 'Coupons' }))
    expect(router.state.location.pathname).toBe('/coupons')
    expect(screen.getByRole('heading', { name: 'Coupons' })).toBeInTheDocument()
  })

  it('switches to Arabic and right-to-left', async () => {
    renderApp({ session: { name: 'Sam', email: 's@scout.app', role: 'super_admin' } })
    await userEvent.click(await screen.findByRole('button', { name: 'Language' }))
    expect(document.documentElement.dir).toBe('rtl')
    expect(await screen.findByRole('heading', { name: 'نظرة عامة' })).toBeInTheDocument()
  })

  it('signs out back to login', async () => {
    const { router } = renderApp({ session: { name: 'Sam', email: 's@scout.app', role: 'super_admin' } })
    await userEvent.click(await screen.findByRole('button', { name: 'Account' }))
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Sign out' }))
    // The app asks first: "Are you sure you want to log out of your account?"
    expect(await screen.findByText('Are you sure you want to log out of your account?')).toBeInTheDocument()
    expect(router.state.location.pathname).not.toBe('/login')
    await userEvent.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Sign out' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/login'))
  })

  it('keeps the admin signed in when the log out question is cancelled', async () => {
    const { router } = renderApp({ session: { name: 'Sam', email: 's@scout.app', role: 'super_admin' } })
    await userEvent.click(await screen.findByRole('button', { name: 'Account' }))
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Sign out' }))
    await userEvent.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Cancel' }))
    expect(router.state.location.pathname).not.toBe('/login')
  })

  it('shows the admin in the top bar', async () => {
    renderApp({ session: { name: 'Sam Lee', email: 's@scout.app', role: 'finance' } })
    const account = await screen.findByRole('button', { name: 'Account' })
    expect(account).toHaveTextContent('Sam Lee')
    expect(account).toHaveTextContent('Finance')
  })
})
