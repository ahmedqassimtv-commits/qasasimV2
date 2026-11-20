// ===== كل محتوى الموقع هنا — عدّل النصوص والصور فقط من هذا الملف =====
// كل الروابط والصور هنا حقيقية ومتأكد منها (نوفمبر 2026):
// - فيديو قناة @AhmedQassimTV الوحيد المنشور، والمراجعات والحكايات من موقع قاسمز.
// - مفيش صور عشوائية (picsum) ولا أسماء شركاء وهمية.
// asset(): يضيف مسار النشر (مهم على GitHub Pages لأن الموقع بيبقى تحت /qasasimv2/)
export const asset = (path) => import.meta.env.BASE_URL + path.replace(/^\//, '')

// صور الحكايات التاريخية (Unsplash — نفس الصور المنشورة على موقع قاسمز)
const storyCairo = 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1400&q=80'
const storyAlex = 'https://images.unsplash.com/photo-1539768942893-daf53e448371?auto=format&fit=crop&w=1400&q=80'
const storyLuxor = 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1400&q=80'
const channelVideos = 'https://www.youtube.com/@AhmedQassimTV/videos'

export const site = {
  first: 'AHMED',
  last: 'QASSIM',
  nameAr: 'أحمد قاسم',
  since: 'قاسمز منذ 2019',
  email: 'business@qassimz.com',
  youtube: 'https://www.youtube.com/@AhmedQassimTV',
  loadLabel: 'LOAD QASSIM',
  tagline: ['دايماً', 'في الملعب.'], // السطر الأخير في الفوتر
}

export const hero = {
  imageA: asset('images/hero-1.webp'), // الصورة الأساسية (مقصوصة بدون خلفية)
  imageB: asset('images/hero-2.webp'), // بالنظارة والكاب (تنكشف مع الماوس — ديسكتوب بس)
  next: { label: 'أحدث فيديو', title: 'قاسمز', sub: 'شاهد الآن', href: 'https://www.youtube.com/watch?v=uj4KDGhHPhw' },
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
  { label: 'YouTube', href: 'https://www.youtube.com/@AhmedQassimTV' },
  { label: 'X', href: 'https://x.com/ahmedqassimtv' },
  { label: 'Facebook', href: 'https://www.facebook.com/AhmedQassimTV' },
]

// الكلمات بين [[ ]] تظهر بالخط الثاني وباللون الليموني
export const message =
  '[[نكسر]] الحدود، ونقاتل على كل [[حلقة]]، ونقدّم كل حاجة بكل الطرق. ونبني [[إرث]] في المحتوى العربي على الشاشة وبرّاها.'

export const track = {
  quote: { before: 'مش مهم انت ', b1: 'بدأت منين', mid: '، المهم ', b2: 'هتوصل لفين', after: ' بعدها.' },
  items: [
    { cap: 'القاهرة — وسط البلد · 1932', src: storyCairo, size: 'm', y: 6 },
    { cap: 'الإسكندرية — الكورنيش · 1954', src: storyAlex, size: 'l', y: 40 },
    { cap: 'QUOTE' },
    { cap: 'الأقصر — الضفة الغربية · 1968', src: storyLuxor, size: 'm', y: 20 },
  ],
}

export const onoff = [
  {
    id: 'on-air', top: 'على', bottom: 'الهواء', script: 'على',
    text: 'أحدث الفيديوهات، أرقام القناة، وصور من الاستوديو.',
    side: storyCairo,
  },
  {
    id: 'backstage', top: 'خلف', bottom: 'الكواليس', script: 'خلف',
    text: 'تصوير، حملات، وكل اللي بيحصل قبل وبعد الكاميرا.',
    side: storyLuxor,
  },
]

export const hall = {
  eyebrow: 'الأرشيف',
  title: ['أشهر', 'الأعمال'],
  intro: 'حكايات تاريخية ومراجعات سينمائية — من أرشيف قاسمز الحقيقي.',
  feats: [storyCairo, storyAlex, storyLuxor],
  items: [
    { name: 'صباحٌ هادئ قبل ازدحام الترام', year: 1932, img: storyCairo, alt: storyAlex },
    { name: 'ذاكرة البحر والضباب الشتوي', year: 1954, img: storyAlex, alt: storyLuxor },
    { name: 'حوار الحجر والضوء', year: 1968, img: storyLuxor, alt: storyCairo },
    // المراجعات: الصورة هي التريلر الرسمي للفيلم (المراجعة نفسها مكتوبة على موقع قاسمز)
    { name: 'الوصول', year: 2025, img: 'https://i.ytimg.com/vi/tFMo3UJ4B4g/maxresdefault.jpg', alt: 'https://i.ytimg.com/vi/tFMo3UJ4B4g/maxresdefault.jpg' },
    { name: 'كثيب: الجزء الثاني', year: 2025, img: 'https://i.ytimg.com/vi/Way9Dexny3w/maxresdefault.jpg', alt: 'https://i.ytimg.com/vi/Way9Dexny3w/maxresdefault.jpg' },
  ],
}

// أحدث الفيديوهات: الفيديو الوحيد المنشور على القناة حتى الآن (25 أكتوبر 2026).
// لما ينزل فيديو جديد، ضيفه هنا بنفس الشكل — الـ id من لينك يوتيوب (youtube.com/watch?v=ID)
export const videos = {
  eyebrow: 'على يوتيوب',
  title: ['أحدث', 'الفيديوهات'],
  text: 'كل جمعة حلقة جديدة من برنامج قاسمز الساعة 7 مساءً — اشترك وفعّل الجرس عشان يوصلك أول ما ينزل.',
  items: [
    { id: 'uj4KDGhHPhw', title: 'قاسمز | كيف بدأت فكرة الذكاء الاصطناعي؟!', meta: '25 أكتوبر 2026 · 287 مشاهدة' },
  ].map((v) => ({ ...v, thumb: `https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg` })),
}

// كروت السوشيال: صور حقيقية (فيديو القناة + تريلرات المراجعات + صور الحكايات)
export const posts = [
  { src: 'https://i.ytimg.com/vi/uj4KDGhHPhw/maxresdefault.jpg', href: 'https://www.youtube.com/watch?v=uj4KDGhHPhw' },
  { src: 'https://i.ytimg.com/vi/tFMo3UJ4B4g/maxresdefault.jpg', href: 'https://www.youtube.com/watch?v=tFMo3UJ4B4g' },
  { src: 'https://i.ytimg.com/vi/Way9Dexny3w/maxresdefault.jpg', href: 'https://www.youtube.com/watch?v=Way9Dexny3w' },
  { src: storyCairo, href: 'https://ahmedqassimtv-commits.github.io/qassimz-platform/stories' },
  { src: storyAlex, href: 'https://ahmedqassimtv-commits.github.io/qassimz-platform/stories' },
  { src: storyLuxor, href: 'https://ahmedqassimtv-commits.github.io/qassimz-platform/stories' },
]

export const channelVideosUrl = channelVideos
