import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LogoMark, NameLockup, Roll, Btn, PlayIcon } from './Bits'
import { nav, site, socials, track } from '../data/content'
import { scroll } from '../hooks/useLenis'

const menuImgs = track.items.filter((i) => i.src).slice(0, 6)

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
      .fromTo('.menu__col', { yPercent: (i) => (i ? 40 : -40), autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1.1, ease: 'expo.out' }, 0.35)
      .fromTo('.menu__link > *', { yPercent: 115 }, { yPercent: 0, duration: 0.9, stagger: 0.07, ease: 'expo.out' }, 0.45)
      .fromTo('.menu__foot > *', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.05, duration: 0.6, ease: 'power3.out' }, 0.7)
      .fromTo('.menu__strike', { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'power3.inOut' }, 0.9)

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
                  {i === 0 && <span className="menu__strike" />}
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
