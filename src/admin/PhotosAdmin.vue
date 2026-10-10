<template>
  <div class="photos-admin">
    <main>
      <header class="head">
        <div class="title">
          <h1>{{ review ? 'To review' : 'All photos' }}</h1>
          <span class="muted">{{ review
            ? `${list.length} without a confirmed category`
            : `${list.length.toLocaleString()} photos` }}</span>
        </div>
        <div class="actions">
          <select v-if="!review" v-model="filter" class="field" aria-label="Category">
            <option value="">Any category</option>
            <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
          </select>
          <label class="btn">Add photos
            <input type="file" accept="image/jpeg,image/png,image/webp,image/tiff" multiple hidden @change="add">
          </label>
        </div>
      </header>

      <div v-if="banner" class="banner">
        <span>{{ banner.text }}</span>
        <button v-if="banner.label" type="button" class="btn primary" @click="banner.action">{{ banner.label }}</button>
      </div>

      <div class="grid">
        <button v-for="p in list.slice(0, limit)" :key="p.file" type="button" class="tile"
          :class="{ on: p === selected }" :aria-label="`Select ${p.file}`" @click="selected = p">
          <img :src="thumbUrl(p)" alt="" loading="lazy">
          <span class="tag">
            <span>{{ p.category ?? p.suggestion?.category ?? 'No suggestion' }}</span>
            <span v-if="!p.category && p.suggestion" :class="{ sure: p.suggestion.score >= SURE }">
              {{ Math.round(p.suggestion.score * 100) }}%</span>
          </span>
        </button>
        <button v-if="list.length > limit" type="button" class="btn more" @click="limit += PAGE">Show more</button>
        <p v-if="!list.length" class="muted">{{ review ? 'Nothing to review. Photos you add land here.' : 'No photos.' }}</p>
      </div>
    </main>

    <aside v-if="selected" class="inspector" aria-label="Selected photo">
      <img :src="thumbUrl(selected)" :alt="describe(selected)">
      <p class="muted meta">{{ [selected.camera ?? 'No camera recorded', selected.date && new Date(selected.date * 1000).toLocaleDateString()].filter(Boolean).join(' · ') }}</p>

      <div class="block">
        <span class="label">Category</span>
        <p v-if="!selected.category && selected.suggestion" class="muted">
          CLIP suggests <strong>{{ selected.suggestion.category }}</strong> · {{ Math.round(selected.suggestion.score * 100) }}%</p>
        <div class="cats">
          <button v-for="(c, i) in categories" :key="c" type="button" :aria-pressed="selected.category === c"
            :class="{ suggested: !selected.category && selected.suggestion?.category === c }" :title="`Press ${i + 1}`"
            @click="choose(c)">{{ c }}</button>
        </div>
      </div>

      <label class="block"><span class="label">Place</span>
        <input class="field" list="places" :value="selected.place?.join(' › ') ?? ''" placeholder="Country › City"
          @change="setPlace(($event.target as HTMLInputElement).value)">
        <datalist id="places"><option v-for="p in places" :key="p" :value="p" /></datalist>
      </label>

      <div class="flags">
        <label class="check"><input v-model="selected.film" type="checkbox"> Film</label>
        <label class="check"><input v-model="selected.bw" type="checkbox"> Black and white</label>
        <label class="check"><input v-model="selected.favorite" type="checkbox"> Favorite</label>
        <label class="check"><input v-model="selected.mature" type="checkbox"> 17+</label>
      </div>

      <div v-if="review" class="confirm">
        <button type="button" class="btn primary" :disabled="!selected.suggestion" @click="choose(selected.suggestion!.category)">
          Confirm &amp; next</button>
        <button type="button" class="btn" @click="step(1)">Skip</button>
      </div>
      <p class="muted keys">1–7 pick a category · Enter confirms · ← → move</p>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { categories, describe, thumbUrl, type Category, type Photo } from '../photos'
import { content } from './store'

const props = defineProps<{ review: boolean }>()

const PAGE = 120
const SURE = 0.8 // suggestions this confident are offered for one-click acceptance

const filter = ref('')
const limit = ref(PAGE)
const selected = ref<Photo | null>(null)
const progress = ref('')

// To review: no confirmed category, the surest suggestions first, so they can be
// glanced over together and accepted in one go.
const list = computed(() => props.review
  ? content.photos.filter(p => !p.category).sort((a, b) => (b.suggestion?.score ?? -1) - (a.suggestion?.score ?? -1))
  : content.photos.filter(p => !filter.value || p.category === filter.value))

watch(() => props.review, () => {
  limit.value = PAGE
  selected.value = list.value[0] ?? null
}, { immediate: true })

const places = computed(() => [...new Set(content.photos.flatMap(p => p.place ? [p.place.join(' › ')] : []))].sort())

const setPlace = (value: string) => {
  const place = value.split('›').map(s => s.trim()).filter(Boolean)
  if (place.length) selected.value!.place = place
  else delete selected.value!.place
}

const step = (d: number) => {
  const i = list.value.indexOf(selected.value!)
  selected.value = list.value[Math.min(Math.max(i + d, 0), list.value.length - 1)] ?? null
}

// Sets the category. While reviewing, the photo then leaves the list, so the
// one after it is selected.
const choose = (category: Category) => {
  const photo = selected.value!
  const next = list.value[list.value.indexOf(photo) + 1]
  photo.category = category
  delete photo.suggestion
  if (props.review) selected.value = next ?? list.value[0] ?? null
}

