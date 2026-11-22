/** Mock data for the clickable build. Shapes mirror the Flutter app models; replaced by the API later. */

export interface Bi {
  en: string
  ar: string
}

export type ProfileRole = 'player' | 'trainer'
export type ProfileStatus = 'pending' | 'resubmitted' | 'approved' | 'rejected' | 'rejectedFinal' | 'hidden'
export type CertStatus = 'pending' | 'reviewed' | 'rejected'

export interface ProfileRec {
  id: string
  userId: string
  name: string
  role: ProfileRole
  sport: string
  specialization: string
  years: number
  city: string
  location: string
  nationality: string
  age: number
  /** Date of birth (ms). The app collects a date of birth; age is derived from it. */
  dob?: number
  gender: 'Male' | 'Female'
  weightKg?: number
  heightCm?: number
  bio: string
  /** Trainers only: the "My approach" line shown under the bio in the app. */
  approach?: string
  galleryCount: number
  certificates: { name: string; status: CertStatus }[]
  status: ProfileStatus
  submittedAt: number
  views: number
  featuredUntil?: number
  lockedBy?: string
  rejectionReasons?: string[]
  contactConsent: boolean
  phone: string
  email: string
  changedFields?: string[]
}

const H = 3_600_000
const D = 24 * H
const NOW = Date.now()
export const hoursAgo = (h: number) => NOW - h * H
export const daysAgo = (d: number) => NOW - d * D
export const daysAhead = (d: number) => NOW + d * D

