import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { renderApp } from '@/test/render-app'

describe('LoginPage', () => {
  it('redirects signed-out visitors to login', async () => {
    const { router } = renderApp({ path: '/plans' })
    await waitFor(() => expect(router.state.location.pathname).toBe('/login'))
  })

  it('shows validation errors for an empty form', async () => {
    renderApp({ path: '/login' })
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(await screen.findByText('Enter a valid email address.')).toBeInTheDocument()
    expect(screen.getByText('Password is required.')).toBeInTheDocument()
  })

  it('signs in and opens the overview', async () => {
    const { router } = renderApp({ path: '/login' })
    await userEvent.type(screen.getByLabelText('Email'), 'admin@scout.app')
    await userEvent.type(screen.getByLabelText('Password'), 'secret')
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/'))
    expect(await screen.findByRole('heading', { name: 'Overview' })).toBeInTheDocument()
  })
})