const unsuggested = computed(() => list.value.filter(p => !p.suggestion))
const sure = computed(() => list.value.filter(p => (p.suggestion?.score ?? 0) >= SURE))

async function suggest(photos: Photo[]) {
  progress.value = 'Starting CLIP…'
  const res = await fetch('/__admin/suggest', { method: 'POST', body: JSON.stringify({ files: photos.map(p => p.file) }) })
  const reader = res.body!.pipeThrough(new TextDecoderStream()).getReader()
  let buffer = ''
  for (let chunk = await reader.read(); !chunk.done; chunk = await reader.read()) {
    buffer += chunk.value
    const lines = buffer.split('\n')
    buffer = lines.pop()!
    for (const line of lines) {
      const data = JSON.parse(line)
      if (data.total) progress.value = `Looking at photos… ${data.done} of ${data.total}`
      for (const p of photos) if (data.suggestions?.[p.file]) p.suggestion = data.suggestions[p.file]
    }
  }
  progress.value = ''
}

async function add(event: Event) {
  const input = event.target as HTMLInputElement
  const files = [...input.files!]
  const added: Photo[] = []
  for (const [i, file] of files.entries()) {
    progress.value = `Adding ${file.name} (${i + 1} of ${files.length})…`
    const res = await fetch(`/__admin/photos?name=${encodeURIComponent(file.name)}`, { method: 'POST', body: file })
    const photo: Photo = await res.json()
    // Newest first; photos without a date go on top.
    const at = content.photos.findIndex(p => (p.date ?? 0) < (photo.date ?? Infinity))
    content.photos.splice(at < 0 ? content.photos.length : at, 0, photo)
    added.push(content.photos.find(p => p.file === photo.file)!)
  }
  input.value = ''
  location.hash = 'review'
  if (added.length) await suggest(added)
}

const banner = computed(() => {
  if (progress.value) return { text: progress.value + (progress.value.startsWith('Starting') ? ' The first run downloads the model, about 90 MB.' : '') }
  if (!props.review) return null
  if (unsuggested.value.length) return {
    text: `${unsuggested.value.length} photos don't have a suggestion yet.`,
    label: 'Suggest categories', action: () => suggest(unsuggested.value),
  }
  if (sure.value.length) return {
    text: `CLIP is at least ${SURE * 100}% sure about ${sure.value.length} of these. Glance over them, then accept in one go.`,
    label: `Accept ${sure.value.length} suggestions`,
    action: () => {
      sure.value.forEach(p => { p.category = p.suggestion!.category; delete p.suggestion })
      selected.value = list.value[0] ?? null
    },
  }
  return null
})

const onKey = (e: KeyboardEvent) => {
  if (!selected.value || (e.target as HTMLElement).closest('input, select, textarea') || e.metaKey || e.ctrlKey) return
  const n = Number(e.key)
  if (n >= 1 && n <= categories.length) choose(categories[n - 1])
  else if (e.key === 'Enter' && props.review && selected.value.suggestion) choose(selected.value.suggestion.category)
  else if (e.key === 'ArrowRight') step(1)
  else if (e.key === 'ArrowLeft') step(-1)
  else return
  e.preventDefault()
}
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.photos-admin {
  flex: 1;
  min-width: 0;
  display: flex;
}

main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.head {
  height: 72px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 28px;
  border-bottom: 1px solid #1f1f1f;
}

.title {
  display: flex;
  align-items: baseline;
  gap: 20px;
}

.actions {
  display: flex;
  gap: 8px;
}

.actions .field {
  width: 180px;
}

.banner {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin: 20px 28px 0;
  padding: 12px 16px;
  background: #141414;
  border: 1px solid #262626;
  font-size: 14px;
  color: #D8D8D8;
}

.grid {
  flex: 1;
  overflow-y: auto;
  padding: 20px 28px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: 200px;
  align-content: start;
  gap: 14px;
}

.tile {
  position: relative;
  overflow: hidden;
  background: #141414;
}

.tile.on {
  outline: 2px solid #FDDA3A;
  outline-offset: 3px;
}

.tile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.tag {
  position: absolute;
  inset: auto 0 0;
  display: flex;
  justify-content: space-between;
  padding: 22px 10px 8px;
  background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.85));
  font-size: 13px;
  color: #BDBDBD;
}

.tag span:first-child {
  color: #FEFEFE;
}

.tag .sure {
  color: #FDDA3A;
}

.more {
  grid-column: 1 / -1;
  justify-self: center;
}

.inspector {
  width: 360px;
  flex-shrink: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  box-sizing: border-box;
  background: #000;
  border-left: 1px solid #1f1f1f;
}

.inspector img {
  width: 100%;
  height: 240px;
  object-fit: contain;
  background: #0a0a0a;
  display: block;
}

.meta {
  margin: -8px 0 0;
}

.block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.block p {
  margin: 0;
}

.cats {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.cats button {
  height: 44px;
  padding: 0 14px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  font-size: 14px;
}

.cats button:hover {
  border-color: #FEE989;
  color: #FEE989;
}

.cats button.suggested {
  border-color: #FDDA3A;
  color: #FDDA3A;
}

.cats button[aria-pressed="true"] {
  background: #FDDA3A;
  border-color: #FDDA3A;
  color: #0a0a0a;
}

.flags {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.confirm {
  display: flex;
  gap: 8px;
}

.confirm .primary {
  flex: 1;
  height: 44px;
}

.keys {
  margin: 0;
  font-size: 12px;
}
</style>
