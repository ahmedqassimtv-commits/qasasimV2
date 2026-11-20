import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { message, site } from '../data/content'

// نص ضخم في النص — كل كلمة تطلع وتنوّر مع التمرير، والكلمات المهمة بخط تاني وليموني
export default function Message() {
  const root = useRef(null)

  useGSAP(() => {
    gsap.fromTo('.msg__w', { opacity: 0.08, yPercent: 30 }, {
      opacity: 1, yPercent: 0, stagger: 0.12, ease: 'power1.out',
      scrollTrigger: { trigger: '.msg__text', start: 'top 85%', end: 'bottom 55%', scrub: true },
    })
  }, { scope: root })

  const parts = message.split(/(\[\[[^\]]+\]\])/).filter(Boolean)
  let k = 0
  return (
    <section className="msg topo topo--dark" ref={root} data-nav="dark">
      <p className="eyebrow eyebrow--lime">{site.since}</p>
      <h2 className="msg__text">
        {parts.map((p) => {
          const hi = p.startsWith('[[')
          return p.replace(/\[\[|\]\]/g, '').split(/\s+/).filter(Boolean).map((w) => (
            <span key={k++} className={`msg__w ${hi ? 'is-hi' : ''}`}>{w}{' '}</span>
          ))
        })}
      </h2>
    </section>
  )
}