export const initialProfiles: ProfileRec[] = [
  {
    id: 'p1',
    userId: 'u1',
    name: 'Omar Al-Sabah',
    role: 'player',
    sport: 'football',
    specialization: 'Attacking midfielder',
    years: 4,
    city: 'Kuwait City, Kuwait',
    location: 'Kuwait',
    nationality: 'Kuwaiti',
    age: 21,
    gender: 'Male',
    weightKg: 74,
    heightCm: 180,
    bio: 'Creative midfielder with strong vision and a left-foot finish. Captain of the university team.',
    galleryCount: 4,
    certificates: [],
    status: 'pending',
    submittedAt: hoursAgo(30),
    views: 0,
    contactConsent: true,
    phone: '+965 5000 1111',
    email: 'omar@example.com',
  },
  {
    id: 'p2',
    userId: 'u2',
    name: 'Yousef Haddad',
    role: 'player',
    sport: 'basketball',
    specialization: 'Forward',
    years: 3,
    city: 'Dubai, UAE',
    location: 'Dubai, United Arab Emirates',
    nationality: 'Jordanian',
    age: 24,
    gender: 'Male',
    weightKg: 88,
    heightCm: 196,
    bio: 'Power forward, 3 seasons in the UAE first division.',
    galleryCount: 2,
    certificates: [],
    status: 'pending',
    submittedAt: hoursAgo(6),
    views: 0,
    contactConsent: true,
    phone: '+971 50 222 3333',
    email: 'yousef@example.com',
  },
  {
    id: 'p3',
    userId: 'u3',
    name: 'Layla Mansour',
    role: 'player',
    sport: 'volleyball',
    specialization: 'Midfielder',
    years: 5,
    city: 'Doha, Qatar',
    location: 'Qatar',
    nationality: 'Qatari',
    age: 22,
    gender: 'Female',
    weightKg: 62,
    heightCm: 175,
    bio: 'Outside hitter with national youth experience.',
    galleryCount: 3,
    certificates: [],
    status: 'resubmitted',
    submittedAt: hoursAgo(50),
    views: 0,
    contactConsent: true,
    phone: '+974 5555 4444',
    email: 'layla@example.com',
    changedFields: ['Bio', 'Photo'],
    lockedBy: 'Sara (Moderator)',
  },
  {
    id: 'p4',
    userId: 'u4',
    name: 'Khalid Al-Rashid',
    role: 'player',
    sport: 'football',
    specialization: 'Goalkeeper',
    years: 5,
    city: 'Riyadh, Saudi Arabia',
    location: 'Saudi Arabia',
    nationality: 'Saudi',
    age: 26,
    gender: 'Male',
    weightKg: 85,
    heightCm: 188,
    bio: 'Reliable keeper, 12 clean sheets last season.',
    galleryCount: 5,
    certificates: [],
    status: 'approved',
    submittedAt: daysAgo(12),
    views: 214,
    featuredUntil: daysAhead(18),
    contactConsent: true,
    phone: '+966 55 666 7777',
    email: 'khalid@example.com',
  },
  {
    id: 'p5',
    userId: 'u5',
    name: 'Noor Al-Ali',
    role: 'player',
    sport: 'tennis',
    specialization: 'Right-foot',
    years: 2,
    city: 'Manama, Bahrain',
    location: 'Bahrain',
    nationality: 'Bahraini',
    age: 19,
    gender: 'Female',
    weightKg: 58,
    heightCm: 168,
    bio: 'Junior tennis player, ranked top 10 nationally.',
    galleryCount: 1,
    certificates: [],
    status: 'rejected',
    submittedAt: daysAgo(3),
    views: 0,
    contactConsent: false,
    phone: '+973 3333 8888',
    email: 'noor@example.com',
    rejectionReasons: ['Photo is unclear'],
  },
  {
    id: 't1',
    userId: 'u6',
    name: 'Coach Ahmed Farouk',
    role: 'trainer',
    sport: 'football',
    specialization: 'Youth development',
    years: 12,
    city: 'Cairo, Egypt',
    location: 'Kuwait',
    nationality: 'Egyptian',
    age: 41,
    gender: 'Male',
    bio: 'UEFA B licensed coach, 12 years developing academy players.',
    galleryCount: 6,
    certificates: [
      { name: 'UEFA B Licence', status: 'pending' },
      { name: 'First Aid Certificate', status: 'pending' },
    ],
    status: 'pending',
    submittedAt: hoursAgo(40),
    views: 0,
    contactConsent: true,
    phone: '+965 6000 1234',
    email: 'ahmed@example.com',
  },
  {
    id: 't2',
    userId: 'u7',
    name: 'Coach Fatima Nasser',
    role: 'trainer',
    sport: 'basketball',
    specialization: 'Strength & conditioning',
    years: 8,
    city: 'Abu Dhabi, UAE',
    location: 'United Arab Emirates',
    nationality: 'Emirati',
    age: 35,
    gender: 'Female',
    bio: 'Certified strength coach working with pro and amateur teams.',
    galleryCount: 3,
    certificates: [{ name: 'NSCA-CSCS', status: 'pending' }],
    status: 'pending',
    submittedAt: hoursAgo(3),
    views: 0,
    contactConsent: true,
    phone: '+971 55 123 4567',
    email: 'fatima@example.com',
  },
  {
    id: 't3',
    userId: 'u8',
    name: 'Coach Salem Al-Mutairi',
    role: 'trainer',
    sport: 'cricket',
    specialization: 'Tactical analysis',
    years: 15,
    city: 'Kuwait City, Kuwait',
    location: 'Kuwait',
    nationality: 'Kuwaiti',
    age: 46,
    gender: 'Male',
    bio: 'Former national player, now analyst and batting coach.',
    galleryCount: 2,
    certificates: [{ name: 'ICC Level 2', status: 'reviewed' }],
    status: 'approved',
    submittedAt: daysAgo(20),
    views: 530,
    featuredUntil: daysAhead(5),
    contactConsent: true,
    phone: '+965 9000 5555',
    email: 'salem@example.com',
  },
  {
    id: 't4',
    userId: 'u9',
    name: 'Coach Reem Saleh',
    role: 'trainer',
    sport: 'tennis',
    specialization: 'Shooting & skills',
    years: 6,
    city: 'Doha, Qatar',
    location: 'Qatar',
    nationality: 'Qatari',
    age: 33,
    gender: 'Female',
    bio: 'Tennis coach for juniors and adults.',
    galleryCount: 2,
    certificates: [{ name: 'ITF Level 1', status: 'rejected' }],
    status: 'hidden',
    submittedAt: daysAgo(40),
    views: 88,
    contactConsent: true,
    phone: '+974 6666 2222',
    email: 'reem@example.com',
  },
]

/** Seeded random so the mock data is the same on every load. */
function seeded(seed: number) {
  let x = seed
  return () => {
    x = (x * 1_103_515_245 + 12_345) % 2_147_483_648
    return x / 2_147_483_648
  }
}
const rand = seeded(42)
const pick = <T>(items: readonly T[]): T => items[Math.floor(rand() * items.length)] as T

