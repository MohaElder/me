<template>
  <div class="home-container">
    <div class="animated-image">
      <img :src="frames[frame]" alt="" class="each-image" :style="{ opacity: frame / 30 }">
    </div>

    <!-- :key re-mounts the heading on every name change, which replays the fade. -->
    <h1 :key="activeName" class="foreground home-name"
      :style="{ fontSize: `${width * (mobile ? 0.14 : 0.05)}px`, paddingTop: mobile ? '15%' : '0' }">
      {{ activeName }}
    </h1>

    <div class="intro second text-center" :style="{ opacity: 1 - target / 7, top: mobile ? '11%' : '10.5%' }">
      <img :src="bak" alt="" class="bak" :style="{ width: mobile ? '100%' : '62.5%' }">
      <h3 class="intro-text"
        :style="{ fontSize: mobile ? '50%' : '100%', paddingLeft: mobile ? '0' : '30%', paddingRight: mobile ? '0' : '30%' }">
        {{ $t("message.hello") }}
      </h3>
    </div>

    <div class="below">
      <a style="color: white" href="https://maps.app.goo.gl/f1iggnxxYjswtCLUA">N 36°14.845', W 117°21.295'<br>
        {{ $t("message.wave_location") }}</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useDisplay } from '../composables/useDisplay'
import bak from '../assets/bak.webp'

const { mobile, width } = useDisplay()

// The sky frames ship with the site, ordered by their zero-padded names.
const frames = Object.entries(
  import.meta.glob<string>('../assets/skyFrameWebp/*.webp', { eager: true, query: '?url', import: 'default' })
).sort(([a], [b]) => a.localeCompare(b)).map(([, url]) => url)

const names = ['翁安志', 'お やすし', 'Oh Yasushi']
const activeName = ref(names[0])

// target: where the scroll position says we should be; frame: the closest
// frame at or before it that has already loaded, so the sky never goes blank.
const target = ref(0)
const frame = ref(0)
const loaded: boolean[] = []

const update = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight
  const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0
  target.value = Math.round(progress * (frames.length - 1))
  let i = target.value
  while (i > 0 && !loaded[i]) i--
  frame.value = i
}

let ticking = false
const onScroll = () => {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    update()
    ticking = false
  })
}

// Load frames one at a time, in scroll order, after the page has rendered.
let active = true
const preload = async () => {
  for (const [i, src] of frames.entries()) {
    const img = new Image()
    img.src = src
    await img.decode().catch(() => {})
    if (!active) return
    loaded[i] = true
    update()
  }
}

let nameTimer = 0

onMounted(() => {
  window.scrollTo(0, 0)
  window.addEventListener('scroll', onScroll, { passive: true })
  nameTimer = window.setInterval(() => {
    activeName.value = names[(names.indexOf(activeName.value) + 1) % names.length]
  }, 2500)
  preload()
})

onBeforeUnmount(() => {
  active = false
  window.removeEventListener('scroll', onScroll)
  clearInterval(nameTimer)
})
</script>

<style>
.foreground {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 100%;
  /* bring your own prefixes */
  transform: translate(-50%, -50%);
}

.home-name {
  text-align: center;
  animation: name-fade-in 1s;
}

@keyframes name-fade-in {
  from { opacity: 0; }
}

.animated-image {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.each-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(1.5);
}

.second {
  z-index: 1;
}

.home-container {
  height: 500vh;
}

* {
  box-sizing: border-box;
}

.intro {
  width: 95%;
  margin: 0;
  padding: 12px;
  position: absolute;
  left: 50.5%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
}

.bak {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.intro-text {
  font-weight: 300;
  text-align: center;
  text-indent: 2%;
  line-height: 2;
}

.below {
  position: absolute;
  margin: 0;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  bottom: 3%;
  font-size: 70%;
  font-weight: 300;
  width: 50%;
}
</style>
