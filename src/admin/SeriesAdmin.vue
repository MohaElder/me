<template>
  <div class="series-admin">
    <section class="list" aria-label="Series">
      <header class="list-head">
        <h1>Series</h1>
        <button type="button" class="btn" @click="addSeries">New series</button>
      </header>
      <div class="items">
        <button v-for="s in content.series" :key="s.id" type="button" class="item" :aria-pressed="selected === s"
          @click="selected = s">
          <span>{{ s.title || 'Untitled' }}</span><span class="muted">{{ s.photos.length }}</span>
        </button>
        <p v-if="!content.series.length" class="muted empty">No series yet.</p>
      </div>
    </section>

    <main v-if="selected" class="editor">
      <div class="fields">
        <label class="wide"><span class="label">Title</span>
          <input v-model="selected.title" class="field title" @blur="nameLink(selected)"></label>
        <label><span class="label">Link</span>
          <span class="link"><span class="muted">/series/</span><input v-model="selected.id" class="field"
              @change="selected.id = slug(selected.id) || selected.id"></span></label>
        <div class="actions">
          <a class="btn" :href="`/series/${selected.id}`" target="_blank">Open page</a>
          <button type="button" class="btn" @click="removeSeries(selected)">Delete series</button>
        </div>
        <label class="wide"><span class="label">Statement</span>
          <textarea v-model="selected.statement" class="field statement" rows="3"
            placeholder="Where and when, and why these photos belong together."></textarea></label>
      </div>

      <div class="sequence">
        <span class="label">Sequence · {{ selected.photos.length }} photos · the first is the cover</span>
        <div class="seq-grid">
          <div v-for="(file, i) in selected.photos" :key="file" class="seq" :class="{ cover: i === 0 }" draggable="true"
            @dragstart="dragging = i" @dragover.prevent @drop="move(dragging, i)">
            <img :src="thumbUrl({ file })" alt="">
            <span class="n">{{ i === 0 ? 'Cover' : i + 1 }}</span>
            <span class="tools">
              <button type="button" aria-label="Move earlier" @click="move(i, i - 1)">‹</button>
              <button type="button" aria-label="Move later" @click="move(i, i + 1)">›</button>
              <button type="button" aria-label="Remove from series" @click="toggle(file)">×</button>
            </span>
          </div>
        </div>
        <p class="muted">{{ selected.photos.length
          ? 'Drag to reorder. Click photos on the right to add or remove them.'
          : 'Click photos on the right to add them.' }}</p>
      </div>
    </main>
    <p v-else class="muted empty">Make a series to start.</p>

    <aside v-if="selected" class="library" aria-label="Library">
      <span class="label">Add from library</span>
      <div class="filters">
        <input v-model="search" class="field" placeholder="File or camera" aria-label="Search photos">
        <select v-model="category" class="field" aria-label="Category">
          <option value="">Any</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      <div class="lib-grid">
        <button v-for="p in library.slice(0, limit)" :key="p.file" type="button" class="lib"
          :aria-pressed="selected.photos.includes(p.file)" :aria-label="`Add or remove ${p.file}`" @click="toggle(p.file)">
          <img :src="thumbUrl(p)" alt="" loading="lazy">
          <span class="badge">{{ selected.photos.includes(p.file) ? selected.photos.indexOf(p.file) + 1 : '+' }}</span>
        </button>
      </div>
      <button v-if="library.length > limit" type="button" class="btn" @click="limit += 90">Show more</button>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { categories, thumbUrl, type Series } from '../photos'
import { content, newId } from './store'

const selected = ref<Series | null>(content.series[0] ?? null)
const search = ref('')
const category = ref('')
const limit = ref(90)
let dragging = -1

const library = computed(() => content.photos.filter(p =>
  (!category.value || p.category === category.value)
  && (!search.value || `${p.file} ${p.camera ?? ''}`.toLowerCase().includes(search.value.toLowerCase()))))
watch([search, category], () => (limit.value = 90))

