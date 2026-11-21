import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import HeroGL from '../lib/heroGL'
import Wire from '../lib/wire'
import { marquee } from '../lib/marquee'
import { scroll } from '../hooks/useLenis'
import { LogoMark } from './Bits'
import Signature from './Signature'
import { drawSignature } from '../lib/drawSignature'
import { hero, site } from '../data/content'

/**
 * الـ Hero (sticky track) — مطابق لإحساس landonorris.com:
 * 1) خلفية فاتحة بطبقتين كنتوريتين تتحركان حركة موجية حيّة + parallax ناعم مع الماوس بدون انكشاف أي حافة أو فريم مكسور.
 * 2) مجسّم نظارة 3D Wireframe متمركز بدقة على مكان النظارة والعينين يتحرك ويتفاعل مع الماوس.
 * 3) WebGL Liquid Reveal يكشف صورة النظارة والكاب بنعومة تامة بدون اهتزاز، مع زر «اضغط للتثبيت» على الموبايل.
 * 4) مع التمرير: يصغر لكارت بحواف ناعمة، يظهر وراءه الـ Marquee والخلفية الكنتورية الداكنة المتحركة، ويُرسَم التوقيع الليموني.
 */
export default function Hero() {
  const root = useRef(null)
  const canvas = useRef(null)
  const gl = useRef(null)
  const wireBack = useRef(null)
  const wireFront = useRef(null)
  const wire = useRef(null)
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    gl.current = new HeroGL(canvas.current, { a: hero.imageA, b: hero.imageB, fit: 0.84, fitM: 0.58 })
    if (gl.current.failed) canvas.current.parentElement.classList.add('no-gl')
    wire.current = new Wire([wireBack.current, wireFront.current], { fit: 0.84, fitM: 0.58 })
    return () => { gl.current?.destroy(); wire.current?.destroy() }
  }, [])

  // تثبيت التمرير على الموبايل للتفاعل بحرية مع تأثير النظارة السائل (مثل tap to lock في الأصلي)
  useEffect(() => {
    if (locked) scroll.lenis?.stop()
    else scroll.lenis?.start()
    document.body.classList.toggle('is-hero-locked', locked)
    return () => { document.body.classList.remove('is-hero-locked') }
  }, [locked])

  useGSAP(() => {
    const rows = gsap.utils.toArray('.hero__row')
    const stops = rows.map((r, i) => marquee(r, { speed: 70, dir: i ? 1 : -1 }))

    // حركة خلفية كنتورية مزدوجة العمق (طبقتان تتحركان بعكس بعض + parallax بالماوس بدون أي حواف مكشوفة)
    const topoA = root.current.querySelector('.hero__topo--a')
    const topoB = root.current.querySelector('.hero__topo--b')
    const backTopo = root.current.querySelector('.hero__back-topo')

    gsap.to(topoA, { xPercent: -3, yPercent: -2.2, rotate: 1.2, duration: 16, ease: 'sine.inOut', repeat: -1, yoyo: true })
    gsap.to(topoB, { xPercent: 3.2, yPercent: 2.4, rotate: -1.4, duration: 22, ease: 'sine.inOut', repeat: -1, yoyo: true })
    gsap.to(backTopo, { xPercent: -2.5, yPercent: 2, rotate: 1, duration: 24, ease: 'sine.inOut', repeat: -1, yoyo: true })

    const pxA = gsap.quickTo(topoA, 'x', { duration: 1.3, ease: 'power3' })
    const pyA = gsap.quickTo(topoA, 'y', { duration: 1.3, ease: 'power3' })
    const pxB = gsap.quickTo(topoB, 'x', { duration: 1.7, ease: 'power3' })
    const pyB = gsap.quickTo(topoB, 'y', { duration: 1.7, ease: 'power3' })
    const pxBack = gsap.quickTo(backTopo, 'x', { duration: 1.6, ease: 'power3' })
    const pyBack = gsap.quickTo(backTopo, 'y', { duration: 1.6, ease: 'power3' })

    const onMove = (e) => {
      if (e.pointerType === 'touch') return
      const nx = e.clientX / innerWidth - 0.5
      const ny = e.clientY / innerHeight - 0.5
      pxA(nx * -34); pyA(ny * -24)
      pxB(nx * 22); pyB(ny * 16)
      pxBack(nx * -26); pyBack(ny * -18)
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    // دخول سلس بعد شاشة التحميل بدون أي قفز أو فريم مكسور
    const intro = () => {
      gl.current?.intro?.()
      wire.current?.reveal()
      gsap.timeline()
        .fromTo('.hero__stage', { scale: 1.06 }, { scale: 1, duration: 1.8, ease: 'expo.out' })
        .fromTo('.hero__topo', { opacity: 0 }, { opacity: 1, duration: 1.2, stagger: 0.15 }, 0.1)
        .from('.hero__ui > *', { y: 26, autoAlpha: 0, stagger: 0.08, duration: 0.9, ease: 'expo.out' }, 0.45)
    }
    window.addEventListener('preloader:out', intro, { once: true })

    const mm = gsap.matchMedia()
    mm.add({ desk: '(min-width: 768px)', mob: '(max-width: 767px)' }, (ctx) => {
      const desk = ctx.conditions.desk
      const sc = desk ? 0.6 : 0.82
      const cw = desk ? 0.34 : 0.72, ch = desk ? 0.5 : 0.42
      const ix = ((1 - cw / sc) / 2) * 100, iy = ((1 - ch / sc) / 2) * 100
      const g = { grey: 0, dark: 0 }
      const upd = () => { if (gl.current) { gl.current.grey = g.grey; gl.current.dark = g.dark } }

      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.6,
          onUpdate: (s) => {
            if (gl.current) gl.current.visible = s.progress < 0.995
            if (wire.current) wire.current.visible = s.progress < 0.32
          },
          onLeave: () => {
            if (gl.current) gl.current.visible = false
            if (wire.current) wire.current.visible = false
          },
          onEnterBack: () => {
            if (gl.current) gl.current.visible = true
          },
        },
      })
        .fromTo('.hero__stage', { scale: 1, clipPath: 'inset(0% 0% 0% 0% round 0px)' },
          { scale: sc, clipPath: `inset(${iy}% ${ix}% ${iy}% ${ix}% round 16px)`, backgroundColor: '#a3a59e', duration: 0.4 }, 0)
        .to('.hero__wire', { autoAlpha: 0, duration: 0.18 }, 0.06)
        .to(g, { grey: 0.85, duration: 0.4, onUpdate: upd }, 0)
        .to('.hero__ui', { autoAlpha: 0, y: -36, duration: 0.12 }, 0)
        .fromTo('.hero__back', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 0.08)
        .fromTo('.hero__marq', { autoAlpha: 0, yPercent: 8 }, { autoAlpha: 1, yPercent: 0, duration: 0.3 }, 0.12)
        .fromTo('.hero__msg', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.15 }, 0.3)
        .add(drawSignature(root.current.querySelector('.hero__sig'), { duration: 0.46 }), 0.4)
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
      <div className="hero__navmark is-1" data-nav="light" />
      <div className="hero__navmark is-2" data-nav="dark" />
      <div className="hero__sticky">
        <div className="hero__back">
          <div className="hero__back-topo" />
        </div>
        <div className="hero__marq" aria-hidden dir="ltr">
          <div className="hero__row hero__row--serif">{row(hero.marqueeTop)}</div>
          <div className="hero__row hero__row--bold">{row(hero.marqueeBottom)}</div>
        </div>

        <div className="hero__stage">
          <div className="hero__topo hero__topo--a" />
          <div className="hero__topo hero__topo--b" />
          <canvas ref={wireBack} className="hero__wire hero__wire--back" />
          <canvas ref={canvas} className="hero__gl" />
          <canvas ref={wireFront} className="hero__wire hero__wire--front" />
          <img className="hero__fallback" src={hero.imageA} alt={site.nameAr} />
        </div>

        <Signature className="hero__sig" />

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
          <button
            type="button"
            className={`hero__lock ${locked ? 'is-locked' : ''}`}
            onClick={() => setLocked((v) => !v)}
          >
            {locked ? 'العودة للتمرير' : 'اضغط للتفاعل'}
          </button>
          <p className="eyebrow hero__since">{site.since}</p>
        </div>
      </div>
    </section>
  )
}
