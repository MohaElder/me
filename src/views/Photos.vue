<template>
  <div class="photos">
    <header class="photos-head">
      <span class="sky">A <span :class="{ blue: !unity }">SKY</span> FULL OF <span :class="{ yellow: !unity }">STARS</span></span>
      <label class="toggle">
        <input v-model="unity" type="checkbox" aria-label="Show the 3D gallery">
        <span class="toggle-handle">
          <img :src="unity ? pipe : moon" alt="">
        </span>
      </label>
      <span class="pipe">Ceci n'est pas une <span :class="{ yellow: unity }">galerie</span></span>
    </header>

    <iframe v-if="unity" class="unity-frame" src="https://mohaelder.github.io/Gallery/" title="3D gallery"
      allowfullscreen></iframe>

    <div v-else class="layout">
      <aside class="side">
        <div class="side-head">
          <h1>{{ $t("message.photos_title") }}</h1>
          <button class="sort" type="button" @click="newestFirst = !newestFirst">
            {{ shown.length.toLocaleString() }} / {{ total.toLocaleString() }} ·
            {{ $t(newestFirst ? "message.photos_newest" : "message.photos_oldest") }}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              aria-hidden="true">
              <path d="M7 4v16M3 16l4 4 4-4M17 20V4M13 8l4-4 4 4" />
            </svg>
          </button>
        </div>
        <nav class="filters" aria-label="Filter photos">
          <button v-for="tag in tagList" :key="tag.name" type="button" :class="{ active: tag.name === activeTag }"
            @click="activeTag = tag.name">
            <span>{{ tag.label }}</span><span class="n">{{ tag.count }}</span>
          </button>
        </nav>
      </aside>

      <div class="grid">
        <button v-for="(photo, i) in page" :key="photo.url" type="button" class="tile"
          :class="{ ready: loaded.has(photo.url) }" @click="openAt(i)">
          <img :src="photo.thumbnail" alt="" loading="lazy" @load="loaded.add(photo.url)"
            @error="failed.add(photo.url)">
          <span class="cap">{{ photo.Tags.join(" · ") }}</span>
        </button>
        <span v-for="n in skeletons" :key="`skeleton-${n}`" class="tile" aria-hidden="true"></span>
        <div ref="sentinel" class="sentinel"></div>
      </div>
    </div>

    <Transition name="fade">
      <button v-if="showTop" type="button" class="to-top" :aria-label="$t('message.photos_top')"
        @click="scrollToTop">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          aria-hidden="true">
          <path d="M12 19V5M6 11l6-6 6 6" />
        </svg>
      </button>
    </Transition>

    <dialog ref="viewer" class="viewer" @close="current = null" @click.self="viewer?.close()"
      @keydown.left="step(-1)" @keydown.right="step(1)">
      <template v-if="current">
        <!-- Darkroom: the thumbnail shows as a negative, the enlarger flashes, and the
             print develops from white paper; the full photo fades in once it arrives. -->
        <div :key="current.url" class="darkroom" :class="{ done: fullReady }"
          :style="{ '--ar': current.w / current.h }">
          <img class="negative" :src="current.thumbnail" alt="">
          <img class="print" :src="current.thumbnail" alt="">
          <img class="full" :src="current.url" alt="" @load="fullLoaded = true">
          <span class="safelight" aria-hidden="true"></span>
        </div>
        <div class="viewer-bar">
          <span class="meta">{{ meta(current) }}</span>
          <div class="viewer-actions">
            <button type="button" class="icon-btn" aria-label="Previous photo" @click="step(-1)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                aria-hidden="true">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <button type="button" class="icon-btn" aria-label="Next photo" @click="step(1)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                aria-hidden="true">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
            <button type="button" class="btn" @click="showUsage = !showUsage">{{ $t("message.photos_download") }}</button>
            <button type="button" class="icon-btn" aria-label="Close" @click="viewer?.close()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>
        <div v-if="showUsage" class="usage">
          <strong>{{ $t("message.using_my_photo") }}</strong>
          <p>{{ $t("message.photo_usage_note") }}</p>
          <div class="usage-actions">
            <a class="btn" :href="current.url" target="_blank" rel="noopener">{{ $t("message.download_picture") }}</a>
            <a
              href="mailto:calen0909@hotmail.com?subject=Photo Commercial Usage Request&body=(Thank you for showing interest in my photo! Please address your usage and attach the photo that you want to use)">
              {{ $t("message.commercial") }}</a>
          </div>
        </div>
      </template>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import moon from '../assets/moon.svg'
