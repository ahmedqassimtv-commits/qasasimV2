import { signature } from '../data/signature'

// التوقيع: كل خط path لوحده (pathLength=1) — بيترسم بـ drawSignature()
export default function Signature({ className = '', width }) {
  return (
    <svg className={`sig ${className}`} viewBox={`0 0 ${signature.w} ${signature.h}`} fill="none"
      style={width ? { width } : undefined} aria-hidden>
      {signature.paths.map((d, i) => (
        <path key={i} d={d} pathLength="1" strokeDasharray="1" strokeDashoffset="1"
          strokeWidth={signature.stroke} strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </svg>
  )
}
