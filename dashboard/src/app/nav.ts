import type { LucideIcon } from 'lucide-react'
import {
  BadgePercent,
  Bell,
  CreditCard,
  FileText,
  Film,
  Flag,
  Gauge,
  Globe,
  GraduationCap,
  HelpCircle,
  Images,
  LayoutList,
  Megaphone,
  Receipt,
  ScrollText,
  Settings,
  ShieldCheck,
  Star,
  TrendingUp,
  Trophy,
  User,
  UserCog,
  Users,
  WalletCards,
} from 'lucide-react'

export const adminRoles = ['super_admin', 'moderator', 'finance', 'content_manager'] as const
export type AdminRole = (typeof adminRoles)[number]

export type NavGroupKey = 'general' | 'moderation' | 'finance' | 'content' | 'system'

export interface NavItem {
  /** Translation key under `nav.` and the route path segment. */
  key: string
  path: string
  icon: LucideIcon
  group: NavGroupKey
  roles: readonly AdminRole[]
}

const ALL = adminRoles
const MOD = ['super_admin', 'moderator'] as const
const FIN = ['super_admin', 'finance'] as const
const CONTENT = ['super_admin', 'content_manager'] as const
const SUPER = ['super_admin'] as const

/** Dashboard sections and who can see them (PRD A1 role table). */
export const navItems: readonly NavItem[] = [
  { key: 'overview', path: '/', icon: Gauge, group: 'general', roles: ALL },
  { key: 'players', path: '/players', icon: User, group: 'moderation', roles: MOD },
  { key: 'trainers', path: '/trainers', icon: ShieldCheck, group: 'moderation', roles: MOD },
  { key: 'reels', path: '/reels', icon: Film, group: 'moderation', roles: MOD },
  { key: 'reports', path: '/reports', icon: Flag, group: 'moderation', roles: MOD },
  { key: 'users', path: '/users', icon: Users, group: 'moderation', roles: ['super_admin', 'moderator', 'finance'] },
  { key: 'featured', path: '/featured', icon: Star, group: 'finance', roles: FIN },
  { key: 'subscriptions', path: '/subscriptions', icon: WalletCards, group: 'finance', roles: FIN },
  { key: 'plans', path: '/plans', icon: CreditCard, group: 'finance', roles: FIN },
  { key: 'coupons', path: '/coupons', icon: BadgePercent, group: 'finance', roles: FIN },
  { key: 'transactions', path: '/transactions', icon: Receipt, group: 'finance', roles: FIN },
  { key: 'revenue', path: '/revenue', icon: TrendingUp, group: 'finance', roles: FIN },
  { key: 'onboarding', path: '/onboarding', icon: Images, group: 'content', roles: CONTENT },
  { key: 'banners', path: '/banners', icon: Megaphone, group: 'content', roles: CONTENT },
  { key: 'sports', path: '/sports', icon: Trophy, group: 'content', roles: CONTENT },
  { key: 'nationalities', path: '/nationalities', icon: Globe, group: 'content', roles: CONTENT },
  { key: 'specializations', path: '/specializations', icon: GraduationCap, group: 'content', roles: CONTENT },
  { key: 'lists', path: '/lists', icon: LayoutList, group: 'content', roles: CONTENT },
  { key: 'cms', path: '/cms', icon: FileText, group: 'content', roles: CONTENT },
  { key: 'faq', path: '/faq', icon: HelpCircle, group: 'content', roles: CONTENT },
  { key: 'notifications', path: '/notifications', icon: Bell, group: 'content', roles: CONTENT },
  { key: 'settings', path: '/settings', icon: Settings, group: 'system', roles: SUPER },
  { key: 'admins', path: '/admins', icon: UserCog, group: 'system', roles: SUPER },
  { key: 'audit', path: '/audit', icon: ScrollText, group: 'system', roles: SUPER },
]

export const navGroupOrder: readonly NavGroupKey[] = ['general', 'moderation', 'finance', 'content', 'system']

export function canAccess(item: NavItem, role: AdminRole): boolean {
  return item.roles.includes(role)
}

/** Nav items the role may see, grouped in display order. Empty groups are dropped. */
export function navForRole(role: AdminRole): { group: NavGroupKey; items: NavItem[] }[] {
  return navGroupOrder
    .map((group) => ({
      group,
      items: navItems.filter((item) => item.group === group && canAccess(item, role)),
    }))
    .filter((entry) => entry.items.length > 0)
}
