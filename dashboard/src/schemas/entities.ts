import { z } from 'zod'

import { REEL_MAX_SECONDS } from '@/mock/data'

/**
 * Shapes of the records the dashboard reads. They follow the mobile app's forms and screens, which are the
 * approved design, and the SRS. The tests check the mock data against them, so a field that the app does not
 * have, or a rule the app enforces, shows up as a failing test instead of a surprise during integration.
 */

export const sportKeys = ['football', 'basketball', 'volleyball', 'tennis', 'cricket'] as const

/** Phone is the app's login and OTP identity: country code plus digits. */
export const phoneSchema = z.string().regex(/^\+\d{1,3}[\d\s-]{6,14}$/, 'phone')

export const certificateSchema = z.object({
  name: z.string().min(1),
  status: z.enum(['pending', 'reviewed', 'rejected']),
})

/** "Complete your player / trainer profile" in the app, plus the review fields the dashboard adds. */
export const profileSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    name: z.string().min(1),
    role: z.enum(['player', 'trainer']),
    sport: z.enum(sportKeys),
    specialization: z.string().min(1),
    years: z.number().int().min(0).max(60),
    city: z.string().min(1),
    location: z.string().min(1),
    nationality: z.string().min(1),
    age: z.number().int().min(10).max(90),
    dob: z.number().optional(),
    gender: z.enum(['Male', 'Female']),
    /** Player form only, optional there. */
    weightKg: z.number().positive().optional(),
    heightCm: z.number().positive().optional(),
    bio: z.string().min(1),
    approach: z.string().optional(),
    galleryCount: z.number().int().min(0),
    certificates: z.array(certificateSchema),
    status: z.enum(['pending', 'resubmitted', 'approved', 'rejected', 'rejectedFinal', 'hidden']),
    submittedAt: z.number(),
    views: z.number().int().min(0),
    favourites: z.number().int().min(0),
    featuredUntil: z.number().optional(),
    contactConsent: z.boolean(),
    phone: phoneSchema,
    email: z.email(),
  })
  .refine((p) => p.role === 'trainer' || p.certificates.length === 0, {
    message: 'Only trainers upload certificates',
    path: ['certificates'],
  })
  .refine((p) => p.role === 'player' || (p.weightKg === undefined && p.heightCm === undefined), {
    message: 'Weight and height are on the player form only',
    path: ['weightKg'],
  })

/** "Create Reel" in the app. Max 2 minutes; approved reels never expire. */
export const reelSchema = z.object({
  id: z.string(),
  profileId: z.string(),
  ownerName: z.string().min(1),
  role: z.enum(['player', 'trainer']),
  sport: z.enum(sportKeys),
  title: z.string().min(1),
  location: z.string().min(1),
  description: z.string(),
  durationSec: z.number().int().min(1).max(REEL_MAX_SECONDS),
  submittedAt: z.number(),
  status: z.enum(['pending', 'approved', 'rejected', 'hidden']),
  views: z.number().int().min(0),
  rejectionReason: z.string().optional(),
})

/** One row of the app's "Transaction History": invoice, date, MyFatoorah method, validity and amount. */
export const transactionSchema = z.object({
  id: z.string(),
  invoice: z.string().regex(/^INV-\d+$/),
  userId: z.string(),
  userName: z.string().min(1),
  kind: z.enum(['subscription', 'renewal', 'featured']),
  amount: z.number().min(0),
  method: z.enum(['KNET', 'Apple Pay', 'Visa', 'Mastercard']),
  months: z.number().int().refine((m) => [1, 3, 6, 12].includes(m), 'months'),
  status: z.enum(['paid', 'failed', 'refunded']),
  paidAt: z.number(),
  coupon: z.string().optional(),
  discount: z.number().min(0).optional(),
})

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.email(),
  phone: phoneSchema,
  role: z.enum(['player', 'trainer']),
  status: z.enum(['active', 'suspended', 'deleted']),
  joinedAt: z.number(),
  profileId: z.string(),
  subscriptionPlan: z.enum(['6m', '12m']).optional(),
  subscriptionStartedAt: z.number().optional(),
  subscriptionEndsAt: z.number().optional(),
  blocks: z.number().int().min(0),
  phoneVerifiedAt: z.number(),
  passwordChangedAt: z.number().optional(),
  deletion: z.object({ at: z.number(), by: z.enum(['user', 'admin']) }).optional(),
})
  .refine((u) => (u.status === 'deleted') === !!u.deletion, { message: 'deletion', path: ['deletion'] })
