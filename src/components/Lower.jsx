import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { videos, posts, socials, nav, site } from '../data/content'
import { scroll } from '../hooks/useLenis'
import { Btn, LogoMark, NameLockup, Roll, PlayIcon } from './Bits'

/* ================= أحدث الفيديوهات (يوتيوب) ================= */
export function Videos() {
  const root = useRef(null)
  const [playing, setPlaying] = useState(null)

  useGSAP(() => {
    // المروحة ديسكتوب بس — على الموبايل الكروت صف تمرير أفقي ثابت
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px)', () => {
      const cards = gsap.utils.toArray('.vd__card')
      const mid = (cards.length - 1) / 2
      // الكروت متكوّمة في النص وبتتفرد زي المروحة مع التمرير
      gsap.fromTo(cards,
        { rotate: (i) => (i - mid) * 2, xPercent: (i) => (mid - i) * 70, y: 80 },
        {
          rotate: (i) => (i - mid) * 6, xPercent: 0, y: (i) => Math.abs(i - mid) ** 1.5 * 26, ease: 'none',
          scrollTrigger: { trigger: '.vd__fan', start: 'top 95%', end: 'center 45%', scrub: 1 },
        })
    })
    gsap.from('.vd__title > span', { yPercent: 110, stagger: 0.1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 70%' } })
  }, { scope: root })

  useEffect(() => {
    if (playing) scroll.lenis?.stop(); else scroll.lenis?.start()
    const esc = (e) => e.key === 'Escape' && setPlaying(null)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [playing])

  const open = (v) => (e) => {
    if (!v.id) return // لسه مفيش id — اللينك هيروح للقناة
    e.preventDefault(); setPlaying(v)
  }

  return (
    <section className="vd topo topo--dark" id="videos" ref={root} data-nav="dark">
      <p className="eyebrow eyebrow--lime">{videos.eyebrow}</p>
      <h3 className="vd__title"><span>{videos.title[0]}</span><span className="serif">{videos.title[1]}</span></h3>
      <p className="vd__text">{videos.text}</p>
      <Btn href={`${site.youtube}?sub_confirmation=1`} icon={<PlayIcon />} target="_blank" rel="noreferrer">اشترك في القناة</Btn>
      <div className="vd__fan">
        {videos.items.map((v, i) => (
          <a key={i} className="vd__card" href={v.id ? `https://www.youtube.com/watch?v=${v.id}` : site.youtube}
            target="_blank" rel="noreferrer" onClick={open(v)} style={{ zIndex: 10 - Math.abs(i - 2) }}>
            <div className="vd__thumb"><img src={v.thumb} alt={v.title} loading="lazy" /><span className="vd__play"><PlayIcon /></span></div>
            <div className="vd__info"><b>{v.title}</b><span>{v.meta}</span></div>
          </a>
        ))}
      </div>
      {playing && (
        <div className="vd__modal" onClick={() => setPlaying(null)}>
          <div className="vd__player" onClick={(e) => e.stopPropagation()}>
            <iframe src={`https://www.youtube-nocookie.com/embed/${playing.id}?autoplay=1&rel=0`} title={playing.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
          </div>
          <button className="vd__close" aria-label="إغلاق">×</button>
        </div>
      )}
    </section>
  )
}

/* ================= السوشيال: كروت مروحة ================= */
export function Socials() {
  const root = useRef(null)
  useGSAP(() => {
    // المروحة ديسكتوب بس — على الموبايل الكروت صف تمرير أفقي ثابت
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px)', () => {
      const cards = gsap.utils.toArray('.so__card')
      const mid = (cards.length - 1) / 2
      gsap.fromTo(cards,
        { xPercent: 0, rotate: (i) => (i - mid) * 2, y: 80 },
        {
          xPercent: (i) => (i - mid) * 58, rotate: (i) => (i - mid) * 9, y: (i) => Math.abs(i - mid) ** 1.6 * 22, ease: 'none',
          scrollTrigger: { trigger: '.so__fan', start: 'top 90%', end: 'center 50%', scrub: 1 },
        })
    })
    gsap.from('.so__title > span', { yPercent: 110, stagger: 0.1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 70%' } })
  }, { scope: root })
  return (
    <section className="so topo topo--light" ref={root} data-nav="light">
      <h3 className="so__title"><span>إيه الجديد</span><span className="serif">على السوشيال</span></h3>
      <div className="so__fan">
        {posts.map((p, i) => (
          <a href={p.href} className="so__card" key={i} style={{ zIndex: 10 - Math.abs(i - 3) }} target="_blank" rel="noreferrer">
            <img src={p.src} alt="" loading="lazy" />
          </a>
        ))}
      </div>
      <p className="so__follow serif">تابع أحمد على السوشيال</p>
      <div className="so__links">{socials.map((s) => <Btn key={s.label} href={s.href} theme="outline">{s.label}</Btn>)}</div>
    </section>
  )
}

