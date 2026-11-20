import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { track } from '../data/content'

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
        scrollTrigger: { trigger: root.current, pin: true, scrub: 1, end: () => '+=' + dist() * 1.1, invalidateOnRefresh: true },
      })
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
              <svg viewBox="0 0 120 40" className="trk__sig"><path d="M6 30c18-4 30-22 42-22-6 10-14 18-6 20 10 2 22-18 30-16-4 6-6 12 0 12 8 0 18-8 40-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
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
