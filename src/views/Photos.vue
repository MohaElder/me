<template>
  <div class="photos" :class="{ 'room-mode': room }">
    <header class="photos-head">
      <div class="title">
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
      <div class="view-switch" role="group" :aria-label="$t('message.photos_view')">
        <button type="button" :aria-pressed="!room" @click="room = false">{{ $t("message.photos_grid") }}</button>
        <button type="button" :aria-pressed="room" @click="room = true">{{ $t("message.photos_room") }}</button>
      </div>
    </header>

    <PhotoRoom v-if="room" :photos="shown" />

    <template v-else>
      <section v-if="series.length" class="series" :aria-label="$t('message.series')">
        <span class="group">{{ $t("message.series") }}</span>
        <div class="series-row">
          <RouterLink v-for="s in series" :key="s.id" class="series-card" :to="{ name: 'Series', params: { id: s.id } }">
            <img :src="thumbUrl({ file: s.photos[0] })" :alt="s.title">
            <span class="series-label">
              <span class="series-title">{{ s.title }}</span>
              <span>{{ s.photos.length }} {{ $t("message.series_photos") }}</span>
            </span>
          </RouterLink>
        </div>
      </section>

      <div class="layout">
        <aside class="side">
          <nav class="filters" :aria-label="$t('message.photos_category')">
            <span class="group">{{ $t("message.photos_category") }}</span>
            <button v-for="c in categoryList" :key="c.name" type="button" :class="{ active: c.name === category }"
              @click="category = c.name">
              <span>{{ c.label }}</span><span class="n">{{ c.count }}</span>
            </button>
          </nav>
        </aside>

        <div class="grid">
          <button v-for="(photo, i) in page" :key="photo.file" type="button" class="tile"
            :class="{ ready: loaded.has(photo.file) }" @click="openAt(i)">
            <img :src="thumbUrl(photo)" :alt="describe(photo)" loading="lazy" @load="loaded.add(photo.file)"
              @error="failed.add(photo.file)">
            <span class="cap">{{ caption(photo) }}</span>
          </button>
          <span v-for="n in skeletons" :key="`skeleton-${n}`" class="tile" aria-hidden="true"></span>
          <div ref="sentinel" class="sentinel"></div>
        </div>
      </div>
    </template>

    <Transition name="fade">
      <button v-if="showTop" type="button" class="to-top" :aria-label="$t('message.photos_top')"
        @click="scrollToTop">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          aria-hidden="true">
          <path d="M12 19V5M6 11l6-6 6 6" />
        </svg>
      </button>
    </Transition>

    <PhotoViewer ref="viewer" :photos="shown" />
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { t } from '../i18n'
import { caption, categories, describe, thumbUrl, type Photo, type Series } from '../photos'
import PhotoViewer from '../components/PhotoViewer.vue'
import allSeries from '../content/series.json'

// Three.js only loads when someone opens Room.
const PhotoRoom = defineAsyncComponent(() => import('../components/room/PhotoRoom.vue'))

const PAGE = 48

const series = (allSeries as Series[]).filter(s => s.photos.length)

const photos = ref<Photo[]>([])
const catalogLoaded = ref(false)
const category = ref('')
const newestFirst = ref(true)
const limit = ref(PAGE)
const loaded = reactive(new Set<string>())
const failed = reactive(new Set<string>())
const room = ref(false)

const total = computed(() => photos.value.length)
const shown = computed(() => {
  const list = photos.value.filter(p => !failed.has(p.file) && (!category.value || p.category === category.value))
  return newestFirst.value ? list : [...list].reverse()
})
const page = computed(() => shown.value.slice(0, limit.value))
// A row of shimmering tiles while the catalogue or the next page is on its way.
const skeletons = computed(() => !catalogLoaded.value ? 15 : limit.value < shown.value.length ? 5 : 0)

const categoryList = computed(() => {
  const counts = new Map<string, number>()
  photos.value.forEach(p => p.category && counts.set(p.category, (counts.get(p.category) ?? 0) + 1))
  return [
    { name: '', label: t('message.photos_all'), count: total.value.toLocaleString() },
    ...categories.filter(c => counts.has(c))
      .map(c => ({ name: c, label: t(`message.categories.${c}`), count: counts.get(c)!.toLocaleString() })),
  ]
})

watch([category, newestFirst], () => {
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


// Back to top, offered once the visitor is well down the grid.
const showTop = ref(false)
const onScroll = () => (showTop.value = window.scrollY > window.innerHeight * 1.5)
const viewer = ref<InstanceType<typeof PhotoViewer> | null>(null)
const openAt = (i: number) => viewer.value?.open(i)

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

// Room takes the whole page, footer included.
watch(room, on => {
  document.body.classList.toggle('room-active', on)
  window.scrollTo({ top: 0 })
})

onMounted(async () => {
  window.scrollTo(0, 0)
  window.addEventListener('scroll', onScroll, { passive: true })
  // Loaded on demand so the catalogue stays out of the page's JavaScript.
  photos.value = (await import('../content/photos.json')).default as Photo[]
  catalogLoaded.value = true
})

onUnmounted(() => {
  observer.disconnect()
  window.removeEventListener('scroll', onScroll)
  document.body.classList.remove('room-active')
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

/* Header: title, count/sort and the Grid | Room switch */
.photos-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.title {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px 16px;
}

.title h1 {
  margin: 0;
  padding: 0;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.5px;
  text-transform: uppercase;
}

.view-switch {
  display: flex;
}

.view-switch button {
  height: 36px;
  padding: 0 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: color 0.3s;
}

.view-switch button + button {
  border-left: none;
}

.view-switch button:hover {
  color: #FEE989;
}

.view-switch button[aria-pressed="true"] {
  background: var(--accent);
  border-color: var(--accent);
  color: #0A0A0A;
}

/* Room fills the page under the site bar; the header floats over it. */
.photos.room-mode {
  max-width: none;
  padding: 0;
  gap: 0;
  position: relative;
}

.room-mode .photos-head {
  position: absolute;
  inset: 0 0 auto;
  z-index: 2;
  padding: 14px 32px 32px;
  background: linear-gradient(rgba(0, 0, 0, 0.85), transparent);
}

:global(body.room-active .site-footer) {
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

.series {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.series-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.series-card {
  position: relative;
  height: 160px;
  overflow: hidden;
  background: #141414;
  text-decoration: none;
}

.series-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s ease;
}

.series-card:hover img {
  transform: scale(1.03);
}

.series-label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  background: linear-gradient(rgba(0, 0, 0, 0) 35%, rgba(0, 0, 0, 0.8));
  font-size: 13px;
  color: #D8D8D8;
}

.series-title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.4px;
  color: #FEFEFE;
  transition: color 0.3s;
}

.series-card:hover .series-title {
  color: #FEE989;
}

.filters button.active {
  color: var(--accent);
}

.filters .n {
  color: #6F6F6F;
}

.group {
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #8A8A8A;
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

  .filters .group {
    width: 100%;
  }

  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
