<template>
  <div class="room">
    <div ref="stage" class="stage" @pointermove="move" @pointerdown="press" @pointerup="release"
      @pointerleave="release" @dblclick="zoomed = !zoomed"></div>
    <div class="vignette" aria-hidden="true"></div>

    <div class="hud">
      <button type="button" class="hud-btn" aria-label="Previous photo" @click="go(index - 1)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          aria-hidden="true">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>
      <div ref="strip" class="strip">
        <button v-for="(photo, i) in photos" :key="photo.url" type="button" class="thumb"
          :class="{ current: i === index }" :aria-label="`Photo ${i + 1}`" @click="go(i)">
          <img :src="photo.thumbnail" alt="" loading="lazy">
        </button>
      </div>
      <button type="button" class="hud-btn" aria-label="Next photo" @click="go(index + 1)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          aria-hidden="true">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
      <button type="button" class="hud-btn" :class="{ on: zoomed }" aria-label="Hold to zoom" :aria-pressed="zoomed"
        @pointerdown="zoomed = true" @pointerup="zoomed = false" @pointerleave="zoomed = false">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          aria-hidden="true">
          <circle cx="11" cy="11" r="6" />
          <path d="M20 20l-4.5-4.5M11 8v6M8 11h6" />
        </svg>
      </button>
    </div>
    <p class="hint">{{ $t(touch ? "message.room_hint_touch" : "message.room_hint") }}</p>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { t } from '../../i18n'
import { createRoom, type RoomPhoto } from './scene'

const props = defineProps<{ photos: RoomPhoto[] }>()

const stage = ref<HTMLElement | null>(null)
const strip = ref<HTMLElement | null>(null)
const index = ref(0)
const zoomed = ref(false)
const touch = window.matchMedia('(pointer: coarse)').matches
let room: ReturnType<typeof createRoom> | null = null

const go = (i: number) => {
  if (!props.photos.length) return
  index.value = (i + props.photos.length) % props.photos.length
}

const show = () => {
  const photo = props.photos[index.value]
  if (room && photo) room.show(photo, index.value, props.photos.length)
  nextTick(() => strip.value?.querySelector('.current')
    ?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }))
}

// The visitor steps around with the pointer (mouse hover, or a finger drag on touch).
let dragging = false
const move = (e: PointerEvent) => {
  if (e.pointerType !== 'mouse' && !dragging) return
  const rect = stage.value!.getBoundingClientRect()
  room?.setPointer(((e.clientX - rect.left) / rect.width) * 2 - 1, -(((e.clientY - rect.top) / rect.height) * 2 - 1))
}
const press = (e: PointerEvent) => {
  dragging = true
  move(e)
}
const release = () => {
  dragging = false
  room?.setPointer(0, 0)
}

// ← → browse; hold Tab to zoom, as in the Unity original.
const onKey = (e: KeyboardEvent) => {
  if (e.target instanceof HTMLInputElement || e.metaKey || e.ctrlKey) return
  if (e.type === 'keyup' && e.key !== 'Tab') return
  if (e.key === 'ArrowLeft') go(index.value - 1)
  else if (e.key === 'ArrowRight') go(index.value + 1)
  else if (e.key === 'Tab') {
    e.preventDefault()
    zoomed.value = e.type === 'keydown'
  }
}

watch(index, show)
watch(zoomed, on => room?.setZoom(on))
watch(() => props.photos, () => (index.value = 0, show()))

onMounted(() => {
  room = createRoom(stage.value!, { mobile: touch, developing: t('message.room_developing') })
  window.addEventListener('keydown', onKey)
  window.addEventListener('keyup', onKey)
  show()
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('keyup', onKey)
  room?.dispose()
})
</script>

<style scoped>
.room {
  position: relative;
  height: calc(100vh - 64px);
  overflow: hidden;
  background: #050403;
}

.stage {
  position: absolute;
  inset: 0;
  touch-action: none;
}

.stage :deep(canvas) {
  display: block;
}

.vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse 75% 80% at 50% 45%, transparent 40%, rgba(0, 0, 0, 0.75) 100%);
}

.hud {
  position: absolute;
  inset: auto 0 0;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 32px 28px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.85));
}

.hud-btn {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(8px);
  color: #FEFEFE;
  transition: color 0.3s, border-color 0.3s;
}

.hud-btn:hover,
.hud-btn.on {
  color: #FEE989;
  border-color: #FEE989;
}

.strip {
  flex-grow: 1;
  display: flex;
  gap: 6px;
  padding: 4px 2px;
  overflow-x: auto;
  scrollbar-width: none;
}

.thumb {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  overflow: hidden;
  opacity: 0.55;
  background: #141414;
  transition: opacity 0.2s;
}

.thumb:hover,
.thumb.current {
  opacity: 1;
}

.thumb.current {
  outline: 2px solid #FDDA3A;
  outline-offset: 2px;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hint {
  position: absolute;
  right: 32px;
  bottom: 104px;
  margin: 0;
  font-size: 12px;
  line-height: 1.4;
  font-weight: 400;
  letter-spacing: 0.04em;
  color: #8A8A8A;
  pointer-events: none;
}

@media (max-width: 760px) {
  .hud {
    padding: 14px 12px 22px;
    gap: 8px;
  }

  .thumb {
    width: 48px;
    height: 48px;
  }

  .hint {
    left: 12px;
    right: 12px;
    bottom: 86px;
    text-align: center;
  }
}
</style>
