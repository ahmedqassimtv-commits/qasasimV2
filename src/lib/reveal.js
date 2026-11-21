import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * حركة ظهور النصوص زي الأصلي: كل سطر بيتغطّى بشريط ليموني بيتمسح عليه،
 * النص بيظهر تحته، وبعدين الشريط بينسحب للناحية التانية.
 *
 * الاستخدام: حط data-hl على أي عنصر نصي ثابت (عنوان، فقرة، eyebrow).
 *   data-hl="dark"  ← الشريط بلون داكن بدل الليموني (للخلفيات الليمونية)
 *
 * التقسيم بالكلمة (العربي مبيتقسمش لحروف عشان الحروف متتفصلش)،
 * وبعدين الكلمات بتتجمع لسطور حسب مكانها الفعلي على الشاشة.
 */

// لو العنصر جوه المسار الأفقي (Track) لازم يتربط بحركته الأفقية مش بالتمرير العمودي
export const revealCtx = { ca: null }

function splitLines(el) {
  if (el.__hlOrig == null) el.__hlOrig = el.innerHTML
  else el.innerHTML = el.__hlOrig
  if (getComputedStyle(el).position === 'static') el.style.position = 'relative'

  // 1) لف الكلمات
  const nodes = []
  ;[...el.childNodes].forEach((n) => {
    if (n.nodeType === 3) {
      n.textContent.split(/(\s+)/).forEach((t) => {
        if (!t) return
        if (/^\s+$/.test(t)) nodes.push(document.createTextNode(t))
        else { const s = document.createElement('span'); s.className = 'hl-w'; s.textContent = t; nodes.push(s) }
      })
    } else nodes.push(n)
  })
  el.textContent = ''
  nodes.forEach((n) => el.appendChild(n))

  // 2) جمّع لسطور حسب الارتفاع
  const lines = []
  let top = null, cur = null
  nodes.forEach((n) => {
    if (n.nodeType === 3) { if (cur) cur.push(n); return }
    const t = n.offsetTop
    if (top === null || Math.abs(t - top) > 6) { cur = []; lines.push(cur); top = t }
    cur.push(n)
  })

  // 3) ابني السطور: كل سطر = نص + شريط فوقه
  el.textContent = ''
  return lines.map((ns) => {
    const line = document.createElement('span'); line.className = 'hl-line'
    const inner = document.createElement('span'); inner.className = 'hl-in'
    const txt = document.createElement('span'); txt.className = 'hl-txt'
    const bar = document.createElement('span'); bar.className = 'hl-bar'
    while (ns.length && ns[ns.length - 1].nodeType === 3) ns.pop() // شيل المسافة في آخر السطر
    ns.forEach((x) => txt.appendChild(x))
    inner.append(txt, bar); line.appendChild(inner); el.appendChild(line)
    return { txt, bar }
  })
}

export function initReveal(scope = document) {
  const items = [...scope.querySelectorAll('[data-hl]')]
  const kill = []

  const build = (el) => {
    const played = el.__hlPlayed
    el.__hlTl?.kill()
    const lines = splitLines(el)
    const rtl = getComputedStyle(el).direction === 'rtl'
    const from = rtl ? 'right' : 'left', to = rtl ? 'left' : 'right'
    if (el.dataset.hl === 'dark') el.classList.add('hl-dark')
    if (played) return // اتعرض قبل كده — سيبه ظاهر
    gsap.set(lines.map((l) => l.txt), { opacity: 0 })
    const tl = gsap.timeline({ paused: true, onComplete: () => { el.__hlPlayed = true } })
    lines.forEach(({ txt, bar }, i) => {
      const t = i * 0.09
      tl.fromTo(bar, { scaleX: 0, transformOrigin: from }, { scaleX: 1, duration: 0.36, ease: 'power3.inOut' }, t)
        .set(txt, { opacity: 1 }, t + 0.36)
        .set(bar, { transformOrigin: to }, t + 0.36)
        .to(bar, { scaleX: 0, duration: 0.4, ease: 'power3.inOut' }, t + 0.38)
    })
    el.__hlTl = tl
    el.__hlSt?.kill()
    const ca = el.closest('.trk__rail') ? revealCtx.ca : null
    el.__hlSt = ScrollTrigger.create({
      trigger: el, once: true, onEnter: () => tl.play(),
      ...(ca ? { containerAnimation: ca, start: 'left 88%' } : { start: 'top 90%' }),
    })
  }

  items.forEach(build)

  // عند تغيير المقاس السطور بتتغير — نعيد التقسيم
  let to
  const onResize = () => { clearTimeout(to); to = setTimeout(() => items.forEach(build), 250) }
  window.addEventListener('resize', onResize)
  kill.push(() => {
    clearTimeout(to)
    window.removeEventListener('resize', onResize)
    items.forEach((el) => {
      el.__hlSt?.kill()
      el.__hlTl?.kill()
    })
  })
  return () => kill.forEach((k) => k())
}
