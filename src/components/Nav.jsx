import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LogoMark, NameLockup, Roll, Btn, PlayIcon } from './Bits'
import { nav, site, socials, track, hall, hero } from '../data/content'
import { scroll } from '../hooks/useLenis'

// صور القائمة: 4 صور واضحة ومختلفة في عمودين (2×2 مثل تصميم landonorris.com بالظبط)
const menuImgs = [
  hero.imageB,
  track.items.find((i) => i.src)?.src,
  hall.items[3]?.img || track.items[1]?.src,
  hall.items[4]?.img || track.items[3]?.src,
].filter(Boolean)

// ألوان الشريط لكل نوع خلفية
const THEMES = {
  dark: { '--nf': '#f4f4ed', '--nm': '#d2ff00', '--hb': '#f4f4ed', '--hbd': 'rgba(40,44,32,0)' },
  light: { '--nf': '#282c20', '--nm': '#282c20', '--hb': 'rgba(244,244,237,0)', '--hbd': 'rgba(40,44,32,1)' },
}

export default function Nav({ ready }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(1)
  const [current, setCurrent] = useState(0)
  const openRef = useRef(false)
  const root = useRef(null)
  const tl = useRef(null)

  useGSAP(() => {
    tl.current = gsap.timeline({ paused: true, defaults: { ease: 'expo.inOut' } })
      .set('.menu', { autoAlpha: 1 })
      .fromTo('.menu__bg', { scaleY: 0 }, { scaleY: 1, duration: 0.85 })
      .fromTo('.menu__img', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.95, stagger: 0.07 }, 0.28)
      .fromTo('.menu__link > span:first-child', { yPercent: 115 }, { yPercent: 0, duration: 0.85, stagger: 0.06, ease: 'expo.out' }, 0.4)
      .fromTo('.menu__brand, .menu__foot > *', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.55, ease: 'power3.out' }, 0.7)
      .fromTo('.menu__strike path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.65, ease: 'power2.inOut' }, 0.92)

    // حركة الخلفية الكنتورية داخل القائمة
    gsap.to('.menu__bg-topo', { xPercent: -3, yPercent: 2.5, rotate: 1.2, duration: 20, ease: 'sine.inOut', repeat: -1, yoyo: true })

    // العمودين يتحركون عكس بعض مع الماوس فقط عندما تكون القائمة مفتوحة
    const cols = gsap.utils.toArray('.menu__col')
    const mv = cols.map((c) => gsap.quickTo(c, 'y', { duration: 1.3, ease: 'power3' }))
    const onMove = (e) => {
      if (!openRef.current || e.pointerType === 'touch') return
      const k = e.clientY / innerHeight - 0.5
      mv[0]?.(k * -46)
      mv[1]?.(k * 46)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, { scope: root })

  useEffect(() => {
    openRef.current = open
    if (!tl.current) return
    if (open) { tl.current.timeScale(1).play(); scroll.lenis?.stop() }
    else { tl.current.timeScale(1.45).reverse(); if (ready) scroll.lenis?.start() }
    root.current.classList.toggle('is-open', open)
  }, [open, ready])

  // إغلاق القائمة بزر Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // تتبع القسم الحالي في الصفحة لتحديث الخط الليموني المتموج (is-current) وتغيير لون النافبار
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

    // تحديث الرابط النشط في القائمة حسب موقع التمرير
    const secTriggers = nav.map((item, idx) => {
      if (!item.href || item.href === '#') {
        return ScrollTrigger.create({
          trigger: '.hero', start: 'top center', end: 'bottom center',
          onEnter: () => setCurrent(0), onEnterBack: () => setCurrent(0),
        })
      }
      const target = document.querySelector(item.href)
      if (!target) return null
      return ScrollTrigger.create({
        trigger: target, start: 'top center', end: 'bottom center',
        onEnter: () => setCurrent(idx), onEnterBack: () => setCurrent(idx),
      })
    }).filter(Boolean)

    const hide = ScrollTrigger.create({
      start: 'top -200',
      onUpdate: (s) => root.current.classList.toggle('is-hidden', s.direction === 1 && !root.current.classList.contains('is-open')),
    })
    return () => {
      triggers.forEach((t) => t.kill())
      secTriggers.forEach((t) => t.kill())
      hide.kill()
    }
  }, [ready])

  // تنقل سلس عبر Lenis عند الضغط على رابط داخلي من القائمة
  const go = (href, idx) => (e) => {
    e.preventDefault()
    setCurrent(idx)
    setOpen(false)
    setTimeout(() => {
      scroll.lenis?.start()
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
    }, 320)
  }

  return (
    <div className="navw" ref={root}>
      <header className="nav">
        <a href="#" className="nav__brand" aria-label="الرئيسية" onClick={go('#', 0)}><NameLockup withMark={false} /></a>
        <a href="#" className="nav__mid" aria-label="قاسمز" onClick={go('#', 0)}><LogoMark /></a>
        <div className="nav__btns">
          <Btn href={site.youtube} target="_blank" rel="noreferrer" icon={<PlayIcon />} className="btn--nav">يوتيوب</Btn>
          <button className={`ham ${open ? 'is-open' : ''}`} onClick={() => setOpen(!open)} aria-label="القائمة" aria-expanded={open}>
            <i /><i />
          </button>
        </div>
      </header>

      <div className="menu" aria-hidden={!open}>
        <div className="menu__bg">
          <div className="menu__bg-topo" />
        </div>
        <div className="menu__grid" dir="ltr">
          {/* الشمال: عمودين صور 2×2 بالظبط مثل landonorris.com (العمود الأيمن يبدأ من أعلى الحافة) */}
          <div className="menu__imgs">
            {[0, 1].map((c) => (
              <div className={`menu__col menu__col--${c}`} key={c}>
                {menuImgs.filter((_, i) => i % 2 === c).map((src, k) => {
                  const idx = k * 2 + c
                  const isActive = active % menuImgs.length === idx
                  return (
                    <div className={`menu__img ${isActive ? 'is-active' : ''} ${idx === 0 ? 'menu__img--portrait' : ''}`} key={k}>
                      <img src={src} alt="" />
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* اليمين: الروابط الكبيرة + الشعار + التعاون والسوشيال أسفل الشاشة */}
          <div className="menu__side" dir="rtl">
            <nav className="menu__links">
              {nav.map((n, i) => (
                <a
                  key={n.label}
                  href={n.href}
                  className={`menu__link ${i === current ? 'is-current' : ''} ${i === active && i !== current ? 'is-hover' : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={go(n.href, i)}
                >
                  <span>{n.label}</span>
                  {i === current && (
                    <svg className="menu__strike" viewBox="0 0 200 22" preserveAspectRatio="none" aria-hidden>
                      <path d="M2 11C20 4 36 4 54 11S88 18 106 11 140 4 158 11 182 18 198 11" pathLength="1" strokeDasharray="1" />
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
                {socials.map((s) => (
                  <a key={s.label} href={s.href} className="tlink" data-roll target="_blank" rel="noreferrer"><Roll>{s.label}</Roll></a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
