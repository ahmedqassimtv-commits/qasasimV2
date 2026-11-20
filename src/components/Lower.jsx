import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { videos, posts, socials, nav, site, asset } from '../data/content'
import { marquee } from '../lib/marquee'
import { scroll } from '../hooks/useLenis'
import { Btn, LogoMark, NameLockup, Roll, PlayIcon } from './Bits'

/* ================= أحدث الفيديوهات (يوتيوب) ================= */
export function Videos() {
  const root = useRef(null)
  const [playing, setPlaying] = useState(null)

  useGSAP(() => {
    // المروحة ديسكتوب بس — على الموبايل الكروت صف تمرير أفقي ثابت
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px)', () => {
      const cards = gsap.utils.toArray('.vd__card')
      const mid = (cards.length - 1) / 2
      // الكروت متكوّمة في النص وبتتفرد زي المروحة مع التمرير
      gsap.fromTo(cards,
        { rotate: (i) => (i - mid) * 2, xPercent: (i) => (mid - i) * 70, y: 80 },
        {
          rotate: (i) => (i - mid) * 6, xPercent: 0, y: (i) => Math.abs(i - mid) ** 1.5 * 26, ease: 'none',
          scrollTrigger: { trigger: '.vd__fan', start: 'top 95%', end: 'center 45%', scrub: 1 },
        })
    })
  }, { scope: root })

  useEffect(() => {
    if (playing) scroll.lenis?.stop(); else scroll.lenis?.start()
    const esc = (e) => e.key === 'Escape' && setPlaying(null)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [playing])

  const open = (v) => (e) => {
    if (!v.id) return // لسه مفيش id — اللينك هيروح للقناة
    e.preventDefault(); setPlaying(v)
  }

  return (
    <section className="vd topo topo--dark" id="videos" ref={root} data-nav="dark">
      <p className="eyebrow eyebrow--lime" data-hl>{videos.eyebrow}</p>
      <h3 className="vd__title" data-hl><span>{videos.title[0]}</span><span className="serif">{videos.title[1]}</span></h3>
      <p className="vd__text" data-hl>{videos.text}</p>
      <Btn href={`${site.youtube}?sub_confirmation=1`} icon={<PlayIcon />} target="_blank" rel="noreferrer">اشترك في القناة</Btn>
      <div className="vd__fan">
        {videos.items.map((v, i) => (
          <a key={i} className="vd__card" href={v.id ? `https://www.youtube.com/watch?v=${v.id}` : site.youtube}
            target="_blank" rel="noreferrer" onClick={open(v)} style={{ zIndex: 10 - Math.abs(i - 2) }}>
            <div className="vd__thumb"><img src={v.thumb} alt={v.title} loading="lazy" /><span className="vd__play"><PlayIcon /></span></div>
            <div className="vd__info"><b>{v.title}</b><span>{v.meta}</span></div>
          </a>
        ))}
      </div>
      {playing && (
        <div className="vd__modal" onClick={() => setPlaying(null)}>
          <div className="vd__player" onClick={(e) => e.stopPropagation()}>
            <iframe src={`https://www.youtube-nocookie.com/embed/${playing.id}?autoplay=1&rel=0`} title={playing.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
          </div>
          <button className="vd__close" aria-label="إغلاق">×</button>
        </div>
      )}
    </section>
  )
}

/* ================= السوشيال: كروت مروحة ================= */
export function Socials() {
  const root = useRef(null)
  useGSAP(() => {
    // المروحة ديسكتوب بس — على الموبايل الكروت صف تمرير أفقي ثابت
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px)', () => {
      const cards = gsap.utils.toArray('.so__card')
      const mid = (cards.length - 1) / 2
      gsap.fromTo(cards,
        { xPercent: 0, rotate: (i) => (i - mid) * 2, y: 80 },
        {
          xPercent: (i) => (i - mid) * 58, rotate: (i) => (i - mid) * 9, y: (i) => Math.abs(i - mid) ** 1.6 * 22, ease: 'none',
          scrollTrigger: { trigger: '.so__fan', start: 'top 90%', end: 'center 50%', scrub: 1 },
        })
    })
  }, { scope: root })
  return (
    <section className="so topo topo--light" ref={root} data-nav="light">
      <h3 className="so__title" data-hl><span>إيه الجديد</span><span className="serif">على السوشيال</span></h3>
      <div className="so__fan">
        {posts.map((p, i) => (
          <a href={p.href} className="so__card" key={i} style={{ zIndex: 10 - Math.abs(i - 3) }} target="_blank" rel="noreferrer">
            <img src={p.src} alt="" loading="lazy" />
          </a>
        ))}
      </div>
      <p className="so__follow serif" data-hl>تابع أحمد على السوشيال</p>
      <div className="so__links">{socials.map((s) => <Btn key={s.label} href={s.href} theme="outline">{s.label}</Btn>)}</div>
    </section>
  )
}

