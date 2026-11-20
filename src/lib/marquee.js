import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Marquee سلس بلا تقطيع: بيتحرك على ساعة GSAP (مش tween بيتكرر)،
 * وسرعته بتزيد مع سرعة التمرير وبترجع لوحدها.
 * row: عنصر فيه نسختين متطابقتين من المحتوى (أو أكتر بعدد زوجي).
 * dir: 1 = يمين، -1 = شمال.
 */
export function marquee(row, { speed = 60, dir = -1, boost = 0.004 } = {}) {
  let x = 0, half = 0, vel = 0
  const set = gsap.quickSetter(row, 'x', 'px')
  const measure = () => { half = row.scrollWidth / 2 }
  measure()
  const ro = new ResizeObserver(measure); ro.observe(row)

  const tick = (_, dt) => {
    if (!half) return
    vel += (0 - vel) * 0.06
    x += dir * (speed + vel) * (dt / 1000)
    // لف بدون قفزة: بنرجع نص العرض لما نعدّيه
    if (dir < 0 && x <= -half) x += half
    if (dir > 0 && x >= 0) x -= half
    set(x)
  }
  if (dir > 0) x = -half
  gsap.ticker.add(tick)

  // سرعة التمرير بتزوّد السرعة لحظياً
  const st = ScrollTrigger.create({
    trigger: row, start: 'top bottom', end: 'bottom top',
    onUpdate: (s) => { vel = Math.min(Math.abs(s.getVelocity()) * boost * speed, speed * 6) },
  })

  return () => { gsap.ticker.remove(tick); ro.disconnect(); st.kill() }
}
