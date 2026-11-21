/**
 * Wire — مجسّم نظارة 3D Wireframe هندسي متمركز بدقة على مكان النظارة والعينين في صورة أحمد:
 * - قياسات مضبوطة على hero-2.webp بالظبط: مركز النظارة (x=0.502, y=0.415) وعرضها (w=0.378)
 * - يتتبع الماوس بدوران ثلاثي الأبعاد حقيقي (yaw + pitch + roll) وحركة تنفّس ناعمة
 * - الأذرع الخلفية تترسم على طبقة back (وراء الرأس)، والإطار والعدسات الأمامية على طبقة front (فوق العينين)
 * - يتوقف تماماً عن الرسم لما المستخدم ينزل تحت الهيرو (visible = false)
 */
export default class Wire {
  constructor([back, front], {
    aspect = 1600 / 1353,
    fit = 0.84,
    fitM = 0.56,
    glasses = { x: 0.502, y: 0.404, w: 0.376 },
  } = {}) {
    this.cs = [back, front]
    this.ctxs = this.cs.map((c) => c.getContext('2d'))
    this.c = back
    this.aspect = aspect; this.fit = fit; this.fitM = fitM; this.glasses = glasses
    this.mx = 0; this.my = 0; this.tx = 0; this.ty = 0
    this.t = 0; this.visible = true; this.show = 0; this.target = 0; this.last = 0
    this.mesh = this.build()

    this.onMove = (e) => {
      if (e.pointerType === 'touch') return
      this.tx = (e.clientX / innerWidth - 0.5) * 2
      this.ty = (e.clientY / innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', this.onMove, { passive: true })
    this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(back)
    this.resize()
    this.loop = this.loop.bind(this)
    this.raf = requestAnimationFrame(this.loop)
  }

  // بناء شبكة نظارة 3D حقيقية (إطاران أمامي/خلفي بسمك + جسر + شبكة عدسة منحنية + ذراعان للخلف + نقاط ليمونية تقنية)
  build() {
    const pts = []
    const edges = [] // [a, b, style: 0=main, 1=subtle, 2=accent]
    const nodes = [] // نقاط تقاطع مضيئة بالليموني
    const add = (x, y, z) => (pts.push([x, y, z]), pts.length - 1)

    // شكل عدسة دائرية-بيضاوية قريبة جداً من نظارة أحمد (pantos/round-square)
    const lensPoint = (side, angle, scale = 1) => {
      const cx = side * 0.52
      const rx = 0.43 * scale
      const ry = 0.365 * scale
      const ca = Math.cos(angle), sa = Math.sin(angle)
      // تسطيح بسيط للحافة العلوية وانحناء أعمق للأسفل زي شكل النظارة الحقيقية
      const topFlat = sa > 0 ? 1 - 0.14 * sa * sa : 1 + 0.04 * sa * sa
      const x = cx + ca * rx
      const y = sa * ry * topFlat
      // انحناء ثلاثي الأبعاد للواجهة حول الوجه
      const zCurve = 0.14 - (x * x) * 0.12
      return [x, y, zCurve]
    }

    const SEGS = 28
    for (const side of [-1, 1]) {
      const frontRing = []
      const backRing = []
      const innerRing = []
      for (let i = 0; i < SEGS; i++) {
        const a = (i / SEGS) * Math.PI * 2
        const [fx, fy, fz] = lensPoint(side, a, 1.0)
        const [ix, iy, iz] = lensPoint(side, a, 0.87)
        frontRing.push(add(fx, fy, fz + 0.045))
        backRing.push(add(fx, fy, fz - 0.045))
        innerRing.push(add(ix, iy, iz + 0.015))
      }

      for (let i = 0; i < SEGS; i++) {
        const n = (i + 1) % SEGS
        // الحافة الخارجية الأمامية والخلفية + الحافة الداخلية
        edges.push([frontRing[i], frontRing[n], 0])
        edges.push([backRing[i], backRing[n], 1])
        edges.push([innerRing[i], innerRing[n], 1])
        // دعامات السُمك الثلاثي الأبعاد كل خطوتين
        if (i % 2 === 0) edges.push([frontRing[i], backRing[i], 1])
        if (i % 4 === 0) edges.push([frontRing[i], innerRing[i], 1])
      }

      // خطوط شبكة العدسة (منحنية خفيفة داخل كل عدسة)
      for (const frac of [-0.45, 0, 0.45]) {
        const prevH = [], prevV = []
        for (let k = -3; k <= 3; k++) {
          const u = k / 3
          const hx = side * 0.52 + u * 0.34 * Math.sqrt(Math.max(0.05, 1 - frac * frac))
          const hy = frac * 0.32
          const hz = 0.14 - hx * hx * 0.12 + (1 - u * u) * 0.04
          prevH.push(add(hx, hy, hz))

          const vx = side * 0.52 + frac * 0.34
          const vy = u * 0.31 * Math.sqrt(Math.max(0.05, 1 - frac * frac))
          const vz = 0.14 - vx * vx * 0.12 + (1 - u * u) * 0.04
          prevV.push(add(vx, vy, vz))
        }
        for (let k = 0; k < prevH.length - 1; k++) {
          edges.push([prevH[k], prevH[k + 1], 1])
          edges.push([prevV[k], prevV[k + 1], 1])
        }
      }

      // مفصل الجانب (Hinge) + نقطة ليمونية
      const hx = side * 0.96, hy = 0.10, hz = 0.03
      const h1 = add(hx, hy + 0.045, hz + 0.03)
      const h2 = add(hx, hy - 0.045, hz + 0.03)
      const h3 = add(hx + side * 0.06, hy + 0.04, hz - 0.06)
      const h4 = add(hx + side * 0.06, hy - 0.04, hz - 0.06)
      edges.push([h1, h2, 2], [h1, h3, 2], [h2, h4, 2], [h3, h4, 2])
      nodes.push(h1, h2)

      // ذراع النظارة الممتد للخلف خلف الأذن (يُعرض خلف الرأس عند z < 0)
      const armTop = [h3], armBot = [h4]
      const armSteps = 7
      for (let s = 1; s <= armSteps; s++) {
        const f = s / armSteps
        const ax = side * (1.02 + f * 0.06 - Math.max(0, f - 0.65) * 0.18)
        const ay = hy - Math.max(0, f - 0.65) * 0.42
        const az = hz - 0.06 - f * 1.45
        const thick = 0.038 * (1 - f * 0.35)
        armTop.push(add(ax, ay + thick, az))
        armBot.push(add(ax, ay - thick, az))
      }
      for (let s = 0; s < armSteps; s++) {
        edges.push([armTop[s], armTop[s + 1], 0])
        edges.push([armBot[s], armBot[s + 1], 1])
        if (s % 2 === 1) edges.push([armTop[s], armBot[s], 1])
      }
      edges.push([armTop[armSteps], armBot[armSteps], 0])
    }

    // جسر الأنف (Nose bridge) المزدوج ثلاثي الأبعاد
    const bL1 = add(-0.12, 0.11, 0.185), bM1 = add(0, 0.14, 0.215), bR1 = add(0.12, 0.11, 0.185)
    const bL2 = add(-0.11, 0.05, 0.17), bM2 = add(0, 0.08, 0.195), bR2 = add(0.11, 0.05, 0.17)
    edges.push([bL1, bM1, 0], [bM1, bR1, 0], [bL2, bM2, 0], [bM2, bR2, 0], [bM1, bM2, 2])
    nodes.push(bM1)

    // قوس علوي خفيف يشير لانحناء الكاب فوق الجبهة (لمسة تقنية رقيقة)
    const arc = []
    for (let i = 0; i <= 16; i++) {
      const a = -0.82 + (i / 16) * 1.64
      arc.push(add(Math.sin(a) * 1.08, 0.78 + Math.cos(a) * 0.16, Math.cos(a) * 0.35 - 0.15))
    }
    for (let i = 0; i < arc.length - 1; i++) edges.push([arc[i], arc[i + 1], 1])

    return { pts, edges, nodes }
  }

  resize() {
    const dpr = Math.min(devicePixelRatio || 1, 1.5)
    this.w = this.c.clientWidth; this.h = this.c.clientHeight
    this.cs.forEach((c, i) => {
      c.width = Math.max(1, Math.round(this.w * dpr))
      c.height = Math.max(1, Math.round(this.h * dpr))
      this.ctxs[i].setTransform(dpr, 0, 0, dpr, 0, 0)
    })
  }

  loop(now) {
    this.raf = requestAnimationFrame(this.loop)
    if (!this.visible || !this.w) { this.last = now; return }
    const dt = Math.min(Math.max((now - (this.last || now)) / 1000, 0.001), 0.05)
    this.last = now
    this.t += dt

    const showLerp = 1 - Math.pow(0.04, dt)
    const moveLerp = 1 - Math.pow(0.015, dt)
    this.show += (this.target - this.show) * showLerp
    this.mx += (this.tx - this.mx) * moveLerp
    this.my += (this.ty - this.my) * moveLerp

    const { w, h } = this
    this.ctxs.forEach((c) => c.clearRect(0, 0, w, h))
    if (this.show <= 0.002) return

    // تموضع مطابق مليميترياً للنظارة في hero-2.webp (نفس معادلة HeroGL)
    const fit = w < h ? this.fitM : this.fit
    const ih = h * fit, iw = ih * this.aspect
    const ox = (w - iw) / 2, oy = h - ih
    const cx = ox + this.glasses.x * iw
    const cy = oy + this.glasses.y * ih + Math.sin(this.t * 1.4) * (ih * 0.004)
    const scaleX = (this.glasses.w * iw) * 0.515 * (0.94 + 0.06 * this.show)

    // دوران 3D حي وواضح يتبع الماوس بنعومة
    const yaw = this.mx * 0.34 + Math.sin(this.t * 0.85) * 0.08
    const pitch = -this.my * 0.22 + Math.cos(this.t * 0.65) * 0.04
    const roll = this.mx * 0.045
    const cyw = Math.cos(yaw), syw = Math.sin(yaw)
    const cp = Math.cos(pitch), sp = Math.sin(pitch)
    const cr = Math.cos(roll), sr = Math.sin(roll)

    const P = this.mesh.pts.map(([x, y, z]) => {
      // Y-rotation (yaw)
      const x1 = x * cyw + z * syw
      const z1 = -x * syw + z * cyw
      // X-rotation (pitch)
      const y2 = y * cp - z1 * sp
      const z2 = y * sp + z1 * cp
      // Z-rotation (roll)
      const x3 = x1 * cr - y2 * sr
      const y3 = x1 * sr + y2 * cr
      const persp = 1 / (1 - z2 * 0.22)
      return [cx + x3 * scaleX * persp, cy - y3 * scaleX * persp, z2]
    })

    // طبقة 0 خلف الرأس (الأذرع الخلفية z < -0.08) — طبقة 1 أمام الوجه (الإطار والعدسات)
    for (const pass of [0, 1]) {
      const ctx = this.ctxs[pass]
      for (const style of [1, 0, 2]) {
        ctx.beginPath()
        for (const [a, b, st] of this.mesh.edges) {
          if (st !== style) continue
          const z = (P[a][2] + P[b][2]) * 0.5
          if ((pass === 0) !== (z < -0.06)) continue
          ctx.moveTo(P[a][0], P[a][1])
          ctx.lineTo(P[b][0], P[b][1])
        }
        if (style === 2) {
          ctx.lineWidth = 1.4
          ctx.strokeStyle = `rgba(210, 255, 0, ${0.85 * this.show})`
        } else if (style === 0) {
          ctx.lineWidth = pass === 0 ? 0.9 : 1.15
          ctx.strokeStyle = pass === 0
            ? `rgba(70, 76, 58, ${0.38 * this.show})`
            : `rgba(40, 44, 32, ${0.52 * this.show})`
        } else {
          ctx.lineWidth = 0.65
          ctx.strokeStyle = pass === 0
            ? `rgba(95, 100, 86, ${0.24 * this.show})`
            : `rgba(40, 44, 32, ${0.22 * this.show})`
        }
        ctx.stroke()
      }

      // نقاط ليمونية تقنية صغيرة على مفاصل النظارة والجسر
      if (pass === 1) {
        ctx.fillStyle = `rgba(210, 255, 0, ${0.95 * this.show})`
        for (const idx of this.mesh.nodes) {
          const [px, py] = P[idx]
          ctx.beginPath()
          ctx.arc(px, py, 2.4, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }
  }

  reveal() { this.target = 1 }

  destroy() {
    cancelAnimationFrame(this.raf)
    window.removeEventListener('pointermove', this.onMove)
    this.ro.disconnect()
  }
}
