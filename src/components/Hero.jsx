import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import HeroGL from '../lib/heroGL'
import { LogoMark } from './Bits'
import { hero, site } from '../data/content'

/**
 * الـ Hero (sticky track):
 * 1) صورة ملء الشاشة — الماوس يكشف الصورة الثانية بحافة سائلة (WebGL)
 * 2) مع التمرير الصورة تصغر لكارت في النص، تبهت للرمادي، ويظهر وراها سطرين marquee ضخمين
 * 3) التوقيع الليموني يترسم فوق الصورة مع التمرير
 */
export default function Hero() {
  const root = useRef(null)
  const canvas = useRef(null)
  const gl = useRef(null)

  useEffect(() => {
    gl.current = new HeroGL(canvas.current, { a: hero.imageA, b: hero.imageB, fitH: 1.12, top: 0.07 })
    if (gl.current.failed) canvas.current.parentElement.classList.add('no-gl')
    return () => gl.current?.destroy()
  }, [])

  useGSAP(() => {
    const mm = gsap.matchMedia()
    // marquee لا نهائي — السطرين في اتجاهين عكس بعض
    gsap.utils.toArray('.hero__row').forEach((row, i) =>
      gsap.fromTo(row, { xPercent: i ? -50 : 0 }, { xPercent: i ? 0 : -50, duration: 38, ease: 'none', repeat: -1 })
    )

    // دخول بعد الـ Preloader
    const intro = () => gsap.timeline()
      .fromTo('.hero__stage', { scale: 1.18 }, { scale: 1, duration: 1.8, ease: 'expo.out' })
      .from('.hero__ui > *', { y: 30, autoAlpha: 0, stagger: 0.08, duration: 1, ease: 'expo.out' }, 0.5)
    window.addEventListener('preloader:out', intro, { once: true })

    mm.add({ desk: '(min-width: 768px)', mob: '(max-width: 767px)' }, (ctx) => {
      const target = ctx.conditions.desk ? 0.62 : 0.86
      const g = { v: 0 }
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.8,
          onToggle: (s) => gl.current && (gl.current.visible = s.isActive || s.progress < 1),
        },
      })
        .to('.hero__stage', { scale: target, borderRadius: 4, backgroundColor: '#a5a7a0', duration: 0.45 }, 0)
        .to(g, { v: 0.55, duration: 0.45, onUpdate: () => gl.current && (gl.current.grey = g.v) }, 0)
        .to('.hero__ui', { autoAlpha: 0, y: -40, duration: 0.15 }, 0)
        .fromTo('.hero__back', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.1)
        .fromTo('.hero__marq', { autoAlpha: 0, scale: 1.15 }, { autoAlpha: 1, scale: 1, duration: 0.35 }, 0.15)
        .fromTo('.hero__msg', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.2 }, 0.32)
        .fromTo('.hero__sig path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.4, ease: 'power1.inOut' }, 0.5)
        .to({}, { duration: 0.1 })
    })
    return () => window.removeEventListener('preloader:out', intro)
  }, { scope: root })

  const row = (t) => Array.from({ length: 6 }, (_, i) => <span key={i}>{t}</span>)

  return (
    <section className="hero" ref={root}>
      {/* علامات لون النافبار: فاتح في أول الهيرو، داكن لما الصورة تصغر */}
      <div className="hero__navmark is-1" data-nav="light" />
      <div className="hero__navmark is-2" data-nav="dark" />
      <div className="hero__sticky">
        <div className="hero__back topo topo--dark" />
        <div className="hero__marq" aria-hidden>
          <div className="hero__row hero__row--serif">{row(hero.marqueeTop)}</div>
          <div className="hero__row hero__row--bold">{row(hero.marqueeBottom)}</div>
        </div>

        <div className="hero__stage topo topo--light">
          <canvas ref={canvas} className="hero__gl" />
          <img className="hero__fallback" src={hero.imageA} alt={site.nameAr} />
        </div>

        <svg className="hero__sig" viewBox="0 0 420 500" fill="none" aria-hidden>
          <path pathLength="1" strokeDasharray="1"
            d="M48 478C128 378 196 300 252 246C208 262 152 302 112 348C184 262 302 122 384 22" />
        </svg>

        <div className="hero__msg">
          <LogoMark className="hero__msg-logo" />
          <p className="eyebrow">{hero.messageEyebrow}</p>
        </div>

        <div className="hero__ui">
          <a href={hero.next.href} className="hero__next" target="_blank" rel="noreferrer">
            <span className="eyebrow">{hero.next.label}</span>
            <strong>{hero.next.title}</strong>
            <span className="eyebrow eyebrow--lime">{hero.next.sub}</span>
          </a>
          <p className="eyebrow hero__since">{site.since}</p>
          <p className="eyebrow hero__hint">حرّك الماوس على الصورة</p>
        </div>
      </div>
    </section>
  )
}
