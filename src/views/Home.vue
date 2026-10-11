<template>
  <div class="hi">
    <!-- The plain hero: what the prerendered page, and browsers without WebGL or
         with reduced motion, show. The canvas fades in over it once it's ready. -->
    <img class="hi-sky" :src="frames[live ? 0 : frame]"
      alt="Night sky over Minieta Road, Death Valley, photographed by Yasushi Oh">
    <h1 :key="activeName" class="hi-name">{{ activeName }}</h1>
    <canvas ref="canvas" class="hi-canvas" :class="{ live, cursorless: live && !phone }" aria-hidden="true"
      @click="onCanvasClick"></canvas>

    <div class="hi-below">
      <nav class="hi-links" :class="{ shown: progress > 0.85, cursorless: live && !phone }" aria-label="Next">
        <RouterLink v-for="(link, i) in links" :key="link.name" :ref="el => setLink(i, el)" :to="{ name: link.name }">
          {{ $t(link.label) }}</RouterLink>
      </nav>
    </div>

    <a class="hi-place" href="https://maps.app.goo.gl/f1iggnxxYjswtCLUA">N 36°14.845′ W 117°21.295′<br>
      {{ $t("message.wave_location") }}</a>
    <div v-if="live && !phone" ref="cursor" class="hi-cursor" aria-hidden="true"></div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, type ComponentPublicInstance } from 'vue'
import { useRouter } from 'vue-router'
import { createLens } from '../components/hi/lens'
import reelUrl from '../assets/hi/reel.mp4'

// The sky frames ship with the site, ordered by their zero-padded names.
const frames = Object.entries(
  import.meta.glob<string>('../assets/skyFrameWebp/*.webp', { eager: true, query: '?url', import: 'default' })
).sort(([a], [b]) => a.localeCompare(b)).map(([, url]) => url)

const names = ['翁安志', 'おやすし', 'Oh Yasushi']
const links = [
  { name: 'Work', label: 'message.nav_work' },
  { name: 'Photos', label: 'message.nav_photos' },
  { name: 'Exhibitions', label: 'message.nav_exhibitions' },
]
// The reel: nine scenes from the film, three seconds each, keyframed at each cut.
const SCENES = 9
const SCENE_SECONDS = 3

const phone = matchMedia('(pointer: coarse)').matches
const activeName = ref(names[0])
const progress = ref(0) // how far down the page, 0–1
const frame = ref(0) // the nearest loaded sky frame, for the plain hero
const live = ref(false)
const canvas = ref<HTMLCanvasElement | null>(null)
const cursor = ref<HTMLElement | null>(null)

const linkEls: (HTMLElement | null)[] = []
const setLink = (i: number, el: Element | ComponentPublicInstance | null) => {
  linkEls[i] = (el && '$el' in el ? el.$el : el) as HTMLElement | null
}

// Sky frames load one at a time, in scroll order, after the page has rendered.
const images: (HTMLImageElement | null)[] = frames.map(() => null)
let active = true
const preload = async () => {
  for (const [i, src] of frames.entries()) {
    const img = new Image()
    img.src = src
    await img.decode().catch(() => {})
    if (!active) return
    images[i] = img
    onScroll()
  }
}
const nearestLoaded = (i: number) => {
  while (i > 0 && !images[i]) i--
  return i
}

let scrollTop = 0
let scrollAt = 0
let velocity = 0 // px per ms, for the lens's stretch on phones
const onScroll = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  progress.value = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0
  frame.value = nearestLoaded(Math.round(progress.value * (frames.length - 1)))
  const now = performance.now()
  const v = (window.scrollY - scrollTop) / Math.max(16, now - scrollAt)
  if (Math.abs(v) > Math.abs(velocity)) velocity = v
  scrollTop = window.scrollY
  scrollAt = now
}

let nameAt = 0
let nameTimer = 0
let previousName = ''
const nextName = () => {
  previousName = activeName.value
  activeName.value = names[(names.indexOf(activeName.value) + 1) % names.length]
  nameAt = performance.now()
}

// A click, tap or sideways swipe cuts to another scene; the lens swells to show it.
let cutAt = -1e9
const cutScene = (d: number) => {
  scene += d
  cutAt = performance.now()
}

// Clicks on the canvas cut the scene, unless they land on a link: then they open
// it, whichever element the browser hit-tested first.
const router = useRouter()
const onCanvasClick = (e: MouseEvent) => {
  if (progress.value > 0.85) {
    const i = linkEls.findIndex(el => {
      const r = el?.getBoundingClientRect()
      return r && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom
    })
    if (i >= 0) return router.push({ name: links[i].name })
  }
  cutScene(1)
}

let lens: ReturnType<typeof createLens> = null
let video: HTMLVideoElement | null = null
let raf = 0

