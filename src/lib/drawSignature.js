import gsap from 'gsap'

/**
 * بيكتب التوقيع زي اليد: القلم ماشي بسرعة ثابتة على طول المسار (كل خط مدته على قد طوله)
 * من غير وقفات بين الخطوط، والحركة كلها بتسرّع في الأول وتهدّى في الآخر مرة واحدة — فمفيش تقطيع.
 * بيرجع timeline يشتغل عادي أو جوه scrub.
 */
export function drawSignature(svg, { duration = 1.6, ease = 'power1.inOut' } = {}) {
  const paths = [...svg.querySelectorAll('mask path')]
  const lens = paths.map((p) => +p.dataset.len || Math.ceil(p.getTotalLength()) + 2)
  const pen = gsap.timeline({ paused: true, defaults: { ease: 'none' } })
  paths.forEach((p, i) => {
    pen.fromTo(p, { strokeDashoffset: lens[i] }, { strokeDashoffset: 0, duration: lens[i] })
  })
  return gsap.timeline().add(pen.tweenFromTo(0, pen.duration(), { duration, ease, immediateRender: false }))
}
