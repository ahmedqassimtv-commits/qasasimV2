import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { videos, shorts, socials, nav, site, asset } from '../data/content'
import { marquee } from '../lib/marquee'
import { drawSignature } from '../lib/drawSignature'
import { scroll } from '../hooks/useLenis'
import { Btn, LogoMark, NameLockup, Roll, PlayIcon, ArrowIcon } from './Bits'
import Signature from './Signature'

/* مشغّل يوتيوب جوه الموقع (للفيديوهات الطويلة بالعرض، وللشورتس بالطول) */
function Player({ item, vertical, onClose }) {
  useEffect(() => {
    scroll.lenis?.stop()
    const esc = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', esc)
    return () => { window.removeEventListener('keydown', esc); scroll.lenis?.start() }
  }, [onClose])
  return (
    <div className="vd__modal" onClick={onClose}>
      <div className={`vd__player ${vertical ? 'is-vertical' : ''}`} onClick={(e) => e.stopPropagation()}>
        <iframe src={`https://www.youtube-nocookie.com/embed/${item.id}?autoplay=1&rel=0`} title={item.title || 'YouTube'}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
      </div>
      <button className="vd__close" aria-label="إغلاق">×</button>
    </div>
  )
}

/* ================= الفيديوهات الطويلة (ألوان وخطوط مطابقة لـ image_3.png أسفل OnOff مباشرة) ================= */
export function Videos() {
  const root = useRef(null)
  const [playing, setPlaying] = useState(null)
  const [feat, ...rest] = videos.items

  useGSAP(() => {
    gsap.fromTo('.vd__feat', { clipPath: 'inset(16% 20% 16% 20% round 18px)' }, {
      clipPath: 'inset(0% 0% 0% 0% round 18px)', ease: 'none',
      scrollTrigger: { trigger: '.vd__feat', start: 'top 95%', end: 'top 35%', scrub: 0.6 },
    })
    gsap.fromTo('.vd__feat img', { scale: 1.3 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: '.vd__feat', start: 'top bottom', end: 'bottom top', scrub: true },
    })
    if (document.querySelector('.vd__row')) gsap.from('.vd__row .vd__card', {
      y: 80, autoAlpha: 0, stagger: 0.1, duration: 1, ease: 'expo.out',
      scrollTrigger: { trigger: '.vd__row', start: 'top 85%' },
    })
  }, { scope: root })

  const open = (v) => (e) => { if (!v.id) return; e.preventDefault(); setPlaying(v) }

  return (
    <section className="vd" id="videos" ref={root} data-nav="dark">
      <header className="vd__head">
        <div>
          <p className="eyebrow eyebrow--lime" data-hl>{videos.eyebrow}</p>
          <h3 className="vd__title" data-hl>
            <span className="t-bold">{videos.title[0]}</span>
            <span className="serif">{videos.title[1]}</span>
          </h3>
        </div>
        <div className="vd__side">
          <p className="vd__text" data-hl>{videos.text}</p>
          <Btn href={`${site.youtube}?sub_confirmation=1`} icon={<PlayIcon />} target="_blank" rel="noreferrer">اشترك في القناة</Btn>
        </div>
      </header>

      {feat && (
        <a className="vd__feat" href={`https://www.youtube.com/watch?v=${feat.id}`} target="_blank" rel="noreferrer" onClick={open(feat)}>
          <img src={feat.thumb} alt={feat.title} />
          <span className="vd__shade" />
          <span className="vd__play vd__play--big"><PlayIcon /></span>
          <span className="vd__feat-info">
            <span className="eyebrow eyebrow--lime">أحدث فيديو</span>
            <strong>{feat.title}</strong>
            <span className="eyebrow">{feat.meta}</span>
          </span>
        </a>
      )}

      {rest.length > 0 && (
        <div className="vd__row">
          {rest.map((v, i) => (
            <a key={i} className="vd__card" href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer" onClick={open(v)}>
              <div className="vd__thumb"><img src={v.thumb} alt={v.title} loading="lazy" /><span className="vd__play"><PlayIcon /></span></div>
              <div className="vd__info"><b>{v.title}</b><span>{v.meta}</span></div>
            </a>
          ))}
        </div>
      )}
      {playing && <Player item={playing} onClose={() => setPlaying(null)} />}
    </section>
  )
}