const firstNames = [
  'Ali',
  'Hassan',
  'Fahad',
  'Mohammed',
  'Abdullah',
  'Saud',
  'Nasser',
  'Bader',
  'Faisal',
  'Hamad',
  'Sara',
  'Maryam',
  'Fatima',
  'Noura',
  'Dana',
  'Hessa',
  'Aisha',
  'Reem',
  'Lulwa',
  'Yara',
]
const lastNames = [
  'Al-Enezi',
  'Al-Ajmi',
  'Al-Kandari',
  'Al-Shammari',
  'Al-Hajri',
  'Al-Azmi',
  'Al-Otaibi',
  'Al-Dosari',
  'Haddad',
  'Mansour',
  'Khalil',
  'Saleh',
  'Nasser',
  'Al-Fadhli',
  'Al-Mutawa',
]
const sportsList = ['football', 'basketball', 'volleyball', 'tennis', 'cricket'] as const
const playerSpecs = [
  'Right-foot',
  'Left-foot',
  'Attacking midfielder',
  'Defender',
  'Goalkeeper',
  'Forward',
  'Midfielder',
]
const trainerSpecs = [
  'Youth development',
  'Goalkeeping',
  'Shooting & skills',
  'Strength & conditioning',
  'Tactical analysis',
]
const places = [
  ['Kuwait City, Kuwait', 'Kuwait', 'Kuwaiti'],
  ['Salmiya, Kuwait', 'Kuwait', 'Kuwaiti'],
  ['Dubai, UAE', 'Dubai, United Arab Emirates', 'Emirati'],
  ['Riyadh, Saudi Arabia', 'Saudi Arabia', 'Saudi'],
  ['Doha, Qatar', 'Qatar', 'Qatari'],
  ['Manama, Bahrain', 'Bahrain', 'Bahraini'],
  ['Muscat, Oman', 'Oman', 'Omani'],
] as const
const statusPool: ProfileStatus[] = [
  'pending',
  'pending',
  'approved',
  'approved',
  'approved',
  'approved',
  'rejected',
  'resubmitted',
  'hidden',
  'rejectedFinal',
]

function generateProfiles(count: number): ProfileRec[] {
  return Array.from({ length: count }, (_, i) => {
    const n = i + 1
    const role: ProfileRole = rand() < 0.65 ? 'player' : 'trainer'
    const female = rand() < 0.35
    const first = female ? pick(firstNames.slice(10)) : pick(firstNames.slice(0, 10))
    const name = `${role === 'trainer' ? 'Coach ' : ''}${first} ${pick(lastNames)}`
    const [city, location, nationality] = pick(places)
    const status = pick(statusPool)
    const approved = status === 'approved'
    const pending = status === 'pending' || status === 'resubmitted'
    return {
      id: `g${n}`,
      userId: `gu${n}`,
      name,
      role,
      sport: pick(sportsList),
      specialization: pick(role === 'player' ? playerSpecs : trainerSpecs),
      years: 1 + Math.floor(rand() * (role === 'player' ? 8 : 20)),
      city,
      location,
      nationality,
      age: role === 'player' ? 17 + Math.floor(rand() * 15) : 26 + Math.floor(rand() * 25),
      gender: female ? 'Female' : 'Male',
      ...(role === 'player' ? { weightKg: 55 + Math.floor(rand() * 40), heightCm: 160 + Math.floor(rand() * 40) } : {}),
      bio: 'Committed athlete looking for the next opportunity.',
      galleryCount: 1 + Math.floor(rand() * 5),
      certificates: role === 'trainer' ? [{ name: 'Coaching Licence', status: pending ? 'pending' : 'reviewed' }] : [],
      status,
      submittedAt: pending ? hoursAgo(1 + Math.floor(rand() * 96)) : daysAgo(3 + Math.floor(rand() * 120)),
      views: approved ? Math.floor(rand() * 900) : 0,
      ...(approved && rand() < 0.25 ? { featuredUntil: daysAhead(1 + Math.floor(rand() * 60)) } : {}),
      ...(status === 'rejected' || status === 'rejectedFinal'
        ? { rejectionReasons: [pick(['Photo is unclear', 'Information is incomplete'])] }
        : {}),
      contactConsent: rand() < 0.85,
      phone: `+965 ${5000 + Math.floor(rand() * 4999)} ${1000 + Math.floor(rand() * 8999)}`,
      email: `${first.toLowerCase()}${n}@example.com`,
    } satisfies ProfileRec
  })
}

