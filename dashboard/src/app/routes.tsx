import type { ReactNode } from 'react'
import type { RouteObject } from 'react-router'

import { LoginPage } from '@/features/auth/login-page'
import {
  BannersPage,
  CmsPage,
  FaqPage,
  ListsPage,
  NationalitiesPage,
  SpecializationsPage,
  NotificationsPage,
  OnboardingPage,
  SportsPage,
} from '@/features/content/content-pages'
import { CouponsPage } from '@/features/finance/coupons-page'
import { FeaturedPage, RevenuePage, SubscriptionsPage, TransactionsPage } from '@/features/finance/finance-pages'
import { PlansPage } from '@/features/finance/plans-page'
import { OverviewPage } from '@/features/overview/overview-page'
import { ProfileReviewPage } from '@/features/profiles/profile-review-page'
import { ProfilesQueuePage } from '@/features/profiles/profiles-queue-page'
import { ReelDetailPage, ReelsPage } from '@/features/reels/reels-pages'
import { ReportDetailPage, ReportsPage } from '@/features/reports/reports-pages'
import { AdminsPage } from '@/features/system/admins-page'
import { AuditPage } from '@/features/system/audit-page'
import { SettingsPage } from '@/features/system/settings-page'
import { UserDetailPage, UsersPage } from '@/features/users/users-pages'

import { AppLayout } from './layout/app-layout'
import { NotFoundPage } from './not-found-page'
import { RequireRole } from './require-role'

/** A route whose first segment is a nav section the role must be allowed to see. */
const guard = (path: string, element: ReactNode) => ({
  path,
  element: <RequireRole path={`/${path.split('/')[0]}`}>{element}</RequireRole>,
})

/** Every nav section has a clickable screen on mock data. */
export const routes: RouteObject[] = [
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <OverviewPage /> },
      guard('players', <ProfilesQueuePage role="player" />),
      guard('players/:id', <ProfileReviewPage />),
      guard('trainers', <ProfilesQueuePage role="trainer" />),
      guard('trainers/:id', <ProfileReviewPage />),
      guard('reels', <ReelsPage />),
      guard('reels/:id', <ReelDetailPage />),
      guard('reports', <ReportsPage />),
      guard('reports/:id', <ReportDetailPage />),
      guard('users', <UsersPage />),
      guard('users/:id', <UserDetailPage />),
      guard('featured', <FeaturedPage />),
      guard('subscriptions', <SubscriptionsPage />),
      guard('plans', <PlansPage />),
      guard('coupons', <CouponsPage />),
      guard('transactions', <TransactionsPage />),
      guard('revenue', <RevenuePage />),
      guard('onboarding', <OnboardingPage />),
      guard('banners', <BannersPage />),
      guard('sports', <SportsPage />),
      guard('nationalities', <NationalitiesPage />),
      guard('specializations', <SpecializationsPage />),
      guard('lists', <ListsPage />),
      guard('cms', <CmsPage />),
      guard('faq', <FaqPage />),
      guard('notifications', <NotificationsPage />),
      guard('settings', <SettingsPage />),
      guard('admins', <AdminsPage />),
      guard('audit', <AuditPage />),
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