/* ================= الشورتس: مروحة كروت بالطول (زي «What's up on socials» في الأصلي) ================= */
export function Socials() {
  const root = useRef(null)
  const [playing, setPlaying] = useState(null)
  const [hot, setHot] = useState(-1)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px)', () => {
      const cards = gsap.utils.toArray('.so__card')
      const mid = (cards.length - 1) / 2
      gsap.fromTo(cards,
        { xPercent: -50, x: 0, rotate: (i) => (i - mid) * 1.5, y: 120 },
        {
          xPercent: -50, x: (i) => `${(i - mid) * 9.2}vw`, rotate: (i) => (i - mid) * 8,
          y: (i) => (Math.abs(i - mid) ** 1.7) * 18, ease: 'none',
          scrollTrigger: { trigger: '.so__fan', start: 'top 92%', end: 'top 30%', scrub: 0.8 },
        })
    })
  }, { scope: root })

  const open = (s) => (e) => { if (!s.id) return; e.preventDefault(); setPlaying(s) }
  const mid = (shorts.length - 1) / 2

  return (
    <section className="so topo topo--light" ref={root} data-nav="light">
      <h3 className="so__title" data-hl>
        <span className="t-bold">إيه الجديد</span>
        <span className="serif">على الشورتس</span>
      </h3>
      <div className={`so__fan ${hot > -1 ? 'has-hot' : ''}`} onMouseLeave={() => setHot(-1)}>
        {shorts.map((s, i) => (
          <a href={s.href} className={`so__card ${hot === i ? 'is-hot' : ''}`} key={i} target="_blank" rel="noreferrer"
            style={{ zIndex: hot === i ? 30 : 10 - Math.round(Math.abs(i - mid)) }}
            onMouseEnter={() => setHot(i)} onClick={open(s)}>
            <span className="so__in">
              <img src={s.thumb} alt={s.title} loading="lazy" />
              <span className="so__play"><PlayIcon /></span>
              {s.title && <span className="so__cap">{s.title}</span>}
            </span>
          </a>
        ))}
      </div>
      <p className="so__follow serif" data-hl>تابع أحمد على السوشيال</p>
      <div className="so__links">{socials.map((s) => <a key={s.label} href={s.href} className="tlink" data-roll target="_blank" rel="noreferrer"><Roll>{s.label}</Roll></a>)}</div>
      {playing && <Player item={playing} vertical onClose={() => setPlaying(null)} />}
    </section>
  )
}

