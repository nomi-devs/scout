import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router'

import { navForRole } from '@/app/nav'
import { BrandTile } from '@/components/brand'
import { useSession } from '@/features/auth/session-context'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

/** Side menu with every section the role may open. The admin profile lives in the top bar. */
export function AppSidebar() {
  const { t, i18n } = useTranslation()
  const { session } = useSession()
  const { pathname } = useLocation()

  if (!session) return null
  const groups = navForRole(session.role)
  const side = i18n.dir() === 'rtl' ? 'right' : 'left'

  return (
    <Sidebar side={side}>
      <SidebarHeader className="border-sidebar-border border-b">
        <div className="flex items-center gap-3 px-1 py-2">
          <BrandTile />
          <div className="leading-tight">
            <p className="font-heading text-primary text-xl font-bold uppercase">Scout</p>
            <p className="text-muted-foreground text-[11px] font-medium tracking-widest uppercase">
              {t('app.adminPanel')}
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {groups.map(({ group, items }) => (
          <SidebarGroup key={group}>
            <SidebarGroupLabel className="text-[11px] tracking-widest uppercase">
              {t(`nav.groups.${group}`)}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const active = item.path === '/' ? pathname === '/' : pathname.startsWith(item.path)
                  return (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        className="data-active:bg-brand-gradient data-active:shadow-primary/25 data-active:hover:text-white hover:bg-secondary hover:text-primary data-active:text-white data-active:shadow-md"
                      >
                        <NavLink to={item.path} end={item.path === '/'}>
                          <item.icon />
                          <span>{t(`nav.${item.key}`)}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
