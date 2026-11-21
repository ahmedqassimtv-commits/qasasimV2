import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { site } from '../data/content'
import { marquee } from '../lib/marquee'
import { LogoMark, Btn, ArrowIcon } from './Bits'

// مفيش رعاة حقيقيين لسه — دي أنواع التعاون المتاحة، تتبدّل بلوجوهات البراندات لما تيجي
const kinds = ['إعلانات مدمجة', 'مراجعات أفلام', 'تغطية مهرجانات', 'حلقات برعاية', 'شورتس', 'محتوى مشترك']

/**
 * قسم التعاونات (spec §8): خلفية فاتحة، عنوان بكتل سودا، كلمة «تعاونات» بخط يد ليموني ضخم
 * بترسم نفسها مع السكرول (stroke-dashoffset)، وماركي لا نهائي بدون فواصل.
 */
export default function Collabs() {
  const root = useRef(null)

  useGSAP(() => {
    const t = root.current.querySelector('.cb__script text')
    gsap.set(t, { strokeDasharray: 1600, strokeDashoffset: 1600, fillOpacity: 0 })
    gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'center 45%', scrub: 0.6 } })
      .to(t, { strokeDashoffset: 0, ease: 'none' })
      .to(t, { fillOpacity: 1, duration: 0.25, ease: 'none' }, '-=0.2')
    const stop = marquee(root.current.querySelector('.cb__row'), { speed: 60, dir: 1 })
    return () => stop?.()
  }, { scope: root })

  const row = [...kinds, ...kinds, ...kinds]
  return (
    <section className="cb topo topo--light" id="collabs" ref={root} data-nav="light">
      <p className="eyebrow" data-hl>شغل مشترك</p>
      <h2 className="cb__title" data-hl>عندك براند وعايز توصل<br />لجمهور بيحب السينما؟</h2>
      <svg className="cb__script" viewBox="0 0 900 260" aria-hidden>
        <text x="450" y="200" textAnchor="middle">تعاونات</text>
      </svg>
      <div className="cb__mq" dir="ltr" aria-hidden>
        <div className="cb__row">
          {row.map((k, i) => <span key={i}>{k}<LogoMark className="cb__mark" /></span>)}
        </div>
      </div>
      <div className="cb__cta">
        <Btn href={`mailto:${site.email}`} theme="dark" icon={<ArrowIcon />}>كلمني على الإيميل</Btn>
      </div>
    </section>
  )
}