/* ================= الفوتر ================= */
export function Footer() {
  const root = useRef(null)
  useGSAP(() => {
    gsap.from('.ft__tag > span', {
      yPercent: 115, stagger: 0.1, duration: 1.2, ease: 'expo.out',
      scrollTrigger: { trigger: '.ft__tag', start: 'top 92%' },
    })
    gsap.from('.ft__mark .lm-p', {
      scale: 0, rotate: () => gsap.utils.random(-50, 50), transformOrigin: '50% 50%', stagger: 0.1, duration: 0.6, ease: 'back.out(2.2)',
      scrollTrigger: { trigger: '.ft__mark', start: 'top 90%' },
    })
    gsap.utils.toArray('.ft__blobs circle').forEach((c, i) => gsap.to(c, {
      attr: { cx: `+=${gsap.utils.random(-70, 70)}`, cy: `+=${gsap.utils.random(-40, 40)}` },
      duration: gsap.utils.random(3, 6), repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.2,
    }))
  }, { scope: root })
  return (
    <footer className="ft" ref={root} data-nav="dark">
      <svg className="ft__blobs" viewBox="0 0 800 400" aria-hidden>
        <defs><filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="18" /><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 28 -12" /></filter></defs>
        <g filter="url(#goo)" fill="#d2ff00" opacity=".9">
          <circle cx="150" cy="200" r="70" /><circle cx="260" cy="170" r="55" /><circle cx="420" cy="230" r="90" /><circle cx="560" cy="180" r="60" /><circle cx="660" cy="240" r="50" />
        </g>
      </svg>
      <div className="ft__top">
        <div className="ft__col"><p className="eyebrow">الصفحات</p>{nav.map((n) => <a key={n.label} href={n.href} className="tlink" data-roll><Roll>{n.label}</Roll></a>)}<a href={site.youtube} className="tlink" data-roll target="_blank" rel="noreferrer"><Roll>يوتيوب</Roll></a></div>
        <div className="ft__col"><p className="eyebrow">تابعنا</p>{socials.map((s) => <a key={s.label} href={s.href} className="tlink" data-roll><Roll>{s.label}</Roll></a>)}</div>
        <div className="ft__col"><p className="eyebrow">النشرة</p><Btn href={`${site.youtube}?sub_confirmation=1`} target="_blank" rel="noreferrer">اشترك</Btn></div>
      </div>
      <LogoMark className="ft__mark" />
      <h2 className="ft__tag"><span className="serif">{site.tagline[0]}</span><span>{site.tagline[1]}</span></h2>
      <div className="ft__bottom">
        <NameLockup withMark={false} />
        <a href={`mailto:${site.email}`} className="tlink" data-roll><Roll>للتعاون والإعلانات</Roll></a>
        <span className="ft__legal">© {new Date().getFullYear()} {site.nameAr} · <a href="#">الخصوصية</a> · <a href="#">الشروط</a></span>
      </div>
    </footer>
  )
}
