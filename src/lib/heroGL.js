/**
 * HeroGL — تأثير الكشف السائل في الـ Hero (بدون مكتبات)
 * - صورتان: A (الصورة الأساسية) و B (بالنظارة والكاب)
 * - حركة الماوس ترسم "أثر" في Texture منفصل (ping-pong FBO) يتلاشى ويتموج ببطء
 * - شيدر العرض يحوّل الأثر لحافة سائلة حادة (threshold + noise) مع انكسار خفيف على الحواف
 */

const VERT = `#version 300 es
in vec2 p; out vec2 vUv;
void main(){ vUv = p*.5+.5; gl_Position = vec4(p,0.,1.); }`

const NOISE = `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec2 mod289(vec2 x){return x-floor(x*(1./289.))*289.;}
vec3 permute(vec3 x){return mod289(((x*34.)+1.)*x);}
float snoise(vec2 v){
  const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
  vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod289(i);
  vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
  vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.); m=m*m; m=m*m;
  vec3 x=2.*fract(p*C.www)-1.; vec3 h=abs(x)-.5; vec3 ox=floor(x+.5); vec3 a0=x-ox;
  m*=1.79284291400159-.85373472095314*(a0*a0+h*h);
  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw; return 130.*dot(m,g);
}`

// محاكاة الأثر: تلاشي + تموّج + رسم مقطع بين موضع الماوس السابق والحالي
const TRAIL = `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uPrev; uniform vec2 uA; uniform vec2 uB; uniform float uR;
uniform float uStrength; uniform float uAspect; uniform float uTime; uniform float uDecay;
${NOISE}
float seg(vec2 p, vec2 a, vec2 b){ vec2 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/max(dot(ba,ba),1e-6),0.,1.); return length(pa-ba*h); }
void main(){
  vec2 flow = vec2(snoise(vUv*3.+uTime*.15), snoise(vUv*3.-uTime*.15+7.))*.0018;
  float v = texture(uPrev, vUv - flow).r;
  v = max(v*uDecay - .0016, 0.);
  vec2 asp = vec2(uAspect,1.);
  float d = seg(vUv*asp, uA*asp, uB*asp);
  float s = smoothstep(uR, uR*.15, d) * uStrength;
  v = clamp(v + s*(1.-v), 0., 1.);
  o = vec4(v,v,v,1.);
}`

const DISPLAY = `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uA; uniform sampler2D uB; uniform sampler2D uTrail;
uniform vec2 uRes; uniform vec2 uResA; uniform float uTime; uniform float uGrey;
uniform float uFit; uniform float uFitM; uniform vec3 uBlob; uniform float uBlobA; uniform float uDark;
${NOISE}
// الشخص بيتحط بارتفاع = نسبة من الشاشة، ومحاذي لتحت (الصدر بيتقص عند حافة الشاشة زي الأصلي)
// ديسكتوب uFit — موبايل (الشاشة بالطول) uFitM
vec4 place(sampler2D t, vec2 px){
  float fit = uRes.x < uRes.y ? uFitM : uFit;
  float s = (uRes.y*fit)/uResA.y;
  vec2 size = uResA*s;
  vec2 origin = vec2((uRes.x-size.x)*.5, uRes.y-size.y);
  vec2 uv = (px-origin)/size;
  if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.) return vec4(0.);
  return texture(t, uv);
}
void main(){
  vec2 px1 = 1./uRes;
  float t = texture(uTrail, vUv).r;
  float asp = uRes.x/uRes.y;
  float n = snoise(vUv*vec2(asp,1.)*3.2 + uTime*.25)*.5+.5;
  float n2 = snoise(vUv*vec2(asp,1.)*9. - uTime*.4)*.5+.5;
  float f = t + (n*.7+n2*.3 - .5)*.28*smoothstep(0.,.5,t);
  float m = smoothstep(.36, .42, f);
  float edge = smoothstep(.30,.39,f) * (1.-smoothstep(.40,.50,f));
  float tx = texture(uTrail, vUv+vec2(px1.x*6.,0.)).r - texture(uTrail, vUv-vec2(px1.x*6.,0.)).r;
  float ty = texture(uTrail, vUv+vec2(0.,px1.y*6.)).r - texture(uTrail, vUv-vec2(0.,px1.y*6.)).r;
  vec2 px = vec2(vUv.x, 1.-vUv.y)*uRes;
  vec4 a = place(uA, px);
  vec4 b = place(uB, px + vec2(tx,-ty)*uRes*.012*edge);
  // premultiplied: داخل البقعة = الصورة التانية فوق بقعة رمادي فاتح، برّاها = الصورة الأولى على شفاف
  vec4 pa = a; // الصور مرفوعة premultiplied
  float ba = uBlobA*(1.-b.a);
  vec4 pb = vec4(b.rgb + uBlob*ba, b.a + ba);
  vec4 c = mix(pa, pb, m);
  // ظل ناعم زيتوني ورا الشخص — يدمجه مع الخلفية بدل ما يبان ملزوق
  float sh = 0.;
  for(int i=0;i<10;i++){
    float an = float(i)*0.6283; vec2 o = vec2(cos(an), sin(an))*uRes.y*.022 + vec2(uRes.y*.008, uRes.y*.018);
    sh += place(uA, px - o).a;
  }
  sh = sh/10.*.16;
  c += vec4(vec3(.157,.172,.125)*sh, sh)*(1.-c.a);
  float l = dot(c.rgb, vec3(.299,.587,.114));
  c.rgb = mix(c.rgb, vec3(l)*vec3(.98,1.,.95)*c.a, uGrey);
  c.rgb = mix(c.rgb, c.rgb*vec3(.52,.56,.47), uDark);   // الكارت بيغمق زيتوني مع التوقيع
  o = c;
}`

