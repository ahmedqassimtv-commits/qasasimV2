import { logo } from '../data/logo'
import { units, isArabic } from '../lib/split'
import { site } from '../data/content'

// شعار قاسمز (SVG) — كل قطعة path منفصلة
export function LogoMark({ className = '', pieceClass = 'lm-p', ...rest }) {
  return (
    <svg className={`logomark ${className}`} viewBox={`0 0 ${logo.w} ${logo.h}`} aria-label="قاسمز" role="img" {...rest}>
      {logo.paths.map((d, i) => <path key={i} className={pieceClass} d={d} fillRule="evenodd" />)}
    </svg>
  )
}

// اللوجو المركّب: AHMED (سيريف) فوق QASSIM (عريض) — نفس فكرة LANDO / NORRIS
export function NameLockup({ withMark = true }) {
  return (
    <span className="lockup" dir="ltr">
      <span className="lockup__name">
        <span className="lockup__first">{site.first}</span>
        <span className="lockup__last">{site.last}</span>
      </span>
      {withMark && <LogoMark className="lockup__mark" />}
    </span>
  )
}

// نص يتدحرج عند الـ hover (حرف حرف للإنجليزي، كلمة كلمة للعربي)
export function Roll({ children, className = '' }) {
  const text = String(children)
  return (
    <span className={`roll ${className}`} aria-label={text} dir={isArabic(text) ? 'rtl' : 'ltr'}>
      {units(text).map((u, i) =>
        /^\s+$/.test(u)
          ? <span key={i} className="roll__sp"> </span>
          : <span key={i} className="roll__u" style={{ '--i': i }} data-t={u} aria-hidden>{u}</span>
      )}
    </span>
  )
}

export const PlayIcon = () => (
  <svg viewBox="0 0 20 20" className="ico" fill="currentColor"><path d="M6 4.2v11.6a.8.8 0 0 0 1.2.7l9.3-5.8a.8.8 0 0 0 0-1.4L7.2 3.5A.8.8 0 0 0 6 4.2Z" /></svg>
)
export const ArrowIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="ico"><path d="M14 13H6.5a2.5 2.5 0 0 1 0-5H8m6 5-3-3m3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
)

export function Btn({ children, href = '#', theme = 'lime', icon, className = '', ...rest }) {
  return (
    <a href={href} className={`btn btn--${theme} ${className}`} data-roll {...rest}>
      {icon}
      {children != null && <Roll>{children}</Roll>}
    </a>
  )
}