/* ================= الفوتر: لوحة داكنة جوه إطار ليموني (زي الأصلي) ================= */
const SIG = 'M58 372C150 300 300 176 468 108C566 70 600 108 520 152C420 206 246 252 122 266C58 273 46 236 112 222C204 202 262 214 250 246C238 282 222 334 230 352C238 300 268 242 300 234C322 229 310 302 316 330C330 282 352 252 374 252C394 252 380 312 394 322C410 300 424 272 446 262C478 250 524 248 596 230'

export function Footer() {
  const root = useRef(null)
  useGSAP(() => {
    // التوقيع بيترسم لما الفوتر يظهر
    gsap.fromTo('.ft__sig path', { strokeDashoffset: 1 }, {
      strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut',
      scrollTrigger: { trigger: '.ft__tag', start: 'top 85%' },
    })
    // الصورة بتطلع من تحت
    gsap.fromTo('.ft__photo', { yPercent: 40 }, {
      yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: true },
    })
    // اللوحة بتكبر شوية وهي داخلة (إحساس الإطار بيقفل عليها)
    gsap.fromTo('.ft__panel', { scale: 0.94 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 20%', scrub: true },
    })
    const stop = marquee(root.current.querySelector('.ft__mq-row'), { speed: 50, dir: 1 })
    return () => stop()
  }, { scope: root })

  const chips = [...socials.map((s) => s.label), 'قاسمز', 'QASSIMZ', 'يوتيوب', 'مراجعات', 'حكايات']
  return (
    <footer className="ft" ref={root} data-nav="dark">
      <div className="ft__panel topo topo--dark">
        <svg className="ft__tab" viewBox="0 0 320 44" preserveAspectRatio="none" aria-hidden>
          <path d="M0 44C34 44 40 0 80 0H240C280 0 286 44 320 44Z" />
        </svg>

        <div className="ft__head">
          <svg className="ft__sig" viewBox="0 0 640 420" fill="none" aria-hidden><path d={SIG} pathLength="1" strokeDasharray="1" /></svg>
          <h2 className="ft__tag" data-hl><span>{site.tagline[0]}</span> <span className="serif">{site.tagline[1]}</span></h2>
        </div>

        <div className="ft__cols">
          <div className="ft__col">
            <p className="eyebrow" data-hl>الصفحات</p>
            {nav.map((n) => <a key={n.label} href={n.href} className="tlink" data-roll><Roll>{n.label}</Roll></a>)}
            <a href={site.youtube} className="tlink ft__yt" data-roll target="_blank" rel="noreferrer"><Roll>يوتيوب</Roll></a>
          </div>
          <img className="ft__photo" src={asset('images/hero-2.webp')} alt="" loading="lazy" />
          <div className="ft__col">
            <p className="eyebrow" data-hl>تابع على</p>
            {socials.map((s) => <a key={s.label} href={s.href} className="tlink" data-roll target="_blank" rel="noreferrer"><Roll>{s.label}</Roll></a>)}
            <a href={`${site.youtube}?sub_confirmation=1`} className="tlink ft__yt" data-roll target="_blank" rel="noreferrer"><Roll>اشترك</Roll></a>
          </div>
        </div>

        <div className="ft__mq" dir="ltr" aria-hidden>
          <div className="ft__mq-row">{[...chips, ...chips].map((c, i) => <span key={i}>{c}<LogoMark className="ft__mq-mark" /></span>)}</div>
        </div>
      </div>

      <div className="ft__bar">
        <span>© {new Date().getFullYear()} {site.nameAr} — كل الحقوق محفوظة</span>
        <Btn href={`mailto:${site.email}`} theme="dark" className="ft__mail">للتعاون والإعلانات</Btn>
        <span className="ft__legal"><NameLockup withMark={false} /></span>
      </div>
    </footer>
  )
}