let pointer: { x: number, y: number, at: number } | null = null
let tap: { x: number, y: number, at: number } | null = null
let touchStart: { x: number, y: number } | null = null
const onPointerMove = (e: PointerEvent) => {
  if (e.pointerType === 'mouse') pointer = { x: e.clientX, y: e.clientY, at: performance.now() }
}
const onPointerOut = (e: PointerEvent) => {
  if (!e.relatedTarget) pointer = null
}
const onTouchStart = (e: TouchEvent) => (touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY })
const onTouchEnd = (e: TouchEvent) => {
  if (!touchStart) return
  const dx = e.changedTouches[0].clientX - touchStart.x
  const dy = e.changedTouches[0].clientY - touchStart.y
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) cutScene(dx < 0 ? 1 : -1)
  else if (Math.hypot(dx, dy) < 10) tap = { x: touchStart.x, y: touchStart.y, at: performance.now() }
  touchStart = null
}

// The name is drawn into a canvas band that the shader reads. When it changes,
// the old letters dissolve upwards while the new ones rise out of a blur, one
// after another, so the centre is never empty.
const textCanvas = document.createElement('canvas')
const textCtx = textCanvas.getContext('2d')!
let drawnTrack = NaN
const IN_DELAY = 0 // the new name rises while the old one dissolves
const fontSize = () => Math.min(150, window.innerWidth * (phone ? 0.164 : 0.104))
const drawName = (now: number, dpr: number) => {
  const size = fontSize()
  const chars = Array.from(activeName.value)
  const settled = now - nameAt > IN_DELAY + 1100 + chars.length * 55
  const track = Math.round((-2 + progress.value * 10) * size / 150 * 4) / 4
  if (settled && track === drawnTrack) return
  drawnTrack = settled ? track : NaN

  const w = window.innerWidth
  const band = Math.ceil(size * 1.8)
  if (textCanvas.width !== Math.round(w * dpr) || textCanvas.height !== Math.round(band * dpr)) {
    textCanvas.width = Math.round(w * dpr)
    textCanvas.height = Math.round(band * dpr)
  }
  const ctx = textCtx
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, w, band)
  ctx.font = `300 ${size}px "Helvetica Neue", Helvetica, Arial, sans-serif`
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#FFF'
  // Each letter at its own progress k (0 hidden → 1 in place), offset dy em.
  const draw = (text: string[], letter: (i: number) => { alpha: number, blur: number, dy: number }) => {
    const widths = text.map(ch => ctx.measureText(ch).width)
    let x = (w - widths.reduce((a, b) => a + b, 0) - track * (text.length - 1)) / 2
    text.forEach((ch, i) => {
      const { alpha, blur, dy } = letter(i)
      if (alpha > 0.01) {
        ctx.globalAlpha = alpha
        ctx.filter = blur > 0.1 ? `blur(${(blur * size / 150).toFixed(1)}px)` : 'none'
        ctx.fillText(ch, x, band / 2 + dy * size)
      }
      x += widths[i] + track
    })
  }
  const progressOf = (delay: number, length: number) => (i: number, step: number) =>
    1 - Math.pow(1 - Math.min(1, Math.max(0, (now - nameAt - delay - i * step) / length)), 3)
  const out = progressOf(0, 700)
  const into = progressOf(IN_DELAY, 1100)
  if (previousName && now - nameAt < 700 + previousName.length * 40) {
    draw(Array.from(previousName), i => ({ alpha: 1 - out(i, 40), blur: 12 * out(i, 40), dy: -0.15 * out(i, 40) }))
  }
  draw(chars, i => ({ alpha: into(i, 55), blur: 16 * (1 - into(i, 55)), dy: 0.22 * (1 - into(i, 55)) }))
  ctx.globalAlpha = 1
  ctx.filter = 'none'
  lens!.setText(textCanvas, [0, (window.innerHeight - band) / 2, w, band])
}

let scene = 0
let shownScene = -1
let videoFresh = false
let lensOn = 0
let t = 0
let last = 0
let lastFrame = 0
let lensX = 0
let lensY = 0
let magnet = 0
let near = -1

const resize = () => lens?.resize(window.innerWidth, window.innerHeight, Math.min(devicePixelRatio, 2))

