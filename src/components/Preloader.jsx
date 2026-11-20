import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { LogoMark, Roll } from './Bits'
import { hero, site } from '../data/content'

const loadImg = (src) => new Promise((r) => { const i = new Image(); i.onload = i.onerror = () => r(); i.src = src })

/**
 * شاشة التحميل: خلفية ليمونية، قطع الشعار تظهر قطعة قطعة (pop + rotate)
 * ثم تختفي بنفس الترتيب وتعيد — في لوب لحد ما الموقع يجهز،
 * وأول ما يجهز توقف عند الشعار كامل وتطلع الستارة لفوق.
 */
export default function Preloader({ onDone }) {
  const root = useRef(null)
  const state = useRef({ ready: false })

  useGSAP(() => {
    const pieces = gsap.utils.toArray('.pre .lm-p')
    const rnd = gsap.utils.random(-50, 50, 1, true)
    gsap.set(pieces, { transformOrigin: '50% 50%', scale: 0 })

    const exit = () => {
      loop.pause()
      gsap.timeline({ onComplete: onDone })
        .to(pieces, { scale: 1.12, duration: 0.18, ease: 'power2.out', stagger: 0.03 })
        .to(pieces, { scale: 0, rotate: () => rnd(), duration: 0.35, ease: 'back.in(2.2)', stagger: 0.04 })
        .to('.pre__btn', { opacity: 0, y: 10, duration: 0.3 }, '<')
        .add(() => window.dispatchEvent(new Event('preloader:out')), '-=0.15')
        .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.05, ease: 'expo.inOut' }, '-=0.15')
    }

    const loop = gsap.timeline({ repeat: -1, delay: 0.2 })
      .fromTo(pieces, { scale: 0, rotate: () => rnd() },
        { scale: 1, rotate: 0, duration: 0.55, ease: 'back.out(2.4)', stagger: 0.12 })
      .call(() => { if (state.current.ready) exit() }, null, '+=0.35')
      .to(pieces, { scale: 0, rotate: () => rnd(), duration: 0.34, ease: 'back.in(2)', stagger: 0.09 }, '+=0.25')
      .to({}, { duration: 0.12 })

    const minTime = new Promise((r) => setTimeout(r, 1800))
    const loaded = new Promise((r) => (document.readyState === 'complete' ? r() : window.addEventListener('load', r, { once: true })))
    Promise.all([minTime, loaded, document.fonts?.ready, loadImg(hero.imageA), loadImg(hero.imageB)])
      .then(() => { state.current.ready = true })
  }, { scope: root })

  return (
    <div className="pre" ref={root}>
      <LogoMark className="pre__logo" />
      <button className="pre__btn" data-roll onClick={() => { state.current.ready = true }}>
        <Roll>{site.loadLabel}</Roll>
      </button>
    </div>
  )
}
