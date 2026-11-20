import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { hall, channelVideosUrl } from '../data/content'
import { Btn } from './Bits'

// إطار البطاقة بالـ "notch": الحافة السفلية ترتفع بمنحنى ويقعد العنوان تحتها (زي كروت الخوذ)
function notchPath(w, h, r = 12, notchW = 0.45, notchH = 30) {
  const nx = w * (1 - notchW) // بداية الجزء المرتفع (RTL: العنوان على الشمال)
  const y2 = h - notchH
  // نبدأ أعلى اليمين ونمشي عكس عقارب الساعة
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
      svg.current.setAttribute('viewBox', `0 0 ${w} ${h}`)
      svg.current.firstChild.setAttribute('d', notchPath(w - 1, h - 1).replace(/^M/, 'M'))
    })
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  return (
    <div className="hc" ref={ref}>
      <svg className="hc__frame" ref={svg} preserveAspectRatio="none"><path transform="translate(.5 .5)" /></svg>
      <div className="hc__img">
        <img src={it.img} alt={it.name} loading="lazy" />
        <img src={it.alt} alt="" loading="lazy" className="hc__alt" />
      </div>
      <div className="hc__label"><b>{it.name}</b><span>{it.year}</span></div>
    </div>
  )
}

export default function Hall() {
  const root = useRef(null)

  useGSAP(() => {
    gsap.from('.hall__title > span', {
      yPercent: 110, stagger: 0.1, duration: 1.1, ease: 'expo.out',
      scrollTrigger: { trigger: '.hall__head', start: 'top 75%' },
    })
    gsap.utils.toArray('.hall__feat').forEach((el, i) => {
      gsap.fromTo(el, { y: [160, 40, 260][i] }, {
        y: [-160, -40, -260][i], rotate: [-4, 2, 5][i], ease: 'none',
        scrollTrigger: { trigger: '.hall__feats', start: 'top bottom', end: 'bottom top', scrub: true },
      })
    })
    // الكروت تدخل في أعمدة بإزاحة (masonry-like): كل عمود بسرعة مختلفة
    gsap.utils.toArray('.hall__col').forEach((col, i) => {
      gsap.fromTo(col, { y: i % 2 ? 120 : 0 }, {
        y: i % 2 ? -120 : 0, ease: 'none',
        scrollTrigger: { trigger: '.hall__grid', start: 'top bottom', end: 'bottom top', scrub: true },
      })
    })
  }, { scope: root })

  const cols = [0, 1, 2, 3].map((c) => hall.items.filter((_, i) => i % 4 === c))
  return (
    <section className="hall" id="episodes" ref={root} data-nav="dark">
      <header className="hall__head">
        <p className="eyebrow eyebrow--lime">{hall.eyebrow}</p>
        <h3 className="hall__title"><span className="serif">{hall.title[0]}</span><span>{hall.title[1]}</span></h3>
        <p className="hall__intro">{hall.intro}</p>
      </header>
      <div className="hall__feats">
        {hall.feats.map((f, i) => <div className="hall__feat" key={i}><img src={f} alt="" /></div>)}
      </div>
      <div className="hall__grid">
        {cols.map((c, i) => <div className="hall__col" key={i}>{c.map((it) => <Card key={it.name} it={it} />)}</div>)}
      </div>
      <div className="hall__more">
        <p>شوف حلقات أكتر ولقطات من الاستوديو</p>
        <Btn href={channelVideosUrl} target="_blank" rel="noreferrer">كل الأعمال</Btn>
      </div>
    </section>
  )
}
