import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { LogoMark, Roll } from './Bits'
import { hero, site } from '../data/content'
import { logo, logoZoomOrigin } from '../data/logo'

const loadImg = (src) => new Promise((r) => { const i = new Image(); i.onload = i.onerror = () => r(); i.src = src })

/**
 * شاشة التحميل (زي الأصلي):
 * 1) خلفية ليمونية، قطع الشعار بتظهر وتختفي قطعة قطعة في لوب لحد ما الموقع يحمّل.
 * 2) أول ما يجهز: الشعار بيكمل، وبعدين يتحول لـ«شباك» شفاف ويعمل زووم لحد ما يفتح على الموقع.
 */
export default function Preloader({ onDone }) {
  const root = useRef(null)
  const state = useRef({ ready: false })

  useGSAP(() => {
    const pieces = gsap.utils.toArray('.pre__logo .lm-p')
    const rnd = gsap.utils.random(-50, 50, 1, true)
    gsap.set(pieces, { transformOrigin: '50% 50%', scale: 0 })

    // مكان الشعار على الشاشة (نفس مكان .pre__logo) عشان الشباك يطابقه بالظبط
    const svg = root.current.querySelector('.pre__mask')
    const zoom = svg.querySelector('.pre__zoom')
    const place = () => {
      const r = root.current.querySelector('.pre__logo').getBoundingClientRect()
      const W = innerWidth, H = innerHeight, s = r.width / logo.w
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
      svg.querySelector('.pre__at').setAttribute('transform', `translate(${r.left + logoZoomOrigin.x * s} ${r.top + logoZoomOrigin.y * s})`)
      svg.querySelector('.pre__shape').setAttribute('transform', `scale(${s}) translate(${-logoZoomOrigin.x} ${-logoZoomOrigin.y})`)
    }

    const exit = () => {
      loop.pause()
      place()
      const z = { v: 1 }
      gsap.timeline({ onComplete: onDone })
        // الشعار بيكمل كله ويعمل نبضة
        .to(pieces, { scale: 1, rotate: 0, duration: 0.35, ease: 'back.out(2)', stagger: 0.03 })
        .to('.pre__logo', { scale: 1.08, duration: 0.18, ease: 'power2.out' })
        .to('.pre__logo', { scale: 1, duration: 0.25, ease: 'power2.inOut' })
        .to('.pre__btn', { autoAlpha: 0, y: 10, duration: 0.3 }, '<')
        // يتحول لشباك: الليموني بيبقى ماسك والشعار فتحة بيبان منها الموقع
        .set('.pre__fill', { autoAlpha: 0 })
        .set(svg, { autoAlpha: 1 })
        .set('.pre__logo', { autoAlpha: 0 })
        .add(() => window.dispatchEvent(new Event('preloader:out')))
        // زووم من جوه الشعار لحد ما يفتح على الشاشة كلها
        .to(z, {
          v: 260, duration: 1.25, ease: 'expo.in',
          onUpdate: () => zoom.setAttribute('transform', `scale(${z.v})`),
        })
        .to(svg, { autoAlpha: 0, duration: 0.15 })
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
      <div className="pre__fill" />
      {/* الماسك: ليموني في كل حتة ما عدا شكل الشعار */}
      <svg className="pre__mask" aria-hidden>
        <defs>
          <mask id="preHole" maskUnits="userSpaceOnUse" x="-50000" y="-50000" width="100000" height="100000">
            <rect x="-50000" y="-50000" width="100000" height="100000" fill="#fff" />
            <g className="pre__at"><g className="pre__zoom"><g className="pre__shape">
              {logo.paths.map((d, i) => <path key={i} d={d} fillRule="evenodd" fill="#000" />)}
            </g></g></g>
          </mask>
        </defs>
        <rect x="-50000" y="-50000" width="100000" height="100000" fill="#d2ff00" mask="url(#preHole)" />
      </svg>
      <LogoMark className="pre__logo" />
      <button className="pre__btn" data-roll onClick={() => { state.current.ready = true }}>
        <Roll>{site.loadLabel}</Roll>
      </button>
    </div>
  )
}