initialProfiles.push(...generateProfiles(130))
for (const p of initialProfiles) {
  p.dob = NOW - p.age * 365.25 * D - ((p.userId.length * 37) % 300) * D
  if (p.role === 'trainer') p.approach = 'Strong fundamentals, individual attention and a genuine love of the game.'
}

export interface UserRec {
  id: string
  name: string
  email: string
  phone: string
  role: ProfileRole
  status: 'active' | 'suspended' | 'deleted'
  joinedAt: number
  profileId: string
  subscriptionPlan?: '6m' | '12m'
  subscriptionStartedAt?: number
  subscriptionEndsAt?: number
  blocks: number
}

const planMonths = { '6m': 6, '12m': 12 } as const

export const initialUsers: UserRec[] = initialProfiles.map((p, i) => {
  const plan: UserRec['subscriptionPlan'] = i % 2 === 0 ? '6m' : '12m'
  const length = planMonths[plan] * 30
  const elapsed = (i * 53) % length
  const hasPlan = p.status === 'approved' || p.status === 'hidden'
  const endsAt = p.status === 'approved' ? daysAhead(length - elapsed) : daysAgo((i % 30) + 1)
  return {
    id: p.userId,
    name: p.name,
    email: p.email,
    phone: p.phone,
    role: p.role,
    status: p.status === 'hidden' && i % 4 === 0 ? 'suspended' : 'active',
    joinedAt: daysAgo(5 + ((i * 37) % 300)),
    profileId: p.id,
    ...(hasPlan
      ? { subscriptionPlan: plan, subscriptionStartedAt: endsAt - length * D, subscriptionEndsAt: endsAt }
      : {}),
    blocks: i % 3,
  }
})

export interface ReportRec {
  id: string
  profileId: string
  reasons: string[]
  note?: string
  reporters: string[]
  createdAt: number
  status: 'open' | 'dismissed' | 'hidden' | 'suspended'
  resolutionNote?: string
}

export const initialReports: ReportRec[] = [
  {
    id: 'r1',
    profileId: 'p4',
    reasons: ['Fake profile', 'Inappropriate photo'],
    reporters: ['Yousef Haddad', 'Layla Mansour'],
    createdAt: hoursAgo(30),
    status: 'open',
  },
  {
    id: 'r2',
    profileId: 't3',
    reasons: ['Other'],
    note: 'Contact number does not work.',
    reporters: ['Omar Al-Sabah'],
    createdAt: hoursAgo(5),
    status: 'open',
  },
  {
    id: 'r3',
    profileId: 't4',
    reasons: ['Spam'],
    reporters: ['Noor Al-Ali'],
    createdAt: daysAgo(6),
    status: 'hidden',
    resolutionNote: 'Repeated promotional content.',
  },
]

const reportReasons = ['Fake profile', 'Inappropriate photo', 'Spam', 'Wrong information', 'Other']
const reportStatus: ReportRec['status'][] = ['open', 'open', 'dismissed', 'hidden', 'suspended']
initialReports.push(
  ...Array.from({ length: 45 }, (_, i): ReportRec => {
    const target = pick(initialProfiles.filter((p) => p.status === 'approved' || p.status === 'hidden'))
    const status = pick(reportStatus)
    return {
      id: `gr${i + 1}`,
      profileId: target.id,
      reasons: [pick(reportReasons)],
      reporters: Array.from({ length: 1 + Math.floor(rand() * 3) }, () => pick(initialProfiles).name),
      createdAt: hoursAgo(1 + Math.floor(rand() * 24 * 20)),
      status,
      ...(status !== 'open' ? { resolutionNote: 'Checked by moderator.' } : {}),
    }
  }),
)

export type TxStatus = 'paid' | 'failed' | 'refunded'
export interface TransactionRec {
  id: string
  invoice: string
  userId: string
  userName: string
  kind: 'subscription' | 'renewal' | 'featured'
  amount: number
  method: 'KNET' | 'Apple Pay' | 'Visa' | 'Mastercard'
  /** How long the purchase keeps the profile visible or featured. */
  months: number
  status: TxStatus
  paidAt: number
  coupon?: string
  discount?: number
}

