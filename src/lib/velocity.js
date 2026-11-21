import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * سرعة التمرير كمتغير CSS (زي data-gl="carousel" في الأصلي):
 * --vel  من -1 لـ 1 (اتجاه + سرعة)  — --velA قيمتها المطلقة
 * أي عنصر يقدر يستخدمهم: skew / scale / translate حسب سرعة السكرول.
 */
export function initVelocity() {
  const root = document.documentElement
  let target = 0, v = 0
  const st = ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (s) => { target = gsap.utils.clamp(-1, 1, s.getVelocity() / 2600) },
  })
  const tick = () => {
    target *= 0.9 // لو السكرول وقف بترجع لصفر
    v += (target - v) * 0.12
    if (Math.abs(v) < 0.0005) v = 0
    root.style.setProperty('--vel', v.toFixed(4))
    root.style.setProperty('--velA', Math.abs(v).toFixed(4))
  }
  gsap.ticker.add(tick)
  return () => { gsap.ticker.remove(tick); st.kill() }
}
