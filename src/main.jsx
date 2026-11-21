import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

// يبدأ دائماً من أعلى الصفحة (مهم مع الـ sticky hero والـ preloader)
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
window.scrollTo(0, 0)

// لمسة DevTools زي landonorris.com
console.log(
  '%c AHMED QASSIM %c قاسمز — دايماً في الملعب ',
  'background:#d2ff00;color:#11120e;font-weight:900;font-size:14px;padding:6px 10px;border-radius:4px 0 0 4px;',
  'background:#11120e;color:#f4f3ee;font-weight:700;font-size:13px;padding:6px 10px;border-radius:0 4px 4px 0;'
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