/** Prices follow the approved app: 6 months 36 KWD, 1 year 60 KWD, Featured 1 month 5 KWD, 3 months 20 KWD. */
export const transactions: TransactionRec[] = [
  {
    id: 'x1',
    invoice: 'INV-1042',
    userId: 'u4',
    userName: 'Khalid Al-Rashid',
    kind: 'subscription',
    amount: 36,
    months: 6,
    method: 'KNET',
    status: 'paid',
    paidAt: daysAgo(12),
  },
  {
    id: 'x2',
    invoice: 'INV-1043',
    userId: 'u4',
    userName: 'Khalid Al-Rashid',
    kind: 'featured',
    amount: 5,
    months: 1,
    method: 'KNET',
    status: 'paid',
    paidAt: daysAgo(12),
  },
  {
    id: 'x3',
    invoice: 'INV-1051',
    userId: 'u8',
    userName: 'Coach Salem Al-Mutairi',
    kind: 'subscription',
    amount: 54,
    months: 12,
    method: 'Visa',
    status: 'paid',
    paidAt: daysAgo(20),
    coupon: 'WELCOME10',
    discount: 6,
  },
  {
    id: 'x4',
    invoice: 'INV-1060',
    userId: 'u8',
    userName: 'Coach Salem Al-Mutairi',
    kind: 'featured',
    amount: 20,
    months: 3,
    method: 'Apple Pay',
    status: 'paid',
    paidAt: daysAgo(10),
  },
  {
    id: 'x5',
    invoice: 'INV-1066',
    userId: 'u9',
    userName: 'Coach Reem Saleh',
    kind: 'subscription',
    amount: 36,
    months: 6,
    method: 'Mastercard',
    status: 'refunded',
    paidAt: daysAgo(40),
  },
  {
    id: 'x6',
    invoice: 'INV-1071',
    userId: 'u5',
    userName: 'Noor Al-Ali',
    kind: 'subscription',
    amount: 36,
    months: 6,
    method: 'Apple Pay',
    status: 'failed',
    paidAt: daysAgo(2),
  },
  {
    id: 'x7',
    invoice: 'INV-1075',
    userId: 'u1',
    userName: 'Omar Al-Sabah',
    kind: 'renewal',
    amount: 54,
    months: 12,
    method: 'KNET',
    status: 'paid',
    paidAt: daysAgo(1),
    coupon: 'RENEW10',
    discount: 6,
  },
]

const methods: TransactionRec['method'][] = ['KNET', 'KNET', 'Apple Pay', 'Visa', 'Mastercard']
const kinds: TransactionRec['kind'][] = ['subscription', 'subscription', 'renewal', 'featured']
transactions.push(
  ...Array.from({ length: 180 }, (_, i): TransactionRec => {
    const user = pick(initialUsers)
    const kind = pick(kinds)
    const long = rand() < 0.5
    const months = kind === 'featured' ? (long ? 3 : 1) : long ? 12 : 6
    const base = kind === 'featured' ? (long ? 20 : 5) : long ? 60 : 36
    const coupon = kind !== 'featured' && rand() < 0.15 ? pick(['WELCOME10', 'RENEW10']) : undefined
    const discount = coupon ? base / 10 : undefined
    const r = rand()
    return {
      id: `gx${i + 1}`,
      invoice: `INV-${2000 + i}`,
      userId: user.id,
      userName: user.name,
      kind,
      amount: base - (discount ?? 0),
      months,
      method: pick(methods),
      status: r < 0.85 ? 'paid' : r < 0.95 ? 'failed' : 'refunded',
      paidAt: daysAgo(Math.floor(rand() * 180)),
      ...(coupon ? { coupon, discount } : {}),
    }
  }),
)

export const revenueByMonth = [
  { month: 'Jun', revenue: 760, subscriptions: 610, featured: 150 },
  { month: 'Jul', revenue: 990, subscriptions: 790, featured: 200 },
  { month: 'Aug', revenue: 1240, subscriptions: 980, featured: 260 },
  { month: 'Sep', revenue: 1540, subscriptions: 1210, featured: 330 },
  { month: 'Oct', revenue: 1880, subscriptions: 1480, featured: 400 },
  { month: 'Nov', revenue: 2160, subscriptions: 1690, featured: 470 },
]

