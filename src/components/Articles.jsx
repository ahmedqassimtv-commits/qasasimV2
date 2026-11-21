import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { articles } from '../data/content'
import { Btn, ArrowIcon } from './Bits'

/**
 * المقالات — بنفس لغة الموقع:
 * عنوان على اليمين ونص على الشمال، وتحته قائمة صفوف كبيرة (رقم، تصنيف، عنوان، تاريخ).
 * مع الـ hover: صورة المقال بتطلع وتمشي ورا الماوس، والصف بيتلوّن، والسهم بيلف.
 */
export default function Articles() {
  const root = useRef(null)
  const prev = useRef(null)
  const [active, setActive] = useState(-1)

  useGSAP(() => {
    // الخطوط الفاصلة بتترسم والصفوف بتطلع واحد ورا التاني
    gsap.utils.toArray('.ar__row').forEach((row) => {
      gsap.fromTo(row.querySelector('.ar__rule'), { scaleX: 0 }, {
        scaleX: 1, duration: 1.1, ease: 'expo.inOut',
        scrollTrigger: { trigger: row, start: 'top 92%' },
      })
    })
    const list = root.current.querySelector('.ar__list')
    const xTo = gsap.quickTo(prev.current, 'x', { duration: 0.6, ease: 'power3' })
    const yTo = gsap.quickTo(prev.current, 'y', { duration: 0.6, ease: 'power3' })
    const move = (e) => {
      const r = list.getBoundingClientRect()
      xTo(e.clientX - r.left); yTo(e.clientY - r.top)
    }
    list.addEventListener('pointermove', move, { passive: true })
    return () => list.removeEventListener('pointermove', move)
  }, { scope: root })

  const cur = articles.items[active]

  return (
    <section className="ar topo topo--light" id="articles" ref={root} data-nav="light">
      <header className="ar__head">
        <div>
          <p className="eyebrow" data-hl>{articles.eyebrow}</p>
          <h3 className="ar__title" data-hl>
            <span className="t-bold">{articles.title[0]}</span>
            <span className="serif">{articles.title[1]}</span>
          </h3>
        </div>
        <p className="ar__intro" data-hl>{articles.intro}</p>
      </header>

      <div className="ar__list" onMouseLeave={() => setActive(-1)}>
        <div className={`ar__prev ${cur ? 'is-on' : ''}`} ref={prev} aria-hidden>
          {articles.items.map((a, i) => (
            <div key={i} className={`ar__prev-img ${i === active ? 'is-active' : ''}`}>
              {a.img ? <img src={a.img} alt="" /> : <span className="ar__prev-txt">{a.category}</span>}
            </div>
          ))}
        </div>

        {articles.items.map((a, i) => (
          <a key={i} href={a.href} target="_blank" rel="noreferrer"
            className={`ar__row ${active === i ? 'is-on' : ''} ${active > -1 && active !== i ? 'is-dim' : ''}`}
            onMouseEnter={() => setActive(i)}>
            <span className="ar__rule" />
            <span className="ar__num">{String(i + 1).padStart(2, '0')}</span>
            <span className="ar__meta">
              <span className="ar__kind">{a.kind}</span>
              <span className="eyebrow">{a.category}</span>
            </span>
            <span className="ar__main">
              <strong className="ar__name">{a.title}</strong>
              <span className="ar__ex">{a.excerpt}</span>
            </span>
            <span className="ar__date eyebrow">{a.date}</span>
            {a.img && <span className="ar__thumb"><img src={a.img} alt="" loading="lazy" /></span>}
            <span className="sqbtn ar__go"><ArrowIcon /></span>
          </a>
        ))}
        <span className="ar__rule ar__rule--end" />
      </div>

      <div className="ar__more">
        <Btn href={articles.all} theme="dark" target="_blank" rel="noreferrer">كل المقالات</Btn>
      </div>
    </section>
  )
}
