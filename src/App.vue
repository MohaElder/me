<template>
  <div class="app">
    <header class="app-bar liquid-glass-app-bar">
      <button v-if="mobile" type="button" class="bar-btn" aria-label="Menu" @click="drawer = !drawer">
        <Icon name="menu" />
      </button>
      <nav v-else class="nav">
        <RouterLink v-for="item in nav" :key="item.name" :to="{ name: item.name }" class="app-bar-item"
          :class="{ active: route.name === item.name }">{{ $t(item.label) }}</RouterLink>
      </nav>
      <button type="button" class="bar-btn lang" @click="changeLanguage">中/EN</button>
    </header>

    <Transition name="fade">
      <div v-if="drawer" class="scrim" @click="drawer = false"></div>
    </Transition>
    <nav class="drawer" :class="{ open: drawer }" :inert="!drawer">
      <RouterLink v-for="item in nav" :key="item.name" :to="{ name: item.name }" class="drawer-item"
        :class="{ active: route.name === item.name }">{{ $t(item.label) }}</RouterLink>
    </nav>

    <main class="app-main">
      <router-view />
    </main>

    <footer class="site-footer liquid-glass-footer">
      <p class="text-white pt-0 text-xs">
        Made with
        <vueIcon />, 🧠, and ❤️.
        <a class="link-white" href="https://github.com/MohaElder/me" target="_blank">
          source code
        </a>
        <br>
        {{ new Date().getFullYear() }} —
        <strong class="footer-brand">
          MOHAELDER
        </strong>
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { locale } from './i18n'
import vueIcon from './components/vue-icon.vue'
import Icon from './components/Icon.vue'
import { useDisplay } from './composables/useDisplay'

const nav = [
  { name: 'Hi', label: 'message.nav_hi' },
  { name: 'Work', label: 'message.nav_work' },
  { name: 'Photos', label: 'message.nav_photos' },
  { name: 'Exhibitions', label: 'message.nav_exhibitions' },
  { name: 'OpenSource', label: 'message.nav_open_source' },
  { name: 'IfIDie', label: 'message.nav_if_i_die' },
  { name: 'LetterToFutureAI', label: 'message.nav_to_ai' },
]

const route = useRoute()
const { mobile } = useDisplay()
const drawer = ref(false)

watch(() => route.fullPath, () => (drawer.value = false))

const changeLanguage = () => {
  locale.value = locale.value === "en" ? "zh" : "en"
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #000;
  color: rgba(255, 255, 255, 0.87);
}

.app-bar {
  position: fixed;
  inset: 0 0 auto;
  z-index: 1006;
  height: 66px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav {
  display: flex;
  align-items: center;
}

/* Positioned, as Vuetify's v-main was: the Hi page places its intro relative to it. */
.app-main {
  position: relative;
  flex: 1 0 auto;
  padding-top: 64px;
}

.site-footer {
  display: flex;
  justify-content: center;
  padding: 8px 16px;
  text-align: center;
}

/* Liquid Glass Effect for AppBar */
.liquid-glass-app-bar {
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow:
    0 8px 32px 0 rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  overflow: hidden;
}

.liquid-glass-app-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg,
      rgba(255, 255, 255, 0.08) 0%,
      rgba(255, 255, 255, 0.03) 50%,
      rgba(255, 255, 255, 0.08) 100%);
  z-index: 0;
}

/* Footer: dark glass, kept quiet so it doesn't glow under the page. */
.liquid-glass-footer {
  position: relative;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  overflow: hidden;
}

/* Ensure content stays above the effects */
.liquid-glass-app-bar>*,
.liquid-glass-footer>* {
  position: relative;
  z-index: 2;
}

.app-bar-item {
  padding: 20px;
  color: inherit;
  text-decoration: none;
  transition: color 0.3s;
}

/* A lighter tint of the active color (#FDDA3A) */
.app-bar-item:hover,
.drawer-item:hover,
.bar-btn:hover {
  color: #FEE989;
}

.app-bar-item.active,
.drawer-item.active {
  color: #FDDA3A;
}

.bar-btn {
  height: 36px;
  margin: 0 8px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.09em;
  transition: color 0.3s;
}

.lang {
  margin-left: auto;
}

/* Mobile drawer */
.scrim {
  position: fixed;
  inset: 0;
  z-index: 1004;
  background: rgba(0, 0, 0, 0.32);
}

.drawer {
  position: fixed;
  top: 66px;
  left: 0;
  bottom: 0;
  z-index: 1005;
  width: 256px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  background: #121212;
  transform: translateX(-100%);
  transition: transform 0.2s ease;
}

.drawer.open {
  transform: none;
}

.drawer-item {
  padding: 12px 16px;
  color: inherit;
  text-decoration: none;
  font-size: 15px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.footer-brand {
  font-size: 0.9em;
}
</style>
