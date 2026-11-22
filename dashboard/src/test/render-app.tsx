import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'

import { AppProviders } from '@/app/providers'
import { routes } from '@/app/routes'
import type { AdminSession } from '@/features/auth/session-context'

/** Renders the real route tree at `path`, signed in as `session` (or signed out with null). */
export function renderApp({ path = '/', session = null }: { path?: string; session?: AdminSession | null } = {}) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  const utils = render(
    <AppProviders initialSession={session}>
      <RouterProvider router={router} />
    </AppProviders>,
  )
  return { ...utils, router }
}