import pipe from '../assets/pipe.svg'

interface Photo {
  url: string
  thumbnail: string
  w: number // thumbnail size, recorded by helpers/init.py
  h: number
  DateTime?: number
  Tags: string[]
  Camera?: string
}

// Only this page uses La Belle Aurore, so it loads here instead of on every page.
if (!document.getElementById('font-la-belle-aurore')) {
  document.head.append(Object.assign(document.createElement('link'), {
    id: 'font-la-belle-aurore',
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=La+Belle+Aurore&display=swap',
  }))
}

const PAGE = 48
const DEVELOP_MS = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 2600
const { t } = useI18n()

const photos = ref<Photo[]>([])
const catalogLoaded = ref(false)
const activeTag = ref('')
const newestFirst = ref(true)
const limit = ref(PAGE)
const loaded = reactive(new Set<string>())
const failed = reactive(new Set<string>())
const unity = ref(false)

const total = computed(() => photos.value.length)
const shown = computed(() => {
  const list = photos.value.filter(p =>
    !failed.has(p.url) && (!activeTag.value || p.Tags.includes(activeTag.value)))
  return newestFirst.value ? list : [...list].reverse()
})
const page = computed(() => shown.value.slice(0, limit.value))
// A row of shimmering tiles while the catalogue or the next page is on its way.
const skeletons = computed(() => !catalogLoaded.value ? 15 : limit.value < shown.value.length ? 5 : 0)

const tagList = computed(() => {
  const counts = new Map<string, number>()
  photos.value.forEach(p => p.Tags.forEach(tag => counts.set(tag, (counts.get(tag) ?? 0) + 1)))
  const tags = [...counts].sort(([a], [b]) => a.localeCompare(b))
    .map(([name, count]) => ({ name, label: name, count: count.toLocaleString() }))
  return [{ name: '', label: t('message.photos_all'), count: total.value.toLocaleString() }, ...tags]
})

watch([activeTag, newestFirst], () => {
  limit.value = PAGE
  window.scrollTo({ top: 0 })
})

// Infinite scroll: load the next page when the sentinel below the grid comes
// within 800px of the viewport, and keep going while it is still that close.
const sentinel = ref<HTMLElement | null>(null)
const nearSentinel = () => (sentinel.value?.getBoundingClientRect().top ?? Infinity) < window.innerHeight + 800
const loadMore = () => {
  if (limit.value < shown.value.length) limit.value += PAGE
}
const observer = new IntersectionObserver(entries => {
  if (entries.some(e => e.isIntersecting)) loadMore()
}, { rootMargin: '800px' })
watch(sentinel, (el, old) => {
  if (old) observer.unobserve(old)
  if (el) observer.observe(el)
})
watch([limit, catalogLoaded], () => nextTick(() => {
  if (nearSentinel()) loadMore()
}))

// Viewer
const viewer = ref<HTMLDialogElement | null>(null)
const current = ref<Photo | null>(null)
const showUsage = ref(false)
const fullLoaded = ref(false)
const developed = ref(false)
// Swap in the full photo only after the print has finished developing.
const fullReady = computed(() => fullLoaded.value && developed.value)
let index = 0
let developTimer = 0

const show = (photo: Photo) => {
  current.value = photo
  showUsage.value = false
  fullLoaded.value = false
  developed.value = false
  clearTimeout(developTimer)
  developTimer = window.setTimeout(() => (developed.value = true), DEVELOP_MS)
}