const tick = (now: number) => {
  raf = requestAnimationFrame(tick)
  // Phones draw at 30 fps: the film is 24, and it saves battery.
  if (phone && now - lastFrame < 30) return
  lastFrame = now
  const dt = Math.min(0.05, (now - (last || now)) / 1000)
  last = now
  t += dt
  const ease = (k: number) => 1 - Math.pow(1 - k, dt * 60) // frame-rate independent lerp
  const w = window.innerWidth
  const h = window.innerHeight
  const p = progress.value

  // Where the lens heads: the mouse, a tap for a few seconds, or an idle drift.
  const drift = { x: w / 2 + w * 0.25 * Math.sin(t * 0.7), y: h / 2 + h * 0.045 * Math.sin(t * 1.3) }
  const mouse = !phone && pointer && now - pointer.at < 4000 ? pointer : null
  const goal = mouse ?? (tap && now - tap.at < 3500 ? tap : drift)
  velocity *= Math.pow(0.88, dt * 60)
  const lag = phone ? -Math.sign(velocity) * Math.min(70, Math.abs(velocity) * 24) : 0
  lensX += (goal.x - lensX) * ease(0.1)
  lensY += (goal.y + lag - lensY) * ease(0.1)

  // Near a link, the cursor is pulled onto it and the lens shrinks into it.
  let rect: DOMRect | null = null
  let pull = 0
  if (mouse && p > 0.85) {
    let best = Infinity
    for (const [i, el] of linkEls.entries()) {
      if (!el) continue
      const r = el.getBoundingClientRect()
      const d = Math.hypot(Math.max(0, Math.abs(mouse.x - r.x - r.width / 2) - r.width / 2),
        Math.max(0, Math.abs(mouse.y - r.y - r.height / 2) - r.height / 2))
      if (d < best) [best, near, rect] = [d, i, r]
    }
    pull = Math.max(0, 1 - best / 110)
  }
  magnet += (pull - magnet) * ease(0.22)
  const e = magnet * magnet * (3 - 2 * magnet)

  const k = (now - cutAt) / 1100
  const swell = k < 1 ? Math.sin(Math.PI * Math.sqrt(k)) * w * (phone ? 1.08 : 0.53) : 0
  const r = (w * (phone ? 0.256 : 0.153) + p * p * w * (phone ? 1.44 : 0.66)) * (1 - 0.85 * e) + swell

  // The film loops the current scene: scroll position, plus any cuts.
  const current = ((Math.min(SCENES - 1, Math.floor(p * SCENES)) + scene) % SCENES + SCENES) % SCENES
  if (video && video.readyState >= 2) {
    const start = current * SCENE_SECONDS
    if (current !== shownScene || video.currentTime < start || video.currentTime > start + SCENE_SECONDS - 0.1) {
      video.currentTime = start
      shownScene = current
    }
    if (videoFresh || !('requestVideoFrameCallback' in video)) {
      lens!.setVideoFrame(video)
      videoFresh = false
    }
    lensOn = Math.min(1, lensOn + dt * 1.2)
  }

  const f = p * (frames.length - 1)
  const a = nearestLoaded(Math.min(Math.floor(f), frames.length - 2))
  const b = images[a + 1] ? a + 1 : a
  if (images[a]) lens!.setSky(images[a]!, images[b]!)
  drawName(now, Math.min(devicePixelRatio, 2))
  lens!.render({
    mix: b > a ? Math.min(1, f - a) : 0,
    lens: { x: lensX, y: lensY, r },
    stretch: 1 + Math.min(0.9, Math.abs(velocity) * 0.25),
    t,
    on: lensOn,
  })

  const c = cursor.value
  if (c) {
    const m = mouse ?? pointer
    // A snapped link already carries the block's padding.
    const pad = linkEls[near]?.classList.contains('on') ? 0 : 14
    const box = rect
      ? { x: rect.x - pad, y: rect.y, w: rect.width + pad * 2, h: rect.height }
      : { x: m?.x ?? 0, y: m?.y ?? 0, w: 0, h: 0 }
    const blob = 100 - 100 * e
    c.style.opacity = mouse && mouse.y > 64 ? String(1 - Math.max(0, (e - 0.75) / 0.25)) : '0'
    c.style.transform = `translate(${(m?.x ?? 0) - 8 + (box.x - (m?.x ?? 0) + 8) * e}px, ${(m?.y ?? 0) - 8 + (box.y - (m?.y ?? 0) + 8) * e}px)`
    c.style.width = `${16 + (box.w - 16) * e}px`
    c.style.height = `${16 + (box.h - 16) * e}px`
    c.style.borderRadius = `${0.58 * blob}% ${0.42 * blob}% ${0.55 * blob}% ${0.45 * blob}% / ${0.45 * blob}% ${0.55 * blob}% ${0.45 * blob}% ${0.55 * blob}%`
    linkEls.forEach((el, i) => el?.classList.toggle('on', i === near && e > 0.6))
  }
}

