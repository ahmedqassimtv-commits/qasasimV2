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
const platform = 'https://ahmedqassimtv-commits.github.io/qassimz-platform'

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
  { label: 'المقالات', href: '#articles' },
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
  // الاقتباس التاني بيظهر بمسحة قلم تحديد ليموني (Highlighter wipe)
  quote2: 'كل فيديو خطوة، والجمهور هو اللي بيكمّل الحكاية.',
  quote: { before: 'مش مهم انت ', b1: 'بدأت منين', mid: '، المهم ', b2: 'هتوصل لفين', after: ' بعدها.' },
  items: [
    { cap: 'القاهرة — وسط البلد · 1932', src: storyCairo, size: 'm', y: 6 },
    { cap: 'الإسكندرية — الكورنيش · 1954', src: storyAlex, size: 'l', y: 40 },
    { cap: 'QUOTE' },
    { cap: 'الأقصر — الضفة الغربية · 1968', src: storyLuxor, size: 'm', y: 20 },
    { cap: 'QUOTE2' },
  ],
}

export const onoff = [
  // side: صور البروفايل الجانبية المقصوصة (وش في وش)
  // side-1 (بدون كاب، باصص شمال) على الحافة اليمين — side-2 (بالكاب والنظارة، باصص يمين) على الحافة الشمال
  {
    id: 'on-air', top: 'على', bottom: 'الهواء', script: 'على',
    text: 'أحدث الفيديوهات، أرقام القناة، وصور من الاستوديو.',
    side: asset('images/side-1.webp'), flip: false,
  },
  {
    id: 'backstage', top: 'خلف', bottom: 'الكواليس', script: 'خلف',
    text: 'تصوير، حملات، وكل اللي بيحصل قبل وبعد الكاميرا.',
    side: asset('images/side-2.webp'), flip: false,
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

// ===== الشورتس (فيديوهات قصيرة بالطول) — بتتعرض كمروحة كروت في قسم «إيه الجديد» =====
// حط الـ id من لينك الشورت: youtube.com/shorts/ID — الصورة بتتجاب أوتوماتيك
// (لحد ما تضيف شورتس، الكروت بتعرض صور مؤقتة من محتوى القناة)
const shortsIds = [
  // { id: 'XXXXXXXXXXX', title: 'عنوان الشورت' },
]
const shortsFallback = [
  'https://i.ytimg.com/vi/uj4KDGhHPhw/maxresdefault.jpg',
  'https://i.ytimg.com/vi/tFMo3UJ4B4g/maxresdefault.jpg',
  storyCairo,
  'https://i.ytimg.com/vi/Way9Dexny3w/maxresdefault.jpg',
  storyAlex,
  'https://i.ytimg.com/vi/nJ1yQn17lbE/maxresdefault.jpg',
  storyLuxor,
]
export const shorts = shortsIds.length
  ? shortsIds.map((s) => ({ ...s, thumb: `https://i.ytimg.com/vi/${s.id}/oar2.jpg`, href: `https://www.youtube.com/shorts/${s.id}` }))
  : shortsFallback.map((src) => ({ id: '', title: '', thumb: src, href: 'https://www.youtube.com/@AhmedQassimTV/shorts' }))

export const channelVideosUrl = channelVideos

// ===== المقالات: محتوى حقيقي من منصة قاسمز (مقال + مراجعات + حكايات) =====
// img: null ← كارت نصي من غير صورة
export const articles = {
  eyebrow: 'من منصة قاسمز',
  title: ['أحدث', 'المقالات'],
  intro: 'مقالات، مراجعات سينمائية، وحكايات من مختلف الأبعاد.',
  all: platform + '/articles',
  items: [
    {
      kind: 'مقال', category: 'الصورة والسينما', date: '20 فبراير 2025',
      title: 'حين تصبح اللقطة حكاية',
      excerpt: 'تأملات بسيطة في التفاصيل التي تجعل الصورة قادرة على أن تحكي أكثر مما نرى.',
      img: null, href: platform + '/articles/hin-tasbih-allqta-hikaya',
    },
    {
      kind: 'مراجعة', category: 'فيلم · 9/10', date: '5 فبراير 2025',
      title: 'الوصول',
      excerpt: 'عمل خيال علمي إنساني يثق في صمت الصورة بقدر ثقته في الحوار.',
      img: 'https://i.ytimg.com/vi/tFMo3UJ4B4g/maxresdefault.jpg', href: platform + '/verdict',
    },
    {
      kind: 'مراجعة', category: 'فيلم · 8.5/10', date: '18 يناير 2025',
      title: 'كثيب: الجزء الثاني',
      excerpt: 'ملحمة ضخمة التفاصيل، تتألق حين تترك للصورة والموسيقى مساحة للتنفس.',
      img: 'https://i.ytimg.com/vi/Way9Dexny3w/maxresdefault.jpg', href: platform + '/verdict',
    },
    {
      kind: 'مراجعة', category: 'مسلسل · 8/10', date: '30 ديسمبر 2024',
      title: 'ساموراي العين الزرقاء',
      excerpt: 'أسلوب بصري جريء وشخصية رئيسية تحمل حكاية تتجاوز حدود الانتقام.',
      img: 'https://i.ytimg.com/vi/nJ1yQn17lbE/maxresdefault.jpg', href: platform + '/verdict',
    },
    {
      kind: 'حكاية', category: 'القاهرة — وسط البلد · 1932', date: 'ثلاثينيات القرن العشرين',
      title: 'صباحٌ هادئ قبل ازدحام الترام',
      excerpt: 'لقطة توثّق سكون الشوارع مع أول خيوط الفجر، حيث كانت الواجهات الحجرية تحفظ إيقاع المدينة البطيء.',
      img: storyCairo, href: platform + '/stories',
    },
    {
      kind: 'حكاية', category: 'الإسكندرية — الكورنيش · 1954', date: 'خمسينيات القرن العشرين',
      title: 'ذاكرة البحر والضباب الشتوي',
      excerpt: 'عندما يلتقي موج المتوسط مع أرصفة الميناء العتيقة في صباح شتوي غائم.',
      img: storyAlex, href: platform + '/stories',
    },
  ],
}