/* ================= الفوتر: مطابق تماماً لـ image_4.png بكل تفاصيله ================= */
export function Footer() {
  const root = useRef(null)

  useGSAP(() => {
    // التوقيع بيترسم خط ورا خط لما الفوتر يظهر
    const sig = root.current.querySelector('.ft__sig')
    const tl = drawSignature(sig, { duration: 1.8, ease: 'power1.inOut' }).pause()
    gsap.timeline({ scrollTrigger: { trigger: '.ft__tag', start: 'top 86%', onEnter: () => tl.play(0) } })

    // حركة خلفية الكنتور الداكنة داخل الفوتر
    gsap.to('.ft__topo', { xPercent: -3, yPercent: 2.5, rotate: 1, duration: 22, ease: 'sine.inOut', repeat: -1, yoyo: true })

    // صورة البورتريه تطلع بنعومة من تحت داخل اللوحة المقصوصة
    gsap.fromTo('.ft__photo', { yPercent: 22 }, {
      yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: true },
    })

    // اللوحة تتمدد قليلاً عند الدخول
    gsap.fromTo('.ft__panel', { scale: 0.96 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 25%', scrub: true },
    })

    const stop = marquee(root.current.querySelector('.ft__mq-row'), { speed: 46, dir: 1 })
    return () => stop()
  }, { scope: root })

  const jump = (href) => (e) => {
    if (!href.startsWith('#')) return
    e.preventDefault()
    if (href === '#') {
      if (scroll.lenis) scroll.lenis.scrollTo(0, { duration: 1.2 })
      else window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const el = document.querySelector(href)
      if (el) {
        if (scroll.lenis) scroll.lenis.scrollTo(el, { duration: 1.2 })
        else el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const chips = [...socials.map((s) => s.label), 'مراجعات', 'حكايات', 'مقالات', 'شورتس', 'قاسمز']

  return (
    <footer className="ft" ref={root} data-nav="dark">
      <div className="ft__panel">
        {/* اللسان الداكن العلوي البارز في منتصف الإطار الليموني (مثل image_4.png) */}
        <svg className="ft__tab" viewBox="0 0 360 44" preserveAspectRatio="none" aria-hidden>
          <path d="M0 44C42 44 52 0 96 0H264C308 0 318 44 360 44Z" />
        </svg>

        {/* حاوية مقصوصة لكل محتوى اللوحة الداكنة (تقص الخلفية والصورة بدون ما تقص اللسان العلوي) */}
        <div className="ft__clip">
          <div className="ft__topo" aria-hidden />

          <div className="ft__head">
            <Signature className="ft__sig" />
            <h2 className="ft__tag" data-hl>
              <span className="t-bold">{site.tagline[0]}</span>{' '}
              <span className="serif">{site.tagline[1]}</span>
            </h2>
          </div>

          <div className="ft__body">
            <div className="ft__col ft__col--pages">
              <p className="eyebrow" data-hl>الصفحات</p>
              {nav.slice(0, 4).map((n) => (
                <a key={n.label} href={n.href} className="tlink" data-roll onClick={jump(n.href)}>
                  <Roll>{n.label}</Roll>
                </a>
              ))}
              <a href={site.youtube} className="tlink ft__yt" data-roll target="_blank" rel="noreferrer">
                <Roll>يوتيوب</Roll>
              </a>
            </div>

            <div className="ft__col ft__col--soc">
              <p className="eyebrow" data-hl>تابع على</p>
              {socials.map((s) => (
                <a key={s.label} href={s.href} className="tlink" data-roll target="_blank" rel="noreferrer">
                  <Roll>{s.label}</Roll>
                </a>
              ))}
              <a href={`${site.youtube}?sub_confirmation=1`} className="tlink ft__yt" data-roll target="_blank" rel="noreferrer">
                <Roll>اشترك</Roll>
              </a>
            </div>
          </div>

          {/* الشريط المتحرك باللون الليموني خلف أكتاف الصورة تماماً مثل شريط الشركاء في image_4.png */}
          <div className="ft__mq" dir="ltr" aria-hidden>
            <div className="ft__mq-row">
              {[...chips, ...chips].map((c, i) => (
                <span key={i}>{c}<LogoMark className="ft__mq-mark" /></span>
              ))}
            </div>
          </div>

          {/* البورتريه بالكاب والنظارة في المنتصف ملاصق للحافة السفلية (مثل خوذة لاندو في image_4.png) */}
          <img className="ft__photo" src={asset('images/hero-2.webp')} alt={site.nameAr} loading="lazy" />

          {/* زر التعاون الليموني العائم في منتصف أسفل الصورة */}
          <div className="ft__cta">
            <Btn href={`mailto:${site.email}`} theme="lime" className="ft__mail" icon={<ArrowIcon />}>
              للتعاون والإعلانات
            </Btn>
          </div>

          {/* لسانان ليمونيان منحنيان في الزاويتين السفليتين (يمين وشمال) بالظبط مثل image_4.png */}
          <div className="ft__corner ft__corner--start">
            <span>© {new Date().getFullYear()} {site.nameAr} — كل الحقوق محفوظة</span>
          </div>
          <div className="ft__corner ft__corner--end">
            <NameLockup withMark={false} />
          </div>
        </div>
      </div>
    </footer>
  )
}
