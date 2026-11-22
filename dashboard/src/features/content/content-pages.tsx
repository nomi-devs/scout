import { Send } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CrudPage, ImagePreview, type Row } from '@/features/shared/crud-page'
import { bi } from '@/features/shared/helpers'

import matchImg from '@/assets/seed/match.jpg'
import runnerImg from '@/assets/seed/runner.jpg'
import starImg from '@/assets/seed/star.jpg'
import cricketIcon from '@/assets/seed/sport-cricket.png'
import basketballIcon from '@/assets/seed/sport-basketball.png'
import footballIcon from '@/assets/seed/sport-football.png'
import tennisIcon from '@/assets/seed/sport-tennis.png'
import volleyballIcon from '@/assets/seed/sport-volleyball.png'
import trainingCampImg from '@/assets/seed/training-camp.jpg'

const activeBadge = (t: (k: string) => string, active: unknown) => (
  <StatusBadge tone={active ? 'success' : 'neutral'}>{active ? t('status.active') : t('status.inactive')}</StatusBadge>
)

const onboarding: Row[] = [
  {
    id: 'o1',
    order: 1,
    titleEn: 'Get discovered',
    titleAr: 'اكتشفك المدربون',
    bodyEn: 'Build a profile and be seen by trainers and clubs.',
    bodyAr: 'أنشئ ملفك ليراك المدربون والأندية.',
    imageUrl: runnerImg,
  },
  {
    id: 'o2',
    order: 2,
    titleEn: 'Find the right trainer',
    titleAr: 'ابحث عن المدرب المناسب',
    bodyEn: 'Filter by sport, location and experience.',
    bodyAr: 'صفِّ حسب الرياضة والموقع والخبرة.',
    imageUrl: matchImg,
  },
  {
    id: 'o3',
    order: 3,
    titleEn: 'Go live in minutes',
    titleAr: 'انطلق خلال دقائق',
    bodyEn: 'Submit for review, subscribe, and you are live.',
    bodyAr: 'أرسل للمراجعة واشترك لتظهر للجميع.',
    imageUrl: starImg,
  },
]