onMounted(async () => {
  window.scrollTo(0, 0)
  window.addEventListener('scroll', onScroll, { passive: true })
  nameAt = performance.now()
  nameTimer = window.setInterval(nextName, 3200)
  preload()

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  // Set up WebGL only after the plain sky and name have painted: compiling the
  // shader on a first visit would otherwise hold up the first frame.
  await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve)))
  if (!active) return
  lens = createLens(canvas.value!)
  if (!lens) return
  resize()
  window.addEventListener('resize', resize)
  lensX = window.innerWidth * 0.3
  lensY = window.innerHeight / 2

  // The film starts once the page has painted; until then the lens stays shut.
  video = document.createElement('video')
  video.muted = true
  video.playsInline = true
  video.preload = 'auto'
  if ('requestVideoFrameCallback' in video) {
    const onFrame = () => {
      videoFresh = true
      video?.requestVideoFrameCallback(onFrame)
    }
    video.requestVideoFrameCallback(onFrame)
  }
  // With Save-Data on, the 2 MB film stays unloaded and the lens stays shut.
  if (!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) {
    setTimeout(() => {
      if (!video) return
      video.src = reelUrl
      video.play().catch(() => {})
    }, 300)
  }

  if (phone) {
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
  } else {
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerout', onPointerOut)
  }
  document.addEventListener('visibilitychange', onVisibility)

  await document.fonts.load(`300 100px "Helvetica Neue"`).catch(() => {})
  if (!active) return
  live.value = true
  raf = requestAnimationFrame(tick)
})

const onVisibility = () => {
  if (document.hidden) video?.pause()
  else video?.play().catch(() => {})
}

onBeforeUnmount(() => {
  active = false
  cancelAnimationFrame(raf)
  clearInterval(nameTimer)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', resize)
  window.removeEventListener('touchstart', onTouchStart)
  window.removeEventListener('touchend', onTouchEnd)
  window.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('pointerout', onPointerOut)
  document.removeEventListener('visibilitychange', onVisibility)
  if (video) {
    video.pause()
    video.removeAttribute('src')
    video.load()
  }
  lens?.dispose()
})
</script>

<style scoped>
.hi {
  height: 500vh;
}

.hi-sky,
.hi-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
}

.hi-sky {
  object-fit: cover;
  filter: brightness(1.35);
}

.hi-canvas {
  z-index: 2;
  opacity: 0;
  transition: opacity 0.8s ease;
}

.hi-canvas.live {
  opacity: 1;
}

.cursorless,
.cursorless a {
  cursor: none;
}

.hi-name {
  position: fixed;
  top: 50%;
  left: 0;
  right: 0;
  z-index: 1;
  margin: 0;
  transform: translateY(-50%);
  text-align: center;
  font-size: min(150px, 10.4vw);
  font-weight: 300;
  letter-spacing: -2px;
  line-height: 1;
  white-space: nowrap;
  animation: hi-name-in 1.1s cubic-bezier(0.2, 0.7, 0.1, 1) both;
}

@keyframes hi-name-in {
  from {
    opacity: 0;
    filter: blur(16px);
    transform: translateY(-38%);
  }
}

.hi-below {
  position: fixed;
  left: 16px;
  right: 16px;
  top: calc(50% + min(110px, 7.6vw));
  z-index: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
}


.hi-links {
  display: flex;
  gap: 36px;
  font-size: 17px;
  letter-spacing: 0.02em;
  opacity: 0;
  visibility: hidden;
  transform: translateY(12px);
  transition: opacity 0.5s, transform 0.5s, visibility 0.5s;
}

.hi-links.shown {
  opacity: 1;
  visibility: visible;
  transform: none;
}

.hi-links a {
  position: relative;
  z-index: 1;
  min-height: 44px;
  display: flex;
  align-items: center;
  padding: 8px 2px 6px;
  color: #FEFEFE;
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  pointer-events: auto;
  transition: color 0.2s, border-color 0.2s, background-color 0.2s;
}

/* A snapped link shows its own yellow block, as the cursor that drew it fades. */
.hi-links a.on,
.hi-links:not(.cursorless) a:hover {
  margin: 0 -14px;
  padding: 8px 16px 6px;
  color: #0a0a0a;
  background: #FDDA3A;
  border-color: transparent;
}

.hi-place {
  position: fixed;
  left: 32px;
  bottom: 28px;
  z-index: 3;
  font-size: 12px;
  line-height: 1.6;
  letter-spacing: 0.06em;
  color: #BDBDBD;
  text-decoration: none;
}


/* Under the links, so a link's text shows on the yellow block it snaps to. */
.hi-cursor {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 3;
  width: 16px;
  height: 16px;
  background: #FDDA3A;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
  will-change: transform;
}

@media (max-width: 760px) {
  .hi-name {
    font-size: 16.4vw;
    letter-spacing: -1px;
  }

  .hi-below {
    top: calc(50% + 14vw);
  }


  .hi-links {
    gap: 26px;
    font-size: 16px;
  }

  .hi-place {
    left: 16px;
    bottom: 22px;
    font-size: 11px;
  }

}
</style>
