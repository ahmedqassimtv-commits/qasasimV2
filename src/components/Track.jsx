import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { track } from '../data/content'
import Signature from './Signature'
import { drawSignature } from '../lib/drawSignature'
import { revealCtx } from '../lib/reveal'

/**
 * مسار أفقي مثبّت: الصور متناثرة بأحجام وارتفاعات مختلفة (مش صف مستقيم)،
 * فوق كل صورة تعليق صغير، الصور تكون باهتة (زيتوني) وتتلوّن لما توصل لنص الشاشة،
 * وفي النص اقتباس بخط سيريف.
 */
export default function Track() {
  const root = useRef(null)
  const rail = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px)', () => {
      const dist = () => rail.current.scrollWidth - window.innerWidth
      const move = gsap.to(rail.current, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: root.current, pin: true, scrub: 1, end: () => '+=' + Math.max(dist(), innerWidth * 0.6) * 1.1, invalidateOnRefresh: true },
      })
      revealCtx.ca = move // النصوص جوه المسار بتظهر مع الحركة الأفقية
      // التوقيع تحت الاقتباس بيترسم لما يوصل
      const qs = root.current.querySelector('.trk__sig')
      if (qs) {
        const t = drawSignature(qs, { duration: 1.3, ease: 'power1.inOut' }).pause()
        ScrollTrigger.create({ trigger: qs, containerAnimation: move, start: 'left 80%', once: true, onEnter: () => t.play(0) })
      }
      gsap.utils.toArray('.trk__item').forEach((el) => {
        const img = el.querySelector('img')
        if (img) gsap.fromTo(img, { xPercent: -6 }, {
          xPercent: 6, ease: 'none',
          scrollTrigger: { trigger: el, containerAnimation: move, start: 'left right', end: 'right left', scrub: true },
        })
        ScrollTrigger.create({
          trigger: el, containerAnimation: move, start: 'left 72%', end: 'right 28%',
          toggleClass: { targets: el, className: 'is-lit' },
        })
      })
      return () => { revealCtx.ca = null }
    })
    mm.add('(max-width: 767px)', () => {
      revealCtx.ca = null
      const qs = root.current.querySelector('.trk__sig')
      if (qs) {
        const t = drawSignature(qs, { duration: 1.3, ease: 'power1.inOut' }).pause()
        ScrollTrigger.create({ trigger: qs, start: 'top 85%', once: true, onEnter: () => t.play(0) })
      }
    })
    return () => mm.revert()
  }, { scope: root })

  const q = track.quote
  return (
    <section className="trk topo topo--olive" ref={root} data-nav="dark">
      <div className="trk__rail" ref={rail} dir="ltr">
        {track.items.map((it, i) =>
          it.cap === 'QUOTE' ? (
            <blockquote className="trk__quote" key={i}>
              <p data-hl>{q.before}<b>{q.b1}</b>{q.mid}<b>{q.b2}</b>{q.after}</p>
              <Signature className="trk__sig" />
            </blockquote>
          ) : (
            <figure className={`trk__item trk__item--${it.size} ${it.mute ? 'is-mute' : ''}`} key={i} style={{ '--y': it.y + 'vh' }}>
              <figcaption className="eyebrow" data-hl>{it.cap}</figcaption>
              <div className="trk__img"><img src={it.src} alt={it.cap} loading="lazy" /><span className="trk__tint" /></div>
            </figure>
          )
        )}
      </div>
    </section>
  )
}
