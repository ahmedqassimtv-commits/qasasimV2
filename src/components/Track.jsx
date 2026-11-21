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

      // spec: تحوّل لون الصفحة من الداكن للكريمي مع التقدّم الأفقي (والنافبار معاه)
      const st = move.scrollTrigger
      gsap.timeline({ scrollTrigger: { trigger: root.current, start: () => st.start + (st.end - st.start) * 0.25, end: () => st.start + (st.end - st.start) * 0.7, scrub: true } })
        .fromTo(root.current, { backgroundColor: '#11120e', color: '#dde1d2' }, { backgroundColor: '#f4f3ee', color: '#11120e', ease: 'none' }, 0)
        .fromTo('.navw', { '--nf': '#f4f3ee', '--nm': '#d2ff00', '--hb': '#f4f3ee', '--hbd': 'rgba(17,18,14,0)' },
          { '--nf': '#11120e', '--nm': '#11120e', '--hb': 'rgba(244,243,238,0)', '--hbd': 'rgba(17,18,14,1)', ease: 'none', immediateRender: false }, 0)

      // spec: الاقتباس التاني بمسحة قلم تحديد ليموني
      const q2 = root.current.querySelector('.trk__q2 mark')
      if (q2) gsap.fromTo(q2, { backgroundSize: '0% 100%' }, {
        backgroundSize: '100% 100%', ease: 'none',
        scrollTrigger: { trigger: q2, containerAnimation: move, start: 'left 85%', end: 'left 35%', scrub: true },
      })
      // التوقيع تحت الاقتباس بيترسم لما يوصل
      const qs = root.current.querySelector('.trk__sig')
      if (qs) {
        const t = drawSignature(qs, { duration: 1.3, ease: 'power1.inOut' }).pause()
        ScrollTrigger.create({ trigger: qs, containerAnimation: move, start: 'left 80%', once: true, onEnter: () => t.play(0) })
      }
      gsap.utils.toArray('.trk__item').forEach((el, i) => {
        // spec: كل صورة بتتحرك رأسياً بسرعة مختلفة (parallax متدرّج)
        const speed = [-18, 14, -9, 22, -14, 10][i % 6]
        gsap.fromTo(el, { yPercent: -speed }, {
          yPercent: speed, ease: 'none',
          scrollTrigger: { trigger: el, containerAnimation: move, start: 'left right', end: 'right left', scrub: true },
        })
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
          it.cap === 'QUOTE2' ? (
            <blockquote className="trk__q2" key={i}><p><mark>{track.quote2}</mark></p></blockquote>
          ) : it.cap === 'QUOTE' ? (
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
