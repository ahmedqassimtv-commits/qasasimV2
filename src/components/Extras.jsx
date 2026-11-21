import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LogoMark } from './Bits'
import { scroll } from '../hooks/useLenis'
import { initVelocity } from '../lib/velocity'

/**
 * إضافات «الخلطة السرية» من الأصلي:
 * 1) شاشة انتقال (transition-w): أي لينك داخلي (#قسم) بيعمل ستارة ليموني + اللوجو بيتجمع، والموقع بينقل للقسم وراها.
 * 2) مؤشر تقدّم التمرير (scroll-indicator).
 * 3) سرعة التمرير كمتغير CSS (للصور اللي بتتمط مع السرعة).
 * 4) خلفية الخطوط الكنتور في كل قسم بتتحرك مع السكرول.
 */
export default function Extras({ ready }) {
  const wipe = useRef(null)
  const bar = useRef(null)

  useEffect(() => {
    if (!ready) return
    const stopVel = initVelocity()

    // مؤشر التقدّم
    const prog = ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (s) => gsap.set(bar.current, { scaleY: s.progress }),
    })

    // خلفيات الكنتور بتتحرك بالعرض مع السكرول (الصورة cover فبتتحرك في المساحة الزيادة)
    const bgs = gsap.utils.toArray('section.topo, .ft__panel.topo').map((el) =>
      gsap.fromTo(el, { backgroundPosition: '35% 50%' }, {
        backgroundPosition: '65% 50%', ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    )

    // انتقال اللينكات الداخلية
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return
      const id = a.getAttribute('href')
      const target = id === '#' ? document.body : document.querySelector(id)
      if (!target) return
      e.preventDefault()
      const pieces = wipe.current.querySelectorAll('.lm-p')
      gsap.timeline()
        .set(wipe.current, { visibility: 'visible' })
        .fromTo(wipe.current, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'expo.inOut' })
        .fromTo(pieces, { scale: 0, rotate: () => gsap.utils.random(-40, 40) },
          { scale: 1, rotate: 0, transformOrigin: '50% 50%', stagger: 0.06, duration: 0.45, ease: 'back.out(2.2)' }, '-=0.15')
        .add(() => {
          const y = id === '#' ? 0 : target.getBoundingClientRect().top + window.scrollY
          if (scroll.lenis?.scrollTo) scroll.lenis.scrollTo(y, { immediate: true, force: true })
          else window.scrollTo(0, y)
          ScrollTrigger.update()
        })
        .to(pieces, { scale: 0, stagger: 0.04, duration: 0.3, ease: 'back.in(2)' }, '+=0.15')
        .to(wipe.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.7, ease: 'expo.inOut' }, '-=0.1')
        .set(wipe.current, { visibility: 'hidden' })
    }
    document.addEventListener('click', onClick)

    return () => { stopVel(); prog.kill(); bgs.forEach((t) => t.scrollTrigger?.kill()); document.removeEventListener('click', onClick) }
  }, [ready])

  return (
    <>
      <div className="wipe" ref={wipe} aria-hidden><LogoMark /></div>
      <div className="progress" aria-hidden><i ref={bar} /></div>
    </>
  )
}
