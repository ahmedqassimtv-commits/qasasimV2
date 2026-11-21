import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LogoMark, NameLockup, Roll, Btn, PlayIcon } from './Bits'
import { nav, site, socials, track, hall } from '../data/content'
import { scroll } from '../hooks/useLenis'

// صور القائمة: عمودين صغيرين على الشمال (زي الأصلي) — صورة لكل رابط
const menuImgs = [...track.items.filter((i) => i.src).map((i) => i.src), ...hall.items.map((h) => h.img)].slice(0, 6)

// ألوان الشريط لكل نوع خلفية
const THEMES = {
  dark: { '--nf': '#f4f4ed', '--nm': '#d2ff00', '--hb': '#f4f4ed', '--hbd': 'rgba(40,44,32,0)' },
  light: { '--nf': '#282c20', '--nm': '#282c20', '--hb': 'rgba(244,244,237,0)', '--hbd': 'rgba(40,44,32,1)' },
}

export default function Nav({ ready }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const root = useRef(null)
  const tl = useRef(null)

  useGSAP(() => {
    tl.current = gsap.timeline({ paused: true, defaults: { ease: 'expo.inOut' } })
      .set('.menu', { autoAlpha: 1 })
      .fromTo('.menu__bg', { scaleY: 0 }, { scaleY: 1, duration: 0.9 })
      .fromTo('.menu__img', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, stagger: 0.06 }, 0.3)
      .fromTo('.menu__link > span:first-child', { yPercent: 115 }, { yPercent: 0, duration: 0.9, stagger: 0.07, ease: 'expo.out' }, 0.45)
      .fromTo('.menu__brand, .menu__foot > *', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.6, ease: 'power3.out' }, 0.75)
      .fromTo('.menu__strike path', { strokeDashoffset: 1.1 }, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' }, 1)

    // دخول الشريط بعد شاشة التحميل: الاسم والأزرار بينزلوا من فوق واحد ورا التاني
    const enter = () => gsap.fromTo('.nav > *', { yPercent: -160, autoAlpha: 0 },
      { yPercent: 0, autoAlpha: 1, stagger: 0.09, duration: 1.1, ease: 'expo.out', delay: 0.7 })
    window.addEventListener('preloader:out', enter, { once: true })

    // العمودين بيتحركوا عكس بعض مع الماوس (parallax خفيف)
    const cols = gsap.utils.toArray('.menu__col')
    const mv = cols.map((c) => gsap.quickTo(c, 'y', { duration: 1.4, ease: 'power3' }))
    const onMove = (e) => { const k = e.clientY / innerHeight - 0.5; mv[0]?.(k * -60); mv[1]?.(k * 60) }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('preloader:out', enter) }
  }, { scope: root })

  useEffect(() => {
    if (!tl.current) return
    if (open) { tl.current.timeScale(1).play(); scroll.lenis?.stop() }
    else { tl.current.timeScale(1.5).reverse(); if (ready) scroll.lenis?.start() }
    root.current.classList.toggle('is-open', open)
  }, [open, ready])

  // لون الاسم والأزرار بيتغير تدريجياً مع التمرير حسب لون القسم اللي تحته
  // (كل [data-nav] بيعمل انتقال scrub من لون القسم اللي قبله للونه)
  useEffect(() => {
    if (!ready) return
    const marks = gsap.utils.toArray('[data-nav]')
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)
    gsap.set(root.current, THEMES[marks[0]?.dataset.nav || 'light'])
    const triggers = marks.slice(1).map((sec, i) => {
      const from = THEMES[marks[i].dataset.nav], to = THEMES[sec.dataset.nav]
      return gsap.fromTo(root.current, from, {
        ...to, ease: 'none', immediateRender: false,
        scrollTrigger: { trigger: sec, start: 'top 90px', end: 'top 10px', scrub: true },
      }).scrollTrigger
    })
    // يختفي مع النزول ويرجع مع الطلوع
    const hide = ScrollTrigger.create({
      start: 'top -200',
      onUpdate: (s) => root.current.classList.toggle('is-hidden', s.direction === 1 && !root.current.classList.contains('is-open')),
    })
    return () => { triggers.forEach((t) => t.kill()); hide.kill() }
  }, [ready])

  return (
    <div className="navw" ref={root}>
      <header className="nav">
        <a href="#" className="nav__brand" aria-label="الرئيسية"><NameLockup withMark={false} /></a>
        <a href="#" className="nav__mid" aria-label="قاسمز"><LogoMark /></a>
        <div className="nav__btns">
          <Btn href={site.youtube} target="_blank" rel="noreferrer" icon={<PlayIcon />} className="btn--nav">يوتيوب</Btn>
          <button className={`ham ${open ? 'is-open' : ''}`} onClick={() => setOpen(!open)} aria-label="القائمة" aria-expanded={open}>
            <i /><i />
          </button>
        </div>
      </header>

      <div className="menu" aria-hidden={!open}>
        <div className="menu__bg topo topo--dark" />
        <div className="menu__grid" dir="ltr">
          {/* الشمال: عمودين صور صغيرين */}
          <div className="menu__imgs">
            {[0, 1].map((c) => (
              <div className={`menu__col menu__col--${c}`} key={c}>
                {menuImgs.filter((_, i) => i % 2 === c).map((src, k) => {
                  const idx = k * 2 + c
                  return (
                    <div className={`menu__img ${idx % nav.length === active ? 'is-active' : ''}`} key={k}>
                      <img src={src} alt="" />
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* اليمين: الروابط في النص + اللوجو + التواصل تحت */}
          <div className="menu__side" dir="rtl">
            <nav className="menu__links">
              {nav.map((n, i) => (
                <a key={n.label} href={n.href} className={`menu__link ${i === 0 ? 'is-current' : ''}`}
                  onMouseEnter={() => setActive(i)} onClick={() => setOpen(false)}>
                  <span>{n.label}</span>
                  {i === 0 && (
                    <svg className="menu__strike" viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden>
                      <path d="M0 9C18 3 30 3 46 9S78 15 96 9 128 3 146 9 182 15 200 9" pathLength="1" strokeDasharray="1 1.5" strokeDashoffset="1.1" />
                    </svg>
                  )}
                </a>
              ))}
            </nav>
            <div className="menu__brand">
              <LogoMark />
              <p className="eyebrow">{site.since}</p>
            </div>
            <div className="menu__foot">
              <a href={`mailto:${site.email}`} className="tlink menu__mail" data-roll><Roll>للتعاون والإعلانات</Roll></a>
              <div className="menu__soc">
                {socials.map((s) => <a key={s.label} href={s.href} className="tlink" data-roll target="_blank" rel="noreferrer"><Roll>{s.label}</Roll></a>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