function shader(gl, type, src) {
  const s = gl.createShader(type)
  gl.shaderSource(s, src); gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s))
  return s
}
function program(gl, fs) {
  const p = gl.createProgram()
  gl.attachShader(p, shader(gl, gl.VERTEX_SHADER, VERT))
  gl.attachShader(p, shader(gl, gl.FRAGMENT_SHADER, fs))
  gl.bindAttribLocation(p, 0, 'p'); gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p))
  const u = {}
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS)
  for (let i = 0; i < n; i++) { const name = gl.getActiveUniform(p, i).name; u[name] = gl.getUniformLocation(p, name) }
  return { p, u }
}
function loadImage(src) {
  return new Promise((res, rej) => { const i = new Image(); i.crossOrigin = 'anonymous'; i.onload = () => res(i); i.onerror = rej; i.src = src })
}

export default class HeroGL {
  constructor(canvas, { a, b, radius = 0.14, fit = 0.84, fitM = 0.6, onReady } = {}) {
    this.canvas = canvas
    this.gl = canvas.getContext('webgl2', { antialias: false, alpha: true, premultipliedAlpha: true })
    if (!this.gl) { this.failed = true; return }
    this.radius = radius
    this.fit = fit; this.fitM = fitM; this.dark = 0
    this.touch = window.matchMedia('(pointer: coarse)').matches
    this.ghost = { on: true, t: 0, idle: 3, boost: 0 }
    this.grey = 0
    this.mouse = { x: .5, y: .5, px: .5, py: .5, tx: .5, ty: .5, in: false, speed: 0 }
    this.time = 0
    this.visible = true
    this.init()
    Promise.all([loadImage(a), loadImage(b)]).then(([ia, ib]) => {
      this.texA = this.tex(ia); this.texB = this.tex(ib)
      this.resA = [ia.naturalWidth, ia.naturalHeight]; this.resB = [ib.naturalWidth, ib.naturalHeight]
      this.ready = true; onReady && onReady()
    })
    this.onMove = this.onMove.bind(this)
    this.onTouch = this.onTouch.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
    this.loop = this.loop.bind(this)
    window.addEventListener('pointermove', this.onMove, { passive: true })
    window.addEventListener('touchstart', this.onTouch, { passive: true })
    window.addEventListener('touchmove', this.onTouch, { passive: true })
    window.addEventListener('touchend', this.onTouchEnd, { passive: true })
    this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(canvas)
    this.resize()
    this.raf = requestAnimationFrame(this.loop)
  }

  init() {
    const gl = this.gl
    this.trailP = program(gl, TRAIL)
    this.dispP = program(gl, DISPLAY)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
  }

