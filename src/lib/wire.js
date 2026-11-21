/**
 * خوذة/قبة Wireframe حوالين الراس (زي خوذة الأصلي الشفافة بالخطوط):
 * شبكة ثلاثية الأبعاد مرسومة بخطوط رفيعة على Canvas 2D، بتلف بهدوء وبتتبع الماوس.
 * مكانها محسوب من نفس معادلة وضع الصورة في heroGL (الشخص محاذي لتحت، ارتفاعه = fit × الشاشة).
 */
export default class Wire {
  // back: canvas تحت صورة الـ WebGL (الراس بيغطيه) — front: canvas فوقها (خطوط باهتة على الوش)
  constructor([back, front], { aspect = 1600 / 1353, fit = 0.84, fitM = 0.56, head = { x: 0.49, y: 0.31, r: 0.27 } } = {}) {
    this.cs = [back, front]
    this.ctxs = this.cs.map((c) => c.getContext('2d'))
    this.c = back
    this.aspect = aspect; this.fit = fit; this.fitM = fitM; this.head = head
    this.mx = 0; this.my = 0; this.tx = 0; this.ty = 0; this.t = 0; this.visible = true; this.show = 0; this.target = 0
    this.mesh = this.build()
    this.onMove = (e) => { this.tx = e.clientX / innerWidth - 0.5; this.ty = e.clientY / innerHeight - 0.5 }
    window.addEventListener('pointermove', this.onMove, { passive: true })
    this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(back)
    this.resize()
    this.loop = this.loop.bind(this)
    this.raf = requestAnimationFrame(this.loop)
  }

  // شبكة خوذة: قبة كاملة من فوق ونازلة على الجناب، وفيها فتحة الوش من قدام
  build() {
    const rings = 16, segs = 40, pts = [], edges = []
    const idx = (i, j) => i * segs + (j % segs)
    for (let i = 0; i < rings; i++) {
      const th = (i / (rings - 1)) * (Math.PI * 0.86) // من فوق الراس لتحت الدقن
      for (let j = 0; j < segs; j++) {
        const ph = (j / segs) * Math.PI * 2
        // شكل خوذة: أعرض شوية عند الودان، وأطول لقدام
        const bulge = 1 + 0.06 * Math.sin(th) ** 2
        pts.push([Math.sin(th) * Math.sin(ph) * bulge, Math.cos(th) * 1.18, Math.sin(th) * Math.cos(ph) * bulge * 1.05])
      }
    }
    // فتحة الوش (الزجاج): منطقة قدام بين الحواجب والدقن
    const open = (i, j) => {
      const th = (i / (rings - 1)) * (Math.PI * 0.86), ph = (j / segs) * Math.PI * 2
      const front = Math.cos(ph) > Math.cos(0.95)
      return front && th > 0.95 && th < 2.2
    }
    for (let i = 0; i < rings; i++) for (let j = 0; j < segs; j++) {
      if (open(i, j)) continue
      if (j < segs && !open(i, j + 1)) edges.push([idx(i, j), idx(i, j + 1)])
      if (i < rings - 1 && !open(i + 1, j)) {
        edges.push([idx(i, j), idx(i + 1, j)])
        if (!open(i + 1, j + 1)) edges.push([idx(i, j), idx(i + 1, j + 1)]) // قطر = شكل مثلثات
      }
    }
    return { pts, edges }
  }

  resize() {
    const dpr = Math.min(devicePixelRatio || 1, 1.5)
    this.w = this.c.clientWidth; this.h = this.c.clientHeight
    this.cs.forEach((c, i) => {
      c.width = Math.max(1, this.w * dpr); c.height = Math.max(1, this.h * dpr)
      this.ctxs[i].setTransform(dpr, 0, 0, dpr, 0, 0)
    })
  }

  loop() {
    this.raf = requestAnimationFrame(this.loop)
    if (!this.visible || !this.w) return
    this.t += 1 / 60
    this.show += (this.target - this.show) * 0.025
    this.mx += (this.tx - this.mx) * 0.05; this.my += (this.ty - this.my) * 0.05
    const { w, h } = this
    this.ctxs.forEach((c) => c.clearRect(0, 0, w, h))
    if (this.show <= 0.001) return

    // مكان الراس على الشاشة (نفس معادلة heroGL)
    const fit = w < h ? this.fitM : this.fit
    const ih = h * fit, iw = ih * this.aspect
    const ox = (w - iw) / 2, oy = h - ih
    const cx = ox + this.head.x * iw, cy = oy + this.head.y * ih
    const R = this.head.r * iw

    const yaw = this.mx * 0.55 + Math.sin(this.t * 0.45) * 0.1
    const pitch = -this.my * 0.22 + Math.sin(this.t * 0.31) * 0.03
    const cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch)
    const sc = R * (0.92 + 0.08 * this.show)
    const P = this.mesh.pts.map(([x, y, z]) => {
      const x1 = x * cyw + z * syw, z1 = -x * syw + z * cyw
      const y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp
      const persp = 1 / (1 - z2 * 0.12)
      return [cx + x1 * sc * persp, cy - y2 * sc * persp - R * 0.08, z2]
    })
    // الخطوط اللي ورا على الطبقة اللي تحت الصورة، واللي قدام على الطبقة اللي فوقها (باهتة)
    for (const pass of [0, 1]) {
      const ctx = this.ctxs[pass]
      ctx.lineWidth = 0.7
      ctx.beginPath()
      for (const [a, b] of this.mesh.edges) {
        const z = (P[a][2] + P[b][2]) / 2
        if ((pass === 0) !== (z < 0)) continue
        ctx.moveTo(P[a][0], P[a][1]); ctx.lineTo(P[b][0], P[b][1])
      }
      ctx.strokeStyle = pass === 0 ? `rgba(105,109,97,${0.4 * this.show})` : `rgba(235,236,228,${0.35 * this.show})`
      ctx.stroke()
    }
  }

  // ظهور تدريجي (بيتنده بعد شاشة التحميل)
  reveal() { this.target = 1 }

  destroy() {
    cancelAnimationFrame(this.raf)
    window.removeEventListener('pointermove', this.onMove)
    this.ro.disconnect()
  }
}
