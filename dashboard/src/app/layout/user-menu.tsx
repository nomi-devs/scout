import { ChevronDown, LogOut, Mail, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import { logout } from '@/api/auth'
import { useMockStore } from '@/mock/store'

import { useSession } from '@/features/auth/session-context'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

/** Signed-in admin at the end of the top bar (right in English, left in Arabic). */
export function UserMenu() {
  const { t } = useTranslation()
  const { session, signOut } = useSession()
  const { logAudit } = useMockStore()
  const navigate = useNavigate()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  if (!session) return null

  async function confirmLogout() {
    setBusy(true)
    try {
      await logout()
      logAudit({ admin: session!.name, action: 'auth.logout', target: session!.email, before: 'signed in', after: 'signed out' })
      signOut()
      toast.success(t('app.signedOut'))
      void navigate('/login', { replace: true })
    } catch {
      toast.error(t('app.signOutFailed'))
      setBusy(false)
    }
  }
  const initials = session.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto gap-2 px-1.5 py-1" aria-label={t('app.account')}>
          <Avatar className="size-8">
            <AvatarFallback className="bg-brand-gradient text-xs font-semibold text-white">{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden text-start leading-tight sm:block">
            <span className="block text-sm font-semibold">{session.name}</span>
            <span className="text-primary block text-xs">{t(`roles.${session.role}`)}</span>
          </span>
          <ChevronDown className="text-muted-foreground size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-3 py-2">
          <Avatar className="size-10">
            <AvatarFallback className="bg-brand-gradient text-sm font-semibold text-white">{initials}</AvatarFallback>
          </Avatar>
          <span className="min-w-0 leading-tight">
            <span className="text-foreground block truncate font-semibold">{session.name}</span>
            <span className="text-muted-foreground block truncate text-xs font-normal">{session.email}</span>
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled>
            <ShieldCheck />
            {t(`roles.${session.role}`)}
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Mail />
            {session.email}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => setConfirmOpen(true)}>
          <LogOut />
          {t('app.signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
      <Dialog open={confirmOpen} onOpenChange={(open) => !busy && setConfirmOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('app.signOutTitle')}</DialogTitle>
            <DialogDescription>{t('app.signOutBody')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" disabled={busy} onClick={() => setConfirmOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" disabled={busy} onClick={() => void confirmLogout()}>
              {t('app.signOut')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  )
}
