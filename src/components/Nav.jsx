import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LogoMark, NameLockup, Roll, Btn, PlayIcon } from './Bits'
import { nav, site, socials, track } from '../data/content'
import { scroll } from '../hooks/useLenis'

const menuImgs = track.items.filter((i) => i.src).slice(0, 6)

export default function Nav({ ready }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const root = useRef(null)
  const tl = useRef(null)

  useGSAP(() => {
    tl.current = gsap.timeline({ paused: true, defaults: { ease: 'expo.inOut' } })
      .set('.menu', { autoAlpha: 1 })
      .fromTo('.menu__bg', { scaleY: 0 }, { scaleY: 1, duration: 0.9 })
      .fromTo('.menu__col', { yPercent: (i) => (i ? 40 : -40), autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1.1, ease: 'expo.out' }, 0.35)
      .fromTo('.menu__link > *', { yPercent: 115 }, { yPercent: 0, duration: 0.9, stagger: 0.07, ease: 'expo.out' }, 0.45)
      .fromTo('.menu__foot > *', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.05, duration: 0.6, ease: 'power3.out' }, 0.7)
      .fromTo('.menu__scribble path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, 0.9)

    // الصور في القائمة تنزلق ببطء بلا توقف (عمود لفوق وعمود لتحت)
    gsap.utils.toArray('.menu__track').forEach((t, i) => {
      gsap.fromTo(t, { yPercent: i ? -50 : 0 }, { yPercent: i ? 0 : -50, duration: 40, ease: 'none', repeat: -1 })
    })
  }, { scope: root })

  useEffect(() => {
    if (!tl.current) return
    if (open) { tl.current.timeScale(1).play(); scroll.lenis?.stop() }
    else { tl.current.timeScale(1.5).reverse(); if (ready) scroll.lenis?.start() }
    root.current.classList.toggle('is-open', open)
  }, [open, ready])

  // لون الشريط يتبدّل حسب لون القسم اللي تحته (data-nav="dark|light")
  useEffect(() => {
    if (!ready) return
    const triggers = gsap.utils.toArray('[data-nav]').map((sec) =>
      ScrollTrigger.create({
        trigger: sec, start: 'top 40px', end: 'bottom 40px',
        onToggle: (s) => s.isActive && root.current.setAttribute('data-theme', sec.dataset.nav),
      })
    )
    // يختفي مع النزول ويرجع مع الطلوع
    const hide = ScrollTrigger.create({
      start: 'top -200',
      onUpdate: (s) => root.current.classList.toggle('is-hidden', s.direction === 1 && !root.current.classList.contains('is-open')),
    })
    return () => { triggers.forEach((t) => t.kill()); hide.kill() }
  }, [ready])

  return (
    <div className="navw" ref={root} data-theme="light">
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
        <div className="menu__bg" />
        <div className="menu__grid">
          <div className="menu__imgs">
            {[0, 1].map((c) => (
              <div className="menu__col" key={c}>
                <div className="menu__track">
                  {[...menuImgs, ...menuImgs].filter((_, i) => i % 2 === c).map((m, i) => {
                    const idx = menuImgs.indexOf(m) % nav.length
                    return (
                      <div className={`menu__img ${idx === active ? 'is-active' : ''}`} key={i}>
                        <img src={m.src} alt="" />
                        <span className="menu__tint" />
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="menu__side">
            <nav className="menu__links">
              {nav.map((n, i) => (
                <a key={n.label} href={n.href} className="menu__link" data-roll
                  onMouseEnter={() => setActive(i)} onClick={() => setOpen(false)}>
                  <span><Roll>{n.label}</Roll></span>
                  {i === 0 && (
                    <svg className="menu__scribble" viewBox="0 0 412 26" preserveAspectRatio="none">
                      <path d="M4 18C80 8 190 4 300 9c40 2 78 6 106 11" pathLength="1" strokeDasharray="1" />
                    </svg>
                  )}
                </a>
              ))}
            </nav>
            <div className="menu__foot">
              <p className="eyebrow">{site.since}</p>
              <a href={`mailto:${site.email}`} className="tlink" data-roll><Roll>للتعاون والإعلانات</Roll></a>
              <div className="menu__soc">
                {socials.map((s) => <a key={s.label} href={s.href} className="tlink" data-roll><Roll>{s.label}</Roll></a>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
