<template>
  <div>
    <h1 class="blogs-title">
      <span class="text-secondary">{{ $t("message.share") }}</span> /
      <span class="text-primary">{{ $t("message.life") }}</span> /
      <span class="text-accent">{{ $t("message.comments") }}</span>
    </h1>
    <div class="container mt-md">
      <div class="cards">
        <div v-for="(item, key) in items" :key="key" class="cell" :class="{ 'cell-full pl-lg pr-lg': mobile }">
          <button type="button" class="card" :style="{ backgroundColor: item.color }" @click="travel(item.id)">
            <span class="card-img"
              :style="{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)), url('${item.img}')` }">
              <span class="card-title">{{ item.title }}</span>
            </span>
            <span class="card-text" :style="{ color: item.color == '#ffee58' ? 'black' : 'white' }">
              {{ item.brief }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, defineOptions } from 'vue'
import { useRouter } from 'vue-router'
import { blogs } from "../utils/blogLink.js"
import { useDisplay } from '../composables/useDisplay'

defineOptions({
  name: 'Blogs'
})

interface BlogItem {
  color: string
  img: string
  title: string
  brief: string
  id: string
}

const router = useRouter()
const { mobile } = useDisplay()
const items = ref<BlogItem[]>([{
  color: "#1F7087",
  img: "https://cdn.vuetifyjs.com/images/cards/foster.jpg",
  title: "Default Blog",
  brief: "Default Blog",
  id: "a3c8-8992",
}])

const travel = (blogId: string) => {
  router.push({ name: "Blog", query: { id: blogId } })
}

onBeforeMount(() => {
  window.scrollTo(0, 0)
  items.value = Object.entries(blogs).map(([id, blog]) => ({
    ...blog,
    id
  }))
})
</script>

<style>
.blogs-title {
  font-family: "Helvetica Neue";
  font-size: 70px;
  font-weight: 700;
  letter-spacing: -2.8px;
  text-align: center;
  margin-bottom: 40px;
}

/* Two-up cards, sized like the Vuetify cards they replace. */
.cards {
  display: flex;
  flex-wrap: wrap;
  margin: -12px;
}

.cell {
  flex: 0 0 50%;
  max-width: 50%;
  padding: 12px;
}

.cell-full {
  flex-basis: 100%;
  max-width: 100%;
}

.card {
  display: block;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 4px;
  text-align: left;
  box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
}

.card-img {
  height: 300px;
  display: flex;
  align-items: flex-end;
  background-size: cover;
  background-position: center;
}

.card-title {
  display: block;
  overflow: hidden;
  padding: 0.5rem 1rem;
  color: #FFF;
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 2rem;
  letter-spacing: 0.0125em;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.card-text {
  display: block;
  padding: 1rem;
  font-size: 0.875rem;
  line-height: 1.425;
  letter-spacing: 0.0178571429em;
}

@media (max-width: 768px) {
  .blogs-title {
    font-size: 24px;
    letter-spacing: -0.8px;
  }
}
</style>