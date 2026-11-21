import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { hall, channelVideosUrl } from '../data/content'
import { Btn, LogoMark } from './Bits'

// إطار البطاقة بالـ "notch": الحافة السفلية ترتفع بمنحنى ويقعد العنوان تحتها (زي كروت الخوذ)
function notchPath(w, h, r = 12, notchW = 0.45, notchH = 30) {
  const nx = w * (1 - notchW) // بداية الجزء المرتفع (RTL: العنوان على الشمال)
  const y2 = h - notchH
  return `M${r} 0H${w - r}Q${w} 0 ${w} ${r}V${h - r}Q${w} ${h} ${w - r} ${h}`
    + `H${nx + 26}C${nx + 6} ${h} ${nx + 8} ${y2} ${nx - 14} ${y2}`
    + `H${r}Q0 ${y2} 0 ${y2 - r}V${r}Q0 0 ${r} 0Z`
}

function Card({ it }) {
  const ref = useRef(null)
  const svg = useRef(null)
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => {
      const { width: w, height: h } = e.contentRect
      if (w < 2 || h < 2 || !svg.current) return
      svg.current.setAttribute('viewBox', `0 0 ${w} ${h}`)
      svg.current.firstChild.setAttribute('d', notchPath(w - 1, h - 1))
    })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  return (
    <div className="hc" ref={ref}>
      <svg className="hc__frame" ref={svg} preserveAspectRatio="none"><path transform="translate(.5 .5)" /></svg>
      <div className="hc__img">
        <img src={it.img} alt={it.name} loading="lazy" />
      </div>
      <img src={it.alt} alt="" loading="lazy" className="hc__full" />
      <div className="hc__label"><b>{it.name}</b><span>{it.year}</span></div>
    </div>
  )
}

export default function Hall() {
  const root = useRef(null)

  useGSAP(() => {
    gsap.utils.toArray('.hall__feat').forEach((el, i) => {
      gsap.fromTo(el, { y: [140, 35, 220][i] }, {
        y: [-140, -35, -220][i], rotate: [-3.5, 1.8, 4][i], ease: 'none',
        scrollTrigger: { trigger: '.hall__feats', start: 'top bottom', end: 'bottom top', scrub: true },
      })
    })
    // parallax أعمدة الكروت على الديسكتوب فقط عشان متتداخلش على الموبايل
    const mm = gsap.matchMedia()
    mm.add('(min-width: 901px)', () => {
      gsap.utils.toArray('.hall__cardwrap').forEach((el, i) => {
        const odd = i % 2 === 1
        gsap.fromTo(el, { y: odd ? 56 : 0 }, {
          y: odd ? -56 : 0, ease: 'none',
          scrollTrigger: { trigger: '.hall__grid', start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })
    })
    return () => mm.revert()
  }, { scope: root })

  return (
    <section className="hall" id="episodes" ref={root} data-nav="dark">
      <header className="hall__head">
        <div>
          <p className="eyebrow eyebrow--lime" data-hl>{hall.eyebrow}</p>
          <h3 className="hall__title" data-hl>
            <span className="t-bold">{hall.title[0]}</span>
            <span className="serif">{hall.title[1]}</span>
          </h3>
        </div>
        <p className="hall__intro" data-hl>{hall.intro}</p>
      </header>
      <div className="hall__feats">
        {hall.feats.map((f, i) => <div className="hall__feat" key={i}><img src={f} alt="" /></div>)}
      </div>
      {/* شبكة مرنة تعرض كل الأعمال على الموبايل والديسكتوب بدون إخفاء أي عنصر */}
      <div className="hall__grid">
        {hall.items.map((it) => (
          <div className="hall__cardwrap" key={it.name}>
            <Card it={it} />
          </div>
        ))}
      </div>
      <div className="hall__more">
        <LogoMark className="hall__more-logo" />
        <p data-hl>شوف حلقات أكتر ولقطات من الاستوديو</p>
        <Btn href={channelVideosUrl} target="_blank" rel="noreferrer">كل الأعمال</Btn>
      </div>
    </section>
  )
}
