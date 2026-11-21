import gsap from 'gsap'

// بيرسم التوقيع خط ورا خط، كل خط مدته على قد طوله (زي اليد بالظبط)
export function drawSignature(svg, { duration = 1.6, ease = 'none' } = {}) {
  const paths = [...svg.querySelectorAll('path')]
  const lens = paths.map((p) => p.getTotalLength())
  const total = lens.reduce((a, b) => a + b, 0) || 1
  const tl = gsap.timeline()
  paths.forEach((p, i) => {
    tl.fromTo(p, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: (lens[i] / total) * duration, ease })
  })
  return tl
}
