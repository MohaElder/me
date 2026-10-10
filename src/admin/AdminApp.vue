<template>
  <div class="admin">
    <aside class="side">
      <div>
        <div class="brand">
          <svg width="22" height="22" viewBox="0 0 100 100" aria-hidden="true">
            <path :d="blob" fill="#FDDA3A" />
          </svg>
          <strong>Admin</strong><span class="local">LOCAL</span>
        </div>
        <nav aria-label="Admin">
          <a href="#photos" :aria-current="section === 'photos' && 'page'">
            Photos <span>{{ content.photos.length.toLocaleString() }}</span></a>
          <a href="#review" class="sub" :aria-current="section === 'review' && 'page'">
            To review <span class="badge">{{ toReview }}</span></a>
          <a href="#stories" :aria-current="section === 'stories' && 'page'">
            People &amp; stories <span>{{ content.people.length }} · {{ content.stories.length }}</span></a>
          <a href="#blog" :aria-current="section === 'blog' && 'page'">
            Blog <span>{{ content.blogs.length }}</span></a>
        </nav>
      </div>
      <p class="status">{{ status }}<br>Commit when ready.</p>
    </aside>
    <PhotosAdmin v-if="section === 'photos' || section === 'review'" :review="section === 'review'" />
    <PeopleAdmin v-else-if="section === 'stories'" />
    <BlogAdmin v-else />
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { content, status } from './store'
import PhotosAdmin from './PhotosAdmin.vue'
import PeopleAdmin from './PeopleAdmin.vue'
import BlogAdmin from './BlogAdmin.vue'

const blob = 'M50 8C62 8 70 2 80 8C92 15 90 30 94 42C99 58 94 76 80 87C66 98 44 98 28 90C12 82 4 66 6 50C8 32 20 18 34 12C40 9 44 8 50 8Z'

const hash = () => location.hash.slice(1) || 'review'
const section = ref(hash())
const onHash = () => (section.value = hash())
window.addEventListener('hashchange', onHash)
onUnmounted(() => window.removeEventListener('hashchange', onHash))

const toReview = computed(() => content.photos.filter(p => !p.category).length)
</script>

<style>
/* Shared by every admin screen. */
body {
  background: #0a0a0a;
  color: #FEFEFE;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.admin {
  height: 100vh;
  display: flex;
  overflow: hidden;
}

.admin button,
.admin input,
.admin select,
.admin textarea {
  font: inherit;
  color: inherit;
}

.admin button {
  cursor: pointer;
}

.admin h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.4px;
}

.admin .muted {
  font-size: 14px;
  color: #A8A8A8;
}

.admin .label {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #8A8A8A;
}

.admin .btn {
  height: 40px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 14px;
  white-space: nowrap;
  transition: color 0.2s, border-color 0.2s;
}

.admin .btn:hover {
  color: #FEE989;
  border-color: #FEE989;
}

.admin .btn.primary {
  background: #FDDA3A;
  border-color: #FDDA3A;
  color: #0a0a0a;
  font-weight: 700;
}

.admin .btn:disabled {
  opacity: 0.4;
  cursor: default;
}

.admin .field {
  width: 100%;
  height: 40px;
  padding: 0 10px;
  box-sizing: border-box;
  background: #141414;
  border: 1px solid #333;
  font-size: 14px;
}

.admin .seg {
  display: flex;
}

.admin .seg button {
  flex: 1;
  height: 40px;
  border: 1px solid #333;
  font-size: 14px;
  color: #BDBDBD;
}

.admin .seg button[aria-pressed="true"] {
  background: #FDDA3A;
  border-color: #FDDA3A;
  color: #0a0a0a;
  font-weight: 700;
}

.admin .check {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #D8D8D8;
}
</style>

<style scoped>
.side {
  width: 232px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #000;
  border-right: 1px solid #1f1f1f;
}

.brand {
  height: 72px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  font-size: 16px;
}

.local {
  font-size: 12px;
  letter-spacing: 0.06em;
  color: #8A8A8A;
}

nav a {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  font-size: 15px;
  color: #BDBDBD;
  text-decoration: none;
}

nav a:hover {
  color: #FEE989;
}

nav a[aria-current="page"] {
  color: #FDDA3A;
  background: #141414;
}

nav a span {
  font-size: 13px;
  color: #8A8A8A;
}

nav a.sub {
  padding-left: 32px;
  font-size: 14px;
}

nav .badge {
  padding: 2px 6px;
  background: #FDDA3A;
  color: #0a0a0a;
}

.status {
  margin: 0;
  padding: 16px;
  font-size: 12px;
  line-height: 1.5;
  color: #8A8A8A;
}
</style>
