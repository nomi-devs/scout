import { Send } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CrudPage, ImagePreview, type Row } from '@/features/shared/crud-page'
import { bi } from '@/features/shared/helpers'

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
    active: true,
  },
  {
    id: 'o2',
    order: 2,
    titleEn: 'Find the right trainer',
    titleAr: 'ابحث عن المدرب المناسب',
    bodyEn: 'Filter by sport, location and experience.',
    bodyAr: 'صفِّ حسب الرياضة والموقع والخبرة.',
    active: true,
  },
  {
    id: 'o3',
    order: 3,
    titleEn: 'Go live in minutes',
    titleAr: 'انطلق خلال دقائق',
    bodyEn: 'Submit for review, subscribe, and you are live.',
    bodyAr: 'أرسل للمراجعة واشترك لتظهر للجميع.',
    active: true,
  },
]

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
        blank: { order: 4, titleEn: '', titleAr: '', bodyEn: '', bodyAr: '', active: true },
        fields: [
          { key: 'order', label: 'f.order', type: 'number' },
          { key: 'title', label: 'f.title', type: 'bilingual' },
          { key: 'body', label: 'f.body', type: 'bilingualArea' },
          { key: 'active', label: 'f.active', type: 'checkbox' },
        ],
        columns: ({ lang }) => [
          { key: 'order', header: '#', cell: (r) => r.order },
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
          { key: 'status', header: t('col.status'), cell: (r) => activeBadge(t, r.active) },
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
    headlineEn: 'Train like a pro',
    headlineAr: 'تدرّب كالمحترفين',
    detailsEn: '20% off the first month.',
    detailsAr: 'خصم 20% على الشهر الأول.',
    imageUrl: 'pitch-lab.jpg',
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
    imageUrl: 'football.jpg',
    order: 2,
    target: 'sport',
    targetValue: 'football',
    active: true,
    views: 3880,
    taps: 402,
  },
]

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
  { id: 's1', nameEn: 'Football', nameAr: 'كرة القدم', iconUrl: '', order: 1, active: true, profiles: 128 },
  { id: 's2', nameEn: 'Basketball', nameAr: 'كرة السلة', iconUrl: '', order: 2, active: true, profiles: 74 },
  { id: 's3', nameEn: 'Volleyball', nameAr: 'الكرة الطائرة', iconUrl: '', order: 3, active: true, profiles: 41 },
  { id: 's4', nameEn: 'Tennis', nameAr: 'التنس', iconUrl: '', order: 4, active: true, profiles: 33 },
  { id: 's5', nameEn: 'Cricket', nameAr: 'الكريكيت', iconUrl: '', order: 5, active: true, profiles: 19 },
]

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

const listTypes = [
  'nationalities',
  'locations',
  'trainerSpecializations',
  'playerSpecializations',
  'rejectionReasons',
  'reportReasons',
]
const lists: Row[] = [
  { id: 'l1', list: 'nationalities', itemEn: 'Kuwaiti', itemAr: 'كويتي' },
  { id: 'l2', list: 'nationalities', itemEn: 'Emirati', itemAr: 'إماراتي' },
  { id: 'l3', list: 'nationalities', itemEn: 'Saudi', itemAr: 'سعودي' },
  { id: 'l4', list: 'locations', itemEn: 'Kuwait', itemAr: 'الكويت' },
  { id: 'l5', list: 'locations', itemEn: 'Dubai, United Arab Emirates', itemAr: 'دبي، الإمارات العربية المتحدة' },
  { id: 'l6', list: 'trainerSpecializations', itemEn: 'Youth development', itemAr: 'تطوير الناشئين' },
  { id: 'l7', list: 'trainerSpecializations', itemEn: 'Goalkeeping', itemAr: 'حراسة المرمى' },
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
        blank: { list: 'nationalities', itemEn: '', itemAr: '' },
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
    bodyEn: 'By using Scout you agree to…',
    bodyAr: 'باستخدامك لسكاوت فإنك توافق على…',
    updated: '2026-11-02',
  },
  {
    id: 'g2',
    page: 'privacy',
    titleEn: 'Privacy Policy',
    titleAr: 'سياسة الخصوصية',
    bodyEn: 'We collect only what we need…',
    bodyAr: 'نجمع فقط ما نحتاجه…',
    updated: '2026-11-02',
  },
  {
    id: 'g3',
    page: 'about',
    titleEn: 'About Scout',
    titleAr: 'عن سكاوت',
    bodyEn: 'Scout connects athletes and trainers.',
    bodyAr: 'سكاوت تربط الرياضيين بالمدربين.',
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
          { key: 'body', label: 'f.body', type: 'bilingualArea' },
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