const openAt = (i: number) => {
  index = i
  show(page.value[i])
  viewer.value?.showModal()
}

const step = (d: number) => {
  index = (index + d + shown.value.length) % shown.value.length
  show(shown.value[index])
}

const meta = (p: Photo) => [
  p.Tags.join(' · '),
  p.Camera,
  p.DateTime && new Date(p.DateTime * 1000).toLocaleDateString(),
].filter(Boolean).join(' — ')

// Back to top, offered once the visitor is well down the grid.
const showTop = ref(false)
const onScroll = () => (showTop.value = window.scrollY > window.innerHeight * 1.5)
const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

// The 3D gallery takes the whole page, footer included.
watch(unity, on => document.body.classList.toggle('unity-active', on))

onMounted(async () => {
  window.scrollTo(0, 0)
  window.addEventListener('scroll', onScroll, { passive: true })
  // Loaded on demand so the catalogue stays out of the page's JavaScript.
  const { images } = await import('../utils/imageLink.json')
  photos.value = (Object.values(images) as Photo[]).sort((a, b) => (b.DateTime ?? 0) - (a.DateTime ?? 0))
  catalogLoaded.value = true
})

onUnmounted(() => {
  observer.disconnect()
  window.removeEventListener('scroll', onScroll)
  clearTimeout(developTimer)
  document.body.classList.remove('unity-active')
})
</script>

<style scoped>
.photos {
  --accent: #FDDA3A;
  max-width: 1440px;
  margin: 0 auto;
  padding: 48px 32px 120px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  color: #FEFEFE;
}

button {
  font: inherit;
  color: inherit;
  cursor: pointer;
  text-align: left;
}

.photos a {
  color: inherit;
}

/* Header */
.photos-head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
}

.sky {
  font-size: 18px;
  letter-spacing: 2.5px;
}

.sky span,
.pipe span {
  transition: color 0.2s ease;
}

.blue {
  color: #6987B2;
}

.yellow {
  color: var(--accent);
}

.pipe {
  font-family: 'La Belle Aurore', cursive;
  font-size: 28px;
}

.toggle {
  position: relative;
  width: 64px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 36px;
  background: #385886;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.toggle:has(input:checked) {
  background: #FEFEFE;
}

.toggle:has(input:focus-visible) {
  outline: 2px solid #FEE989;
  outline-offset: 2px;
}

.toggle input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.toggle-handle {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 28px;
  height: 28px;
  transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.toggle:has(input:checked) .toggle-handle {
  transform: translateX(28px);
}

.toggle-handle img {
  width: 100%;
  height: 100%;
}

.unity-frame {
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 0;
}

:global(body.unity-active .site-footer) {
  display: none;
}

/* Filters + grid on the site's 12-column grid */
.layout {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: 24px;
  align-items: start;
}

.side {
  grid-column: 1 / span 2;
  position: sticky;
  top: 88px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.side-head {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.side-head h1 {
  margin: 0;
  padding: 0;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.5px;
  text-transform: uppercase;
}

.sort {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #8A8A8A;
}

.sort:hover,
.filters button:hover {
  color: #FEE989;
}

.filters {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 15px;
}

.filters button {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: #CFCFCF;
}

.filters button.active {
  color: var(--accent);
}

.filters .n {
  color: #6F6F6F;
}

.grid {
  grid-column: 3 / span 10;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 4px;
}

.tile {
  position: relative;
  display: block;
  aspect-ratio: 1;
  overflow: hidden;
  background: #141414;
}

/* Shimmer until the photo has loaded. */
.tile::before {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.07), transparent);
  animation: shimmer 1.4s infinite;
}

.tile.ready::before {
  content: none;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

.tile img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.5s ease, transform 0.4s ease;
}

.tile.ready img {
  opacity: 1;
}

.tile.ready:hover img {
  transform: scale(1.03);
}

.cap {
  position: absolute;
  inset: auto 0 0;
  padding: 24px 10px 8px;
  font-size: 12px;
  letter-spacing: 0.04em;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.75));
  opacity: 0;
  transition: opacity 0.25s;
}