  tex(img) {
    const gl = this.gl, t = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, t)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    return t
  }

  fbo(w, h) {
    const gl = this.gl, t = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, t)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    const f = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, f)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0)
    gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT)
    return { t, f }
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
    const w = Math.max(1, Math.round(this.canvas.clientWidth * dpr))
    const h = Math.max(1, Math.round(this.canvas.clientHeight * dpr))
    if (w === this.w && h === this.h) return
    this.w = w; this.h = h
    this.canvas.width = w; this.canvas.height = h
    const tw = 384, th = Math.max(1, Math.round(384 * h / w))
    this.tw = tw; this.th = th
    this.ping = this.fbo(tw, th); this.pong = this.fbo(tw, th)
  }

  point(cx, cy) {
    const r = this.canvas.getBoundingClientRect()
    const x = (cx - r.left) / r.width, y = 1 - (cy - r.top) / r.height
    const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1
    if (inside && !this.mouse.in) { this.mouse.x = this.mouse.px = x; this.mouse.y = this.mouse.py = y }
    this.mouse.in = inside
    if (inside) { this.ghost.idle = 0; this.mouse.tx = x; this.mouse.ty = y }
  }

  onMove(e) { if (e.pointerType !== 'touch') this.point(e.clientX, e.clientY) }
  onTouch(e) { const t = e.touches[0]; if (t) this.point(t.clientX, t.clientY) }
  onTouchEnd() { this.mouse.in = false }

  // مركز الوش (لحركة المؤشر الوهمي) — محسوب من مكان الصورة على الشاشة
  face() {
    const fit = this.w < this.h ? this.fitM : this.fit
    return { x: 0.5, y: fit * 0.56, rx: Math.min(0.2, (fit * this.h * 0.32) / this.w), ry: fit * 0.22 }
  }

  // دفعة حركة قوية (بتتنده بعد شاشة التحميل)
  intro() { this.ghost.idle = 10; this.ghost.boost = 1.6; this.ghost.t = 0 }

  loop(now) {
    this.raf = requestAnimationFrame(this.loop)
    if (!this.ready || !this.visible || this.paused) return
    const gl = this.gl, m = this.mouse
    const dt = Math.min((now - (this.last || now)) / 1000, 0.05); this.last = now
    this.time += dt

    // مؤشر وهمي: بيتحرك لوحده على الوش في البداية ولما الماوس يقف — ديسكتوب بس، مش على اللمس
    const gh = this.ghost
    gh.idle += dt
    gh.boost = Math.max(0, gh.boost - dt)
    const useGhost = gh.on && gh.idle > (this.touch ? 1.2 : 2.2)
    if (useGhost) {
      gh.t += dt
      const k = gh.t * (0.55 + gh.boost * 0.5)
      const f = this.face()
      m.tx = f.x + Math.sin(k * 1.3) * f.rx + Math.sin(k * 2.9) * f.rx * 0.3
      m.ty = f.y + Math.sin(k * 1.9 + 1.2) * f.ry + Math.cos(k * 3.7) * f.ry * 0.25
      if (!m.ghostIn) { m.x = m.px = m.tx; m.y = m.py = m.ty; m.ghostIn = true }
    } else m.ghostIn = false
    const active = m.in || useGhost
    m.px = m.x; m.py = m.y
    m.x += (m.tx - m.x) * 0.22; m.y += (m.ty - m.y) * 0.22
    const v = Math.hypot(m.x - m.px, m.y - m.py)
    m.speed += (Math.min(v * 40, 1) - m.speed) * 0.15

    // 1) trail pass
    gl.useProgram(this.trailP.p)
    const u = this.trailP.u
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.pong.f)
    gl.viewport(0, 0, this.tw, this.th)
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.ping.t)
    gl.uniform1i(u.uPrev, 0)
    gl.uniform2f(u.uA, m.px, m.py); gl.uniform2f(u.uB, m.x, m.y)
    gl.uniform1f(u.uR, this.radius * (0.75 + m.speed * 0.6))
    gl.uniform1f(u.uStrength, active ? (useGhost ? 0.16 + gh.boost * 0.12 : 0.22) + m.speed * 0.6 : 0)
    gl.uniform1f(u.uAspect, this.w / this.h)
    gl.uniform1f(u.uTime, this.time)
    gl.uniform1f(u.uDecay, 0.988)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    ;[this.ping, this.pong] = [this.pong, this.ping]

    // 2) display pass
    gl.useProgram(this.dispP.p)
    const d = this.dispP.u
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, this.w, this.h)
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT)
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.texA); gl.uniform1i(d.uA, 0)
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.texB); gl.uniform1i(d.uB, 1)
    gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, this.ping.t); gl.uniform1i(d.uTrail, 2)
    gl.uniform2f(d.uRes, this.w, this.h)
    gl.uniform2f(d.uResA, ...this.resA)
    gl.uniform1f(d.uFit, this.fit); gl.uniform1f(d.uFitM, this.fitM); gl.uniform1f(d.uDark, this.dark)
    gl.uniform3f(d.uBlob, 0.84, 0.845, 0.82); gl.uniform1f(d.uBlobA, 0.55)
    gl.uniform1f(d.uTime, this.time)
    gl.uniform1f(d.uGrey, this.grey)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  destroy() {
    cancelAnimationFrame(this.raf)
    window.removeEventListener('pointermove', this.onMove)
    window.removeEventListener('touchstart', this.onTouch)
    window.removeEventListener('touchmove', this.onTouch)
    window.removeEventListener('touchend', this.onTouchEnd)
    this.ro && this.ro.disconnect()
    this.ready = false
  }
}