const slug = (text: string) => text.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-')

// A new series gets a placeholder link; naming it gives it a readable one.
const nameLink = (s: Series) => {
  const base = slug(s.title)
  if (!s.id.startsWith('untitled-') || !base) return
  let id = base
  for (let n = 2; content.series.some(other => other !== s && other.id === id); n++) id = `${base}-${n}`
  s.id = id
}

const addSeries = () => {
  content.series.push({ id: `untitled-${newId()}`, title: '', statement: '', photos: [] })
  selected.value = content.series.at(-1)!
}

const removeSeries = (s: Series) => {
  if (!confirm(`Delete the series “${s.title || 'Untitled'}”? Its photos stay in the library.`)) return
  content.series.splice(content.series.indexOf(s), 1)
  selected.value = content.series[0] ?? null
}

const toggle = (file: string) => {
  const photos = selected.value!.photos
  const i = photos.indexOf(file)
  if (i < 0) photos.push(file)
  else photos.splice(i, 1)
}

const move = (from: number, to: number) => {
  const photos = selected.value!.photos
  if (from < 0 || to < 0 || to >= photos.length || from === to) return
  photos.splice(to, 0, photos.splice(from, 1)[0])
}
</script>

<style scoped>
.series-admin {
  flex: 1;
  min-width: 0;
  display: flex;
}

.list {
  width: 240px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #1f1f1f;
}

.list-head {
  height: 72px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #1f1f1f;
}

.items {
  overflow-y: auto;
  padding: 8px 0;
}

.item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px 16px;
  font-size: 15px;
  color: #D8D8D8;
  text-align: left;
}

.item:hover {
  color: #FEE989;
}

.item[aria-pressed="true"] {
  color: #FDDA3A;
  background: #141414;
}

.empty {
  padding: 16px;
}

.editor {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #1f1f1f;
}

.fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #1f1f1f;
}

.fields label {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.fields .wide {
  grid-column: 1 / -1;
}

.title {
  height: 46px;
  font-size: 18px;
  font-weight: 700;
}

.link {
  display: flex;
  align-items: center;
  gap: 6px;
}

.actions {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 8px;
}

.actions a {
  text-decoration: none;
}

.statement {
  height: auto;
  padding: 10px;
  resize: vertical;
  line-height: 1.5;
}

.sequence {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 20px;
}

.sequence p {
  margin: 0;
}

.seq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-auto-rows: 140px;
  gap: 10px;
}

.seq {
  position: relative;
  background: #141414;
  cursor: grab;
}

.seq.cover {
  outline: 2px solid #FDDA3A;
  outline-offset: 2px;
}

.seq img,
.lib img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.n {
  position: absolute;
  left: 6px;
  top: 6px;
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.75);
  font-size: 12px;
}

.tools {
  position: absolute;
  right: 6px;
  bottom: 6px;
  display: flex;
  gap: 4px;
}

.tools button {
  width: 28px;
  height: 28px;
  background: rgba(0, 0, 0, 0.75);
  font-size: 15px;
}

.tools button:hover {
  color: #FEE989;
}

.library {
  width: 340px;
  flex-shrink: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  box-sizing: border-box;
  background: #000;
}

.filters {
  display: flex;
  gap: 8px;
}

.filters select {
  width: 110px;
}

.lib-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-auto-rows: 96px;
  gap: 6px;
}

.lib {
  position: relative;
  background: #141414;
}

.lib[aria-pressed="true"] {
  outline: 2px solid #FDDA3A;
  outline-offset: 2px;
}

.lib[aria-pressed="true"] img {
  opacity: 0.45;
}

.badge {
  position: absolute;
  right: 4px;
  top: 4px;
  min-width: 20px;
  height: 20px;
  padding: 0 4px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.85);
  color: #0a0a0a;
  font-size: 12px;
  font-weight: 700;
}

.lib[aria-pressed="true"] .badge {
  background: #FDDA3A;
}
</style>
