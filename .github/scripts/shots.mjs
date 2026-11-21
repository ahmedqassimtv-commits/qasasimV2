// لقطات تلقائية للموقع بالحركات الحقيقية (GSAP) — بتشتغل في GitHub Actions
import { chromium, devices } from 'playwright'
import fs from 'fs'
const URL = process.env.URL || 'http://localhost:4173/'
const out = 'shots'; fs.mkdirSync(out, { recursive: true })
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const errs = []
async function run(tag, opt, steps) {
  const ctx = await b.newContext(opt); const p = await ctx.newPage()
  p.on('pageerror', (e) => errs.push(`${tag} pageerror: ${e.message}`))
  p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(`${tag} console.${m.type()}: ${m.text()}`) })
  await p.goto(URL)
  for (const t of [300, 900, 1600, 2400, 3400]) { await p.waitForTimeout(t === 300 ? 300 : 700); await p.screenshot({ path: `${out}/${tag}-00-load-${t}.jpg`, quality: 60 }) }
  await p.waitForTimeout(2500)
  await p.screenshot({ path: `${out}/${tag}-01-hero.jpg`, quality: 60 })
  await steps(p, tag)
  const H = await p.evaluate(() => document.documentElement.scrollHeight)
  const vh = opt.viewport?.height || 800
  let i = 2
  for (let y = 0; y < H; y += Math.round(vh * 0.55)) {
    await p.mouse.wheel(0, Math.round(vh * 0.55)); await p.waitForTimeout(900)
    await p.screenshot({ path: `${out}/${tag}-${String(i++).padStart(2, '0')}.jpg`, quality: 55 })
  }
  await ctx.close()
}
await run('d', { viewport: { width: 1440, height: 810 } }, async (p, tag) => {
  // حركة ماوس على الوش
  for (let k = 0; k < 40; k++) { await p.mouse.move(560 + k * 9, 300 + Math.sin(k / 4) * 90); await p.waitForTimeout(20) }
  await p.screenshot({ path: `${out}/${tag}-01b-mouse.jpg`, quality: 60 })
  // القائمة
  const ham = await p.$('.ham'); if (ham) { await ham.click(); await p.waitForTimeout(1600); await p.screenshot({ path: `${out}/${tag}-01c-menu.jpg`, quality: 60 }); await ham.click(); await p.waitForTimeout(1200) }
})
await run('m', { ...devices['iPhone 13'] }, async () => {})
fs.writeFileSync(`${out}/errors.txt`, errs.join('\n') || 'no errors')
await b.close()
