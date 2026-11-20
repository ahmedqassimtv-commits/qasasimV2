// تقسيم النص للأنيميشن مع احترام العربي:
// العربي لا يُقسّم لحروف أبداً (يكسر اتصال الحروف) — يُقسّم لكلمات فقط.
export const isArabic = (t) => /[؀-ۿ]/.test(t)

export function units(text, mode = 'auto') {
  if (mode === 'words' || (mode === 'auto' && isArabic(text))) return text.split(/(\s+)/).filter(Boolean)
  return [...text]
}
