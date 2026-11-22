import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { SessionProvider } from '@/features/auth/session'
import type { AdminSession } from '@/features/auth/session-context'
import { DirectionProvider } from '@/components/ui/direction'
import { Toaster } from '@/components/ui/sonner'
import { MockStoreProvider } from '@/mock/store'
import { TooltipProvider } from '@/components/ui/tooltip'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
    },
  })
}

/** App-wide providers. Tests pass `initialSession` to start signed in or out. */
export function AppProviders({
  children,
  initialSession,
}: {
  children: ReactNode
  initialSession?: AdminSession | null
}) {
  const [queryClient] = useState(makeQueryClient)
  const { i18n } = useTranslation()

  return (
    <QueryClientProvider client={queryClient}>
      <DirectionProvider dir={i18n.dir()}>
        <TooltipProvider>
          <SessionProvider initialSession={initialSession}>
            <MockStoreProvider>{children}</MockStoreProvider>
          </SessionProvider>
          <Toaster position="top-center" />
        </TooltipProvider>
      </DirectionProvider>
    </QueryClientProvider>
  )
}
