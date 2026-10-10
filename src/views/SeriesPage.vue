<template>
  <div class="series-page">
    <template v-if="series">
      <aside class="sp-intro">
        <RouterLink :to="{ name: 'Photos' }" class="sp-back">← {{ $t("message.series_all") }}</RouterLink>
        <h1>{{ series.title }}</h1>
        <span class="sp-count">{{ series.photos.length }} {{ $t("message.series_photos") }}</span>
        <p v-if="series.statement" class="sp-statement">{{ series.statement }}</p>
        <p class="sp-hint">{{ $t("message.series_open") }}</p>
      </aside>
      <div class="sp-grid">
        <button v-for="(file, i) in series.photos" :key="file" type="button" class="sp-tile"
          :aria-label="`${series.title}, ${i + 1} / ${series.photos.length}`" @click="viewer?.open(i)">
          <img :src="thumbUrl({ file })" :alt="photos[i] ? describe(photos[i]) : ''" loading="lazy">
        </button>
      </div>
      <PhotoViewer ref="viewer" :photos="photos" />
    </template>
    <p v-else class="sp-missing">
      <RouterLink :to="{ name: 'Photos' }" class="sp-back">← {{ $t("message.series_all") }}</RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import allSeries from '../content/series.json'
import PhotoViewer from '../components/PhotoViewer.vue'
import { describe, thumbUrl, type Photo, type Series } from '../photos'

const route = useRoute()
const series = (allSeries as Series[]).find(s => s.id === route.params.id)
if (series) document.title = `${series.title} · Yasushi Oh`

const viewer = ref<InstanceType<typeof PhotoViewer> | null>(null)
// The grid shows straight away from the file names; the catalogue, for the
// viewer and alt text, loads after.
const photos = ref<Photo[]>([])

onMounted(async () => {
  window.scrollTo(0, 0)
  if (!series) return
  const catalogue = new Map(((await import('../content/photos.json')).default as Photo[]).map(p => [p.file, p]))
  photos.value = series.photos.map(file => catalogue.get(file) ?? { file, w: 1, h: 1 })
})
</script>

<style scoped>
.series-page {
  max-width: 1440px;
  margin: 0 auto;
  padding: 56px 32px 120px;
  display: flex;
  gap: 56px;
  color: #FEFEFE;
}

.sp-intro {
  width: 340px;
  flex-shrink: 0;
  align-self: flex-start;
  position: sticky;
  top: 112px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sp-back {
  font-size: 14px;
  color: #BDBDBD;
  text-decoration: none;
  transition: color 0.3s;
}

.sp-back:hover {
  color: #FEE989;
}

h1 {
  margin: 0;
  padding: 0;
  font-size: 64px;
  font-weight: 700;
  letter-spacing: -2.5px;
  line-height: 1;
}

.sp-count {
  font-size: 13px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #8A8A8A;
}

.sp-statement,
.sp-hint {
  margin: 0;
  font-weight: 400;
}

.sp-statement {
  font-size: 16px;
  line-height: 1.6;
  color: #D8D8D8;
  white-space: pre-line;
}

.sp-hint {
  font-size: 14px;
  color: #8A8A8A;
}

.sp-grid {
  flex: 1;
  min-width: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-auto-rows: 240px;
  gap: 10px;
}

.sp-tile {
  padding: 0;
  border: 0;
  overflow: hidden;
  background: #141414;
  cursor: pointer;
}

.sp-tile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s ease;
}

.sp-tile:hover img {
  transform: scale(1.03);
}

.sp-tile:focus-visible {
  outline: 2px solid #FDDA3A;
  outline-offset: 2px;
}

@media (max-width: 900px) {
  .series-page {
    flex-direction: column;
    gap: 32px;
    padding: 32px 16px 100px;
  }

  .sp-intro {
    width: auto;
    position: static;
  }

  h1 {
    font-size: 44px;
  }

  .sp-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-rows: 160px;
  }
}
</style>
