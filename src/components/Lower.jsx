import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { videos, shorts, socials, nav, site, asset } from '../data/content'
import { marquee } from '../lib/marquee'
import { drawSignature } from '../lib/drawSignature'
import { scroll } from '../hooks/useLenis'
import { Btn, LogoMark, NameLockup, Roll, PlayIcon } from './Bits'
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

/* ================= الفيديوهات الطويلة: كارت كبير مميز + الباقي صف بالعرض ================= */
export function Videos() {
  const root = useRef(null)
  const [playing, setPlaying] = useState(null)
  const [feat, ...rest] = videos.items

  useGSAP(() => {
    // الكارت الكبير بيتفتح من النص (clip) والصورة بتتزق لجوه مع التمرير
    gsap.fromTo('.vd__feat', { clipPath: 'inset(18% 22% 18% 22% round 18px)' }, {
      clipPath: 'inset(0% 0% 0% 0% round 18px)', ease: 'none',
      scrollTrigger: { trigger: '.vd__feat', start: 'top 95%', end: 'top 35%', scrub: 0.6 },
    })
    gsap.fromTo('.vd__feat img', { scale: 1.35 }, {
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
    <section className="vd topo topo--dark" id="videos" ref={root} data-nav="dark">
      <header className="vd__head">
        <div>
          <p className="eyebrow eyebrow--lime" data-hl>{videos.eyebrow}</p>
          <h3 className="vd__title" data-hl><span>{videos.title[0]}</span><span className="serif">{videos.title[1]}</span></h3>
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
      // متكوّمين في النص → بيتفردوا مروحة مع التمرير
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
      <h3 className="so__title" data-hl><span>إيه الجديد</span><span className="serif">على الشورتس</span></h3>
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

/* ================= الفوتر: لوحة داكنة جوه إطار ليموني (زي الأصلي) ================= */
export function Footer() {
  const root = useRef(null)
  useGSAP(() => {
    // التوقيع بيترسم خط ورا خط لما الفوتر يظهر
    const sig = root.current.querySelector('.ft__sig')
    const tl = drawSignature(sig, { duration: 1.8, ease: 'power1.inOut' }).pause()
    gsap.timeline({ scrollTrigger: { trigger: '.ft__tag', start: 'top 85%', onEnter: () => tl.play(0) } })
    // الصورة بتطلع من تحت
    gsap.fromTo('.ft__photo', { yPercent: 30 }, {
      yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: true },
    })
    gsap.fromTo('.ft__panel', { scale: 0.94 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 20%', scrub: true },
    })
    const stop = marquee(root.current.querySelector('.ft__mq-row'), { speed: 50, dir: 1 })
    return () => stop()
  }, { scope: root })

  // الشريط المتحرك: روابط وأقسام بس — اللوجو هو الفاصل (من غير تكرار الاسم)
  const chips = [...socials.map((s) => s.label), 'مراجعات', 'حكايات', 'مقالات', 'شورتس']
  return (
    <footer className="ft" ref={root} data-nav="dark">
      <div className="ft__panel topo topo--dark">
        <svg className="ft__tab" viewBox="0 0 320 44" preserveAspectRatio="none" aria-hidden>
          <path d="M0 44C34 44 40 0 80 0H240C280 0 286 44 320 44Z" />
        </svg>

        <div className="ft__head">
          <Signature className="ft__sig" />
          <h2 className="ft__tag" data-hl><span>{site.tagline[0]}</span> <span className="serif">{site.tagline[1]}</span></h2>
        </div>

        <div className="ft__cols">
          <div className="ft__col">
            <p className="eyebrow" data-hl>الصفحات</p>
            {nav.map((n) => <a key={n.label} href={n.href} className="tlink" data-roll><Roll>{n.label}</Roll></a>)}
            <a href={site.youtube} className="tlink ft__yt" data-roll target="_blank" rel="noreferrer"><Roll>يوتيوب</Roll></a>
          </div>
          <img className="ft__photo" src={asset('images/hero-1.webp')} alt={site.nameAr} loading="lazy" />
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
