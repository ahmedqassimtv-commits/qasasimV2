import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import HeroGL from '../lib/heroGL'
import { marquee } from '../lib/marquee'
import { LogoMark } from './Bits'
import { hero, site } from '../data/content'

// التوقيع (مسار SVG واحد بيترسم مع التمرير) — تقدر تبدّله بتوقيعك الحقيقي
const SIG = 'M58 372C150 300 300 176 468 108C566 70 600 108 520 152C420 206 246 252 122 266C58 273 46 236 112 222C204 202 262 214 250 246C238 282 222 334 230 352C238 300 268 242 300 234C322 229 310 302 316 330C330 282 352 252 374 252C394 252 380 312 394 322C410 300 424 272 446 262C478 250 524 248 596 230'
const SIG_LINE = 'M150 392C260 372 420 356 560 330'

/**
 * الـ Hero (sticky track) — زي الأصلي:
 * 1) خلفية فاتحة بخطوط كنتور بتتحرك، والشخص (مقصوص) من الراس للكتاف، الصدر بيتقص عند تحت الشاشة.
 *    الماوس (أو اللمس على الموبايل) بيكشف صورة النظارة والكاب، ولما يقف فيه حركة تلقائية على الوش.
 * 2) مع التمرير الصورة بتصغر لكارت، تبهت، ووراها سطرين marquee ضخمين.
 * 3) التوقيع الليموني بيترسم والكارت بيغمق.
 */
export default function Hero() {
  const root = useRef(null)
  const canvas = useRef(null)
  const gl = useRef(null)

  useEffect(() => {
    gl.current = new HeroGL(canvas.current, { a: hero.imageA, b: hero.imageB, fit: 0.84, fitM: 0.56 })
    if (gl.current.failed) canvas.current.parentElement.classList.add('no-gl')
    return () => gl.current?.destroy()
  }, [])

  useGSAP(() => {
    // marquee سلس بلا تقطيع
    const rows = gsap.utils.toArray('.hero__row')
    const stops = rows.map((r, i) => marquee(r, { speed: 70, dir: i ? 1 : -1 }))

    // الخلفية بتتحرك: drift بطيء + parallax مع الماوس
    const topo = root.current.querySelector('.hero__topo')
    gsap.to(topo, { xPercent: -4, yPercent: -3, rotate: 1.5, duration: 18, ease: 'sine.inOut', repeat: -1, yoyo: true })
    const px = gsap.quickTo(topo, 'x', { duration: 1.2, ease: 'power3' })
    const py = gsap.quickTo(topo, 'y', { duration: 1.2, ease: 'power3' })
    const onMove = (e) => { px((e.clientX / innerWidth - 0.5) * -40); py((e.clientY / innerHeight - 0.5) * -30) }
    window.addEventListener('pointermove', onMove, { passive: true })

    // دخول بعد شاشة التحميل: الصورة بتتزق لجوه + حركة قوية تلقائية على الوش
    const intro = () => {
      gl.current?.intro?.()
      gsap.timeline()
        .fromTo('.hero__stage', { scale: 1.12 }, { scale: 1, duration: 2, ease: 'expo.out' })
        .fromTo('.hero__topo', { opacity: 0 }, { opacity: 1, duration: 1.4 }, 0.2)
        .from('.hero__ui > *', { y: 30, autoAlpha: 0, stagger: 0.1, duration: 1, ease: 'expo.out' }, 0.6)
    }
    window.addEventListener('preloader:out', intro, { once: true })

    const mm = gsap.matchMedia()
    mm.add({ desk: '(min-width: 768px)', mob: '(max-width: 767px)' }, (ctx) => {
      const target = ctx.conditions.desk ? 0.53 : 0.8
      const g = { grey: 0, dark: 0 }
      const upd = () => { if (gl.current) { gl.current.grey = g.grey; gl.current.dark = g.dark } }
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.6,
          onToggle: (s) => gl.current && (gl.current.visible = s.isActive || s.progress < 1),
        },
      })
        .to('.hero__stage', { scale: target, backgroundColor: '#a3a59e', duration: 0.4 }, 0)
        .to(g, { grey: 0.85, duration: 0.4, onUpdate: upd }, 0)
        .to('.hero__ui', { autoAlpha: 0, y: -40, duration: 0.12 }, 0)
        .fromTo('.hero__back', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 0.08)
        .fromTo('.hero__marq', { autoAlpha: 0, yPercent: 8 }, { autoAlpha: 1, yPercent: 0, duration: 0.3 }, 0.12)
        .fromTo('.hero__msg', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.15 }, 0.3)
        // التوقيع بيترسم والكارت بيغمق زيتوني
        .fromTo('.hero__sig .s1', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.42, ease: 'power1.inOut' }, 0.42)
        .fromTo('.hero__sig .s2', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.1 }, 0.84)
        .to('.hero__stage', { backgroundColor: '#4b4f43', duration: 0.4 }, 0.45)
        .to(g, { dark: 1, duration: 0.4, onUpdate: upd }, 0.45)
        .to({}, { duration: 0.08 })
    })

    return () => {
      stops.forEach((s) => s())
      window.removeEventListener('preloader:out', intro)
      window.removeEventListener('pointermove', onMove)
    }
  }, { scope: root })

  const row = (t) => Array.from({ length: 4 }, (_, i) => <span key={i} dir="rtl">{t}</span>)

  return (
    <section className="hero" ref={root}>
      {/* علامات لون النافبار: فاتح في أول الهيرو، داكن لما الصورة تصغر */}
      <div className="hero__navmark is-1" data-nav="light" />
      <div className="hero__navmark is-2" data-nav="dark" />
      <div className="hero__sticky">
        <div className="hero__back topo topo--dark" />
        <div className="hero__marq" aria-hidden dir="ltr">
          <div className="hero__row hero__row--serif">{row(hero.marqueeTop)}</div>
          <div className="hero__row hero__row--bold">{row(hero.marqueeBottom)}</div>
        </div>

        <div className="hero__stage">
          <div className="hero__topo" />
          <canvas ref={canvas} className="hero__gl" />
          <img className="hero__fallback" src={hero.imageA} alt={site.nameAr} />
        </div>

        <svg className="hero__sig" viewBox="0 0 640 420" fill="none" aria-hidden>
          <path className="s1" d={SIG} pathLength="1" strokeDasharray="1" />
          <path className="s2" d={SIG_LINE} pathLength="1" strokeDasharray="1" />
        </svg>

        <div className="hero__msg">
          <LogoMark className="hero__msg-logo" />
          <p className="eyebrow">{hero.messageEyebrow}</p>
        </div>

        <div className="hero__ui">
          <a href={hero.next.href} className="hero__next" target="_blank" rel="noreferrer">
            <span className="eyebrow">{hero.next.label}</span>
            <span className="hero__next-line" />
            <strong>{hero.next.title}</strong>
            <span className="eyebrow eyebrow--lime">{hero.next.sub}</span>
          </a>
          <p className="eyebrow hero__since">{site.since}</p>
        </div>
      </div>
    </section>
  )
}
