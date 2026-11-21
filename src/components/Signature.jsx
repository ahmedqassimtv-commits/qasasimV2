import { useId } from 'react'
import { signature } from '../data/signature'

/**
 * التوقيع بتكنيك الماسك (زي التواقيع الاحترافية):
 * - الشكل نفسه هو حبر التوقيع الحقيقي (outline متعبّي) بسُمكه الطبيعي المتغيّر.
 * - فوقه ماسك من خطوط القلم بالترتيب اللي بتتكتب بيه، وكل خط بيتكشف بـ drawSignature().
 * النتيجة: الحبر بيطلع من سنّ القلم بالظبط بدل خطوط ثابتة السُمك.
 */
export default function Signature({ className = '', width }) {
  const id = `sig${useId().replace(/:/g, '')}`
  const { w, h } = signature
  return (
    <svg className={`sig ${className}`} viewBox={`0 0 ${w} ${h}`} fill="none"
      style={width ? { width } : undefined} aria-hidden>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x="-20" y="-20" width={w + 40} height={h + 40}>
          {signature.strokes.map((d, i) => (
            <path key={i} d={d} pathLength="1" strokeDasharray="1 1.5" strokeDashoffset="1.1"
              stroke="#fff" strokeWidth={signature.mask} strokeLinecap="round" strokeLinejoin="round" />
          ))}
        </mask>
      </defs>
      <path className="sig__ink" d={signature.ink} fillRule="evenodd" fill="currentColor" mask={`url(#${id})`} />
    </svg>
  )
}
