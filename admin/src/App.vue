<template>
  <div id="app">
    <nav class="navbar">
      <div class="navbar-content">
        <h1 class="navbar-title">Control Room</h1>
        <div class="navbar-links">
          <router-link to="/" class="home-button" title="Dashboard">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </router-link>
        </div>
      </div>
    </nav>
    
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <Toast 
      :message="toastMessage" 
      :type="toastType" 
      :duration="toastDuration"
    />
  </div>
</template>

<script setup lang="ts">
import { defineOptions } from 'vue'
import Toast from './components/Toast.vue'
import { useToast } from './composables/useToast'

defineOptions({
  name: 'App'
})

const { toastMessage, toastType, toastDuration } = useToast()
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #0a0a0a;
  color: #ffffff;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background: #1a1a1a;
  border-bottom: 1px solid #333;
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #FFD738;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s;
  font-weight: 500;
}

.nav-link:hover {
  background: #2a2a2a;
  color: #FFD738;
}

.nav-link.router-link-active {
  background: #2a2a2a;
  color: #FFD738;
}

.home-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #2a2a2a;
  color: #fff;
  text-decoration: none;
  transition: all 0.2s ease;
}

.home-button:hover {
  background: #3a3a3a;
  color: #FFD738;
  transform: translateY(-2px);
}

.home-button.router-link-active {
  background: #FFD738;
  color: #0a0a0a;
}

.home-button svg {
  display: block;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}

button {
  background: #FFD738;
  color: #0a0a0a;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

button:hover {
  background: #ffed4e;
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

button.secondary {
  background: #2a2a2a;
  color: #fff;
}

button.secondary:hover {
  background: #3a3a3a;
}

button.danger {
  background: #dc3545;
  color: #fff;
}

button.danger:hover {
  background: #c82333;
}

input, textarea {
  background: #1a1a1a;
  border: 1px solid #333;
  color: #fff;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #FFD738;
}

input[type="checkbox"] {
  width: auto;
  cursor: pointer;
}

/* Page transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

