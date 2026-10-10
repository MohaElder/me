<template>
  <dialog ref="viewer" class="viewer" @close="current = null" @click.self="viewer?.close()"
    @keydown.left="step(-1)" @keydown.right="step(1)">
    <template v-if="current">
      <!-- Darkroom: the thumbnail shows as a negative, the enlarger flashes, and the
           print develops from white paper; the full photo fades in once it arrives. -->
      <div :key="current.file" class="darkroom" :class="{ done: fullReady }"
        :style="{ '--ar': current.w / current.h }">
        <img class="negative" :src="thumbUrl(current)" alt="">
        <img class="print" :src="thumbUrl(current)" alt="">
        <img class="full" :src="photoUrl(current)" :alt="describe(current)" @load="fullLoaded = true">
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
          <a class="btn" :href="photoUrl(current)" target="_blank" rel="noopener">{{ $t("message.download_picture") }}</a>
          <a
            href="mailto:calen0909@hotmail.com?subject=Photo Commercial Usage Request&body=(Thank you for showing interest in my photo! Please address your usage and attach the photo that you want to use)">
            {{ $t("message.commercial") }}</a>
        </div>
      </div>
    </template>
  </dialog>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { caption, describe, photoUrl, thumbUrl, type Photo } from '../photos'

// The darkroom viewer: open(i) shows photos[i]; the arrows step through photos.
const props = defineProps<{ photos: Photo[] }>()

const DEVELOP_MS = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 2600

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

const open = (i: number) => {
  index = i
  show(props.photos[i])
  viewer.value?.showModal()
}

const step = (d: number) => {
  index = (index + d + props.photos.length) % props.photos.length
  show(props.photos[index])
}

const meta = (p: Photo) => [
  caption(p),
  p.camera,
  p.date && new Date(p.date * 1000).toLocaleDateString(),
].filter(Boolean).join(' — ')

onUnmounted(() => clearTimeout(developTimer))
defineExpose({ open })
</script>

<style scoped>
.viewer {
  --accent: #FDDA3A;
}

button {
  font: inherit;
  color: inherit;
  cursor: pointer;
  text-align: left;
}

a {
  color: inherit;
}

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
</style>