.tile:hover .cap,
.tile:focus-visible .cap {
  opacity: 1;
}

.tile:focus-visible {
  outline: 2px solid #FEE989;
  outline-offset: 2px;
}

.sentinel {
  grid-column: 1 / -1;
  height: 1px;
}

.to-top {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 5;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  color: #FEFEFE;
  transition: color 0.3s, border-color 0.3s;
}

.to-top:hover {
  color: #FEE989;
  border-color: #FEE989;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Viewer */
.viewer {
  width: 100vw;
  max-width: none;
  height: 100vh;
  max-height: none;
  margin: 0;
  padding: 32px;
  border: 0;
  background: rgba(0, 0, 0, 0.94);
  color: #FEFEFE;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.viewer[open] {
  display: flex;
}

.viewer::backdrop {
  background: rgba(0, 0, 0, 0.6);
}

/* Darkroom: sized from the photo's aspect ratio so nothing jumps.
   0–0.8s negative · 0.8–1s enlarger flash · 1–2.6s print develops under the safelight. */
.darkroom {
  position: relative;
  height: min(78vh, calc((100vw - 64px) / var(--ar)));
  aspect-ratio: var(--ar);
  overflow: hidden;
  background: #F4F1EA;
}

.darkroom img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* A colour negative: inverted, with film's orange base. */
.negative {
  filter: invert(1) sepia(0.45) saturate(1.6) hue-rotate(-12deg) brightness(0.9);
  animation: negative 1s ease forwards;
}

@keyframes negative {
  0% { opacity: 0; transform: scale(1.04); }
  15%, 75% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1); }
}

/* Developing: the image rises out of white paper. */
.print {
  opacity: 0;
  animation: develop 1.6s cubic-bezier(0.3, 0, 0.2, 1) 1s forwards;
}

@keyframes develop {
  0% { opacity: 1; filter: brightness(2.6) contrast(0.2) saturate(0); }
  60% { filter: brightness(1.25) contrast(0.8) saturate(0.6); }
  100% { opacity: 1; filter: none; }
}

/* The red safelight, plus the enlarger's flash on top of it. */
.safelight {
  position: absolute;
  inset: 0;
  pointer-events: none;
  mix-blend-mode: multiply;
  background: rgba(255, 70, 40, 0.38);
  animation: safelight 2.6s ease forwards;
}

.safelight::after {
  content: '';
  position: absolute;
  inset: 0;
  background: #FFF;
  opacity: 0;
  mix-blend-mode: normal;
  animation: enlarger 0.35s ease-out 0.75s;
}

@keyframes safelight {
  85% { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes enlarger {
  40% { opacity: 0.9; }
}

.full {
  opacity: 0;
  transition: opacity 0.6s ease;
}

.darkroom.done .full {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .negative,
  .safelight {
    display: none;
  }

  .print {
    animation: none;
    opacity: 1;
  }
}

.viewer-bar,
.usage {
  width: 100%;
  max-width: 900px;
}

.viewer-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 14px;
  color: #A8A8A8;
}

.viewer-actions {
  display: flex;
  gap: 10px;
}

.icon-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #FEFEFE;
}

.btn {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 18px;
  border: 1px solid currentColor;
  color: var(--accent);
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
}

.icon-btn:hover,
.btn:hover {
  color: #FEE989;
}

.usage {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 14px;
  color: #CFCFCF;
}

.usage p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 400;
}

.usage-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

@media (max-width: 900px) {
  .photos {
    padding: 32px 16px 100px;
  }

  .side,
  .grid {
    grid-column: 1 / -1;
  }

  .side {
    position: static;
    margin-bottom: 20px;
  }

  .filters {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px 18px;
  }

  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