/** Phone-style preview of a slide, matching the app's welcome screen. */
function SlidePreview({ row, lang, count }: { row: Row; lang: string; count: number }) {
  const { t } = useTranslation()
  return (
    <div className="bg-muted/40 mx-auto flex w-64 flex-col items-center rounded-3xl border p-4 text-center">
      <ImagePreview url={String(row.imageUrl)} className="aspect-square w-full !rounded-2xl" />
      <h3 className="mt-4 text-lg leading-tight font-bold uppercase">{bi(row, 'title', lang)}</h3>
      <p className="text-muted-foreground mt-2 text-sm">{bi(row, 'body', lang)}</p>
      <div className="mt-4 flex gap-1.5" aria-hidden>
        {Array.from({ length: count }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full ${i + 1 === Number(row.order) ? 'bg-primary w-6' : 'bg-muted-foreground/30 w-1.5'}`}
          />
        ))}
      </div>
      <span className="bg-primary text-primary-foreground mt-4 w-full rounded-xl py-2 text-sm font-medium">
        {t('onboarding.getStarted')}
      </span>
    </div>
  )
}

export function OnboardingPage() {
  const { t } = useTranslation()
  return (
    <CrudPage
      config={{
        title: t('nav.onboarding'),
        description: t('onboarding.description'),
        addLabel: t('onboarding.add'),
        rows: onboarding,
        auditKey: 'onboarding',
        rowName: (r) => String(r.titleEn),
        orderKey: 'order',
        blank: { order: 0, titleEn: '', titleAr: '', bodyEn: '', bodyAr: '', imageUrl: '' },
        preview: (row, lang) => <SlidePreview row={row} lang={lang} count={onboarding.length} />,
        fields: [
          { key: 'imageUrl', label: 'f.image', type: 'image' },
          { key: 'title', label: 'f.title', type: 'bilingual' },
          { key: 'body', label: 'f.body', type: 'bilingualArea' },
        ],
        columns: ({ lang }) => [
          { key: 'order', header: '#', cell: (r) => r.order },
          { key: 'image', header: t('col.image'), cell: (r) => <ImagePreview url={String(r.imageUrl)} /> },
          {
            key: 'title',
            header: t('col.title'),
            cell: (r) => <span className="font-medium">{bi(r, 'title', lang)}</span>,
          },
          {
            key: 'body',
            header: t('col.body'),
            cell: (r) => <span className="text-muted-foreground line-clamp-1">{bi(r, 'body', lang)}</span>,
          },
        ],
      }}
    />
  )
}

const banners: Row[] = [
  {
    id: 'b1',
    disclosureEn: 'ADVERTISEMENT · PITCH LAB',
    disclosureAr: 'إعلان · بيتش لاب',
    headlineEn: 'Put in the work. Own the game.',
    headlineAr: 'اعمل بجد. واملك اللعبة.',
    detailsEn: 'Small-group football camps · Dubai',
    detailsAr: 'معسكرات كرة قدم لمجموعات صغيرة · دبي',
    imageUrl: trainingCampImg,
    order: 1,
    target: 'url',
    targetValue: 'https://pitchlab.example',
    active: true,
    views: 4210,
    taps: 318,
  },
  {
    id: 'b2',
    disclosureEn: 'FEATURED SPORT',
    disclosureAr: 'رياضة مميزة',
    headlineEn: 'Football scouting season',
    headlineAr: 'موسم اكتشاف كرة القدم',
    detailsEn: 'Browse top players now.',
    detailsAr: 'تصفح أفضل اللاعبين الآن.',
    imageUrl: matchImg,
    order: 2,
    target: 'sport',
    targetValue: 'football',
    active: true,
    views: 3880,
    taps: 402,
  },
]

/** Preview of a Home-screen banner: photo with a dark fade, small label, big headline and a line of detail. */
function BannerPreview({ row, lang, count }: { row: Row; lang: string; count: number }) {
  const url = String(row.imageUrl)
  const hasImage = url.startsWith('blob:') || url.startsWith('http') || url.startsWith('data:') || url.startsWith('/')
  return (
    <div
      className="relative aspect-[724/420] w-full overflow-hidden rounded-3xl bg-slate-800 bg-cover bg-center text-white"
      style={hasImage ? { backgroundImage: `url("${url}")` } : undefined}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="relative flex h-full flex-col justify-center p-6">
        <p className="text-xs font-semibold tracking-wide text-blue-200 uppercase">{bi(row, 'disclosure', lang)}</p>
        <h3 className="mt-2 max-w-[60%] text-3xl leading-[1.05] font-bold uppercase">{bi(row, 'headline', lang)}</h3>
        <p className="mt-3 text-sm">{bi(row, 'details', lang)}</p>
      </div>
      <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5" aria-hidden>
        {Array.from({ length: count }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full ${i + 1 === Number(row.order) ? 'w-8 bg-white' : 'w-2.5 bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  )
}

export function BannersPage() {
  const { t } = useTranslation()
  return (
    <CrudPage
      config={{
        title: t('nav.banners'),
        description: t('banners.description'),
        addLabel: t('banners.add'),
        rows: banners,
        auditKey: 'banner',
        rowName: (r) => String(r.headlineEn),
        orderKey: 'order',
        preview: (row, lang) => <BannerPreview row={row} lang={lang} count={banners.length} />,
        blank: {
          disclosureEn: '',
          disclosureAr: '',
          headlineEn: '',
          headlineAr: '',
          detailsEn: '',
          detailsAr: '',
          imageUrl: '',
          order: 0,
          target: 'url',
          targetValue: '',
          active: true,
          views: 0,
          taps: 0,
        },
        fields: [
          { key: 'imageUrl', label: 'f.image', type: 'image' },
          { key: 'disclosure', label: 'f.disclosure', type: 'bilingual' },
          { key: 'headline', label: 'f.headline', type: 'bilingual' },
          { key: 'details', label: 'f.details', type: 'bilingual' },
          {
            key: 'target',
            label: 'f.target',
            type: 'select',
            options: ['profile', 'sport', 'url'].map((v) => ({ value: v, label: t(`banners.target.${v}`) })),
          },
          { key: 'targetValue', label: 'f.targetValue', type: 'text' },
          { key: 'active', label: 'f.active', type: 'checkbox' },
        ],
        columns: ({ lang }) => [
          { key: 'order', header: '#', cell: (r) => r.order },
          { key: 'image', header: t('col.image'), cell: (r) => <ImagePreview url={String(r.imageUrl)} /> },
          {
            key: 'headline',
            header: t('col.title'),
            cell: (r) => <span className="font-medium">{bi(r, 'headline', lang)}</span>,
          },
          { key: 'target', header: t('col.target'), cell: (r) => t(`banners.target.${r.target}`) },
          { key: 'views', header: t('col.views'), cell: (r) => r.views },
          { key: 'taps', header: t('col.taps'), cell: (r) => r.taps },
          { key: 'status', header: t('col.status'), cell: (r) => activeBadge(t, r.active) },
        ],
      }}
    />
  )
}

const sports: Row[] = [
  { id: 's1', nameEn: 'Football', nameAr: 'كرة القدم', iconUrl: footballIcon, order: 1, active: true, profiles: 128 },
  { id: 's2', nameEn: 'Basketball', nameAr: 'كرة السلة', iconUrl: basketballIcon, order: 2, active: true, profiles: 74 },
  { id: 's3', nameEn: 'Volleyball', nameAr: 'الكرة الطائرة', iconUrl: volleyballIcon, order: 3, active: true, profiles: 41 },
  { id: 's4', nameEn: 'Tennis', nameAr: 'التنس', iconUrl: tennisIcon, order: 4, active: true, profiles: 33 },
  { id: 's5', nameEn: 'Cricket', nameAr: 'الكريكيت', iconUrl: cricketIcon, order: 5, active: true, profiles: 19 },
]

/** The Sports screen of the app: a grid of icon tiles. The sport being viewed has a ring around it. */
function SportsPreview({ row, lang }: { row: Row; lang: string }) {
  const { t } = useTranslation()
  const visible = [...sports].filter((r) => r.active).sort((a, b) => Number(a.order) - Number(b.order))
  return (
    <div className="bg-muted/40 mx-auto w-72 rounded-3xl border p-4">
      <h3 className="mb-3 text-center text-base font-bold uppercase">{t('nav.sports')}</h3>
      <div className="grid grid-cols-3 gap-3">
        {visible.map((r) => (
          <div key={r.id} className="flex flex-col items-center gap-1 text-center">
            <span
              className={`bg-card flex aspect-square w-full items-center justify-center rounded-2xl shadow-sm ${r.id === row.id ? 'ring-primary ring-2' : ''}`}
            >
              <ImagePreview url={String(r.iconUrl)} className="size-10 !bg-transparent" />
            </span>
            <span className="text-xs">{bi(r, 'name', lang)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SportsPage() {
  const { t } = useTranslation()
  return (
    <CrudPage
      config={{
        title: t('nav.sports'),
        description: t('sports.description'),
        addLabel: t('sports.add'),
        rows: sports,
        auditKey: 'sport',
        rowName: (r) => String(r.nameEn),
        searchText: (r) => `${r.nameEn} ${r.nameAr}`,
        orderKey: 'order',
        preview: (row, lang) => <SportsPreview row={row} lang={lang} />,
        blank: { nameEn: '', nameAr: '', iconUrl: '', order: 0, active: true, profiles: 0 },
        fields: [
          { key: 'name', label: 'f.name', type: 'bilingual' },
          { key: 'iconUrl', label: 'f.icon', type: 'image', required: false },
          { key: 'active', label: 'f.active', type: 'checkbox' },
        ],
        columns: ({ lang }) => [
          { key: 'order', header: '#', cell: (r) => r.order },
          { key: 'icon', header: t('col.icon'), cell: (r) => <ImagePreview url={String(r.iconUrl)} /> },
          {
            key: 'name',
            header: t('col.name'),
            cell: (r) => <span className="font-medium">{bi(r, 'name', lang)}</span>,
          },
          { key: 'profiles', header: t('col.profiles'), cell: (r) => r.profiles },
          { key: 'status', header: t('col.status'), cell: (r) => activeBadge(t, r.active) },
        ],
      }}
    />
  )
}


/** Pick-list with a bilingual name, display order and an on/off switch. Used by the profile forms in the app. */
function NamedListPage({
  title,
  description,
  addLabel,
  auditKey,
  rows,
}: {
  title: string
  description: string
  addLabel: string
  auditKey: string
  rows: Row[]
}) {
  const { t } = useTranslation()
  return (
    <CrudPage
      config={{
        title,
        description,
        addLabel,
        rows,
        auditKey,
        rowName: (r) => String(r.nameEn),
        searchText: (r) => `${r.nameEn} ${r.nameAr}`,
        orderKey: 'order',
        blank: { nameEn: '', nameAr: '', order: 0, active: true, profiles: 0 },
        fields: [
          { key: 'name', label: 'f.name', type: 'bilingual' },
          { key: 'active', label: 'f.active', type: 'checkbox' },
        ],
        columns: ({ lang }) => [
          { key: 'order', header: '#', cell: (r) => r.order },
          {
            key: 'name',
            header: t('col.name'),
            cell: (r) => <span className="font-medium">{bi(r, 'name', lang)}</span>,
          },
          { key: 'profiles', header: t('col.profiles'), cell: (r) => r.profiles },
          { key: 'status', header: t('col.status'), cell: (r) => activeBadge(t, r.active) },
        ],
      }}
    />
  )
}

const nationalities: Row[] = [
  { id: 'na1', nameEn: 'Kuwaiti', nameAr: 'كويتي', order: 1, active: true, profiles: 96 },
  { id: 'na2', nameEn: 'Emirati', nameAr: 'إماراتي', order: 2, active: true, profiles: 22 },
  { id: 'na3', nameEn: 'Saudi', nameAr: 'سعودي', order: 3, active: true, profiles: 31 },
  { id: 'na4', nameEn: 'Qatari', nameAr: 'قطري', order: 4, active: true, profiles: 18 },
  { id: 'na5', nameEn: 'Bahraini', nameAr: 'بحريني', order: 5, active: true, profiles: 12 },
  { id: 'na6', nameEn: 'Omani', nameAr: 'عماني', order: 6, active: true, profiles: 9 },
  { id: 'na7', nameEn: 'Jordanian', nameAr: 'أردني', order: 7, active: true, profiles: 14 },
  { id: 'na8', nameEn: 'Egyptian', nameAr: 'مصري', order: 8, active: true, profiles: 27 },
]

const specializations: Row[] = [
  { id: 'sp1', nameEn: 'Youth development', nameAr: 'تطوير الناشئين', order: 1, active: true, profiles: 24 },
  { id: 'sp2', nameEn: 'Goalkeeping', nameAr: 'حراسة المرمى', order: 2, active: true, profiles: 11 },
  { id: 'sp3', nameEn: 'Strength & conditioning', nameAr: 'القوة واللياقة البدنية', order: 3, active: true, profiles: 17 },
  { id: 'sp4', nameEn: 'Tactical analysis', nameAr: 'التحليل التكتيكي', order: 4, active: true, profiles: 9 },
  { id: 'sp5', nameEn: 'Fitness', nameAr: 'اللياقة البدنية', order: 5, active: true, profiles: 20 },
  { id: 'sp6', nameEn: 'Technical skills', nameAr: 'المهارات الفنية', order: 6, active: true, profiles: 14 },
]

export function NationalitiesPage() {
  const { t } = useTranslation()
  return (
    <NamedListPage
      title={t('nav.nationalities')}
      description={t('nationalities.description')}
      addLabel={t('nationalities.add')}
      auditKey="nationality"
      rows={nationalities}
    />
  )
}

export function SpecializationsPage() {
  const { t } = useTranslation()
  return (
    <NamedListPage
      title={t('nav.specializations')}
      description={t('specializations.description')}
      addLabel={t('specializations.add')}
      auditKey="specialization"
      rows={specializations}
    />
  )
}

const listTypes = [
  'locations',
  'playerSpecializations',
  'rejectionReasons',
  'reportReasons',
]
const lists: Row[] = [
  { id: 'l4', list: 'locations', itemEn: 'Kuwait', itemAr: 'الكويت' },
  { id: 'l5', list: 'locations', itemEn: 'Dubai, United Arab Emirates', itemAr: 'دبي، الإمارات العربية المتحدة' },
  { id: 'l8', list: 'playerSpecializations', itemEn: 'Attacking midfielder', itemAr: 'لاعب وسط هجومي' },
  { id: 'l9', list: 'playerSpecializations', itemEn: 'Defender', itemAr: 'مدافع' },
  { id: 'l10', list: 'rejectionReasons', itemEn: 'Photo is unclear', itemAr: 'الصورة غير واضحة' },
  { id: 'l11', list: 'rejectionReasons', itemEn: 'Certificate is not valid', itemAr: 'الشهادة غير صالحة' },
  { id: 'l12', list: 'reportReasons', itemEn: 'Fake profile', itemAr: 'ملف مزيف' },
  { id: 'l13', list: 'reportReasons', itemEn: 'Inappropriate photo', itemAr: 'صورة غير لائقة' },
  { id: 'l14', list: 'reportReasons', itemEn: 'Other', itemAr: 'أخرى' },
]

export function ListsPage() {
  const { t } = useTranslation()
  return (
    <CrudPage
      config={{
        title: t('nav.lists'),
        description: t('lists.description'),
        addLabel: t('lists.add'),
        rows: lists,
        auditKey: 'list',
        rowName: (r) => String(r.itemEn),
        searchText: (r) => `${r.itemEn} ${r.itemAr}`,
        filters: [
          {
            key: 'list',
            label: t('filters.allLists'),
            options: listTypes.map((v) => ({ value: v, label: t(`lists.types.${v}`) })),
            value: (r) => String(r.list),
          },
        ],
        blank: { list: 'locations', itemEn: '', itemAr: '' },
        fields: [
          {
            key: 'list',
            label: 'f.list',
            type: 'select',
            options: listTypes.map((v) => ({ value: v, label: t(`lists.types.${v}`) })),
          },
          { key: 'item', label: 'f.item', type: 'bilingual' },
        ],
        columns: ({ lang }) => [
          { key: 'list', header: t('col.list'), cell: (r) => <StatusBadge>{t(`lists.types.${r.list}`)}</StatusBadge> },
          {
            key: 'item',
            header: t('col.name'),
            cell: (r) => <span className="font-medium">{bi(r, 'item', lang)}</span>,
          },
        ],
      }}
    />
  )
}

const cms: Row[] = [
  {
    id: 'g1',
    page: 'terms',
    titleEn: 'Terms & Conditions',
    titleAr: 'الشروط والأحكام',
    bodyEn: '<p>By using Scout you agree to…</p>',
    bodyAr: '<p>باستخدامك لسكاوت فإنك توافق على…</p>',
    updated: '2026-11-02',
  },
  {
    id: 'g2',
    page: 'privacy',
    titleEn: 'Privacy Policy',
    titleAr: 'سياسة الخصوصية',
    bodyEn: '<p>We collect only what we need…</p>',
    bodyAr: '<p>نجمع فقط ما نحتاجه…</p>',
    updated: '2026-11-02',
  },
  {
    id: 'g3',
    page: 'about',
    titleEn: 'About Scout',
    titleAr: 'عن سكاوت',
    bodyEn: '<p>Scout connects athletes and trainers.</p>',
    bodyAr: '<p>سكاوت تربط الرياضيين بالمدربين.</p>',
    updated: '2026-10-20',
  },
]

export function CmsPage() {
  const { t } = useTranslation()
  return (
    <CrudPage
      config={{
        title: t('nav.cms'),
        description: t('cms.description'),
        addLabel: t('cms.add'),
        rows: cms,
        auditKey: 'cms',
        rowName: (r) => String(r.titleEn),
        blank: { page: 'about', titleEn: '', titleAr: '', bodyEn: '', bodyAr: '', updated: '' },
        canDelete: false,
        fields: [
          {
            key: 'page',
            label: 'f.page',
            type: 'select',
            options: ['terms', 'privacy', 'about'].map((v) => ({ value: v, label: t(`cms.pages.${v}`) })),
          },
          { key: 'title', label: 'f.title', type: 'bilingual' },
          { key: 'body', label: 'f.body', type: 'bilingualRich' },
        ],
        columns: ({ lang }) => [
          { key: 'page', header: t('col.page'), cell: (r) => t(`cms.pages.${r.page}`) },
          {
            key: 'title',
            header: t('col.title'),
            cell: (r) => <span className="font-medium">{bi(r, 'title', lang)}</span>,
          },
          { key: 'updated', header: t('col.updated'), cell: (r) => r.updated },
        ],
      }}
    />
  )
}

const faq: Row[] = [
  {
    id: 'q1',
    order: 1,
    questionEn: 'How do I go live?',
    questionAr: 'كيف أظهر للجميع؟',
    answerEn: 'Submit your profile, wait for approval, then subscribe.',
    answerAr: 'أرسل ملفك وانتظر الموافقة ثم اشترك.',
  },
  {
    id: 'q2',
    order: 2,
    questionEn: 'Can I change my plan?',
    questionAr: 'هل يمكنني تغيير الباقة؟',
    answerEn: 'Renew with any plan when your membership ends.',
    answerAr: 'جدد بأي باقة عند انتهاء عضويتك.',
  },
  {
    id: 'q3',
    order: 3,
    questionEn: 'How do I contact support?',
    questionAr: 'كيف أتواصل مع الدعم؟',
    answerEn: 'Use Contact us in your account.',
    answerAr: 'استخدم تواصل معنا من حسابك.',
  },
]

export function FaqPage() {
  const { t } = useTranslation()
  return (
    <CrudPage
      config={{
        title: t('nav.faq'),
        description: t('faq.description'),
        addLabel: t('faq.add'),
        rows: faq,
        auditKey: 'faq',
        rowName: (r) => String(r.questionEn),
        searchText: (r) => `${r.questionEn} ${r.questionAr}`,
        blank: { order: 4, questionEn: '', questionAr: '', answerEn: '', answerAr: '' },
        fields: [
          { key: 'order', label: 'f.order', type: 'number' },
          { key: 'question', label: 'f.question', type: 'bilingual' },
          { key: 'answer', label: 'f.answer', type: 'bilingualArea' },
        ],
        columns: ({ lang }) => [
          { key: 'order', header: '#', cell: (r) => r.order },
          {
            key: 'q',
            header: t('col.question'),
            cell: (r) => <span className="font-medium">{bi(r, 'question', lang)}</span>,
          },
          {
            key: 'a',
            header: t('col.answer'),
            cell: (r) => <span className="text-muted-foreground line-clamp-1">{bi(r, 'answer', lang)}</span>,
          },
        ],
      }}
    />
  )
}

const broadcasts: Row[] = [
  {
    id: 'n1',
    audience: 'all',
    titleEn: 'Welcome to Scout',
    titleAr: 'مرحبًا بك في سكاوت',
    bodyEn: 'Complete your profile to get discovered.',
    bodyAr: 'أكمل ملفك ليراك الجميع.',
    scheduleAt: '',
    status: 'sent',
  },
  {
    id: 'n2',
    audience: 'trainers',
    titleEn: 'New filters',
    titleAr: 'فلاتر جديدة',
    bodyEn: 'Players can now filter by experience.',
    bodyAr: 'يمكن للاعبين التصفية حسب الخبرة.',
    scheduleAt: '2026-12-01',
    status: 'scheduled',
  },
]

const autoNotifications = [
  'profileApproved',
  'profileRejected',
  'reelReviewed',
  'renewal',
  'membershipEnded',
  'expiryReminder',
  'featuredEnded',
]

export function NotificationsPage() {
  const { t } = useTranslation()
  return (
    <CrudPage
      config={{
        title: t('nav.notifications'),
        description: t('notifications.description'),
        addLabel: t('notifications.add'),
        rows: broadcasts,
        auditKey: 'broadcast',
        rowName: (r) => String(r.titleEn),
        blank: {
          audience: 'all',
          titleEn: '',
          titleAr: '',
          bodyEn: '',
          bodyAr: '',
          scheduleAt: '',
          status: 'scheduled',
        },
        canDelete: false,
        fields: [
          {
            key: 'audience',
            label: 'f.audience',
            type: 'select',
            options: ['all', 'players', 'trainers', 'featured'].map((v) => ({
              value: v,
              label: t(`notifications.audience.${v}`),
            })),
          },
          { key: 'title', label: 'f.title', type: 'bilingual' },
          { key: 'body', label: 'f.body', type: 'bilingualArea' },
          { key: 'scheduleAt', label: 'f.scheduleAt', type: 'date', required: false },
        ],
        header: (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>{t('notifications.autoTitle')}</CardTitle>
              <CardDescription>{t('notifications.autoBody')}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {autoNotifications.map((k) => (
                <StatusBadge key={k} tone="info">
                  {t(`notifications.auto.${k}`)}
                </StatusBadge>
              ))}
            </CardContent>
          </Card>
        ),
        columns: ({ lang, setRow }) => [
          {
            key: 'title',
            header: t('col.title'),
            cell: (r) => <span className="font-medium">{bi(r, 'title', lang)}</span>,
          },
          { key: 'audience', header: t('col.audience'), cell: (r) => t(`notifications.audience.${r.audience}`) },
          {
            key: 'when',
            header: t('col.when'),
            cell: (r) => (r.scheduleAt ? String(r.scheduleAt) : t('notifications.immediately')),
          },
          {
            key: 'status',
            header: t('col.status'),
            cell: (r) =>
              r.status === 'sent' ? (
                <StatusBadge tone="success">{t('status.sent')}</StatusBadge>
              ) : (
                <div className="flex items-center gap-2">
                  <StatusBadge tone="warning">{t('status.scheduled')}</StatusBadge>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => {
                      setRow(r.id, { status: 'sent' })
                      toast.success(t('notifications.sentToast'))
                    }}
                  >
                    <Send data-icon="inline-start" />
                    {t('notifications.sendNow')}
                  </Button>
                </div>
              ),
          },
        ],
      }}
    />
  )
}
