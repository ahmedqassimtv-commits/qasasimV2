import gsap from 'gsap'

/**
 * بيكتب التوقيع زي اليد: كل خط مدته على قد طوله (سرعة قلم ثابتة تقريباً)،
 * القلم بيسرّع في الأول ويهدّى في الآخر، ووقفة صغيرة لما القلم يترفع بين الخطوط.
 * بيشتغل كـ timeline عادي أو جوه scrub.
 */
export function drawSignature(svg, { duration = 1.6, ease = 'sine.inOut', lift = 0.07 } = {}) {
  const paths = [...svg.querySelectorAll('mask path')]
  const lens = paths.map((p) => p.getTotalLength())
  const total = lens.reduce((a, b) => a + b, 0) || 1
  const gaps = lift * duration * (paths.length - 1)
  const draw = Math.max(duration - gaps, duration * 0.6)
  const tl = gsap.timeline()
  paths.forEach((p, i) => {
    tl.fromTo(p, { strokeDashoffset: 1.1 },
      { strokeDashoffset: 0, duration: Math.max((lens[i] / total) * draw, 0.12 * draw), ease },
      i ? `+=${lift * duration}` : 0)
  })
  // لمسة نهاية: الحبر بيلمع لحظة وهو بينشف
  const ink = svg.querySelector('.sig__ink')
  if (ink) tl.fromTo(ink, { opacity: 0.92 }, { opacity: 1, duration: duration * 0.15, ease: 'power1.out' }, '<')
  return tl
}
