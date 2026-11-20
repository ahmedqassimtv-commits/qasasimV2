import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { message, site } from '../data/content'
import { LogoMark } from './Bits'

// نص ضخم في النص — كل كلمة تطلع وتنوّر مع التمرير، والكلمات المهمة بخط تاني وليموني
export default function Message() {
  const root = useRef(null)

  useGSAP(() => {
    // لوجو صغير بيتجمع قبل النص (زي الخوذة في الأصلي) — النص نفسه بيظهر بالشريط الليموني (data-hl)
    gsap.from('.msg__logo .lm-p', {
      scale: 0, rotate: () => gsap.utils.random(-40, 40), transformOrigin: '50% 50%', stagger: 0.08, duration: 0.55, ease: 'back.out(2.2)',
      scrollTrigger: { trigger: root.current, start: 'top 70%' },
    })
  }, { scope: root })

  const parts = message.split(/(\[\[[^\]]+\]\])/).filter(Boolean)
  let k = 0
  return (
    <section className="msg topo topo--dark" ref={root} data-nav="dark">
      <LogoMark className="msg__logo" />
      <p className="eyebrow eyebrow--lime" data-hl>{site.since}</p>
      <h2 className="msg__text" data-hl>
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
