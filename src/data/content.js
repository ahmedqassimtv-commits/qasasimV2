// ===== كل محتوى الموقع هنا — عدّل النصوص والصور فقط من هذا الملف =====
// الصور المؤقتة من picsum تحتاج إنترنت؛ ضع صورك في public/images واكتب المسار مثل '/images/x.jpg'
const ph = (seed, w = 900, h = 1100) => `https://picsum.photos/seed/qz-${seed}/${w}/${h}`

export const site = {
  first: 'AHMED',
  last: 'QASSIM',
  nameAr: 'أحمد قاسم',
  since: 'قاسمز منذ 2019',
  email: 'business@qassimz.com',
  youtube: 'https://www.youtube.com/@YOUR_CHANNEL', // ← حط لينك قناتك هنا
  loadLabel: 'LOAD QASSIM',
  tagline: ['دايماً', 'في الملعب.'], // السطر الأخير في الفوتر
}

export const hero = {
  imageA: '/images/hero-1.webp', // الصورة الأساسية (مقصوصة بدون خلفية)
  imageB: '/images/hero-2.webp', // بالنظارة والكاب (تنكشف مع الماوس)
  next: { label: 'أحدث فيديو', title: 'قاسمز', sub: 'شاهد الآن' },
  // سطرا الـ marquee خلف الصورة بعد التمرير
  marqueeTop: 'كل حلقة بنعملها كأنها الأولى — ',
  marqueeBottom: 'والحكاية لسه مكمّلة وعندنا كتير نقوله — ',
  messageEyebrow: 'رسالة من أحمد',
}

export const nav = [
  { label: 'الرئيسية', href: '#' },
  { label: 'على الهواء', href: '#on-air' },
  { label: 'خلف الكواليس', href: '#backstage' },
  { label: 'الفيديوهات', href: '#videos' },
  { label: 'الأرشيف', href: '#episodes' },
]

export const socials = [
  { label: 'TikTok', href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'YouTube', href: 'https://www.youtube.com/@YOUR_CHANNEL' },
  { label: 'X', href: '#' },
]

// الكلمات بين [[ ]] تظهر بالخط الثاني وباللون الليموني
export const message =
  '[[نكسر]] الحدود، ونقاتل على كل [[حلقة]]، ونقدّم كل حاجة بكل الطرق. ونبني [[إرث]] في المحتوى العربي على الشاشة وبرّاها.'

export const track = {
  quote: { before: 'مش مهم انت ', b1: 'بدأت منين', mid: '، المهم ', b2: 'هتوصل لفين', after: ' بعدها.' },
  items: [
    { cap: 'القاهرة، 2024', src: ph('g0', 700, 860), size: 's', y: 6 },
    { cap: 'حفل الجوائز، 2024', src: ph('g1', 800, 800), size: 's', y: 52, mute: true },
    { cap: 'QUOTE' },
    { cap: 'الرياض، 2024', src: ph('g2', 1000, 900), size: 'l', y: 30 },
    { cap: 'دبي، 2023', src: ph('g3', 600, 760), size: 's', y: 4, mute: true },
    { cap: 'الحلقة 1، 2019', src: ph('g4', 900, 1100), size: 'm', y: 40, win: true },
    { cap: 'جدة، 2024', src: ph('g5', 800, 1000), size: 's', y: 10 },
    { cap: 'استوديو قاسمز', src: ph('g6', 1100, 800), size: 'l', y: 48, mute: true },
    { cap: 'الإسكندرية، 2022', src: ph('g7', 700, 900), size: 's', y: 8 },
    { cap: 'لندن، 2024', src: ph('g8', 900, 1000), size: 'm', y: 36 },
  ],
}

export const onoff = [
  {
    id: 'on-air', top: 'على', bottom: 'الهواء', script: 'على',
    text: 'أحدث الفيديوهات، أرقام القناة، وصور من الاستوديو.',
    side: ph('side-a', 700, 1100),
  },
  {
    id: 'backstage', top: 'خلف', bottom: 'الكواليس', script: 'خلف',
    text: 'تصوير، حملات، وكل اللي بيحصل قبل وبعد الكاميرا.',
    side: ph('side-b', 700, 1100),
  },
]

export const hall = {
  eyebrow: 'الأرشيف',
  title: ['أشهر', 'الحلقات'],
  intro: 'من أول حلقة لحد النهارده — كل حلقة مميزة ليها حكاية وشكل مختلف.',
  feats: [ph('f0', 800, 1000), ph('f1', 800, 1000), ph('f2', 800, 1000)],
  items: [
    'الموسم 2025', 'ديسكو', 'الجليتر', 'البورسلين', 'اليابان', 'GIF', 'الموسم 2024',
    'الوضع الداكن', 'السباق', 'لاس فيجاس', 'كروم', 'الشاطئ', 'السلة', 'الموسم 2021',
    'سيلفرستون', 'الموسم 2019',
  ].map((name, i) => ({ name, year: 2025 - Math.floor(i / 3), img: ph('h' + i, 700, 600), alt: ph('hh' + i, 700, 600) })),
}

// أحدث الفيديوهات: حط الـ id بتاع كل فيديو من لينك يوتيوب (youtube.com/watch?v=ID)
// لو الـ id فاضي هتظهر صورة مؤقتة
export const videos = {
  eyebrow: 'على يوتيوب',
  title: ['أحدث', 'الفيديوهات'],
  text: 'كل أسبوع فيديو جديد — اشترك وفعّل الجرس عشان يوصلك أول ما ينزل.',
  stats: [
    { value: 250, suffix: 'K+', label: 'مشترك' },
    { value: 12, suffix: 'M+', label: 'مشاهدة' },
    { value: 180, suffix: '+', label: 'فيديو' },
  ],
  items: [
    { id: '', title: 'عنوان الفيديو الأول', meta: 'منذ يومين' },
    { id: '', title: 'عنوان الفيديو التاني', meta: 'منذ أسبوع' },
    { id: '', title: 'عنوان الفيديو التالت', meta: 'منذ أسبوعين' },
    { id: '', title: 'عنوان الفيديو الرابع', meta: 'منذ شهر' },
    { id: '', title: 'عنوان الفيديو الخامس', meta: 'منذ شهر' },
  ].map((v, i) => ({ ...v, thumb: v.id ? `https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg` : ph('v' + i, 1280, 720) })),
}

export const partners = {
  title: ['الشركاء', '& الرعاة'],
  text: 'فخورين نشتغل مع براندات بتشاركنا نفس الشغف بالمحتوى والتأثير.',
  logos: ['NORTHWIND', 'VELOCITY', 'AURORA', 'QUADRANT', 'MONOLITH', 'HALCYON', 'ORBITAL', 'KESTREL', 'PRISM', 'ATLAS', 'NOVA', 'ZENITH'],
}

export const posts = [0, 1, 2, 3, 4, 5, 6].map((i) => ph('s' + i, 700, 1000))
