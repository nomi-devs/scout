import { Navigate, Outlet } from 'react-router'

import { Wordmark } from '@/components/brand'
import { useSession } from '@/features/auth/session-context'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

import { AppSidebar } from './app-sidebar'
import { LanguageSwitcher } from './language-switcher'
import { UserMenu } from './user-menu'

/** Signed-in shell: collapsible side menu (a sheet on phones), top bar with language switch and the admin menu. */
export function AppLayout() {
  const { session } = useSession()
  if (!session) return <Navigate to="/login" replace />

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background">
        <div className="bg-brand-gradient h-1 w-full" aria-hidden />
        <header className="bg-card/80 sticky top-0 z-10 flex h-16 items-center gap-2 border-b px-4 backdrop-blur">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          <Wordmark className="h-7 md:hidden" />
          <div className="ms-auto flex items-center gap-2">
            <LanguageSwitcher />
            <Separator orientation="vertical" className="h-6" />
            <UserMenu />
          </div>
        </header>
        <div className="bg-page-wash flex-1 p-4 md:p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