export const reviewReasons = [
  'Photo is unclear',
  'Information is incomplete',
  'Certificate is not valid',
  'Inappropriate content',
  'Duplicate profile',
]

export type ReelStatus = 'pending' | 'approved' | 'rejected' | 'hidden'

/** A video a user uploaded from "Create Reel". It is reviewed by an admin before it is published. */
export interface ReelRec {
  id: string
  profileId: string
  ownerName: string
  role: ProfileRole
  sport: string
  title: string
  location: string
  description: string
  durationSec: number
  submittedAt: number
  status: ReelStatus
  views: number
  rejectionReason?: string
}

const reelTitles = [
  'Sunset session',
  'Training day',
  'Match highlights',
  'Skills drill',
  'Warm-up routine',
  'Behind the scenes',
]
const reelPlaces = ['Dubai, United Arab Emirates', 'Kuwait', 'Doha, Qatar', 'Riyadh, Saudi Arabia']

/** App rules for reels: a user can upload 35 a month, each up to 2 minutes, and approved reels never expire. */
export const REEL_MAX_PER_MONTH = 35
export const REEL_MAX_SECONDS = 120

export const initialReels: ReelRec[] = [
  {
    id: 'rl1',
    profileId: 't3',
    ownerName: 'Coach Salem Al-Mutairi',
    role: 'trainer',
    sport: 'cricket',
    title: 'Batting drill with video feedback',
    location: 'Kuwait',
    description: 'Stunning sunset views from the nets. Best batting session of the week!',
    durationSec: 74,
    submittedAt: hoursAgo(5),
    status: 'pending',
    views: 0,
  },
  {
    id: 'rl2',
    profileId: 'p4',
    ownerName: 'Khalid Al-Rashid',
    role: 'player',
    sport: 'football',
    title: 'Goalkeeper reflex training',
    location: 'Riyadh, Saudi Arabia',
    description: 'Twelve clean sheets last season. Here is how I train my reflexes.',
    durationSec: 112,
    submittedAt: hoursAgo(20),
    status: 'pending',
    views: 0,
  },
  {
    id: 'rl3',
    profileId: 'p4',
    ownerName: 'Khalid Al-Rashid',
    role: 'player',
    sport: 'football',
    title: 'Penalty saves compilation',
    location: 'Riyadh, Saudi Arabia',
    description: 'Highlights from the cup final.',
    durationSec: 95,
    submittedAt: daysAgo(4),
    status: 'approved',
    views: 142_000,
  },
  {
    id: 'rl4',
    profileId: 't4',
    ownerName: 'Coach Reem Saleh',
    role: 'trainer',
    sport: 'tennis',
    title: 'Serve technique',
    location: 'Doha, Qatar',
    description: 'Call me for a private lesson.',
    durationSec: 48,
    submittedAt: daysAgo(6),
    status: 'rejected',
    views: 0,
    rejectionReason: 'Not sports related',
  },
]

initialReels.push(
  ...Array.from({ length: 28 }, (_, i): ReelRec => {
    const owner = pick(initialProfiles.filter((p) => p.status === 'approved'))
    const status = pick<ReelStatus>(['pending', 'approved', 'approved', 'approved', 'rejected', 'hidden'])
    return {
      id: `grl${i + 1}`,
      profileId: owner.id,
      ownerName: owner.name,
      role: owner.role,
      sport: owner.sport,
      title: pick(reelTitles),
      location: pick(reelPlaces),
      description: 'Work in progress. Always improving on and off the pitch.',
      durationSec: 20 + Math.floor(rand() * 100),
      submittedAt: status === 'pending' ? hoursAgo(1 + Math.floor(rand() * 60)) : daysAgo(1 + Math.floor(rand() * 60)),
      status,
      views: status === 'approved' ? Math.floor(rand() * 200_000) : 0,
      ...(status === 'rejected' ? { rejectionReason: 'Poor video quality' } : {}),
    }
  }),
)

export const adminNames = ['Super Admin', 'Sara (Moderator)', 'Hamad (Finance)', 'Mariam (Content)']
