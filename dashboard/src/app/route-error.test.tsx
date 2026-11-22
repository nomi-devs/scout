import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import { AppProviders } from './providers'
import { RouteError } from './route-error'

function Broken(): never {
  throw new Error('Boom')
}

describe('RouteError', () => {
  it('shows a friendly page instead of a blank screen when a screen throws', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const router = createMemoryRouter([{ path: '/', element: <Broken />, errorElement: <RouteError /> }])
    render(
      <AppProviders initialSession={null}>
        <RouterProvider router={router} />
      </AppProviders>,
    )
    expect(await screen.findByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Boom')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /overview/i })).toBeInTheDocument()
  })
})
