import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { onoff } from '../data/content'
import { ArrowIcon } from './Bits'

/**
 * "على الهواء / خلف الكواليس": عنوانين في النص (سيريف فوق + عريض تحت)،
 * عند الـ hover تظهر كلمة بخط يد ليموني فوق العنوان، والصورة الجانبية تدخل أكتر للشاشة.
 */
export default function OnOff() {
  const root = useRef(null)
  const [hover, setHover] = useState(-1)

  useGSAP(() => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 65%' } })
    tl.from('.oo__side', { xPercent: (i) => (i ? -100 : 100), duration: 1.4, ease: 'expo.out' })
      .from('.oo__h > span', { yPercent: 110, stagger: 0.08, duration: 1, ease: 'expo.out' }, 0.15)
      .from('.oo__col p, .oo__col .sqbtn', { y: 20, autoAlpha: 0, stagger: 0.06, duration: 0.8, ease: 'power3.out' }, 0.4)
    gsap.to('.oo__side img', {
      yPercent: -8, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
    })
  }, { scope: root })

  return (
    <section className={`oo topo topo--light ${hover > -1 ? 'has-hover' : ''}`} ref={root} data-nav="light">
      {onoff.map((o, i) => (
        <div key={o.id} className={`oo__side oo__side--${i} ${hover === i ? 'is-on' : ''}`}>
          <img src={o.side} alt="" />
        </div>
      ))}
      <div className="oo__cols">
        {onoff.map((o, i) => (
          <a key={o.id} id={o.id} href={`#${o.id}`} className={`oo__col ${hover === i ? 'is-on' : ''}`}
            onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(-1)}>
            <h3 className="oo__h">
              <span className="oo__top">{o.top}</span>
              <span className="oo__bottom">{o.bottom}</span>
            </h3>
            <span className="oo__script" aria-hidden>{o.script}</span>
            <p>{o.text}</p>
            <span className="sqbtn"><ArrowIcon /></span>
          </a>
        ))}
      </div>
    </section>
  )
}
