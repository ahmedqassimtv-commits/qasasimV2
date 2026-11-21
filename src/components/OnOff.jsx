import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { onoff } from '../data/content'
import { scroll } from '../hooks/useLenis'
import { ArrowIcon } from './Bits'

const COLS = 16, ROWS = 4

/**
 * «على الهواء / خلف الكواليس» — مطابق تماماً لتصميم ON TRACK / OFF TRACK (image_2.png):
 * - صورتا البروفايل الجانبيتان side-1.webp (يمين) و side-2.webp (شمال) «وش في وش» بكامل الارتفاع،
 *   تدخلان من الحافتين مع التمرير وتقترب الصورة المقابلة للعمود عند الـ hover.
 * - خط يد ليموني جريء يمر فوق العنوان مع الـ hover.
 * - خلفية كنتورية حية + انتقال مربعات سلس للقسم الداكن أسفله.
 */
export default function OnOff() {
  const root = useRef(null)
  const [hover, setHover] = useState(-1)

  useGSAP(() => {
    // حركة لطيفة للخلفية الكنتورية
    gsap.to('.oo__topo', { xPercent: -2.5, yPercent: 2, duration: 20, ease: 'sine.inOut', repeat: -1, yoyo: true })

    // الصورتين الجانبيتين بيدخلوا من الحافتين ويقربوا من بعض مع التمرير
    gsap.utils.toArray('.oo__side').forEach((el, i) => {
      const out = i === 0 ? 1 : -1 // الأولى على اليمين تدخل من اليمين (+x)، التانية على الشمال تدخل من الشمال (-x)
      gsap.fromTo(el, { xPercent: out * 65 }, {
        xPercent: 0, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top 90%', end: 'top 15%', scrub: 0.7 },
      })
      gsap.fromTo(el.querySelector('img'), { yPercent: 5 }, {
        yPercent: -3, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    })

    // انتقال المربعات في آخر القسم نحو القسم الداكن
    const cells = gsap.utils.toArray('.oo__px i')
    gsap.fromTo(cells, { scale: 0 }, {
      scale: 1, ease: 'none',
      stagger: { each: 0.02, from: 'end', grid: [ROWS, COLS], amount: 0.8, ease: 'power1.in' },
      scrollTrigger: { trigger: root.current, start: 'bottom 88%', end: 'bottom 28%', scrub: 0.5 },
    })
  }, { scope: root })

  const jump = (idx) => (e) => {
    e.preventDefault()
    const target = document.querySelector(idx === 0 ? '#videos' : '#articles')
    if (!target) return
    if (scroll.lenis) scroll.lenis.scrollTo(target, { duration: 1.1 })
    else target.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className={`oo ${hover > -1 ? 'has-hover' : ''}`} ref={root} data-nav="light">
      <div className="oo__topo" aria-hidden />
      {onoff.map((o, i) => (
        <div key={o.id} className={`oo__side oo__side--${i} ${hover === i ? 'is-on' : ''}`} aria-hidden>
          <img src={o.side} alt="" style={o.flip ? { scale: '-1 1' } : undefined} />
        </div>
      ))}

      <div className="oo__cols">
        {onoff.map((o, i) => (
          <a
            key={o.id}
            id={o.id}
            href={i === 0 ? '#videos' : '#articles'}
            className={`oo__col oo__col--${i} ${hover === i ? 'is-on' : ''}`}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(-1)}
            onClick={jump(i)}
          >
            <h3 className="oo__h" data-hl>
              <span className="oo__top">{o.top}</span>
              <span className="oo__bottom">{o.bottom}</span>
            </h3>
            <span className="oo__script" aria-hidden>{o.script}</span>
            <p data-hl>{o.text}</p>
            <span className="sqbtn"><ArrowIcon /></span>
          </a>
        ))}
      </div>

      <div className="oo__px" aria-hidden>
        {Array.from({ length: COLS * ROWS }, (_, i) => <i key={i} />)}
      </div>
    </section>
  )
}
